create policy "snapshots_select_own" on public.net_worth_snapshots
  for select using (auth.uid() = user_id);

create policy "snapshots_insert_own" on public.net_worth_snapshots
  for insert with check (auth.uid() = user_id);

create policy "snapshots_update_own" on public.net_worth_snapshots
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "snapshots_delete_own" on public.net_worth_snapshots
  for delete using (auth.uid() = user_id);
