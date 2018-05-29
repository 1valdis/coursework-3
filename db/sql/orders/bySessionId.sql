select orders.*, order_statuses.name as status_name, 
(select sum(quantity*price) from order_items where order_id=orders.id) as sum,
(select sum(quantity) from order_items where order_id=orders.id) as quantity
from orders, order_statuses
where orders.session_id=$1 and order_statuses.id=orders.order_status;