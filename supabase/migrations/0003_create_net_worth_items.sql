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
