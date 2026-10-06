import { supabase } from './supabase';

export interface BeneficiaryRecord {
  id: string;
  listId: string;
  serialNumber: number; // 1, 2, 3...
  fullName: string;
  maskedName: string;
  school: string;
  year: string;
  dateAdded: string;
  status: 'Active' | 'Draft';
}

export interface AnnualBeneficiaryList {
  id: string;
  year: string;
  title: string;
  description?: string;
  status: 'Draft' | 'Published' | 'Archived';
  yearIdentifier: string; // e.g., NH-BEN-2026
  dateCreated: string;
  createdBy: string;
  lastModified: string;
  supersededBy?: string | null;
  recordsCount?: number;
}

export interface BeneficiaryAuditLog {
  id: string;
  action: 'List Created' | 'List Updated' | 'Beneficiary Added' | 'Beneficiary Edited' | 'Beneficiary Deleted' | 'List Published' | 'List Archived' | 'Import Completed' | 'Export Completed';
  details: string;
  performedBy: string;
  timestamp: string;
}

export interface BeneficiaryNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
  read: boolean;
}

// Automatic formatting: Mask 2nd and 3rd names before publishing (Supabase DB Rule Enforcement)
export function maskBeneficiaryName(fullName: string): string {
  if (!fullName) return '';
  const clean = fullName.trim();
  const parts = clean.split(/\s+/);
  
  if (parts.length <= 1) {
    return parts[0].charAt(0) + '*****';
  }
  
  const first = parts[0];
  const maskedSubsequent = parts.slice(1).map(p => p.charAt(0) + '*****').join(' ');
  return `${first} ${maskedSubsequent}`;
}

export const DEFAULT_INITIAL_LISTS: AnnualBeneficiaryList[] = [
  {
    id: 'list_2026',
    year: '2026',
    title: 'Arise & Shine Beneficiaries - Selected 2026',
    description: 'Selected high school beneficiaries in 2026 cohort under Neema HEEP.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2026',
    dateCreated: '2026-01-10',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2026-01-15',
    recordsCount: 5
  },
  {
    id: 'list_2025',
    year: '2025',
    title: 'Arise & Shine Beneficiaries - Selected 2025',
    description: 'High school scholarship beneficiaries selected in 2025 across Embu County.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2025',
    dateCreated: '2025-01-10',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2025-01-15',
    recordsCount: 7
  },
  {
    id: 'list_2024',
    year: '2024',
    title: 'Arise & Shine Beneficiaries - Selected 2024',
    description: 'High school scholarship beneficiaries selected in 2024 across Embu County.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2024',
    dateCreated: '2024-01-10',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2024-01-15',
    recordsCount: 7
  },
  {
    id: 'list_2023',
    year: '2023',
    title: 'Arise & Shine Beneficiaries - Selected 2023',
    description: 'High school scholarship beneficiaries selected in 2023.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2023',
    dateCreated: '2023-01-10',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2023-01-15',
    recordsCount: 5
  },
  {
    id: 'list_2022',
    year: '2022',
    title: 'Arise & Shine Beneficiaries - Selected 2022',
    description: 'High school scholarship beneficiaries selected in 2022.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2022',
    dateCreated: '2022-01-10',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2022-01-15',
    recordsCount: 4
  },
  {
    id: 'list_2021',
    year: '2021',
    title: 'Arise & Shine Beneficiaries - Selected 2021',
    description: 'High school scholarship beneficiaries selected in 2021.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2021',
    dateCreated: '2021-01-10',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2021-01-15',
    recordsCount: 4
  },
  {
    id: 'list_2020',
    year: '2020',
    title: 'Arise & Shine Beneficiaries - Selected 2020',
    description: 'High school scholarship beneficiaries selected in 2020.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2020',
    dateCreated: '2020-01-10',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2020-01-15',
    recordsCount: 3
  },
  {
    id: 'list_2017',
    year: '2017',
    title: 'Arise & Shine Beneficiaries - Selected 2017',
    description: 'Form 1 high school students selected in January 2017.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2017',
    dateCreated: '2017-01-10',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2017-01-15',
    recordsCount: 3
  },
  {
    id: 'list_2016',
    year: '2016',
    title: 'Arise & Shine Beneficiaries - Selected 2016',
    description: 'Form 1 students added to the program in 2016.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2016',
    dateCreated: '2016-01-10',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2016-01-15',
    recordsCount: 3
  },
  {
    id: 'list_2015',
    year: '2015',
    title: 'Arise & Shine Beneficiaries - Selected 2015',
    description: 'Form 1 students joining the program in 2015.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2015',
    dateCreated: '2015-01-10',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2015-01-15',
    recordsCount: 4
  },
  {
    id: 'list_2014',
    year: '2014',
    title: 'Arise & Shine Beneficiaries - Selected 2014',
    description: 'High school students supported under the 2014 intake.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2014',
    dateCreated: '2014-01-10',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2014-01-15',
    recordsCount: 3
  },
  {
    id: 'list_2011',
    year: '2011',
    title: 'Arise & Shine Beneficiaries - Selected 2011',
    description: 'The inauguration cohort of Neema HEEP Arise & Shine Education Programme.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2011',
    dateCreated: '2011-01-10',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2011-01-15',
    recordsCount: 2
  }
];

export const DEFAULT_INITIAL_RECORDS: BeneficiaryRecord[] = [
  // 2026
  { id: 'rec_2026_1', listId: 'list_2026', serialNumber: 1, fullName: 'LINET WENDO NJOGU', maskedName: 'LINET W***** N*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2026', dateAdded: '2026-01-10', status: 'Active' },
  { id: 'rec_2026_2', listId: 'list_2026', serialNumber: 2, fullName: 'MARY NDUKU', maskedName: 'MARY N*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2026', dateAdded: '2026-01-10', status: 'Active' },
  { id: 'rec_2026_3', listId: 'list_2026', serialNumber: 3, fullName: 'DORCAS MAKENA MUTHONI', maskedName: 'DORCAS M***** M*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2026', dateAdded: '2026-01-10', status: 'Active' },
  { id: 'rec_2026_4', listId: 'list_2026', serialNumber: 4, fullName: 'DENNIS MUGENDI', maskedName: 'DENNIS M*****', school: 'NGUVIU BOYS HIGH SCHOOL', year: '2026', dateAdded: '2026-01-10', status: 'Active' },
  { id: 'rec_2026_5', listId: 'list_2026', serialNumber: 5, fullName: 'MERCY NJERI', maskedName: 'MERCY N*****', school: 'KYENI GIRLS HIGH SCHOOL', year: '2026', dateAdded: '2026-01-10', status: 'Active' },

  // 2025
  { id: 'rec_2025_1', listId: 'list_2025', serialNumber: 1, fullName: 'FAITH MUTHOI KARIUKI', maskedName: 'FAITH M***** K*****', school: 'KANGARU GIRLS HIGH SCHOOL', year: '2025', dateAdded: '2025-01-10', status: 'Active' },
  { id: 'rec_2025_2', listId: 'list_2025', serialNumber: 2, fullName: 'FRANCIS MURIMI WAWERU', maskedName: 'FRANCIS M***** W*****', school: 'KANGARU SCHOOL EMBU', year: '2025', dateAdded: '2025-01-10', status: 'Active' },
  { id: 'rec_2025_3', listId: 'list_2025', serialNumber: 3, fullName: 'AGNES WANGARI MURIITHI', maskedName: 'AGNES W***** M*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2025', dateAdded: '2025-01-10', status: 'Active' },
  { id: 'rec_2025_4', listId: 'list_2025', serialNumber: 4, fullName: 'BRIAN MUNENE NJERU', maskedName: 'BRIAN M***** N*****', school: 'MOI HIGH SCHOOL MBIRURI', year: '2025', dateAdded: '2025-01-10', status: 'Active' },
  { id: 'rec_2025_5', listId: 'list_2025', serialNumber: 5, fullName: 'GRACE WAITHIRA MBOGO', maskedName: 'GRACE W***** M*****', school: 'KYENI GIRLS HIGH SCHOOL', year: '2025', dateAdded: '2025-01-10', status: 'Active' },
  { id: 'rec_2025_6', listId: 'list_2025', serialNumber: 6, fullName: 'SHADRACK KIPCHUMBA', maskedName: 'SHADRACK K*****', school: 'NGUVIU BOYS HIGH SCHOOL', year: '2025', dateAdded: '2025-01-10', status: 'Active' },
  { id: 'rec_2025_7', listId: 'list_2025', serialNumber: 7, fullName: 'CAROLINE MAKENA KIMANI', maskedName: 'CAROLINE M***** K*****', school: 'SIAKAGO GIRLS HIGH SCHOOL', year: '2025', dateAdded: '2025-01-10', status: 'Active' },

  // 2024
  { id: 'rec_2024_1', listId: 'list_2024', serialNumber: 1, fullName: 'LORNA WAIRIMU', maskedName: 'LORNA W*****', school: 'KANGARU GIRLS HIGH SCHOOL', year: '2024', dateAdded: '2024-01-10', status: 'Active' },
  { id: 'rec_2024_2', listId: 'list_2024', serialNumber: 2, fullName: 'JOYCE WAWIRA', maskedName: 'JOYCE W*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2024', dateAdded: '2024-01-10', status: 'Active' },
  { id: 'rec_2024_3', listId: 'list_2024', serialNumber: 3, fullName: 'KELVIN KIMANZI', maskedName: 'KELVIN K*****', school: 'KANGARU SCHOOL EMBU', year: '2024', dateAdded: '2024-01-10', status: 'Active' },
  { id: 'rec_2024_4', listId: 'list_2024', serialNumber: 4, fullName: 'EVELYN WAMBUI NJERU', maskedName: 'EVELYN W***** N*****', school: 'NGUVIU GIRLS HIGH SCHOOL', year: '2024', dateAdded: '2024-01-10', status: 'Active' },
  { id: 'rec_2024_5', listId: 'list_2024', serialNumber: 5, fullName: 'ISAAC MUKUNDI KARIUKI', maskedName: 'ISAAC M***** K*****', school: 'MOI HIGH SCHOOL MBIRURI', year: '2024', dateAdded: '2024-01-10', status: 'Active' },
  { id: 'rec_2024_6', listId: 'list_2024', serialNumber: 6, fullName: 'BRENDA MWENDE MUTHONI', maskedName: 'BRENDA M***** M*****', school: 'KYENI GIRLS HIGH SCHOOL', year: '2024', dateAdded: '2024-01-10', status: 'Active' },
  { id: 'rec_2024_7', listId: 'list_2024', serialNumber: 7, fullName: 'PAUL NDWIGA', maskedName: 'PAUL N*****', school: 'SIAKAGO BOYS HIGH SCHOOL', year: '2024', dateAdded: '2024-01-10', status: 'Active' },

  // 2023
  { id: 'rec_2023_1', listId: 'list_2023', serialNumber: 1, fullName: 'CHRISTINE MURUGI NJUE', maskedName: 'CHRISTINE M***** N*****', school: 'KANGARU GIRLS HIGH SCHOOL', year: '2023', dateAdded: '2023-01-10', status: 'Active' },
  { id: 'rec_2023_2', listId: 'list_2023', serialNumber: 2, fullName: 'VICTOR MUGAMBI WANYAGA', maskedName: 'VICTOR M***** W*****', school: 'KANGARU SCHOOL EMBU', year: '2023', dateAdded: '2023-01-10', status: 'Active' },
  { id: 'rec_2023_3', listId: 'list_2023', serialNumber: 3, fullName: 'DIANA MUTHONI MURIUKI', maskedName: 'DIANA M***** M*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2023', dateAdded: '2023-01-10', status: 'Active' },
  { id: 'rec_2023_4', listId: 'list_2023', serialNumber: 4, fullName: 'PETER MWANGI MBOGO', maskedName: 'PETER M***** M*****', school: 'NGUVIU BOYS HIGH SCHOOL', year: '2023', dateAdded: '2023-01-10', status: 'Active' },
  { id: 'rec_2023_5', listId: 'list_2023', serialNumber: 5, fullName: 'BENJAMIN KINOTI', maskedName: 'BENJAMIN K*****', school: 'MOI HIGH SCHOOL MBIRURI', year: '2023', dateAdded: '2023-01-10', status: 'Active' },

  // 2022
  { id: 'rec_2022_1', listId: 'list_2022', serialNumber: 1, fullName: 'ESTHER WANGUCI GICHOBI', maskedName: 'ESTHER W***** G*****', school: 'KYENI GIRLS HIGH SCHOOL', year: '2022', dateAdded: '2022-01-10', status: 'Active' },
  { id: 'rec_2022_2', listId: 'list_2022', serialNumber: 2, fullName: 'JOSEPH MURIITHI KARIUKI', maskedName: 'JOSEPH M***** K*****', school: 'KANGARU SCHOOL EMBU', year: '2022', dateAdded: '2022-01-10', status: 'Active' },
  { id: 'rec_2022_3', listId: 'list_2022', serialNumber: 3, fullName: 'MIRIAM MUTHONI KINYUA', maskedName: 'MIRIAM M***** K*****', school: 'NGUVIU GIRLS HIGH SCHOOL', year: '2022', dateAdded: '2022-01-10', status: 'Active' },
  { id: 'rec_2022_4', listId: 'list_2022', serialNumber: 4, fullName: 'SAMUEL NJERU NYAGA', maskedName: 'SAMUEL N***** N*****', school: 'SIAKAGO BOYS HIGH SCHOOL', year: '2022', dateAdded: '2022-01-10', status: 'Active' },

  // 2021
  { id: 'rec_2021_1', listId: 'list_2021', serialNumber: 1, fullName: 'HARRIET WAMBUI KAMAU', maskedName: 'HARRIET W***** K*****', school: 'KANGARU GIRLS HIGH SCHOOL', year: '2021', dateAdded: '2021-01-10', status: 'Active' },
  { id: 'rec_2021_2', listId: 'list_2021', serialNumber: 2, fullName: 'DANIEL KIMANTHI MWANGI', maskedName: 'DANIEL K***** M*****', school: 'KANGARU SCHOOL EMBU', year: '2021', dateAdded: '2021-01-10', status: 'Active' },
  { id: 'rec_2021_3', listId: 'list_2021', serialNumber: 3, fullName: 'FLORENCE NJOKI', maskedName: 'FLORENCE N*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2021', dateAdded: '2021-01-10', status: 'Active' },
  { id: 'rec_2021_4', listId: 'list_2021', serialNumber: 4, fullName: 'DENNIS NJERU MUTEGI', maskedName: 'DENNIS N***** M*****', school: 'NGUVIU BOYS HIGH SCHOOL', year: '2021', dateAdded: '2021-01-10', status: 'Active' },

  // 2020
  { id: 'rec_2020_1', listId: 'list_2020', serialNumber: 1, fullName: 'MERCY WANGARI MUNENE', maskedName: 'MERCY W***** M*****', school: 'KANGARU GIRLS HIGH SCHOOL', year: '2020', dateAdded: '2020-01-10', status: 'Active' },
  { id: 'rec_2020_2', listId: 'list_2020', serialNumber: 2, fullName: 'JOHN MUGENDI KARIUKI', maskedName: 'JOHN M***** K*****', school: 'KANGARU SCHOOL EMBU', year: '2020', dateAdded: '2020-01-10', status: 'Active' },
  { id: 'rec_2020_3', listId: 'list_2020', serialNumber: 3, fullName: 'BEATRICE MUTHOI', maskedName: 'BEATRICE M*****', school: 'NGUVIU GIRLS HIGH SCHOOL', year: '2020', dateAdded: '2020-01-10', status: 'Active' },

  // 2017
  { id: 'rec_2017_1', listId: 'list_2017', serialNumber: 1, fullName: 'KEVIN MURIUKI', maskedName: 'KEVIN M*****', school: 'KANGARU SCHOOL EMBU', year: '2017', dateAdded: '2017-01-10', status: 'Active' },
  { id: 'rec_2017_2', listId: 'list_2017', serialNumber: 2, fullName: 'RACHAEL WANGARI', maskedName: 'RACHAEL W*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2017', dateAdded: '2017-01-10', status: 'Active' },
  { id: 'rec_2017_3', listId: 'list_2017', serialNumber: 3, fullName: 'ANTHONY MUKUNDI', maskedName: 'ANTHONY M*****', school: 'NGUVIU BOYS HIGH SCHOOL', year: '2017', dateAdded: '2017-01-10', status: 'Active' },

  // 2016
  { id: 'rec_2016_1', listId: 'list_2016', serialNumber: 1, fullName: 'EUNICE NJOKI MBOGO', maskedName: 'EUNICE N***** M*****', school: 'KANGARU GIRLS HIGH SCHOOL', year: '2016', dateAdded: '2016-01-10', status: 'Active' },
  { id: 'rec_2016_2', listId: 'list_2016', serialNumber: 2, fullName: 'MARTIN KARIUKI NJERU', maskedName: 'MARTIN K***** N*****', school: 'KANGARU SCHOOL EMBU', year: '2016', dateAdded: '2016-01-10', status: 'Active' },
  { id: 'rec_2016_3', listId: 'list_2016', serialNumber: 3, fullName: 'JAMES MUGENDI', maskedName: 'JAMES M*****', school: 'MOI HIGH SCHOOL MBIRURI', year: '2016', dateAdded: '2016-01-10', status: 'Active' },

  // 2015
  { id: 'rec_2015_1', listId: 'list_2015', serialNumber: 1, fullName: 'PATRICIA WANGARI', maskedName: 'PATRICIA W*****', school: 'KYENI GIRLS HIGH SCHOOL', year: '2015', dateAdded: '2015-01-10', status: 'Active' },
  { id: 'rec_2015_2', listId: 'list_2015', serialNumber: 2, fullName: 'STEPHEN MURIITHI', maskedName: 'STEPHEN M*****', school: 'KANGARU SCHOOL EMBU', year: '2015', dateAdded: '2015-01-10', status: 'Active' },
  { id: 'rec_2015_3', listId: 'list_2015', serialNumber: 3, fullName: 'EDWIN NYAGA', maskedName: 'EDWIN N*****', school: 'NGUVIU BOYS HIGH SCHOOL', year: '2015', dateAdded: '2015-01-10', status: 'Active' },
  { id: 'rec_2015_4', listId: 'list_2015', serialNumber: 4, fullName: 'CECILIA MAKENA', maskedName: 'CECILIA M*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2015', dateAdded: '2015-01-10', status: 'Active' },

  // 2014
  { id: 'rec_2014_1', listId: 'list_2014', serialNumber: 1, fullName: 'GEORGE MUKUNDI', maskedName: 'GEORGE M*****', school: 'KANGARU SCHOOL EMBU', year: '2014', dateAdded: '2014-01-10', status: 'Active' },
  { id: 'rec_2014_2', listId: 'list_2014', serialNumber: 2, fullName: 'MARY WANJIKU', maskedName: 'MARY W*****', school: 'KANGARU GIRLS HIGH SCHOOL', year: '2014', dateAdded: '2014-01-10', status: 'Active' },
  { id: 'rec_2014_3', listId: 'list_2014', serialNumber: 3, fullName: 'SIMON KARIUKI', maskedName: 'SIMON K*****', school: 'NGUVIU BOYS HIGH SCHOOL', year: '2014', dateAdded: '2014-01-10', status: 'Active' },

  // 2011
  { id: 'rec_2011_1', listId: 'list_2011', serialNumber: 1, fullName: 'MOSES NJERU', maskedName: 'MOSES N*****', school: 'KANGARU SCHOOL EMBU', year: '2011', dateAdded: '2011-01-10', status: 'Active' },
  { id: 'rec_2011_2', listId: 'list_2011', serialNumber: 2, fullName: 'JANE MUTHONI', maskedName: 'JANE M*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2011', dateAdded: '2011-01-10', status: 'Active' }
];

class BeneficiariesStore {
  private lists: AnnualBeneficiaryList[] = [...DEFAULT_INITIAL_LISTS];
  private records: BeneficiaryRecord[] = [...DEFAULT_INITIAL_RECORDS];
  private logs: BeneficiaryAuditLog[] = [];
  private notifications: BeneficiaryNotification[] = [];
  private isLoadedFromSupabase = false;

  constructor() {
    this.syncWithSupabase();
  }

  public async syncWithSupabase() {
    try {
      // 1. Fetch beneficiary lists from Supabase
      const { data: remoteLists, error: listErr } = await supabase
        .from('beneficiary_lists')
        .select('*')
        .order('year', { ascending: false });

      if (!listErr && remoteLists && remoteLists.length > 0) {
        this.lists = remoteLists.map((l: any) => ({
          id: l.id,
          year: String(l.year),
          title: l.title || `Beneficiaries ${l.year}`,
          description: l.description || '',
          status: l.status || 'Draft',
          yearIdentifier: l.year_identifier || `NH-BEN-${l.year}`,
          dateCreated: l.created_at ? l.created_at.split('T')[0] : '',
          createdBy: l.created_by || 'Administrator',
          lastModified: l.updated_at ? l.updated_at.split('T')[0] : (l.created_at ? l.created_at.split('T')[0] : ''),
          recordsCount: 0
        }));
      } else if (this.lists.length === 0) {
        this.lists = [...DEFAULT_INITIAL_LISTS];
      }

      // 2. Fetch beneficiaries from Supabase
      const { data: remoteRecs, error: recErr } = await supabase
        .from('beneficiaries')
        .select('*')
        .order('serial_number', { ascending: true });

      if (!recErr && remoteRecs && remoteRecs.length > 0) {
        this.records = remoteRecs.map((r: any) => ({
          id: r.id,
          listId: r.list_id || '',
          serialNumber: Number(r.serial_number) || 1,
          fullName: r.full_name || '',
          maskedName: r.masked_name || maskBeneficiaryName(r.full_name || ''),
          school: r.school || '',
          year: String(r.year || ''),
          dateAdded: r.created_at ? r.created_at.split('T')[0] : '',
          status: (r.status || 'Active') as 'Active' | 'Draft'
        }));

        // Update list counts
        this.lists.forEach(l => {
          l.recordsCount = this.records.filter(r => r.listId === l.id).length;
        });
      } else if (this.records.length === 0) {
        this.records = [...DEFAULT_INITIAL_RECORDS];
        this.lists.forEach(l => {
          l.recordsCount = this.records.filter(r => r.listId === l.id).length;
        });
      } else {
        this.lists.forEach(l => {
          l.recordsCount = this.records.filter(r => r.listId === l.id).length;
        });
      }

      this.isLoadedFromSupabase = true;
      this.notifyListeners();
    } catch (err) {
      console.warn('[BeneficiariesStore] Notice syncing with Supabase:', err);
    }
  }

  private notifyListeners() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('neema_cms_beneficiaries_lists_updated'));
    }
  }

  public getLists(): AnnualBeneficiaryList[] {
    return [...this.lists];
  }

  public getListById(id: string): AnnualBeneficiaryList | undefined {
    return this.lists.find(l => l.id === id);
  }

  public getListByYear(year: string): AnnualBeneficiaryList | undefined {
    return this.lists.find(l => l.year === year);
  }

  public getPublishedLists(): AnnualBeneficiaryList[] {
    return this.lists.filter(l => l.status === 'Published');
  }

  public getRecords(listId?: string): BeneficiaryRecord[] {
    const recs = listId ? this.records.filter(r => r.listId === listId) : this.records;
    return recs.map(r => ({
      ...r,
      maskedName: r.maskedName || maskBeneficiaryName(r.fullName)
    }));
  }

  public getRecordsByList(listId: string): BeneficiaryRecord[] {
    return this.records
      .filter(r => r.listId === listId)
      .sort((a, b) => a.serialNumber - b.serialNumber);
  }

  public getAllRecords(): BeneficiaryRecord[] {
    return [...this.records];
  }

  public getLogs(): BeneficiaryAuditLog[] {
    return [...this.logs];
  }

  public getNotifications(): BeneficiaryNotification[] {
    return [...this.notifications];
  }

  // Create Annual Beneficiary List
  public async createList(data: { year: string; title: string; description?: string; status: 'Draft' | 'Published' | 'Archived'; createdBy: string }): Promise<AnnualBeneficiaryList> {
    const now = new Date().toISOString().split('T')[0];
    const yearId = `NH-BEN-${data.year}`;

    // Optimistic insert
    const tempId = `list_${Date.now()}`;
    const newList: AnnualBeneficiaryList = {
      id: tempId,
      year: data.year,
      title: data.title,
      description: data.description || '',
      status: data.status,
      yearIdentifier: yearId,
      dateCreated: now,
      createdBy: data.createdBy,
      lastModified: now,
      recordsCount: 0
    };

    this.lists.unshift(newList);
    this.addLog('List Created', `Created annual list "${newList.title}" (${newList.yearIdentifier}).`, data.createdBy);
    this.notifyListeners();

    try {
      const { data: inserted, error } = await supabase
        .from('beneficiary_lists')
        .insert({
          title: data.title,
          year: data.year,
          year_identifier: yearId,
          description: data.description || '',
          status: data.status,
          created_by: data.createdBy
        })
        .select()
        .single();

      if (!error && inserted) {
        newList.id = inserted.id;
      }
    } catch (err) {
      console.warn('[BeneficiariesStore] Supabase list insert exception:', err);
    }

    return newList;
  }

  // Update List Metadata & Publication Status
  public async updateList(id: string, updates: Partial<AnnualBeneficiaryList>, updatedBy: string): Promise<AnnualBeneficiaryList | null> {
    const index = this.lists.findIndex(l => l.id === id);
    if (index === -1) return null;

    const oldStatus = this.lists[index].status;
    this.lists[index] = {
      ...this.lists[index],
      ...updates,
      lastModified: new Date().toISOString().split('T')[0]
    };

    const list = this.lists[index];

    if (updates.status && updates.status !== oldStatus) {
      if (updates.status === 'Published') {
        this.addLog('List Published', `Published annual beneficiary list "${list.title}" to public website.`, updatedBy);
      } else if (updates.status === 'Archived') {
        this.addLog('List Archived', `Archived annual beneficiary list "${list.title}".`, updatedBy);
      }
    }

    this.notifyListeners();

    try {
      await supabase
        .from('beneficiary_lists')
        .update({
          title: list.title,
          description: list.description,
          status: list.status,
          year: list.year,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
    } catch (err) {
      console.warn('[BeneficiariesStore] Supabase list update exception:', err);
    }

    return list;
  }

  public async deleteList(id: string, deletedBy: string) {
    const list = this.lists.find(l => l.id === id);
    if (!list) return;

    this.lists = this.lists.filter(l => l.id !== id);
    this.records = this.records.filter(r => r.listId !== id);

    this.addLog('List Updated', `Deleted beneficiary list "${list.title}" and associated records.`, deletedBy);
    this.notifyListeners();

    try {
      await supabase.from('beneficiaries').delete().eq('list_id', id);
      await supabase.from('beneficiary_lists').delete().eq('id', id);
    } catch (err) {
      console.warn('[BeneficiariesStore] Supabase list delete exception:', err);
    }
  }

  private resequence(listId: string) {
    const listRecs = this.records
      .filter(r => r.listId === listId)
      .sort((a, b) => a.serialNumber - b.serialNumber);

    listRecs.forEach((r, idx) => {
      r.serialNumber = idx + 1;
    });
  }

  // Add Beneficiary Record
  public async addBeneficiary(listId: string, fullName: string, school: string, addedBy: string): Promise<BeneficiaryRecord | null> {
    const list = this.lists.find(l => l.id === listId);
    if (!list) return null;

    const listRecs = this.getRecordsByList(listId);
    const newSeq = listRecs.length + 1;
    const now = new Date().toISOString().split('T')[0];
    const masked = maskBeneficiaryName(fullName.toUpperCase());

    const newRecord: BeneficiaryRecord = {
      id: `rec_${Date.now()}`,
      listId,
      serialNumber: newSeq,
      fullName: fullName.toUpperCase(),
      maskedName: masked,
      school: school.toUpperCase(),
      year: list.year,
      dateAdded: now,
      status: 'Active'
    };

    this.records.push(newRecord);
    this.resequence(listId);
    list.recordsCount = (list.recordsCount || 0) + 1;

    this.addLog('Beneficiary Added', `Added beneficiary "${fullName}" to list ${list.yearIdentifier}.`, addedBy);
    this.notifyListeners();

    try {
      const { data: inserted, error } = await supabase
        .from('beneficiaries')
        .insert({
          list_id: listId,
          serial_number: newSeq,
          full_name: fullName.toUpperCase(),
          masked_name: masked,
          school: school.toUpperCase(),
          year: list.year,
          status: 'Active'
        })
        .select()
        .single();

      if (!error && inserted) {
        newRecord.id = inserted.id;
      }
    } catch (err) {
      console.warn('[BeneficiariesStore] Supabase beneficiary insert exception:', err);
    }

    return newRecord;
  }

  // Edit Beneficiary Record
  public async updateBeneficiary(id: string, fullName: string, school: string, updatedBy: string): Promise<BeneficiaryRecord | null> {
    const rec = this.records.find(r => r.id === id);
    if (!rec) return null;

    rec.fullName = fullName.toUpperCase();
    rec.maskedName = maskBeneficiaryName(fullName.toUpperCase());
    rec.school = school.toUpperCase();

    this.addLog('Beneficiary Edited', `Updated beneficiary record No. ${rec.serialNumber} ("${fullName}").`, updatedBy);
    this.notifyListeners();

    try {
      await supabase
        .from('beneficiaries')
        .update({
          full_name: rec.fullName,
          masked_name: rec.maskedName,
          school: rec.school,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
    } catch (err) {
      console.warn('[BeneficiariesStore] Supabase beneficiary update exception:', err);
    }

    return rec;
  }

  // Delete Beneficiary Record
  public async deleteBeneficiary(id: string, deletedBy: string) {
    const rec = this.records.find(r => r.id === id);
    if (!rec) return;

    const listId = rec.listId;
    this.records = this.records.filter(r => r.id !== id);
    this.resequence(listId);

    const list = this.lists.find(l => l.id === listId);
    if (list && list.recordsCount) {
      list.recordsCount = Math.max(0, list.recordsCount - 1);
    }

    this.addLog('Beneficiary Deleted', `Deleted beneficiary record No. ${rec.serialNumber} ("${rec.fullName}") from list.`, deletedBy);
    this.notifyListeners();

    try {
      await supabase.from('beneficiaries').delete().eq('id', id);
    } catch (err) {
      console.warn('[BeneficiariesStore] Supabase beneficiary delete exception:', err);
    }
  }

  // Rearrange / Move record up or down
  public moveBeneficiary(id: string, direction: 'up' | 'down', movedBy: string) {
    const rec = this.records.find(r => r.id === id);
    if (!rec) return;

    const listRecs = this.getRecordsByList(rec.listId);
    const idx = listRecs.findIndex(r => r.id === id);
    if (idx === -1) return;

    if (direction === 'up' && idx > 0) {
      const prev = listRecs[idx - 1];
      const tempSeq = rec.serialNumber;
      rec.serialNumber = prev.serialNumber;
      prev.serialNumber = tempSeq;
    } else if (direction === 'down' && idx < listRecs.length - 1) {
      const next = listRecs[idx + 1];
      const tempSeq = rec.serialNumber;
      rec.serialNumber = next.serialNumber;
      next.serialNumber = tempSeq;
    }

    this.resequence(rec.listId);
    this.addLog('Beneficiary Edited', `Rearranged sequence position for "${rec.fullName}".`, movedBy);
    this.notifyListeners();
  }

  // Bulk Import
  public async bulkImport(listId: string, items: { fullName: string; school: string }[], importedBy: string): Promise<{ imported: number; duplicates: number }> {
    const list = this.lists.find(l => l.id === listId);
    if (!list) return { imported: 0, duplicates: 0 };

    const existingRecs = this.getRecordsByList(listId);
    const existingNames = new Set(existingRecs.map(r => r.fullName.toUpperCase()));

    let importedCount = 0;
    let duplicateCount = 0;
    const now = new Date().toISOString().split('T')[0];
    const toInsertRows: any[] = [];

    items.forEach(item => {
      const cleanName = item.fullName.trim().toUpperCase();
      const cleanSchool = item.school.trim().toUpperCase();

      if (!cleanName) return;

      if (existingNames.has(cleanName)) {
        duplicateCount++;
      } else {
        existingNames.add(cleanName);
        importedCount++;
        const masked = maskBeneficiaryName(cleanName);
        const newRecord: BeneficiaryRecord = {
          id: `rec_imp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          listId,
          serialNumber: this.records.filter(r => r.listId === listId).length + 1,
          fullName: cleanName,
          maskedName: masked,
          school: cleanSchool,
          year: list.year,
          dateAdded: now,
          status: 'Active'
        };
        this.records.push(newRecord);

        toInsertRows.push({
          list_id: listId,
          serial_number: newRecord.serialNumber,
          full_name: cleanName,
          masked_name: masked,
          school: cleanSchool,
          year: list.year,
          status: 'Active'
        });
      }
    });

    this.resequence(listId);
    list.recordsCount = this.records.filter(r => r.listId === listId).length;
    this.addLog('Import Completed', `Imported ${importedCount} records into ${list.yearIdentifier} (${duplicateCount} duplicates skipped).`, importedBy);
    this.notifyListeners();

    if (toInsertRows.length > 0) {
      try {
        await supabase.from('beneficiaries').insert(toInsertRows);
      } catch (err) {
        console.warn('[BeneficiariesStore] Supabase bulk insert exception:', err);
      }
    }

    return { imported: importedCount, duplicates: duplicateCount };
  }

  // Audit Logs
  public addLog(action: BeneficiaryAuditLog['action'], details: string, performedBy: string) {
    this.logs.unshift({
      id: `log_${Date.now()}`,
      action,
      details,
      performedBy,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });
  }

  // Notifications
  public addNotification(title: string, message: string, type: 'info' | 'success' | 'warning') {
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      read: false
    });
  }

  public markNotificationRead(id: string) {
    const n = this.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.notifyListeners();
    }
  }
}

export const beneficiariesStore = new BeneficiariesStore();
