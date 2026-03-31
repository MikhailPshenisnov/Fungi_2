CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public."Mushrooms"
    ADD COLUMN IF NOT EXISTS "IsArchived" boolean NOT NULL DEFAULT false;

UPDATE public."Mushrooms"
SET "IsArchived" = false
WHERE "IsArchived" IS NULL;

CREATE INDEX IF NOT EXISTS idx_mushrooms_is_archived ON public."Mushrooms" USING btree ("IsArchived");

CREATE TABLE IF NOT EXISTS public."MushroomRevisions" (
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
  "ArchivedAt" timestamp with time zone
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'MushroomRevisions_SourceMushroomId_fkey') THEN
    ALTER TABLE public."MushroomRevisions"
      ADD CONSTRAINT "MushroomRevisions_SourceMushroomId_fkey"
      FOREIGN KEY ("SourceMushroomId") REFERENCES public."Mushrooms"("Id") ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'MushroomRevisions_CreatedByUserId_fkey') THEN
    ALTER TABLE public."MushroomRevisions"
      ADD CONSTRAINT "MushroomRevisions_CreatedByUserId_fkey"
      FOREIGN KEY ("CreatedByUserId") REFERENCES public."Users"("Id") ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'MushroomRevisions_UpdatedByUserId_fkey') THEN
    ALTER TABLE public."MushroomRevisions"
      ADD CONSTRAINT "MushroomRevisions_UpdatedByUserId_fkey"
      FOREIGN KEY ("UpdatedByUserId") REFERENCES public."Users"("Id") ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'MushroomRevisions_ReviewedByUserId_fkey') THEN
    ALTER TABLE public."MushroomRevisions"
      ADD CONSTRAINT "MushroomRevisions_ReviewedByUserId_fkey"
      FOREIGN KEY ("ReviewedByUserId") REFERENCES public."Users"("Id") ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_mushroom_revisions_status ON public."MushroomRevisions" USING btree ("Status");
CREATE INDEX IF NOT EXISTS idx_mushroom_revisions_created_by ON public."MushroomRevisions" USING btree ("CreatedByUserId");
CREATE INDEX IF NOT EXISTS idx_mushroom_revisions_source_mushroom ON public."MushroomRevisions" USING btree ("SourceMushroomId");
CREATE UNIQUE INDEX IF NOT EXISTS uq_mushroom_revisions_published_source
    ON public."MushroomRevisions" ("SourceMushroomId")
    WHERE "Status" = 'Published' AND "SourceMushroomId" IS NOT NULL;

UPDATE public."MushroomRevisions"
SET "Status" = 'Draft'
WHERE "Status" NOT IN ('Draft', 'InReview', 'Published', 'Rejected', 'Archived');

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'mushroom_revisions_status_check') THEN
    ALTER TABLE public."MushroomRevisions"
      ADD CONSTRAINT mushroom_revisions_status_check
      CHECK ("Status" IN ('Draft', 'InReview', 'Published', 'Rejected', 'Archived'));
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public."MushroomRevisionDoppelgangers" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "RevisionId" uuid NOT NULL,
  "DoppelgangerName" character varying(128) NOT NULL
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'MushroomRevisionDoppelgangers_RevisionId_fkey') THEN
    ALTER TABLE public."MushroomRevisionDoppelgangers"
      ADD CONSTRAINT "MushroomRevisionDoppelgangers_RevisionId_fkey"
      FOREIGN KEY ("RevisionId") REFERENCES public."MushroomRevisions"("Id") ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "fki_MushroomRevisionDoppelgangers_RevisionId_fkey"
  ON public."MushroomRevisionDoppelgangers" USING btree ("RevisionId");

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
    INSERT INTO public."MushroomRevisions" (
      "Id",
      "SourceMushroomId",
      "Name",
      "SynonymousName",
      "LatinName",
      "Family",
      "RedBook",
      "Eatable",
      "HasStem",
      "StemSizeFrom",
      "StemSizeTo",
      "StemType",
      "StemColor",
      "CapType",
      "CapColor",
      "CapUndersideType",
      "Description",
      "HeaderPhotoLink",
      "ExtraPhotoLinks",
      "Status",
      "CreatedByUserId",
      "UpdatedByUserId",
      "CreatedAt",
      "UpdatedAt",
      "PublishedAt"
    )
    SELECT
      gen_random_uuid(),
      m."Id",
      m."Name",
      m."SynonymousName",
      m."LatinName",
      m."Family",
      m."RedBook",
      m."Eatable",
      m."HasStem",
      m."StemSizeFrom",
      m."StemSizeTo",
      m."StemType",
      m."StemColor",
      m."CapType",
      m."CapColor",
      m."CapUndersideType",
      m."Description",
      m."HeaderPhotoLink",
      m."ExtraPhotoLinks",
      'Published',
      super_user_id,
      super_user_id,
      now(),
      now(),
      now()
    FROM public."Mushrooms" m
    WHERE NOT EXISTS (
      SELECT 1
      FROM public."MushroomRevisions" mr
      WHERE mr."SourceMushroomId" = m."Id"
        AND mr."Status" = 'Published');
  END IF;
END $$;

INSERT INTO public."MushroomRevisionDoppelgangers" ("Id", "RevisionId", "DoppelgangerName")
SELECT gen_random_uuid(), mr."Id", d."DoppelgangerName"
FROM public."MushroomRevisions" mr
JOIN public."Doppelgangers" d ON d."MushroomId" = mr."SourceMushroomId"
WHERE mr."Status" = 'Published'
  AND NOT EXISTS (
    SELECT 1
    FROM public."MushroomRevisionDoppelgangers" mrd
    WHERE mrd."RevisionId" = mr."Id"
      AND mrd."DoppelgangerName" = d."DoppelgangerName");

INSERT INTO public."Permissions" ("Id", "Code", "Name", "Description", "IsSystem")
VALUES ('10000000-0000-0000-0000-000000000030', 'content.mushrooms.review', 'Review mushrooms', 'Review and reject mushroom revisions', true),
       ('10000000-0000-0000-0000-000000000031', 'content.mushrooms.publish', 'Publish mushrooms', 'Approve and publish mushroom revisions', true),
       ('10000000-0000-0000-0000-000000000032', 'content.mushrooms.archive', 'Archive mushrooms', 'Archive mushroom revisions and hide published snapshot', true),
       ('10000000-0000-0000-0000-000000000033', 'content.mushrooms.manage-any', 'Manage any mushrooms', 'Manage all mushroom revisions regardless of ownership', true),
       ('10000000-0000-0000-0000-000000000034', 'content.mushrooms.purge', 'Purge mushrooms', 'Hard delete mushrooms', true),
       ('10000000-0000-0000-0000-000000000035', 'content.mushroom-media.write', 'Write mushroom media', 'Upload and delete mushroom media files', true)
ON CONFLICT ("Code") DO NOTHING;

-- SuperUser (access = 0)
INSERT INTO public."RolePermissions" ("RoleId", "PermissionId")
SELECT r."Id", p."Id"
FROM public."Roles" r
JOIN public."Permissions" p ON p."Code" IN (
    'content.mushrooms.review',
    'content.mushrooms.publish',
    'content.mushrooms.archive',
    'content.mushrooms.manage-any',
    'content.mushrooms.purge',
    'content.mushroom-media.write'
)
WHERE r."AccessLevel" = 0
ON CONFLICT ("RoleId", "PermissionId") DO NOTHING;

-- Administrator (access 1..5)
INSERT INTO public."RolePermissions" ("RoleId", "PermissionId")
SELECT r."Id", p."Id"
FROM public."Roles" r
JOIN public."Permissions" p ON p."Code" IN (
    'content.mushrooms.review',
    'content.mushrooms.publish',
    'content.mushrooms.archive',
    'content.mushrooms.manage-any',
    'content.mushroom-media.write'
)
WHERE r."AccessLevel" BETWEEN 1 AND 5
ON CONFLICT ("RoleId", "PermissionId") DO NOTHING;

-- Junior administrator (access 6..18)
INSERT INTO public."RolePermissions" ("RoleId", "PermissionId")
SELECT r."Id", p."Id"
FROM public."Roles" r
JOIN public."Permissions" p ON p."Code" IN (
    'content.mushrooms.review',
    'content.mushrooms.publish',
    'content.mushrooms.archive',
    'content.mushrooms.manage-any',
    'content.mushroom-media.write'
)
WHERE r."AccessLevel" BETWEEN 6 AND 18
ON CONFLICT ("RoleId", "PermissionId") DO NOTHING;

-- Editor (access 19)
INSERT INTO public."RolePermissions" ("RoleId", "PermissionId")
SELECT r."Id", p."Id"
FROM public."Roles" r
JOIN public."Permissions" p ON p."Code" IN (
    'content.mushrooms.write',
    'content.mushroom-media.write'
)
WHERE r."AccessLevel" = 19
ON CONFLICT ("RoleId", "PermissionId") DO NOTHING;
