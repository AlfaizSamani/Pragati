// Minimal dependency-free PDF writer (PDF 1.4, Helvetica core fonts).
// Produces a valid multi-page text report for the "Download Report"
// actions. Text is sanitized to Latin-1 so byte offsets stay exact.

function sanitize(s) {
  return String(s)
    .replace(/\u20b9/g, "Rs ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00b7/g, "-")
    .replace(/[^\x20-\x7E\n]/g, "");
}

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

// Wrap a line to a max character width for a given font size.
function wrap(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

/**
 * lines: array of { text, size?, bold?, gapAfter?, indent? }
 * Returns a Blob for a single A4-portrait PDF.
 */
export function buildPdf(lines) {
  const PAGE_W = 595, PAGE_H = 842;
  const MARGIN = 56;
  const maxChars = 92;

  // Lay lines out into pages of content-stream text operations.
  const pages = [];
  let ops = [];
  let y = PAGE_H - MARGIN;
  const pushLine = (l) => {
    const size = l.size || 10;
    const x = MARGIN + (l.indent || 0);
    ops.push(`BT /F${l.bold ? 2 : 1} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${esc(sanitize(l.text))}) Tj ET`);
    y -= size * 1.5 + (l.gapAfter || 0);
  };
  const newPage = () => {
    if (ops.length) pages.push(ops);
    ops = [];
    y = PAGE_H - MARGIN;
  };

  for (const l of lines) {
    for (const piece of wrap(l.text, maxChars)) {
      if (y < MARGIN + 30) newPage();
      pushLine({ ...l, text: piece });
    }
    y -= l.gapAfter || 0;
  }
  newPage();
  if (!pages.length) pages.push([`BT /F1 10 Tf 1 0 0 1 ${MARGIN} ${PAGE_H - MARGIN} Tm () Tj ET`]);

  // Assemble PDF objects.
  const objects = []; // 1-indexed object bodies
  const pageObjIds = [];
  const contentObjIds = [];
  const firstPageObj = 5; // 1 catalog, 2 pages, 3 font F1, 4 font F2
  pages.forEach((_, i) => {
    pageObjIds.push(firstPageObj + i * 2);
    contentObjIds.push(firstPageObj + i * 2 + 1);
  });

  objects[1] = `<< /Type /Catalog /Pages 2 0 R >>`;
  objects[2] = `<< /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`;
  objects[3] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`;
  objects[4] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`;
  pages.forEach((pageOps, i) => {
    const stream = pageOps.join("\n");
    objects[pageObjIds[i]] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjIds[i]} 0 R >>`;
    objects[contentObjIds[i]] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });

  let out = "%PDF-1.4\n";
  const offsets = [0];
  for (let i = 1; i < objects.length; i++) {
    offsets[i] = out.length;
    out += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefStart = out.length;
  const count = objects.length;
  out += `xref\n0 ${count}\n0000000000 65535 f \n`;
  for (let i = 1; i < count; i++) {
    out += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  out += `trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([out], { type: "application/pdf" });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
