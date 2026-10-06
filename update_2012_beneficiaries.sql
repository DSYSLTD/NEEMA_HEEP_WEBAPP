-- ==============================================================================
-- NEEMA HEEP ARISE & SHINE EDUCATION PROGRAMME
-- SQL UPDATE SCRIPT: 2012 BENEFICIARIES LIST & SCHOLARS
-- Platform: Supabase / PostgreSQL
-- Description: Inserts or updates annual beneficiary list and individual scholars
--              for the 2012 cohort in public.beneficiary_lists
--              and public.beneficiaries tables.
-- ==============================================================================

-- 1. UPSERT THE 2012 ANNUAL BENEFICIARY LIST
INSERT INTO public.beneficiary_lists (id, year, title, description, status, year_identifier, created_by)
VALUES
(
    'list_2012',
    '2012',
    'Arise & Shine Beneficiaries - Selected 2012',
    'Secondary school scholarship beneficiaries supported under the 2012 cohort intake.',
    'Published',
    'NH-BEN-2012',
    'Neema HEEP Education Board'
)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    year_identifier = EXCLUDED.year_identifier,
    updated_at = NOW();

-- 2. CLEAR EXISTING SCHOLAR RECORDS FOR 2012 TO PREVENT DUPLICATES
DELETE FROM public.beneficiaries 
WHERE list_id = 'list_2012';

-- 3. INSERT INDIVIDUAL 2012 BENEFICIARY SCHOLARS
INSERT INTO public.beneficiaries (list_id, serial_number, full_name, masked_name, school, year, status)
VALUES
-- ==============================================================================
-- 2012 COHORT (3 Scholars)
-- ==============================================================================
('list_2012', 1, 'DENNIS MUTUGI NJIRU', 'DENNIS M***** N*****', 'KANGARU SCHOOL EMBU', '2012', 'Active'),
('list_2012', 2, 'ANN WAMBUI KARIUKI', 'ANN W***** K*****', 'KANGARU GIRLS HIGH SCHOOL', '2012', 'Active'),
('list_2012', 3, 'ERIC MUGAMBI NYAGA', 'ERIC M***** N*****', 'NGUVIU BOYS HIGH SCHOOL', '2012', 'Active');

-- 4. VERIFICATION QUERY
SELECT 
    l.year,
    l.title,
    l.status,
    COUNT(b.id) AS total_beneficiaries
FROM public.beneficiary_lists l
LEFT JOIN public.beneficiaries b ON b.list_id = l.id
WHERE l.year = '2012'
GROUP BY l.year, l.title, l.status;
