alter table public.net_worth_items enable row level security;

create policy "nwi_select_own" on public.net_worth_items
  for select using (auth.uid() = user_id);

create policy "nwi_insert_own" on public.net_worth_items
  for insert with check (auth.uid() = user_id);

create policy "nwi_update_own" on public.net_worth_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "nwi_delete_own" on public.net_worth_items
  for delete using (auth.uid() = user_id);
