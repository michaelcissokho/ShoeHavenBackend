\echo 'Delete and recreate shoe_haven db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE shoe_haven;
CREATE DATABASE shoe_haven;
\connect shoe_haven

\i shoe_haven-schema.sql
\i shoe_haven-seed.sql

\echo 'Delete and recreate test_shoe_haven db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE test_shoe_haven;
CREATE DATABASE test_shoe_haven;
\connect test_shoe_haven

\i shoe_haven-schema.sql