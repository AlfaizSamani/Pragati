
import { useEffect, useRef, useState } from 'react';
import "../styles/dataUpdate.css";
import GlobalHeader from "../components/common/GlobalHeader";
import GlobalFooter from "../components/common/GlobalFooter";
import dataUpdateHeroUrl from "../assets/hero-dataupdate.png";
import { api } from "../services/apiClient";
import DashboardHero from "../components/common/DashboardHero";

const steps = [
  ['Upload', 'Submit files or connect APIs'], ['Validate', 'Check data quality'],
  ['Process', 'Extract & standardize'], ['Score', 'Run risk models'],
  ['Review', 'Analyst validation'], ['Publish', 'Update live platform'],
];
const uploads = [
  ['MoRTH_Flash_Report_Apr2026.pdf', 'Ministry of Road Transport & Highways', '21 Apr 2026', '10:14 AM', '12.4 MB', 'Validating', 'pdf', '—'],
  ['Railways_Progress_Data_Apr2026.xlsx', 'Ministry of Railways', '21 Apr 2026', '09:32 AM', '8.7 MB', 'Validated', 'sheet', '1,245'],
  ['Urban_Development_Projects.csv', 'Ministry of Housing & Urban Affairs', '20 Apr 2026', '06:18 PM', '5.1 MB', 'Processed', 'data', '892'],
  ['Maharashtra_State_Update.pdf', 'Government of Maharashtra', '20 Apr 2026', '03:45 PM', '3.8 MB', 'Validation Failed', 'pdf', '—'],
  ['Water_Resources_Data_Apr2026.xlsx', 'Ministry of Jal Shakti', '19 Apr 2026', '11:21 AM', '6.2 MB', 'Published', 'sheet', '2,104'],
];
const sources = [
  ['▤', 'MoSPI Flash Reports', 'Monthly infrastructure reports'], ['▥', 'Ministry Updates', 'Progress and financial data'],
  ['▦', 'State Government Submissions', 'State-level project data'], ['♙', 'Implementing Agency Reports', 'Field and execution updates'],
  ['⚙', 'Other Official Sources', 'DPRs, explanatory memoranda, etc.'],
];

function Hero({ cycle }) {
  return <DashboardHero
    title="Data Update"
    subtitle="Keep India's infrastructure intelligence current."
    detail="Upload, validate and process the latest ministry reports, state data and project updates."
    image={dataUpdateHeroUrl}
    breadcrumb="Data Update"
    quoteLines={['Better data.', 'Stronger decisions.', 'A more resilient India.']}
    cycle={cycle}
  />;
}

function StepIcon({ index }) {
  const paths = [
    <><path d="M7 17a5 5 0 1 1 9.5-2.1A3.5 3.5 0 1 1 17 21H7a4 4 0 0 1 0-8h.5A5 5 0 0 1 7 17Z" /><path d="M12 17V8m0 0-3 3m3-3 3 3" /></>,
    <><path d="M12 8V4m0 16v-4M8 12H4m16 0h-4M7.8 7.8 5 5m14 14-2.8-2.8m0-8.4L19 5M5 19l2.8-2.8" /><circle cx="12" cy="12" r="3" /></>,
    <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 13h6m-6 4h6" /></>,
    <><path d="M4.5 16a8 8 0 1 1 15 0" /><path d="M12 12l3.5-3.5M12 12v1" /><circle cx="12" cy="12" r="1" /><path d="M5 19h14" /></>,
    <><path d="M12 21s8-4 8-10V5l-8-3-8 3v6c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    <><path d="M5 4h9l5 5v11H5z" /><path d="M14 4v6h6M8 14h8m-8 3h5" /><path d="m16 12 3 3-3 3m3-3h-6" /></>,
  ];
  return <svg className="step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[index]}</svg>;
}

function Workflow() {
  const [activeStep, setActiveStep] = useState(0);
  const statusFor = (index) => index < activeStep ? 'Completed' : index === activeStep ? 'In progress' : 'Pending';
  const selectStep = (index) => setActiveStep(index);
  return <section className="workflow"><div className="workflow-card"><div className="steps">{steps.map(([name, detail], index) => <div className={`step-wrap ${index === activeStep ? 'selected' : ''}`} key={name} role="button" tabIndex={0} aria-pressed={index === activeStep} onClick={() => selectStep(index)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectStep(index); } }}><div className={`step ${index < activeStep ? 'completed' : index === activeStep ? 'current' : 'pending'}`}><span>{index < activeStep ? '✓' : index + 1}</span><div><strong>{name} <StepIcon index={index} /></strong><small>{detail}</small></div></div>{index === activeStep && <div className="step-popover"><b>{name}</b><span>{detail}</span><small>{statusFor(index)}</small></div>}{index < steps.length - 1 && <em className={index < activeStep ? 'completed' : ''}>›</em>}</div>)}</div><div className="success"><span>✓</span><div><b>LAST SUCCESSFUL UPDATE</b><strong>March 2026 Cycle</strong><small>Published on 05 Apr 2026</small></div></div></div></section>;
}

function UploadPanel({ onFiles, onError }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const openFilePicker = () => inputRef.current?.click();
  const handleFiles = (files) => {
    if (!files?.length) return;
    const acceptedExtensions = ['pdf', 'xls', 'xlsx', 'csv', 'json'];
    const selectedFiles = Array.from(files);
    const invalidFiles = selectedFiles.filter((file) => !acceptedExtensions.includes(file.name.split('.').pop()?.toLowerCase()));
    const oversizedFiles = selectedFiles.filter((file) => file.size > 200 * 1024 * 1024);
    if (invalidFiles.length || oversizedFiles.length) {
      const errors = [];
      if (invalidFiles.length) errors.push(`Unsupported file type: ${invalidFiles.map((file) => file.name).join(', ')}`);
      if (oversizedFiles.length) errors.push(`File exceeds 200 MB: ${oversizedFiles.map((file) => file.name).join(', ')}`);
      onError(errors.join(' '));
    }
    const validFiles = selectedFiles.filter((file) => !invalidFiles.includes(file) && !oversizedFiles.includes(file));
    if (validFiles.length) onFiles(validFiles);
  };
  return <div className={`dropzone ${dragging ? 'dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); handleFiles(event.dataTransfer.files); }}>
    <div className="upload-icon">⇧</div><h2>Drag and drop files here</h2><p className="browse" onClick={openFilePicker}>or <b>click to browse</b></p><p className="hint">Supported formats: PDF, Excel (XLS/XLSX), CSV, JSON&nbsp; | &nbsp;Max file size: 200 MB per file</p><button type="button" onClick={openFilePicker}>Choose Files</button><input ref={inputRef} type="file" accept=".pdf,.xls,.xlsx,.csv,.json" multiple hidden onChange={(event) => { handleFiles(event.target.files); event.target.value = ''; }} />
  </div>;
}

function UploadTable({ rows, onView }) {
  const [menuIndex, setMenuIndex] = useState(null);
  return <div className="panel table-panel"><div className="panel-heading"><h2>Recent Uploads &amp; Processing Status</h2><button className="heading-link" onClick={() => onView(rows)}>View All →</button></div><div className="table-scroll"><table><thead><tr>{['#', 'File Name', 'Source', 'Upload Date', 'Size', 'Status', 'Records', 'Actions'].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={`${row[0]}-${index}`}><td className="muted">{index + 1}</td><td className="filename">{row[0]}</td><td>{row[1]}</td><td className="muted">{row[2]}<small>{row[3]}</small></td><td className="muted">{row[4]}</td><td><span className={`status ${row[5].replace(' ', '-').toLowerCase()}`}>{row[5] === 'Validating' && <i>◌</i>}{row[5]}</span></td><td className="records">{row[7]}</td><td className="actions"><button className="view-button" onClick={() => onView(row)}>View</button><span className="menu-wrap"><button className="more-button" aria-label={`More actions for ${row[0]}`} onClick={() => setMenuIndex(menuIndex === index ? null : index)}>•••</button>{menuIndex === index && <span className="row-menu"><button onClick={() => onView(row)}>Open details</button><button onClick={() => setMenuIndex(null)}>Dismiss</button></span>}</span></td></tr>)}</tbody></table></div></div>;
}

function Sidebar() {
  return <aside><div className="panel progress-panel"><div className="panel-heading"><h2>Current Cycle Progress</h2><a href="#">April 2026</a></div><div className="progress-body"><div className="donut"><strong>2/6</strong><small>STEPS COMPLETE</small></div><div className="progress-list">{steps.map(([name], index) => <div className={index === 0 ? 'done' : index === 1 ? 'in-progress' : 'pending'} key={name}><span>{index < 1 ? '✓' : index + 1}</span>{index + 1}. {name}<b>{index === 0 ? 'Completed (12 files)' : index === 1 ? 'In Progress (8/12)' : 'Pending'}</b></div>)}</div></div><div className="alert"><b>ⓘ Processing in progress</b><span>Your files are being validated. This may take a few minutes.</span></div></div><div className="panel quality"><div className="panel-heading"><h2>Data Quality Summary</h2><a href="#">View Details →</a></div><div className="stats">{[['12', 'Files Uploaded', 'blue'], ['10', 'Passed Validation', 'green'], ['2', 'Issues Found', 'red'], ['98.2%', 'Overall Data Quality', 'green'], ['3', 'Duplicates Detected', 'red'], ['⚠ 1', 'Missing Fields', 'amber']].map(([value, label, color]) => <div key={label}><strong className={color}>{value}</strong><small>{label}</small></div>)}</div></div><div className="panel help"><div className="panel-heading"><h2>Help &amp; Guidelines</h2><a href="#">View Documentation →</a></div><div className="help-grid">{[['▤', 'Data Submission Guidelines', 'File formats, templates and naming conventions'], ['⚠', 'Common Validation Errors', 'How to resolve data issues'], ['☎', 'Ministry Nodal Officer Contacts', 'Get in touch for support'], ['‹›', 'API Integration Guide', 'Automate your data submissions']].map(([icon, title, detail]) => <a href="#" key={title}><span>{icon}</span><div><b>{title}</b><small>{detail}</small></div></a>)}</div></div></aside>;
}

export default function DataUpdate()  {
  const [tab, setTab] = useState('File Upload');
  const [reportingCycle, setReportingCycle] = useState('');
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedUpload, setSelectedUpload] = useState(null);
  useEffect(() => {
    api.summary(import.meta.env.VITE_REPORTING_MONTH || undefined)
      .then((summary) => {
        const match = /^(\d{4})-(\d{2})$/.exec(summary.month || '');
        if (match) {
          const monthName = new Date(`${summary.month}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
          setReportingCycle(monthName);
        }
      })
      .catch(() => {});
  }, []);
  const addFiles = async (files) => {
    const reports = files.filter((file) => file.name.toLowerCase().endsWith('.pdf'));
    const unsupported = files.filter((file) => !file.name.toLowerCase().endsWith('.pdf'));
    if (unsupported.length) setMessage(`Backend ingestion currently accepts PDF Flash Reports only: ${unsupported.map((file) => file.name).join(', ')}`);
    if (!reports.length) return;
    setMessage(`Submitting ${reports.length} report${reports.length > 1 ? 's' : ''} to the backend...`);
    const results = await Promise.allSettled(reports.map((file) => api.uploadMonthlyReport(file, import.meta.env.VITE_REPORTING_MONTH || '2026-06')));
    const nextRows = results.map((result, index) => {
      const file = reports[index];
      const summary = result.status === 'fulfilled' ? result.value : null;
      return [file.name, 'Manual Upload', new Date().toLocaleDateString('en-IN'), new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), `${(file.size / 1048576).toFixed(1)} MB`, result.status === 'fulfilled' ? 'Processed' : 'Validation Failed', 'pdf', summary?.rows_processed ?? '—'];
    });
    setRows((current) => [...nextRows, ...current]);
    setMessage(`${results.filter((result) => result.status === 'fulfilled').length} report${reports.length > 1 ? 's' : ''} processed by the backend.`);
  };
  return <div className="data-update-page"><GlobalHeader activeId="data-update" /><Hero cycle={reportingCycle || 'Loading cycle…'} /><Workflow /><section className="tabs">{['File Upload', 'API Ingestion', 'Data Validation', 'Processing Status', 'Publication History'].map((item) => <button className={tab === item ? 'selected' : ''} onClick={() => setTab(item)} key={item}>{item}</button>)}</section>{tab === 'File Upload' ? <main><div className="left-column"><div className="upload-grid"><UploadPanel onFiles={addFiles} onError={setMessage} /><div className="panel sources"><h2>ACCEPTED DATA SOURCES</h2><ul>{sources.map(([icon, title, detail]) => <li key={title}><span>{icon}</span><div><b>{title}</b><small>{detail}</small></div></li>)}</ul></div></div>{message && <div className="queue-message">{message.startsWith('Unsupported') || message.startsWith('File exceeds') ? '!' : '✓'} {message}</div>}<UploadTable rows={rows} onView={setSelectedUpload} /></div><Sidebar /></main> : <div className="empty-tab"><h2>{tab}</h2><p>This section is ready for the next workflow stage.</p></div>}<GlobalFooter />{selectedUpload && <div className="dialog-backdrop" onClick={() => setSelectedUpload(null)}><div className="upload-dialog" onClick={(event) => event.stopPropagation()}><button className="dialog-close" aria-label="Close details" onClick={() => setSelectedUpload(null)}>×</button><span className="dialog-label">UPLOAD DETAILS</span><h2>{Array.isArray(selectedUpload) ? `${selectedUpload.length} uploads` : selectedUpload[0]}</h2>{Array.isArray(selectedUpload) ? <p>All recent uploads are available in the processing queue.</p> : <><p>{selectedUpload[1]}</p><div className="dialog-meta"><span><b>Status</b>{selectedUpload[5]}</span><span><b>Uploaded</b>{selectedUpload[2]} · {selectedUpload[3]}</span><span><b>Records</b>{selectedUpload[7]}</span></div></>}</div></div>}</div>;
}
