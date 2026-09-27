// ============================================================
// Mock data for the Project Detail page.
// EVERY string rendered on this page lives here — components
// only reference these exports/props, never hardcode copy.
// PROJECTS holds full records for several projects so search,
// tab panels and every section can be driven purely from data.
// Swap for a real API response keyed by project id later.
// ============================================================

// Global per-metric chart tabs + shared axis (same reporting window
// across projects keeps the axis labels identical).
export const trajectoryTabs = ["Physical Progress", "Expenditure", "Risk Score", "Key Milestones"];

// x positions are 0..1 across the chart width; values are 0..yMax.
// Axis labels mirror the reference design exactly (it repeats "Jan 2025").
export const trajectoryAxis = ["Jan 2023", "Jul 2023", "Jan 2024", "Jul 2024", "Jan 2025", "Jul 2025", "Jan 2025", "Apr 2026", "Dec 2026"];

// ------------------------------------------------------------
// Project records
// ------------------------------------------------------------
export const PROJECTS = [
  {
    id: "mahsr",
    tags: ["RAILWAYS", "NATIONAL PRIORITY PROJECT"],
    name: "Mumbai-Ahmedabad High Speed Rail (MAHRSR)",
    sector: "Railways",
    tagline: "Transforming connectivity for a faster, more connected India.",
    quote: "\u201cHigh-speed infrastructure for a more connected tomorrow.\u201d",
    meta: [
      { icon: "MapPin", primary: "Mumbai, Thane, Palghar", secondary: "Maharashtra, Gujarat" },
      { icon: "Landmark", primary: "Ministry of Railways", secondary: "NHSRCL" },
      { icon: "Calendar", primary: "Reporting Month", secondary: "April 2026" },
      { icon: "Gauge", primary: "Model Version", secondary: "v3-final (Production)" },
    ],
    riskScore: { value: 87, level: "HIGH RISK", delta: 12, comparedTo: "vs. previous month", scoredOn: "April 2026", model: "v3-final" },
    glance: [
      { icon: "TrainFront", label: "Project Type", value: "Greenfield" },
      { icon: "Ruler", label: "Total Length", value: "508 km" },
      { icon: "TrainFront", label: "Stations", value: "12 (6 in Maharashtra, 6 in Gujarat)" },
      { icon: "Users", label: "Estimated Passengers", value: "70 million/year" },
      { icon: "Settings2", label: "Implementation Mode", value: "JV (Govt. of India + Govt. of Gujarat)" },
      { icon: "CalendarCheck2", label: "Target Completion", value: "December 2026" },
    ],
    // Station list mirrors the reference design, including its duplicated
    // "Vadodara" label along the corridor.
    stations: ["Ahmedabad", "Vadodara", "Surat", "Vadodara", "Mumbai"],
    flagged: [
      {
        id: "fr1", iconTone: "red", icon: "CalendarClock", title: "Schedule Pressure", impact: "HIGH IMPACT", tone: "red",
        text: "Multiple civil packages are showing delays of 6\u201312 months, particularly in the Maharashtra section.",
        evidence: [
          { label: "Package C4 monthly report", detail: "Viaduct girder launching 8 months behind baseline (Feb 2026 review)." },
          { label: "NHSRCL progress bulletin", detail: "Mountain tunnel T3 breakthrough deferred from Nov 2025 to Jul 2026." },
          { label: "Contractor mobilization log", detail: "Two of four civil contractors below agreed manpower strength." },
        ],
      },
      {
        id: "fr2", iconTone: "red", icon: "IndianRupee", title: "Cost Pressure", impact: "HIGH IMPACT", tone: "red",
        text: "Revised cost estimates indicate 18% increase due to land acquisition and material cost escalation.",
        evidence: [
          { label: "Revised cost memorandum", detail: "Land acquisition payout revised from \u20b9 18,000 Cr to \u20b9 24,500 Cr." },
          { label: "Steel & cement index tracker", detail: "Structural steel rates up 22% over the 18-month procurement window." },
        ],
      },
      {
        id: "fr3", iconTone: "green", icon: "TrendingUp", title: "Progress Trajectory", impact: "MEDIUM IMPACT", tone: "amber",
        text: "Physical progress is 32% against 38% planned for this reporting period.",
        evidence: [
          { label: "GMV progress return", detail: "Cumulative physical progress 32% vs 38% planned as of April 2026." },
          { label: "Milestone register", detail: "3 of 11 level-1 milestones slipped by more than one quarter." },
        ],
      },
      {
        id: "fr4", iconTone: "amber", icon: "AlertTriangle", title: "Execution Signals", impact: "MEDIUM IMPACT", tone: "amber",
        text: "Recent contractor mobilization issues and right-of-way clearances pending in 3 districts.",
        evidence: [
          { label: "ROW clearance tracker", detail: "9.4 km of right-of-way still pending across 3 districts." },
          { label: "District collector minutes", detail: "Utility shifting approvals awaited in Valsad and Palghar." },
        ],
      },
    ],
    trajectory: {
      "Physical Progress": {
        unit: "%", yMax: 100,
        planned: [{ x: 0, y: 2 }, { x: 1 / 8, y: 7 }, { x: 2 / 8, y: 15 }, { x: 3 / 8, y: 24 }, { x: 4 / 8, y: 32 }, { x: 5 / 8, y: 36 }, { x: 6 / 8, y: 37 }, { x: 7 / 8, y: 38 }, { x: 1, y: 65 }],
        actual: [{ x: 0, y: 1 }, { x: 1 / 8, y: 4 }, { x: 2 / 8, y: 9 }, { x: 3 / 8, y: 14 }, { x: 4 / 8, y: 19 }, { x: 5 / 8, y: 25 }, { x: 6 / 8, y: 28 }, { x: 7 / 8, y: 32 }],
        milestones: [
          { x: 2 / 8, labelLines: ["Land Acquisition", "Complete"], date: "Mar 2024" },
          { x: 3 / 8, labelLines: ["Major Bridge Work", "Commenced"], date: "Nov 2024" },
          { x: 4 / 8, labelLines: ["Maharashtra Section", "50% Planned"], date: "Jun 2025" },
          { x: 1, labelLines: ["Target", "Completion"], date: "Dec 2026", accent: true },
        ],
      },
      "Expenditure": {
        unit: "%", yMax: 100,
        planned: [{ x: 0, y: 1 }, { x: 1 / 8, y: 5 }, { x: 2 / 8, y: 12 }, { x: 3 / 8, y: 21 }, { x: 4 / 8, y: 30 }, { x: 5 / 8, y: 34 }, { x: 6 / 8, y: 36 }, { x: 7 / 8, y: 37 }, { x: 1, y: 60 }],
        actual: [{ x: 0, y: 0 }, { x: 1 / 8, y: 3 }, { x: 2 / 8, y: 7 }, { x: 3 / 8, y: 11 }, { x: 4 / 8, y: 16 }, { x: 5 / 8, y: 22 }, { x: 6 / 8, y: 25 }, { x: 7 / 8, y: 28 }],
        milestones: [
          { x: 2 / 8, labelLines: ["First Tranche", "Released"], date: "May 2024" },
          { x: 4 / 8, labelLines: ["Revised Cost", "Approved"], date: "Feb 2025" },
          { x: 1, labelLines: ["Full Outlay", "Target"], date: "Dec 2026", accent: true },
        ],
      },
      "Risk Score": {
        unit: "%", yMax: 100,
        planned: [{ x: 0, y: 30 }, { x: 1 / 8, y: 32 }, { x: 2 / 8, y: 35 }, { x: 3 / 8, y: 40 }, { x: 4 / 8, y: 48 }, { x: 5 / 8, y: 55 }, { x: 6 / 8, y: 62 }, { x: 7 / 8, y: 70 }, { x: 1, y: 75 }],
        actual: [{ x: 0, y: 28 }, { x: 1 / 8, y: 31 }, { x: 2 / 8, y: 36 }, { x: 3 / 8, y: 47 }, { x: 4 / 8, y: 58 }, { x: 5 / 8, y: 66 }, { x: 6 / 8, y: 75 }, { x: 7 / 8, y: 87 }],
        milestones: [
          { x: 3 / 8, labelLines: ["First Early", "Warning"], date: "Sep 2024" },
          { x: 5 / 8, labelLines: ["Watchlist", "Added"], date: "Aug 2025" },
          { x: 7 / 8, labelLines: ["Current", "Score"], date: "Apr 2026", accent: true },
        ],
      },
      "Key Milestones": {
        unit: "%", yMax: 100,
        planned: [{ x: 0, y: 0 }, { x: 1 / 8, y: 9 }, { x: 2 / 8, y: 18 }, { x: 3 / 8, y: 36 }, { x: 4 / 8, y: 55 }, { x: 5 / 8, y: 64 }, { x: 6 / 8, y: 73 }, { x: 7 / 8, y: 82 }, { x: 1, y: 100 }],
        actual: [{ x: 0, y: 0 }, { x: 1 / 8, y: 9 }, { x: 2 / 8, y: 18 }, { x: 3 / 8, y: 27 }, { x: 4 / 8, y: 36 }, { x: 5 / 8, y: 45 }, { x: 6 / 8, y: 55 }, { x: 7 / 8, y: 64 }],
        milestones: [
          { x: 1 / 8, labelLines: ["Foundation", "Stone"], date: "Sep 2023" },
          { x: 3 / 8, labelLines: ["Viaduct", "Launch Start"], date: "Oct 2024" },
          { x: 5 / 8, labelLines: ["Rolling Stock", "Delivery"], date: "Aug 2025" },
          { x: 1, labelLines: ["Commercial", "Run Target"], date: "Dec 2026", accent: true },
        ],
      },
    },
    financial: {
      originalCost: "\u20b9 1,08,000 Cr", revisedCost: "\u20b9 1,27,440 Cr", revisedDelta: 18,
      expenditure: "\u20b9 40,780 Cr", expenditureNote: "(32% of revised cost)",
    },
    schedule: {
      originalCompletion: "December 2026", revisedCompletion: "December 2026", currentPosition: "6 months behind schedule",
    },
    breakdown: [
      { label: "Schedule Risk", value: 32, tone: "red" },
      { label: "Cost Risk", value: 28, tone: "orange" },
      { label: "Execution Risk", value: 18, tone: "amber" },
      { label: "External Risk", value: 12, tone: "amberLight" },
      { label: "Financial Risk", value: 6, tone: "gray" },
      { label: "Other Factors", value: 4, tone: "grayLight" },
    ],
    updates: [
      { id: "ru1", date: "Apr 2026", tone: "red", icon: "AlertCircle", title: "Risk Score Increased", text: "From 75% to 87% (+12%)" },
      { id: "ru2", date: "Mar 2026", tone: "orange", icon: "IndianRupee", title: "Cost Revision", text: "Estimated cost increased by 18%" },
      { id: "ru3", date: "Feb 2026", tone: "blue", icon: "TrendingUp", title: "Progress Update", text: "Physical progress at 32%" },
      { id: "ru4", date: "Jan 2026", tone: "gray", icon: "Users", title: "Contractor Update", text: "New contractor onboarded for Package C4" },
      { id: "ru5", date: "Dec 2025", tone: "green", icon: "CheckCircle2", title: "Land Acquisition", text: "98% of land parcels acquired" },
    ],
    documents: [
      { id: "kd1", name: "Detailed Project Report (DPR)", meta: "PDF \u00b7 12.4 MB \u00b7 Jan 2024" },
      { id: "kd2", name: "Latest Progress Report", meta: "PDF \u00b7 8.7 MB \u00b7 Apr 2026" },
      { id: "kd3", name: "Risk Assessment Summary", meta: "PDF \u00b7 3.2 MB \u00b7 Apr 2026" },
    ],
    related: [
      { name: "Delhi-Mumbai Expressway", sector: "Roads", risk: 54, progress: 61 },
      { name: "Navi Mumbai International Airport", sector: "Aviation", risk: 38, progress: 72 },
      { name: "Mumbai Coastal Road (Phase 2)", sector: "Roads", risk: 47, progress: 55 },
    ],
    discussion: [
      { author: "A. Sharma", role: "MoSPI Officer", time: "2 days ago", text: "Requesting the latest ROW clearance certificate for Palghar district before the review committee meets." },
      { author: "R. Iyer", role: "NHSRCL Liaison", time: "1 day ago", text: "Certificate is with the district collector; expected within the week. Will upload once received." },
      { author: "K. Desai", role: "Risk Analyst", time: "6 hours ago", text: "Flagging that girder supply slippage is now the dominant driver of the schedule-risk factor." },
    ],
  },

  {
    id: "dmic-expressway",
    tags: ["ROADS", "PRIORITY PROJECT"],
    name: "Delhi-Mumbai Expressway (Packages 5-9)",
    sector: "Roads",
    tagline: "Linking the capital and the financial hub with 8-lane access-controlled asphalt.",
    quote: "\u201cShorter distances, stronger commerce.\u201d",
    meta: [
      { icon: "MapPin", primary: "Delhi, Rajasthan, Gujarat", secondary: "MH, RJ, HR, MP corridors" },
      { icon: "Landmark", primary: "Ministry of Road Transport", secondary: "NHAI" },
      { icon: "Calendar", primary: "Reporting Month", secondary: "April 2026" },
      { icon: "Gauge", primary: "Model Version", secondary: "v3-final (Production)" },
    ],
    riskScore: { value: 54, level: "MEDIUM RISK", delta: 3, comparedTo: "vs. previous month", scoredOn: "April 2026", model: "v3-final" },
    glance: [
      { icon: "TrainFront", label: "Project Type", value: "Brownfield expansion" },
      { icon: "Ruler", label: "Total Length", value: "1,386 km" },
      { icon: "TrainFront", label: "Interchanges", value: "34 across 5 states" },
      { icon: "Users", label: "Projected Daily Traffic", value: "82,000 vehicles" },
      { icon: "Settings2", label: "Implementation Mode", value: "EPC (NHAI)" },
      { icon: "CalendarCheck2", label: "Target Completion", value: "October 2026" },
    ],
    stations: ["Delhi", "Sohna", "Kota", "Vadodara", "Mumbai"],
    flagged: [
      {
        id: "fr1", iconTone: "amber", icon: "CalendarClock", title: "Schedule Pressure", impact: "MEDIUM IMPACT", tone: "amber",
        text: "Package 7 earthworks lagging 4% behind plan due to an extended monsoon shutdown.",
        evidence: [
          { label: "PIU weekly report", detail: "Package 7 earthworks at 88% vs 92% planned for April 2026." },
        ],
      },
      {
        id: "fr2", iconTone: "green", icon: "IndianRupee", title: "Cost Position", impact: "LOW IMPACT", tone: "green",
        text: "Expenditure tracking within 2% of the approved outlay; no revision requested.",
        evidence: [
          { label: "Quarterly expenditure return", detail: "Cumulative spend \u20b9 61,400 Cr against \u20b9 62,700 Cr phased plan." },
        ],
      },
      {
        id: "fr3", iconTone: "amber", icon: "AlertTriangle", title: "Utility Shifting", impact: "MEDIUM IMPACT", tone: "amber",
        text: "Power line diversion near Kota pending with the state utility for 3 months.",
        evidence: [
          { label: "Utility liaison log", detail: "132 kV line diversion approval awaited since January 2026." },
        ],
      },
    ],
    trajectory: {
      "Physical Progress": {
        unit: "%", yMax: 100,
        planned: [{ x: 0, y: 4 }, { x: 1 / 8, y: 12 }, { x: 2 / 8, y: 24 }, { x: 3 / 8, y: 35 }, { x: 4 / 8, y: 46 }, { x: 5 / 8, y: 53 }, { x: 6 / 8, y: 57 }, { x: 7 / 8, y: 60 }, { x: 1, y: 88 }],
        actual: [{ x: 0, y: 4 }, { x: 1 / 8, y: 11 }, { x: 2 / 8, y: 22 }, { x: 3 / 8, y: 33 }, { x: 4 / 8, y: 43 }, { x: 5 / 8, y: 50 }, { x: 6 / 8, y: 54 }, { x: 7 / 8, y: 57 }],
        milestones: [
          { x: 2 / 8, labelLines: ["Paving", "Started"], date: "Feb 2024" },
          { x: 4 / 8, labelLines: ["Rajasthan Section", "Opened"], date: "Jun 2025" },
          { x: 1, labelLines: ["Full Length", "Target"], date: "Oct 2026", accent: true },
        ],
      },
      "Expenditure": {
        unit: "%", yMax: 100,
        planned: [{ x: 0, y: 3 }, { x: 1 / 8, y: 10 }, { x: 2 / 8, y: 20 }, { x: 3 / 8, y: 30 }, { x: 4 / 8, y: 42 }, { x: 5 / 8, y: 50 }, { x: 6 / 8, y: 55 }, { x: 7 / 8, y: 58 }, { x: 1, y: 85 }],
        actual: [{ x: 0, y: 3 }, { x: 1 / 8, y: 9 }, { x: 2 / 8, y: 19 }, { x: 3 / 8, y: 29 }, { x: 4 / 8, y: 40 }, { x: 5 / 8, y: 48 }, { x: 6 / 8, y: 53 }, { x: 7 / 8, y: 56 }],
        milestones: [
          { x: 3 / 8, labelLines: ["Tranche 3", "Released"], date: "Dec 2024" },
          { x: 1, labelLines: ["Outlay", "Target"], date: "Oct 2026", accent: true },
        ],
      },
      "Risk Score": {
        unit: "%", yMax: 100,
        planned: [{ x: 0, y: 45 }, { x: 1 / 8, y: 47 }, { x: 2 / 8, y: 50 }, { x: 3 / 8, y: 52 }, { x: 4 / 8, y: 54 }, { x: 5 / 8, y: 53 }, { x: 6 / 8, y: 53 }, { x: 7 / 8, y: 52 }, { x: 1, y: 50 }],
        actual: [{ x: 0, y: 44 }, { x: 1 / 8, y: 48 }, { x: 2 / 8, y: 52 }, { x: 3 / 8, y: 55 }, { x: 4 / 8, y: 58 }, { x: 5 / 8, y: 55 }, { x: 6 / 8, y: 53 }, { x: 7 / 8, y: 54 }],
        milestones: [
          { x: 4 / 8, labelLines: ["Monsoon", "Peak"], date: "Jul 2025" },
          { x: 7 / 8, labelLines: ["Current", "Score"], date: "Apr 2026", accent: true },
        ],
      },
      "Key Milestones": {
        unit: "%", yMax: 100,
        planned: [{ x: 0, y: 0 }, { x: 1 / 8, y: 10 }, { x: 2 / 8, y: 25 }, { x: 3 / 8, y: 40 }, { x: 4 / 8, y: 55 }, { x: 5 / 8, y: 65 }, { x: 6 / 8, y: 75 }, { x: 7 / 8, y: 85 }, { x: 1, y: 100 }],
        actual: [{ x: 0, y: 0 }, { x: 1 / 8, y: 10 }, { x: 2 / 8, y: 25 }, { x: 3 / 8, y: 38 }, { x: 4 / 8, y: 52 }, { x: 5 / 8, y: 60 }, { x: 6 / 8, y: 68 }, { x: 7 / 8, y: 75 }],
        milestones: [
          { x: 1 / 8, labelLines: ["Ground", "Breaking"], date: "Sep 2023" },
          { x: 4 / 8, labelLines: ["Kota Section", "Opened"], date: "Jun 2025" },
          { x: 1, labelLines: ["Inauguration", "Target"], date: "Oct 2026", accent: true },
        ],
      },
    },
    financial: {
      originalCost: "\u20b9 98,000 Cr", revisedCost: "\u20b9 1,01,500 Cr", revisedDelta: 4,
      expenditure: "\u20b9 61,400 Cr", expenditureNote: "(60% of revised cost)",
    },
    schedule: {
      originalCompletion: "October 2026", revisedCompletion: "October 2026", currentPosition: "On schedule",
    },
    breakdown: [
      { label: "Schedule Risk", value: 22, tone: "amber" },
      { label: "Cost Risk", value: 9, tone: "amberLight" },
      { label: "Execution Risk", value: 11, tone: "gray" },
      { label: "External Risk", value: 7, tone: "grayLight" },
      { label: "Financial Risk", value: 3, tone: "grayLight" },
      { label: "Other Factors", value: 2, tone: "grayLight" },
    ],
    updates: [
      { id: "ru1", date: "Apr 2026", tone: "orange", icon: "AlertCircle", title: "Utility Pending", text: "Kota power-line diversion awaiting state approval" },
      { id: "ru2", date: "Feb 2026", tone: "green", icon: "CheckCircle2", title: "Package 8 Paving", text: "Final 40 km stretch paving commenced" },
      { id: "ru3", date: "Jan 2026", tone: "blue", icon: "TrendingUp", title: "Progress Update", text: "Cumulative physical progress at 57%" },
      { id: "ru4", date: "Nov 2025", tone: "green", icon: "CheckCircle2", title: "Wayleave Cleared", text: "Forest diversion approvals received for Package 6" },
    ],
    documents: [
      { id: "kd1", name: "Expressway DPR (Packages 5-9)", meta: "PDF \u00b7 18.9 MB \u00b7 Mar 2023" },
      { id: "kd2", name: "Quarterly Progress Report", meta: "PDF \u00b7 6.1 MB \u00b7 Apr 2026" },
    ],
    related: [
      { name: "Mumbai-Ahmedabad High Speed Rail", sector: "Railways", risk: 87, progress: 32 },
      { name: "Mumbai Coastal Road (Phase 2)", sector: "Roads", risk: 47, progress: 55 },
    ],
    discussion: [
      { author: "K. Desai", role: "Risk Analyst", time: "3 days ago", text: "Monsoon slippage on Package 7 is within tolerance; recommend keeping score steady next cycle." },
      { author: "A. Sharma", role: "MoSPI Officer", time: "1 day ago", text: "Agreed. Please attach the PIU weekly returns to the evidence pack for the review meeting." },
    ],
  },

  {
    id: "bhadla-solar",
    tags: ["POWER", "NATIONAL PRIORITY PROJECT"],
    name: "Bhadla Solar Park \u2014 Phase IV",
    sector: "Power",
    tagline: "Scaling India's largest solar complex with 1.2 GW of additional capacity.",
    quote: "\u201cHarnessing the desert, powering the nation.\u201d",
    meta: [
      { icon: "MapPin", primary: "Bhadla, Jodhpur", secondary: "Rajasthan" },
      { icon: "Landmark", primary: "Ministry of New & Renewable Energy", secondary: "RUMSL" },
      { icon: "Calendar", primary: "Reporting Month", secondary: "April 2026" },
      { icon: "Gauge", primary: "Model Version", secondary: "v3-final (Production)" },
    ],
    riskScore: { value: 31, level: "LOW RISK", delta: -2, comparedTo: "vs. previous month", scoredOn: "April 2026", model: "v3-final" },
    glance: [
      { icon: "TrainFront", label: "Project Type", value: "Greenfield" },
      { icon: "Ruler", label: "Capacity Added", value: "1.2 GW" },
      { icon: "TrainFront", label: "Land Area", value: "2,900 hectares" },
      { icon: "Users", label: "Homes Powered", value: "2.4 million" },
      { icon: "Settings2", label: "Implementation Mode", value: "IPP (tariff-based)" },
      { icon: "CalendarCheck2", label: "Target Completion", value: "March 2027" },
    ],
    stations: ["Jodhpur", "Bapini", "Bhadla", "Kolayat", "Bikaner"],
    flagged: [
      {
        id: "fr1", iconTone: "amber", icon: "AlertTriangle", title: "Grid Connectivity", impact: "MEDIUM IMPACT", tone: "amber",
        text: "Pooling-station bay commissioning by the state transco may slip by one quarter.",
        evidence: [
          { label: "CTU coordination minutes", detail: "Bay 4 commissioning letter indicates Jul 2026 instead of Apr 2026." },
        ],
      },
      {
        id: "fr2", iconTone: "green", icon: "TrendingUp", title: "Delivery Position", impact: "LOW IMPACT", tone: "green",
        text: "Module supply and erection are ahead of plan; cost tracking below budget.",
        evidence: [
          { label: "EPC progress report", detail: "Module erection 41% vs 37% planned; land fully handed over." },
        ],
      },
    ],
    trajectory: {
      "Physical Progress": {
        unit: "%", yMax: 100,
        planned: [{ x: 0, y: 6 }, { x: 1 / 8, y: 14 }, { x: 2 / 8, y: 22 }, { x: 3 / 8, y: 28 }, { x: 4 / 8, y: 34 }, { x: 5 / 8, y: 38 }, { x: 6 / 8, y: 42 }, { x: 7 / 8, y: 45 }, { x: 1, y: 70 }],
        actual: [{ x: 0, y: 7 }, { x: 1 / 8, y: 15 }, { x: 2 / 8, y: 24 }, { x: 3 / 8, y: 30 }, { x: 4 / 8, y: 36 }, { x: 5 / 8, y: 39 }, { x: 6 / 8, y: 41 }, { x: 7 / 8, y: 41 }],
        milestones: [
          { x: 2 / 8, labelLines: ["Module Supply", "Began"], date: "Jan 2024" },
          { x: 5 / 8, labelLines: ["First 400 MW", "Energized"], date: "Aug 2025" },
          { x: 1, labelLines: ["Full Capacity", "Target"], date: "Mar 2027", accent: true },
        ],
      },
      "Expenditure": {
        unit: "%", yMax: 100,
        planned: [{ x: 0, y: 4 }, { x: 1 / 8, y: 12 }, { x: 2 / 8, y: 20 }, { x: 3 / 8, y: 27 }, { x: 4 / 8, y: 33 }, { x: 5 / 8, y: 37 }, { x: 6 / 8, y: 40 }, { x: 7 / 8, y: 43 }, { x: 1, y: 68 }],
        actual: [{ x: 0, y: 4 }, { x: 1 / 8, y: 13 }, { x: 2 / 8, y: 21 }, { x: 3 / 8, y: 28 }, { x: 4 / 8, y: 34 }, { x: 5 / 8, y: 38 }, { x: 6 / 8, y: 41 }, { x: 7 / 8, y: 44 }],
        milestones: [
          { x: 3 / 8, labelLines: ["Debt Drawdown", "Complete"], date: "Nov 2024" },
          { x: 1, labelLines: ["Outlay", "Target"], date: "Mar 2027", accent: true },
        ],
      },
      "Risk Score": {
        unit: "%", yMax: 100,
        planned: [{ x: 0, y: 35 }, { x: 1 / 8, y: 33 }, { x: 2 / 8, y: 32 }, { x: 3 / 8, y: 31 }, { x: 4 / 8, y: 31 }, { x: 5 / 8, y: 32 }, { x: 6 / 8, y: 33 }, { x: 7 / 8, y: 34 }, { x: 1, y: 35 }],
        actual: [{ x: 0, y: 34 }, { x: 1 / 8, y: 32 }, { x: 2 / 8, y: 30 }, { x: 3 / 8, y: 30 }, { x: 4 / 8, y: 32 }, { x: 5 / 8, y: 34 }, { x: 6 / 8, y: 33 }, { x: 7 / 8, y: 31 }],
        milestones: [
          { x: 4 / 8, labelLines: ["Grid Bay", "Delay Flag"], date: "Jun 2025" },
          { x: 7 / 8, labelLines: ["Current", "Score"], date: "Apr 2026", accent: true },
        ],
      },
      "Key Milestones": {
        unit: "%", yMax: 100,
        planned: [{ x: 0, y: 0 }, { x: 1 / 8, y: 8 }, { x: 2 / 8, y: 20 }, { x: 3 / 8, y: 32 }, { x: 4 / 8, y: 45 }, { x: 5 / 8, y: 58 }, { x: 6 / 8, y: 72 }, { x: 7 / 8, y: 86 }, { x: 1, y: 100 }],
        actual: [{ x: 0, y: 0 }, { x: 1 / 8, y: 8 }, { x: 2 / 8, y: 22 }, { x: 3 / 8, y: 32 }, { x: 4 / 8, y: 47 }, { x: 5 / 8, y: 58 }, { x: 6 / 8, y: 70 }, { x: 7 / 8, y: 78 }],
        milestones: [
          { x: 1 / 8, labelLines: ["PPA", "Signed"], date: "Sep 2023" },
          { x: 4 / 8, labelLines: ["Substation", "Ready"], date: "Jun 2025" },
          { x: 1, labelLines: ["COD", "Target"], date: "Mar 2027", accent: true },
        ],
      },
    },
    financial: {
      originalCost: "\u20b9 6,900 Cr", revisedCost: "\u20b9 6,750 Cr", revisedDelta: -2,
      expenditure: "\u20b9 2,970 Cr", expenditureNote: "(44% of revised cost)",
    },
    schedule: {
      originalCompletion: "March 2027", revisedCompletion: "March 2027", currentPosition: "Ahead of schedule",
    },
    breakdown: [
      { label: "Schedule Risk", value: 12, tone: "amberLight" },
      { label: "Cost Risk", value: 5, tone: "grayLight" },
      { label: "Execution Risk", value: 6, tone: "grayLight" },
      { label: "External Risk", value: 5, tone: "grayLight" },
      { label: "Financial Risk", value: 2, tone: "grayLight" },
      { label: "Other Factors", value: 1, tone: "grayLight" },
    ],
    updates: [
      { id: "ru1", date: "Apr 2026", tone: "orange", icon: "AlertCircle", title: "Bay Commissioning", text: "Pooling-station bay 4 may slip to Jul 2026" },
      { id: "ru2", date: "Mar 2026", tone: "green", icon: "CheckCircle2", title: "Erection Ahead", text: "Module erection at 41% vs 37% planned" },
      { id: "ru3", date: "Feb 2026", tone: "green", icon: "IndianRupee", title: "Cost Savings", text: "Revised cost 2% below original sanction" },
      { id: "ru4", date: "Dec 2025", tone: "blue", icon: "TrendingUp", title: "400 MW Energized", text: "First block feeding the grid since August" },
    ],
    documents: [
      { id: "kd1", name: "Phase IV DPR", meta: "PDF \u00b7 9.8 MB \u00b7 Jun 2023" },
      { id: "kd2", name: "EPC Progress Report", meta: "PDF \u00b7 4.2 MB \u00b7 Apr 2026" },
    ],
    related: [
      { name: "Delhi-Mumbai Expressway (Packages 5-9)", sector: "Roads", risk: 54, progress: 57 },
      { name: "Mumbai-Ahmedabad High Speed Rail", sector: "Railways", risk: 87, progress: 32 },
    ],
    discussion: [
      { author: "R. Iyer", role: "RUMSL Liaison", time: "4 hours ago", text: "Transco has confirmed bay 4 testing slot for July; risk note updated accordingly." },
    ],
  },
];

export const projectIds = PROJECTS.map((p) => ({ id: p.id, name: p.name, sector: p.sector, tags: p.tags }));

// ------------------------------------------------------------
// App chrome text (header + footer) — passed down as props so
// the shared components keep their defaults on other pages.
// ------------------------------------------------------------
export const chrome = {
  brand: { name: "PRAGATI", subLine1: "National Infrastructure", subLine2: "Intelligence" },
  navItems: [
    { label: "Overview", href: "#/dashboard" },
    { label: "Watchlist", href: "#/watchlist" },
    { label: "Projects", href: "#/project" },
    { label: "Early Warnings", href: "#" },
    { label: "Analytics", href: "#/analytics" },
    { label: "Intelligence", href: "#" },
    { label: "Data Update", href: "#" },
  ],
  activeNav: "Projects",
  searchPlaceholder: "Search projects, states, sectors\u2026",
  user: { initials: "AS", name: "A. Sharma", role: "MoSPI Officer" },
  languages: [
    { code: "EN", label: "English" },
    { code: "HI", label: "\u0939\u093f\u0928\u094d\u0926\u0940 (Hindi)" },
  ],
  notificationsTitle: "Notifications",
  notifications: [
    { id: "n1", text: "Risk escalation: Mumbai-Ahmedabad Rail C4 earthworks", time: "12 Apr 2026, 09:20" },
    { id: "n2", text: "New high-risk flag: Chennai Metro Phase II", time: "11 Apr 2026, 17:45" },
    { id: "n3", text: "April 2026 reporting cycle closed — portfolio synced", time: "10 Apr 2026, 08:00" },
  ],
  userMenu: ["My Profile", "Settings", "Sign Out"],
  footer: {
    brand: "PRAGATI",
    subtitle: "National Infrastructure Intelligence",
    taglines: ["Predictive Risk & Governance", "Stronger Projects", "A More Resilient India"],
    legal: ["Privacy", "Terms", "Accessibility", "Help"],
    govLine1: "Government of India",
    govLine2: "MoSPI",
  },
  toasts: {
    navSwitch: "Switched to {nav}.",
    langEn: "Language switched to English",
    langHi: "\u092d\u093e\u0937\u093e \u0939\u093f\u0902\u0926\u0940 \u092e\u0947\u0902 \u092c\u0926\u0932\u0940 \u0917\u0908",
    profile: "Opening your profile\u2026",
    settings: "Opening account settings\u2026",
    signOut: "Signed out.",
  },
};

export const tabs = [
  "Overview",
  "Risk Analysis",
  "Financials",
  "Schedule",
  "Progress",
  "Geography",
  "Documents",
  "Related Projects",
  "Discussion",
];

// ------------------------------------------------------------
// Page-level UI copy (tab bar, section titles, links, toasts)
// ------------------------------------------------------------
export const ui = {
  breadcrumb: { home: "Home", projects: "Projects", toast: "Back to Projects list." },

  tabs,
  tabActions: {
    addToWatchlist: "Add to Watchlist",
    onWatchlist: "On Watchlist",
    addedToast: "Added to your watchlist.",
    removedToast: "Removed from watchlist.",
    downloadReport: "Download Report",
    downloadOptions: ["PDF summary", "Full DPR (PDF)", "Data export (CSV)"],
    downloadToast: "Preparing {option}\u2026",
    downloadDone: "{option} downloaded.",
    share: "Share",
    shareToast: "Share link copied to clipboard.",
    shareError: "Copy not available in this browser.",
    tabToast: "Switched to {tab} tab.",
  },

  search: {
    resultsTitle: "Projects",
    noResults: "No projects match your search.",
    selectToast: "Opened {name}.",
  },

  flagged: {
    title: "Why is this project flagged?",
    subtitle: "Key factors contributing to the elevated risk score, based on model analysis and latest data.",
    viewDetailed: "View Detailed Analysis",
    viewDetailedToast: "Opening detailed risk analysis\u2026",
    viewEvidence: "View Evidence",
    evidenceToast: "Opening evidence for {title}\u2026",
  },

  glance: { title: "Project at a Glance" },

  corridor: {
    title: "Project Corridor",
    viewOnMap: "View on Map",
    viewOnMapToast: "Opening full corridor map\u2026",
    expandToast: "Expanding map view\u2026",
    legendStation: "Station",
    legendAlignment: "Project Alignment",
    mapTitle: "Project Corridor \u2014 {name}",
  },

  trajectory: {
    title: "Project Trajectory",
    legend: { planned: "Planned", actual: "Actual", milestone: "Milestone" },
  },

  financial: {
    title: "Financial Information",
    labels: { original: "Original Cost", revised: "Revised Cost", expenditure: "Expenditure (Till Apr 2026)" },
  },

  schedule: {
    title: "Schedule Information",
    labels: { original: "Original Completion", revised: "Revised Completion", current: "Current Position" },
  },

  breakdown: { title: "Risk Score Breakdown", detailToast: "Opening {label} detail\u2026" },

  updates: {
    title: "Recent Updates",
    viewAll: "View All",
    viewAllToast: "Opening full update history\u2026",
    allTitle: "All Updates",
  },

  documents: {
    title: "Key Documents",
    viewAll: "View All",
    viewAllToast: "Opening full document library\u2026",
    allTitle: "Document Library",
    downloadToast: "Downloading {name}\u2026",
  },

  riskCard: {
    title: "RISK SCORE",
    scoredLabel: "Scored:",
    modelLabel: "Model:",
    howLabel: "How is this score calculated?",
    howToast: "Opening risk model methodology\u2026",
    howTitle: "Risk Model Methodology",
    methodology: {
      intro: "The PRAGATI risk score is a weighted composite of six factor groups, scored 0\u2013100 by model {model} against schedule, cost, execution and external signals from the latest reporting month ({month}).",
      factors: [
        "Schedule Risk \u2014 baseline variance across civil packages and milestone slippage.",
        "Cost Risk \u2014 revised-vs-original sanction gap and index escalation.",
        "Execution Risk \u2014 contractor mobilization and right-of-way status.",
        "External Risk \u2014 land, court stays, environmental and utility dependencies.",
        "Financial Risk \u2014 drawdown pace against the phased outlay plan.",
        "Other Factors \u2014 model residual signals and analyst overrides.",
      ],
      out: "Scores above 70 are classified HIGH RISK, 40\u201369 MEDIUM, and below 40 LOW. Scores refresh with every monthly data cycle.",
    },
  },

  related: {
    title: "Related Projects",
    columns: { project: "Project", sector: "Sector", risk: "Risk Score", progress: "Progress" },
    openToast: "Opened {name}.",
  },

  discussion: {
    title: "Discussion",
    newPlaceholder: "Add an update to the discussion thread\u2026",
    post: "Post",
    emptyToast: "Write something before posting.",
    postedToast: "Posted to the discussion thread.",
  },

  panels: {
    sectionNote: "This view is generated from the live mock data record for this project.",
  },
};

// Per-tab panel configuration: which blocks render on each tab.
// Overview keeps the signature three-column dashboard; other tabs
// render focused, data-driven sections.
export const tabPanels = {
  "Risk Analysis": ["riskSummary", "flagged", "breakdown"],
  "Financials": ["financial", "trajectory"],
  "Schedule": ["schedule", "trajectory"],
  "Progress": ["trajectory", "updates"],
  "Geography": ["map"],
  "Documents": ["documents"],
  "Related Projects": ["related"],
  "Discussion": ["discussion"],
};
