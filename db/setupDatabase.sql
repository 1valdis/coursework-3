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
  sessionid text not null, -- Session id from express-session
  product_id integer not null references products(id),
  quantity integer not null
)