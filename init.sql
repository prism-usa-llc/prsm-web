-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS prsm_db;

-- Use the database
\c prsm_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Initial admin user (password: admin123)
INSERT INTO users (username, email, hashed_password, is_admin, is_active)
VALUES ('admin', 'admin@prsmusa.com', '$2b$12$LQv3c1yqBw3cXYVoK7g5tO.rS1zVwD1KJW5XJ4YzC8h7.jK1Xz2qm', true, true)
ON CONFLICT (username) DO NOTHING;

-- Sample location data
INSERT INTO locations (name, address, phone, owner_id, qr_code_url, is_active)
VALUES 
  ('Starbucks Kokomo', '123 Main St, Kokomo, IN 46901', '(765) 123-4567', 1, '/queue/join?location_id=1', true),
  ('McDonald''s Downtown', '456 Oak Ave, Indianapolis, IN 46204', '(317) 555-0123', 1, '/queue/join?location_id=2', true)
ON CONFLICT DO NOTHING;