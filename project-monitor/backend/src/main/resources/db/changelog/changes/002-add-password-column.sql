--liquibase formatted sql

-- SECURITY WARNING: Default password 'admin123' is set for initial development only.
-- In production, ALL user passwords MUST be changed immediately after first deployment.
-- Consider implementing a "force password change on first login" mechanism.

--changeset auth:002-add-password-column
-- Add password column to app_user table
ALTER TABLE app_user ADD COLUMN password VARCHAR(255);

-- Insert default admin user if table is empty
INSERT INTO app_user (username, email, first_name, last_name, role, active, deleted, password, created_at, updated_at)
SELECT 'admin', 'admin@monitor.local', 'Admin', 'System', 'ADMIN', true, false,
       '$2a$10$tCv2U7KtL9.n1KcgXBnZQOZP1zCXk4/nzEmrIRgpXVMcenwPK0Pua', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM app_user WHERE username = 'admin');

-- Set default password for existing users without password (bcrypt hash of "admin123")
UPDATE app_user SET password = '$2a$10$tCv2U7KtL9.n1KcgXBnZQOZP1zCXk4/nzEmrIRgpXVMcenwPK0Pua' WHERE password IS NULL;

-- Make password NOT NULL after setting defaults
ALTER TABLE app_user ALTER COLUMN password SET NOT NULL;
