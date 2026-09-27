import { useEffect, useMemo, useState } from 'react'
import "../styles/earlyWarnings.css";
import "../styles/earlyWarningsOverrides.css";
import GlobalHeader from "../components/common/GlobalHeader";
import GlobalFooter from "../components/common/GlobalFooter";
import heroMountainsUrl from "../assets/hero-mountains.jpg";
import DashboardHero from "../components/common/DashboardHero";
import { api } from "../services/apiClient";

const typeColors = { 'Risk Increase': '#d32f2f', 'New High Risk': '#ed6c02', 'Persistent Risk': '#f2b705', 'Risk Transition': '#0288d1', 'Data Update': '#9aa5b1' }
const warningMarkers = { 'Risk Increase': '!', 'New High Risk': '!', 'Persistent Risk': '•', 'Risk Transition': '↕', 'Data Update': '▤' }
const typeNames = ['Risk Increase', 'New High Risk', 'Persistent Risk', 'Risk Transition', 'Data Update']
const tabs = ['All Warnings', ...typeNames]

function Icon({ name, size = 17 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>,
    bulb: <><path d="M9 18h6M10 21h4" /><path d="M8.2 14.5A6 6 0 1 1 15.8 14.5c-.9.8-1.4 1.7-1.6 2.5h-4.4c-.2-.8-.7-1.7-1.6-2.5Z" /><path d="M12 2v2M4.9 4.9l1.4 1.4M19.1 4.9l-1.4 1.4" /></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    filter: <polygon points="4 4 20 4 14 13 14 19 10 21 10 13 4 4" />,
    down: <polyline points="6 9 12 15 18 9" />,
    alert: <><path d="M10.3 3.8 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" /><line x1="12" y1="8" x2="12" y2="13" /><circle cx="12" cy="16.5" r=".7" fill="currentColor" /></>,
    trend: <><polyline points="4 16 9 11 13 14 20 6" /><polyline points="15 6 20 6 20 11" /></>,
    data: <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 4 6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-6-4-9s1.5-6.4 4-9Z" /></>,
    close: <><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function Header({ query, setQuery }) {
  return <GlobalHeader activeId="early-warnings" searchValue={query} onSearchChange={setQuery} />;
}
function Filters({ filters, setFilters, onApply, onReset }) {
  const types = ['Risk Increase', 'New High Risk', 'Persistent Risk', 'Risk Transition', 'Data Update']
  const [openFilter, setOpenFilter] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const optionGroups = [
    ['period', 'Time Period', ['Last 30 Days', 'Last 7 Days', 'Last 90 Days']],
    ['state', 'State', filters.availableStates || ['All States']],
    ['sector', 'Sector', filters.availableSectors || ['All Sectors']],
    ['ministry', 'Ministry / Agency', filters.availableMinistries || ['All Ministries']],
    ['risk', 'Risk Level', ['All Risk Levels', 'HIGH', 'MEDIUM', 'LOW', 'CRITICAL', 'INFO']]
  ]
  return (
    <aside className={`card filters-card ${filtersOpen ? 'is-open' : ''}`}>
      <div className="filters-head">
        <div className="filter-actions">
          <button className="apply-filter-trigger" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}>
            Apply Filters <Icon name="down" size={11} />
          </button>
          <button className="filter-reset-trigger" onClick={onReset}>Reset All</button>
        </div>
      </div>
      {filtersOpen && (
        <>
          <button className="filter-backdrop" aria-label="Close filters" onClick={() => setFiltersOpen(false)} />
          <div className="filters-panel">
            <div className="panel-head">
              <span>Filter project warnings</span>
              <div className="panel-actions">
                <button className="reset-link" onClick={onReset}>Reset All</button>
                <button className="panel-close" onClick={() => setFiltersOpen(false)}><Icon name="close" size={14} /> Close</button>
              </div>
            </div>
            <div className="filter-block filter-types">
              <span className="filter-label">Warning Type</span>
              <div className="type-buttons">
                {types.map((type) => (
                  <label className="check-row" key={type}>
                    <input
                      type="checkbox"
                      checked={filters.types.includes(type)}
                      onChange={() => update('types', filters.types.includes(type) ? filters.types.filter((item) => item !== type) : [...filters.types, type])}
                    />
                    <span className="type-icon" style={{ color: typeColors[type] }}>●</span>
                    <span className="lbl">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="filter-button-grid">
              {optionGroups.map(([key, label, options]) => (
                <div className="filter-block filter-button-wrap" key={key}>
                  <span className="filter-label">{label}</span>
                  <button type="button" className={`filter-trigger ${openFilter === key ? 'open' : ''}`} onClick={() => setOpenFilter(openFilter === key ? null : key)}>
                    <span>{filters[key]}</span>
                    <Icon name="down" size={12} />
                  </button>
                  {openFilter === key && (
                    <div className="filter-options">
                      {options.map((option) => (
                        <button type="button" className={filters[key] === option ? 'selected' : ''} key={option} onClick={() => { update(key, option); setOpenFilter(null) }}>
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <label className="filter-block">
              <span className="filter-label">Keyword Search</span>
              <span className="search-input">
                <Icon name="search" size={14} />
                <input value={filters.keyword} onChange={(event) => update('keyword', event.target.value)} placeholder="Search projects, locations..." />
              </span>
            </label>
            <button className="apply-btn" onClick={() => { onApply(); setFiltersOpen(false) }}>
              <Icon name="filter" size={14} /> Apply Filters
            </button>
          </div>
        </>
      )}
    </aside>
  )
}

function WarningCard({ warning, read, onView, onMenu }) {
  const isDataUpdate = warning.type === 'Data Update';
  const openTarget = () => onView(warning);
  return <article className={`warning-card card ${read ? 'read' : ''}`}><div className="wc-time"><span className="date">{warning.date}</span><span className="time">{warning.time}</span><span className="dot" style={{ background: warning.color }} /></div><div className="wc-status"><div className="wc-status-top"><span className="status-icon" style={{ background: `${warning.color}18`, color: warning.color }}>{warningMarkers[warning.type]}</span><span className="status-text" style={{ color: warning.color }}>{warning.type}</span></div><span className={`badge ${warning.severity.toLowerCase()}`}>{warning.severity}</span></div><div className="wc-content"><p className="proj-title"><span className="project-icon" style={{ color: warning.color, background: `${warning.color}18` }}><Icon name={isDataUpdate ? 'data' : warning.type === 'Risk Transition' ? 'trend' : 'alert'} size={12} /></span>{warning.project}</p><p className="proj-sub">{warning.ministry} | {warning.state}</p><p className="proj-desc">{warning.description}</p></div><div className="wc-actions"><button className="view-link" onClick={openTarget}>View {isDataUpdate ? 'Details' : 'Project'} <Icon name="arrow" size={12} /></button><button className="kebab" onClick={() => onMenu(warning)} aria-label={`Actions for ${warning.project}`}>•••</button></div></article>
}

function Trends() { return <div className="widget card"><div className="widget-head"><strong>Warning Trends</strong><button className="widget-link" onClick={() => alert('Analytics dashboard demo opened')}>View Analytics <Icon name="arrow" size={10} /></button></div><div className="trend-chart">{Array.from({ length: 20 }, (_, index) => <span key={index} className="trend-bar" style={{ height: `${35 + ((index * 17) % 62)}%` }}><i /><b /><em /></span>)}</div><div className="legend-list inline-legend">{[['Critical', '#d32f2f'], ['High', '#ed6c02'], ['Medium', '#f2b705'], ['Low', '#2e7d32']].map(([label, color]) => <span className="legend-row" key={label}><span className="legend-sq" style={{ background: color }} />{label}</span>)}</div></div> }
function Donut({ warnings }) {
  const total = warnings.length;
  const counts = typeNames.map(name => {
    const cnt = warnings.filter(w => w.type === name).length;
    return [name, cnt, total > 0 ? Math.round((cnt / total) * 100) : 0];
  });
  return <div className="widget card"><div className="widget-head"><strong>Warnings by Type</strong></div><div className="donut-layout"><div className="donut"><span><b>{total}</b>Warnings</span></div><div className="legend-list">{counts.map(([label, count, percentage]) => <div className="legend-row" key={label}><span className="legend-sq" style={{ background: typeColors[label] }} /><span className="lg-label">{label}</span><b>{percentage}%</b><small>({count})</small></div>)}</div></div></div>;
}
function Insights({ warnings, onOpen }) {
  const sectorCounts = {};
  const stateCounts = {};
  let scheduleIssues = 0;
  warnings.forEach(w => {
    sectorCounts[w.sector] = (sectorCounts[w.sector] || 0) + 1;
    stateCounts[w.state] = (stateCounts[w.state] || 0) + 1;
    if (w.type === 'Risk Increase') scheduleIssues++;
  });
  const topSector = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1])[0];
  const topStates = Object.entries(stateCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const topSectorPct = warnings.length > 0 && topSector ? Math.round((topSector[1] / warnings.length) * 100) : 0;
  const riskIncreasePct = warnings.length > 0 ? Math.round((scheduleIssues / warnings.length) * 100) : 0;
  const insights = [
    topSector ? `${topSectorPct}% of warnings this cycle are in the ${topSector[0]} sector.` : 'No sector data available.',
    `Risk Increase signals account for ${riskIncreasePct}% of all active warnings.`,
    topStates.length > 0 ? `${topStates.map(s => s[0]).join(', ')} have the highest concentration of warning signals.` : 'No state concentration data available.',
  ];
  return <div className="widget card"><div className="widget-head"><strong>Key Insights</strong><button className="widget-link" onClick={onOpen}>View Detailed Analysis <Icon name="arrow" size={10} /></button></div>{insights.map((text, index) => <div className="insight-item" key={index}><span className="insight-num">{index + 1}</span><span className="insight-text">{text}</span></div>)}</div>;
}

function Modal({ title, children, onClose }) { return <div className="modal-backdrop" onClick={onClose}><div className="modal card" onClick={(event) => event.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button className="close-btn" onClick={onClose}><Icon name="close" /></button></div>{children}</div></div> }

export default function EarlyWarnings() {
  const [warnings, setWarnings] = useState([])
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('All Warnings')
  const [sort, setSort] = useState('Most Recent')
  const [readIds, setReadIds] = useState([])
  const initFilters = { period: 'Last 30 Days', types: [...typeNames], state: 'All States', sector: 'All Sectors', ministry: 'All Ministries', risk: 'All Risk Levels', keyword: '', availableStates: ['All States'], availableSectors: ['All Sectors'], availableMinistries: ['All Ministries'] }
  const [filters, setFilters] = useState(initFilters)
  const [appliedFilters, setAppliedFilters] = useState(initFilters)
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const month = import.meta.env.VITE_REPORTING_MONTH || '2026-06'
    Promise.all([api.alerts(month), api.projects(month)])
      .then(([alerts, projects]) => {
        const projectById = new Map(projects.map((project) => [String(project.id), project]))
        const typeByAlert = { cost_escalation: 'Risk Increase', schedule_delay: 'Risk Increase', progress_stall: 'Persistent Risk' }
        const colorByType = { 'Risk Increase': '#d32f2f', 'Persistent Risk': '#f2b705' }
        const mapped = alerts.slice(0, 250).map((alert, index) => {
          const project = projectById.get(String(alert.projectId))
          const type = typeByAlert[alert.type] || 'Risk Increase'
          return {
            id: alert.id || index,
            projectId: alert.projectId,
            date: alert.reportingMonth || month,
            time: 'Reporting cycle',
            type,
            severity: String(alert.riskTier || 'INFO').toUpperCase(),
            color: colorByType[type] || '#607080',
            state: project?.state || 'Not reported',
            sector: project?.sector || 'Not reported',
            ministry: project?.ministry || 'Not reported',
            project: project?.name || String(alert.projectId),
            description: `${alert.message} Persistence: ${alert.persistenceMonths} month(s).`,
          }
        })
        setWarnings(mapped)
        // Build dynamic filter options from loaded data
        const states = ['All States', ...Array.from(new Set(mapped.map(w => w.state).filter(Boolean))).sort()]
        const sectors = ['All Sectors', ...Array.from(new Set(mapped.map(w => w.sector).filter(Boolean))).sort()]
        const ministries = ['All Ministries', ...Array.from(new Set(mapped.map(w => w.ministry).filter(Boolean))).sort()]
        setFilters(prev => ({ ...prev, availableStates: states, availableSectors: sectors, availableMinistries: ministries }))
        setAppliedFilters(prev => ({ ...prev, availableStates: states, availableSectors: sectors, availableMinistries: ministries }))
      })
      .catch((error) => setLoadError(error.message))
  }, [])

  const filteredWarnings = useMemo(() => warnings.filter((warning) => {
    const text = `${warning.project} ${warning.state} ${warning.sector} ${warning.ministry}`.toLowerCase()
    const search = `${query} ${appliedFilters.keyword}`.trim().toLowerCase()
    return (activeTab === 'All Warnings' || warning.type === activeTab) && appliedFilters.types.includes(warning.type) && (appliedFilters.state === 'All States' || warning.state === appliedFilters.state) && (appliedFilters.sector === 'All Sectors' || warning.sector === appliedFilters.sector) && (appliedFilters.ministry === 'All Ministries' || warning.ministry === appliedFilters.ministry) && (appliedFilters.risk === 'All Risk Levels' || warning.severity === appliedFilters.risk) && (!search || text.includes(search))
  }).sort((a, b) => sort === 'Most Recent' ? b.id - a.id : a.project.localeCompare(b.project)), [warnings, activeTab, appliedFilters, query, sort])

  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2600) }
  const openWarningTarget = (item) => {
    if (item.type === 'Data Update') {
      window.location.hash = '#/data-update';
      return;
    }
    if (item.projectId) {
      window.location.hash = `#/project?id=${item.projectId}`;
      return;
    }
    setModal({ type: 'warning', item });
  }
  const resetFilters = () => { const reset = { ...initFilters, availableStates: filters.availableStates, availableSectors: filters.availableSectors, availableMinistries: filters.availableMinistries }; setFilters(reset); setAppliedFilters(reset); setActiveTab('All Warnings') }
  const markAllRead = () => { setReadIds(warnings.map((warning) => warning.id)); notify('All visible warnings marked as read') }

  return (
    <div className="early-warnings-page">
      <Header query={query} setQuery={setQuery} />
      <DashboardHero
        title="Early Warnings"
        subtitle="Real-time signals from across India's infrastructure portfolio."
        image={heroMountainsUrl}
        breadcrumb="Early Warnings"
        quoteLines={['Early signals.', 'Timely action.', 'A more resilient India.']}
        cycle={import.meta.env.VITE_REPORTING_MONTH || '2026-06'}
      />
      <nav className="subtabs">{tabs.map((tab) => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}</nav>
      <main className="main-wrap"><div className="left-rail"><Filters filters={filters} setFilters={setFilters} onApply={() => { setAppliedFilters(filters); notify('Filters applied') }} onReset={resetFilters} /><Insights warnings={warnings} onOpen={() => { window.location.hash = '#/analytics'; }} /></div><section className="feed-column"><div className="feed-head"><div className="feed-count"><b>{filteredWarnings.length}</b> early warnings in the current reporting cycle</div><div className="feed-controls"><label className="sortby">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option>Most Recent</option><option>Project Name</option></select></label><button className="mark-read" onClick={markAllRead}>✓ Mark All as Read</button></div></div><div className="warnings-scrollbox">{loadError && <div className="empty-state card"><h3>Failed to load warnings</h3><p>{loadError}</p></div>}{!loadError && warnings.length === 0 && <div className="empty-state card"><h3>Loading live warning signals…</h3></div>}{filteredWarnings.length ? filteredWarnings.map((warning) => <WarningCard key={warning.id} warning={warning} read={readIds.includes(warning.id)} onView={openWarningTarget} onMenu={(item) => notify(`${item.project} added to your watchlist`)} />) : (warnings.length > 0 && <div className="empty-state card"><h3>No warnings match these filters</h3><p>Try clearing a filter or searching for another project.</p><button className="apply-btn" onClick={resetFilters}>Reset Filters</button></div>)}</div></section><aside className="right-rail"><Trends /><Donut warnings={warnings} /><div className="widget card alerts-widget"><div><strong className="widget-title-with-icon"><span className="widget-heading-icon alert-heading-icon"><Icon name="bell" size={16} /></span>Set Up Alerts</strong><p>Get notified about critical changes in your areas of interest.</p></div><button className="config-btn" onClick={() => setModal({ type: 'alerts' })}>Configure Alerts <Icon name="arrow" size={11} /></button></div></aside></main>
      <GlobalFooter onLink={(l) => notify(`Opening ${typeof l === "string" ? l : l.label} information`)} />
      {modal?.type === 'warning' && <Modal title={modal.item.project} onClose={() => setModal(null)}><p className="modal-kicker">{modal.item.type} · {modal.item.severity}</p><p>{modal.item.description}</p><div className="detail-grid"><span>Ministry<strong>{modal.item.ministry}</strong></span><span>Location<strong>{modal.item.state}</strong></span><span>Sector<strong>{modal.item.sector}</strong></span><span>Reported<strong>{modal.item.date} at {modal.item.time}</strong></span></div><button className="apply-btn" onClick={() => { setReadIds((ids) => [...new Set([...ids, modal.item.id])]); setModal(null); notify('Warning marked as read') }}>Mark as Read</button></Modal>}
      {modal?.type === 'alerts' && <Modal title="Configure Alerts" onClose={() => setModal(null)}><p>Choose the signals that should reach your officer inbox.</p><label className="modal-check"><input type="checkbox" defaultChecked /> New high-risk projects</label><label className="modal-check"><input type="checkbox" defaultChecked /> Risk score increases</label><label className="modal-check"><input type="checkbox" /> Data update summaries</label><button className="apply-btn" onClick={() => { setModal(null); notify('Alert preferences saved') }}>Save Alert Preferences</button></Modal>}
      {modal?.type === 'notifications' && <Modal title="Notifications" onClose={() => setModal(null)}><div className="notification"><b>3 new high-priority signals</b><span>Review the latest changes in Transport and Railways.</span></div><div className="notification"><b>Quarterly data update complete</b><span>312 projects received fresh progress data.</span></div><button className="apply-btn" onClick={() => { setModal(null); notify('Notifications marked as read') }}>Mark Notifications Read</button></Modal>}
      {modal?.type === 'profile' && <Modal title="Officer Profile" onClose={() => setModal(null)}><div className="profile-modal"><span className="avatar large">AS</span><div><h3>A. Sharma</h3><p>MoSPI Officer · National Infrastructure Intelligence</p></div></div><button className="apply-btn" onClick={() => { setModal(null); notify('Profile settings opened') }}>Open Profile Settings</button></Modal>}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}


