-- Adds admin-managed imagery, homepage itinerary selection, gallery photos,
-- and testimonials. Run this once in the Supabase SQL editor.

alter table public.tours
  add column if not exists detail_image text,
  add column if not exists show_on_home boolean not null default false;

update public.tours
set show_on_home = true
where slug in ('3-days', '4-days', '5-days', '14-days');

create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Kyrgyzstan',
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null default '',
  rating integer not null default 5 check (rating between 1 and 5),
  title text not null default '',
  text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

insert into public.gallery_photos (title, category, image_url, sort_order)
select seed.title, seed.category, seed.image_url, seed.sort_order
from (values
  ('The Shores of Issyk-Kul', 'Lake', '/images/gallery/gallery-issyk-kul.jpg', 1),
  ('Ala-Archa National Park', 'Mountains', '/images/gallery/gallery-ala-archa.jpg', 2),
  ('Evening at Song-Kul', 'Nomadic Life', '/images/gallery/gallery-song-kul-dusk.jpg', 3),
  ('The Art of Shyrdak', 'Kyrgyz Culture', '/images/gallery/gallery-craft.jpg', 4),
  ('Burana Tower', 'History', '/images/gallery/gallery-burana.jpg', 5),
  ('Life on the Steppe', 'Tradition', '/images/gallery/gallery-horseman.jpg', 6)
) as seed(title, category, image_url, sort_order)
where not exists (select 1 from public.gallery_photos);

insert into public.testimonials (name, country, rating, title, text, sort_order)
select seed.name, seed.country, seed.rating, seed.title, seed.text, seed.sort_order
from (values
  ('Alex', 'Germany', 5, 'Warm hospitality', 'Kyrgyzstan surprised me with its incredible mountains, beautiful lakes and warm hospitality.', 1),
  ('Sofia', 'Italy', 5, 'A new adventure every day', 'The landscapes were unforgettable. From the mountains to Issyk-Kul, every day felt like a new adventure.', 2),
  ('Daniel', 'United Kingdom', 5, 'A different travel experience', 'A completely different travel experience. The nature, culture and nomadic traditions were amazing.', 3),
  ('Emma', 'France', 5, 'Mountains, lakes and culture', 'The combination of mountains, lakes and nomadic culture made this one of my favorite trips.', 4),
  ('Michael', 'United States', 5, 'An authentic destination', 'Kyrgyzstan feels incredibly authentic. The landscapes and hospitality were unforgettable.', 5),
  ('Anna', 'Poland', 5, 'A beautiful country', 'A beautiful country with incredible nature. I would definitely come back again.', 6)
) as seed(name, country, rating, title, text, sort_order)
where not exists (select 1 from public.testimonials);

alter table public.gallery_photos enable row level security;
alter table public.testimonials enable row level security;

drop policy if exists "Public can read gallery photos" on public.gallery_photos;
create policy "Public can read gallery photos" on public.gallery_photos
  for select using (true);
drop policy if exists "Staff can manage gallery photos" on public.gallery_photos;
create policy "Staff can manage gallery photos" on public.gallery_photos
  for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('owner', 'staff')))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('owner', 'staff')));

drop policy if exists "Public can read testimonials" on public.testimonials;
create policy "Public can read testimonials" on public.testimonials
  for select using (true);
drop policy if exists "Staff can manage testimonials" on public.testimonials;
create policy "Staff can manage testimonials" on public.testimonials
  for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('owner', 'staff')))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('owner', 'staff')));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 10485760, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif'];

drop policy if exists "Public can view site media" on storage.objects;
create policy "Public can view site media" on storage.objects
  for select using (bucket_id = 'site-media');
drop policy if exists "Staff can upload site media" on storage.objects;
create policy "Staff can upload site media" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'site-media' and exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role in ('owner', 'staff')
    )
  );
drop policy if exists "Staff can update site media" on storage.objects;
create policy "Staff can update site media" on storage.objects
  for update to authenticated using (
    bucket_id = 'site-media' and exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role in ('owner', 'staff')
    )
  );
drop policy if exists "Staff can delete site media" on storage.objects;
create policy "Staff can delete site media" on storage.objects
  for delete to authenticated using (
    bucket_id = 'site-media' and exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role in ('owner', 'staff')
    )
  );
