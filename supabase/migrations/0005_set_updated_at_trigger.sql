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
