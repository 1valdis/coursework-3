update products set name=${name}, description=${description}, category_id=(select id from categories where name=${category_name}), count_available=count_available+${count_available}, cost=${cost} where id=${id};