import re
import pdfplumber
import pandas as pd
from pathlib import Path

CODE_LINE_RE = re.compile(r'^(\(([\w\.\-]*)\)\s*)+$')
CODE_TOKEN_RE = re.compile(r'\(([\w\.\-]*)\)')

def _is_code_token(tok):
    # A real project/legacy/PMG code always has a digit, or is the empty placeholder '-'.
    # Pure-letter tokens in compact parens (NHIDCL, MoRTH, AAI...) are agency abbreviations.
    return tok == '-' or any(ch.isdigit() for ch in tok)

def split_name_agency_codes(cell):
    """Split the 'Project Name / (Agency) / (Codes...)' cell into parts."""
    lines = [l for l in (cell or '').split('\n') if l.strip() != '']
    codes = []
    idx = len(lines)
    while idx > 0:
        line = lines[idx - 1].strip()
        if CODE_LINE_RE.match(line):
            toks = CODE_TOKEN_RE.findall(line)
            if toks and all(_is_code_token(t) for t in toks):
                codes = toks + codes
                idx -= 1
                continue
        break
    agency = None
    if idx > 0:
        cand = lines[idx - 1].strip()
        if cand.startswith('(') and cand.endswith(')'):
            agency = cand[1:-1]
            idx -= 1
    name = ' '.join(lines[:idx]).strip()
    return name, agency, codes

def split_two(cell):
    """Split an 'original\\n(revised)' style cell into (original, revised)."""
    if cell is None:
        return None, None
    parts = [p.strip() for p in cell.split('\n') if p.strip() != '']
    orig = parts[0] if len(parts) > 0 else None
    rev = parts[1].strip('()') if len(parts) > 1 else None
    return orig, rev

def split_three(cell):
    """Split an 'original\\n(revised)\\n{anticipated}' style cell (June 2025 style)."""
    if cell is None:
        return None, None, None
    parts = [p.strip() for p in cell.split('\n') if p.strip() != '']
    orig = parts[0] if len(parts) > 0 else None
    rev = parts[1].strip('()') if len(parts) > 1 else None
    ant = parts[2].strip('{}') if len(parts) > 2 else None
    return orig, rev, ant

def find_start_page(pdf, markers):
    for i, page in enumerate(pdf.pages):
        text = page.extract_text() or ""
        if any(m in text for m in markers) and "Sl" in text:
            return i
    return None

def parse_format_b(path, month_label):
    """July 2025 onward PAIMANA format: Table 4/6 'All Ongoing Projects', ministry/sector as group-header rows."""
    records = []
    with pdfplumber.open(path) as pdf:
        start = find_start_page(pdf, ["All Ongoing Projects"])
        if start is None:
            return pd.DataFrame()
        current_ministry, current_sector = None, None
        for pi in range(start, len(pdf.pages)):
            page = pdf.pages[pi]
            text = page.extract_text() or ""
            if "All Ongoing Projects" not in text:
                # allow a couple of stray pages (page break) then stop
                if pi > start + 1:
                    break
                else:
                    continue
            tables = page.find_tables()
            target = None
            for t in tables:
                rows = t.extract()
                if rows and rows[0] and rows[0][0] and 'Sl' in str(rows[0][0]):
                    target = rows
                    break
            if target is None:
                continue
            header = target[0]
            ncols = len(header)
            for row in target[1:]:
                if not row or all((c is None or str(c).strip() == '') for c in row):
                    continue
                slno = (row[0] or '').strip()
                col1 = row[1] if len(row) > 1 else None
                if slno == '' and col1 and (row[2] is None or str(row[2]).strip() == ''):
                    # ministry or sector header row
                    label = col1.strip()
                    if label.lower().startswith(('ministry of', 'department of')):
                        current_ministry = label
                        current_sector = None
                    else:
                        current_sector = label
                    continue
                if slno == '':
                    continue
                name, agency, codes = split_name_agency_codes(col1)
                state = (row[2] or '').strip() if len(row) > 2 else None
                approval_raw = row[3] if len(row) > 3 else None
                doc_raw = row[4] if len(row) > 4 else None
                cost_raw = row[5] if len(row) > 5 else None
                cum_exp = row[6] if len(row) > 6 else None
                phys_prog = row[7] if len(row) > 7 else None
                approval, start_date = split_two(approval_raw)
                doc_orig, doc_rev = split_two(doc_raw)
                cost_orig, cost_rev = split_two(cost_raw)
                project_code = codes[0] if len(codes) > 0 else None
                legacy_ocms_code = codes[1] if len(codes) > 1 else None
                pmgid = codes[2] if len(codes) > 2 else None
                records.append(dict(
                    report_month=month_label, source_format='B',
                    ministry=current_ministry, sector=current_sector,
                    sl_no=slno, project_name=name, agency=agency,
                    project_code=project_code, legacy_ocms_code=legacy_ocms_code, pmgid=pmgid,
                    state=state, approval_date=approval, start_date=start_date,
                    doc_original=doc_orig, doc_revised=doc_rev,
                    cost_original=cost_orig, cost_revised=cost_rev,
                    cumulative_expenditure=(cum_exp or '').strip() if cum_exp else None,
                    physical_progress=(phys_prog or '').strip() if phys_prog else None,
                ))
    return pd.DataFrame.from_records(records)

def parse_format_a(path, month_label):
    """June 2025 OCMS format: Table 7, explicit State/Sector columns, triple-value cost/date."""
    records = []
    with pdfplumber.open(path) as pdf:
        start = find_start_page(pdf, ["Ongoing Projects as of"])
        if start is None:
            return pd.DataFrame()
        current_state, current_sector = None, None
        for pi in range(start, len(pdf.pages)):
            page = pdf.pages[pi]
            text = page.extract_text() or ""
            if "Ongoing Projects as of" not in text:
                if pi > start + 1:
                    break
                else:
                    continue
            tables = page.find_tables()
            target = None
            for t in tables:
                rows = t.extract()
                if rows and rows[0] and any('Sl No' in str(c) for c in rows[0] if c):
                    target = rows
                    break
            if target is None:
                continue
            for row in target[1:]:
                if not row or all((c is None or str(c).strip() == '') for c in row):
                    continue
                state_c, sector_c, slno, namecell, appr, doc_cell, cost_cell, cum_exp, phys = (row + [None]*9)[:9]
                if state_c and state_c.strip():
                    current_state = state_c.strip()
                if sector_c and sector_c.strip():
                    current_sector = sector_c.strip()
                slno = (slno or '').strip()
                if slno == '' or slno.lower() == 'total':
                    continue
                name, agency, codes = split_name_agency_codes(namecell)
                doc_o, doc_r, doc_a = split_three(doc_cell)
                cost_o, cost_r, cost_a = split_three(cost_cell)
                records.append(dict(
                    report_month=month_label, source_format='A',
                    ministry=None, sector=current_sector,
                    sl_no=slno, project_name=name, agency=agency,
                    project_code=codes[0] if codes else None, legacy_ocms_code=None, pmgid=None,
                    state=current_state, approval_date=(appr or '').strip(), start_date=None,
                    doc_original=doc_o, doc_revised=doc_r, doc_anticipated=doc_a,
                    cost_original=cost_o, cost_revised=cost_r, cost_anticipated=cost_a,
                    cumulative_expenditure=(cum_exp or '').strip() if cum_exp else None,
                    physical_progress=(phys or '').strip() if phys else None,
                ))
    return pd.DataFrame.from_records(records)

FILES = [
    ("2025-06", "/mnt/user-data/uploads/FR_JUNE_2025.pdf", "A"),
    ("2025-07", "/mnt/user-data/uploads/FlashReport_July_2025.pdf", "B"),
    ("2025-08", "/mnt/user-data/uploads/FlashReport_August_2025.pdf", "B"),
    ("2025-09", "/mnt/user-data/uploads/FlashReport_September_2025.pdf", "B"),
    ("2025-10", "/mnt/user-data/uploads/FlashReport_October_2025.pdf", "B"),
    ("2025-11", "/mnt/user-data/uploads/FlashReport_November_2025.pdf", "B"),
    ("2025-12", "/mnt/user-data/uploads/FlashReport_December_2025.pdf", "B"),
    ("2026-01", "/mnt/user-data/uploads/FlashReport_January_2026.pdf", "B"),
    ("2026-02", "/mnt/user-data/uploads/FlashReport_February_2026.pdf", "B"),
    ("2026-03", "/mnt/user-data/uploads/FlashReport_March_2026.pdf", "B"),
    ("2026-04", "/mnt/user-data/uploads/FlashReport_April2026.pdf", "B"),
    ("2026-05", "/mnt/user-data/uploads/FlashReport_May2026.pdf", "B"),
    ("2026-06", "/mnt/user-data/uploads/FlashReport_June_2026__1_.pdf", "B"),
]

if __name__ == "__main__":
    import sys
    out_dir = Path("/home/claude/panel_parts")
    out_dir.mkdir(exist_ok=True)
    for month_label, path, fmt in FILES:
        out_path = out_dir / f"{month_label}.csv"
        if out_path.exists():
            print("skip (exists):", month_label)
            continue
        print("parsing", month_label, path)
        if fmt == "A":
            df = parse_format_a(path, month_label)
        else:
            df = parse_format_b(path, month_label)
        print("  rows:", len(df))
        df.to_csv(out_path, index=False)
