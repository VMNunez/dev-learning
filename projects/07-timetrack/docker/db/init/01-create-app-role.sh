#!/bin/sh
# Runs once, on the first start of an empty data volume (postgres image: /docker-entrypoint-initdb.d).
# Creates the non-superuser role the API connects as, and the database it owns (PLANNING §9).
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres \
     -v app_password="$DB_PASSWORD" <<'SQL'
CREATE ROLE timetrack_app LOGIN PASSWORD :'app_password';
CREATE DATABASE timetrack OWNER timetrack_app;
SQL
