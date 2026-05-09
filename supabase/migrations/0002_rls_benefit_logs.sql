alter table public.benefit_logs enable row level security;

create policy "benefit_logs_select_own" on public.benefit_logs
  for select using (auth.uid() = user_id);

create policy "benefit_logs_insert_own" on public.benefit_logs
  for insert with check (auth.uid() = user_id);

create policy "benefit_logs_update_own" on public.benefit_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "benefit_logs_delete_own" on public.benefit_logs
  for delete using (auth.uid() = user_id);
