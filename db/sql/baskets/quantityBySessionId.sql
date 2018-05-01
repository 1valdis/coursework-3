select sum(baskets.quantity)
from baskets
where (baskets.session_id=$1)