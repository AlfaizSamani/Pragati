# PAIMANA Sentinel — Panel Build Results (Stage 0 + Stage 1, real data)

This is not a plan anymore — this is what actually came out of parsing your 13 uploaded reports (June 2025 → June 2026). Everything below is measured, not estimated.

## What was built

`parse_reports.py` — a schema-aware parser (using `pdfplumber`) that handles both report formats found in your files:
- **Format A** (June 2025, OCMS-era): `Table 7`, explicit State/Sector columns, triple-value cost/date fields (`Original / Revised / Anticipated`).
- **Format B** (July 2025 – June 2026, PAIMANA-era): `Table 4/6 "All Ongoing Projects"`, Ministry/Sector as group-header rows, double-value cost/date fields, and (from Feb 2026 onward) a second and third identifier — `Legacy OCMS Code` and `PMGID` — appended under the main `Project Code`.

The parser correctly separates project name, agency, and 1-3 identifier codes per row by checking for digits (agency abbreviations like `NHIDCL`/`MoRTH`/`AAI` are letters-only; real codes always contain a digit, or are the placeholder `-`) — an early version of this logic mis-classified agency abbreviations as codes, which is worth knowing if you extend the parser: **classify by digit presence, not by "is it in compact parens."**

## Row counts extracted — and they validate against your official headline figures

| Month | Rows parsed | Ministries seen |
|---|---|---|
| 2025-06 (OCMS) | 1,595 | — (no ministry grouping in this format) |
| 2025-07 | 714 | 9 |
| 2025-08 | 800 | 13 |
| 2025-09 | 772 | 12 |
| 2025-10 | 798 | 14 |
| 2025-11 | 823 | 15 |
| 2025-12 | **1,345** | **16** |
| 2026-01 | 1,605 | 16 |
| 2026-02 | 1,897 | 16 |
| 2026-03 | 1,869 | 16 |
| 2026-04 | **1,981** | 16 |
| 2026-05 | **1,987** | 16 |
| 2026-06 | 1,847 | 16 |

**The bolded figures match the official PIB/MoSPI headline numbers I verified independently before you uploaded these files** (November's cover page literally says 823; April and May's public figures were 1,981 and 1,987) — strong confirmation the extraction is accurate, not just structurally plausible.

**The MoRTH gap is now precisely dated, not just suspected**: ministry count jumps from 14-15 to 16 exactly between November 2025 (823 rows) and December 2025 (1,345 rows) — a jump of 522 rows in one month. MoRTH was excluded July–November 2025 and reinstated starting December 2025. Any model trained across this boundary needs to treat pre-December 2025 as "MoRTH-blind" for feature purposes, not as a real drop in road-sector activity.

## Entity resolution (Stage 0) — better than expected

The `Legacy OCMS Code` field that appears starting February 2026 turned out to be exactly the crosswalk needed to bridge June 2025's alphanumeric OCMS codes (`N24002228`, `N04000073`...) to the PAIMANA-era numeric codes (`612786`, `701107`...).

- Built a crosswalk from every row (Feb 2026 – June 2026) where both codes are present: **1,152 clean, unambiguous mappings**.
- Applied it to June 2025's 1,595 project codes: **1,150 resolved (72.1%)** to a canonical PAIMANA project ID.
- The unresolved ~28% are most likely projects that were completed or dropped from the portfolio before February 2026 (i.e., before MoSPI started publishing the crosswalk field) — they wouldn't have a legacy code entry to match against by construction, not because the matching failed.
- Minor data-quality note: 30 of the ~1,180 legacy codes mapped to more than one distinct project code across different months — small enough to spot-check manually rather than needing a fuzzy-matching layer.

**This means you do not need heavy fuzzy-matching (name/agency/state similarity) as your primary resolution method** — the official crosswalk field covers the large majority of cases directly. Fuzzy matching is now a fallback for the unresolved ~28%, not the backbone of Stage 0.

## The panel, end to end

- **18,033 total project-month rows** across 13 months.
- **2,650 unique canonical projects** after resolution.
- **378 projects have a complete 13-month trajectory** (present in every single report) — this is your training set for genuine month-over-month trajectory features (progress velocity, cost-progress divergence, schedule-revision counts).
- 495 projects appear in only 1 month (mostly newly-added, completed, or the unresolved June-only OCMS stragglers).

## A real trajectory, not a hypothetical one

Project `612789` — *Development of additional RESA, Calicut Airport* (AAI, Kerala) — across all 13 months:

| Month | Target completion (as revised) | Physical progress | Cumulative expenditure (₹ Cr) |
|---|---|---|---|
| 2025-06 | 09/2025 | 18.3% | 74.67 |
| 2025-11 | 09/2025 | 25% | 96.26 |
| 2025-12 | **06/2026** (1st revision) | 31% | 116.14 |
| 2026-03 | **12/2026** (2nd revision) | 55% | 204.60 |
| 2026-06 | 12/2026 | 64.5% | 227.50 |

Two schedule revisions, steadily climbing progress, expenditure roughly tracking progress (no major cost-progress divergence in this case) — this is exactly the kind of trajectory record the whole "risk momentum" concept from the earlier brainstorm needs, and now you have 378 real ones like it to train and evaluate on, not a synthetic example.

## Known rough edges to fix before modeling

1. **State forward-fill artifact**: in Format A (June 2025), state is a merged cell that only appears on a project's first row within a state group — the parser forward-fills it, but the very first row of the whole table can occasionally inherit a stale value if extraction starts mid-table. Spot-check state values before using them as a feature.
2. **`Cumulative Expenditure` and `Physical Progress` weren't split-parsed for triple-value cases** the way cost/date were — worth a second pass if you need the `{Anticipated}` progress variant specifically for June 2025.
3. **June 2026's project count (1,847) dipped from May's 1,987** — worth checking whether this is a real portfolio change or reflects the CRIP portal migration mentioned in that month's report note (source domain changed to `paimana-crip.mospi.gov.in` starting June 2026).

## Files delivered

- `panel_long_13months.csv` — the full long-format panel (18,033 rows), one row per project per report-month, with `canonical_id` for joining across months.
- `crosswalk_projectcode_to_legacyocms.csv` — the 1,152-row identity crosswalk.
- `parse_reports.py` — the parser itself, so you can re-run it if you get more months or need to adjust field extraction.

## What's next

Stage 0 (entity resolution) and Stage 1 (panel build) from the architecture doc are now done, on real data. The next real step is **Stage 2 — feature engineering** on top of `panel_long_13months.csv`: progress velocity, cost-progress divergence, schedule-revision counts, and the point-in-time discipline from the earlier doc (Section 3.1) applied against this actual panel rather than a hypothetical one. Say the word and I'll build that next, directly on this data.
