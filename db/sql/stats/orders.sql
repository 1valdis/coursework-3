select (select name from order_statuses where id=order_status) as status, count(*) from orders group by order_status;