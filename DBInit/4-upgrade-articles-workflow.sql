ALTER TABLE public."Articles"
  ADD COLUMN IF NOT EXISTS "Status" character varying(32),
  ADD COLUMN IF NOT EXISTS "CreatedByUserId" uuid,
  ADD COLUMN IF NOT EXISTS "UpdatedByUserId" uuid,
  ADD COLUMN IF NOT EXISTS "CreatedAt" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "UpdatedAt" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "SubmittedAt" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "PublishedAt" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "ReviewedAt" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "ReviewedByUserId" uuid,
  ADD COLUMN IF NOT EXISTS "ReviewNote" character varying(1000),
  ADD COLUMN IF NOT EXISTS "ArchivedAt" timestamp with time zone;

UPDATE public."Articles"
SET "Status" = 'Published'
WHERE "Status" IS NULL OR btrim("Status") = '';

UPDATE public."Articles"
SET "CreatedAt" = COALESCE("CreatedAt", now()),
    "UpdatedAt" = COALESCE("UpdatedAt", now()),
    "PublishedAt" = COALESCE("PublishedAt", "PublishDate", now())
WHERE "CreatedAt" IS NULL
   OR "UpdatedAt" IS NULL
   OR "PublishedAt" IS NULL;

DO $$
DECLARE
  super_user_id uuid;
BEGIN
  SELECT u."Id"
  INTO super_user_id
  FROM public."Users" u
  JOIN public."Roles" r ON r."Id" = u."RoleId"
  WHERE r."AccessLevel" = 0
  ORDER BY u."Id"
  LIMIT 1;

  IF super_user_id IS NULL THEN
    SELECT u."Id"
    INTO super_user_id
    FROM public."Users" u
    ORDER BY u."Id"
    LIMIT 1;
  END IF;

  IF super_user_id IS NOT NULL THEN
    UPDATE public."Articles"
    SET "CreatedByUserId" = super_user_id
    WHERE "CreatedByUserId" IS NULL;
  END IF;
END $$;

ALTER TABLE public."Articles"
  ALTER COLUMN "Status" SET NOT NULL,
  ALTER COLUMN "Status" SET DEFAULT 'Published',
  ALTER COLUMN "CreatedAt" SET NOT NULL,
  ALTER COLUMN "CreatedAt" SET DEFAULT now(),
  ALTER COLUMN "UpdatedAt" SET NOT NULL,
  ALTER COLUMN "UpdatedAt" SET DEFAULT now(),
  ALTER COLUMN "CreatedByUserId" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Articles_CreatedByUserId_fkey') THEN
    ALTER TABLE public."Articles"
      ADD CONSTRAINT "Articles_CreatedByUserId_fkey"
      FOREIGN KEY ("CreatedByUserId") REFERENCES public."Users"("Id") ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Articles_UpdatedByUserId_fkey') THEN
    ALTER TABLE public."Articles"
      ADD CONSTRAINT "Articles_UpdatedByUserId_fkey"
      FOREIGN KEY ("UpdatedByUserId") REFERENCES public."Users"("Id") ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Articles_ReviewedByUserId_fkey') THEN
    ALTER TABLE public."Articles"
      ADD CONSTRAINT "Articles_ReviewedByUserId_fkey"
      FOREIGN KEY ("ReviewedByUserId") REFERENCES public."Users"("Id") ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_articles_status ON public."Articles" USING btree ("Status");
CREATE INDEX IF NOT EXISTS idx_articles_status_publish_date ON public."Articles" USING btree ("Status", "PublishDate");
CREATE INDEX IF NOT EXISTS idx_articles_created_by ON public."Articles" USING btree ("CreatedByUserId");

INSERT INTO public."Permissions" ("Id", "Code", "Name", "Description", "IsSystem")
VALUES ('10000000-0000-0000-0000-000000000024', 'content.articles.review', 'Review articles', 'Review and reject articles', true),
       ('10000000-0000-0000-0000-000000000025', 'content.articles.publish', 'Publish articles', 'Approve and publish articles', true),
       ('10000000-0000-0000-0000-000000000026', 'content.articles.archive', 'Archive articles', 'Archive articles from active publication', true),
       ('10000000-0000-0000-0000-000000000027', 'content.articles.manage-any', 'Manage any articles', 'Manage all articles regardless of ownership', true),
       ('10000000-0000-0000-0000-000000000028', 'content.articles.purge', 'Purge articles', 'Hard delete articles', true),
       ('10000000-0000-0000-0000-000000000029', 'content.article-media.write', 'Write article media', 'Upload and delete article media files', true)
ON CONFLICT ("Code") DO NOTHING;

-- SuperUser (access = 0): add all missing permissions
INSERT INTO public."RolePermissions" ("RoleId", "PermissionId")
SELECT r."Id", p."Id"
FROM public."Roles" r
JOIN public."Permissions" p ON p."Code" IN (
    'content.articles.review',
    'content.articles.publish',
    'content.articles.archive',
    'content.articles.manage-any',
    'content.articles.purge',
    'content.article-media.write'
)
WHERE r."AccessLevel" = 0
ON CONFLICT ("RoleId", "PermissionId") DO NOTHING;

-- Administrator (access 1..5)
INSERT INTO public."RolePermissions" ("RoleId", "PermissionId")
SELECT r."Id", p."Id"
FROM public."Roles" r
JOIN public."Permissions" p ON p."Code" IN (
    'content.articles.review',
    'content.articles.publish',
    'content.articles.archive',
    'content.articles.manage-any',
    'content.article-media.write'
)
WHERE r."AccessLevel" BETWEEN 1 AND 5
ON CONFLICT ("RoleId", "PermissionId") DO NOTHING;

-- Junior administrator (access 6..18)
INSERT INTO public."RolePermissions" ("RoleId", "PermissionId")
SELECT r."Id", p."Id"
FROM public."Roles" r
JOIN public."Permissions" p ON p."Code" IN (
    'content.articles.review',
    'content.articles.publish',
    'content.articles.archive',
    'content.articles.manage-any',
    'content.article-media.write'
)
WHERE r."AccessLevel" BETWEEN 6 AND 18
ON CONFLICT ("RoleId", "PermissionId") DO NOTHING;

-- Editor (access 19)
INSERT INTO public."RolePermissions" ("RoleId", "PermissionId")
SELECT r."Id", p."Id"
FROM public."Roles" r
JOIN public."Permissions" p ON p."Code" IN (
    'content.article-media.write'
)
WHERE r."AccessLevel" = 19
ON CONFLICT ("RoleId", "PermissionId") DO NOTHING;
