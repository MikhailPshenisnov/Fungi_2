DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'developer') THEN
        CREATE ROLE developer LOGIN PASSWORD 'developer';
        ALTER ROLE developer WITH SUPERUSER;
        ALTER ROLE developer WITH CREATEROLE;
        ALTER ROLE developer WITH CREATEDB;
        ALTER ROLE developer WITH REPLICATION;
        ALTER ROLE developer WITH BYPASSRLS;
    END IF;
END $$;