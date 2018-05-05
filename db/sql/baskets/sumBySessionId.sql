select sum(baskets.quantity*products.cost)
from baskets, products
where (baskets.session_id=$1 and baskets.product_id=products.id)