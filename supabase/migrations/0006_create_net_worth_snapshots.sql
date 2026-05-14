create table public.net_worth_snapshots (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  item_id       uuid not null references public.net_worth_items(id) on delete cascade,
  amount_cents  bigint not null,
  captured_at   date not null default (current_date),
  note          text,
  created_at    timestamptz not null default now()
);

create index net_worth_snapshots_item_idx
  on public.net_worth_snapshots (item_id, captured_at desc);
create index net_worth_snapshots_user_idx
  on public.net_worth_snapshots (user_id, captured_at desc);

alter table public.net_worth_snapshots enable row level security;
