create table categories(
  id serial primary key,
  name varchar(50) not null,
  description text
);

insert into categories(name, description) values
  ('Сканеры', 'Сканеры 1D/2D штрих-кодов'),
  ('Принтеры этикеток', null);

create table availabilities(
  id serial primary key,
  header varchar(50) not null
);

insert into availabilities(header) values
  ('В наличии'),
  ('Отсутствует');

-- create function default_availability(count integer) returns integer as $$
-- declare
-- begin
--   return case
--       when count=0 then (select id from availabilities where header='В наличии')
--       else (select id from availabilities where header='Отсутствует')
--       end;
-- end;
-- $$ language plpgsql;

create table products(
  id serial primary key,
  category_id integer not null references categories (Id) on delete cascade,
  name varchar(50) not null,
  description text,
  availability integer not null references availabilities(id), -- default default_availability(count_available)
  count_available integer not null,
  
  -- basic because will add possible discounts
  basic_cost money not null
);

insert into products(category_id, name, description, availability, count_available, basic_cost) values
  ((select id from categories where name='Сканеры'), 'Kool Scanner KEK-9000', 'Таки очень крутой сканер', (select id from availabilities where header='В наличии'), 9000, 1005.00);

create table discounts(
  id serial primary key,
  product_id integer not null references products(id),
  starts timestamp not null,
  ends timestamp not null,
  
  percent integer,
  sum money,
  -- discont should be set either as
  -- a multiplier (20%) aka percent or
  -- a specific sum (100 cu) aka sum
  
  -- now let's check at least one of them set
  constraint check_discount check (percent is not null or sum is not null)
);

create table order_statuses(
  id serial primary key,
  name varchar(50) not null,
  description text
);

-- This is for UUID generation, so our Orders will have a URL-safe,
-- unique and hard to guess identifiers such as: 
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
  price money not null
);
