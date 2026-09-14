# PRAGATI Deployment Guide

This guide walks you through deploying the complete **PRAGATI / PAIMANA** stack:
1. **GitHub Repository**: [https://github.com/AlfaizSamani/Pragati](https://github.com/AlfaizSamani/Pragati)
2. **Database & Auth**: Supabase (Postgres, Row Level Security, Auth, Storage)
3. **Frontend**: Vercel (Next.js 16)
4. **Backend API**: Render, Railway, or Fly.io (FastAPI with frozen LightGBM bundle & flexible LLM gateway)

---

## 1. Push to GitHub

The local git repository is initialized on branch `main` with origin set to:
`https://github.com/AlfaizSamani/Pragati.git`

Make sure you have created the empty repository `Pragati` under your GitHub account `AlfaizSamani`. Then run:

```bash
git push -u origin main
```

*(If you ever need force-push over an initialized empty README: `git push -u origin main --force`)*

---

## 2. Supabase Setup

### Step 2.1: Run Database Schema & RLS Policies
1. Open your Supabase project dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** -> **New query**.
3. Copy the entire contents of [`SUPABASE_PG_SCHEMA_WITH_RLS.sql`](file:///d:/Games/FuckingLosers/SUPABASE_PG_SCHEMA_WITH_RLS.sql) and paste it into the editor.
4. Click **Run**.
   - This creates `profiles`, `roles`, `user_roles`, `ingestion_jobs`, `dataset_versions`, `published_projects`, and sets up Row-Level Security (RLS) so the public can read published tables while officer ingestion routes remain protected.

### Step 2.2: Setup Private Storage Bucket
1. In Supabase, go to **Storage** -> **New Bucket**.
2. Name: `source-pdfs`.
3. Set **Public bucket** to **OFF** (Private).
4. Run the storage policies from [`SUPABASE_STORAGE_BUCKET_SETUP.md`](file:///d:/Games/FuckingLosers/SUPABASE_STORAGE_BUCKET_SETUP.md) in the SQL Editor to grant upload access only to authorized officers.

### Step 2.3: Create an Officer Account
1. Go to **Authentication** -> **Users** -> **Add user** (or sign up via `/login`).
2. To assign the officer role, run this in SQL Editor:
```sql
insert into public.user_roles (user_id, role)
values ('<USER_UUID_FROM_AUTH_USERS>', 'officer')
on conflict do nothing;
```

---

## 3. Vercel Deployment (Frontend)

1. Go to [https://vercel.com/new](https://vercel.com/new) and import `AlfaizSamani/Pragati`.
2. **Project Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: Select `pragttttiii-sherr-main` (or leave default `./` since root `package.json` workspaces are configured).
3. **Environment Variables**:
   Add the following variables in the Vercel dashboard:

| Variable | Value / Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL of your deployed Python backend (e.g. `https://pragati-api.onrender.com` or `http://localhost:8000`) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<your-project-id>.supabase.co` |
| `SUPABASE_URL` | `https://<your-project-id>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Project `anon` key |
| `SUPABASE_ANON_KEY` | Your Supabase Project `anon` key |
| `PAIMANA_PROTECT_INGESTION` | `true` |
| `PAIMANA_PROTECT_INTELLIGENCE` | `true` |
| `LLM_PROVIDER` | `openai` (or `openai_compatible` / `local`) |
| `LLM_API_KEY` | Your LLM provider API key |
| `LLM_MODEL` | `gpt-4o-mini` (or your chosen model) |
| `LLM_BASE_URL` | Provider endpoint (e.g. `https://api.openai.com/v1`) |

4. Click **Deploy**.

---

## 4. Backend Service Deployment (FastAPI + ML Worker)

You can host the Python backend on **Render**, **Railway**, **Fly.io**, or any container platform.

### Option A: Render
1. Go to [Render Dashboard](https://dashboard.render.com/) -> **New Web Service**.
2. Connect `AlfaizSamani/Pragati`.
3. Select **Docker** (using the included [`Dockerfile`](file:///d:/Games/FuckingLosers/Dockerfile)) or **Python 3**:
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn api_service:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables:
   - `SUPABASE_URL`: `https://<your-project-id>.supabase.co`
   - `SUPABASE_ANON_KEY`: `<your-anon-key>`
   - `SUPABASE_SERVICE_ROLE_KEY`: `<your-service-role-key>` (Never expose to browser)
   - `PAIMANA_PROTECT_INGESTION`: `true`
   - `PAIMANA_PROTECT_INTELLIGENCE`: `true`
   - `PRAGATI_ALLOWED_ORIGINS`: `https://your-vercel-domain.vercel.app,http://localhost:3000`
   - `LLM_PROVIDER`: `openai` (or `openai_compatible` / `local`)
   - `LLM_API_KEY`: `sk-...`
   - `LLM_MODEL`: `gpt-4o-mini`
5. Deploy and copy your backend URL into Vercel's `NEXT_PUBLIC_API_URL`.

---

## 5. Architecture Summary

```
Public Users ----> Vercel Next.js Frontend ----> Public Read Data / Scored Sets
                                                        |
Officers --------> Supabase Auth / Session Cookie       |
       |                   |                            |
       v                   v                            v
Protected /ingestion ---> FastAPI Backend Ingestion ---> Verified & Scored Output
                          (Validates Bearer Token &      (Frozen DART LightGBM)
                           Officer Role via Supabase)
```
