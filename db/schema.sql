-- Luxeva Care — PostgreSQL schema (provider-agnostic).
-- Runs on any Postgres: Supabase, Neon, Vercel Postgres, Railway, local, etc.
-- Apply with:  npm run db:init   (uses DATABASE_URL)   — or paste into your SQL editor.
--
-- This is the plain-Postgres schema used by the running app for lead capture. The
-- Supabase-specific migration with Auth + Row Level Security lives in
-- supabase/migrations/0001_init.sql (used when the admin/auth layer is built).

create extension if not exists "pgcrypto";

-- Lead lifecycle statuses.
do $$ begin
  create type enquiry_status as enum (
    'new','contacted','qualified','site_visit_scheduled',
    'quotation_sent','follow_up','converted','closed','spam'
  );
exception when duplicate_object then null; end $$;

create table if not exists enquiries (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  phone           text not null,
  email           text,
  service_interest text,
  property_type   text,
  location        text,
  budget_range    text,
  timeline        text,
  message         text,
  consent         boolean not null default false,
  source_page     text,
  utm             jsonb not null default '{}'::jsonb,
  status          enquiry_status not null default 'new',
  follow_up_date  date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_enquiries_status_created on enquiries (status, created_at desc);
create index if not exists idx_enquiries_phone on enquiries (phone);

-- Internal notes on a lead (admin use).
create table if not exists enquiry_notes (
  id          uuid primary key default gen_random_uuid(),
  enquiry_id  uuid not null references enquiries(id) on delete cascade,
  author      text,
  note        text not null,
  created_at  timestamptz not null default now()
);

-- keep updated_at fresh
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_enquiries_updated on enquiries;
create trigger trg_enquiries_updated before update on enquiries
  for each row execute function set_updated_at();
