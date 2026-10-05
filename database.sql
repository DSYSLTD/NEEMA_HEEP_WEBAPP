-- ==============================================================================
-- NEEMA HEEP MICROFINANCE — PRODUCTION DATABASE SCHEMA & CONSOLIDATION SCRIPT
-- Platform: Supabase / PostgreSQL SQL Editor
-- Project Name: NEEMA HEEP WEBAPP
-- Project ID: xkigjrdvxnzvgpoubari
-- Project URL: https://xkigjrdvxnzvgpoubari.supabase.co
-- Currency Standard: Kenyan Shillings (Kshs) — No foreign currencies ($) used
-- 
-- SUMMARY OF DATABASE RESTRUCTURING:
-- 1. ALL MONETARY VALUES ARE IN KENYAN SHILLINGS (Kshs):
--    - Individual member registration fee: Kshs 2,000
--    - Group member registration fee: Kshs 600 per member
--    - Loan prequalification amounts & business turnovers: Kshs
--    - CSR & Education sponsorship pledges: Kshs
--    - Beneficiary bursary disbursements: Kshs
--    - Job vacancy salary compensation ranges: Kshs
--
-- 2. FORMS TABLES (8 Dedicated Tables):
--    - public.prequalifications (Prequalification loan & eligibility quiz submissions in Kshs)
--    - public.callback_requests (Standardized phone callback requests)
--    - public.contact_messages (General contact inquiries & branch messages)
--    - public.job_applications (Online career applications & CV dossiers)
--    - public.volunteer_applications (Community & mentorship volunteer requests)
--    - public.partnership_requests (Strategic institutional & NGO partnership requests)
--    - public.sponsorship_requests (Corporate CSR & donor sponsorship requests in Kshs)
--    - public.newsletter_subscriptions (Newsletter opt-ins & email subscriptions)
--
-- 3. TWO MEMBERSHIP TABLES:
--    - public.individual_registrations (Individual membership onboarding & Kshs 2,000 fee)
--    - public.group_registrations (Chama / group membership onboarding & Kshs 600/member fee)
--
-- 4. CMS SUPPORTING TABLES (Clean, non-redundant core CMS modules):
--    - public.user_roles (CMS access control, permissions & credentials)
--    - public.user_profiles (Staff profiles, author bios & HR records)
--    - public.custom_roles (Dynamic role definitions & permission rules)
--    - public.audit_logs (Security, login & CMS modification logs)
--    - public.blog_articles (Editorial articles, insights & publications)
--    - public.article_comments (Public comments & moderation queue)
--    - public.beneficiary_lists (CSR batches, cohorts & community lists)
--    - public.beneficiaries (CSR recipient records & Kshs disbursements)
--    - public.jobs (Live career vacancies with Kshs salary ranges)
--    - public.media_library (Uploaded assets, images & documents)
--
-- 5. ELIMINATED REDUNDANT / DUPLICATE TABLES:
--    - Dropped: social_media, social_links, social_posts, social_feeds, social_accounts
--    - Dropped: leads, members (migrated into dedicated forms & membership tables)
--    - Dropped: contact_inquiries, membership_registrations, pre_qualifications
--    - Dropped: vacancies, careers (consolidated into public.jobs)
--    - Dropped: articles, posts, categories, tags, article_categories, article_tags, article_likes
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- STEP 1: ENABLE REQUIRED EXTENSIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ------------------------------------------------------------------------------
-- STEP 2: CREATE DEDICATED TABLES FIRST (BEFORE MIGRATING DATA)
-- ------------------------------------------------------------------------------

-- 1. PREQUALIFICATIONS (Loan Prequalification Submissions in Kshs)
CREATE TABLE IF NOT EXISTS public.prequalifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    business_type VARCHAR(255),
    years_in_business VARCHAR(100),
    requested_amount VARCHAR(100),
    requested_amount_currency VARCHAR(10) DEFAULT 'Kshs',
    monthly_turnover VARCHAR(100),
    monthly_turnover_currency VARCHAR(10) DEFAULT 'Kshs',
    collateral_type VARCHAR(255),
    prequalification_score NUMERIC DEFAULT 85,
    recommended_product VARCHAR(255),
    county VARCHAR(100),
    details JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'New',
    signup_source VARCHAR(255),
    consent_given VARCHAR(10) DEFAULT 'Yes',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON COLUMN public.prequalifications.requested_amount IS 'Requested loan capital amount in Kenyan Shillings (Kshs)';
COMMENT ON COLUMN public.prequalifications.monthly_turnover IS 'Monthly business turnover in Kenyan Shillings (Kshs)';


-- 2. CALLBACK REQUESTS (Globally Standardized Phone Callback Service)
CREATE TABLE IF NOT EXISTS public.callback_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    interest VARCHAR(255) DEFAULT 'General Loan Inquiry',
    preferred_time VARCHAR(100) DEFAULT 'Morning (8am - 12pm)',
    status VARCHAR(50) DEFAULT 'New',
    notes TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    signup_source VARCHAR(255) DEFAULT 'Contact Us Page',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 3. CONTACT MESSAGES (Contact Us Inquiries)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    email VARCHAR(255),
    interest VARCHAR(255) DEFAULT 'General Inquiry',
    urgency VARCHAR(50) DEFAULT 'Normal',
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'New',
    notes TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    signup_source VARCHAR(255) DEFAULT 'Contact Us Form',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 4. JOB APPLICATIONS (Careers & Recruitment Submissions)
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id VARCHAR(100),
    job_title VARCHAR(255),
    vacancy_id VARCHAR(100),
    vacancy_title VARCHAR(255),
    vacancy_ref VARCHAR(100),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    id_number VARCHAR(100),
    kra_pin VARCHAR(100),
    county VARCHAR(100),
    sub_county VARCHAR(100),
    ward VARCHAR(100),
    department VARCHAR(255),
    app_number VARCHAR(100),
    education JSONB DEFAULT '[]'::jsonb,
    employment JSONB DEFAULT '[]'::jsonb,
    memberships JSONB DEFAULT '[]'::jsonb,
    references JSONB DEFAULT '[]'::jsonb,
    cv_info JSONB DEFAULT '{}'::jsonb,
    cover_letter TEXT,
    resume_url TEXT,
    linkedin_url TEXT,
    status VARCHAR(50) DEFAULT 'Received',
    details JSONB DEFAULT '{}'::jsonb,
    signup_source VARCHAR(255) DEFAULT 'Careers Page',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 5. VOLUNTEER APPLICATIONS (Community & Mentorship Volunteers)
CREATE TABLE IF NOT EXISTS public.volunteer_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(100) NOT NULL,
    profession VARCHAR(255),
    role VARCHAR(255) DEFAULT 'Academic Mentorship',
    availability VARCHAR(255),
    motivation TEXT,
    county VARCHAR(100),
    status VARCHAR(50) DEFAULT 'New',
    details JSONB DEFAULT '{}'::jsonb,
    signup_source VARCHAR(255) DEFAULT 'Volunteer Page',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 6. PARTNERSHIP REQUESTS (Institutional, NGO & Donor Inquiries)
CREATE TABLE IF NOT EXISTS public.partnership_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    partnership_type VARCHAR(100) DEFAULT 'Donor / Grant Funding',
    proposal_summary TEXT,
    website VARCHAR(255),
    status VARCHAR(50) DEFAULT 'New',
    details JSONB DEFAULT '{}'::jsonb,
    signup_source VARCHAR(255) DEFAULT 'Partnership Request Form',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 7. SPONSORSHIP REQUESTS (CSR, Education & Community Sponsorships in Kshs)
CREATE TABLE IF NOT EXISTS public.sponsorship_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    program_name VARCHAR(255) DEFAULT 'Education Support',
    sponsorship_amount NUMERIC DEFAULT 0,
    sponsorship_currency VARCHAR(10) DEFAULT 'Kshs',
    beneficiary_focus VARCHAR(255),
    status VARCHAR(50) DEFAULT 'New',
    details JSONB DEFAULT '{}'::jsonb,
    signup_source VARCHAR(255) DEFAULT 'Sponsorship Request Form',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON COLUMN public.sponsorship_requests.sponsorship_amount IS 'Sponsorship funding contribution amount in Kenyan Shillings (Kshs)';


-- 8. NEWSLETTER SUBSCRIPTIONS (Email Marketing & Digest Opt-ins)
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    frequency VARCHAR(50) DEFAULT 'Weekly',
    interests VARCHAR(255) DEFAULT 'Financial Insights & News',
    status VARCHAR(50) DEFAULT 'Active',
    source VARCHAR(255) DEFAULT 'Website Footer',
    consent_given VARCHAR(10) DEFAULT 'Yes',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 9. INDIVIDUAL REGISTRATIONS (Individual Membership Onboarding in Kshs)
CREATE TABLE IF NOT EXISTS public.individual_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255),
    middle_name VARCHAR(255),
    last_name VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(50),
    dob DATE,
    id_number VARCHAR(100),
    kra_pin VARCHAR(100),
    phone VARCHAR(100) NOT NULL,
    alt_phone VARCHAR(100),
    email VARCHAR(255),
    county VARCHAR(100),
    sub_county VARCHAR(100),
    ward VARCHAR(100),
    physical_address TEXT,
    marital_status VARCHAR(50),
    dependents VARCHAR(50),
    next_of_kin_name VARCHAR(255),
    next_of_kin_relation VARCHAR(100),
    next_of_kin_phone VARCHAR(100),
    business_type VARCHAR(255),
    business_location VARCHAR(255),
    years_in_business VARCHAR(50),
    monthly_revenue VARCHAR(100),
    monthly_revenue_currency VARCHAR(10) DEFAULT 'Kshs',
    id_photo_front TEXT,
    id_photo_back TEXT,
    passport_photo TEXT,
    payment_ref VARCHAR(100),
    payment_amount NUMERIC DEFAULT 2000,
    payment_currency VARCHAR(10) DEFAULT 'Kshs',
    payment_status VARCHAR(50) DEFAULT 'Paid',
    details JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'Submitted',
    signup_source VARCHAR(255) DEFAULT 'Individual Registration Portal',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON COLUMN public.individual_registrations.payment_amount IS 'Individual member registration fee in Kenyan Shillings (Kshs 2,000)';
COMMENT ON COLUMN public.individual_registrations.monthly_revenue IS 'Estimated monthly business revenue in Kenyan Shillings (Kshs)';


-- 10. GROUP REGISTRATIONS (Chama / Group Membership Onboarding in Kshs)
CREATE TABLE IF NOT EXISTS public.group_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_name VARCHAR(255) NOT NULL,
    group_type VARCHAR(100) DEFAULT 'Chama / Self Help Group',
    registration_certificate_no VARCHAR(100),
    formation_date VARCHAR(50),
    member_count INT DEFAULT 0,
    county VARCHAR(100),
    sub_county VARCHAR(100),
    ward VARCHAR(100),
    physical_address TEXT,
    meeting_frequency VARCHAR(100) DEFAULT 'Monthly',
    representative_name VARCHAR(255) NOT NULL,
    representative_role VARCHAR(100) DEFAULT 'Chairperson',
    representative_phone VARCHAR(100) NOT NULL,
    representative_id_number VARCHAR(100),
    representative_email VARCHAR(255),
    group_members JSONB DEFAULT '[]'::jsonb,
    payment_ref VARCHAR(100),
    payment_amount NUMERIC DEFAULT 0,
    payment_currency VARCHAR(10) DEFAULT 'Kshs',
    payment_status VARCHAR(50) DEFAULT 'Paid',
    constitution_doc TEXT,
    certificate_doc TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'Submitted',
    signup_source VARCHAR(255) DEFAULT 'Group Registration Portal',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON COLUMN public.group_registrations.payment_amount IS 'Group member registration fee in Kenyan Shillings (Kshs 600 per member)';


-- 11. USER ROLES (Access Control Matrix)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    user_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL DEFAULT 'Author',
    department VARCHAR(255) DEFAULT 'CMS Editorial',
    status VARCHAR(50) DEFAULT 'Active',
    initial_password VARCHAR(255),
    granted_rights JSONB DEFAULT '[]'::jsonb,
    assigned_by VARCHAR(255) DEFAULT 'System Initializer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 12. USER PROFILES (Staff Directory, Bio & Credentials)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    first_name VARCHAR(255),
    middle_name VARCHAR(255),
    last_name VARCHAR(255),
    display_name VARCHAR(255),
    username VARCHAR(255),
    email VARCHAR(255) NOT NULL,
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


-- 13. CUSTOM ROLES (Dynamic Custom Roles)
CREATE TABLE IF NOT EXISTS public.custom_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    department VARCHAR(255) DEFAULT 'Operations',
    color VARCHAR(50) DEFAULT '#074504',
    badge VARCHAR(50) DEFAULT 'Custom',
    assigned_count INTEGER DEFAULT 0,
    is_system BOOLEAN DEFAULT FALSE,
    permissions JSONB DEFAULT '{}'::jsonb,
    created_by VARCHAR(255) DEFAULT 'Webmaster',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 14. AUDIT LOGS (Security & Compliance)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    user_email VARCHAR(255),
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 15. BLOG ARTICLES (CMS Editorial Articles)
CREATE TABLE IF NOT EXISTS public.blog_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    category VARCHAR(100) DEFAULT 'Microfinance',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    author_id UUID,
    author_name VARCHAR(255),
    author_role VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Draft',
    featured BOOLEAN DEFAULT FALSE,
    read_time VARCHAR(50) DEFAULT '5 min read',
    published_at TIMESTAMPTZ,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 16. ARTICLE COMMENTS (Community Moderation)
CREATE TABLE IF NOT EXISTS public.article_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID,
    article_slug VARCHAR(255),
    article_title VARCHAR(255),
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    status VARCHAR(50) DEFAULT 'Pending',
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    ip_address VARCHAR(100),
    parent_comment_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 16B. CATEGORIES (Article Categories & Tags)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL DEFAULT 'category',
    description TEXT,
    color VARCHAR(50) DEFAULT '#074504',
    parent_category VARCHAR(255),
    seo_title VARCHAR(255),
    seo_description TEXT,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 16C. SOCIAL MEDIA (Official Social Media Profiles & Links)
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


-- 17. BENEFICIARY LISTS (CSR Project Cohorts)
CREATE TABLE IF NOT EXISTS public.beneficiary_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    program_type VARCHAR(100) DEFAULT 'Education Support',
    county VARCHAR(100) DEFAULT 'Embu',
    sub_county VARCHAR(100),
    academic_year VARCHAR(50) DEFAULT '2026',
    status VARCHAR(50) DEFAULT 'Active',
    beneficiary_count INTEGER DEFAULT 0,
    approved_by VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 18. BENEFICIARIES (CSR Beneficiary Individuals with Kshs Disbursements)
CREATE TABLE IF NOT EXISTS public.beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID REFERENCES public.beneficiary_lists(id) ON DELETE SET NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    admission_number VARCHAR(100),
    school_name VARCHAR(255),
    county VARCHAR(100) DEFAULT 'Embu',
    sub_county VARCHAR(100),
    ward VARCHAR(100),
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(100),
    disbursement_amount NUMERIC(12, 2) DEFAULT 0.00,
    disbursement_currency VARCHAR(10) DEFAULT 'Kshs',
    disbursement_date DATE,
    academic_year VARCHAR(50) DEFAULT '2026',
    term VARCHAR(50) DEFAULT 'Term 1',
    status VARCHAR(50) DEFAULT 'Active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON COLUMN public.beneficiaries.disbursement_amount IS 'Disbursed CSR bursary grant amount in Kenyan Shillings (Kshs)';


-- 19. JOBS (Career Vacancies with Kshs Salary Compensation)
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    reference_number VARCHAR(100),
    department VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    job_type VARCHAR(100) DEFAULT 'Full-Time',
    experience_level VARCHAR(100) DEFAULT 'Mid-Level',
    salary_range VARCHAR(100) DEFAULT 'Kshs 45,000 - Kshs 75,000',
    salary_currency VARCHAR(10) DEFAULT 'Kshs',
    application_deadline DATE,
    summary TEXT,
    description TEXT NOT NULL,
    requirements JSONB DEFAULT '[]'::jsonb,
    responsibilities JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'Open',
    applicant_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_urgent BOOLEAN DEFAULT FALSE,
    posted_by VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON COLUMN public.jobs.salary_range IS 'Monthly salary compensation range in Kenyan Shillings (Kshs)';


-- 20. MEDIA LIBRARY (Uploaded Media Assets)
CREATE TABLE IF NOT EXISTS public.media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    mime_type VARCHAR(100),
    file_size_bytes BIGINT,
    folder VARCHAR(100) DEFAULT 'general',
    alt_text VARCHAR(255),
    caption TEXT,
    uploaded_by VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ------------------------------------------------------------------------------
-- STEP 3: MIGRATE DATA FROM OLD TABLES (IF THEY EXIST) BEFORE DROPPING
-- ------------------------------------------------------------------------------

DO $execute_data_migration$
BEGIN
    -- Migrate leads with type 'Pre-Qualification' into public.prequalifications
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'leads') THEN
        INSERT INTO public.prequalifications (full_name, phone, email, details, status, signup_source, requested_amount_currency, monthly_turnover_currency, created_at)
        SELECT 
            COALESCE(full_name, 'Anonymous'),
            COALESCE(phone, ''),
            email,
            details,
            COALESCE(status, 'New'),
            signup_source,
            'Kshs',
            'Kshs',
            created_at
        FROM public.leads
        WHERE type = 'Pre-Qualification'
        ON CONFLICT DO NOTHING;

        -- Migrate leads with type 'Callback' into public.callback_requests
        INSERT INTO public.callback_requests (name, phone, email, interest, preferred_time, status, details, signup_source, created_at)
        SELECT 
            COALESCE(full_name, 'Callback Requester'),
            COALESCE(phone, ''),
            email,
            COALESCE(details->>'interest', 'General Loan Inquiry'),
            COALESCE(details->>'preferredTime', 'Morning (8am - 12pm)'),
            COALESCE(status, 'New'),
            details,
            signup_source,
            created_at
        FROM public.leads
        WHERE type = 'Callback'
        ON CONFLICT DO NOTHING;

        -- Migrate leads with type 'Contact' into public.contact_messages
        INSERT INTO public.contact_messages (name, phone, email, interest, message, status, details, signup_source, created_at)
        SELECT 
            COALESCE(full_name, 'Anonymous'),
            phone,
            email,
            COALESCE(details->>'interest', 'General Inquiry'),
            COALESCE(details->>'message', 'Inquiry submitted via website'),
            COALESCE(status, 'New'),
            details,
            signup_source,
            created_at
        FROM public.leads
        WHERE type = 'Contact'
        ON CONFLICT DO NOTHING;

        -- Migrate leads with type 'Volunteer' into public.volunteer_applications
        INSERT INTO public.volunteer_applications (full_name, phone, email, details, status, created_at)
        SELECT 
            COALESCE(full_name, 'Anonymous'),
            COALESCE(phone, ''),
            email,
            details,
            COALESCE(status, 'New'),
            created_at
        FROM public.leads
        WHERE type = 'Volunteer'
        ON CONFLICT DO NOTHING;

        -- Migrate leads with type 'Partnership' into public.partnership_requests
        INSERT INTO public.partnership_requests (organization_name, contact_person, email, phone, proposal_summary, status, created_at)
        SELECT 
            COALESCE(details->>'orgName', full_name, 'Partner Organization'),
            COALESCE(full_name, 'Contact Person'),
            COALESCE(email, 'info@partner.org'),
            COALESCE(phone, ''),
            COALESCE(details->>'message', 'Partnership proposal'),
            COALESCE(status, 'New'),
            created_at
        FROM public.leads
        WHERE type = 'Partnership'
        ON CONFLICT DO NOTHING;

        -- Migrate leads with type 'Sponsorship' into public.sponsorship_requests
        INSERT INTO public.sponsorship_requests (organization_name, contact_person, email, phone, status, sponsorship_currency, created_at)
        SELECT 
            COALESCE(details->>'orgName', full_name, 'Sponsor Organization'),
            COALESCE(full_name, 'Contact Person'),
            COALESCE(email, 'sponsor@org.com'),
            COALESCE(phone, ''),
            COALESCE(status, 'New'),
            'Kshs',
            created_at
        FROM public.leads
        WHERE type = 'Sponsorship'
        ON CONFLICT DO NOTHING;

        -- Migrate leads with type 'Newsletter' into public.newsletter_subscriptions
        INSERT INTO public.newsletter_subscriptions (email, name, status, created_at)
        SELECT 
            email,
            full_name,
            'Active',
            created_at
        FROM public.leads
        WHERE type = 'Newsletter' AND email IS NOT NULL AND email != ''
        ON CONFLICT (email) DO NOTHING;
    END IF;

    -- Migrate old members table into individual_registrations and group_registrations
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'members') THEN
        -- Individual members (Kshs 2,000 fee)
        INSERT INTO public.individual_registrations (full_name, phone, id_number, county, sub_county, ward, payment_ref, payment_amount, payment_currency, details, status, created_at)
        SELECT 
            COALESCE(full_name, 'Member'),
            COALESCE(phone, ''),
            id_number,
            county,
            sub_county,
            ward,
            payment_ref,
            2000,
            'Kshs',
            details,
            COALESCE(status, 'Submitted'),
            created_at
        FROM public.members
        WHERE registration_type = 'individual' OR registration_type IS NULL
        ON CONFLICT DO NOTHING;

        -- Group members (Kshs fee)
        INSERT INTO public.group_registrations (group_name, representative_name, representative_phone, representative_id_number, county, sub_county, ward, group_members, payment_ref, payment_currency, details, status, created_at)
        SELECT 
            COALESCE(full_name, 'Chama Group'),
            COALESCE(full_name, 'Representative'),
            COALESCE(phone, ''),
            id_number,
            county,
            sub_county,
            ward,
            group_members,
            payment_ref,
            'Kshs',
            details,
            COALESCE(status, 'Submitted'),
            created_at
        FROM public.members
        WHERE registration_type = 'group'
        ON CONFLICT DO NOTHING;
    END IF;

    -- Migrate vacancies table into jobs
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vacancies') THEN
        INSERT INTO public.jobs (title, slug, department, location, description, status, salary_range, salary_currency, created_at)
        SELECT 
            title,
            COALESCE(slug, LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))),
            COALESCE(department, 'General'),
            COALESCE(location, 'Embu'),
            COALESCE(description, 'Job vacancy description'),
            COALESCE(status, 'Open'),
            'Kshs 45,000 - Kshs 75,000',
            'Kshs',
            created_at
        FROM public.vacancies
        ON CONFLICT (slug) DO NOTHING;
    END IF;
END $execute_data_migration$;


-- ------------------------------------------------------------------------------
-- STEP 4: CLEANLY DROP REDUNDANT & DUPLICATE TABLES
-- ------------------------------------------------------------------------------

-- Drop all social media tables
DROP TABLE IF EXISTS public.social_media CASCADE;
DROP TABLE IF EXISTS public.social_links CASCADE;
DROP TABLE IF EXISTS public.social_posts CASCADE;
DROP TABLE IF EXISTS public.social_feeds CASCADE;
DROP TABLE IF EXISTS public.social_accounts CASCADE;
DROP TABLE IF EXISTS public.social CASCADE;

-- Drop obsolete / duplicate form & membership tables
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.members CASCADE;
DROP TABLE IF EXISTS public.contact_inquiries CASCADE;
DROP TABLE IF EXISTS public.membership_registrations CASCADE;
DROP TABLE IF EXISTS public.pre_qualifications CASCADE;

-- Drop redundant career & editorial tables
DROP TABLE IF EXISTS public.vacancies CASCADE;
DROP TABLE IF EXISTS public.careers CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.tags CASCADE;
DROP TABLE IF EXISTS public.article_categories CASCADE;
DROP TABLE IF EXISTS public.article_tags CASCADE;
DROP TABLE IF EXISTS public.article_likes CASCADE;


-- ------------------------------------------------------------------------------
-- STEP 5: ROW LEVEL SECURITY & PERMISSIONS
-- ------------------------------------------------------------------------------

-- Enable RLS on all active tables
ALTER TABLE public.prequalifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.callback_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.individual_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficiary_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Form Ingestion Policies: Allow public anonymous and authenticated users to submit forms
DO $setup_form_policies$
DECLARE
    tbl text;
    form_tables text[] := ARRAY[
        'prequalifications',
        'callback_requests',
        'contact_messages',
        'job_applications',
        'volunteer_applications',
        'partnership_requests',
        'sponsorship_requests',
        'newsletter_subscriptions',
        'individual_registrations',
        'group_registrations'
    ];
BEGIN
    FOREACH tbl IN ARRAY form_tables LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Allow public insert on %I" ON public.%I', tbl, tbl);
        EXECUTE format('CREATE POLICY "Allow public insert on %I" ON public.%I FOR INSERT TO anon, authenticated WITH CHECK (true)', tbl, tbl);

        EXECUTE format('DROP POLICY IF EXISTS "Allow staff select on %I" ON public.%I', tbl, tbl);
        EXECUTE format('CREATE POLICY "Allow staff select on %I" ON public.%I FOR SELECT TO anon, authenticated USING (true)', tbl, tbl);

        EXECUTE format('DROP POLICY IF EXISTS "Allow staff update on %I" ON public.%I', tbl, tbl);
        EXECUTE format('CREATE POLICY "Allow staff update on %I" ON public.%I FOR UPDATE TO authenticated USING (true)', tbl, tbl);

        EXECUTE format('DROP POLICY IF EXISTS "Allow staff delete on %I" ON public.%I', tbl, tbl);
        EXECUTE format('CREATE POLICY "Allow staff delete on %I" ON public.%I FOR DELETE TO authenticated USING (true)', tbl, tbl);
    END LOOP;
END $setup_form_policies$;

-- Public content read policies (Articles, Jobs, Beneficiaries, Comments, Roles)
DROP POLICY IF EXISTS "Allow public select on blog_articles" ON public.blog_articles;
CREATE POLICY "Allow public select on blog_articles" ON public.blog_articles FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Allow staff modify on blog_articles" ON public.blog_articles;
CREATE POLICY "Allow staff modify on blog_articles" ON public.blog_articles FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow public select on jobs" ON public.jobs;
CREATE POLICY "Allow public select on jobs" ON public.jobs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Allow staff modify on jobs" ON public.jobs;
CREATE POLICY "Allow staff modify on jobs" ON public.jobs FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow public select on article_comments" ON public.article_comments;
CREATE POLICY "Allow public select on article_comments" ON public.article_comments FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Allow public insert on article_comments" ON public.article_comments;
CREATE POLICY "Allow public insert on article_comments" ON public.article_comments FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow staff modify on article_comments" ON public.article_comments;
CREATE POLICY "Allow staff modify on article_comments" ON public.article_comments FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow public select on beneficiaries" ON public.beneficiaries;
CREATE POLICY "Allow public select on beneficiaries" ON public.beneficiaries FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Allow staff modify on beneficiaries" ON public.beneficiaries;
CREATE POLICY "Allow staff modify on beneficiaries" ON public.beneficiaries FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow public select on beneficiary_lists" ON public.beneficiary_lists;
CREATE POLICY "Allow public select on beneficiary_lists" ON public.beneficiary_lists FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Allow staff modify on beneficiary_lists" ON public.beneficiary_lists;
CREATE POLICY "Allow staff modify on beneficiary_lists" ON public.beneficiary_lists FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow read on user_roles" ON public.user_roles;
CREATE POLICY "Allow read on user_roles" ON public.user_roles FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Allow modify on user_roles" ON public.user_roles;
CREATE POLICY "Allow modify on user_roles" ON public.user_roles FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow read on user_profiles" ON public.user_profiles;
CREATE POLICY "Allow read on user_profiles" ON public.user_profiles FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Allow modify on user_profiles" ON public.user_profiles;
CREATE POLICY "Allow modify on user_profiles" ON public.user_profiles FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow read on custom_roles" ON public.custom_roles;
CREATE POLICY "Allow read on custom_roles" ON public.custom_roles FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Allow modify on custom_roles" ON public.custom_roles;
CREATE POLICY "Allow modify on custom_roles" ON public.custom_roles FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow read on media_library" ON public.media_library;
CREATE POLICY "Allow read on media_library" ON public.media_library FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Allow modify on media_library" ON public.media_library;
CREATE POLICY "Allow modify on media_library" ON public.media_library FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow read on audit_logs" ON public.audit_logs;
CREATE POLICY "Allow read on audit_logs" ON public.audit_logs FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow insert on audit_logs" ON public.audit_logs;
CREATE POLICY "Allow insert on audit_logs" ON public.audit_logs FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Grant privileges to anon and authenticated roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;


-- ------------------------------------------------------------------------------
-- STEP 6: REALTIME REPLICATION ENABLEMENT
-- ------------------------------------------------------------------------------
DO $enable_realtime_contact$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;
EXCEPTION WHEN OTHERS THEN NULL;
END $enable_realtime_contact$;

DO $enable_realtime_callback$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.callback_requests;
EXCEPTION WHEN OTHERS THEN NULL;
END $enable_realtime_callback$;

DO $enable_realtime_prequals$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.prequalifications;
EXCEPTION WHEN OTHERS THEN NULL;
END $enable_realtime_prequals$;

DO $enable_realtime_individual$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.individual_registrations;
EXCEPTION WHEN OTHERS THEN NULL;
END $enable_realtime_individual$;

DO $enable_realtime_group$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.group_registrations;
EXCEPTION WHEN OTHERS THEN NULL;
END $enable_realtime_group$;

DO $enable_realtime_jobs$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.job_applications;
EXCEPTION WHEN OTHERS THEN NULL;
END $enable_realtime_jobs$;


-- ------------------------------------------------------------------------------
-- VERIFICATION QUERY
-- ------------------------------------------------------------------------------
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
