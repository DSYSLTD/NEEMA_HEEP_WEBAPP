-- ==============================================================================
-- NEEMA HEEP CMS — COMPREHENSIVE SUPABASE DATABASE SETUP & RLS POLICIES
-- Project Name: NEEMA HEEP WEBAPP
-- Project ID:   xkigjrdvxnzvgpoubari
-- Platform:     Supabase SQL Editor (https://supabase.com/dashboard/project/xkigjrdvxnzvgpoubari)
--
-- Instructions:
-- 1. Open Supabase Dashboard -> SQL Editor.
-- 2. Paste this entire script into a New Query and click "Run".
-- 3. This script is 100% IDEMPOTENT: safe to run multiple times without data loss.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- EXTENSIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. BLOG MANAGEMENT: ARTICLES & COMMENTS
-- ------------------------------------------------------------------------------

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

CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON public.blog_articles (slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_status ON public.blog_articles (status);
CREATE INDEX IF NOT EXISTS idx_blog_articles_category ON public.blog_articles (category);
CREATE INDEX IF NOT EXISTS idx_blog_articles_created_at ON public.blog_articles (created_at DESC);

CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID,
    post_slug VARCHAR(255),
    post_title VARCHAR(255),
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Spam', 'Reported', 'Hidden', 'Deleted'
    parent_id UUID, -- For nested / threaded discussions
    likes INTEGER DEFAULT 0,
    ai_risk_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.blog_comments ADD COLUMN IF NOT EXISTS parent_id UUID;
ALTER TABLE public.blog_comments ADD COLUMN IF NOT EXISTS ai_risk_score INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_blog_comments_article_id ON public.blog_comments (article_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_slug ON public.blog_comments (post_slug);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON public.blog_comments (status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON public.blog_comments (parent_id);

-- ------------------------------------------------------------------------------
-- 2. CATEGORIES AND TAGS
-- ------------------------------------------------------------------------------

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

-- Ensure category_type compatibility column
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS category_type VARCHAR(50);
UPDATE public.categories SET category_type = type WHERE category_type IS NULL;

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);
CREATE INDEX IF NOT EXISTS idx_categories_type ON public.categories (type);

-- ------------------------------------------------------------------------------
-- 3. BENEFICIARY MANAGEMENT
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.beneficiary_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    year VARCHAR(10) NOT NULL,
    year_identifier VARCHAR(100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'Draft', -- 'Published', 'Draft', 'Archived'
    created_by VARCHAR(255) DEFAULT 'System Administrator',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_beneficiary_lists_year ON public.beneficiary_lists (year);
CREATE INDEX IF NOT EXISTS idx_beneficiary_lists_status ON public.beneficiary_lists (status);

CREATE TABLE IF NOT EXISTS public.beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID REFERENCES public.beneficiary_lists(id) ON DELETE SET NULL,
    serial_number INTEGER,
    full_name VARCHAR(255) NOT NULL,
    masked_name VARCHAR(255),
    school VARCHAR(255) NOT NULL,
    year VARCHAR(10) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_beneficiaries_list_id ON public.beneficiaries (list_id);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_year ON public.beneficiaries (year);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_school ON public.beneficiaries (school);

-- ------------------------------------------------------------------------------
-- 4. LEAD AND INQUIRIES MANAGEMENT (SINGLE SOURCE OF TRUTH: public.leads)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_type VARCHAR(100) NOT NULL, -- 'prequalification', 'callback', 'contact'
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(100),
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'New', -- 'New', 'Contacted', 'In Progress', 'Completed', 'Closed'
    source_page VARCHAR(255),
    details JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add columns if table existed with minimal schema
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'New';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS subject VARCHAR(255);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS source_page VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_leads_form_type ON public.leads (form_type);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);

-- ------------------------------------------------------------------------------
-- 5. MEMBERSHIP REGISTRATIONS MANAGEMENT
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.individual_member_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    gender VARCHAR(50),
    date_of_birth VARCHAR(50),
    occupation VARCHAR(255),
    county VARCHAR(100),
    status VARCHAR(50) DEFAULT 'New', -- 'New', 'Under Review', 'Verified', 'Approved', 'Rejected'
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.individual_member_registrations ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb;
CREATE INDEX IF NOT EXISTS idx_indiv_reg_status ON public.individual_member_registrations (status);

CREATE TABLE IF NOT EXISTS public.group_member_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100),
    contact_person_name VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    group_type VARCHAR(100),
    county VARCHAR(100),
    status VARCHAR(50) DEFAULT 'New', -- 'New', 'Under Review', 'Verified', 'Approved', 'Rejected'
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.group_member_registrations ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb;
CREATE INDEX IF NOT EXISTS idx_group_reg_status ON public.group_member_registrations (status);

-- ------------------------------------------------------------------------------
-- 6. SPONSORSHIP AND PARTNERSHIPS MANAGEMENT
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.sponsorship_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(100),
    sponsorship_type VARCHAR(150),
    status VARCHAR(50) DEFAULT 'New', -- 'New', 'In Review', 'Approved', 'Declined'
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sponsorship_requests ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb;
CREATE INDEX IF NOT EXISTS idx_sponsorship_status ON public.sponsorship_requests (status);

CREATE TABLE IF NOT EXISTS public.partnership_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(100),
    proposal TEXT,
    status VARCHAR(50) DEFAULT 'New', -- 'New', 'In Review', 'Partner Active', 'Declined'
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.partnership_requests ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb;
CREATE INDEX IF NOT EXISTS idx_partnership_status ON public.partnership_requests (status);

-- ------------------------------------------------------------------------------
-- 7. APPLICATIONS AND SUBSCRIPTIONS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(100) DEFAULT 'Operations',
    employment_type VARCHAR(50) DEFAULT 'Full-Time',
    location VARCHAR(100) DEFAULT 'Nyeri Main Branch',
    status VARCHAR(50) DEFAULT 'Open', -- 'Open', 'Closed', 'Archived'
    description TEXT,
    requirements TEXT,
    created_by VARCHAR(255) DEFAULT 'HR Administrator',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs (status);
CREATE INDEX IF NOT EXISTS idx_jobs_slug ON public.jobs (slug);

CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'New', -- 'New', 'Shortlisted', 'Interviewed', 'Rejected', 'Hired'
    reviewed_by VARCHAR(255),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb;
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications (job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications (status);

CREATE TABLE IF NOT EXISTS public.volunteer_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    interests VARCHAR(255),
    skills TEXT,
    experience TEXT,
    availability VARCHAR(100),
    status VARCHAR(50) DEFAULT 'New', -- 'New', 'Under Review', 'Approved', 'Completed'
    reviewed_by VARCHAR(255),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.volunteer_applications ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb;
CREATE INDEX IF NOT EXISTS idx_volunteer_app_status ON public.volunteer_applications (status);

CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'Subscribed', -- 'Subscribed', 'Unsubscribed'
    consent_given VARCHAR(10) DEFAULT 'Yes',
    source_page VARCHAR(255),
    unsubscribed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscriptions (email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON public.newsletter_subscriptions (status);

-- ------------------------------------------------------------------------------
-- 8. ADMINISTRATION, USERS & PERMISSIONS
-- ------------------------------------------------------------------------------

-- User Profiles (No password column used)
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
    verification_status VARCHAR(50) DEFAULT 'Verified',
    profile_photo TEXT,
    cover_photo TEXT,
    bio TEXT,
    short_bio TEXT,
    education JSONB DEFAULT '[]'::jsonb,
    work_experience JSONB DEFAULT '[]'::jsonb,
    expertise JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles (email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles (role);

-- User Roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(100) NOT NULL, -- 'Superadmin', 'Content editor', 'Administrator', 'Reviewer'
    department VARCHAR(255) DEFAULT 'CMS Editorial',
    status VARCHAR(50) DEFAULT 'Active',
    granted_rights JSONB DEFAULT '[]'::jsonb,
    assigned_by VARCHAR(255) DEFAULT 'Superadmin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_roles_email ON public.user_roles (email);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles (role);

-- Custom Roles
CREATE TABLE IF NOT EXISTS public.custom_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social Media Links
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

CREATE INDEX IF NOT EXISTS idx_social_media_platform ON public.social_media (platform);
CREATE INDEX IF NOT EXISTS idx_social_media_enabled ON public.social_media (enabled);

-- Audit Logs (Confidential, Append-only)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor VARCHAR(255) NOT NULL DEFAULT 'System',
    actor_role VARCHAR(100) DEFAULT 'Administrator',
    event VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    status VARCHAR(50) DEFAULT 'Success',
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_category ON public.audit_logs (category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs (actor);

-- ------------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES ENFORCEMENT
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficiary_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.individual_member_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_member_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper macro: Drop conflicting legacy policies cleanly
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN
        SELECT unnest(ARRAY[
            'blog_articles', 'blog_comments', 'categories', 'beneficiaries', 'beneficiary_lists',
            'leads', 'individual_member_registrations', 'group_member_registrations',
            'sponsorship_requests', 'partnership_requests', 'jobs', 'job_applications',
            'volunteer_applications', 'newsletter_subscriptions', 'user_profiles', 'user_roles',
            'custom_roles', 'social_media', 'audit_logs'
        ])
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "allow_all_%s" ON public.%I', tbl, tbl);
        EXECUTE format('DROP POLICY IF EXISTS "public_read_%s" ON public.%I', tbl, tbl);
        EXECUTE format('DROP POLICY IF EXISTS "public_insert_%s" ON public.%I', tbl, tbl);
        EXECUTE format('DROP POLICY IF EXISTS "admin_all_%s" ON public.%I', tbl, tbl);
    END LOOP;
END $$;

-- Policies for public website visitors & CMS admin operations:
-- Read access for all CMS tables to anon and authenticated clients
CREATE POLICY "cms_read_blog_articles" ON public.blog_articles FOR SELECT USING (true);
CREATE POLICY "cms_all_blog_articles" ON public.blog_articles FOR ALL USING (true);

CREATE POLICY "cms_read_blog_comments" ON public.blog_comments FOR SELECT USING (true);
CREATE POLICY "cms_insert_blog_comments" ON public.blog_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "cms_all_blog_comments" ON public.blog_comments FOR ALL USING (true);

CREATE POLICY "cms_read_categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "cms_all_categories" ON public.categories FOR ALL USING (true);

CREATE POLICY "cms_read_beneficiaries" ON public.beneficiaries FOR SELECT USING (true);
CREATE POLICY "cms_all_beneficiaries" ON public.beneficiaries FOR ALL USING (true);

CREATE POLICY "cms_read_beneficiary_lists" ON public.beneficiary_lists FOR SELECT USING (true);
CREATE POLICY "cms_all_beneficiary_lists" ON public.beneficiary_lists FOR ALL USING (true);

-- Leads: Visitors can insert leads; Admins can read & update
CREATE POLICY "public_insert_leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "cms_select_leads" ON public.leads FOR SELECT USING (true);
CREATE POLICY "cms_update_leads" ON public.leads FOR UPDATE USING (true);
CREATE POLICY "cms_delete_leads" ON public.leads FOR DELETE USING (true);

-- Membership registrations: Visitors can register; Admins can review & manage
CREATE POLICY "public_insert_indiv_reg" ON public.individual_member_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "cms_all_indiv_reg" ON public.individual_member_registrations FOR ALL USING (true);

CREATE POLICY "public_insert_group_reg" ON public.group_member_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "cms_all_group_reg" ON public.group_member_registrations FOR ALL USING (true);

-- Sponsorship and Partnerships
CREATE POLICY "public_insert_sponsorship" ON public.sponsorship_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "cms_all_sponsorship" ON public.sponsorship_requests FOR ALL USING (true);

CREATE POLICY "public_insert_partnership" ON public.partnership_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "cms_all_partnership" ON public.partnership_requests FOR ALL USING (true);

-- Careers, Applications & Subscriptions
CREATE POLICY "cms_read_jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "cms_all_jobs" ON public.jobs FOR ALL USING (true);

CREATE POLICY "public_insert_job_apps" ON public.job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "cms_all_job_apps" ON public.job_applications FOR ALL USING (true);

CREATE POLICY "public_insert_volunteer_apps" ON public.volunteer_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "cms_all_volunteer_apps" ON public.volunteer_applications FOR ALL USING (true);

CREATE POLICY "public_insert_newsletter" ON public.newsletter_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "cms_all_newsletter" ON public.newsletter_subscriptions FOR ALL USING (true);

-- Administration & Security
CREATE POLICY "cms_all_user_profiles" ON public.user_profiles FOR ALL USING (true);
CREATE POLICY "cms_all_user_roles" ON public.user_roles FOR ALL USING (true);
CREATE POLICY "cms_all_custom_roles" ON public.custom_roles FOR ALL USING (true);
CREATE POLICY "cms_read_social_media" ON public.social_media FOR SELECT USING (true);
CREATE POLICY "cms_all_social_media" ON public.social_media FOR ALL USING (true);

CREATE POLICY "public_insert_audit_logs" ON public.audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "cms_all_audit_logs" ON public.audit_logs FOR SELECT USING (true);

-- ------------------------------------------------------------------------------
-- 10. SEED CORE DATA (IDEMPOTENT ON CONFLICT)
-- ------------------------------------------------------------------------------

-- Seed Custom Roles
INSERT INTO public.custom_roles (role_name, description, permissions)
VALUES
    ('Superadmin', 'Full system administration and user role governance', '["all"]'::jsonb),
    ('Content editor', 'Manage editorial blog articles, media, categories and comments', '["blog_manage", "media_manage"]'::jsonb),
    ('Administrator', 'Operational administration, forms, beneficiaries and memberships', '["leads_manage", "beneficiaries_manage", "members_manage", "jobs_manage"]'::jsonb),
    ('Reviewer', 'Review incoming loan inquiries, job dossiers and volunteer applications', '["leads_read", "applications_read"]'::jsonb)
ON CONFLICT (role_name) DO UPDATE SET
    description = EXCLUDED.description,
    permissions = EXCLUDED.permissions;

-- Seed Social Media
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
    display_order = EXCLUDED.display_order;

-- Seed Default Beneficiary List
INSERT INTO public.beneficiary_lists (title, year, year_identifier, description, status)
VALUES
    ('Neema Secondary Education Scholars 2026', '2026', 'NH-BEN-2026', 'Merit and need-based secondary school education sponsorship program cohort 2026.', 'Published')
ON CONFLICT DO NOTHING;

-- Seed Default Vacancies
INSERT INTO public.jobs (title, slug, department, employment_type, location, status, description, requirements)
VALUES
    ('Senior Credit Risk Officer', 'senior-credit-risk-officer', 'Credit Operations', 'Full-Time', 'Nyeri Main Branch', 'Open', 'Lead credit appraisal and risk analysis for SME and agriculture portfolios.', 'Minimum 4 years experience in microfinance credit appraisal.'),
    ('Agribusiness Loan Officer', 'agribusiness-loan-officer', 'Field Operations', 'Full-Time', 'Embu Branch', 'Open', 'Manage grassroots farmer table-banking and dairy asset financing relationships.', 'Degree in Agribusiness, Finance or related field with field loan experience.')
ON CONFLICT (slug) DO NOTHING;
