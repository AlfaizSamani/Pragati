create table if not exists public.access_requests (
    request_id text primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    email text not null,
    full_name text not null,
    phone text not null,
    designation text not null,
    organization text not null,
    state_ut text not null default '',
    requested_role text not null,
    purpose text not null default '',
    document_name text not null default '',
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
    created_at timestamptz not null default now()
);

alter table public.access_requests enable row level security;
revoke all on public.access_requests from anon, authenticated;
grant select on public.access_requests to authenticated;

drop policy if exists "Applicants and reviewers can read access requests" on public.access_requests;
create policy "Applicants and reviewers can read access requests"
on public.access_requests for select to authenticated
using (auth.uid() = user_id or public.is_officer_or_admin());

create or replace function public.create_access_request_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    request_metadata jsonb := new.raw_user_meta_data;
begin
    if coalesce(request_metadata ->> 'access_request_id', '') <> '' then
        insert into public.access_requests (
            request_id,
            user_id,
            email,
            full_name,
            phone,
            designation,
            organization,
            state_ut,
            requested_role,
            purpose,
            document_name
        ) values (
            request_metadata ->> 'access_request_id',
            new.id,
            new.email,
            coalesce(request_metadata ->> 'full_name', ''),
            coalesce(request_metadata ->> 'phone', ''),
            coalesce(request_metadata ->> 'designation', ''),
            coalesce(request_metadata ->> 'organization', ''),
            coalesce(request_metadata ->> 'state_ut', ''),
            coalesce(request_metadata ->> 'requested_role', ''),
            coalesce(request_metadata ->> 'purpose', ''),
            coalesce(request_metadata ->> 'document_name', '')
        ) on conflict (request_id) do nothing;
    end if;
    return new;
end;
$$;

drop trigger if exists on_auth_user_access_request on auth.users;
create trigger on_auth_user_access_request
after insert on auth.users
for each row execute procedure public.create_access_request_for_new_user();

create or replace function public.access_request_exists(p_request_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.access_requests
        where request_id = p_request_id
    );
$$;

revoke all on function public.access_request_exists(text) from public;
grant execute on function public.access_request_exists(text) to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'access-request-documents',
    'access-request-documents',
    false,
    5242880,
    array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update
set public = false,
    file_size_limit = 5242880,
    allowed_mime_types = array['application/pdf', 'image/jpeg', 'image/png'];

drop policy if exists "Applicants upload documents for submitted requests" on storage.objects;
create policy "Applicants upload documents for submitted requests"
on storage.objects for insert to anon, authenticated
with check (
    bucket_id = 'access-request-documents'
    and public.access_request_exists((storage.foldername(name))[1])
);

drop policy if exists "Applicants and reviewers read access request documents" on storage.objects;
create policy "Applicants and reviewers read access request documents"
on storage.objects for select to authenticated
using (
    bucket_id = 'access-request-documents'
    and (
        public.is_officer_or_admin()
        or exists (
            select 1
            from public.access_requests
            where request_id = (storage.foldername(name))[1]
              and user_id = auth.uid()
        )
    )
);