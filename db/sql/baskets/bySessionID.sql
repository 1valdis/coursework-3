select *, baskets.quantity*products.cost as price
from baskets, products
where (baskets.sessionid=$1 and baskets.product_id=products.id)