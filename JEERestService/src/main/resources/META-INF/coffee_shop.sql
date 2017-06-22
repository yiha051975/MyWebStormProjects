/*DO
$body$
BEGIN
  IF NOT EXISTS (
      SELECT *
      FROM   pg_catalog.pg_user
      WHERE  usename = 'coffee_shop_db_auth') THEN
    CREATE ROLE coffee_shop_db_auth LOGIN PASSWORD '_v5ZwV=z2zZvYYh*';
  ELSE
    RAISE  NOTICE 'User already exists';
  END IF;
END
$body$;*/

DO
$body$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'coffee_shop') THEN
    RAISE NOTICE 'Schema already exists';
  ELSE
    CREATE SCHEMA coffee_shop;
    ALTER ROLE coffee_shop_db_auth SET SEARCH_PATH TO coffee_shop;
  END IF;
END
$body$;

GRANT ALL PRIVILEGES  ON SCHEMA coffee_shop to postgres;
GRANT ALL ON ALL TABLES IN SCHEMA coffee_shop to postgres;

-- GRANT ALL PRIVILEGES  ON SCHEMA coffee_shop_schema to coffee_shop_db_auth;
/*GRANT SELECT, UPDATE, DELETE, INSERT  ON ALL TABLES IN SCHEMA coffee_shop to coffee_shop_db_auth;*/

/*CREATE SEQUENCE IF NOT EXISTS coffee_shop.product_id_seq;
GRANT SELECT, USAGE ON SEQUENCE coffee_shop.product_id_seq TO coffee_shop_db_auth;
GRANT ALL ON SEQUENCE coffee_shop.product_id_seq TO postgres;*/

CREATE TABLE IF NOT EXISTS coffee_shop.products();

/*ALTER TABLE coffee_shop.products ADD COLUMN IF NOT EXISTS id BIGINT DEFAULT nextval('coffee_shop.product_id_seq'),*/
ALTER TABLE coffee_shop.products ADD COLUMN IF NOT EXISTS id BIGSERIAL,
  ADD COLUMN IF NOT EXISTS sku_id TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS size TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS cost DECIMAL,
  ADD COLUMN IF NOT EXISTS "imgUrl" TEXT NOT NULL DEFAULT '',
  ADD CONSTRAINT product_pkey PRIMARY KEY (id),
  ADD CONSTRAINT sku_id_unique UNIQUE (sku_id);

/*GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE coffee_shop.products TO coffee_shop_db_auth;*/

GRANT ALL ON TABLE coffee_shop.products TO postgres;