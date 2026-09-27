import React from "react";
import PageSwitcher, { useHashRoute, ROUTES } from "./components/PageSwitcher";
import LandingPage from "./pages/LandingPage";
import NationalDashboard from "./pages/NationalDashboard";
import WatchlistPage from "./pages/WatchlistPage";
import ProjectDetailInner from "./pages/ProjectDetailInner";
import Analytics from "./pages/Analytics";
import Intelligence from "./pages/Intelligence";
import DataUpdate from "./pages/DataUpdate";
import EarlyWarnings from "./pages/EarlyWarnings";
import AccessPage from "./pages/AccessPage";
import { LanguageProvider } from "./context/LanguageContext";
/**
 * PRAGATI — 4 pages, one app.
 *
 *   #/           Landing (marketing / home)
 *   #/dashboard  National Infrastructure Dashboard (Overview)
 *   #/watchlist  Priority Watchlist
 *   #/project    Project Detail (Mumbai–Ahmedabad High Speed Rail)
 *
 * All four pages live here as one bundle so shared components
 * (brand, emblem, data conventions) stay consistent, and every
 * cross-page connection is a real in-app route.
 */
export default function App() {
const route = useHashRoute();

  return (
    <LanguageProvider>
    <React.Fragment>
      {route === "landing" && <LandingPage />}
      {route === "dashboard" && <NationalDashboard />}
      {route === "watchlist" && <WatchlistPage />}
      {route === "project" && <ProjectDetailInner />}
      {route === "analytics" && <Analytics />}
      {route === "intelligence" && <Intelligence />}
      {route === "data-update" && <DataUpdate />}
      {route === "early-warnings" && <EarlyWarnings />}
      {(route === "signin" || route === "request-access") && <AccessPage />}

      {/* The floating switcher is the in-app cross-page connector. */}
      <PageSwitcher active={route} />
    </React.Fragment>
    </LanguageProvider>
  );
}

export { ROUTES };
