-- ==============================================================================
-- NEEMA HEEP WEBAPP — PRODUCTION SUPABASE SQL MIGRATION SCRIPT
-- Project Name: NEEMA HEEP WEBAPP
-- Project ID:   xkigjrdvxnzvgpoubari
-- Project URL:  https://xkigjrdvxnzvgpoubari.supabase.co
--
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/xkigjrdvxnzvgpoubari
-- 2. Navigate to "SQL Editor" in the left sidebar.
-- 3. Click "New Query", paste this entire script, and click "Run".
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. USER PROFILES TABLE: ADD PASSWORD COLUMN & SYNCHRONIZE CREDENTIALS
-- ------------------------------------------------------------------------------

-- Ensure the public.user_profiles table exists
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

-- Add password column if user_profiles already existed without it
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Ensure initial_password column also exists for backward compatibility
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS initial_password VARCHAR(255);

-- Synchronize password and initial_password for any pre-existing profile records
UPDATE public.user_profiles 
SET password = initial_password 
WHERE password IS NULL AND initial_password IS NOT NULL;

UPDATE public.user_profiles 
SET initial_password = password 
WHERE initial_password IS NULL AND password IS NOT NULL;


-- ------------------------------------------------------------------------------
-- 2. CATEGORIES TABLE (HOLDS BOTH ARTICLE CATEGORIES AND ARTICLE TAGS)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL DEFAULT 'category', -- 'category' for article categories, 'tag' for article tags
    description TEXT,
    color VARCHAR(50) DEFAULT '#074504',
    parent_category VARCHAR(255),
    seo_title VARCHAR(255),
    seo_description TEXT,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helpful performance indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);
CREATE INDEX IF NOT EXISTS idx_categories_type ON public.categories (type);
CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories (name);

-- Seed default article categories and tags (idempotent ON CONFLICT DO NOTHING)
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
    ('Agribusiness Tips', 'agribusiness-tips', 'tag', 'Farming productivity and smart crop financing.', '#059669'),
    ('Financial Tips', 'financial-tips', 'tag', 'Actionable budgeting and working capital strategies.', '#2563EB'),
    ('Mount Kenya', 'mount-kenya', 'tag', 'Regional community focus across Meru, Embu, and Tharaka Nithi.', '#074504')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    color = EXCLUDED.color,
    description = EXCLUDED.description;


-- ------------------------------------------------------------------------------
-- 3. SOCIAL MEDIA TABLE (HOLDS ALL SOCIAL MEDIA LINKS ENTERED)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.social_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(100) NOT NULL UNIQUE, -- 'facebook', 'x', 'instagram', 'linkedin', 'tiktok', 'youtube', 'whatsapp'
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    icon VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_social_media_platform ON public.social_media (platform);
CREATE INDEX IF NOT EXISTS idx_social_media_enabled ON public.social_media (enabled);

-- Seed official Neema HEEP social media links (idempotent ON CONFLICT DO UPDATE)
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
    enabled = EXCLUDED.enabled,
    display_order = EXCLUDED.display_order,
    updated_at = NOW();


-- ------------------------------------------------------------------------------
-- 4. USER ROLES ALIGNMENT (ONLY 4 ROLES ENFORCED)
-- • Superadmin: Full system administration
-- • Content editor: Manage public website content
-- • Administrator: Administrative access
-- • Reviewer: Review applications and submissions
-- ------------------------------------------------------------------------------

-- Ensure user_roles table exists
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(100) NOT NULL,
    department VARCHAR(255) DEFAULT 'CMS Editorial',
    status VARCHAR(50) DEFAULT 'Active',
    initial_password VARCHAR(255),
    password VARCHAR(255),
    granted_rights JSONB DEFAULT '[]'::jsonb,
    assigned_by VARCHAR(255) DEFAULT 'Superadmin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add password column to user_roles table as well
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Ensure initial_password and password are synced in user_roles
UPDATE public.user_roles 
SET password = initial_password 
WHERE password IS NULL AND initial_password IS NOT NULL;

-- Migrate any legacy roles to the 4 standardized roles
UPDATE public.user_roles SET role = 'Superadmin' WHERE role ILIKE '%superadmin%' OR role ILIKE '%super admin%';
UPDATE public.user_roles SET role = 'Content editor' WHERE role ILIKE '%editor%' OR role ILIKE '%author%';
UPDATE public.user_roles SET role = 'Administrator' WHERE role ILIKE '%admin%' AND role <> 'Superadmin';
UPDATE public.user_roles SET role = 'Reviewer' WHERE role ILIKE '%reviewer%' OR role ILIKE '%webmaster%' OR role ILIKE '%web master%';

-- Seed / Ensure Superadmin (Patrick Munene) & Primary Content Editor (Charity Muthoni)
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS phone VARCHAR(100);

INSERT INTO public.user_roles (user_name, email, phone, role, department, status, initial_password, password, assigned_by)
VALUES
    ('Patrick Munene', 'ptrckmunene@gmail.com', '+254 725 789 086', 'Superadmin', 'Web Development', 'Active', '@super123#', '@super123#', 'System Initializer'),
    ('Charity Muthoni', 'muthonichar12@gmail.com', '+254 724 389 949', 'Content editor', 'CMS Editorial', 'Active', '@Cham123#', '@Cham123#', 'Patrick Munene (Superadmin)')
ON CONFLICT (email) DO UPDATE SET
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    password = EXCLUDED.password,
    initial_password = EXCLUDED.initial_password,
    status = 'Active';

-- Also ensure user_profiles records exist for the seed users
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(100);
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(100);

INSERT INTO public.user_profiles (first_name, last_name, display_name, username, email, phone, whatsapp, role, department, status, initial_password, password, job_title)
VALUES
    ('Patrick', 'Munene', 'Patrick Munene', 'ptrckmunene', 'ptrckmunene@gmail.com', '+254 725 789 086', '+254 725 789 086', 'Superadmin', 'Web Development', 'Active', '@super123#', '@super123#', 'Superadmin - Web Development'),
    ('Charity', 'Muthoni', 'Charity Muthoni', 'muthonichar12', 'muthonichar12@gmail.com', '+254 724 389 949', '+254 724 389 949', 'Content editor', 'CMS Editorial', 'Active', '@Cham123#', '@Cham123#', 'Content editor - CMS Editorial')
ON CONFLICT (email) DO UPDATE SET
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    whatsapp = EXCLUDED.whatsapp,
    password = EXCLUDED.password,
    initial_password = EXCLUDED.initial_password;

-- Ensure custom_roles catalog table reflects the 4 authorized roles
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

-- Drop any restrictive NOT NULL constraints that would break execution
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

CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_roles_role_name ON public.custom_roles (role_name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_roles_role_key ON public.custom_roles (role_key);

-- Synchronize existing rows
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

-- Insert missing roles supplying all column aliases
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


-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_roles ENABLE ROW LEVEL SECURITY;

-- 5.1 user_profiles policies
DROP POLICY IF EXISTS "Allow read on user_profiles" ON public.user_profiles;
CREATE POLICY "Allow read on user_profiles" ON public.user_profiles 
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow modify on user_profiles" ON public.user_profiles;
CREATE POLICY "Allow modify on user_profiles" ON public.user_profiles 
    FOR ALL TO anon, authenticated USING (true);

-- 5.2 categories policies (public read for public website & CMS)
DROP POLICY IF EXISTS "Allow read on categories" ON public.categories;
CREATE POLICY "Allow read on categories" ON public.categories 
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow modify on categories" ON public.categories;
CREATE POLICY "Allow modify on categories" ON public.categories 
    FOR ALL TO anon, authenticated USING (true);

-- 5.3 social_media policies (public read for header/footer icons & CMS manage)
DROP POLICY IF EXISTS "Allow read on social_media" ON public.social_media;
CREATE POLICY "Allow read on social_media" ON public.social_media 
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow modify on social_media" ON public.social_media;
CREATE POLICY "Allow modify on social_media" ON public.social_media 
    FOR ALL TO anon, authenticated USING (true);

-- 5.4 user_roles policies
DROP POLICY IF EXISTS "Allow read on user_roles" ON public.user_roles;
CREATE POLICY "Allow read on user_roles" ON public.user_roles 
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow modify on user_roles" ON public.user_roles;
CREATE POLICY "Allow modify on user_roles" ON public.user_roles 
    FOR ALL TO anon, authenticated USING (true);

-- 5.5 custom_roles policies
DROP POLICY IF EXISTS "Allow read on custom_roles" ON public.custom_roles;
CREATE POLICY "Allow read on custom_roles" ON public.custom_roles 
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow modify on custom_roles" ON public.custom_roles;
CREATE POLICY "Allow modify on custom_roles" ON public.custom_roles 
    FOR ALL TO anon, authenticated USING (true);

-- ==============================================================================
-- END OF SUPABASE SQL MIGRATION SCRIPT
-- ==============================================================================
