-- ==============================================================================
-- NEEMA HEEP ARISE & SHINE EDUCATION PROGRAMME
-- DATABASE SETUP AND SEED SCRIPT FOR BENEFICIARIES
-- Target Platform: Supabase / PostgreSQL Database
-- Description: Creates beneficiary_lists and beneficiaries tables with
--              Row Level Security (RLS), privacy masking triggers, and full seed data.
-- ==============================================================================

-- 1. EXTENSIONS SETUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE ANNUAL BENEFICIARY LISTS TABLE
CREATE TABLE IF NOT EXISTS public.beneficiary_lists (
    id TEXT PRIMARY KEY,
    year VARCHAR(10) NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'Published' CHECK (status IN ('Draft', 'Published', 'Archived')),
    year_identifier VARCHAR(50) NOT NULL UNIQUE,
    created_by TEXT DEFAULT 'Neema HEEP Education Board',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE BENEFICIARIES TABLE
CREATE TABLE IF NOT EXISTS public.beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id TEXT REFERENCES public.beneficiary_lists(id) ON DELETE CASCADE,
    serial_number INTEGER NOT NULL,
    full_name TEXT NOT NULL,
    masked_name TEXT,
    school TEXT NOT NULL,
    year VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Draft', 'Graduated', 'Archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_cohort_beneficiary UNIQUE (list_id, full_name)
);

-- 4. PRIVACY ENFORCEMENT TRIGGER FOR AUTOMATIC MASKING
CREATE OR REPLACE FUNCTION public.mask_beneficiary_name_func()
RETURNS TRIGGER AS $$
DECLARE
    clean_text TEXT;
    parts TEXT[];
    first_name TEXT;
    subsequent TEXT[];
    masked_part TEXT;
    i INT;
BEGIN
    IF NEW.masked_name IS NULL OR NEW.masked_name = '' THEN
        clean_text := TRIM(NEW.full_name);
        parts := regexp_split_to_array(clean_text, '\s+');
        
        IF array_length(parts, 1) IS NULL OR array_length(parts, 1) <= 1 THEN
            NEW.masked_name := SUBSTRING(parts[1] FROM 1 FOR 1) || '*****';
        ELSE
            first_name := parts[1];
            subsequent := '{}';
            FOR i IN 2..array_length(parts, 1) LOOP
                masked_part := SUBSTRING(parts[i] FROM 1 FOR 1) || '*****';
                subsequent := array_append(subsequent, masked_part);
            END LOOP;
            NEW.masked_name := first_name || ' ' || array_to_string(subsequent, ' ');
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_mask_beneficiary_name ON public.beneficiaries;
CREATE TRIGGER trigger_mask_beneficiary_name
    BEFORE INSERT OR UPDATE ON public.beneficiaries
    FOR EACH ROW
    EXECUTE FUNCTION public.mask_beneficiary_name_func();

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.beneficiary_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES FOR PUBLIC & ADMIN ACCESS
DROP POLICY IF EXISTS "Public read published beneficiary lists" ON public.beneficiary_lists;
CREATE POLICY "Public read published beneficiary lists"
    ON public.beneficiary_lists FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public read active beneficiaries" ON public.beneficiaries;
CREATE POLICY "Public read active beneficiaries"
    ON public.beneficiaries FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Enable all write operations for authenticated users" ON public.beneficiary_lists;
CREATE POLICY "Enable all write operations for authenticated users"
    ON public.beneficiary_lists FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all write operations for beneficiaries" ON public.beneficiaries;
CREATE POLICY "Enable all write operations for beneficiaries"
    ON public.beneficiaries FOR ALL
    USING (true)
    WITH CHECK (true);

-- 7. INDEXES FOR HIGH-PERFORMANCE QUERIES
CREATE INDEX IF NOT EXISTS idx_beneficiaries_year ON public.beneficiaries(year);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_school ON public.beneficiaries(school);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_list_id ON public.beneficiaries(list_id);
CREATE INDEX IF NOT EXISTS idx_beneficiary_lists_year ON public.beneficiary_lists(year);

-- ==============================================================================
-- 8. SEED ANNUAL BENEFICIARY LISTS (COHORTS 2011 - 2026)
-- ==============================================================================
INSERT INTO public.beneficiary_lists (id, year, title, description, status, year_identifier)
VALUES
('list_2026', '2026', 'Arise & Shine Beneficiaries - Selected 2026', 'Selected high school beneficiaries in 2026 cohort under Neema HEEP.', 'Published', 'NH-BEN-2026'),
('list_2025', '2025', 'Arise & Shine Beneficiaries - Selected 2025', 'High school scholarship beneficiaries selected in 2025 across Embu County.', 'Published', 'NH-BEN-2025'),
('list_2024', '2024', 'Arise & Shine Beneficiaries - Selected 2024', 'High school scholarship beneficiaries selected in 2024 across Embu County.', 'Published', 'NH-BEN-2024'),
('list_2023', '2023', 'Arise & Shine Beneficiaries - Selected 2023', 'High school scholarship beneficiaries selected in 2023.', 'Published', 'NH-BEN-2023'),
('list_2022', '2022', 'Arise & Shine Beneficiaries - Selected 2022', 'High school scholarship beneficiaries selected in 2022.', 'Published', 'NH-BEN-2022'),
('list_2021', '2021', 'Arise & Shine Beneficiaries - Selected 2021', 'High school scholarship beneficiaries selected in 2021.', 'Published', 'NH-BEN-2021'),
('list_2020', '2020', 'Arise & Shine Beneficiaries - Selected 2020', 'High school scholarship beneficiaries selected in 2020.', 'Published', 'NH-BEN-2020'),
('list_2017', '2017', 'Arise & Shine Beneficiaries - Selected 2017', 'Form 1 high school students selected in January 2017.', 'Published', 'NH-BEN-2017'),
('list_2016', '2016', 'Arise & Shine Beneficiaries - Selected 2016', 'Form 1 students added to the program in 2016.', 'Published', 'NH-BEN-2016'),
('list_2015', '2015', 'Arise & Shine Beneficiaries - Selected 2015', 'Form 1 students joining the program in 2015.', 'Published', 'NH-BEN-2015'),
('list_2014', '2014', 'Arise & Shine Beneficiaries - Selected 2014', 'High school students supported under the 2014 intake.', 'Published', 'NH-BEN-2014'),
('list_2011', '2011', 'Arise & Shine Beneficiaries - Selected 2011', 'The inauguration cohort of Neema HEEP Arise & Shine Education Programme.', 'Published', 'NH-BEN-2011')
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status;

-- ==============================================================================
-- 9. SEED INDIVIDUAL BENEFICIARY RECORDS
-- ==============================================================================

-- Clear existing records to prevent duplicates upon re-run
DELETE FROM public.beneficiaries WHERE list_id IN (
    'list_2026', 'list_2025', 'list_2024', 'list_2023', 'list_2022',
    'list_2021', 'list_2020', 'list_2017', 'list_2016', 'list_2015',
    'list_2014', 'list_2011'
);

INSERT INTO public.beneficiaries (list_id, serial_number, full_name, masked_name, school, year, status)
VALUES
-- 2026 COHORT (Cleaned & De-duplicated - 5 Scholars)
('list_2026', 1, 'LINET WENDO NJOGU', 'LINET W***** N*****', 'ST. ANNE''S KIRIARI GIRLS HIGH SCHOOL', '2026', 'Active'),
('list_2026', 2, 'MARY NDUKU', 'MARY N*****', 'ST. ANNE''S KIRIARI GIRLS HIGH SCHOOL', '2026', 'Active'),
('list_2026', 3, 'DORCAS MAKENA MUTHONI', 'DORCAS M***** M*****', 'ST. ANNE''S KIRIARI GIRLS HIGH SCHOOL', '2026', 'Active'),
('list_2026', 4, 'DENNIS MUGENDI', 'DENNIS M*****', 'NGUVIU BOYS HIGH SCHOOL', '2026', 'Active'),
('list_2026', 5, 'MERCY NJERI', 'MERCY N*****', 'KYENI GIRLS HIGH SCHOOL', '2026', 'Active'),

-- 2025 COHORT
('list_2025', 1, 'FAITH MUTHOI KARIUKI', 'FAITH M***** K*****', 'KANGARU GIRLS HIGH SCHOOL', '2025', 'Active'),
('list_2025', 2, 'FRANCIS MURIMI WAWERU', 'FRANCIS M***** W*****', 'KANGARU SCHOOL EMBU', '2025', 'Active'),
('list_2025', 3, 'AGNES WANGARI MURIITHI', 'AGNES W***** M*****', 'ST. ANNE''S KIRIARI GIRLS HIGH SCHOOL', '2025', 'Active'),
('list_2025', 4, 'BRIAN MUNENE NJERU', 'BRIAN M***** N*****', 'MOI HIGH SCHOOL MBIRURI', '2025', 'Active'),
('list_2025', 5, 'GRACE WAITHIRA MBOGO', 'GRACE W***** M*****', 'KYENI GIRLS HIGH SCHOOL', '2025', 'Active'),
('list_2025', 6, 'SHADRACK KIPCHUMBA', 'SHADRACK K*****', 'NGUVIU BOYS HIGH SCHOOL', '2025', 'Active'),
('list_2025', 7, 'CAROLINE MAKENA KIMANI', 'CAROLINE M***** K*****', 'SIAKAGO GIRLS HIGH SCHOOL', '2025', 'Active'),

-- 2024 COHORT
('list_2024', 1, 'LORNA WAIRIMU', 'LORNA W*****', 'KANGARU GIRLS HIGH SCHOOL', '2024', 'Active'),
('list_2024', 2, 'JOYCE WAWIRA', 'JOYCE W*****', 'ST. ANNE''S KIRIARI GIRLS HIGH SCHOOL', '2024', 'Active'),
('list_2024', 3, 'KELVIN KIMANZI', 'KELVIN K*****', 'KANGARU SCHOOL EMBU', '2024', 'Active'),
('list_2024', 4, 'EVELYN WAMBUI NJERU', 'EVELYN W***** N*****', 'NGUVIU GIRLS HIGH SCHOOL', '2024', 'Active'),
('list_2024', 5, 'ISAAC MUKUNDI KARIUKI', 'ISAAC M***** K*****', 'MOI HIGH SCHOOL MBIRURI', '2024', 'Active'),
('list_2024', 6, 'BRENDA MWENDE MUTHONI', 'BRENDA M***** M*****', 'KYENI GIRLS HIGH SCHOOL', '2024', 'Active'),
('list_2024', 7, 'PAUL NDWIGA', 'PAUL N*****', 'SIAKAGO BOYS HIGH SCHOOL', '2024', 'Active'),

-- 2023 COHORT
('list_2023', 1, 'CHRISTINE MURUGI NJUE', 'CHRISTINE M***** N*****', 'KANGARU GIRLS HIGH SCHOOL', '2023', 'Active'),
('list_2023', 2, 'VICTOR MUGAMBI WANYAGA', 'VICTOR M***** W*****', 'KANGARU SCHOOL EMBU', '2023', 'Active'),
('list_2023', 3, 'DIANA MUTHONI MURIUKI', 'DIANA M***** M*****', 'ST. ANNE''S KIRIARI GIRLS HIGH SCHOOL', '2023', 'Active'),
('list_2023', 4, 'PETER MWANGI MBOGO', 'PETER M***** M*****', 'NGUVIU BOYS HIGH SCHOOL', '2023', 'Active'),
('list_2023', 5, 'BENJAMIN KINOTI', 'BENJAMIN K*****', 'MOI HIGH SCHOOL MBIRURI', '2023', 'Active'),

-- 2022 COHORT
('list_2022', 1, 'ESTHER WANGUCI GICHOBI', 'ESTHER W***** G*****', 'KYENI GIRLS HIGH SCHOOL', '2022', 'Active'),
('list_2022', 2, 'JOSEPH MURIITHI KARIUKI', 'JOSEPH M***** K*****', 'KANGARU SCHOOL EMBU', '2022', 'Active'),
('list_2022', 3, 'MIRIAM MUTHONI KINYUA', 'MIRIAM M***** K*****', 'NGUVIU GIRLS HIGH SCHOOL', '2022', 'Active'),
('list_2022', 4, 'SAMUEL NJERU NYAGA', 'SAMUEL N***** N*****', 'SIAKAGO BOYS HIGH SCHOOL', '2022', 'Active'),

-- 2021 COHORT
('list_2021', 1, 'HARRIET WAMBUI KAMAU', 'HARRIET W***** K*****', 'KANGARU GIRLS HIGH SCHOOL', '2021', 'Active'),
('list_2021', 2, 'DANIEL KIMANTHI MWANGI', 'DANIEL K***** M*****', 'KANGARU SCHOOL EMBU', '2021', 'Active'),
('list_2021', 3, 'FLORENCE NJOKI', 'FLORENCE N*****', 'ST. ANNE''S KIRIARI GIRLS HIGH SCHOOL', '2021', 'Active'),
('list_2021', 4, 'DENNIS NJERU MUTEGI', 'DENNIS N***** M*****', 'NGUVIU BOYS HIGH SCHOOL', '2021', 'Active'),

-- 2020 COHORT
('list_2020', 1, 'MERCY WANGARI MUNENE', 'MERCY W***** M*****', 'KANGARU GIRLS HIGH SCHOOL', '2020', 'Active'),
('list_2020', 2, 'JOHN MUGENDI KARIUKI', 'JOHN M***** K*****', 'KANGARU SCHOOL EMBU', '2020', 'Active'),
('list_2020', 3, 'BEATRICE MUTHOI', 'BEATRICE M*****', 'NGUVIU GIRLS HIGH SCHOOL', '2020', 'Active'),

-- 2017 COHORT
('list_2017', 1, 'KEVIN MURIUKI', 'KEVIN M*****', 'KANGARU SCHOOL EMBU', '2017', 'Active'),
('list_2017', 2, 'RACHAEL WANGARI', 'RACHAEL W*****', 'ST. ANNE''S KIRIARI GIRLS HIGH SCHOOL', '2017', 'Active'),
('list_2017', 3, 'ANTHONY MUKUNDI', 'ANTHONY M*****', 'NGUVIU BOYS HIGH SCHOOL', '2017', 'Active'),

-- 2016 COHORT
('list_2016', 1, 'EUNICE NJOKI MBOGO', 'EUNICE N***** M*****', 'KANGARU GIRLS HIGH SCHOOL', '2016', 'Active'),
('list_2016', 2, 'MARTIN KARIUKI NJERU', 'MARTIN K***** N*****', 'KANGARU SCHOOL EMBU', '2016', 'Active'),
('list_2016', 3, 'JAMES MUGENDI', 'JAMES M*****', 'MOI HIGH SCHOOL MBIRURI', '2016', 'Active'),

-- 2015 COHORT
('list_2015', 1, 'PATRICIA WANGARI', 'PATRICIA W*****', 'KYENI GIRLS HIGH SCHOOL', '2015', 'Active'),
('list_2015', 2, 'STEPHEN MURIITHI', 'STEPHEN M*****', 'KANGARU SCHOOL EMBU', '2015', 'Active'),
('list_2015', 3, 'EDWIN NYAGA', 'EDWIN N*****', 'NGUVIU BOYS HIGH SCHOOL', '2015', 'Active'),
('list_2015', 4, 'CECILIA MAKENA', 'CECILIA M*****', 'ST. ANNE''S KIRIARI GIRLS HIGH SCHOOL', '2015', 'Active'),

-- 2014 COHORT
('list_2014', 1, 'GEORGE MUKUNDI', 'GEORGE M*****', 'KANGARU SCHOOL EMBU', '2014', 'Active'),
('list_2014', 2, 'MARY WANJIKU', 'MARY W*****', 'KANGARU GIRLS HIGH SCHOOL', '2014', 'Active'),
('list_2014', 3, 'SIMON KARIUKI', 'SIMON K*****', 'NGUVIU BOYS HIGH SCHOOL', '2014', 'Active'),

-- 2011 INAUGURAL COHORT
('list_2011', 1, 'MOSES NJERU', 'MOSES N*****', 'KANGARU SCHOOL EMBU', '2011', 'Active'),
('list_2011', 2, 'JANE MUTHONI', 'JANE M*****', 'ST. ANNE''S KIRIARI GIRLS HIGH SCHOOL', '2011', 'Active');

-- VERIFY RECORD COUNTS
SELECT b.year, l.title, COUNT(b.id) AS total_beneficiaries
FROM public.beneficiary_lists l
LEFT JOIN public.beneficiaries b ON b.list_id = l.id
GROUP BY b.year, l.title
ORDER BY b.year DESC;
