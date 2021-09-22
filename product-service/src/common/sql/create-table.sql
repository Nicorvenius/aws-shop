CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table products (
id uuid primary key default uuid_generate_v4(),
title text NOT NULL,
description text,
price integer
);

create table stocks (
id uuid primary key default uuid_generate_v4(),
product_id uuid,
count integer,
UNIQUE("product_id"),
foreign key ("product_id") references "products" ("id")
on delete CASCADE
);
