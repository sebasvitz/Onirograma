-- Run this in the Supabase SQL Editor to set up Onirograma's database.

-- 1. Table: cases
create table if not exists cases (
  id                   uuid primary key,
  created_at           timestamptz not null default now(),
  -- input fields
  input_tipo           text not null,
  texto_original       text,
  transcripcion        text,
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

-- 2. Storage bucket: dream-images
-- Create it manually in Supabase Dashboard → Storage → New bucket
-- Name: dream-images
-- Access: Public (so image URLs are accessible without authentication)
