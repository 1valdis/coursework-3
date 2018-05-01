drop table if exists order_items, orders, order_statuses, discounts, products, availabilities, categories, baskets;
drop function if exists add_to_basket(text, integer, integer);
drop function if exists remove_from_basket(text, integer, integer);
drop function if exists remove_from_basket(text, integer);