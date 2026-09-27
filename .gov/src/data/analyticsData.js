/* All content/data for the dashboard, separated from presentation. */
export const NAV = ["Overview","Watchlist","Projects","Early Warnings","Analytics","Intelligence","Data Update"];

export const TABS = ["Sector Analysis","Ministry Analysis","State Analysis","Portfolio Trends"];

export const PERIODS = [
  {label:"Last 2 Months", months:2},
  {label:"Last 3 Months", months:3},
  {label:"Last 6 Months", months:6},
  {label:"Last 12 Months", months:12},
  {label:"Last 24 Months", months:24}
];
export const COMPARE = ["Previous Period","Previous Year","Baseline (FY 2023-24)","No Comparison"];

export const STATES = ["All States",
"Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
"Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
"Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
"Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
"Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu","Delhi",
"Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry"];

export const SECTORS = [
 {name:"Road Transport",       color:"#2E7CC4", total:426, hc:142, hcTxt:"142 (33%)", value:12.4, risk:72, dir:"up",   trend:"+14%"},
 {name:"Railways",             color:"#F0942C", total:319, hc:98,  hcTxt:"98 (31%)",  value:8.9,  risk:58, dir:"up",   trend:"+10%"},
 {name:"Urban Infrastructure", color:"#27A567", total:284, hc:76,  hcTxt:"76 (27%)",  value:6.7,  risk:46, dir:"up",   trend:"+18%"},
 {name:"Energy",               color:"#E0483B", total:248, hc:62,  hcTxt:"62 (25%)",  value:5.1,  risk:42, dir:"up",   trend:"+8%"},
 {name:"Water Resources",      color:"#A855C7", total:160, hc:34,  hcTxt:"34 (21%)",  value:3.8,  risk:38, dir:"up",   trend:"+6%"},
 {name:"Ports",                color:"#17A8B8", total:124, hc:22,  hcTxt:"22 (18%)",  value:2.9,  risk:35, dir:"down", trend:"-4%"},
 {name:"Airports",             color:"#8296AC", total:89,  hc:16,  hcTxt:"16 (18%)",  value:2.1,  risk:32, dir:"down", trend:"-6%"},
 {name:"Others",               color:"#A3AEBB", total:123, hc:18,  hcTxt:"18 (15%)",  value:2.8,  risk:28, dir:"down", trend:"-8%"}
];


export const MINISTRIES = [
 {name:"Road Transport & Highways",   color:"#2E7CC4", total:426, hc:142, hcTxt:"142 (33%)", value:12.4, risk:72, dir:"up",   trend:"+14%"},
 {name:"Railways",                    color:"#F0942C", total:319, hc:98,  hcTxt:"98 (31%)",  value:8.9,  risk:58, dir:"up",   trend:"+10%"},
 {name:"Housing & Urban Affairs",     color:"#27A567", total:284, hc:76,  hcTxt:"76 (27%)",  value:6.7,  risk:46, dir:"up",   trend:"+18%"},
 {name:"Power",                       color:"#E0483B", total:248, hc:62,  hcTxt:"62 (25%)",  value:5.1,  risk:42, dir:"up",   trend:"+8%"},
 {name:"Jal Shakti",                  color:"#A855C7", total:160, hc:34,  hcTxt:"34 (21%)",  value:3.8,  risk:38, dir:"up",   trend:"+6%"},
 {name:"Ports, Shipping & Waterways", color:"#17A8B8", total:124, hc:22,  hcTxt:"22 (18%)",  value:2.9,  risk:35, dir:"down", trend:"-4%"},
 {name:"Civil Aviation",              color:"#8296AC", total:89,  hc:16,  hcTxt:"16 (18%)",  value:2.1,  risk:32, dir:"down", trend:"-6%"},
 {name:"Other Ministries",            color:"#A3AEBB", total:123, hc:18,  hcTxt:"18 (15%)",  value:2.8,  risk:28, dir:"down", trend:"-8%"}
];

export const STATE_ANALYSIS = [
 {name:"Maharashtra",    color:"#2E7CC4", total:298, hc:88, hcTxt:"88 (30%)", value:9.6, risk:68, dir:"up",   trend:"+12%"},
 {name:"Uttar Pradesh",  color:"#F0942C", total:246, hc:71, hcTxt:"71 (29%)", value:7.2, risk:61, dir:"up",   trend:"+9%"},
 {name:"Tamil Nadu",     color:"#27A567", total:198, hc:48, hcTxt:"48 (24%)", value:5.4, risk:49, dir:"up",   trend:"+15%"},
 {name:"Karnataka",      color:"#E0483B", total:176, hc:41, hcTxt:"41 (23%)", value:4.6, risk:44, dir:"up",   trend:"+7%"},
 {name:"Andhra Pradesh", color:"#A855C7", total:154, hc:33, hcTxt:"33 (21%)", value:3.9, risk:41, dir:"up",   trend:"+5%"},
 {name:"Gujarat",        color:"#17A8B8", total:142, hc:26, hcTxt:"26 (18%)", value:3.1, risk:36, dir:"down", trend:"-3%"},
 {name:"West Bengal",    color:"#8296AC", total:118, hc:19, hcTxt:"19 (16%)", value:2.3, risk:31, dir:"down", trend:"-5%"},
 {name:"Other States",   color:"#A3AEBB", total:441, hc:61, hcTxt:"61 (14%)", value:2.6, risk:26, dir:"down", trend:"-9%"}
];

export const PORTFOLIO_TRENDS = [
 {name:"Q2 FY 2026-27", color:"#2E7CC4", total:1773, hc:301, hcTxt:"301 (17%)", value:38.7, risk:54, dir:"up",   trend:"+6%"},
 {name:"Q1 FY 2026-27", color:"#F0942C", total:1712, hc:278, hcTxt:"278 (16%)", value:36.4, risk:51, dir:"up",   trend:"+4%"},
 {name:"Q4 FY 2025-26", color:"#27A567", total:1649, hc:255, hcTxt:"255 (15%)", value:34.2, risk:49, dir:"up",   trend:"+3%"},
 {name:"Q3 FY 2025-26", color:"#E0483B", total:1588, hc:231, hcTxt:"231 (15%)", value:32.5, risk:47, dir:"down", trend:"-2%"},
 {name:"Q2 FY 2025-26", color:"#A855C7", total:1534, hc:219, hcTxt:"219 (14%)", value:30.8, risk:48, dir:"up",   trend:"+2%"},
 {name:"Q1 FY 2025-26", color:"#17A8B8", total:1487, hc:208, hcTxt:"208 (14%)", value:29.1, risk:47, dir:"up",   trend:"+1%"}
];

/* which dataset + labels the bottom row uses per active tab */
export const TAB_CONFIG = {
  "Sector Analysis":  { rows: SECTORS,         labelHeader: "Sector",   perfTitle: "Sector Performance",          pvTitle: "Portfolio Value by Sector" },
  "Ministry Analysis":{ rows: MINISTRIES,      labelHeader: "Ministry", perfTitle: "Ministry Performance",        pvTitle: "Portfolio Value by Ministry" },
  "State Analysis":   { rows: STATE_ANALYSIS,  labelHeader: "State",    perfTitle: "State Performance",           pvTitle: "Portfolio Value by State" },
  "Portfolio Trends": { rows: PORTFOLIO_TRENDS,labelHeader: "Period",   perfTitle: "Portfolio Trend Summary",     pvTitle: "Portfolio Value by Quarter" },
};
/* anchor values (bi-monthly, Apr 2024 -> Apr 2026) for the six charted sectors */
export const TREND = [
 {name:"Road Transport",       color:"#2E7CC4", a:[44,50,48,52,55,57,58,60,62,64,66,70,72]},
 {name:"Railways",             color:"#F0942C", a:[38,42,40,43,45,46,48,50,52,53,55,57,58]},
 {name:"Urban Infrastructure", color:"#27A567", a:[22,24,26,28,30,31,33,35,37,39,41,44,46]},
 {name:"Energy",               color:"#E0483B", a:[30,33,31,34,35,36,37,37,38,39,40,41,42]},
 {name:"Water Resources",      color:"#A855C7", a:[27,29,30,31,32,33,34,35,35,36,37,37,38]},
 {name:"Ports",                color:"#17A8B8", a:[20,22,23,25,26,27,29,30,31,32,33,34,35]}
];

export const TOP_PROJECTS = [
 {n:"Mumbai-Ahmedabad HSR",      s:"Railways",       st:"Maharashtra",    sc:87},
 {n:"Chennai Metro Phase III",   s:"Urban Infrastructure", st:"Tamil Nadu", sc:84},
 {n:"Bengaluru Suburban Rail",   s:"Railways",       st:"Karnataka",      sc:82},
 {n:"Delhi-Mumbai Expressway",   s:"Road Transport", st:"Maharashtra",    sc:79},
 {n:"Eastern Freight Corridor",  s:"Railways",       st:"Bihar",          sc:76},
 {n:"Amaravati Capital Region",  s:"Urban Infrastructure", st:"Andhra Pradesh", sc:74},
 {n:"Hyderabad Outer Ring Road", s:"Road Transport", st:"Telangana",      sc:72},
 {n:"Pune Metro Phase II",       s:"Urban Infrastructure", st:"Maharashtra", sc:71},
 {n:"RRTS Delhi-Ghaziabad",      s:"Urban Infrastructure", st:"Delhi",     sc:69},
 {n:"Vizag Port Expansion",      s:"Ports",          st:"Andhra Pradesh", sc:68},
 {n:"Navi Mumbai Airport Link",  s:"Airports",       st:"Maharashtra",    sc:66},
 {n:"Polavaram Irrigation",      s:"Water Resources",st:"Andhra Pradesh", sc:65},
 {n:"Ganga Expressway",          s:"Road Transport", st:"Uttar Pradesh",  sc:63},
 {n:"Kochi Water Metro Ph II",   s:"Urban Infrastructure", st:"Kerala",   sc:61},
 {n:"Talcher Fertiliser Grid",   s:"Energy",         st:"Odisha",         sc:60},
 {n:"Bhadbhut Barrage",          s:"Water Resources",st:"Gujarat",        sc:58},
 {n:"Jewar Airport Phase II",    s:"Airports",       st:"Uttar Pradesh",  sc:57},
 {n:"Paradip Port Deepening",    s:"Ports",          st:"Odisha",         sc:55},
 {n:"Pakyong Grid Extension",    s:"Energy",         st:"Sikkim",         sc:53},
 {n:"Guwahati Ring Road",        s:"Road Transport", st:"Assam",          sc:52}
];

export const DIST = {
  count:{ center:"1,773", caption:"Projects", sub:"Across all monitored projects",
    rows:[ {n:"Critical",c:"#D93A2B",p:8, v:"142"},{n:"High",c:"#EE7A2A",p:17,v:"301"},
           {n:"Medium",c:"#F2B01E",p:46,v:"816"},{n:"Low",c:"#2E9E58",p:29,v:"514"} ]},
  value:{ center:"₹38.7", caption:"Lakh Cr", sub:"Share of portfolio value at risk",
    rows:[ {n:"Critical",c:"#D93A2B",p:12,v:"₹ 4.6 Lakh Cr"},{n:"High",c:"#EE7A2A",p:21,v:"₹ 8.1 Lakh Cr"},
           {n:"Medium",c:"#F2B01E",p:42,v:"₹ 16.3 Lakh Cr"},{n:"Low",c:"#2E9E58",p:25,v:"₹ 9.7 Lakh Cr"} ]}
};

export const INSIGHTS = [
 'Transport sector accounts for <b>58%</b> of all high-risk projects, with risk scores increasing by <b>18%</b> from previous period.',
 'Cost escalation is the primary driver of risk in <b>67%</b> of Energy sector projects.',
 'Urban Infrastructure shows highest deterioration rate <b>(+24%)</b> this month.',
 '<b>5 states</b> account for <b>62%</b> of all critical and high-risk projects.'
];

export const INITIAL_NOTIFS = [
 {c:"#D93A2B", t:"Mumbai-Ahmedabad HSR crossed a risk score of 85 — escalation review due.", w:"12 min ago", read:false},
 {c:"#EE7A2A", t:"14 Urban Infrastructure projects deteriorated in the April 2026 cycle.", w:"2 hours ago", read:false},
 {c:"#2E9E58", t:"April 2026 reporting cycle data is now published for all ministries.", w:"Yesterday", read:false},
 {c:"#8296AC", t:"Quarterly portfolio summary for Q4 FY 2025-26 is ready to download.", w:"3 days ago", read:true}
];

export const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/* monthly interpolation of the bi-monthly anchors -> 25 monthly points (Apr 2024 .. Apr 2026) */
export function monthly(anchors) {
  const out = [];
  for (let i = 0; i < anchors.length - 1; i++) {
    out.push(anchors[i]);
    out.push((anchors[i] + anchors[i + 1]) / 2);
  }
  out.push(anchors[anchors.length - 1]);
  return out;
}

export const SERIES = TREND.map((s) => ({ name: s.name, color: s.color, m: monthly(s.a) }));

/* label for monthly index (0 = Apr 2024) */
export function monthLabel(i) {
  const m = (3 + i) % 12;
  const y = 2024 + Math.floor((3 + i) / 12);
  return `${MONTHS[m]} ${y}`;
}

export const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/* score -> pill colour used in the Top 10 table */
export function scoreColor(sc) {
  if (sc >= 85) return "#D93A2B";
  if (sc >= 80) return "#DF5326";
  if (sc >= 75) return "#E87029";
  if (sc >= 70) return "#EE8327";
  if (sc >= 65) return "#F09425";
  return "#F2A423";
}
