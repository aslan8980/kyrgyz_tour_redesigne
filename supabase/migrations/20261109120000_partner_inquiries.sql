create table if not exists public.partner_inquiries (
  id uuid primary key default gen_random_uuid(),
  partner_type text not null check (
    partner_type in ('travel_agency', 'accommodation', 'other')
  ),
  company_name text not null,
  contact_person text not null,
  country text not null,
  email text not null,
  website text,
  estimated_tourists text,
  main_markets text,
  property_name text,
  property_location text,
  accommodation_type text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.partner_inquiries enable row level security;

grant insert on public.partner_inquiries to anon, authenticated;
grant select, update, delete on public.partner_inquiries to authenticated;

drop policy if exists "Public can submit partner inquiries"
  on public.partner_inquiries;
create policy "Public can submit partner inquiries"
  on public.partner_inquiries
  for insert to anon, authenticated
  with check (true);

drop policy if exists "Staff can manage partner inquiries"
  on public.partner_inquiries;
create policy "Staff can manage partner inquiries"
  on public.partner_inquiries
  for all to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('owner', 'staff')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('owner', 'staff')
    )
  );
