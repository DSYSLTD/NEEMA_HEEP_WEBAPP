import { supabase } from '../lib/supabase';
import { beneficiariesStore, AnnualBeneficiaryList, BeneficiaryRecord } from '../lib/beneficiariesStore';

export interface PublishedCohortItem {
  year: string;
  title: string;
  students: { id: string; name: string; school: string }[];
}

export const DEFAULT_PUBLISHED_COHORTS: PublishedCohortItem[] = [
  {
    year: '2026',
    title: 'Arise & Shine Beneficiaries - 2026 Cohort',
    students: [
      { id: '001', name: 'LINET W***** N*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL" },
      { id: '002', name: 'MARY N*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL" },
      { id: '003', name: 'DORCAS M***** M*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL" },
      { id: '004', name: 'DENNIS M*****', school: 'NGUVIU BOYS HIGH SCHOOL' },
      { id: '005', name: 'MERCY N*****', school: 'KYENI GIRLS HIGH SCHOOL' }
    ]
  },
  {
    year: '2025',
    title: 'Arise & Shine Beneficiaries - 2025 Cohort',
    students: [
      { id: '001', name: 'FAITH M***** K*****', school: 'KANGARU GIRLS HIGH SCHOOL' },
      { id: '002', name: 'FRANCIS M***** W*****', school: 'KANGARU SCHOOL EMBU' },
      { id: '003', name: 'AGNES W***** M*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL" },
      { id: '004', name: 'BRIAN M***** N*****', school: 'MOI HIGH SCHOOL MBIRURI' },
      { id: '005', name: 'GRACE W***** M*****', school: 'KYENI GIRLS HIGH SCHOOL' },
      { id: '006', name: 'SHADRACK K*****', school: 'NGUVIU BOYS HIGH SCHOOL' },
      { id: '007', name: 'CAROLINE M***** K*****', school: 'SIAKAGO GIRLS HIGH SCHOOL' }
    ]
  },
  {
    year: '2024',
    title: 'Arise & Shine Beneficiaries - 2024 Cohort',
    students: [
      { id: '001', name: 'LORNA W*****', school: 'KANGARU GIRLS HIGH SCHOOL' },
      { id: '002', name: 'JOYCE W*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL" },
      { id: '003', name: 'KELVIN K*****', school: 'KANGARU SCHOOL EMBU' },
      { id: '004', name: 'EVELYN W***** N*****', school: 'NGUVIU GIRLS HIGH SCHOOL' },
      { id: '005', name: 'ISAAC M***** K*****', school: 'MOI HIGH SCHOOL MBIRURI' },
      { id: '006', name: 'BRENDA M***** M*****', school: 'KYENI GIRLS HIGH SCHOOL' },
      { id: '007', name: 'PAUL N*****', school: 'SIAKAGO BOYS HIGH SCHOOL' }
    ]
  },
  {
    year: '2023',
    title: 'Arise & Shine Beneficiaries - 2023 Cohort',
    students: [
      { id: '001', name: 'CHRISTINE M***** N*****', school: 'KANGARU GIRLS HIGH SCHOOL' },
      { id: '002', name: 'VICTOR M***** W*****', school: 'KANGARU SCHOOL EMBU' },
      { id: '003', name: 'DIANA M***** M*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL" },
      { id: '004', name: 'PETER M***** M*****', school: 'NGUVIU BOYS HIGH SCHOOL' },
      { id: '005', name: 'BENJAMIN K*****', school: 'MOI HIGH SCHOOL MBIRURI' }
    ]
  },
  {
    year: '2022',
    title: 'Arise & Shine Beneficiaries - 2022 Cohort',
    students: [
      { id: '001', name: 'ESTHER W***** G*****', school: 'KYENI GIRLS HIGH SCHOOL' },
      { id: '002', name: 'JOSEPH M***** K*****', school: 'KANGARU SCHOOL EMBU' },
      { id: '003', name: 'MIRIAM M***** K*****', school: 'NGUVIU GIRLS HIGH SCHOOL' },
      { id: '004', name: 'SAMUEL N***** N*****', school: 'SIAKAGO BOYS HIGH SCHOOL' }
    ]
  },
  {
    year: '2021',
    title: 'Arise & Shine Beneficiaries - 2021 Cohort',
    students: [
      { id: '001', name: 'HARRIET W***** K*****', school: 'KANGARU GIRLS HIGH SCHOOL' },
      { id: '002', name: 'DANIEL K***** M*****', school: 'KANGARU SCHOOL EMBU' },
      { id: '003', name: 'FLORENCE N*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL" },
      { id: '004', name: 'DENNIS N***** M*****', school: 'NGUVIU BOYS HIGH SCHOOL' }
    ]
  },
  {
    year: '2020',
    title: 'Arise & Shine Beneficiaries - 2020 Cohort',
    students: [
      { id: '001', name: 'MERCY W***** M*****', school: 'KANGARU GIRLS HIGH SCHOOL' },
      { id: '002', name: 'JOHN M***** K*****', school: 'KANGARU SCHOOL EMBU' },
      { id: '003', name: 'BEATRICE M*****', school: 'NGUVIU GIRLS HIGH SCHOOL' }
    ]
  },
  {
    year: '2017',
    title: 'Arise & Shine Beneficiaries - 2017 Cohort',
    students: [
      { id: '001', name: 'KEVIN M*****', school: 'KANGARU SCHOOL EMBU' },
      { id: '002', name: 'RACHAEL W*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL" },
      { id: '003', name: 'ANTHONY M*****', school: 'NGUVIU BOYS HIGH SCHOOL' }
    ]
  },
  {
    year: '2016',
    title: 'Arise & Shine Beneficiaries - 2016 Cohort',
    students: [
      { id: '001', name: 'EUNICE N***** M*****', school: 'KANGARU GIRLS HIGH SCHOOL' },
      { id: '002', name: 'MARTIN K***** N*****', school: 'KANGARU SCHOOL EMBU' },
      { id: '003', name: 'JAMES M*****', school: 'MOI HIGH SCHOOL MBIRURI' }
    ]
  },
  {
    year: '2015',
    title: 'Arise & Shine Beneficiaries - 2015 Cohort',
    students: [
      { id: '001', name: 'PATRICIA W*****', school: 'KYENI GIRLS HIGH SCHOOL' },
      { id: '002', name: 'STEPHEN M*****', school: 'KANGARU SCHOOL EMBU' },
      { id: '003', name: 'EDWIN N*****', school: 'NGUVIU BOYS HIGH SCHOOL' },
      { id: '004', name: 'CECILIA M*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL" }
    ]
  },
  {
    year: '2014',
    title: 'Arise & Shine Beneficiaries - 2014 Cohort',
    students: [
      { id: '001', name: 'GEORGE M*****', school: 'KANGARU SCHOOL EMBU' },
      { id: '002', name: 'MARY W*****', school: 'KANGARU GIRLS HIGH SCHOOL' },
      { id: '003', name: 'SIMON K*****', school: 'NGUVIU BOYS HIGH SCHOOL' }
    ]
  },
  {
    year: '2011',
    title: 'Arise & Shine Beneficiaries - 2011 Cohort',
    students: [
      { id: '001', name: 'MOSES N*****', school: 'KANGARU SCHOOL EMBU' },
      { id: '002', name: 'JANE M*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL" }
    ]
  }
];

export const beneficiaryService = {
  /**
   * Fetch published beneficiary lists from Supabase or fallback to authoritative cohorts
   */
  async getPublishedBeneficiaries(): Promise<PublishedCohortItem[]> {
    try {
      const { data, error } = await supabase
        .from('beneficiaries')
        .select('*')
        .eq('status', 'Active')
        .neq('year', '2027')
        .order('serial_number', { ascending: true });

      if (error || !data || data.length === 0) {
        return DEFAULT_PUBLISHED_COHORTS;
      }

      // Group by year with deduplication
      const grouped: { [year: string]: { id: string; name: string; school: string }[] } = {};
      const seenInCohort: { [year: string]: Set<string> } = {};

      data.forEach(item => {
        const yr = item.year || '2026';
        if (yr === '2027') return;

        const fullName = (item.full_name || '').toUpperCase().trim();
        // Exclude duplicate 2026 entries that belong to 2024
        if (yr === '2026' && (fullName.includes('LORNA WAIRIMU') || fullName.includes('JOYCE WAWIRA') || fullName.includes('KELVIN KIMANZI'))) {
          return;
        }

        if (!grouped[yr]) grouped[yr] = [];
        if (!seenInCohort[yr]) seenInCohort[yr] = new Set<string>();

        const studentKey = fullName || (item.masked_name || '').toUpperCase().trim();
        if (seenInCohort[yr].has(studentKey)) {
          return; // Skip duplicate record
        }
        seenInCohort[yr].add(studentKey);

        grouped[yr].push({
          id: String(grouped[yr].length + 1).padStart(3, '0'),
          name: item.masked_name || item.full_name || '',
          school: item.school || ''
        });
      });

      const years = Object.keys(grouped).filter(yr => yr !== '2027').sort((a, b) => b.localeCompare(a));
      if (years.length === 0) {
        return DEFAULT_PUBLISHED_COHORTS;
      }

      return years.map(yr => ({
        year: yr,
        title: `Arise & Shine Beneficiaries - ${yr} Cohort`,
        students: grouped[yr]
      }));
    } catch {
      return DEFAULT_PUBLISHED_COHORTS;
    }
  },

  /**
   * Sync local beneficiary records to Supabase if accessible
   */
  async syncBeneficiaryToSupabase(record: BeneficiaryRecord): Promise<void> {
    try {
      const payload = {
        list_id: record.listId,
        serial_number: record.serialNumber,
        full_name: record.fullName,
        masked_name: record.maskedName,
        school: record.school,
        year: record.year,
        status: record.status
      };

      const { error } = await supabase
        .from('beneficiaries')
        .upsert([payload]);

      if (error) {
        console.warn('[beneficiaryService] Supabase sync notice:', error.message);
      }
    } catch (err) {
      console.warn('[beneficiaryService] Supabase sync exception:', err);
    }
  }
};
