select count(*) as visits, (select name from products where id=product_id) as name from product_visits group by product_id;