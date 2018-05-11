select sum(carts.quantity) as quantity
from carts
where (carts.session_id=$1)