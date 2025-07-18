DO $$ BEGIN
 CREATE TYPE "permission_enum" AS ENUM('ADD_USER', 'DELETE_USER', 'UPDATE_USER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
