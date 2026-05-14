insert into public.net_worth_snapshots (user_id, item_id, amount_cents, captured_at)
select user_id, id, amount_cents, current_date
from public.net_worth_items;
