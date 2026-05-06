CREATE TABLE IF NOT EXISTS public."UserConsents" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "UserId" uuid NOT NULL,
  "ConsentType" character varying(64) NOT NULL,
  "DocumentVersion" character varying(32) NOT NULL,
  "AcceptedAt" timestamp with time zone NOT NULL DEFAULT now(),
  "IpAddress" character varying(64),
  "UserAgent" character varying(512),
  "Source" character varying(32) NOT NULL DEFAULT 'web'
);

ALTER TABLE public."UserConsents"
    ADD COLUMN IF NOT EXISTS "Id" uuid,
    ADD COLUMN IF NOT EXISTS "UserId" uuid,
    ADD COLUMN IF NOT EXISTS "ConsentType" character varying(64),
    ADD COLUMN IF NOT EXISTS "DocumentVersion" character varying(32),
    ADD COLUMN IF NOT EXISTS "AcceptedAt" timestamp with time zone,
    ADD COLUMN IF NOT EXISTS "IpAddress" character varying(64),
    ADD COLUMN IF NOT EXISTS "UserAgent" character varying(512),
    ADD COLUMN IF NOT EXISTS "Source" character varying(32);

ALTER TABLE public."UserConsents"
    ALTER COLUMN "AcceptedAt" SET DEFAULT now(),
    ALTER COLUMN "Source" SET DEFAULT 'web';

UPDATE public."UserConsents"
SET "AcceptedAt" = now()
WHERE "AcceptedAt" IS NULL;

UPDATE public."UserConsents"
SET "Source" = 'web'
WHERE "Source" IS NULL;

ALTER TABLE public."UserConsents"
    ALTER COLUMN "Id" SET NOT NULL,
    ALTER COLUMN "UserId" SET NOT NULL,
    ALTER COLUMN "ConsentType" SET NOT NULL,
    ALTER COLUMN "DocumentVersion" SET NOT NULL,
    ALTER COLUMN "AcceptedAt" SET NOT NULL,
    ALTER COLUMN "Source" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'UserConsents_pkey') THEN
    ALTER TABLE public."UserConsents"
      ADD CONSTRAINT "UserConsents_pkey" PRIMARY KEY ("Id");
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'UserConsents_UserId_fkey') THEN
    ALTER TABLE public."UserConsents"
      ADD CONSTRAINT "UserConsents_UserId_fkey"
      FOREIGN KEY ("UserId") REFERENCES public."Users"("Id") ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_consents_user_id
  ON public."UserConsents" USING btree ("UserId");

CREATE INDEX IF NOT EXISTS idx_user_consents_user_type
  ON public."UserConsents" USING btree ("UserId", "ConsentType");
