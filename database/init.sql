-- PRSM Database Initialization Script
-- This script sets up the initial database structure

-- Create database if it doesn't exist (run this manually if needed)
-- CREATE DATABASE prsm_db;

-- Use the database
\c prsm_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The tables will be created by SQLAlchemy/Alembic
-- This file is just for any initial data or custom configurations

-- Set timezone
SET timezone = 'UTC';

-- Create indexes for better performance (will be created by migrations)
-- These are just examples of what will be created

-- Example initial data (uncomment if needed)
-- INSERT INTO admin_users (username, email, password_hash, role, is_active) 
-- VALUES ('admin', 'admin@example.com', '$hashed_password_here', 'admin', true)
-- ON CONFLICT (username) DO NOTHING;