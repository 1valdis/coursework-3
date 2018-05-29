drop table if exists order_items, orders, order_statuses, discounts, products, availabilities, categories, carts, admins, admin_requests, site_visits, product_visits, cart_additions;
drop function if exists add_to_cart(text, integer, integer);
drop function if exists remove_from_cart(text, integer, integer);
drop function if exists remove_from_cart(text, integer);

drop trigger if exists cart_update on carts;
drop function if exists cart_update_trigger(integer, integer);
drop trigger if exists cart_insert on carts;
drop function if exists cart_insert_trigger(integer, integer);