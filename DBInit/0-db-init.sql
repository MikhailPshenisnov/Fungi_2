-- Сначала таблицы без зависимостей
CREATE TABLE public."Roles" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "Name" character varying(32) NOT NULL,
  "AccessLevel" integer NOT NULL
);
CREATE UNIQUE INDEX roles_unique_name ON public."Roles" USING btree ("Name");

CREATE TABLE public."Articles" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "Title" character varying(256) NOT NULL,
  "PublishDate" timestamp with time zone NOT NULL,
  "AuthorString" character varying(128) NOT NULL,
  "HeaderPhotoLink" character varying(256) NOT NULL,
  "ExtraPhotoLinks" character varying(1024)
);
CREATE UNIQUE INDEX articles_unique_title ON public."Articles" USING btree ("Title");

CREATE TABLE public."Mushrooms" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "Name" character varying(128) NOT NULL,
  "SynonymousName" character varying(128),
  "LatinName" character varying(128),
  "Family" character varying(128) NOT NULL,
  "RedBook" boolean NOT NULL,
  "Eatable" character varying(16) NOT NULL,
  "HasStem" boolean NOT NULL,
  "StemSizeFrom" integer,
  "StemSizeTo" integer,
  "StemType" character varying(64),
  "StemColor" character varying(64),
  "CapType" character varying(64) NOT NULL,
  "CapColor" character varying(64) NOT NULL,
  "CapUndersideType" character varying(64) NOT NULL,
  "Description" text NOT NULL,
  "HeaderPhotoLink" character varying(256) NOT NULL,
  "ExtraPhotoLinks" character varying(1024)
);
CREATE UNIQUE INDEX mushrooms_unique_name ON public."Mushrooms" USING btree ("Name");

-- Затем таблицы с зависимостями
CREATE TABLE public."Users" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "Username" character varying(128) NOT NULL,
  "Email" character varying(128),
  "PasswordHash" character varying(128) NOT NULL,
  "RoleId" uuid NOT NULL,
  FOREIGN KEY ("RoleId") REFERENCES public."Roles" ("Id")
  MATCH SIMPLE ON UPDATE NO ACTION ON DELETE RESTRICT
);
CREATE INDEX "fki_Users_RoleId_fkey" ON public."Users" USING btree ("RoleId");
CREATE UNIQUE INDEX users_unique_email ON public."Users" USING btree ("Email");
CREATE UNIQUE INDEX users_unique_username ON public."Users" USING btree ("Username");

CREATE TABLE public."Paragraphs" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "ArticleId" uuid NOT NULL,
  "ParagraphText" text NOT NULL,
  "SerialNumber" integer NOT NULL,
  "IsSubtitle" boolean NOT NULL,
  FOREIGN KEY ("ArticleId") REFERENCES public."Articles" ("Id")
  MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE
);
CREATE INDEX "fki_Paragraphs_ArticleId_fkey" ON public."Paragraphs" USING btree ("ArticleId");

CREATE TABLE public."Doppelgangers" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "MushroomId" uuid NOT NULL,
  "DoppelgangerName" character varying(128) NOT NULL,
  FOREIGN KEY ("MushroomId") REFERENCES public."Mushrooms" ("Id")
  MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE
);
CREATE INDEX "fki_Doppelgangers_MushroomId_fkey" ON public."Doppelgangers" USING btree ("MushroomId");