-- ==============================================================================
-- NEEMA HEEP - GLOBAL DATABASE DEDUPLICATION & INTEGRITY SCRIPT (ERROR-FREE)
-- Purpose: 
--   1. Purges cross-cohort duplicates (2024 scholars wrongly copied into 2026).
--   2. Removes any duplicate records within each cohort.
--   3. Re-sequences serial numbers sequentially (1..N) without gaps.
--   4. Adds a UNIQUE constraint and index to prevent any duplicate insertion.
--   5. Outputs an audit verification report.
--
-- Target: Supabase / PostgreSQL SQL Editor
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- STEP 1: PURGE DUPLICATES FROM public.beneficiaries
-- ------------------------------------------------------------------------------

-- 1.1: Remove 2024 scholars erroneously present in the 2026 cohort
DELETE FROM public.beneficiaries
WHERE list_id = 'list_2026'
  AND UPPER(TRIM(full_name)) IN (
    'LORNA WAIRIMU',
    'JOYCE WAWIRA',
    'KELVIN KIMANZI'
  );

-- 1.2: Remove any intra-cohort duplicate student records (keeps the lowest serial/id)
DELETE FROM public.beneficiaries
WHERE id IN (
    SELECT id 
    FROM (
        SELECT 
            id,
            ROW_NUMBER() OVER (
                PARTITION BY list_id, UPPER(TRIM(full_name)) 
                ORDER BY serial_number ASC, created_at ASC, id ASC
            ) AS rn
        FROM public.beneficiaries
    ) ranked
    WHERE ranked.rn > 1
);

-- ------------------------------------------------------------------------------
-- STEP 2: RE-SEQUENCE SERIAL NUMBERS (1..N) MONOTONICALLY PER COHORT
-- ------------------------------------------------------------------------------

WITH resequenced AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY list_id 
            ORDER BY serial_number ASC, created_at ASC, id ASC
        ) AS new_serial
    FROM public.beneficiaries
)
UPDATE public.beneficiaries b
SET serial_number = r.new_serial
FROM resequenced r
WHERE b.id = r.id
  AND b.serial_number != r.new_serial;

-- ------------------------------------------------------------------------------
-- STEP 3: ENFORCE PERMANENT UNIQUE CONSTRAINT & INDEX
-- ------------------------------------------------------------------------------

-- Drop constraint if it already exists to ensure idempotent execution
ALTER TABLE public.beneficiaries 
DROP CONSTRAINT IF EXISTS unique_cohort_beneficiary;

-- Add strict unique constraint: student name can only exist once per list cohort
ALTER TABLE public.beneficiaries 
ADD CONSTRAINT unique_cohort_beneficiary UNIQUE (list_id, full_name);

-- Add unique case-insensitive functional index for robust protection
DROP INDEX IF EXISTS idx_beneficiaries_unique_name_per_list;

CREATE UNIQUE INDEX idx_beneficiaries_unique_name_per_list 
ON public.beneficiaries (list_id, UPPER(TRIM(full_name)));

-- ------------------------------------------------------------------------------
-- STEP 4: VERIFICATION AUDIT REPORT
-- ------------------------------------------------------------------------------

SELECT 
    year, 
    list_id, 
    COUNT(*) AS total_scholars,
    COUNT(DISTINCT UPPER(TRIM(full_name))) AS unique_names,
    CASE 
        WHEN COUNT(*) = COUNT(DISTINCT UPPER(TRIM(full_name))) THEN 'CLEAN (0 Duplicates)' 
        ELSE 'DUPLICATES DETECTED' 
    END AS status
FROM public.beneficiaries
GROUP BY year, list_id
ORDER BY year DESC;

COMMIT;
