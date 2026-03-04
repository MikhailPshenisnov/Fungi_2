ALTER TABLE public."Users"
    ADD COLUMN IF NOT EXISTS "AvatarPath" character varying(512);
