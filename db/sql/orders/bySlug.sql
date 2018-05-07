select *, order_statuses.name as status_name, order_statuses.description as status_description, (select sum(quantity*price) from order_items where order_id=orders.id) as sum
from orders, order_statuses
where orders.slug=$1 and order_statuses.id=orders.order_status;