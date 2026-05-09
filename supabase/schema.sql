-- Run this once per Supabase project (test + prod) in the SQL editor.
-- All money values are stored as integer cents in bigint columns.

create table public.benefit_logs (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  benefit_id          text not null,
  log_date            date not null,
  value_amount_cents  bigint not null,
  note                text,
  created_at          timestamptz not null default now()
);

create index benefit_logs_user_idx on public.benefit_logs (user_id, log_date desc);

alter table public.benefit_logs enable row level security;

create policy "benefit_logs_select_own" on public.benefit_logs
  for select using (auth.uid() = user_id);
create policy "benefit_logs_insert_own" on public.benefit_logs
  for insert with check (auth.uid() = user_id);
create policy "benefit_logs_update_own" on public.benefit_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "benefit_logs_delete_own" on public.benefit_logs
  for delete using (auth.uid() = user_id);

create table public.net_worth_items (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  kind          text not null check (kind in ('asset','liability')),
  category      text not null,
  amount_cents  bigint not null,
  updated_at    timestamptz not null default now()
);

create index net_worth_items_user_idx on public.net_worth_items (user_id, updated_at desc);

alter table public.net_worth_items enable row level security;

create policy "nwi_select_own" on public.net_worth_items
  for select using (auth.uid() = user_id);
create policy "nwi_insert_own" on public.net_worth_items
  for insert with check (auth.uid() = user_id);
create policy "nwi_update_own" on public.net_worth_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "nwi_delete_own" on public.net_worth_items
  for delete using (auth.uid() = user_id);

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;

create trigger nwi_set_updated_at
  before update on public.net_worth_items
  for each row execute function public.set_updated_at();
