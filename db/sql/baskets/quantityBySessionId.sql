select sum(baskets.quantity) as quantity
from baskets
where (baskets.session_id=$1)