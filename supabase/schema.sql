-- Run this in the Supabase SQL Editor to set up Onirograma's database.

-- 1. Table: cases
create table if not exists cases (
  id                   uuid primary key,
  created_at           timestamptz not null default now(),
  -- input fields
  input_tipo           text not null,
  texto_original       text,
  transcripcion        text,           -- retained for backward-compatibility with legacy data
  referencias_visuales text[],           -- public Storage URLs (or external URLs)
  -- analysis fields
  resumen              text not null,
  estructura_espacial  jsonb not null,
  dinamicas            text[] not null,
  luz                  jsonb not null,
  materialidad         text[] not null,
  corporalidad         jsonb not null,
  emocion              jsonb not null,
  recorrido            jsonb not null,
  elementos_espaciales text[] not null,
  traduccion_espacial  jsonb not null,
  keywords             text[] not null
);

-- 2. Table: section_images
-- Stores reference images uploaded per analysis section for each case.
create table if not exists section_images (
  id         uuid primary key default gen_random_uuid(),
  case_id    uuid not null references cases(id) on delete cascade,
  section    text not null,
  url        text not null,
  created_at timestamptz not null default now()
);

create index if not exists section_images_case_id_idx on section_images(case_id);

-- 3. Storage bucket: dream-images
-- Create it manually in Supabase Dashboard → Storage → New bucket
-- Name: dream-images
-- Access: Public (so image URLs are accessible without authentication)
-- Reference images are stored under: section-refs/{case_id}/{filename}
