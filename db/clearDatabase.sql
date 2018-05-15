drop table if exists order_items, orders, order_statuses, discounts, products, availabilities, categories, carts, admins, admin_requests;
drop function if exists add_to_cart(text, integer, integer);
drop function if exists remove_from_cart(text, integer, integer);
drop function if exists remove_from_cart(text, integer);
