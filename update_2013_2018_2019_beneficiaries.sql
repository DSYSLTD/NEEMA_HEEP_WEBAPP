-- ==============================================================================
-- NEEMA HEEP ARISE & SHINE EDUCATION PROGRAMME
-- SQL UPDATE SCRIPT: 2013, 2018, AND 2019 BENEFICIARIES LISTS & SCHOLARS
-- Platform: Supabase / PostgreSQL
-- Description: Inserts or updates annual beneficiary lists and individual scholars
--              for cohorts 2013, 2018, and 2019 in public.beneficiary_lists
--              and public.beneficiaries tables.
-- ==============================================================================

-- 1. UPSERT THE 2013, 2018, AND 2019 ANNUAL BENEFICIARY LISTS
INSERT INTO public.beneficiary_lists (id, year, title, description, status, year_identifier, created_by)
VALUES
(
    'list_2019',
    '2019',
    'Arise & Shine Beneficiaries - Selected 2019',
    'Secondary school scholarship beneficiaries selected in 2019 across Embu County.',
    'Published',
    'NH-BEN-2019',
    'Neema HEEP Education Board'
),
(
    'list_2018',
    '2018',
    'Arise & Shine Beneficiaries - Selected 2018',
    'Secondary school scholarship beneficiaries selected in 2018 across Embu County.',
    'Published',
    'NH-BEN-2018',
    'Neema HEEP Education Board'
),
(
    'list_2013',
    '2013',
    'Arise & Shine Beneficiaries - Selected 2013',
    'Secondary school scholarship beneficiaries supported under the 2013 intake.',
    'Published',
    'NH-BEN-2013',
    'Neema HEEP Education Board'
)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    year_identifier = EXCLUDED.year_identifier,
    updated_at = NOW();

-- 2. CLEAR EXISTING SCHOLAR RECORDS FOR 2019, 2018, AND 2013 TO PREVENT DUPLICATES
DELETE FROM public.beneficiaries 
WHERE list_id IN ('list_2019', 'list_2018', 'list_2013');

-- 3. INSERT INDIVIDUAL BENEFICIARY SCHOLARS
INSERT INTO public.beneficiaries (list_id, serial_number, full_name, masked_name, school, year, status)
VALUES
-- ==============================================================================
-- 2019 BENEFICIARIES COHORT (4 Scholars)
-- ==============================================================================
('list_2019', 1, 'ALICE WANJIRU NJERU', 'ALICE W***** N*****', 'KANGARU GIRLS HIGH SCHOOL', '2019', 'Active'),
('list_2019', 2, 'KENNEDY MUTUA MWANGI', 'KENNEDY M***** M*****', 'KANGARU SCHOOL EMBU', '2019', 'Active'),
('list_2019', 3, 'TERESIA NYAWIRA GICHOVI', 'TERESIA N***** G*****', 'ST. ANNE''S KIRIARI GIRLS HIGH SCHOOL', '2019', 'Active'),
('list_2019', 4, 'COLLINS MUGAMBI NJUE', 'COLLINS M***** N*****', 'MOI HIGH SCHOOL MBIRURI', '2019', 'Active'),

-- ==============================================================================
-- 2018 BENEFICIARIES COHORT (4 Scholars)
-- ==============================================================================
('list_2018', 1, 'PURITY MUTHONI KARIUKI', 'PURITY M***** K*****', 'KYENI GIRLS HIGH SCHOOL', '2018', 'Active'),
('list_2018', 2, 'SAMMY NYAGA MUTEGI', 'SAMMY N***** M*****', 'NGUVIU BOYS HIGH SCHOOL', '2018', 'Active'),
('list_2018', 3, 'DOROTHY WAWIRA NJUE', 'DOROTHY W***** N*****', 'SIAKAGO GIRLS HIGH SCHOOL', '2018', 'Active'),
('list_2018', 4, 'GEOFFREY MUNENE KINYUA', 'GEOFFREY M***** K*****', 'KANGARU SCHOOL EMBU', '2018', 'Active'),

-- ==============================================================================
-- 2013 BENEFICIARIES COHORT (3 Scholars)
-- ==============================================================================
('list_2013', 1, 'EMILY WANJA NJERU', 'EMILY W***** N*****', 'KANGARU GIRLS HIGH SCHOOL', '2013', 'Active'),
('list_2013', 2, 'BENSON MURIITHI MBOGO', 'BENSON M***** M*****', 'NGUVIU BOYS HIGH SCHOOL', '2013', 'Active'),
('list_2013', 3, 'CATHERINE MAKENA NYAGA', 'CATHERINE M***** N*****', 'ST. ANNE''S KIRIARI GIRLS HIGH SCHOOL', '2013', 'Active');

-- 4. VERIFY THE UPDATED COHORTS IN DATABASE
SELECT 
    l.year,
    l.title,
    l.status,
    COUNT(b.id) AS total_beneficiaries
FROM public.beneficiary_lists l
LEFT JOIN public.beneficiaries b ON b.list_id = l.id
WHERE l.year IN ('2013', '2018', '2019')
GROUP BY l.year, l.title, l.status
ORDER BY l.year DESC;
