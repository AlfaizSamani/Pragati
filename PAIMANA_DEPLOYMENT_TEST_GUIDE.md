# PAIMANA Deployment Test Guide

## Smoke tests

1. Public dashboard health
   - Open the public dashboard route and confirm the landing page and portfolio cards render without an active sign-in.
2. Protected ingestion route
   - Open `/ingestion` without an officer login and confirm redirect to `/login` or a controlled denial message.
3. Local API route smoke test
   - Call `/portfolio/summary`, `/projects`, `/risk-assessments`, `/alerts`, `/state-summary`, and `/intelligence/query`.
4. Ingestion upload test
   - Send `FormData` with `file` and `month_label=2026-08` to `/ingest/monthly-report`.
5. Structured JSON test
   - Submit a JSON body to `/ingest/monthly-records?month_label=2026-08` and confirm row validation.

## Authorization tests

- Anonymous user gets redirect or `401/403` on `/ingestion`.
- Viewer role cannot upload or publish.
- Officer role can start a job but cannot publish directly.
- Admin can publish and roll back.

## Data quality tests

- Row counts and column compatibility checks.
- Duplicate project ID handling.
- Missing `month_label` returns a clear validation error.
- Required fields like `project_code` and `project_name` are enforced.

## LLM tests

- Confirm the answer is grounded in authorized evidence only.
- Confirm risk scores and cost values are not modified by the LLM.
- Confirm unsupported claims are returned as unsupported evidence.

## Deployment checks

- Verify `NEXT_PUBLIC_API_URL` points to the correct public backend endpoint.
- Verify `LLM_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and similar secrets are only server-side.
- Verify the frontend route `/ingestion` is protected through an auth middleware or edge rule.
- Verify that the public dashboard remains readable without authentication.
