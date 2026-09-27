import { NAV } from "../../data/analyticsData";

const ROUTES = {
  Overview: "#/dashboard",
  Watchlist: "#/watchlist",
  Projects: "#/project",
  "Early Warnings": "#/early-warnings",
  Analytics: "#/analytics",
  Intelligence: "#/intelligence",
  "Data Update": "#/data-update",
};

export default function Navigation({ active, onSelect }) {
  return (
    <nav className="nav">
      {NAV.map((n) => (
        <a
          key={n}
          href={ROUTES[n] || "#"}
          className={n === active ? "active" : ""}
          onClick={(e) => {
            e.preventDefault();

            if (ROUTES[n]) {
              window.location.hash = ROUTES[n];
            }

            if (onSelect) {
              onSelect(n);
            }
          }}
        >
          {n}
        </a>
      ))}
    </nav>
  );
}