-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION "gkk-schema".update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at column

-- Users table trigger
DROP TRIGGER IF EXISTS update_users_updated_at ON "gkk-schema".users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON "gkk-schema".users
    FOR EACH ROW
    EXECUTE FUNCTION "gkk-schema".update_updated_at_column();

-- Roles table trigger
DROP TRIGGER IF EXISTS update_roles_updated_at ON "gkk-schema".roles;
CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON "gkk-schema".roles
    FOR EACH ROW
    EXECUTE FUNCTION "gkk-schema".update_updated_at_column();

-- Permissions table trigger
DROP TRIGGER IF EXISTS update_permissions_updated_at ON "gkk-schema".permissions;
CREATE TRIGGER update_permissions_updated_at
    BEFORE UPDATE ON "gkk-schema".permissions
    FOR EACH ROW
    EXECUTE FUNCTION "gkk-schema".update_updated_at_column();

-- User roles table trigger
DROP TRIGGER IF EXISTS update_user_roles_updated_at ON "gkk-schema".user_roles;
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON "gkk-schema".user_roles
    FOR EACH ROW
    EXECUTE FUNCTION "gkk-schema".update_updated_at_column();

-- Role permissions table trigger
DROP TRIGGER IF EXISTS update_role_permissions_updated_at ON "gkk-schema".role_permissions;
CREATE TRIGGER update_role_permissions_updated_at
    BEFORE UPDATE ON "gkk-schema".role_permissions
    FOR EACH ROW
    EXECUTE FUNCTION "gkk-schema".update_updated_at_column();
