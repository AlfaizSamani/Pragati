'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { FileUp, Database, CheckCircle2, AlertTriangle, UploadCloud } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type Mode = 'api' | 'pdf';

export default function IngestionPage() {
  const [mode, setMode] = useState<Mode>('api');
  const [month, setMonth] = useState('2026-08');
  const [file, setFile] = useState<File | null>(null);
  const [payload, setPayload] = useState('{\n  "records": []\n}');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function getAuthHeader(): Promise<Record<string, string>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        return { Authorization: `Bearer ${session.access_token}` };
      }
    } catch {
      // ignore
    }
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)paimana_officer_session=([^;]*)/);
      if (match && match[1]) {
        return { Authorization: `Bearer ${match[1]}` };
      }
    }
    return {};
  }

  async function submit() {
    setBusy(true);
    setStatus('');
    try {
      const authHeaders = await getAuthHeader();
      const body = new FormData();
      body.append('month_label', month);
      if (mode === 'pdf') {
        if (!file) throw new Error('Choose a PDF report first.');
        body.append('file', file);
        const response = await fetch(`${API_BASE}/ingest/monthly-report`, {
          method: 'POST',
          headers: { ...authHeaders },
          body,
        });
        if (!response.ok) throw new Error(await response.text());
        const result = await response.json();
        setStatus(`PDF processed: ${result.rows_ingested ?? 0} rows ingested and ${result.scored_eligible ?? 0} rows scored.`);
      } else {
        const parsed = JSON.parse(payload);
        const response = await fetch(`${API_BASE}/ingest/monthly-records?month_label=${encodeURIComponent(month)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
          body: JSON.stringify(parsed),
        });
        if (!response.ok) throw new Error(await response.text());
        const result = await response.json();
        setStatus(`API payload accepted: ${result.rows_received} rows. ${result.message}`);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Ingestion failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-5xl space-y-6 pb-16">
      <div className="surface-level-3 rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-sky-100 p-3 text-sky-700"><UploadCloud className="h-6 w-6" /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-700">Pipeline control</p>
            <h1 className="mt-1 text-2xl font-bold text-royal">Monthly Data Ingestion</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">Submit a structured PAIMANA feed or a Flash Report PDF. The API validates the input, extends the panel, refreshes features, and scores with the frozen model.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className="space-y-2">
          <button type="button" onClick={() => setMode('api')} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm font-semibold ${mode === 'api' ? 'border-sky-300 bg-sky-50 text-sky-900' : 'border-slate-200 bg-white text-slate-600'}`}><Database className="h-5 w-5" />Structured API feed</button>
          <button type="button" onClick={() => setMode('pdf')} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm font-semibold ${mode === 'pdf' ? 'border-sky-300 bg-sky-50 text-sky-900' : 'border-slate-200 bg-white text-slate-600'}`}><FileUp className="h-5 w-5" />Flash Report PDF</button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Reporting month</label>
          <input value={month} onChange={event => setMonth(event.target.value)} pattern="\\d{4}-\\d{2}" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />

          {mode === 'api' ? (
            <div className="mt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">JSON payload</label>
              <textarea value={payload} onChange={event => setPayload(event.target.value)} rows={12} spellCheck={false} className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-950 p-3 font-mono text-xs text-slate-100 outline-none focus:border-sky-500" />
              <p className="mt-2 text-xs text-slate-500">Expected shape: <code>{'{ "records": [{ "project_code": "...", "project_name": "..." }] }'}</code></p>
            </div>
          ) : (
            <label className="mt-5 flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/50 p-6 text-center hover:border-sky-400">
              <FileUp className="h-9 w-9 text-sky-600" />
              <span className="mt-3 text-sm font-bold text-slate-800">Drop a Flash Report PDF here</span>
              <span className="mt-1 text-xs text-slate-500">or browse from this device</span>
              <input type="file" accept="application/pdf,.pdf" onChange={event => setFile(event.target.files?.[0] || null)} className="sr-only" />
              {file && <span className="mt-4 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-sky-800">{file.name}</span>}
            </label>
          )}

          <button type="button" onClick={submit} disabled={busy} className="mt-5 rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Processing...' : 'Run ingestion pipeline'}</button>
          {status && <div className="mt-4 flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /><span>{status}</span></div>}
        </div>
      </div>

      <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900"><AlertTriangle className="h-4 w-4 shrink-0" />Retraining is deliberately separate from monthly ingestion. The frozen production model is never overwritten by this screen.</div>
    </div>
  );
}
