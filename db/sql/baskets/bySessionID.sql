select *, baskets.quantity*products.basic_cost as price
from baskets, products
where (baskets.sessionid=$1 and baskets.product_id=products.id)