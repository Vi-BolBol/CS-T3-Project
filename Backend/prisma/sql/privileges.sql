-- Run once, connected as superuser/DB owner (e.g. psql "$DIRECT_URL" -f privileges.sql)

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'if_migrator') THEN
    CREATE ROLE if_migrator LOGIN PASSWORD 'change_me_migrator';
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'if_app') THEN
    CREATE ROLE if_app LOGIN PASSWORD 'change_me_app';
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'if_readonly') THEN
    CREATE ROLE if_readonly LOGIN PASSWORD 'change_me_readonly';
  END IF;
END
$$;

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO if_migrator, if_app, if_readonly;

-- if_migrator: owns the schema, runs migrations only
GRANT CREATE ON SCHEMA public TO if_migrator;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO if_migrator;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO if_migrator;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO if_migrator;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO if_migrator;

-- if_app: what the running server should actually use
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO if_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO if_app;
ALTER DEFAULT PRIVILEGES FOR ROLE if_migrator IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO if_app;
ALTER DEFAULT PRIVILEGES FOR ROLE if_migrator IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO if_app;

-- if_readonly: SELECT only, for reporting
GRANT SELECT ON ALL TABLES IN SCHEMA public TO if_readonly;
ALTER DEFAULT PRIVILEGES FOR ROLE if_migrator IN SCHEMA public
  GRANT SELECT ON TABLES TO if_readonly;

ALTER ROLE if_app NOCREATEDB NOCREATEROLE NOSUPERUSER;
ALTER ROLE if_readonly NOCREATEDB NOCREATEROLE NOSUPERUSER;



