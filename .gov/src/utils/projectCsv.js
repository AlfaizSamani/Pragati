// Builds a CSV export of a project record for the
// "Data export (CSV)" download option.

function csvField(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function buildProjectCsv(project) {
  const rows = [];
  rows.push(["Section", "Field", "Value"]);
  rows.push(["Project", "Name", project.name]);
  rows.push(["Project", "Sector", project.sector]);
  rows.push(["Project", "Tags", project.tags.join(" | ")]);
  project.meta.forEach((m) => rows.push(["Meta", m.primary, m.secondary]));
  rows.push(["Risk", "Score", `${project.riskScore.value}%`]);
  rows.push(["Risk", "Level", project.riskScore.level]);
  rows.push(["Risk", "Change", `${project.riskScore.delta > 0 ? "+" : ""}${project.riskScore.delta}%`]);
  project.glance.forEach((g) => rows.push(["Glance", g.label, g.value]));
  rows.push(["Financial", "Original Cost", project.financial.originalCost]);
  rows.push(["Financial", "Revised Cost", project.financial.revisedCost]);
  rows.push(["Financial", "Expenditure", project.financial.expenditure]);
  rows.push(["Schedule", "Original Completion", project.schedule.originalCompletion]);
  rows.push(["Schedule", "Revised Completion", project.schedule.revisedCompletion]);
  rows.push(["Schedule", "Current Position", project.schedule.currentPosition]);
  project.breakdown.forEach((b) => rows.push(["Risk Breakdown", b.label, `${b.value}%`]));
  project.flagged.forEach((f) => rows.push(["Flagged Factor", f.title, f.text]));
  project.updates.forEach((u) => rows.push(["Update", `${u.date} - ${u.title}`, u.text]));
  project.documents.forEach((d) => rows.push(["Document", d.name, d.meta]));
  project.stations.forEach((s) => rows.push(["Corridor", "Station", s]));

  return new Blob([rows.map((r) => r.map(csvField).join(",")).join("\n")], {
    type: "text/csv;charset=utf-8",
  });
}
