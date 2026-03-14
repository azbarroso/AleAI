# Phase 0 — Data Validation Spike Results

**Date:** 2026-03-14
**Decision: GO**

---

## Data Source Validation

### Files Tested
- Current week: `https://www.cftc.gov/dea/newcot/FinFutWk.txt`
- Historical (per year): `https://www.cftc.gov/files/dea/history/fut_fin_txt_YYYY.zip`
  - **Note:** filename is `fut_fin_txt_`, NOT `fin_fut_txt_` as some docs suggest
  - Each ZIP contains `FinFutYY.txt` (same filename every year — must unzip to separate dirs)
- Years tested: 2011, 2015, 2020, 2025

### 13874+ Consolidated Rows

| Year | Rows | Date Range |
|------|------|------------|
| 2011 | 52 | 2011-01-04 to 2011-12-27 |
| 2015 | 52 | 2015-01-06 to 2015-12-29 |
| 2020 | 52 | 2020-01-07 to 2020-12-29 |
| 2025 | 52 | 2025-01-07 to 2025-12-30 |
| Current week | 1 | 2026-03-10 |

- Consistent 52 rows/year, no unexpected gaps within years
- Code `13874+` = "S&P 500 Consolidated - CHICAGO MERCANTILE EXCHANGE"
- Other codes in the 13874 family: 13874A (E-mini), 138741 (classic S&P), sector indices, micro, etc.

### Required Columns — All Present and Populated

| Column | Status |
|--------|--------|
| `Lev_Money_Positions_Long_All` | ✓ 100% populated across all years |
| `Lev_Money_Positions_Short_All` | ✓ 100% populated |
| `Asset_Mgr_Positions_Long_All` | ✓ 100% populated |
| `Asset_Mgr_Positions_Short_All` | ✓ 100% populated |
| `Dealer_Positions_Long_All` | ✓ 100% populated |
| `Dealer_Positions_Short_All` | ✓ 100% populated |
| `Open_Interest_All` | ✓ 100% populated |
| `As_of_Date_In_Form_YYMMDD` | ✓ Always present |
| `Report_Date_as_YYYY-MM-DD` | ✓ Present 2015+, empty in 2011 (use YYMMDD fallback) |

### Cross-Check: Parsed Data vs CFTC Viewer (2026-03-10)

| Field | Our Parse | CFTC Viewer | Match |
|-------|-----------|-------------|-------|
| Open Interest | 2,023,096 | 2,023,096 | ✓ |
| Lev Funds Long | 154,685 | 154,685 | ✓ |
| Lev Funds Short | 512,781 | 512,781 | ✓ |
| Asset Mgr Long | 1,098,358 | 1,098,358 | ✓ |
| Asset Mgr Short | 197,292 | 197,292 | ✓ |

**Exact match on all fields.**

---

## Signal Plausibility

### COVID Crash (March 2020)
- Pre-crash (2020-01-07): LF Net = -40,859
- Crash week (2020-03-17): LF Net flipped to +8,363 (panic covering)
- Post-crash (2020-03-24): LF Net = -760 (near zero, uncertainty)
- Recovery (2020-06-23): LF Net = -70,340 (rebuilding short)

The data clearly captures the positioning shift during COVID — Leveraged Funds went from net short to briefly net long during the crash, then rebuilt short. This is exactly the kind of extreme the signal engine should detect.

### Current Positioning (2026-03-10)
- LF Net: -358,096 (heavily net short)
- AM Net: +901,066 (heavily net long)
- LF rough 52wk percentile: ~46th (no extreme)
- Clear Lev Funds vs Asset Manager divergence

---

## Implementation Notes

1. **Date parsing:** Use `As_of_Date_In_Form_YYMMDD` as primary (always present), `Report_Date_as_YYYY-MM-DD` as convenience field
2. **Current week file has no header row** — must use column positions matching `FinFutYY.txt` header order
3. **Each annual ZIP extracts to same filename** (`FinFutYY.txt`) — unzip to separate directories
4. **Download URL pattern:** `https://www.cftc.gov/files/dea/history/fut_fin_txt_YYYY.zip`
5. **All years have exactly 52 rows for 13874+** — clean weekly cadence, no missing weeks within a year
6. **87 total columns** in the CSV — we only need ~15 for v1

---

## GO Decision

**GO.** The data is clean, consistent, complete, and exactly matches the CFTC's own viewer. All required columns are populated across all tested years (2011-2025). The 13874+ consolidated code is available in every file. No blockers identified.

**Next:** Sprint 1 — Initialize code repo, set up Railway, build parser + backfill script.
