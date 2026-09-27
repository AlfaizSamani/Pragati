export function parseCost(costExposure) {
  // "₹ 12,480 Cr" -> 12480
  const digits = costExposure.replace(/[^\d]/g, "");
  return Number(digits) || 0;
}

export function sortProjects(projects, sortOrder) {
  const list = [...projects];
  switch (sortOrder) {
    case "Risk Score (High to Low)":
      return list.sort((a, b) => b.riskScore - a.riskScore);
    case "Risk Score (Low to High)":
      return list.sort((a, b) => a.riskScore - b.riskScore);
    case "Cost Exposure (High to Low)":
      return list.sort((a, b) => parseCost(b.costExposure) - parseCost(a.costExposure));
    case "Last Updated":
      return list.sort((a, b) => a.lastUpdated.localeCompare(b.lastUpdated));
    default:
      return list;
  }
}
