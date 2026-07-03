create table products (
  id bigint generated always as identity primary key,
  sku text unique,
  name text not null,
  price numeric not null,
  description text,
  category text,
  material text,
  occasion text,
  color text,
  tags text[],
  stock_status text default 'in_stock',
  images text[],
  created_at timestamptz default now()
);

create table orders (
  id bigint generated always as identity primary key,
  customer jsonb not null,          -- {firstName, lastName, email, phone, address, city, state, pincode}
  items jsonb not null,             -- [{product_id, name, price, quantity}]
  subtotal numeric not null,
  shipping numeric not null,
  total numeric not null,
  payment_method text default 'cod',
  status text default 'new',        -- new | processing | shipped | delivered
  created_at timestamptz default now()
);

create table newsletter_signups (
  id bigint generated always as identity primary key,
  email text unique not null,
  created_at timestamptz default now()
);

create table contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text,
  created_at timestamptz default now()
);

-- Row Level Security: lock everything down by default,
-- only allow reads on products from the public
alter table products enable row level security;
alter table orders enable row level security;
alter table newsletter_signups enable row level security;
alter table contact_messages enable row level security;

create policy "Public can read products" on products
  for select using (true);