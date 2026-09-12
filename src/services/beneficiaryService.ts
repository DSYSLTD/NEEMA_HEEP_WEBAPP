import { supabase } from '../lib/supabase';
import { beneficiariesStore, AnnualBeneficiaryList, BeneficiaryRecord } from '../lib/beneficiariesStore';

export const beneficiaryService = {
  /**
   * Fetch published beneficiary lists from Supabase or fallback to local store
   */
  async getPublishedBeneficiaries(): Promise<{ year: string; title: string; students: { id: string; name: string; school: string }[] }[]> {
    try {
      const { data, error } = await supabase
        .from('beneficiaries')
        .select('*')
        .eq('status', 'Active')
        .neq('year', '2027')
        .order('serial_number', { ascending: true });

      if (error || !data || data.length === 0) {
        return beneficiariesStore.getPublishedLists().filter(d => d.year !== '2027');
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
      return years.map(yr => ({
        year: yr,
        title: `Arise & Shine Beneficiaries - ${yr} Cohort`,
        students: grouped[yr]
      }));
    } catch {
      return beneficiariesStore.getPublishedLists().filter(d => d.year !== '2027');
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
