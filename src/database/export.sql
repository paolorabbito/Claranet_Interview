-- Adminer 4.8.1 PostgreSQL 14.5 (Debian 14.5-1.pgdg110+1) dump

\connect "claranet";

DROP TABLE IF EXISTS "checkout";
DROP SEQUENCE IF EXISTS checkout_id_seq;
CREATE SEQUENCE checkout_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."checkout" (
    "id" integer DEFAULT nextval('checkout_id_seq') NOT NULL,
    "user_id" text NOT NULL,
    "cash" double precision NOT NULL,
    "products" json NOT NULL,
    "date" date NOT NULL,
    "sales_point" integer,
    CONSTRAINT "checkout_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "checkout" ("id", "user_id", "cash", "products", "date", "sales_point") VALUES
(1,	'11111111',	5,	'[1,3,4]',	'2021-09-28',	1),
(2,	'11111111',	3,	'[1]',	'2021-12-15',	1),
(3,	'11111111',	1,	'[3]',	'2022-02-14',	1),
(4,	'33333333',	5.5,	'[1,2]',	'2021-12-15',	2);

DROP TABLE IF EXISTS "product";
DROP SEQUENCE IF EXISTS product_id_seq;
CREATE SEQUENCE product_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."product" (
    "id" integer DEFAULT nextval('product_id_seq') NOT NULL,
    "description" text NOT NULL,
    "production_cost" double precision NOT NULL,
    "selling_cost" double precision NOT NULL,
    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "product" ("id", "description", "production_cost", "selling_cost") VALUES
(1,	'Crispy',	1.5,	3),
(2,	'Nuggets',	1.25,	2.5),
(3,	'Donuts',	0.5,	1),
(4,	'Coke',	0.25,	1),
(5,	'Chickenburger',	1.5,	3);

DROP TABLE IF EXISTS "registry";
CREATE TABLE "public"."registry" (
    "card" text NOT NULL,
    "name" text NOT NULL,
    "surname" text NOT NULL,
    "email" text NOT NULL,
    "age" integer NOT NULL,
    "city" text NOT NULL,
    "gender" character(1)
) WITH (oids = false);

INSERT INTO "registry" ("card", "name", "surname", "email", "age", "city", "gender") VALUES
('22222222',	'Erika',	'Moltisanti',	'e.molti@gmail.com',	23,	'Palermo',	'f'),
('33333333',	'Mirko',	'Pluchino',	'm.pluchino@gmail.com',	32,	'Catania',	'm'),
('44444444',	'Marco',	'Montemagno',	'm.monti@gmail.com',	45,	'Catania',	'm'),
('99999999',	'pippo',	'rossi',	'pippor@gmail.com',	39,	'Ragusa',	'm'),
('55555555',	'Chiara',	'Moltisanti',	'chiara.m@gmail.com',	29,	'Ragusa',	'f');

DROP TABLE IF EXISTS "sales";
DROP SEQUENCE IF EXISTS sales_id_seq;
CREATE SEQUENCE sales_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."sales" (
    "id" integer DEFAULT nextval('sales_id_seq') NOT NULL,
    "product_id" integer NOT NULL,
    "in" double precision NOT NULL,
    "out" double precision NOT NULL,
    "date" date NOT NULL,
    "sales_point" integer NOT NULL,
    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "sales" ("id", "product_id", "in", "out", "date", "sales_point") VALUES
(1,	1,	100,	90,	'2021-09-28',	1),
(2,	2,	100,	67,	'2021-09-28',	1),
(3,	3,	100,	78,	'2021-09-28',	1),
(4,	4,	300,	260,	'2021-09-28',	1),
(5,	5,	100,	98,	'2021-09-28',	1),
(6,	1,	100,	95,	'2021-09-29',	1),
(7,	2,	100,	15,	'2021-09-29',	1),
(9,	4,	300,	240,	'2021-09-29',	1),
(10,	5,	150,	67,	'2021-09-29',	1),
(12,	2,	100,	67,	'2021-09-28',	2),
(13,	3,	300,	260,	'2021-09-28',	2),
(14,	4,	200,	165,	'2021-09-28',	2),
(15,	5,	100,	78,	'2021-09-28',	2),
(8,	3,	150,	125,	'2021-09-29',	1),
(16,	1,	100,	69,	'2021-09-29',	2),
(17,	2,	150,	123,	'2021-09-29',	2),
(18,	3,	100,	98,	'2021-09-29',	2),
(19,	4,	300,	245,	'2021-09-29',	2),
(20,	5,	100,	24,	'2021-09-29',	2),
(22,	2,	300,	67,	'2021-09-28',	3),
(23,	3,	300,	255,	'2021-09-28',	3),
(24,	4,	300,	289,	'2021-09-28',	3),
(25,	5,	200,	167,	'2021-09-28',	3),
(26,	1,	100,	90,	'2021-09-29',	3),
(27,	2,	150,	90,	'2021-09-29',	3),
(28,	4,	300,	278,	'2021-09-29',	3),
(29,	5,	100,	90,	'2021-09-29',	3),
(30,	3,	100,	45,	'2021-09-29',	3),
(31,	1,	150,	98,	'2021-09-30',	1),
(11,	1,	100,	92,	'2021-09-28',	2),
(21,	1,	100,	88,	'2021-09-28',	3);

DROP TABLE IF EXISTS "sales_point";
CREATE TABLE "public"."sales_point" (
    "id" integer NOT NULL,
    "city" text NOT NULL,
    CONSTRAINT "sales_point_id" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "sales_point" ("id", "city") VALUES
(1,	'Ragusa'),
(2,	'Catania'),
(3,	'Palermo');

DROP TABLE IF EXISTS "type";
CREATE TABLE "public"."type" (
    "id" smallint NOT NULL,
    "description" text NOT NULL
) WITH (oids = false);

INSERT INTO "type" ("id", "description") VALUES
(1,	'Admin'),
(2,	'Operator'),
(3,	'Client');

DROP TABLE IF EXISTS "users";
CREATE TABLE "public"."users" (
    "card_id" text NOT NULL,
    "password" text NOT NULL,
    "type" smallint,
    CONSTRAINT "users_card_id" PRIMARY KEY ("card_id")
) WITH (oids = false);

INSERT INTO "users" ("card_id", "password", "type") VALUES
('00000000',	'$2b$10$M2iNpKdF0pv6H3UN7BoNhOPH.gJ8IFsAhjgvLzvNTBO0bs5so.1Na',	1),
('22222222',	'$2b$10$IIxpTvnYbiTjDCvx1qvikejojTB8mrUrp1QJ12LKx/JeUGV2jrimm',	3),
('33333333',	'$2b$10$PgoJ.UQFivo4HNHCIzM8S.CSNCbq..98fFU6PMr2sD11PggSmrNwK',	3),
('44444444',	'$2b$10$UgzG6sdBYxTF46ZeBvAX5uWGaRg8DS34oPS4BQjdd4YIACV2Q6DGO',	3),
('10101010',	'$2b$10$OVWmTB5OaKYFsjWJa1c1fegSGoEAzDUbRfIy4c6mzUGgwdO712wpa',	2),
('99999999',	'$2b$10$yMWiYxXO3G6Bgr.ivkNwbOcYb8OOeMXMib8WV.ODhCd2/wyhXsmz2',	3),
('55555555',	'$2b$10$.qCAXX2y3.kDg421BP7EmeBQrD.mVhSqtH99gh1nBg8LyTTF4fqCG',	3);

ALTER TABLE ONLY "public"."sales" ADD CONSTRAINT "sales_product_id_fkey" FOREIGN KEY (product_id) REFERENCES product(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."sales" ADD CONSTRAINT "sales_sales_point_fkey" FOREIGN KEY (sales_point) REFERENCES sales_point(id) NOT DEFERRABLE;

-- 2022-09-19 21:41:04.344602+00