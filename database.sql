CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USER ROLES TABLE
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(100) NOT NULL DEFAULT 'Author',
    department VARCHAR(255) DEFAULT 'CMS Editorial',
    status VARCHAR(50) DEFAULT 'Active',
    initial_password VARCHAR(255),
    granted_rights JSONB DEFAULT '[]'::jsonb,
    assigned_by VARCHAR(255) DEFAULT 'System',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS initial_password VARCHAR(255);
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS granted_rights JSONB DEFAULT '[]'::jsonb;
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS department VARCHAR(255) DEFAULT 'CMS Editorial';
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS user_name VARCHAR(255);
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS assigned_by VARCHAR(255) DEFAULT 'System';

-- 2. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(255),
    middle_name VARCHAR(255),
    last_name VARCHAR(255),
    display_name VARCHAR(255),
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(100),
    whatsapp VARCHAR(100),
    gender VARCHAR(50),
    job_title VARCHAR(255),
    department VARCHAR(255),
    employee_id VARCHAR(100),
    role VARCHAR(100) DEFAULT 'Author',
    status VARCHAR(50) DEFAULT 'Active',
    initial_password VARCHAR(255),
    verification_status VARCHAR(50) DEFAULT 'Verified',
    profile_photo TEXT,
    cover_photo TEXT,
    bio TEXT,
    short_bio TEXT,
    education JSONB DEFAULT '[]'::jsonb,
    work_experience JSONB DEFAULT '[]'::jsonb,
    expertise JSONB DEFAULT '[]'::jsonb,
    certifications JSONB DEFAULT '[]'::jsonb,
    memberships JSONB DEFAULT '[]'::jsonb,
    stats JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS initial_password VARCHAR(255);

-- 3. CUSTOM ROLES TABLE
CREATE TABLE IF NOT EXISTS custom_roles (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'Custom',
    color VARCHAR(50) DEFAULT '#8B5CF6',
    permissions JSONB DEFAULT '{}'::jsonb,
    created_by VARCHAR(255) DEFAULT 'System Administrator',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. INITIAL SUPERADMIN RECORD (PATRICK MUNENE)
INSERT INTO user_roles (
    user_name, 
    email, 
    role, 
    department, 
    status, 
    initial_password, 
    granted_rights, 
    assigned_by
) 
VALUES (
    'Patrick Munene', 
    'ptrckmunene@gmail.com', 
    'Superadmin', 
    'Web Development', 
    'Active', 
    '@super123#', 
    '["mod_articles:View", "mod_articles:Create", "mod_articles:Edit", "mod_articles:Delete", "mod_articles:Publish", "mod_articles:Moderate", "mod_articles:Approve", "mod_articles:Configure", "mod_articles:Export", "mod_media:View", "mod_media:Create", "mod_media:Edit", "mod_media:Delete", "mod_media:Publish", "mod_media:Moderate", "mod_media:Approve", "mod_media:Configure", "mod_media:Export", "mod_categories:View", "mod_categories:Create", "mod_categories:Edit", "mod_categories:Delete", "mod_categories:Publish", "mod_categories:Moderate", "mod_categories:Approve", "mod_categories:Configure", "mod_categories:Export", "mod_comments:View", "mod_comments:Create", "mod_comments:Edit", "mod_comments:Delete", "mod_comments:Publish", "mod_comments:Moderate", "mod_comments:Approve", "mod_comments:Configure", "mod_comments:Export", "mod_beneficiaries:View", "mod_beneficiaries:Create", "mod_beneficiaries:Edit", "mod_beneficiaries:Delete", "mod_beneficiaries:Publish", "mod_beneficiaries:Moderate", "mod_beneficiaries:Approve", "mod_beneficiaries:Configure", "mod_beneficiaries:Export", "mod_vacancies:View", "mod_vacancies:Create", "mod_vacancies:Edit", "mod_vacancies:Delete", "mod_vacancies:Publish", "mod_vacancies:Moderate", "mod_vacancies:Approve", "mod_vacancies:Configure", "mod_vacancies:Export", "mod_analytics:View", "mod_analytics:Create", "mod_analytics:Edit", "mod_analytics:Delete", "mod_analytics:Publish", "mod_analytics:Moderate", "mod_analytics:Approve", "mod_analytics:Configure", "mod_analytics:Export", "mod_roles:View", "mod_roles:Create", "mod_roles:Edit", "mod_roles:Delete", "mod_roles:Publish", "mod_roles:Moderate", "mod_roles:Approve", "mod_roles:Configure", "mod_roles:Export", "mod_security:View", "mod_security:Create", "mod_security:Edit", "mod_security:Delete", "mod_security:Publish", "mod_security:Moderate", "mod_security:Approve", "mod_security:Configure", "mod_security:Export", "mod_system:View", "mod_system:Create", "mod_system:Edit", "mod_system:Delete", "mod_system:Publish", "mod_system:Moderate", "mod_system:Approve", "mod_system:Configure", "mod_system:Export"]'::jsonb, 
    'System Initializer'
)
ON CONFLICT (email) 
DO UPDATE SET 
    user_name = EXCLUDED.user_name,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    status = EXCLUDED.status,
    initial_password = EXCLUDED.initial_password,
    granted_rights = EXCLUDED.granted_rights,
    assigned_by = EXCLUDED.assigned_by;

INSERT INTO user_profiles (
    first_name,
    last_name,
    display_name,
    username,
    email,
    role,
    department,
    status,
    initial_password,
    job_title
)
VALUES (
    'Patrick',
    'Munene',
    'Patrick Munene',
    'ptrckmunene',
    'ptrckmunene@gmail.com',
    'Superadmin',
    'Web Development',
    'Active',
    '@super123#',
    'Super Admin & Senior Web developer'
)
ON CONFLICT (email)
DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    display_name = EXCLUDED.display_name,
    username = EXCLUDED.username,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    status = EXCLUDED.status,
    initial_password = EXCLUDED.initial_password,
    job_title = EXCLUDED.job_title;
