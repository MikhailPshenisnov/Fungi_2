CREATE TABLE public."Roles" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "Name" character varying(32) NOT NULL,
  "AccessLevel" integer NOT NULL
);
CREATE UNIQUE INDEX roles_unique_name ON public."Roles" USING btree ("Name");

CREATE TABLE public."Permissions" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "Code" character varying(128) NOT NULL,
  "Name" character varying(64) NOT NULL,
  "Description" character varying(512),
  "IsSystem" boolean NOT NULL DEFAULT false
);
CREATE UNIQUE INDEX permissions_unique_code ON public."Permissions" USING btree ("Code");

CREATE TABLE public."Users" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "Username" character varying(128) NOT NULL,
  "Email" character varying(128),
  "PasswordHash" character varying(128) NOT NULL,
  "AvatarPath" character varying(512),
  "RoleId" uuid NOT NULL,
  CONSTRAINT "Users_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES public."Roles"("Id") ON DELETE RESTRICT
);
CREATE INDEX "fki_Users_RoleId_fkey" ON public."Users" USING btree ("RoleId");
CREATE UNIQUE INDEX users_unique_email ON public."Users" USING btree ("Email");
CREATE UNIQUE INDEX users_unique_username ON public."Users" USING btree ("Username");

CREATE TABLE public."Articles" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "Title" character varying(256) NOT NULL,
  "PublishDate" timestamp with time zone NOT NULL,
  "AuthorString" character varying(128) NOT NULL,
  "HeaderPhotoLink" character varying(256) NOT NULL,
  "ExtraPhotoLinks" character varying(1024),
  "Status" character varying(32) NOT NULL DEFAULT 'Published',
  "CreatedByUserId" uuid NOT NULL,
  "UpdatedByUserId" uuid,
  "CreatedAt" timestamp with time zone NOT NULL DEFAULT now(),
  "UpdatedAt" timestamp with time zone NOT NULL DEFAULT now(),
  "SubmittedAt" timestamp with time zone,
  "PublishedAt" timestamp with time zone,
  "ReviewedAt" timestamp with time zone,
  "ReviewedByUserId" uuid,
  "ReviewNote" character varying(1000),
  "ArchivedAt" timestamp with time zone,
  CONSTRAINT "Articles_CreatedByUserId_fkey" FOREIGN KEY ("CreatedByUserId") REFERENCES public."Users"("Id") ON DELETE RESTRICT,
  CONSTRAINT "Articles_UpdatedByUserId_fkey" FOREIGN KEY ("UpdatedByUserId") REFERENCES public."Users"("Id") ON DELETE SET NULL,
  CONSTRAINT "Articles_ReviewedByUserId_fkey" FOREIGN KEY ("ReviewedByUserId") REFERENCES public."Users"("Id") ON DELETE SET NULL
);
CREATE UNIQUE INDEX articles_unique_title ON public."Articles" USING btree ("Title");
CREATE INDEX idx_articles_status ON public."Articles" USING btree ("Status");
CREATE INDEX idx_articles_status_publish_date ON public."Articles" USING btree ("Status", "PublishDate");
CREATE INDEX idx_articles_created_by ON public."Articles" USING btree ("CreatedByUserId");

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
  "ExtraPhotoLinks" character varying(1024),
  "IsArchived" boolean NOT NULL DEFAULT false
);
CREATE UNIQUE INDEX mushrooms_unique_name ON public."Mushrooms" USING btree ("Name");
CREATE INDEX idx_mushrooms_is_archived ON public."Mushrooms" USING btree ("IsArchived");

CREATE TABLE public."MushroomRevisions" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "SourceMushroomId" uuid,
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
  "HeaderPhotoLink" character varying(256),
  "ExtraPhotoLinks" character varying(1024),
  "Status" character varying(32) NOT NULL DEFAULT 'Draft',
  "CreatedByUserId" uuid NOT NULL,
  "UpdatedByUserId" uuid,
  "CreatedAt" timestamp with time zone NOT NULL DEFAULT now(),
  "UpdatedAt" timestamp with time zone NOT NULL DEFAULT now(),
  "SubmittedAt" timestamp with time zone,
  "PublishedAt" timestamp with time zone,
  "ReviewedAt" timestamp with time zone,
  "ReviewedByUserId" uuid,
  "ReviewNote" character varying(1000),
  "ArchivedAt" timestamp with time zone,
  CONSTRAINT mushroom_revisions_status_check CHECK ("Status" IN ('Draft', 'InReview', 'Published', 'Rejected', 'Archived')),
  CONSTRAINT "MushroomRevisions_SourceMushroomId_fkey" FOREIGN KEY ("SourceMushroomId") REFERENCES public."Mushrooms"("Id") ON DELETE SET NULL,
  CONSTRAINT "MushroomRevisions_CreatedByUserId_fkey" FOREIGN KEY ("CreatedByUserId") REFERENCES public."Users"("Id") ON DELETE RESTRICT,
  CONSTRAINT "MushroomRevisions_UpdatedByUserId_fkey" FOREIGN KEY ("UpdatedByUserId") REFERENCES public."Users"("Id") ON DELETE SET NULL,
  CONSTRAINT "MushroomRevisions_ReviewedByUserId_fkey" FOREIGN KEY ("ReviewedByUserId") REFERENCES public."Users"("Id") ON DELETE SET NULL
);
CREATE INDEX idx_mushroom_revisions_status ON public."MushroomRevisions" USING btree ("Status");
CREATE INDEX idx_mushroom_revisions_created_by ON public."MushroomRevisions" USING btree ("CreatedByUserId");
CREATE INDEX idx_mushroom_revisions_source_mushroom ON public."MushroomRevisions" USING btree ("SourceMushroomId");
CREATE UNIQUE INDEX uq_mushroom_revisions_published_source
    ON public."MushroomRevisions" ("SourceMushroomId")
    WHERE "Status" = 'Published' AND "SourceMushroomId" IS NOT NULL;

CREATE TABLE public."MushroomRevisionDoppelgangers" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "RevisionId" uuid NOT NULL,
  "DoppelgangerName" character varying(128) NOT NULL,
  CONSTRAINT "MushroomRevisionDoppelgangers_RevisionId_fkey" FOREIGN KEY ("RevisionId") REFERENCES public."MushroomRevisions"("Id") ON DELETE CASCADE
);
CREATE INDEX "fki_MushroomRevisionDoppelgangers_RevisionId_fkey" ON public."MushroomRevisionDoppelgangers" USING btree ("RevisionId");

CREATE TABLE public."RolePermissions" (
  "RoleId" uuid NOT NULL,
  "PermissionId" uuid NOT NULL,
  PRIMARY KEY ("RoleId", "PermissionId"),
  CONSTRAINT "RolePermissions_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES public."Roles"("Id") ON DELETE CASCADE,
  CONSTRAINT "RolePermissions_PermissionId_fkey" FOREIGN KEY ("PermissionId") REFERENCES public."Permissions"("Id") ON DELETE CASCADE
);
CREATE INDEX "fki_RolePermissions_RoleId_fkey" ON public."RolePermissions" USING btree ("RoleId");
CREATE INDEX "fki_RolePermissions_PermissionId_fkey" ON public."RolePermissions" USING btree ("PermissionId");

CREATE TABLE public."Paragraphs" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "ArticleId" uuid NOT NULL,
  "ParagraphText" text NOT NULL,
  "SerialNumber" integer NOT NULL,
  "IsSubtitle" boolean NOT NULL,
  CONSTRAINT "Paragraphs_ArticleId_fkey" FOREIGN KEY ("ArticleId") REFERENCES public."Articles"("Id") ON DELETE CASCADE
);
CREATE INDEX "fki_Paragraphs_ArticleId_fkey" ON public."Paragraphs" USING btree ("ArticleId");

CREATE TABLE public."Doppelgangers" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "MushroomId" uuid NOT NULL,
  "DoppelgangerName" character varying(128) NOT NULL,
  CONSTRAINT "Doppelgangers_MushroomId_fkey" FOREIGN KEY ("MushroomId") REFERENCES public."Mushrooms"("Id") ON DELETE CASCADE
);
CREATE INDEX "fki_Doppelgangers_MushroomId_fkey" ON public."Doppelgangers" USING btree ("MushroomId");

CREATE TABLE public."ArticleLikes" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "ArticleId" uuid NOT NULL,
  "UserId" uuid NOT NULL,
  "LikeDate" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "ArticleLikes_ArticleId_fkey" FOREIGN KEY ("ArticleId") REFERENCES public."Articles"("Id") ON DELETE CASCADE,
  CONSTRAINT "ArticleLikes_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"("Id") ON DELETE CASCADE,
  CONSTRAINT article_likes_unique_user_article UNIQUE ("ArticleId", "UserId")
);

CREATE TABLE public."MushroomLikes" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "MushroomId" uuid NOT NULL,
  "UserId" uuid NOT NULL,
  "LikeDate" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "MushroomLikes_MushroomId_fkey" FOREIGN KEY ("MushroomId") REFERENCES public."Mushrooms"("Id") ON DELETE CASCADE,
  CONSTRAINT "MushroomLikes_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"("Id") ON DELETE CASCADE,
  CONSTRAINT mushroom_likes_unique_user_mushroom UNIQUE ("MushroomId", "UserId")
);

CREATE TABLE public."ArticleMushrooms" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "ArticleId" uuid NOT NULL,
  "MushroomId" uuid NOT NULL,
  CONSTRAINT "ArticleMushrooms_ArticleId_fkey" FOREIGN KEY ("ArticleId") REFERENCES public."Articles"("Id") ON DELETE CASCADE,
  CONSTRAINT "ArticleMushrooms_MushroomId_fkey" FOREIGN KEY ("MushroomId") REFERENCES public."Mushrooms"("Id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX article_mushroom_unique ON public."ArticleMushrooms" ("ArticleId", "MushroomId");
