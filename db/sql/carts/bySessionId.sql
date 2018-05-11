select *, carts.quantity*products.cost as price
from carts, products
where (carts.session_id=$1 and carts.product_id=products.id)