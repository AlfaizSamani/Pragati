# Supabase Storage Bucket Setup

Create a private bucket named `source-pdfs` in Supabase Storage for incoming Flash Reports.

## Bucket

```sql
select storage.create_bucket('source-pdfs', false);
```

If your Supabase version already has a bucket, keep the existing bucket metadata and leave public=false.

## Storage policies

```sql
create policy "Officer or admin can upload source PDF"
on storage.objects for insert
with check (
  bucket_id = 'source-pdfs'
  and public.is_officer_or_admin()
);

create policy "Officer or admin can read source PDF"
on storage.objects for select
using (
  bucket_id = 'source-pdfs'
  and public.is_officer_or_admin()
);

create policy "Officer or admin can update/delete source PDF"
on storage.objects for update
using (bucket_id = 'source-pdfs' and public.is_officer_or_admin())
with check (bucket_id = 'source-pdfs' and public.is_officer_or_admin());

create policy "Officer or admin can delete source PDF"
on storage.objects for delete
using (bucket_id = 'source-pdfs' and public.is_officer_or_admin());
```

## Additional bucket metadata

- `public = false`
- `file_size_limit = 50MB`
- `allowed_mime_types = ['application/pdf']`
