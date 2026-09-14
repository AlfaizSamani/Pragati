# PAIMANA Deployment Workflow

## Objective

Deploy the PAIMANA dashboard and public intelligence surfaces through Vercel while moving the secure ingestion and monthly scoring activity through a protected Python API and worker path. The production model remains the frozen DART LightGBM pipeline defined in the manifest.

## Architecture

```text
Public users -> Vercel Next.js frontend -> public read API
Officer users -> Vercel Next.js frontend -> Supabase Auth + RLS + ingestion route
Protected ingestion page -> authenticated FastAPI/worker endpoint -> parsing -> feature refresh -> LightGBM score -> publish snapshot
```

## Recommended deployment split

- Frontend: Vercel
- API/worker: Render/Railway/Fly.io or managed container
- Supabase: Auth, Postgres, RLS, Storage audit tables
- LLM: provider or private GGUF inference server behind the backend

## Required environment variables

```text
NEXT_PUBLIC_API_URL=https://your-python-api.example.com
PAIMANA_PROTECT_INGESTION=true
PAIMANA_OFFICER_COOKIE=paimana_officer_session
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
LLM_PROVIDER=...
LLM_API_KEY=...
LLM_MODEL=...
```

## Officer-only ingestion rule

The frontend must not expose the browser to the Service Role key. The upload route must verify a valid bearer token or Supabase session and require an officer role. The `ingestion` route must redirect unauthenticated users to `/login` or `/` depending on the chosen policy.

## Production ingestion lifecycle

1. Officer signs in via Supabase Auth.
2. Frontend sends a multipart `file` and `month_label` to `/ingest/monthly-report`.
3. Backend stores the source PDF in private storage and begins a job.
4. Worker parses and scores the staged data using the manifest-model path.
5. Validation and QA checks ensure data quality thresholds are met.
6. An approved officer or admin publishes the dataset snapshot.

## Manual steps

- Create a Supabase project and storage bucket.
- Add tables for profiles, roles, ingestion_jobs, dataset_versions, audit_events.
- Add RLS policies for public read access and officer-only writes.
- Wire Vercel environment variables and a custom domain.
- Provision the backend API domain and connect the database and PDF storage bucket.
- Add role assignment workflow for government officers.

## Frozen model note

The accepted frozen production model in this workspace is the DART LightGBM bundle identified in the manifest and data contract. It must not be replaced by `HistGradientBoosting` or a monthly retraining path.
