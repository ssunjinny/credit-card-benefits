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
