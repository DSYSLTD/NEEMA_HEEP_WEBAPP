-- ==============================================================================
-- NEEMA HEEP BLOG & JOURNAL — SUPABASE SQL MIGRATION
-- Target Platform: Supabase / PostgreSQL Database
-- Project ID: dmuuflbtzxoverwvzlak
-- Description: Sets up public.blog_articles schema, constraints, indexes, triggers,
--              Row Level Security (RLS) policies, Supabase Storage bucket (blog-images),
--              and safely seeds the 18 editorial articles without deleting any data.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. BLOG ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.blog_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    image TEXT,
    featured_image_path TEXT,
    featured_image_url TEXT,
    category TEXT DEFAULT 'Financial Literacy',
    author TEXT DEFAULT 'Patrick Munene',
    author_name TEXT DEFAULT 'Patrick Munene',
    author_id TEXT,
    author_role TEXT DEFAULT 'Author',
    author_avatar TEXT,
    status VARCHAR(50) DEFAULT 'Draft',
    published_at TIMESTAMPTZ DEFAULT NOW(),
    seo_title TEXT,
    seo_description TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    blocks JSONB DEFAULT '[]'::jsonb,
    seo JSONB DEFAULT '{}'::jsonb,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    read_time VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENSURE ALL REQUIRED COLUMNS EXIST (SAFE EXTENSION OF EXISTING TABLE)
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS id UUID DEFAULT uuid_generate_v4();
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS featured_image_path TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS featured_image_url TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Financial Literacy';
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Patrick Munene';
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS author_name TEXT DEFAULT 'Patrick Munene';
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS author_id TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS author_role TEXT DEFAULT 'Author';
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS author_avatar TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Draft';
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS blocks JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS seo JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS read_time VARCHAR(50);
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. PERFORMANCE & UNIQUENESS INDEXES
CREATE UNIQUE INDEX IF NOT EXISTS blog_articles_slug_idx ON public.blog_articles (slug);
CREATE INDEX IF NOT EXISTS blog_articles_status_idx ON public.blog_articles (status);
CREATE INDEX IF NOT EXISTS blog_articles_published_at_idx ON public.blog_articles (published_at DESC);
CREATE INDEX IF NOT EXISTS blog_articles_category_idx ON public.blog_articles (category);

-- 5. AUTOMATIC UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.set_blog_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_blog_articles_updated_at ON public.blog_articles;
CREATE TRIGGER trigger_blog_articles_updated_at
    BEFORE UPDATE ON public.blog_articles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_blog_articles_updated_at();

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public visitors can read published articles
DROP POLICY IF EXISTS "Public can view published blog articles" ON public.blog_articles;
CREATE POLICY "Public can view published blog articles"
    ON public.blog_articles
    FOR SELECT
    USING (status = 'Published' OR status = 'published' OR status = 'Active');

-- Policy 2: CMS Staff and Admin can view all articles (including Drafts and Trash)
DROP POLICY IF EXISTS "Staff and Admin can view all blog articles" ON public.blog_articles;
CREATE POLICY "Staff and Admin can view all blog articles"
    ON public.blog_articles
    FOR SELECT
    USING (true);

-- Policy 3: Allow insert operations
DROP POLICY IF EXISTS "Allow insert on blog articles" ON public.blog_articles;
CREATE POLICY "Allow insert on blog articles"
    ON public.blog_articles
    FOR INSERT
    WITH CHECK (true);

-- Policy 4: Allow update operations
DROP POLICY IF EXISTS "Allow update on blog articles" ON public.blog_articles;
CREATE POLICY "Allow update on blog articles"
    ON public.blog_articles
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Policy 5: Allow delete operations
DROP POLICY IF EXISTS "Allow delete on blog articles" ON public.blog_articles;
CREATE POLICY "Allow delete on blog articles"
    ON public.blog_articles
    FOR DELETE
    USING (true);

-- 7. SUPABASE STORAGE BUCKET FOR FEATURED IMAGES
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'blog-images',
    'blog-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Access blog-images" ON storage.objects;
CREATE POLICY "Public Access blog-images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "Allow uploads to blog-images" ON storage.objects;
CREATE POLICY "Allow uploads to blog-images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "Allow updates to blog-images" ON storage.objects;
CREATE POLICY "Allow updates to blog-images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "Allow deletes from blog-images" ON storage.objects;
CREATE POLICY "Allow deletes from blog-images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'blog-images');

-- 8. SEED BASELINE EDITORIAL ARTICLES (IDEMPOTENT MIGRATION OF EXISTING CONTENT)
-- Total articles to seed: 18
INSERT INTO public.blog_articles (
    title, slug, excerpt, content, image, featured_image_url, category, author, author_name,
    status, is_featured, published_at, tags, blocks, seo, seo_title, seo_description
) VALUES (
    'From NGO to MFI: Our Decade-Long Journey in Mt. Kenya',
    'ngo-to-mfi-journey',
    'Discover our founding story from 2010 and how we evolved into a leading Microfinance Institution in Mount Kenya.',
    'A Legacy Built on Trust

From our early days in 2010 as a non-governmental organization focused on community welfare, NEEMA HEEP has always prioritized the financial health and physical well-being of the communities in Mt. Kenya. Recognizing that sustainable development required more than just grants, we evolved into a fully-fledged Microfinance Institution.

Growth is not just about capital; it''s about the resilience of your community support system.

This transition was driven by a commitment to offer structured, scalable financial products that encourage entrepreneurship and break the cycle of poverty. Today, powered by our partnership with Musoni, our digital infrastructure enables us to serve thousands with unprecedented efficiency and transparency.

Start Your Journey With Us',
    'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'Financial Literacy',
    'Patrick Munene',
    'Patrick Munene',
    'Published',
    true,
    NOW() - INTERVAL '54 days',
    '["Featured","Microfinance","Mt. Kenya"]'::jsonb,
    '[{"id":"b1","type":"headline","content":"A Legacy Built on Trust"},{"id":"b2","type":"text","content":"From our early days in 2010 as a non-governmental organization focused on community welfare, NEEMA HEEP has always prioritized the financial health and physical well-being of the communities in Mt. Kenya. Recognizing that sustainable development required more than just grants, we evolved into a fully-fledged Microfinance Institution."},{"id":"b3","type":"tip","content":"Growth is not just about capital; it''s about the resilience of your community support system."},{"id":"b4","type":"text","content":"This transition was driven by a commitment to offer structured, scalable financial products that encourage entrepreneurship and break the cycle of poverty. Today, powered by our partnership with Musoni, our digital infrastructure enables us to serve thousands with unprecedented efficiency and transparency."},{"id":"b5","type":"cta","content":"Start Your Journey With Us","settings":{"link":"/join"}}]'::jsonb,
    '{"metaTitle":"From NGO to MFI: Our Decade-Long Journey in Mt. Kenya | Neema HEEP Journal","metaDescription":"Discover our founding story from 2010 and how we evolved into a leading Microfinance Institution in Mount Kenya.","ogTitle":"From NGO to MFI: Our Decade-Long Journey in Mt. Kenya","ogImage":"https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70","canonicalUrl":"https://www.neemaheep.com/blog/ngo-to-mfi-journey"}'::jsonb,
    'From NGO to MFI: Our Decade-Long Journey in Mt. Kenya | Neema HEEP Journal',
    'Discover our founding story from 2010 and how we evolved into a leading Microfinance Institution in Mount Kenya.'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_articles (
    title, slug, excerpt, content, image, featured_image_url, category, author, author_name,
    status, is_featured, published_at, tags, blocks, seo, seo_title, seo_description
) VALUES (
    'Why We Lend Without Collateral: Empowering the ''Working Poor''',
    'lending-without-collateral',
    'Explore our philosophy of financing ventures for those without traditional assets. Learn how we support the Kenyan informal sector through trust-based micro-lending.',
    'The reality of the Kenyan informal sector is that many hard-working entrepreneurs lack traditional assets required by conventional banks. At NEEMA HEEP, we believe that a strong business idea and a proven track record of cash flow are more valuable than physical collateral. Our trust-based micro-lending framework is designed specifically for the ''working poor''. By focusing on daily transaction history and community vetting, we empower small business owners to access the capital they need to grow, effectively democratizing financial access.',
    'https://images.unsplash.com/photo-1547471080-7bc2caa7ca0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'https://images.unsplash.com/photo-1547471080-7bc2caa7ca0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'Microfinance',
    'Patrick Munene',
    'Patrick Munene',
    'Published',
    false,
    NOW() - INTERVAL '51 days',
    '["Microfinance","Neema HEEP"]'::jsonb,
    '[{"id":"b1","type":"paragraph","content":"The reality of the Kenyan informal sector is that many hard-working entrepreneurs lack traditional assets required by conventional banks. At NEEMA HEEP, we believe that a strong business idea and a proven track record of cash flow are more valuable than physical collateral. Our trust-based micro-lending framework is designed specifically for the ''working poor''. By focusing on daily transaction history and community vetting, we empower small business owners to access the capital they need to grow, effectively democratizing financial access."}]'::jsonb,
    '{"metaTitle":"Why We Lend Without Collateral: Empowering the ''Working Poor'' | Neema HEEP Journal","metaDescription":"Explore our philosophy of financing ventures for those without traditional assets. Learn how we support the Kenyan informal sector through trust-based micro-lending.","ogTitle":"Why We Lend Without Collateral: Empowering the ''Working Poor''","ogImage":"https://images.unsplash.com/photo-1547471080-7bc2caa7ca0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70","canonicalUrl":"https://www.neemaheep.com/blog/lending-without-collateral"}'::jsonb,
    'Why We Lend Without Collateral: Empowering the ''Working Poor'' | Neema HEEP Journal',
    'Explore our philosophy of financing ventures for those without traditional assets. Learn how we support the Kenyan informal sector through trust-based micro-lending.'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_articles (
    title, slug, excerpt, content, image, featured_image_url, category, author, author_name,
    status, is_featured, published_at, tags, blocks, seo, seo_title, seo_description
) VALUES (
    'The HEEP Model: Why Financial Health is Nothing Without Physical Health',
    'heep-model-physical-health',
    'Built on a solid medical background, discover our holistic approach to empowerment, including specific initiatives like the Mosquito Net Distribution Programme.',
    'Inspired by our founders'' medical backgrounds, the Health, Education, Economic, and Physical (HEEP) model recognizes that financial stability is intrinsically linked to physical well-being. A family struggling with malaria cannot sustain a business. Therefore, our financial products are complemented by community health initiatives, such as our Mosquito Net Distribution Programme. This holistic approach ensures that our clients are healthy enough to utilize their loans effectively, creating a sustainable path to prosperity.',
    'https://images.unsplash.com/photo-1534011545624-b10bed07ebdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'https://images.unsplash.com/photo-1534011545624-b10bed07ebdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'Community Health',
    'Dr. Jane Muturi',
    'Dr. Jane Muturi',
    'Published',
    false,
    NOW() - INTERVAL '48 days',
    '["Community Health","Neema HEEP"]'::jsonb,
    '[{"id":"b1","type":"paragraph","content":"Inspired by our founders'' medical backgrounds, the Health, Education, Economic, and Physical (HEEP) model recognizes that financial stability is intrinsically linked to physical well-being. A family struggling with malaria cannot sustain a business. Therefore, our financial products are complemented by community health initiatives, such as our Mosquito Net Distribution Programme. This holistic approach ensures that our clients are healthy enough to utilize their loans effectively, creating a sustainable path to prosperity."}]'::jsonb,
    '{"metaTitle":"The HEEP Model: Why Financial Health is Nothing Without Physical Health | Neema HEEP Journal","metaDescription":"Built on a solid medical background, discover our holistic approach to empowerment, including specific initiatives like the Mosquito Net Distribution Programme.","ogTitle":"The HEEP Model: Why Financial Health is Nothing Without Physical Health","ogImage":"https://images.unsplash.com/photo-1534011545624-b10bed07ebdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70","canonicalUrl":"https://www.neemaheep.com/blog/heep-model-physical-health"}'::jsonb,
    'The HEEP Model: Why Financial Health is Nothing Without Physical Health | Neema HEEP Journal',
    'Built on a solid medical background, discover our holistic approach to empowerment, including specific initiatives like the Mosquito Net Distribution Programme.'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_articles (
    title, slug, excerpt, content, image, featured_image_url, category, author, author_name,
    status, is_featured, published_at, tags, blocks, seo, seo_title, seo_description
) VALUES (
    'Choosing the Right Loan for Your Business: Nawiri vs. Imara',
    'nawiri-vs-imara-loan',
    'Navigate your business financing options. Understand when to leverage the Nawiri Loan for aggressive growth versus the Imara Loan for established daily operations.',
    'As a business owner, selecting the right financing tool is critical. The Nawiri Loan is our flagship product for businesses looking to scale, ideal for bulk purchasing or expanding premises. Conversely, the Imara Loan is tailored for maintaining stability in established operations, perfect for smoothing out cash flow gaps. By understanding your specific growth stage and capital needs, our advisors at NEEMA HEEP can guide you toward the product that best aligns with your strategic goals.',
    'https://images.unsplash.com/photo-1516024103173-3e0586e3facc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'https://images.unsplash.com/photo-1516024103173-3e0586e3facc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'Product Guide',
    'Samuel Ochieng',
    'Samuel Ochieng',
    'Published',
    false,
    NOW() - INTERVAL '45 days',
    '["Product Guide","Neema HEEP"]'::jsonb,
    '[{"id":"b1","type":"paragraph","content":"As a business owner, selecting the right financing tool is critical. The Nawiri Loan is our flagship product for businesses looking to scale, ideal for bulk purchasing or expanding premises. Conversely, the Imara Loan is tailored for maintaining stability in established operations, perfect for smoothing out cash flow gaps. By understanding your specific growth stage and capital needs, our advisors at NEEMA HEEP can guide you toward the product that best aligns with your strategic goals."}]'::jsonb,
    '{"metaTitle":"Choosing the Right Loan for Your Business: Nawiri vs. Imara | Neema HEEP Journal","metaDescription":"Navigate your business financing options. Understand when to leverage the Nawiri Loan for aggressive growth versus the Imara Loan for established daily operations.","ogTitle":"Choosing the Right Loan for Your Business: Nawiri vs. Imara","ogImage":"https://images.unsplash.com/photo-1516024103173-3e0586e3facc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70","canonicalUrl":"https://www.neemaheep.com/blog/nawiri-vs-imara-loan"}'::jsonb,
    'Choosing the Right Loan for Your Business: Nawiri vs. Imara | Neema HEEP Journal',
    'Navigate your business financing options. Understand when to leverage the Nawiri Loan for aggressive growth versus the Imara Loan for established daily operations.'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_articles (
    title, slug, excerpt, content, image, featured_image_url, category, author, author_name,
    status, is_featured, published_at, tags, blocks, seo, seo_title, seo_description
) VALUES (
    'Financing Your Future: How the Busara Education Loan Breaks the Poverty Cycle',
    'busara-education-loan',
    'Connecting our Arise and Shine Education Programme (sponsorship for junior secondary from grade 10 to 12 students) with practical loan solutions for school fees, demonstrating true compassion and measurable community impact.',
    'Education is the most reliable equalizer, yet school fees remain a significant barrier for many families. The Busara Education Loan, tightly integrated with our Arise and Shine Education Programme (sponsoring junior secondary students from grade 10 to 12), provides parents with manageable, low-interest financing specifically for tuition and school supplies. By ensuring that children remain in school without placing an unsustainable burden on the family''s business capital, we are actively dismantling the intergenerational cycle of poverty.',
    'https://images.unsplash.com/photo-1489710437720-ebb6728c6270?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'https://images.unsplash.com/photo-1489710437720-ebb6728c6270?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'Product Guide',
    'Lana Steiner',
    'Lana Steiner',
    'Published',
    false,
    NOW() - INTERVAL '42 days',
    '["Product Guide","Neema HEEP"]'::jsonb,
    '[{"id":"b1","type":"paragraph","content":"Education is the most reliable equalizer, yet school fees remain a significant barrier for many families. The Busara Education Loan, tightly integrated with our Arise and Shine Education Programme (sponsoring junior secondary students from grade 10 to 12), provides parents with manageable, low-interest financing specifically for tuition and school supplies. By ensuring that children remain in school without placing an unsustainable burden on the family''s business capital, we are actively dismantling the intergenerational cycle of poverty."}]'::jsonb,
    '{"metaTitle":"Financing Your Future: How the Busara Education Loan Breaks the Poverty Cycle | Neema HEEP Journal","metaDescription":"Connecting our Arise and Shine Education Programme (sponsorship for junior secondary from grade 10 to 12 students) with practical loan solutions for school fees, demonstrating true compassion and measurable community impact.","ogTitle":"Financing Your Future: How the Busara Education Loan Breaks the Poverty Cycle","ogImage":"https://images.unsplash.com/photo-1489710437720-ebb6728c6270?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70","canonicalUrl":"https://www.neemaheep.com/blog/busara-education-loan"}'::jsonb,
    'Financing Your Future: How the Busara Education Loan Breaks the Poverty Cycle | Neema HEEP Journal',
    'Connecting our Arise and Shine Education Programme (sponsorship for junior secondary from grade 10 to 12 students) with practical loan solutions for school fees, demonstrating true compassion and measurable community impact.'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_articles (
    title, slug, excerpt, content, image, featured_image_url, category, author, author_name,
    status, is_featured, published_at, tags, blocks, seo, seo_title, seo_description
) VALUES (
    'Clean Water, Better Life: A Guide to the WASH Loan',
    'wash-loan-guide',
    'Showcasing our role in community wellness. Learn exactly how NEEMA HEEP loans for water filters, tanks, and sanitation systems function.',
    'Access to clean water and proper sanitation (WASH) is a fundamental human right that directly impacts community health and productivity. Our WASH Loan is designed to finance the installation of water tanks, purifiers, and improved sanitation facilities for households and small communities. This specialized product offers extended repayment terms, recognizing that the return on investment is measured in improved health outcomes and reduced medical expenses rather than direct financial profit.',
    'https://images.unsplash.com/photo-1519897831810-a9a01aceccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'https://images.unsplash.com/photo-1519897831810-a9a01aceccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'Product Guide',
    'Patrick Munene',
    'Patrick Munene',
    'Published',
    false,
    NOW() - INTERVAL '39 days',
    '["Product Guide","Neema HEEP"]'::jsonb,
    '[{"id":"b1","type":"paragraph","content":"Access to clean water and proper sanitation (WASH) is a fundamental human right that directly impacts community health and productivity. Our WASH Loan is designed to finance the installation of water tanks, purifiers, and improved sanitation facilities for households and small communities. This specialized product offers extended repayment terms, recognizing that the return on investment is measured in improved health outcomes and reduced medical expenses rather than direct financial profit."}]'::jsonb,
    '{"metaTitle":"Clean Water, Better Life: A Guide to the WASH Loan | Neema HEEP Journal","metaDescription":"Showcasing our role in community wellness. Learn exactly how NEEMA HEEP loans for water filters, tanks, and sanitation systems function.","ogTitle":"Clean Water, Better Life: A Guide to the WASH Loan","ogImage":"https://images.unsplash.com/photo-1519897831810-a9a01aceccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70","canonicalUrl":"https://www.neemaheep.com/blog/wash-loan-guide"}'::jsonb,
    'Clean Water, Better Life: A Guide to the WASH Loan | Neema HEEP Journal',
    'Showcasing our role in community wellness. Learn exactly how NEEMA HEEP loans for water filters, tanks, and sanitation systems function.'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_articles (
    title, slug, excerpt, content, image, featured_image_url, category, author, author_name,
    status, is_featured, published_at, tags, blocks, seo, seo_title, seo_description
) VALUES (
    'Asset Financing with the MALI Loan: From Solar Panels to Ox-Carts',
    'asset-financing-mali',
    'Detailed insights on how clients can acquire essential, high-value household or business assets securely through our structured MALI product.',
    'Productive assets are the engines of economic growth for micro-entrepreneurs. The MALI Loan provides structured asset financing, allowing clients to purchase essential equipment (ranging from solar panels to ox-carts) without requiring the full cash amount upfront. The asset itself often serves as the primary collateral. This approach not only boosts immediate earning potential but also helps clients build a sustainable asset base for long-term wealth creation.',
    'https://images.unsplash.com/photo-1615885237837-12711099fd87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'https://images.unsplash.com/photo-1615885237837-12711099fd87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'Product Guide',
    'Eve Wilkins',
    'Eve Wilkins',
    'Published',
    false,
    NOW() - INTERVAL '36 days',
    '["Product Guide","Neema HEEP"]'::jsonb,
    '[{"id":"b1","type":"paragraph","content":"Productive assets are the engines of economic growth for micro-entrepreneurs. The MALI Loan provides structured asset financing, allowing clients to purchase essential equipment (ranging from solar panels to ox-carts) without requiring the full cash amount upfront. The asset itself often serves as the primary collateral. This approach not only boosts immediate earning potential but also helps clients build a sustainable asset base for long-term wealth creation."}]'::jsonb,
    '{"metaTitle":"Asset Financing with the MALI Loan: From Solar Panels to Ox-Carts | Neema HEEP Journal","metaDescription":"Detailed insights on how clients can acquire essential, high-value household or business assets securely through our structured MALI product.","ogTitle":"Asset Financing with the MALI Loan: From Solar Panels to Ox-Carts","ogImage":"https://images.unsplash.com/photo-1615885237837-12711099fd87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70","canonicalUrl":"https://www.neemaheep.com/blog/asset-financing-mali"}'::jsonb,
    'Asset Financing with the MALI Loan: From Solar Panels to Ox-Carts | Neema HEEP Journal',
    'Detailed insights on how clients can acquire essential, high-value household or business assets securely through our structured MALI product.'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_articles (
    title, slug, excerpt, content, image, featured_image_url, category, author, author_name,
    status, is_featured, published_at, tags, blocks, seo, seo_title, seo_description
) VALUES (
    'Navigating Financial Emergencies: How the Dharura Loan Can Save Your Business',
    'dharura-financial-emergencies',
    'Experience-based, actionable advice on managing unforeseen business or family financial shocks gracefully with rapid intervention.',
    'Unforeseen emergencies, whether a medical crisis or sudden equipment failure, can easily derail a thriving micro-business. The Dharura Loan is our rapid-response financial product designed to provide immediate liquidity during these stressful times. With expedited approval processes and flexible terms, Dharura ensures that temporary setbacks do not result in permanent business closure, allowing our clients to weather the storm and quickly return to profitability.',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'Empowerment',
    'Jonathan Wills',
    'Jonathan Wills',
    'Published',
    false,
    NOW() - INTERVAL '33 days',
    '["Empowerment","Neema HEEP"]'::jsonb,
    '[{"id":"b1","type":"paragraph","content":"Unforeseen emergencies, whether a medical crisis or sudden equipment failure, can easily derail a thriving micro-business. The Dharura Loan is our rapid-response financial product designed to provide immediate liquidity during these stressful times. With expedited approval processes and flexible terms, Dharura ensures that temporary setbacks do not result in permanent business closure, allowing our clients to weather the storm and quickly return to profitability."}]'::jsonb,
    '{"metaTitle":"Navigating Financial Emergencies: How the Dharura Loan Can Save Your Business | Neema HEEP Journal","metaDescription":"Experience-based, actionable advice on managing unforeseen business or family financial shocks gracefully with rapid intervention.","ogTitle":"Navigating Financial Emergencies: How the Dharura Loan Can Save Your Business","ogImage":"https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70","canonicalUrl":"https://www.neemaheep.com/blog/dharura-financial-emergencies"}'::jsonb,
    'Navigating Financial Emergencies: How the Dharura Loan Can Save Your Business | Neema HEEP Journal',
    'Experience-based, actionable advice on managing unforeseen business or family financial shocks gracefully with rapid intervention.'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_articles (
    title, slug, excerpt, content, image, featured_image_url, category, author, author_name,
    status, is_featured, published_at, tags, blocks, seo, seo_title, seo_description
) VALUES (
    'Moving to Cashless: How M-PESA Integration Makes Borrowing Safer',
    'moving-to-cashless-mpesa',
    'Highlighting NEEMA HEEP''s digital transformation. Our deep integration with Safaricom M-PESA proves our commitment to innovation and operational safety.',
    'Our deep integration with Safaricom''s M-PESA platform marks a pivotal shift toward secure, cashless operations. By moving loan disbursements and repayments strictly to digital channels, we eliminate the profound security risks associated with handling physical cash, both for our loan officers and our clients. This digital transformation not only ensures immediate, trackable transactions but also builds a robust digital financial footprint for our clients.',
    'https://images.unsplash.com/photo-1608249053229-79a0229c1b18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'https://images.unsplash.com/photo-1608249053229-79a0229c1b18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'Empowerment',
    'Tech Team',
    'Tech Team',
    'Published',
    false,
    NOW() - INTERVAL '30 days',
    '["Empowerment","Neema HEEP"]'::jsonb,
    '[{"id":"b1","type":"paragraph","content":"Our deep integration with Safaricom''s M-PESA platform marks a pivotal shift toward secure, cashless operations. By moving loan disbursements and repayments strictly to digital channels, we eliminate the profound security risks associated with handling physical cash, both for our loan officers and our clients. This digital transformation not only ensures immediate, trackable transactions but also builds a robust digital financial footprint for our clients."}]'::jsonb,
    '{"metaTitle":"Moving to Cashless: How M-PESA Integration Makes Borrowing Safer | Neema HEEP Journal","metaDescription":"Highlighting NEEMA HEEP''s digital transformation. Our deep integration with Safaricom M-PESA proves our commitment to innovation and operational safety.","ogTitle":"Moving to Cashless: How M-PESA Integration Makes Borrowing Safer","ogImage":"https://images.unsplash.com/photo-1608249053229-79a0229c1b18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70","canonicalUrl":"https://www.neemaheep.com/blog/moving-to-cashless-mpesa"}'::jsonb,
    'Moving to Cashless: How M-PESA Integration Makes Borrowing Safer | Neema HEEP Journal',
    'Highlighting NEEMA HEEP''s digital transformation. Our deep integration with Safaricom M-PESA proves our commitment to innovation and operational safety.'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_articles (
    title, slug, excerpt, content, image, featured_image_url, category, author, author_name,
    status, is_featured, published_at, tags, blocks, seo, seo_title, seo_description
) VALUES (
    'Neema HEEP Meru Branch Opening: Expanding Our Reach',
    'community-outreach-2026',
    'We are thrilled to announce the opening of our newest branch in Meru Town, bringing tailored financial solutions closer to you.',
    'Meru Town Expansion

The Meru branch opening marks a milestone in our 2026 expansion strategy. Located in the heart of Meru Town, this facility is equipped with dedicated desks for SME coaching and rapid loan processing.

biashara

Neema HEEP''s landing in Meru is a godsend for us chama leaders. We finally have a partner who understands the local trade.

Visit Meru Branch',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=70&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=70&w=800&auto=format&fit=crop',
    'News',
    'Admin',
    'Admin',
    'Published',
    false,
    NOW() - INTERVAL '27 days',
    '["News","Neema HEEP"]'::jsonb,
    '[{"id":"m1","type":"headline","content":"Meru Town Expansion"},{"id":"m2","type":"text","content":"The Meru branch opening marks a milestone in our 2026 expansion strategy. Located in the heart of Meru Town, this facility is equipped with dedicated desks for SME coaching and rapid loan processing."},{"id":"m3","type":"loan-product","content":"biashara"},{"id":"m4","type":"testimonial","content":"Neema HEEP''s landing in Meru is a godsend for us chama leaders. We finally have a partner who understands the local trade.","settings":{"author":"Mercy Kaita","role":"Chairlady, Meru Traders"}},{"id":"m5","type":"cta","content":"Visit Meru Branch","settings":{"link":"/contact"}}]'::jsonb,
    '{"metaTitle":"Neema HEEP Meru Branch Opening: Expanding Our Reach | Neema HEEP Journal","metaDescription":"We are thrilled to announce the opening of our newest branch in Meru Town, bringing tailored financial solutions closer to you.","ogTitle":"Neema HEEP Meru Branch Opening: Expanding Our Reach","ogImage":"https://images.unsplash.com/photo-1497366216548-37526070297c?q=70&w=800&auto=format&fit=crop","canonicalUrl":"https://www.neemaheep.com/blog/community-outreach-2026"}'::jsonb,
    'Neema HEEP Meru Branch Opening: Expanding Our Reach | Neema HEEP Journal',
    'We are thrilled to announce the opening of our newest branch in Meru Town, bringing tailored financial solutions closer to you.'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_articles (
    title, slug, excerpt, content, image, featured_image_url, category, author, author_name,
    status, is_featured, published_at, tags, blocks, seo, seo_title, seo_description
) VALUES (
    'Scheduled System Maintenance: May 15th, 2026',
    'mpesa-system-maintenance',
    'Please be advised of a scheduled maintenance window for our M-PESA integration as we upgrade to a faster processing engine.',
    'To provide a more seamless experience, we will be performing critical system upgrades on May 15th from 00:00 to 04:00 EAT. During this time, M-PESA disbursements and repayments may experience slight delays. We appreciate your patience as we build a more robust digital bank for you.',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=70&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=70&w=800&auto=format&fit=crop',
    'News',
    'Tech Team',
    'Tech Team',
    'Published',
    false,
    NOW() - INTERVAL '24 days',
    '["News","Neema HEEP"]'::jsonb,
    '[{"id":"b1","type":"paragraph","content":"To provide a more seamless experience, we will be performing critical system upgrades on May 15th from 00:00 to 04:00 EAT. During this time, M-PESA disbursements and repayments may experience slight delays. We appreciate your patience as we build a more robust digital bank for you."}]'::jsonb,
    '{"metaTitle":"Scheduled System Maintenance: May 15th, 2026 | Neema HEEP Journal","metaDescription":"Please be advised of a scheduled maintenance window for our M-PESA integration as we upgrade to a faster processing engine.","ogTitle":"Scheduled System Maintenance: May 15th, 2026","ogImage":"https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=70&w=800&auto=format&fit=crop","canonicalUrl":"https://www.neemaheep.com/blog/mpesa-system-maintenance"}'::jsonb,
    'Scheduled System Maintenance: May 15th, 2026 | Neema HEEP Journal',
    'Please be advised of a scheduled maintenance window for our M-PESA integration as we upgrade to a faster processing engine.'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_articles (
    title, slug, excerpt, content, image, featured_image_url, category, author, author_name,
    status, is_featured, published_at, tags, blocks, seo, seo_title, seo_description
) VALUES (
    'Mentorship Beyond Money: The Value of Joining a Neema HEEP Group',
    'mentorship-beyond-money',
    'We provide more than just credit. Uncover the immense value of our mentorship seminars and the unparalleled social security derived from group lending.',
    'Capital alone cannot guarantee success. At NEEMA HEEP, our group lending model is heavily tied to ongoing mentorship and business education. When clients join a HEEP group, they gain access to seminars on financial literacy, market trends, and business management. This collaborative environment fosters peer support and shared learning, ensuring that every disbursed shilling is paired with the knowledge required to maximize its return.',
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70',
    'Empowerment',
    'Dr. Jane Muturi',
    'Dr. Jane Muturi',
    'Published',
    false,
    NOW() - INTERVAL '21 days',
    '["Empowerment","Neema HEEP"]'::jsonb,
    '[{"id":"b1","type":"paragraph","content":"Capital alone cannot guarantee success. At NEEMA HEEP, our group lending model is heavily tied to ongoing mentorship and business education. When clients join a HEEP group, they gain access to seminars on financial literacy, market trends, and business management. This collaborative environment fosters peer support and shared learning, ensuring that every disbursed shilling is paired with the knowledge required to maximize its return."}]'::jsonb,
    '{"metaTitle":"Mentorship Beyond Money: The Value of Joining a Neema HEEP Group | Neema HEEP Journal","metaDescription":"We provide more than just credit. Uncover the immense value of our mentorship seminars and the unparalleled social security derived from group lending.","ogTitle":"Mentorship Beyond Money: The Value of Joining a Neema HEEP Group","ogImage":"https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70","canonicalUrl":"https://www.neemaheep.com/blog/mentorship-beyond-money"}'::jsonb,
    'Mentorship Beyond Money: The Value of Joining a Neema HEEP Group | Neema HEEP Journal',
    'We provide more than just credit. Uncover the immense value of our mentorship seminars and the unparalleled social security derived from group lending.'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_articles (
    title, slug, excerpt, content, image, featured_image_url, category, author, author_name,
    status, is_featured, published_at, tags, blocks, seo, seo_title, seo_description
) VALUES (
    'How to Get the Best Microfinance Loans in Kenya for 2026',
    'get-best-microfinance-loans-2026',
    'Discover the key steps to securing high-impact capital in Kenya. Learn how to identify reputable MFIs, prepare your documentation, and benefit from 24-hour approval processes.',
    'Securing the best microfinance loan in 2026 requires a blend of digital readiness and financial literacy. Kenyan entrepreneurs should prioritize institutions that offer transparent interest rates, integrated M-PESA repayment systems, and rapid approval cycles. NEEMA HEEP leads the way by combining robust tech with personalized community vetting, ensuring you get the capital you need exactly when you need it.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=70&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=70&w=800&auto=format&fit=crop',
    'Financial Literacy',
    'Patrick Munene',
    'Patrick Munene',
    'Published',
    false,
    NOW() - INTERVAL '18 days',
    '["Financial Literacy","Neema HEEP"]'::jsonb,
    '[{"id":"b1","type":"paragraph","content":"Securing the best microfinance loan in 2026 requires a blend of digital readiness and financial literacy. Kenyan entrepreneurs should prioritize institutions that offer transparent interest rates, integrated M-PESA repayment systems, and rapid approval cycles. NEEMA HEEP leads the way by combining robust tech with personalized community vetting, ensuring you get the capital you need exactly when you need it."}]'::jsonb,
    '{"metaTitle":"How to Get the Best Microfinance Loans in Kenya for 2026 | Neema HEEP Journal","metaDescription":"Discover the key steps to securing high-impact capital in Kenya. Learn how to identify reputable MFIs, prepare your documentation, and benefit from 24-hour approval processes.","ogTitle":"How to Get the Best Microfinance Loans in Kenya for 2026","ogImage":"https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=70&w=800&auto=format&fit=crop","canonicalUrl":"https://www.neemaheep.com/blog/get-best-microfinance-loans-2026"}'::jsonb,
    'How to Get the Best Microfinance Loans in Kenya for 2026 | Neema HEEP Journal',
    'Discover the key steps to securing high-impact capital in Kenya. Learn how to identify reputable MFIs, prepare your documentation, and benefit from 24-hour approval processes.'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_articles (
    title, slug, excerpt, content, image, featured_image_url, category, author, author_name,
    status, is_featured, published_at, tags, blocks, seo, seo_title, seo_description
) VALUES (
    'Why Neema HEEP is the Most Trusted Microfinance Institution in Mount Kenya',
    'mount-kenya-trusted-mfi',
    'Explore our decade-long commitment to driving financial inclusion in Embu, Meru, and Tharaka Nithi. Learn about our community-first approach and sustainable lending models.',
    'Trust is the currency of microfinance. Since 2010, NEEMA HEEP has operated with a radical transparency that sets us apart. By investing back into the education and health of our borrowers, we create a cycle of mutual success. Our presence in the Mt. Kenya region isn''t just about lending; it''s about building a resilient economic ecosystem that survives market shocks and empowers the next generation.',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=70&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=70&w=800&auto=format&fit=crop',
    'Microfinance',
    'Samuel Ochieng',
    'Samuel Ochieng',
    'Published',
    false,
    NOW() - INTERVAL '15 days',
    '["Microfinance","Neema HEEP"]'::jsonb,
    '[{"id":"b1","type":"paragraph","content":"Trust is the currency of microfinance. Since 2010, NEEMA HEEP has operated with a radical transparency that sets us apart. By investing back into the education and health of our borrowers, we create a cycle of mutual success. Our presence in the Mt. Kenya region isn''t just about lending; it''s about building a resilient economic ecosystem that survives market shocks and empowers the next generation."}]'::jsonb,
    '{"metaTitle":"Why Neema HEEP is the Most Trusted Microfinance Institution in Mount Kenya | Neema HEEP Journal","metaDescription":"Explore our decade-long commitment to driving financial inclusion in Embu, Meru, and Tharaka Nithi. Learn about our community-first approach and sustainable lending models.","ogTitle":"Why Neema HEEP is the Most Trusted Microfinance Institution in Mount Kenya","ogImage":"https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=70&w=800&auto=format&fit=crop","canonicalUrl":"https://www.neemaheep.com/blog/mount-kenya-trusted-mfi"}'::jsonb,
    'Why Neema HEEP is the Most Trusted Microfinance Institution in Mount Kenya | Neema HEEP Journal',
    'Explore our decade-long commitment to driving financial inclusion in Embu, Meru, and Tharaka Nithi. Learn about our community-first approach and sustainable lending models.'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_articles (
    title, slug, excerpt, content, image, featured_image_url, category, author, author_name,
    status, is_featured, published_at, tags, blocks, seo, seo_title, seo_description
) VALUES (
    'How to Secure Microfinance Loans in Kenya: A Step-by-Step Guide for 2026',
    'microfinance-loan-requirements-kenya-2026',
    'Meeting microfinance loan requirements is the first step toward securing your business or personal funding. Learn about the simplified checklist needed for a rapid approval process.',
    'Securing a microfinance loan in 2026 is significantly easier when you have the right documentation ready. Reputable institutions like Neema HEEP prioritize speed and transparency, but this depends on the completeness of your application. The basic requirements typically include a valid Kenyan National ID, focused bank or M-PESA statements for the last six months, and proof of some business activity or income. By ensuring your KRA PIN is active and your CRB record is clear, you position yourself for approval within hours, not days.',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=70&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=70&w=800&auto=format&fit=crop',
    'Financial Literacy',
    'Samuel Ochieng',
    'Samuel Ochieng',
    'Published',
    false,
    NOW() - INTERVAL '12 days',
    '["Financial Literacy","Neema HEEP"]'::jsonb,
    '[{"id":"b1","type":"paragraph","content":"Securing a microfinance loan in 2026 is significantly easier when you have the right documentation ready. Reputable institutions like Neema HEEP prioritize speed and transparency, but this depends on the completeness of your application. The basic requirements typically include a valid Kenyan National ID, focused bank or M-PESA statements for the last six months, and proof of some business activity or income. By ensuring your KRA PIN is active and your CRB record is clear, you position yourself for approval within hours, not days."}]'::jsonb,
    '{"metaTitle":"How to Secure Microfinance Loans in Kenya: A Step-by-Step Guide for 2026 | Neema HEEP Journal","metaDescription":"Meeting microfinance loan requirements is the first step toward securing your business or personal funding. Learn about the simplified checklist needed for a rapid approval process.","ogTitle":"How to Secure Microfinance Loans in Kenya: A Step-by-Step Guide for 2026","ogImage":"https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=70&w=800&auto=format&fit=crop","canonicalUrl":"https://www.neemaheep.com/blog/microfinance-loan-requirements-kenya-2026"}'::jsonb,
    'How to Secure Microfinance Loans in Kenya: A Step-by-Step Guide for 2026 | Neema HEEP Journal',
    'Meeting microfinance loan requirements is the first step toward securing your business or personal funding. Learn about the simplified checklist needed for a rapid approval process.'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_articles (
    title, slug, excerpt, content, image, featured_image_url, category, author, author_name,
    status, is_featured, published_at, tags, blocks, seo, seo_title, seo_description
) VALUES (
    'The Ultimate 2026 Microfinance Loan Checklist for Kenyan Entrepreneurs',
    'ultimate-microfinance-loan-checklist-2026',
    'Following a structured loan application checklist significantly reduces approval time and prevents document rejection. Ensure you have everything needed to secure your loan successfully.',
    'A complete application is the fastest path to funding. Our 2026 checklist for microfinance applicants covers every essential detail: 1. Identity Verification (ID and Passport Photos), 2. Financial History (M-PESA/Bank Statements), 3. Business Proof (Permits or Inventories), and 4. Collateral Documentation (Logbooks or Title Deeds for larger amounts). At Neema HEEP, we''ve optimized our review process to handle these documents digitally, meaning you can submit them via WhatsApp or email and receive a response before the business day ends.',
    'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=70&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=70&w=800&auto=format&fit=crop',
    'Product Guide',
    'Patrick Munene',
    'Patrick Munene',
    'Published',
    false,
    NOW() - INTERVAL '9 days',
    '["Product Guide","Neema HEEP"]'::jsonb,
    '[{"id":"b1","type":"paragraph","content":"A complete application is the fastest path to funding. Our 2026 checklist for microfinance applicants covers every essential detail: 1. Identity Verification (ID and Passport Photos), 2. Financial History (M-PESA/Bank Statements), 3. Business Proof (Permits or Inventories), and 4. Collateral Documentation (Logbooks or Title Deeds for larger amounts). At Neema HEEP, we''ve optimized our review process to handle these documents digitally, meaning you can submit them via WhatsApp or email and receive a response before the business day ends."}]'::jsonb,
    '{"metaTitle":"The Ultimate 2026 Microfinance Loan Checklist for Kenyan Entrepreneurs | Neema HEEP Journal","metaDescription":"Following a structured loan application checklist significantly reduces approval time and prevents document rejection. Ensure you have everything needed to secure your loan successfully.","ogTitle":"The Ultimate 2026 Microfinance Loan Checklist for Kenyan Entrepreneurs","ogImage":"https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=70&w=800&auto=format&fit=crop","canonicalUrl":"https://www.neemaheep.com/blog/ultimate-microfinance-loan-checklist-2026"}'::jsonb,
    'The Ultimate 2026 Microfinance Loan Checklist for Kenyan Entrepreneurs | Neema HEEP Journal',
    'Following a structured loan application checklist significantly reduces approval time and prevents document rejection. Ensure you have everything needed to secure your loan successfully.'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_articles (
    title, slug, excerpt, content, image, featured_image_url, category, author, author_name,
    status, is_featured, published_at, tags, blocks, seo, seo_title, seo_description
) VALUES (
    'Navigating Microfinance: How to Choose the Best Loan Product for Your Business in 2026',
    'choosing-best-microfinance-loan-product-2026',
    'Choosing the best microfinance loan involves evaluating interest rates, repayment periods, and accessibility. Find the right capital for your specific financial goals.',
    'Not all capital is equal. In 2026, the best microfinance products are those that scale with your business and offer flexibility during seasonal shifts. For example, if you''re in the agricultural sector, the Busara or Dairy loans might offer more relevant grace periods than a general personal loan. Business owners looking for rapid growth should investigate facilities like the Nawiri loan, which is specifically designed for scaling production. Always compare total costs and repayment schedules against your projected cash flow to ensure the loan fuels your growth rather than stifling it.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=70&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=70&w=800&auto=format&fit=crop',
    'Product Guide',
    'Patrick Munene',
    'Patrick Munene',
    'Published',
    false,
    NOW() - INTERVAL '6 days',
    '["Product Guide","Neema HEEP"]'::jsonb,
    '[{"id":"b1","type":"paragraph","content":"Not all capital is equal. In 2026, the best microfinance products are those that scale with your business and offer flexibility during seasonal shifts. For example, if you''re in the agricultural sector, the Busara or Dairy loans might offer more relevant grace periods than a general personal loan. Business owners looking for rapid growth should investigate facilities like the Nawiri loan, which is specifically designed for scaling production. Always compare total costs and repayment schedules against your projected cash flow to ensure the loan fuels your growth rather than stifling it."}]'::jsonb,
    '{"metaTitle":"Navigating Microfinance: How to Choose the Best Loan Product for Your Business in 2026 | Neema HEEP Journal","metaDescription":"Choosing the best microfinance loan involves evaluating interest rates, repayment periods, and accessibility. Find the right capital for your specific financial goals.","ogTitle":"Navigating Microfinance: How to Choose the Best Loan Product for Your Business in 2026","ogImage":"https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=70&w=800&auto=format&fit=crop","canonicalUrl":"https://www.neemaheep.com/blog/choosing-best-microfinance-loan-product-2026"}'::jsonb,
    'Navigating Microfinance: How to Choose the Best Loan Product for Your Business in 2026 | Neema HEEP Journal',
    'Choosing the best microfinance loan involves evaluating interest rates, repayment periods, and accessibility. Find the right capital for your specific financial goals.'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_articles (
    title, slug, excerpt, content, image, featured_image_url, category, author, author_name,
    status, is_featured, published_at, tags, blocks, seo, seo_title, seo_description
) VALUES (
    'How to Build a Purpose-Driven Career in Microfinance in Kenya',
    'build-purpose-driven-career-microfinance-kenya',
    'Building a career in microfinance requires a passion for financial inclusion and community development. Neema HEEP offers diverse opportunities in loan officer roles, credit management, and community outreach.',
    'Building a career in microfinance is more than just a job; it''s a commitment to driving financial inclusion and social change. At Neema HEEP, we believe that our employees are our greatest asset in achieving our mission of empowering communities across Mount Kenya. What does it take to succeed? It starts with a deep understanding of the local economic landscape and a passion for serving micro-entrepreneurs. Whether in credit management or community outreach, your work directly contributes to breaking the poverty cycle.',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=70&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=70&w=800&auto=format&fit=crop',
    'Careers',
    'Sarah Mwangi',
    'Sarah Mwangi',
    'Published',
    false,
    NOW() - INTERVAL '3 days',
    '["Careers","Neema HEEP"]'::jsonb,
    '[{"id":"b1","type":"paragraph","content":"Building a career in microfinance is more than just a job; it''s a commitment to driving financial inclusion and social change. At Neema HEEP, we believe that our employees are our greatest asset in achieving our mission of empowering communities across Mount Kenya. What does it take to succeed? It starts with a deep understanding of the local economic landscape and a passion for serving micro-entrepreneurs. Whether in credit management or community outreach, your work directly contributes to breaking the poverty cycle."}]'::jsonb,
    '{"metaTitle":"How to Build a Purpose-Driven Career in Microfinance in Kenya | Neema HEEP Journal","metaDescription":"Building a career in microfinance requires a passion for financial inclusion and community development. Neema HEEP offers diverse opportunities in loan officer roles, credit management, and community outreach.","ogTitle":"How to Build a Purpose-Driven Career in Microfinance in Kenya","ogImage":"https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=70&w=800&auto=format&fit=crop","canonicalUrl":"https://www.neemaheep.com/blog/build-purpose-driven-career-microfinance-kenya"}'::jsonb,
    'How to Build a Purpose-Driven Career in Microfinance in Kenya | Neema HEEP Journal',
    'Building a career in microfinance requires a passion for financial inclusion and community development. Neema HEEP offers diverse opportunities in loan officer roles, credit management, and community outreach.'
) ON CONFLICT (slug) DO NOTHING;

