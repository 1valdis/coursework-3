select order_items.*, products.name, products.description from order_items, products where order_items.product_id=products.id and order_id=$1;