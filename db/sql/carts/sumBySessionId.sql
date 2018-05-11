select sum(carts.quantity*products.cost)
from carts, products
where (carts.session_id=$1 and carts.product_id=products.id)