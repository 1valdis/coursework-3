create table categories(
  id serial primary key,
  name varchar(50) not null,
  description text
);

insert into categories(name, description) values
  ('Сканеры', 'Сканеры 1D/2D штрих-кодов'),
  ('Принтеры этикеток', 'Ну шо тут ещё можно сказать, принтеры они и в африке принтеры, но поскольку надо затестить описание на количество символов, то Your bones don''t break, mine do. That''s clear. Your cells react to bacteria and viruses differently than mine. You don''t get sick, I do. That''s also clear. But for some reason, you and I react the exact same way to water. We swallow it too fast, we choke. We get some in our lungs, we drown. However unreal it may seem, we are connected, you and I. We''re on the same curve, just on opposite ends.');

create table products(
  id serial primary key,
  category_id integer not null references categories (Id) on delete cascade,
  name varchar(50) not null,
  description text,
  count_available integer not null check (count_available>=0),
  
  -- basic because will add possible discounts
  cost numeric not null
);

insert into products(category_id, name, description, count_available, cost) values
  ((select id from categories where name='Сканеры'), 'Kool Scanner KEK-9000', 'Таки очень крутой сканер', 9000, 1005.00),
  ((select id from categories where name='Сканеры'), 'Kool Scanner KEK-9228', 'Ещё один очень крутой сканер The lysine contingency - it''s intended to prevent the spread of the animals is case they ever got off the island. Dr. Wu inserted a gene that makes a single faulty enzyme in protein metabolism. The animals can''t manufacture the amino acid lysine. Unless they''re continually supplied with lysine by us, they''ll slip into a coma and die.', 9000, 1234.56);

create table order_statuses(
  id serial primary key,
  name varchar(50) not null,
  description text
);

insert into order_statuses(name, description) values ('Ожидает подтверждения', null), ('Подтверждён', null), ('Отправлен', null), ('Завершён', null), ('Отменён', null), ('Возвращён', null);

-- This is for UUID generation, so our Orders will have a URL-safe,
-- unique identifiers such as: 
-- c2d29867-3d0b-d497-9191-18a9d8ee7830
create extension if not exists "uuid-ossp";
create table orders(
  id serial primary key,
  slug uuid not null unique default uuid_generate_v4(),
  session_id text not null,
  order_status integer not null references order_statuses(id),
  date timestamp not null default transaction_timestamp(),
  firstname text not null,
  lastname text not null,
  patronymic text not null,
  phone text not null,
  address text not null,
  details text
);

create table order_items(
  id serial primary key,
  product_id integer not null references products(id),
  order_id integer not null references orders(id),
  quantity integer not null,
  price numeric not null
);

create table carts(
  id serial primary key,
  session_id text not null, -- Session id from express-session
  product_id integer not null references products(id),
  quantity integer not null,
  constraint unique_product_and_session unique(session_id, product_id)
);

create or replace function make_order(_session_id text, _firstname text, _lastname text, _patronymic text, _phone text, _address text, _details text)
  returns text as
$$
  declare
    order_id integer;
    order_slug text;
  begin
    --check for 0 in cart
    if (select count(*) from carts, products where products.id=carts.product_id and carts.session_id=_session_id)=0 then
      raise exception 'Корзина пуста.';
    end if;
    --creating new order row and getting its id
    insert into orders (session_id, order_status, firstname, lastname, patronymic, phone, address, details) values( _session_id,
      (select id from order_statuses where name='Ожидает подтверждения'),
      _firstname, _lastname, _patronymic, _phone, _address, _details)
    returning id, slug into order_id, order_slug;
    
    --update and check available quantity
    begin
      update products set count_available=count_available-carts.quantity
      from carts
      where products.id=carts.product_id and carts.session_id=_session_id;
    exception
      when check_violation then
        raise exception 'В корзине больше товаров, чем имеется в наличии в данный момент.';
    end;
    
    --inserting products from cart into order_items
    insert into order_items(product_id, order_id, quantity, price)
      select carts.product_id, order_id, carts.quantity,
        (select cost from products where products.id=carts.product_id) as price
    from carts
    where carts.session_id=_session_id;
    
    --deleting cart of this session
    delete from carts where session_id=_session_id;
    
    return order_slug;
  end;
$$ language plpgsql;

--select add_to_cart('kek', 1, 2);
--select add_to_cart('kek', 2, 3);
--select make_order('kek', 'vlad', 'gooba', 'kekovich', '+22814881337', 'lol street 13/37', 'test');

create or replace function add_to_cart(_session_id text, _product_id integer, _quantity integer)
	returns void as
$$
  declare
    exists_in_cart integer;
    product_exists boolean;
  begin
    product_exists:=(select count(*) from products where id=_product_id)=1;
    
    if not product_exists then
      raise exception 'Такого товара не существует.';
    end if;
  
    exists_in_cart:=(select count(*) from carts where carts.session_id=_session_id and carts.product_id=_product_id);
    
    if exists_in_cart=0 then
      insert into carts(session_id, product_id, quantity) 
        values(_session_id, _product_id, _quantity);
    elsif exists_in_cart=1 then
      update carts set quantity = quantity+_quantity where session_id=_session_id and product_id=_product_id;
    else
      raise exception 'There should not be more than 1 row with unique product_id and session_id combination.';
    end if;
  end;
$$ language plpgsql;

create or replace function remove_from_cart(_session_id text, _product_id integer, _quantity integer)
  returns void as
$$
  declare
    product_row carts%rowtype;
  begin
    
    if (select count(*) from carts where carts.session_id = _session_id and carts.product_id = _product_id) != 1 then
      raise exception 'There should be one session and product combination';
    else
      select * into product_row from carts where carts.session_id = _session_id and carts.product_id = _product_id;
    end if;
    
    if product_row.quantity < _quantity then
      raise exception 'You cannot remove from cart more that there is already';
    elsif product_row.quantity = _quantity then
      delete from carts where id = product_row.id;
    else
      update carts set quantity = quantity-_quantity where id = product_row.id;
    end if;

  end;
$$ language plpgsql;
--select remove_from_cart('kek', 2, 10);

create or replace function remove_from_cart(_session_id text, _product_id integer)
  returns void as
$$
  begin
    delete from carts where carts.session_id = _session_id and carts.product_id = _product_id;
  end;
$$ language plpgsql;

create table admins(
  id serial primary key,
  username text not null unique,
  password text not null,
  can_approve_admins boolean not null default false,
  can_edit_store boolean not null default false,
  can_manage_orders boolean not null default false
);

create table admin_requests(
  id serial primary key,
  username text not null unique,
  password text not null
);