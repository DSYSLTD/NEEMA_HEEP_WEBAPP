-- ==============================================================================
-- NEEMA HEEP WEBAPP — PRODUCTION DATABASE MIGRATION SCRIPT
-- Project Name: NEEMA HEEP WEBAPP
-- Scope: CMS Auth (Direct Staff Credentials for Patrick Munene & Charity Muthoni),
--        Website Update Privileges, Forms Data Storage & Storage Buckets
-- 
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/xkigjrdvxnzvgpoubari
-- 2. Navigate to "SQL Editor" in the left sidebar.
-- 3. Click "New Query", paste this entire script, and click "Run".
-- 4. This script is 100% IDEMPOTENT: safe to run multiple times without data loss.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- EXTENSIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. CMS AUTHENTICATION & AUTHORIZED USERS (PATRICK MUNENE & CHARITY MUTHONI)
-- ==============================================================================

-- 1.1 USER ROLES TABLE
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(100) NOT NULL, -- 'Superadmin', 'Content editor', 'Administrator', 'Reviewer'
    department VARCHAR(255) DEFAULT 'CMS Editorial',
    status VARCHAR(50) DEFAULT 'Active',
    initial_password VARCHAR(255),
    password VARCHAR(255),
    granted_rights JSONB DEFAULT '[]'::jsonb,
    assigned_by VARCHAR(255) DEFAULT 'Superadmin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure password and initial_password columns exist
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS user_name VARCHAR(255);
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS initial_password VARCHAR(255);
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS granted_rights JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS department VARCHAR(255) DEFAULT 'CMS Editorial';
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active';
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS assigned_by VARCHAR(255) DEFAULT 'Superadmin';

UPDATE public.user_roles SET name = user_name WHERE name IS NULL AND user_name IS NOT NULL;
UPDATE public.user_roles SET user_name = name WHERE user_name IS NULL AND name IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_roles_email ON public.user_roles (email);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles (role);
CREATE INDEX IF NOT EXISTS idx_user_roles_status ON public.user_roles (status);

-- 1.2 USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    first_name VARCHAR(255),
    middle_name VARCHAR(255),
    last_name VARCHAR(255),
    display_name VARCHAR(255),
    username VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(100),
    whatsapp VARCHAR(100),
    gender VARCHAR(50),
    job_title VARCHAR(255),
    department VARCHAR(255),
    employee_id VARCHAR(100),
    role VARCHAR(100) DEFAULT 'Content editor',
    status VARCHAR(50) DEFAULT 'Active',
    initial_password VARCHAR(255),
    password VARCHAR(255),
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS initial_password VARCHAR(255);
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS role VARCHAR(100) DEFAULT 'Content editor';
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active';

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles (email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles (role);

-- 1.3 CUSTOM ROLES CATALOG (4 STANDARDIZED ROLES)
CREATE TABLE IF NOT EXISTS public.custom_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_key VARCHAR(255),
    role_name VARCHAR(255),
    name VARCHAR(255),
    description TEXT,
    category VARCHAR(100) DEFAULT 'System',
    color VARCHAR(50) DEFAULT '#074504',
    permissions JSONB DEFAULT '[]'::jsonb,
    is_system BOOLEAN DEFAULT false,
    can_manage_users BOOLEAN DEFAULT false,
    can_manage_roles BOOLEAN DEFAULT false,
    can_manage_security BOOLEAN DEFAULT false,
    can_manage_content BOOLEAN DEFAULT false,
    created_by VARCHAR(255) DEFAULT 'Superadmin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all possible column variants exist before running any query
ALTER TABLE public.custom_roles ADD COLUMN IF NOT EXISTS role_key VARCHAR(255);
ALTER TABLE public.custom_roles ADD COLUMN IF NOT EXISTS role_name VARCHAR(255);
ALTER TABLE public.custom_roles ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE public.custom_roles ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.custom_roles ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'System';
ALTER TABLE public.custom_roles ADD COLUMN IF NOT EXISTS color VARCHAR(50) DEFAULT '#074504';
ALTER TABLE public.custom_roles ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.custom_roles ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT false;
ALTER TABLE public.custom_roles ADD COLUMN IF NOT EXISTS can_manage_users BOOLEAN DEFAULT false;
ALTER TABLE public.custom_roles ADD COLUMN IF NOT EXISTS can_manage_roles BOOLEAN DEFAULT false;
ALTER TABLE public.custom_roles ADD COLUMN IF NOT EXISTS can_manage_security BOOLEAN DEFAULT false;
ALTER TABLE public.custom_roles ADD COLUMN IF NOT EXISTS can_manage_content BOOLEAN DEFAULT false;
ALTER TABLE public.custom_roles ADD COLUMN IF NOT EXISTS created_by VARCHAR(255) DEFAULT 'Superadmin';

-- Drop any restrictive NOT NULL constraints that would break existing or new installations
ALTER TABLE public.custom_roles ALTER COLUMN role_key DROP NOT NULL;
ALTER TABLE public.custom_roles ALTER COLUMN role_name DROP NOT NULL;
ALTER TABLE public.custom_roles ALTER COLUMN name DROP NOT NULL;
ALTER TABLE public.custom_roles ALTER COLUMN role_key SET DEFAULT '';

-- Safely populate empty values across all column naming variants
UPDATE public.custom_roles 
SET role_key = LOWER(REPLACE(COALESCE(role_name, name, 'role_' || id::text), ' ', '_')) 
WHERE role_key IS NULL OR role_key = '';

UPDATE public.custom_roles 
SET role_name = COALESCE(name, INITCAP(REPLACE(role_key, '_', ' ')), 'Custom Role') 
WHERE role_name IS NULL OR role_name = '';

UPDATE public.custom_roles 
SET name = COALESCE(role_name, INITCAP(REPLACE(role_key, '_', ' ')), 'Custom Role') 
WHERE name IS NULL OR name = '';

-- Ensure unique indices exist for conflict handling
CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_roles_role_name ON public.custom_roles (role_name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_roles_role_key ON public.custom_roles (role_key);

-- Step A: Synchronize any existing custom_roles rows
UPDATE public.custom_roles 
SET 
    role_key = 'superadmin',
    name = 'Superadmin',
    description = 'Full system administration, user governance, backups, website publishing, and all privileges',
    permissions = '["all"]'::jsonb,
    color = '#074504',
    category = 'System',
    is_system = true,
    can_manage_users = true,
    can_manage_roles = true,
    can_manage_security = true,
    can_manage_content = true,
    updated_at = NOW()
WHERE role_name = 'Superadmin' OR name = 'Superadmin' OR role_key = 'superadmin';

UPDATE public.custom_roles 
SET 
    role_key = 'content_editor',
    name = 'Content editor',
    description = 'Manage and update website content: blog articles, media gallery, categories, tags, comments and social links',
    permissions = '["mod_articles:View", "mod_articles:Create", "mod_articles:Edit", "mod_articles:Publish", "mod_media:View", "mod_media:Create", "mod_media:Edit", "mod_media:Publish", "mod_categories:View", "mod_categories:Create", "mod_categories:Edit", "mod_comments:View", "mod_comments:Moderate"]'::jsonb,
    color = '#C0991B',
    category = 'Editorial',
    is_system = false,
    can_manage_users = false,
    can_manage_roles = false,
    can_manage_security = false,
    can_manage_content = true,
    updated_at = NOW()
WHERE role_name = 'Content editor' OR name = 'Content editor' OR role_key = 'content_editor';

UPDATE public.custom_roles 
SET 
    role_key = 'administrator',
    name = 'Administrator',
    description = 'Operational administration, forms handling, beneficiary records, and memberships',
    permissions = '["leads_manage", "beneficiaries_manage", "members_manage", "jobs_manage"]'::jsonb,
    color = '#059669',
    category = 'System',
    is_system = false,
    can_manage_users = true,
    can_manage_roles = false,
    can_manage_security = true,
    can_manage_content = true,
    updated_at = NOW()
WHERE role_name = 'Administrator' OR name = 'Administrator' OR role_key = 'administrator';

UPDATE public.custom_roles 
SET 
    role_key = 'reviewer',
    name = 'Reviewer',
    description = 'Review incoming membership registrations, inquiries, job dossiers, and volunteer submissions',
    permissions = '["leads_read", "applications_read", "members_read"]'::jsonb,
    color = '#2563EB',
    category = 'Operations',
    is_system = false,
    can_manage_users = false,
    can_manage_roles = false,
    can_manage_security = false,
    can_manage_content = false,
    updated_at = NOW()
WHERE role_name = 'Reviewer' OR name = 'Reviewer' OR role_key = 'reviewer';

-- Step B: Insert missing roles supplying all column aliases (guaranteed never violates NOT NULL or conflict targets)
INSERT INTO public.custom_roles (role_key, role_name, name, description, permissions, color, category, is_system, can_manage_users, can_manage_roles, can_manage_security, can_manage_content, created_by)
SELECT 'superadmin', 'Superadmin', 'Superadmin', 'Full system administration, user governance, backups, website publishing, and all privileges', '["all"]'::jsonb, '#074504', 'System', true, true, true, true, true, 'Superadmin'
WHERE NOT EXISTS (SELECT 1 FROM public.custom_roles WHERE role_name = 'Superadmin' OR name = 'Superadmin' OR role_key = 'superadmin');

INSERT INTO public.custom_roles (role_key, role_name, name, description, permissions, color, category, is_system, can_manage_users, can_manage_roles, can_manage_security, can_manage_content, created_by)
SELECT 'content_editor', 'Content editor', 'Content editor', 'Manage and update website content: blog articles, media gallery, categories, tags, comments and social links', '["mod_articles:View", "mod_articles:Create", "mod_articles:Edit", "mod_articles:Publish", "mod_media:View", "mod_media:Create", "mod_media:Edit", "mod_media:Publish", "mod_categories:View", "mod_categories:Create", "mod_categories:Edit", "mod_comments:View", "mod_comments:Moderate"]'::jsonb, '#C0991B', 'Editorial', false, false, false, false, true, 'Superadmin'
WHERE NOT EXISTS (SELECT 1 FROM public.custom_roles WHERE role_name = 'Content editor' OR name = 'Content editor' OR role_key = 'content_editor');

INSERT INTO public.custom_roles (role_key, role_name, name, description, permissions, color, category, is_system, can_manage_users, can_manage_roles, can_manage_security, can_manage_content, created_by)
SELECT 'administrator', 'Administrator', 'Administrator', 'Operational administration, forms handling, beneficiary records, and memberships', '["leads_manage", "beneficiaries_manage", "members_manage", "jobs_manage"]'::jsonb, '#059669', 'System', false, true, false, true, true, 'Superadmin'
WHERE NOT EXISTS (SELECT 1 FROM public.custom_roles WHERE role_name = 'Administrator' OR name = 'Administrator' OR role_key = 'administrator');

INSERT INTO public.custom_roles (role_key, role_name, name, description, permissions, color, category, is_system, can_manage_users, can_manage_roles, can_manage_security, can_manage_content, created_by)
SELECT 'reviewer', 'Reviewer', 'Reviewer', 'Review incoming membership registrations, inquiries, job dossiers, and volunteer submissions', '["leads_read", "applications_read", "members_read"]'::jsonb, '#2563EB', 'Operations', false, false, false, false, false, 'Superadmin'
WHERE NOT EXISTS (SELECT 1 FROM public.custom_roles WHERE role_name = 'Reviewer' OR name = 'Reviewer' OR role_key = 'reviewer');

-- 1.4 SEED AUTHORIZED CMS USERS (PATRICK MUNENE & CHARITY MUTHONI)
-- Patrick Munene: Superadmin (Full System Administration & Website Control) - Phone: +254 725 789 086
-- Charity Muthoni: Content Editor (Website Update Privileges: Articles, Media, Categories, Comments) - Phone: +254 724 389 949

ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS phone VARCHAR(100);

INSERT INTO public.user_roles (
    user_name,
    email,
    phone,
    role,
    department,
    status,
    initial_password,
    password,
    assigned_by,
    granted_rights,
    created_at,
    updated_at
)
VALUES
    (
        'Patrick Munene',
        'ptrckmunene@gmail.com',
        '+254 725 789 086',
        'Superadmin',
        'Web Development',
        'Active',
        '@super123#',
        '@super123#',
        'System Initializer',
        '["all", "mod_articles:View", "mod_articles:Create", "mod_articles:Edit", "mod_articles:Publish", "mod_articles:Delete", "mod_media:View", "mod_media:Create", "mod_media:Edit", "mod_media:Publish", "mod_media:Delete", "mod_categories:View", "mod_categories:Create", "mod_categories:Edit", "mod_categories:Delete", "mod_comments:View", "mod_comments:Moderate", "mod_comments:Delete", "mod_users:Manage", "mod_settings:Manage", "mod_backups:Manage"]'::jsonb,
        NOW(),
        NOW()
    ),
    (
        'Charity Muthoni',
        'muthonichar12@gmail.com',
        '+254 724 389 949',
        'Content editor',
        'CMS Editorial',
        'Active',
        '@Cham123#',
        '@Cham123#',
        'Patrick Munene (Superadmin)',
        '["mod_articles:View", "mod_articles:Create", "mod_articles:Edit", "mod_articles:Publish", "mod_media:View", "mod_media:Create", "mod_media:Edit", "mod_media:Publish", "mod_categories:View", "mod_categories:Create", "mod_categories:Edit", "mod_comments:View", "mod_comments:Moderate"]'::jsonb,
        NOW(),
        NOW()
    )
ON CONFLICT (email) DO UPDATE SET
    user_name = EXCLUDED.user_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    status = 'Active',
    initial_password = EXCLUDED.initial_password,
    password = EXCLUDED.password,
    granted_rights = EXCLUDED.granted_rights,
    updated_at = NOW();

-- Also ensure user_profiles records exist for Patrick Munene & Charity Muthoni
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(100);
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(100);

INSERT INTO public.user_profiles (
    first_name,
    last_name,
    display_name,
    username,
    email,
    phone,
    whatsapp,
    role,
    department,
    status,
    initial_password,
    password,
    job_title,
    bio,
    verification_status
)
VALUES
    (
        'Patrick',
        'Munene',
        'Patrick Munene',
        'ptrckmunene',
        'ptrckmunene@gmail.com',
        '+254 725 789 086',
        '+254 725 789 086',
        'Superadmin',
        'Web Development',
        'Active',
        '@super123#',
        '@super123#',
        'Superadmin & Senior Web Developer',
        'Founder & Executive Lead overseeing microfinance systems, web infrastructure, and institutional transformation.',
        'Verified'
    ),
    (
        'Charity',
        'Muthoni',
        'Charity Muthoni',
        'muthonichar12',
        'muthonichar12@gmail.com',
        '+254 724 389 949',
        '+254 724 389 949',
        'Content editor',
        'CMS Editorial',
        'Active',
        '@Cham123#',
        '@Cham123#',
        'Content Editor & Editorial Communications Specialist',
        'Editorial specialist managing blog publications, digital media updates, storytelling, and community articles.',
        'Verified'
    )
ON CONFLICT (email) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    display_name = EXCLUDED.display_name,
    phone = EXCLUDED.phone,
    whatsapp = EXCLUDED.whatsapp,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    status = 'Active',
    initial_password = EXCLUDED.initial_password,
    password = EXCLUDED.password,
    job_title = EXCLUDED.job_title,
    updated_at = NOW();


-- ==============================================================================
-- 2. FORMS DATA STORAGE & SUBMISSION TABLES
-- (With Unique Identifiers, Document Bucket URLs, Receipts & SMS Phone Records)
-- ==============================================================================

-- 2.1 INDIVIDUAL MEMBER REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.individual_registrations (
    id VARCHAR(100) PRIMARY KEY,
    tracking_id VARCHAR(100),
    unique_identifier VARCHAR(100),
    registration_number VARCHAR(100),
    first_name VARCHAR(255),
    middle_name VARCHAR(255),
    last_name VARCHAR(255),
    full_name VARCHAR(255),
    gender VARCHAR(50),
    dob DATE,
    id_number VARCHAR(100),
    kra_pin VARCHAR(100),
    phone VARCHAR(100),
    alt_phone VARCHAR(100),
    email VARCHAR(255),
    county VARCHAR(100),
    sub_county VARCHAR(100),
    ward VARCHAR(100),
    physical_address TEXT,
    passport_photo TEXT, -- URL in member-photos bucket
    id_photo_front TEXT, -- URL in member-documents bucket
    id_photo_back TEXT,  -- URL in member-documents bucket
    payment_ref VARCHAR(100),
    payment_amount NUMERIC DEFAULT 2000,
    payment_message TEXT,
    payment_timestamp TIMESTAMPTZ,
    payment_status VARCHAR(50) DEFAULT 'Paid',
    details JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'Submitted',
    signup_source VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure alias table exists for backward compatibility
CREATE TABLE IF NOT EXISTS public.individual_member_registrations (
    id VARCHAR(100) PRIMARY KEY,
    tracking_id VARCHAR(100),
    unique_identifier VARCHAR(100),
    registration_number VARCHAR(100),
    full_name VARCHAR(255),
    id_number VARCHAR(100),
    phone VARCHAR(100),
    email VARCHAR(255),
    county VARCHAR(100),
    passport_photo TEXT,
    id_photo_front TEXT,
    id_photo_back TEXT,
    payment_ref VARCHAR(100),
    payment_amount NUMERIC DEFAULT 2000,
    details JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'Submitted',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ind_reg_tracking ON public.individual_registrations (tracking_id);
CREATE INDEX IF NOT EXISTS idx_ind_reg_phone ON public.individual_registrations (phone);
CREATE INDEX IF NOT EXISTS idx_ind_reg_email ON public.individual_registrations (email);
CREATE INDEX IF NOT EXISTS idx_ind_reg_created ON public.individual_registrations (created_at DESC);

-- 2.2 GROUP MEMBER REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.group_registrations (
    id VARCHAR(100) PRIMARY KEY,
    tracking_id VARCHAR(100),
    unique_identifier VARCHAR(100),
    registration_number VARCHAR(100),
    group_name VARCHAR(255) NOT NULL,
    group_type VARCHAR(100) DEFAULT 'Chama / Self Help Group',
    registration_certificate_no VARCHAR(100),
    formation_date VARCHAR(50),
    member_count INTEGER DEFAULT 1,
    county VARCHAR(100),
    sub_county VARCHAR(100),
    ward VARCHAR(100),
    physical_address TEXT,
    representative_name VARCHAR(255),
    representative_role VARCHAR(100) DEFAULT 'Chairperson',
    representative_id_number VARCHAR(100),
    representative_phone VARCHAR(100),
    representative_email VARCHAR(255),
    registration_certificate_doc TEXT, -- URL in group-documents bucket
    payment_ref VARCHAR(100),
    payment_amount NUMERIC DEFAULT 1000,
    payment_message TEXT,
    payment_status VARCHAR(50) DEFAULT 'Paid',
    members_list JSONB DEFAULT '[]'::jsonb,
    details JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'Submitted',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure alias table exists for backward compatibility
CREATE TABLE IF NOT EXISTS public.group_member_registrations (
    id VARCHAR(100) PRIMARY KEY,
    tracking_id VARCHAR(100),
    unique_identifier VARCHAR(100),
    registration_number VARCHAR(100),
    group_name VARCHAR(255),
    member_count INTEGER DEFAULT 1,
    representative_name VARCHAR(255),
    representative_phone VARCHAR(100),
    representative_email VARCHAR(255),
    registration_certificate_doc TEXT,
    payment_ref VARCHAR(100),
    details JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'Submitted',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_grp_reg_tracking ON public.group_registrations (tracking_id);
CREATE INDEX IF NOT EXISTS idx_grp_reg_name ON public.group_registrations (group_name);
CREATE INDEX IF NOT EXISTS idx_grp_reg_phone ON public.group_registrations (representative_phone);

-- 2.3 VOLUNTEER APPLICATIONS
CREATE TABLE IF NOT EXISTS public.volunteer_applications (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::varchar,
    tracking_id VARCHAR(100),
    unique_identifier VARCHAR(100),
    reference_number VARCHAR(100),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    profession VARCHAR(255),
    role VARCHAR(255) DEFAULT 'Academic Mentorship',
    availability VARCHAR(100),
    motivation TEXT,
    county VARCHAR(100),
    resume_url TEXT, -- URL in volunteer-documents bucket
    cv_document_url TEXT,
    status VARCHAR(50) DEFAULT 'New',
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.volunteer_applications ADD COLUMN IF NOT EXISTS tracking_id VARCHAR(100);
ALTER TABLE public.volunteer_applications ADD COLUMN IF NOT EXISTS unique_identifier VARCHAR(100);
ALTER TABLE public.volunteer_applications ADD COLUMN IF NOT EXISTS resume_url TEXT;
ALTER TABLE public.volunteer_applications ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_vol_tracking ON public.volunteer_applications (tracking_id);
CREATE INDEX IF NOT EXISTS idx_vol_email ON public.volunteer_applications (email);
CREATE INDEX IF NOT EXISTS idx_vol_phone ON public.volunteer_applications (phone);

-- 2.4 SPONSORSHIP REQUESTS
CREATE TABLE IF NOT EXISTS public.sponsorship_requests (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::varchar,
    tracking_id VARCHAR(100),
    unique_identifier VARCHAR(100),
    reference_number VARCHAR(100),
    organization_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    program_name VARCHAR(255) DEFAULT 'Education Support',
    sponsorship_amount NUMERIC DEFAULT 0,
    beneficiary_focus VARCHAR(255),
    proposal_document_url TEXT, -- URL in sponsorship-documents bucket
    status VARCHAR(50) DEFAULT 'New',
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sponsorship_requests ADD COLUMN IF NOT EXISTS tracking_id VARCHAR(100);
ALTER TABLE public.sponsorship_requests ADD COLUMN IF NOT EXISTS unique_identifier VARCHAR(100);
ALTER TABLE public.sponsorship_requests ADD COLUMN IF NOT EXISTS proposal_document_url TEXT;
ALTER TABLE public.sponsorship_requests ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_spons_tracking ON public.sponsorship_requests (tracking_id);
CREATE INDEX IF NOT EXISTS idx_spons_org ON public.sponsorship_requests (organization_name);

-- 2.5 PARTNERSHIP REQUESTS
CREATE TABLE IF NOT EXISTS public.partnership_requests (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::varchar,
    tracking_id VARCHAR(100),
    unique_identifier VARCHAR(100),
    reference_number VARCHAR(100),
    organization_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    partnership_type VARCHAR(100) DEFAULT 'Donor / Grant Funding',
    proposal_summary TEXT,
    proposal_document_url TEXT, -- URL in partnership-documents bucket
    status VARCHAR(50) DEFAULT 'New',
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.partnership_requests ADD COLUMN IF NOT EXISTS tracking_id VARCHAR(100);
ALTER TABLE public.partnership_requests ADD COLUMN IF NOT EXISTS unique_identifier VARCHAR(100);
ALTER TABLE public.partnership_requests ADD COLUMN IF NOT EXISTS proposal_document_url TEXT;
ALTER TABLE public.partnership_requests ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_part_tracking ON public.partnership_requests (tracking_id);

-- 2.6 PRE-QUALIFICATION & LOAN ELIGIBILITY REQUESTS
CREATE TABLE IF NOT EXISTS public.prequalifications (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::varchar,
    tracking_id VARCHAR(100),
    unique_identifier VARCHAR(100),
    reference_number VARCHAR(100),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    business_type VARCHAR(255),
    years_in_business VARCHAR(100),
    requested_amount VARCHAR(100),
    monthly_turnover VARCHAR(100),
    collateral_type VARCHAR(255),
    prequalification_score INTEGER DEFAULT 85,
    recommended_product VARCHAR(255),
    county VARCHAR(100),
    signup_source VARCHAR(255),
    consent_given VARCHAR(50) DEFAULT 'Yes',
    status VARCHAR(50) DEFAULT 'New',
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.prequalifications ADD COLUMN IF NOT EXISTS tracking_id VARCHAR(100);
ALTER TABLE public.prequalifications ADD COLUMN IF NOT EXISTS unique_identifier VARCHAR(100);
ALTER TABLE public.prequalifications ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_preq_tracking ON public.prequalifications (tracking_id);
CREATE INDEX IF NOT EXISTS idx_preq_phone ON public.prequalifications (phone);

-- 2.7 INQUIRIES & CALLBACK REQUESTS
CREATE TABLE IF NOT EXISTS public.callback_requests (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::varchar,
    tracking_id VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    interest VARCHAR(255) DEFAULT 'General Loan Inquiry',
    preferred_time VARCHAR(100) DEFAULT 'Morning (8am - 12pm)',
    status VARCHAR(50) DEFAULT 'New',
    notes TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::varchar,
    tracking_id VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(100) NOT NULL,
    subject VARCHAR(255),
    interest VARCHAR(255) DEFAULT 'General Inquiry',
    urgency VARCHAR(50) DEFAULT 'Normal',
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'New',
    notes TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.8 CAREERS & JOB APPLICATIONS
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(255) NOT NULL,
    employment_type VARCHAR(100) DEFAULT 'Full-Time',
    location VARCHAR(255) DEFAULT 'Nyeri Main Branch',
    status VARCHAR(50) DEFAULT 'Open',
    description TEXT NOT NULL,
    requirements TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.job_applications (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::varchar,
    tracking_id VARCHAR(100),
    unique_identifier VARCHAR(100),
    job_id VARCHAR(100),
    job_title VARCHAR(255),
    applicant_name VARCHAR(255),
    full_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    resume_url TEXT, -- URL in job-applications bucket
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'Submitted',
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.9 NEWSLETTER SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::varchar,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    frequency VARCHAR(50) DEFAULT 'Weekly',
    interests VARCHAR(255) DEFAULT 'Financial Insights & News',
    status VARCHAR(50) DEFAULT 'Active',
    source VARCHAR(100) DEFAULT 'Website',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.10 MASTER LEADS LEDGER
CREATE TABLE IF NOT EXISTS public.leads (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::varchar,
    tracking_id VARCHAR(100),
    unique_identifier VARCHAR(100),
    form_type VARCHAR(100) DEFAULT 'Contact',
    type VARCHAR(100),
    full_name VARCHAR(255),
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(100),
    subject VARCHAR(255),
    message TEXT,
    source_page VARCHAR(255),
    status VARCHAR(50) DEFAULT 'New',
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- 3. CMS CONTENT MANAGEMENT (ARTICLES, MEDIA, CATEGORIES, COMMENTS, SOCIAL)
-- ==============================================================================

-- 3.1 BLOG ARTICLES
CREATE TABLE IF NOT EXISTS public.blog_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    blocks JSONB DEFAULT '[]'::jsonb,
    category VARCHAR(100) DEFAULT 'Financial Literacy',
    tags JSONB DEFAULT '[]'::jsonb,
    author_id VARCHAR(100) DEFAULT 'auth_pm',
    author_name VARCHAR(255) DEFAULT 'Patrick Munene',
    status VARCHAR(50) DEFAULT 'Draft', -- 'Published', 'Draft', 'Scheduled', 'Trash'
    image TEXT,
    published_at TIMESTAMPTZ,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_articles (slug);
CREATE INDEX IF NOT EXISTS idx_blog_status ON public.blog_articles (status);
CREATE INDEX IF NOT EXISTS idx_blog_category ON public.blog_articles (category);

-- 3.2 ARTICLE COMMENTS
CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID,
    post_slug VARCHAR(255),
    post_title VARCHAR(255),
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Spam', 'Reported', 'Hidden'
    parent_id UUID,
    likes INTEGER DEFAULT 0,
    ai_risk_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure alias table article_comments exists
CREATE TABLE IF NOT EXISTS public.article_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID,
    post_slug VARCHAR(255),
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Approved',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 CATEGORIES & TAGS
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL DEFAULT 'category', -- 'category' or 'tag'
    description TEXT,
    color VARCHAR(50) DEFAULT '#074504',
    parent_category VARCHAR(255),
    seo_title VARCHAR(255),
    seo_description TEXT,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed core categories and tags
INSERT INTO public.categories (name, slug, type, description, color)
VALUES
    ('Financial Literacy', 'financial-literacy', 'category', 'Pragmatic guides on creditworthiness, savings culture, and micro-loan cashflow.', '#074504'),
    ('Success Stories', 'success-stories', 'category', 'Transformational journeys from rural entrepreneurs and women-led groups.', '#C0991B'),
    ('Agribusiness', 'agribusiness', 'category', 'Sustainable agriculture, horticulture, dairy financing, and rural farming value chains.', '#059669'),
    ('Microfinance Insights', 'microfinance-insights', 'category', 'Industry analysis, affordable interest benchmarks, and regulatory compliance.', '#2563EB'),
    ('Community Health', 'community-health', 'category', 'Preventative sanitation, clean water interventions, and community hygiene.', '#7C3AED'),
    ('Economic Empowerment', 'economic-empowerment', 'category', 'Equipping grassroots households with capital assets, seed funds, and business tools.', '#DB2777'),
    ('Loans', 'loans', 'tag', 'Credit solutions and flexible repayment schedules.', '#074504'),
    ('Savings', 'savings', 'tag', 'Disciplined emergency funds and group tables.', '#C0991B'),
    ('Women Empowerment', 'women-empowerment', 'tag', 'Grassroots initiatives uplifting women entrepreneurs.', '#DB2777'),
    ('Agribusiness Tips', 'agribusiness-tips', 'tag', 'Farming productivity and smart crop financing.', '#059669')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    color = EXCLUDED.color;

-- 3.4 SOCIAL MEDIA LINKS
CREATE TABLE IF NOT EXISTS public.social_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    icon VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.social_media (platform, name, url, enabled, display_order)
VALUES
    ('facebook', 'Facebook', 'https://www.facebook.com/NeemaHeepOrganization', true, 1),
    ('x', 'X (Twitter)', 'https://x.com/NeemaHeepLtd', true, 2),
    ('instagram', 'Instagram', 'https://www.instagram.com/neemaheep', true, 3),
    ('linkedin', 'LinkedIn', 'https://www.linkedin.com/company/neema-heep', true, 4),
    ('youtube', 'YouTube', 'https://www.youtube.com/@neemaheep', true, 5),
    ('tiktok', 'TikTok', 'https://www.tiktok.com/@neemaheep', true, 6),
    ('whatsapp', 'WhatsApp Official', 'https://wa.me/254700000000', true, 7)
ON CONFLICT (platform) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    enabled = EXCLUDED.enabled;

-- 3.5 AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(255) NOT NULL,
    module VARCHAR(100) NOT NULL,
    actor VARCHAR(255) NOT NULL,
    actor_role VARCHAR(100),
    ip_address VARCHAR(100),
    details TEXT,
    status VARCHAR(50) DEFAULT 'Success',
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 3.6 BENEFICIARY MANAGEMENT
CREATE TABLE IF NOT EXISTS public.beneficiary_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    year VARCHAR(20) NOT NULL,
    year_identifier VARCHAR(100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'Published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID REFERENCES public.beneficiary_lists(id) ON DELETE CASCADE,
    year VARCHAR(20) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(50),
    school_institution VARCHAR(255),
    county VARCHAR(100),
    award_amount NUMERIC DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- 4. SUPABASE STORAGE BUCKETS CONFIGURATION
-- ==============================================================================

-- Create all required storage buckets for documents, photos and receipts
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('member-photos', 'member-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('member-documents', 'member-documents', true, 15728640, ARRAY['image/jpeg', 'image/png', 'application/pdf']),
    ('group-documents', 'group-documents', true, 20971520, ARRAY['image/jpeg', 'image/png', 'application/pdf']),
    ('volunteer-documents', 'volunteer-documents', true, 15728640, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
    ('sponsorship-documents', 'sponsorship-documents', true, 20971520, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
    ('partnership-documents', 'partnership-documents', true, 20971520, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
    ('job-applications', 'job-applications', true, 15728640, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
    ('media', 'media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']),
    ('cms-media', 'cms-media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']),
    ('backups', 'backups', false, 104857600, ARRAY['application/json', 'application/zip', 'application/sql', 'text/plain'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit;


-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES ENFORCEMENT
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.individual_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prequalifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.callback_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficiary_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;

-- Helper macro: Drop conflicting old policies cleanly
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN
        SELECT unnest(ARRAY[
            'user_roles', 'user_profiles', 'custom_roles',
            'individual_registrations', 'group_registrations',
            'volunteer_applications', 'sponsorship_requests', 'partnership_requests',
            'prequalifications', 'callback_requests', 'contact_messages',
            'job_applications', 'jobs', 'newsletter_subscriptions', 'leads',
            'blog_articles', 'blog_comments', 'categories', 'social_media',
            'audit_logs', 'beneficiary_lists', 'beneficiaries'
        ])
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "cms_all_%s" ON public.%I', tbl, tbl);
        EXECUTE format('DROP POLICY IF EXISTS "public_insert_%s" ON public.%I', tbl, tbl);
        EXECUTE format('DROP POLICY IF EXISTS "public_read_%s" ON public.%I', tbl, tbl);
    END LOOP;
END $$;

-- 5.1 PUBLIC INSERTS (Allows anonymous website visitors to submit forms)
CREATE POLICY "public_insert_ind_reg" ON public.individual_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_grp_reg" ON public.group_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_vol_app" ON public.volunteer_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_spons_req" ON public.sponsorship_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_part_req" ON public.partnership_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_prequal" ON public.prequalifications FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_callback" ON public.callback_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_contact" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_job_app" ON public.job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_newsletter" ON public.newsletter_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_comments" ON public.blog_comments FOR INSERT WITH CHECK (true);

-- 5.2 CMS & STAFF OPERATIONS (Full management for authorized staff and service keys)
CREATE POLICY "cms_all_user_roles" ON public.user_roles FOR ALL USING (true);
CREATE POLICY "cms_all_user_profiles" ON public.user_profiles FOR ALL USING (true);
CREATE POLICY "cms_all_custom_roles" ON public.custom_roles FOR ALL USING (true);
CREATE POLICY "cms_all_ind_reg" ON public.individual_registrations FOR ALL USING (true);
CREATE POLICY "cms_all_grp_reg" ON public.group_registrations FOR ALL USING (true);
CREATE POLICY "cms_all_vol_app" ON public.volunteer_applications FOR ALL USING (true);
CREATE POLICY "cms_all_spons_req" ON public.sponsorship_requests FOR ALL USING (true);
CREATE POLICY "cms_all_part_req" ON public.partnership_requests FOR ALL USING (true);
CREATE POLICY "cms_all_prequal" ON public.prequalifications FOR ALL USING (true);
CREATE POLICY "cms_all_callback" ON public.callback_requests FOR ALL USING (true);
CREATE POLICY "cms_all_contact" ON public.contact_messages FOR ALL USING (true);
CREATE POLICY "cms_all_jobs" ON public.jobs FOR ALL USING (true);
CREATE POLICY "cms_all_job_apps" ON public.job_applications FOR ALL USING (true);
CREATE POLICY "cms_all_newsletter" ON public.newsletter_subscriptions FOR ALL USING (true);
CREATE POLICY "cms_all_leads" ON public.leads FOR ALL USING (true);
CREATE POLICY "cms_all_articles" ON public.blog_articles FOR ALL USING (true);
CREATE POLICY "cms_all_comments" ON public.blog_comments FOR ALL USING (true);
CREATE POLICY "cms_all_categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "cms_all_social" ON public.social_media FOR ALL USING (true);
CREATE POLICY "cms_all_audit" ON public.audit_logs FOR ALL USING (true);
CREATE POLICY "cms_all_ben_lists" ON public.beneficiary_lists FOR ALL USING (true);
CREATE POLICY "cms_all_ben" ON public.beneficiaries FOR ALL USING (true);

-- 5.3 STORAGE BUCKET POLICIES (Allow public upload & download)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
    DROP POLICY IF EXISTS "Public Update" ON storage.objects;
    DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Public Read All Objects" ON storage.objects 
    FOR SELECT USING (bucket_id IN (
        'member-photos', 'member-documents', 'group-documents', 
        'volunteer-documents', 'sponsorship-documents', 'partnership-documents', 
        'job-applications', 'media', 'cms-media'
    ));

CREATE POLICY "Public Insert All Objects" ON storage.objects 
    FOR INSERT WITH CHECK (bucket_id IN (
        'member-photos', 'member-documents', 'group-documents', 
        'volunteer-documents', 'sponsorship-documents', 'partnership-documents', 
        'job-applications', 'media', 'cms-media'
    ));

-- ==============================================================================
-- 6. VERIFICATION QUERY
-- ==============================================================================
-- Run this to confirm authorized CMS staff records and their privileges:
SELECT 
    ur.user_name,
    ur.email,
    ur.phone,
    ur.role,
    ur.department,
    ur.initial_password,
    ur.status,
    ur.granted_rights
FROM public.user_roles ur
WHERE ur.email IN ('ptrckmunene@gmail.com', 'muthonichar12@gmail.com');
