ALTER TABLE public."Mushrooms"
    ALTER COLUMN "SynonymousName" TYPE character varying(256),
    ALTER COLUMN "StemColor" TYPE character varying(256),
    ALTER COLUMN "CapColor" TYPE character varying(256);

ALTER TABLE public."MushroomRevisions"
    ALTER COLUMN "SynonymousName" TYPE character varying(256),
    ALTER COLUMN "StemColor" TYPE character varying(256),
    ALTER COLUMN "CapColor" TYPE character varying(256);
