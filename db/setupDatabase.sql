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
  count_available integer not null,
  
  -- basic because will add possible discounts
  cost numeric not null
);

insert into products(category_id, name, description, count_available, cost) values
  ((select id from categories where name='Сканеры'), 'Kool Scanner KEK-9000', 'Таки очень крутой сканер', 9000, 1005.00),
  ((select id from categories where name='Сканеры'), 'Kool Scanner KEK-9228', 'Ещё один очень крутой сканер The lysine contingency - it''s intended to prevent the spread of the animals is case they ever got off the island. Dr. Wu inserted a gene that makes a single faulty enzyme in protein metabolism. The animals can''t manufacture the amino acid lysine. Unless they''re continually supplied with lysine by us, they''ll slip into a coma and die.', 9000, 1005.00);

-- create table discounts(
--   id serial primary key,
--   product_id integer not null references products(id),
--   starts timestamp not null,
--   ends timestamp not null,
  
--   percent integer,
--   sum numeric,
--   -- a discont should be set either as
--   -- a multiplier (20%) aka percent or
--   -- a specific sum (100 cu) aka sum
  
--   -- now let's check at least one of them set
--   constraint check_discount check (percent is not null or sum is not null)
-- );

create table order_statuses(
  id serial primary key,
  name varchar(50) not null,
  description text
);

-- This is for UUID generation, so our Orders will have a URL-safe,
-- unique identifiers such as: 
-- c2d29867-3d0b-d497-9191-18a9d8ee7830
create extension if not exists "uuid-ossp";
create table orders(
  id serial primary key,
  slug uuid not null unique default uuid_generate_v4(),
  order_status integer not null references order_statuses(id),
  date timestamp not null default transaction_timestamp(),
  details text
);

create table order_items(
  id serial primary key,
  product_id integer not null references products(id),
  order_id integer not null references orders(id),
  quantity integer not null,
  price numeric not null
);

create table baskets(
  id serial primary key,
  session_id text not null, -- Session id from express-session
  product_id integer not null references products(id),
  quantity integer not null,
  constraint unique_product_and_session unique(session_id, product_id)
);

create or replace function add_to_basket(_session_id text, _product_id integer, _quantity integer)
	returns void as
$$
  declare
    exists_in_basket integer;
  begin
    exists_in_basket:=(select count(*) from baskets where baskets.session_id=_session_id and baskets.product_id=_product_id);
    
    if exists_in_basket=0 then
      insert into baskets(session_id, product_id, quantity) 
        values(_session_id, _product_id, _quantity);
    elsif exists_in_basket=1 then
      update baskets set quantity = quantity+_quantity where session_id=_session_id and product_id=_product_id;
    else
      raise exception 'There should not be more than 1 row with unique product_id and session_id combination.';
    end if;
  end;
$$ language plpgsql;
--select add_to_basket('kek', 1, 228)

create or replace function remove_from_basket(_session_id text, _product_id integer, _quantity integer)
  returns void as
$$
  declare
    product_row baskets%rowtype;
  begin
    
    if (select count(*) from baskets where baskets.session_id = _session_id and baskets.product_id = _product_id) != 1 then
      raise exception 'There should be one session and product combination';
    else
      select * into product_row from baskets where baskets.session_id = _session_id and baskets.product_id = _product_id;
    end if;
    
    if product_row.quantity < _quantity then
      raise exception 'You cannot remove from basket more that there is already';
    elsif product_row.quantity = _quantity then
      delete from baskets where id = product_row.id;
    else
      update baskets set quantity = quantity-_quantity where id = product_row.id;
    end if;

  end;
$$ language plpgsql;
--select remove_from_basket('kek', 2, 10);

create or replace function remove_from_basket(_session_id text, _product_id integer)
  returns void as
$$
  begin
    delete from baskets where baskets.session_id = _session_id and baskets.product_id = _product_id;
  end;
$$ language plpgsql;