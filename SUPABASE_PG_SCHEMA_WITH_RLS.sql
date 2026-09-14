-- PAIMANA / PRAGATI Supabase Postgres schema
-- Safe public-read + officer/admin-write posture
-- Run in a Supabase Postgres project with auth.users available.

create extension if not exists pgcrypto;

do $$
begin
    if not exists (select 1 from pg_type where typname = 'app_role') then
        create type public.app_role as enum ('viewer', 'officer', 'admin');
    end if;
    if not exists (select 1 from pg_type where typname = 'ingestion_status') then
        create type public.ingestion_status as enum ('queued', 'processing', 'validated', 'published', 'failed', 'rejected');
    end if;
    if not exists (select 1 from pg_type where typname = 'dataset_publish_status') then
        create type public.dataset_publish_status as enum ('draft', 'validated', 'published', 'rollback');
    end if;
end $$;

-- Profiles
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    email text unique not null,
    department text,
    organization text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Central role table
create table if not exists public.roles (
    role public.app_role primary key,
    description text not null default ''
);
insert into public.roles(role, description) values
    ('viewer','Public/read-only dashboard viewer'),
    ('officer','Officer can upload and create ingestion jobs'),
    ('admin','Admin can assign roles and publish or rollback datasets')
on conflict (role) do nothing;

-- User role assignment
create table if not exists public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    role public.app_role not null references public.roles(role),
    granted_by uuid references auth.users(id),
    is_active boolean not null default true,
    granted_at timestamptz not null default now(),
    unique(user_id, role)
);

-- Ingestion job tracking
create table if not exists public.ingestion_jobs (
    id uuid primary key default gen_random_uuid(),
    uploader_id uuid not null references auth.users(id),
    reporting_month text not null,
    filename text not null,
    file_checksum text,
    source_bucket text not null default 'source-pdfs',
    source_path text,
    parser_format text not null default 'pdf',
    status public.ingestion_status not null default 'queued',
    error_message text,
    rows_received integer not null default 0,
    rows_accepted integer not null default 0,
    rows_scored integer not null default 0,
    cold_start_count integer not null default 0,
    model_bundle_version text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    published_dataset_version text
);

-- Dataset versions, immutable snapshots
create table if not exists public.dataset_versions (
    id uuid primary key default gen_random_uuid(),
    dataset_version text not null unique,
    reporting_month text not null,
    source_job_id uuid references public.ingestion_jobs(id),
    source_file_checksum text,
    source_file_path text,
    parser_version text,
    feature_version text,
    model_bundle_version text,
    calibration_version text,
    rows_ingested integer not null default 0,
    rows_scored integer not null default 0,
    rows_cold_start integer not null default 0,
    publish_status public.dataset_publish_status not null default 'draft',
    published_by uuid references auth.users(id),
    published_at timestamptz,
    created_at timestamptz not null default now(),
    metadata jsonb not null default '{}'::jsonb
);

-- Published public data tables
create table if not exists public.published_projects (
    id uuid primary key default gen_random_uuid(),
    canonical_id text not null unique,
    project_name text not null,
    ministry text,
    sector text,
    state text,
    agency text,
    cost_original_cr double precision default 0,
    cost_current_cr double precision default 0,
    cumulative_expenditure_cr double precision default 0,
    physical_progress double precision default 0,
    risk_score double precision default 0,
    risk_tier text not null default 'low',
    dominant_risk text not null default 'schedule_delay',
    cost_escalation_pct double precision default 0,
    schedule_slip_months double precision default 0,
    stall_streak_months double precision default 0,
    priority_score double precision default 0,
    confidence double precision default 0,
    reporting_month text not null,
    dataset_version text not null references public.dataset_versions(dataset_version),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.published_risk_assessments (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references public.published_projects(id),
    canonical_id text not null,
    risk_score double precision not null default 0,
    risk_tier text not null default 'low',
    dominant_risk text not null default 'schedule_delay',
    confidence double precision not null default 0,
    cost_risk_probability double precision not null default 0,
    schedule_risk_probability double precision not null default 0,
    progress_stall_probability double precision not null default 0,
    reporting_month text not null,
    dataset_version text not null references public.dataset_versions(dataset_version),
    created_at timestamptz not null default now()
);

create table if not exists public.published_alerts (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references public.published_projects(id),
    alert_type text not null,
    message text not null,
    risk_tier text not null default 'low',
    project_canonical_id text not null,
    is_active boolean not null default true,
    first_raised_month text,
    persistence_months integer not null default 0,
    reporting_month text not null,
    dataset_version text not null references public.dataset_versions(dataset_version),
    created_at timestamptz not null default now()
);

create table if not exists public.published_interventions (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references public.published_projects(id),
    project_canonical_id text not null,
    priority_score double precision not null default 0,
    priority_level text not null default 'P4',
    review_category text not null default 'watch',
    recommended_action text,
    dataset_version text not null references public.dataset_versions(dataset_version),
    created_at timestamptz not null default now()
);

create table if not exists public.audit_events (
    id uuid primary key default gen_random_uuid(),
    actor_id uuid references auth.users(id),
    actor_role public.app_role,
    event_type text not null,
    event_target text,
    event_detail jsonb not null default '{}'::jsonb,
    status text not null default 'ok',
    created_at timestamptz not null default now()
);

-- PUBLIC read model tables for all public dashboard pages
create table if not exists public.published_sector_ranking (
    id uuid primary key default gen_random_uuid(),
    sector text not null,
    project_count integer not null default 0,
    avg_risk_score double precision default 0,
    high_risk_count integer default 0,
    total_cost_cr double precision default 0,
    dataset_version text not null references public.dataset_versions(dataset_version),
    created_at timestamptz not null default now()
);

create table if not exists public.published_ministry_ranking (
    id uuid primary key default gen_random_uuid(),
    ministry text not null,
    project_count integer not null default 0,
    avg_risk_score double precision default 0,
    high_risk_count integer default 0,
    total_cost_cr double precision default 0,
    dataset_version text not null references public.dataset_versions(dataset_version),
    created_at timestamptz not null default now()
);

-- Helper functions
create or replace function public.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
    select coalesce(
        (select role from public.user_roles where user_id = auth.uid() and is_active = true order by granted_at desc limit 1),
        'viewer'::public.app_role
    );
$$;

create or replace function public.is_officer_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists(
        select 1 from public.user_roles
        where user_id = auth.uid()
          and is_active = true
          and role in ('officer', 'admin')
    );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists(
        select 1 from public.user_roles
        where user_id = auth.uid()
          and is_active = true
          and role = 'admin'
    );
$$;

create or replace function public.is_owner_or_admin(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select auth.uid() = p_user_id or public.is_admin();
$$;

-- Enable RLS on application tables
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.roles enable row level security;
alter table public.ingestion_jobs enable row level security;
alter table public.dataset_versions enable row level security;
alter table public.published_projects enable row level security;
alter table public.published_risk_assessments enable row level security;
alter table public.published_alerts enable row level security;
alter table public.published_interventions enable row level security;
alter table public.audit_events enable row level security;
alter table public.published_sector_ranking enable row level security;
alter table public.published_ministry_ranking enable row level security;

-- Helper policy allows service role to bypass through backend. Not for browser.
-- Public read: published tables
drop policy if exists "Public can read published projects" on public.published_projects;
create policy "Public can read published projects" on public.published_projects
for select using (true);

drop policy if exists "Public can read published risk assessments" on public.published_risk_assessments;
create policy "Public can read published risk assessments" on public.published_risk_assessments
for select using (true);

drop policy if exists "Public can read published alerts" on public.published_alerts;
create policy "Public can read published alerts" on public.published_alerts
for select using (true);

drop policy if exists "Public can read published interventions" on public.published_interventions;
create policy "Public can read published interventions" on public.published_interventions
for select using (true);

drop policy if exists "Public can read published sector ranking" on public.published_sector_ranking;
create policy "Public can read published sector ranking" on public.published_sector_ranking
for select using (true);

drop policy if exists "Public can read published ministry ranking" on public.published_ministry_ranking;
create policy "Public can read published ministry ranking" on public.published_ministry_ranking
for select using (true);

-- Profiles: self-read and officer/admin read
drop policy if exists "Profiles visible to self or officer/admin" on public.profiles;
create policy "Profiles visible to self or officer/admin" on public.profiles
for select using (
    auth.uid() = id or public.is_officer_or_admin()
);

drop policy if exists "Profiles update by self" on public.profiles;
create policy "Profiles update by self" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Profiles insert by self" on public.profiles;
create policy "Profiles insert by self" on public.profiles
for insert with check (auth.uid() = id);

-- Roles table: public read is okay for UI but edits admin-only
drop policy if exists "Role list readable by authenticated users" on public.roles;
create policy "Role list readable by authenticated users" on public.roles
for select using (auth.role() = 'authenticated' or public.is_officer_or_admin());

drop policy if exists "Roles admin managed only" on public.roles;
create policy "Roles admin managed only" on public.roles
for all using (public.is_admin()) with check (public.is_admin());

-- User roles: self-read, officer/admin full read, admin assign/remove
drop policy if exists "User roles self read or admin/officer managers" on public.user_roles;
create policy "User roles self read or admin/officer managers" on public.user_roles
for select using (
    auth.uid() = user_id or public.is_officer_or_admin() or public.is_admin()
);

drop policy if exists "User roles admins manage" on public.user_roles;
create policy "User roles admins manage" on public.user_roles
for all using (public.is_admin()) with check (public.is_admin());

-- Ingestion jobs: officer/admin can read own or all; insert by officer/admin; update by officer/admin
drop policy if exists "Officer admin create ingestion jobs" on public.ingestion_jobs;
create policy "Officer admin create ingestion jobs" on public.ingestion_jobs
for insert with check (public.is_officer_or_admin());

drop policy if exists "Officer admin select ingestion jobs" on public.ingestion_jobs;
create policy "Officer admin select ingestion jobs" on public.ingestion_jobs
for select using (public.is_officer_or_admin());

drop policy if exists "Officer admin update ingestion jobs" on public.ingestion_jobs;
create policy "Officer admin update ingestion jobs" on public.ingestion_jobs
for update using (public.is_officer_or_admin()) with check (public.is_officer_or_admin());

-- Dataset versions: officer/admin read/write, public read suppressed except published table copies
drop policy if exists "Dataset versions officer admin read" on public.dataset_versions;
create policy "Dataset versions officer admin read" on public.dataset_versions
for select using (public.is_officer_or_admin());

drop policy if exists "Dataset versions officer admin write" on public.dataset_versions;
create policy "Dataset versions officer admin write" on public.dataset_versions
for insert with check (public.is_officer_or_admin());

drop policy if exists "Dataset versions admin and officer update" on public.dataset_versions;
create policy "Dataset versions admin and officer update" on public.dataset_versions
for update using (public.is_officer_or_admin()) with check (public.is_officer_or_admin());

-- published table data is read-only to public. Backend service role writes. Browser is never allowed writes.
drop policy if exists "Published project writes via service role only" on public.published_projects;
create policy "Published project writes via service role only" on public.published_projects
for all using (false) with check (false);

drop policy if exists "Published risk writes via service role only" on public.published_risk_assessments;
create policy "Published risk writes via service role only" on public.published_risk_assessments
for all using (false) with check (false);

drop policy if exists "Published alerts writes via service role only" on public.published_alerts;
create policy "Published alerts writes via service role only" on public.published_alerts
for all using (false) with check (false);

drop policy if exists "Published interventions writes via service role only" on public.published_interventions;
create policy "Published interventions writes via service role only" on public.published_interventions
for all using (false) with check (false);

drop policy if exists "Published rankings writes via service role only" on public.published_sector_ranking;
create policy "Published rankings writes via service role only" on public.published_sector_ranking
for all using (false) with check (false);

drop policy if exists "Published rankings writes via service role only" on public.published_ministry_ranking;
create policy "Published rankings writes via service role only" on public.published_ministry_ranking
for all using (false) with check (false);

-- Audit events: read/write by officer/admin, self only for login events if needed
drop policy if exists "Audit event officer/admin read" on public.audit_events;
create policy "Audit event officer/admin read" on public.audit_events
for select using (public.is_officer_or_admin());

drop policy if exists "Audit event officer/admin insert" on public.audit_events;
create policy "Audit event officer/admin insert" on public.audit_events
for insert with check (public.is_officer_or_admin());

drop policy if exists "Audit event admin update" on public.audit_events;
create policy "Audit event admin update" on public.audit_events
for update using (public.is_admin()) with check (public.is_admin());

-- Storage bucket and object policies for private PDF storage
-- Bucket must be created in Supabase dashboard or via storage API.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('source-pdfs', 'source-pdfs', false, 50 * 1024 * 1024, ARRAY['application/pdf'])
on conflict (id) do update
set public = false,
    file_size_limit = 50 * 1024 * 1024,
    allowed_mime_types = ARRAY['application/pdf'];

drop policy if exists "Officer or admin can upload source PDF" on storage.objects;
create policy "Officer or admin can upload source PDF" on storage.objects
for insert with check (
    bucket_id = 'source-pdfs'
    and public.is_officer_or_admin()
);

drop policy if exists "Officer or admin can read source PDF" on storage.objects;
create policy "Officer or admin can read source PDF" on storage.objects
for select using (
    bucket_id = 'source-pdfs'
    and public.is_officer_or_admin()
);

drop policy if exists "Officer or admin can update/delete source PDF" on storage.objects;
create policy "Officer or admin can update/delete source PDF" on storage.objects
for update using (bucket_id = 'source-pdfs' and public.is_officer_or_admin())
with check (bucket_id = 'source-pdfs' and public.is_officer_or_admin());

drop policy if exists "Officer or admin can delete source PDF" on storage.objects;
create policy "Officer or admin can delete source PDF" on storage.objects
for delete using (bucket_id = 'source-pdfs' and public.is_officer_or_admin());

-- Helpful indexes
create index if not exists idx_ingestion_jobs_reporting_month on public.ingestion_jobs(reporting_month);
create index if not exists idx_ingestion_jobs_status on public.ingestion_jobs(status);
create index if not exists idx_dataset_versions_dataset_version on public.dataset_versions(dataset_version);
create index if not exists idx_published_projects_canonical_id on public.published_projects(canonical_id);
create index if not exists idx_published_risk_assessments_project_id on public.published_risk_assessments(project_id);
create index if not exists idx_published_alerts_project_id on public.published_alerts(project_id);
create index if not exists idx_user_roles_role on public.user_roles(role);

-- Trigger to keep profile email in sync
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles(id, email, full_name)
    values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', new.email))
    on conflict (id) do update set email = excluded.email, full_name = excluded.full_name;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user_profile();

-- Edge-friendly object view for public reads; define published tables as snapshots to avoid exposing private tables.
create or replace view public.v_public_dashboard as
select
    p.id,
    p.canonical_id,
    p.project_name,
    p.ministry,
    p.sector,
    p.state,
    p.agency,
    p.cost_current_cr,
    p.physical_progress,
    p.risk_score,
    p.risk_tier,
    p.dominant_risk,
    p.cost_escalation_pct,
    p.schedule_slip_months,
    p.stall_streak_months,
    p.priority_score,
    p.confidence,
    p.reporting_month,
    p.dataset_version
from public.published_projects p;
