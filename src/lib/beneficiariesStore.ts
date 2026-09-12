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
    // e.g. "MARY" -> "M*****"
    return parts[0].charAt(0) + '*****';
  }
  
  // 1st name stays plain text; 2nd, 3rd, and all subsequent names are masked (e.g. "JOHN MUGENDI KARIUKI" -> "JOHN M***** K*****")
  const first = parts[0];
  const maskedSubsequent = parts.slice(1).map(p => p.charAt(0) + '*****').join(' ');
  return `${first} ${maskedSubsequent}`;
}

// Initial Data Seed
const INITIAL_LISTS: AnnualBeneficiaryList[] = [
  {
    id: 'list_2026',
    year: '2026',
    title: 'Arise & Shine Beneficiaries - Selected 2026',
    description: 'Selected beneficiaries in the 2026 cohort sponsored under Neema HEEP Arise & Shine Education Programme.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2026',
    dateCreated: '2026-01-10',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2026-01-15',
    recordsCount: 5
  },
  {
    id: 'list_2024',
    year: '2024',
    title: 'Arise & Shine Beneficiaries - Selected 2024',
    description: 'High school scholarship beneficiaries selected in 2024 across Embu County.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2024',
    dateCreated: '2024-01-15',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2024-01-20',
    recordsCount: 7
  },
  {
    id: 'list_2023',
    year: '2023',
    title: 'Arise & Shine Beneficiaries - Selected 2023',
    description: 'High school scholarship beneficiaries selected in 2023.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2023',
    dateCreated: '2023-01-14',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2023-01-20',
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
    lastModified: '2022-01-16',
    recordsCount: 4
  },
  {
    id: 'list_2021',
    year: '2021',
    title: 'Arise & Shine Beneficiaries - Selected 2021',
    description: 'High school scholarship beneficiaries selected in 2021.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2021',
    dateCreated: '2021-01-11',
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
    dateCreated: '2020-01-12',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2020-01-18',
    recordsCount: 3
  },
  {
    id: 'list_2019',
    year: '2019',
    title: 'Arise & Shine Beneficiaries - Selected 2019',
    description: 'High school scholarship beneficiaries selected in 2019.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2019',
    dateCreated: '2019-01-12',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2019-01-18',
    recordsCount: 4
  },
  {
    id: 'list_2018',
    year: '2018',
    title: 'Arise & Shine Beneficiaries - Selected 2018',
    description: 'High school scholarship beneficiaries selected in 2018.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2018',
    dateCreated: '2018-01-14',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2018-01-20',
    recordsCount: 4
  },
  {
    id: 'list_2017',
    year: '2017',
    title: 'Arise & Shine Beneficiaries - Selected 2017',
    description: 'Form 1 high school students selected in January 2017.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2017',
    dateCreated: '2017-01-15',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2017-01-20',
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
    dateCreated: '2014-01-12',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2014-01-18',
    recordsCount: 3
  },
  {
    id: 'list_2013',
    year: '2013',
    title: 'Arise & Shine Beneficiaries - Selected 2013',
    description: 'High school scholarship beneficiaries selected in 2013.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2013',
    dateCreated: '2013-01-10',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2013-01-16',
    recordsCount: 3
  },
  {
    id: 'list_2012',
    year: '2012',
    title: 'Arise & Shine Beneficiaries - Selected 2012',
    description: 'High school scholarship beneficiaries selected in 2012.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2012',
    dateCreated: '2012-01-12',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2012-01-18',
    recordsCount: 3
  },
  {
    id: 'list_2011',
    year: '2011',
    title: 'Arise & Shine Beneficiaries - Selected 2011 (Founding Cohort)',
    description: 'The inauguration cohort of Neema HEEP Arise & Shine Education Programme.',
    status: 'Published',
    yearIdentifier: 'NH-BEN-2011',
    dateCreated: '2011-01-10',
    createdBy: 'Neema HEEP Education Board',
    lastModified: '2011-01-15',
    recordsCount: 2
  }
];

const INITIAL_RECORDS: BeneficiaryRecord[] = [
  // 2026 Cohort (Cleaned & De-duplicated - 5 Scholars)
  { id: 'rec_2026_1', listId: 'list_2026', serialNumber: 1, fullName: 'LINET WENDO NJOGU', maskedName: 'LINET W***** N*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2026', dateAdded: '2026-01-10', status: 'Active' },
  { id: 'rec_2026_2', listId: 'list_2026', serialNumber: 2, fullName: 'MARY NDUKU', maskedName: 'MARY N*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2026', dateAdded: '2026-01-10', status: 'Active' },
  { id: 'rec_2026_3', listId: 'list_2026', serialNumber: 3, fullName: 'DORCAS MAKENA MUTHONI', maskedName: 'DORCAS M***** M*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2026', dateAdded: '2026-01-10', status: 'Active' },
  { id: 'rec_2026_4', listId: 'list_2026', serialNumber: 4, fullName: 'DENNIS MUGENDI', maskedName: 'DENNIS M*****', school: 'NGUVIU BOYS HIGH SCHOOL', year: '2026', dateAdded: '2026-01-11', status: 'Active' },
  { id: 'rec_2026_5', listId: 'list_2026', serialNumber: 5, fullName: 'MERCY NJERI', maskedName: 'MERCY N*****', school: 'KYENI GIRLS HIGH SCHOOL', year: '2026', dateAdded: '2026-01-12', status: 'Active' },

  // 2024 Cohort
  { id: 'rec_2024_1', listId: 'list_2024', serialNumber: 1, fullName: 'LORNA WAIRIMU', maskedName: 'LORNA W*****', school: 'KANGARU GIRLS HIGH SCHOOL', year: '2024', dateAdded: '2024-01-15', status: 'Active' },
  { id: 'rec_2024_2', listId: 'list_2024', serialNumber: 2, fullName: 'JOYCE WAWIRA', maskedName: 'JOYCE W*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2024', dateAdded: '2024-01-15', status: 'Active' },
  { id: 'rec_2024_3', listId: 'list_2024', serialNumber: 3, fullName: 'KELVIN KIMANZI', maskedName: 'KELVIN K*****', school: 'KANGARU SCHOOL EMBU', year: '2024', dateAdded: '2024-01-15', status: 'Active' },
  { id: 'rec_2024_4', listId: 'list_2024', serialNumber: 4, fullName: 'EVELYN WAMBUI NJERU', maskedName: 'EVELYN W***** N*****', school: 'NGUVIU GIRLS HIGH SCHOOL', year: '2024', dateAdded: '2024-01-16', status: 'Active' },
  { id: 'rec_2024_5', listId: 'list_2024', serialNumber: 5, fullName: 'ISAAC MUKUNDI KARIUKI', maskedName: 'ISAAC M***** K*****', school: 'MOI HIGH SCHOOL MBIRURI', year: '2024', dateAdded: '2024-01-16', status: 'Active' },
  { id: 'rec_2024_6', listId: 'list_2024', serialNumber: 6, fullName: 'BRENDA MWENDE MUTHONI', maskedName: 'BRENDA M***** M*****', school: 'KYENI GIRLS HIGH SCHOOL', year: '2024', dateAdded: '2024-01-17', status: 'Active' },
  { id: 'rec_2024_7', listId: 'list_2024', serialNumber: 7, fullName: 'PAUL NDWIGA', maskedName: 'PAUL N*****', school: 'SIAKAGO BOYS HIGH SCHOOL', year: '2024', dateAdded: '2024-01-18', status: 'Active' },

  // 2023 Cohort
  { id: 'rec_2023_1', listId: 'list_2023', serialNumber: 1, fullName: 'CHRISTINE MURUGI NJUE', maskedName: 'CHRISTINE M***** N*****', school: 'KANGARU GIRLS HIGH SCHOOL', year: '2023', dateAdded: '2023-01-14', status: 'Active' },
  { id: 'rec_2023_2', listId: 'list_2023', serialNumber: 2, fullName: 'VICTOR MUGAMBI WANYAGA', maskedName: 'VICTOR M***** W*****', school: 'KANGARU SCHOOL EMBU', year: '2023', dateAdded: '2023-01-14', status: 'Active' },
  { id: 'rec_2023_3', listId: 'list_2023', serialNumber: 3, fullName: 'DIANA MUTHONI MURIUKI', maskedName: 'DIANA M***** M*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2023', dateAdded: '2023-01-15', status: 'Active' },
  { id: 'rec_2023_4', listId: 'list_2023', serialNumber: 4, fullName: 'PETER MWANGI MBOGO', maskedName: 'PETER M***** M*****', school: 'NGUVIU BOYS HIGH SCHOOL', year: '2023', dateAdded: '2023-01-15', status: 'Active' },
  { id: 'rec_2023_5', listId: 'list_2023', serialNumber: 5, fullName: 'BENJAMIN KINOTI', maskedName: 'BENJAMIN K*****', school: 'MOI HIGH SCHOOL MBIRURI', year: '2023', dateAdded: '2023-01-16', status: 'Active' },

  // 2022 Cohort
  { id: 'rec_2022_1', listId: 'list_2022', serialNumber: 1, fullName: 'ESTHER WANGUCI GICHOBI', maskedName: 'ESTHER W***** G*****', school: 'KYENI GIRLS HIGH SCHOOL', year: '2022', dateAdded: '2022-01-10', status: 'Active' },
  { id: 'rec_2022_2', listId: 'list_2022', serialNumber: 2, fullName: 'JOSEPH MURIITHI KARIUKI', maskedName: 'JOSEPH M***** K*****', school: 'KANGARU SCHOOL EMBU', year: '2022', dateAdded: '2022-01-10', status: 'Active' },
  { id: 'rec_2022_3', listId: 'list_2022', serialNumber: 3, fullName: 'MIRIAM MUTHONI KINYUA', maskedName: 'MIRIAM M***** K*****', school: 'NGUVIU GIRLS HIGH SCHOOL', year: '2022', dateAdded: '2022-01-11', status: 'Active' },
  { id: 'rec_2022_4', listId: 'list_2022', serialNumber: 4, fullName: 'SAMUEL NJERU NYAGA', maskedName: 'SAMUEL N***** N*****', school: 'SIAKAGO BOYS HIGH SCHOOL', year: '2022', dateAdded: '2022-01-11', status: 'Active' },

  // 2021 Cohort
  { id: 'rec_2021_1', listId: 'list_2021', serialNumber: 1, fullName: 'HARRIET WAMBUI KAMAU', maskedName: 'HARRIET W***** K*****', school: 'KANGARU GIRLS HIGH SCHOOL', year: '2021', dateAdded: '2021-01-11', status: 'Active' },
  { id: 'rec_2021_2', listId: 'list_2021', serialNumber: 2, fullName: 'DANIEL KIMANTHI MWANGI', maskedName: 'DANIEL K***** M*****', school: 'KANGARU SCHOOL EMBU', year: '2021', dateAdded: '2021-01-11', status: 'Active' },
  { id: 'rec_2021_3', listId: 'list_2021', serialNumber: 3, fullName: 'FLORENCE NJOKI', maskedName: 'FLORENCE N*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2021', dateAdded: '2021-01-12', status: 'Active' },
  { id: 'rec_2021_4', listId: 'list_2021', serialNumber: 4, fullName: 'DENNIS NJERU MUTEGI', maskedName: 'DENNIS N***** M*****', school: 'NGUVIU BOYS HIGH SCHOOL', year: '2021', dateAdded: '2021-01-12', status: 'Active' },

  // 2020 Cohort
  { id: 'rec_2020_1', listId: 'list_2020', serialNumber: 1, fullName: 'MERCY WANGARI MUNENE', maskedName: 'MERCY W***** M*****', school: 'KANGARU GIRLS HIGH SCHOOL', year: '2020', dateAdded: '2020-01-12', status: 'Active' },
  { id: 'rec_2020_2', listId: 'list_2020', serialNumber: 2, fullName: 'JOHN MUGENDI KARIUKI', maskedName: 'JOHN M***** K*****', school: 'KANGARU SCHOOL EMBU', year: '2020', dateAdded: '2020-01-12', status: 'Active' },
  { id: 'rec_2020_3', listId: 'list_2020', serialNumber: 3, fullName: 'BEATRICE MUTHOI', maskedName: 'BEATRICE M*****', school: 'NGUVIU GIRLS HIGH SCHOOL', year: '2020', dateAdded: '2020-01-13', status: 'Active' },

  // 2019 Cohort
  { id: 'rec_2019_1', listId: 'list_2019', serialNumber: 1, fullName: 'CALEB KIPRUTO NJERU', maskedName: 'CALEB K***** N*****', school: 'KANGARU SCHOOL EMBU', year: '2019', dateAdded: '2019-01-12', status: 'Active' },
  { id: 'rec_2019_2', listId: 'list_2019', serialNumber: 2, fullName: 'ANN UNGARI MWANGI', maskedName: 'ANN U***** M*****', school: 'KANGARU GIRLS HIGH SCHOOL', year: '2019', dateAdded: '2019-01-12', status: 'Active' },
  { id: 'rec_2019_3', listId: 'list_2019', serialNumber: 3, fullName: 'CHRISTOPHER NDWIGA NJUE', maskedName: 'CHRISTOPHER N***** N*****', school: 'NGUVIU BOYS HIGH SCHOOL', year: '2019', dateAdded: '2019-01-13', status: 'Active' },
  { id: 'rec_2019_4', listId: 'list_2019', serialNumber: 4, fullName: 'JOY KAWIRA KINOTI', maskedName: 'JOY K***** K*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2019', dateAdded: '2019-01-14', status: 'Active' },

  // 2018 Cohort
  { id: 'rec_2018_1', listId: 'list_2018', serialNumber: 1, fullName: 'DANIEL WAMBUA MUTEGI', maskedName: 'DANIEL W***** M*****', school: 'MOI HIGH SCHOOL MBIRURI', year: '2018', dateAdded: '2018-01-14', status: 'Active' },
  { id: 'rec_2018_2', listId: 'list_2018', serialNumber: 2, fullName: 'CAROLINE KARIMI GICHOBI', maskedName: 'CAROLINE K***** G*****', school: 'KYENI GIRLS HIGH SCHOOL', year: '2018', dateAdded: '2018-01-14', status: 'Active' },
  { id: 'rec_2018_3', listId: 'list_2018', serialNumber: 3, fullName: 'PETER KIAGO NJERU', maskedName: 'PETER K***** N*****', school: 'KANGARU SCHOOL EMBU', year: '2018', dateAdded: '2018-01-15', status: 'Active' },
  { id: 'rec_2018_4', listId: 'list_2018', serialNumber: 4, fullName: 'SARAH NYAWIRA MBOGO', maskedName: 'SARAH N***** M*****', school: 'SIAKAGO GIRLS HIGH SCHOOL', year: '2018', dateAdded: '2018-01-15', status: 'Active' },

  // 2017 Cohort
  { id: 'rec_2017_1', listId: 'list_2017', serialNumber: 1, fullName: 'KEVIN MURIUKI', maskedName: 'KEVIN M*****', school: 'KANGARU SCHOOL EMBU', year: '2017', dateAdded: '2017-01-15', status: 'Active' },
  { id: 'rec_2017_2', listId: 'list_2017', serialNumber: 2, fullName: 'RACHAEL WANGARI', maskedName: 'RACHAEL W*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2017', dateAdded: '2017-01-15', status: 'Active' },
  { id: 'rec_2017_3', listId: 'list_2017', serialNumber: 3, fullName: 'ANTHONY MUKUNDI', maskedName: 'ANTHONY M*****', school: 'NGUVIU BOYS HIGH SCHOOL', year: '2017', dateAdded: '2017-01-16', status: 'Active' },

  // 2016 Cohort
  { id: 'rec_2016_1', listId: 'list_2016', serialNumber: 1, fullName: 'EUNICE NJOKI MBOGO', maskedName: 'EUNICE N***** M*****', school: 'KANGARU GIRLS HIGH SCHOOL', year: '2016', dateAdded: '2016-01-10', status: 'Active' },
  { id: 'rec_2016_2', listId: 'list_2016', serialNumber: 2, fullName: 'MARTIN KARIUKI NJERU', maskedName: 'MARTIN K***** N*****', school: 'KANGARU SCHOOL EMBU', year: '2016', dateAdded: '2016-01-10', status: 'Active' },
  { id: 'rec_2016_3', listId: 'list_2016', serialNumber: 3, fullName: 'JAMES MUGENDI', maskedName: 'JAMES M*****', school: 'MOI HIGH SCHOOL MBIRURI', year: '2016', dateAdded: '2016-01-11', status: 'Active' },

  // 2015 Cohort
  { id: 'rec_2015_1', listId: 'list_2015', serialNumber: 1, fullName: 'PATRICIA WANGARI', maskedName: 'PATRICIA W*****', school: 'KYENI GIRLS HIGH SCHOOL', year: '2015', dateAdded: '2015-01-10', status: 'Active' },
  { id: 'rec_2015_2', listId: 'list_2015', serialNumber: 2, fullName: 'STEPHEN MURIITHI', maskedName: 'STEPHEN M*****', school: 'KANGARU SCHOOL EMBU', year: '2015', dateAdded: '2015-01-10', status: 'Active' },
  { id: 'rec_2015_3', listId: 'list_2015', serialNumber: 3, fullName: 'EDWIN NYAGA', maskedName: 'EDWIN N*****', school: 'NGUVIU BOYS HIGH SCHOOL', year: '2015', dateAdded: '2015-01-11', status: 'Active' },
  { id: 'rec_2015_4', listId: 'list_2015', serialNumber: 4, fullName: 'CECILIA MAKENA', maskedName: 'CECILIA M*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2015', dateAdded: '2015-01-11', status: 'Active' },

  // 2014 Cohort
  { id: 'rec_2014_1', listId: 'list_2014', serialNumber: 1, fullName: 'GEORGE MUKUNDI', maskedName: 'GEORGE M*****', school: 'KANGARU SCHOOL EMBU', year: '2014', dateAdded: '2014-01-12', status: 'Active' },
  { id: 'rec_2014_2', listId: 'list_2014', serialNumber: 2, fullName: 'MARY WANJIKU', maskedName: 'MARY W*****', school: 'KANGARU GIRLS HIGH SCHOOL', year: '2014', dateAdded: '2014-01-12', status: 'Active' },
  { id: 'rec_2014_3', listId: 'list_2014', serialNumber: 3, fullName: 'SIMON KARIUKI', maskedName: 'SIMON K*****', school: 'NGUVIU BOYS HIGH SCHOOL', year: '2014', dateAdded: '2014-01-13', status: 'Active' },

  // 2013 Cohort
  { id: 'rec_2013_1', listId: 'list_2013', serialNumber: 1, fullName: 'BONIFACE KINYUA MURIITHI', maskedName: 'BONIFACE K***** M*****', school: 'KANGARU SCHOOL EMBU', year: '2013', dateAdded: '2013-01-10', status: 'Active' },
  { id: 'rec_2013_2', listId: 'list_2013', serialNumber: 2, fullName: 'BEATRICE WAMBUI KARIUKI', maskedName: 'BEATRICE W***** K*****', school: 'KANGARU GIRLS HIGH SCHOOL', year: '2013', dateAdded: '2013-01-10', status: 'Active' },
  { id: 'rec_2013_3', listId: 'list_2013', serialNumber: 3, fullName: 'KENNEDY MUGENDI NYAGA', maskedName: 'KENNEDY M***** N*****', school: 'NGUVIU BOYS HIGH SCHOOL', year: '2013', dateAdded: '2013-01-11', status: 'Active' },

  // 2012 Cohort
  { id: 'rec_2012_1', listId: 'list_2012', serialNumber: 1, fullName: 'ANTHONY MUNENE NJERU', maskedName: 'ANTHONY M***** N*****', school: 'KANGARU SCHOOL EMBU', year: '2012', dateAdded: '2012-01-12', status: 'Active' },
  { id: 'rec_2012_2', listId: 'list_2012', serialNumber: 2, fullName: 'ELIZABETH MUTHONI MBOGO', maskedName: 'ELIZABETH M***** M*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2012', dateAdded: '2012-01-12', status: 'Active' },
  { id: 'rec_2012_3', listId: 'list_2012', serialNumber: 3, fullName: 'DAVID MUKUNDI KARIUKI', maskedName: 'DAVID M***** K*****', school: 'MOI HIGH SCHOOL MBIRURI', year: '2012', dateAdded: '2012-01-13', status: 'Active' },

  // 2011 Cohort (Inaugural)
  { id: 'rec_2011_1', listId: 'list_2011', serialNumber: 1, fullName: 'MOSES NJERU', maskedName: 'MOSES N*****', school: 'KANGARU SCHOOL EMBU', year: '2011', dateAdded: '2011-01-10', status: 'Active' },
  { id: 'rec_2011_2', listId: 'list_2011', serialNumber: 2, fullName: 'JANE MUTHONI', maskedName: 'JANE M*****', school: "ST. ANNE'S KIRIARI GIRLS HIGH SCHOOL", year: '2011', dateAdded: '2011-01-10', status: 'Active' }
];


const INITIAL_LOGS: BeneficiaryAuditLog[] = [];

const INITIAL_NOTIFICATIONS: BeneficiaryNotification[] = [];

class BeneficiariesStore {
  private lists: AnnualBeneficiaryList[] = INITIAL_LISTS;
  private records: BeneficiaryRecord[] = INITIAL_RECORDS;
  private logs: BeneficiaryAuditLog[] = INITIAL_LOGS;
  private notifications: BeneficiaryNotification[] = INITIAL_NOTIFICATIONS;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const storedL = localStorage.getItem('neema_beneficiary_lists');
        const storedR = localStorage.getItem('neema_beneficiary_records');
        const storedLogs = localStorage.getItem('neema_beneficiary_logs');
        const storedNotifs = localStorage.getItem('neema_beneficiary_notifs');

        if (storedL) {
          let parsedL: AnnualBeneficiaryList[] = JSON.parse(storedL);
          // Filter out 2025 and 2027 lists if present
          parsedL = parsedL.filter(l => l.year !== '2025' && l.year !== '2027');
          // Merge missing initial lists
          INITIAL_LISTS.forEach(initL => {
            if (initL.year !== '2027' && !parsedL.some(l => l.id === initL.id || l.year === initL.year)) {
              parsedL.push(initL);
            }
          });
          this.lists = parsedL;
        }

        if (storedR) {
          let parsedR: BeneficiaryRecord[] = JSON.parse(storedR);
          // Filter out 2025 and 2027 records if present
          parsedR = parsedR.filter(r => r.year !== '2025' && r.year !== '2027' && r.listId !== 'list_2025' && r.listId !== 'list_2027');

          // Purge known duplicate 2026 records that belong to 2024
          parsedR = parsedR.filter(r => {
            if (r.listId === 'list_2026' || r.year === '2026') {
              const nameUpper = (r.fullName || '').toUpperCase().trim();
              if (nameUpper.includes('LORNA WAIRIMU') || nameUpper.includes('JOYCE WAWIRA') || nameUpper.includes('KELVIN KIMANZI')) {
                return false;
              }
            }
            return true;
          });

          // Merge missing initial records
          INITIAL_RECORDS.forEach(initR => {
            if (initR.year !== '2025' && initR.year !== '2027' && !parsedR.some(r => r.id === initR.id)) {
              parsedR.push(initR);
            }
          });

          // Global deduplication: ensure unique ID and unique student name per cohort
          const uniqueRecords: BeneficiaryRecord[] = [];
          const seenIds = new Set<string>();
          const seenStudentCohort = new Set<string>();

          parsedR.forEach(r => {
            const studentKey = `${r.listId}::${(r.fullName || '').trim().toUpperCase()}`;
            if (!seenIds.has(r.id) && !seenStudentCohort.has(studentKey)) {
              seenIds.add(r.id);
              seenStudentCohort.add(studentKey);
              uniqueRecords.push(r);
            }
          });

          // Group by list and re-sequence serial numbers 1..N
          const groupedByList: Record<string, BeneficiaryRecord[]> = {};
          uniqueRecords.forEach(r => {
            if (!groupedByList[r.listId]) groupedByList[r.listId] = [];
            groupedByList[r.listId].push(r);
          });

          const finalRecords: BeneficiaryRecord[] = [];
          Object.keys(groupedByList).forEach(listId => {
            groupedByList[listId].forEach((rec, idx) => {
              rec.serialNumber = idx + 1;
              finalRecords.push(rec);
            });
          });

          const hadChanges = finalRecords.length !== parsedR.length;
          this.records = finalRecords;

          // If cleanup altered records, sync immediately to storage
          if (hadChanges) {
            localStorage.setItem('neema_beneficiary_records', JSON.stringify(this.records));
          }
        }

        if (storedLogs) this.logs = JSON.parse(storedLogs);
        if (storedNotifs) this.notifications = JSON.parse(storedNotifs);
      } catch (e) {
        console.error('Failed to parse beneficiaries store from local storage', e);
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('neema_beneficiary_lists', JSON.stringify(this.lists));
        localStorage.setItem('neema_beneficiary_records', JSON.stringify(this.records));
        localStorage.setItem('neema_beneficiary_logs', JSON.stringify(this.logs));
        localStorage.setItem('neema_beneficiary_notifs', JSON.stringify(this.notifications));
        window.dispatchEvent(new CustomEvent('neema_cms_beneficiaries_lists_updated'));
      } catch (e) {
        console.error('Failed to save beneficiaries store to local storage', e);
      }
    }
  }

  public getLists(): AnnualBeneficiaryList[] {
    return this.lists.map(l => ({
      ...l,
      recordsCount: this.records.filter(r => r.listId === l.id).length
    }));
  }

  public getPublishedLists(): { year: string; title: string; students: { id: string; name: string; school: string }[] }[] {
    const published = this.lists.filter(l => (l.status === 'Published' || l.status === 'Archived') && l.year !== '2027');
    
    // Sort by year descending
    published.sort((a, b) => b.year.localeCompare(a.year));

    return published.map(l => {
      const listRecs = this.records
        .filter(r => r.listId === l.id)
        .sort((a, b) => a.serialNumber - b.serialNumber);

      // Ensure no duplicate students inside published view
      const seenNames = new Set<string>();
      const dedupedRecs: BeneficiaryRecord[] = [];
      listRecs.forEach(r => {
        const key = (r.fullName || '').trim().toUpperCase();
        if (!seenNames.has(key)) {
          seenNames.add(key);
          dedupedRecs.push(r);
        }
      });

      return {
        year: l.year,
        title: l.title,
        students: dedupedRecs.map((r, idx) => ({
          id: String(idx + 1).padStart(3, '0'),
          name: r.fullName, // Will be masked on public display via maskBeneficiaryName or pre-masked name
          school: r.school
        }))
      };
    });
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
  public createList(data: { year: string; title: string; description?: string; status: 'Draft' | 'Published' | 'Archived'; createdBy: string }): AnnualBeneficiaryList {
    const now = new Date().toISOString().split('T')[0];
    const newList: AnnualBeneficiaryList = {
      id: `list_${data.year.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}`,
      year: data.year,
      title: data.title,
      description: data.description || '',
      status: data.status,
      yearIdentifier: `NH-BEN-${data.year}`,
      dateCreated: now,
      createdBy: data.createdBy,
      lastModified: now,
      recordsCount: 0
    };

    this.lists.unshift(newList);
    this.addLog('List Created', `Created annual list "${newList.title}" (${newList.yearIdentifier}).`, data.createdBy);
    this.addNotification('New Beneficiary List Created', `Annual list ${newList.yearIdentifier} was created as ${newList.status}.`, 'info');
    this.saveToStorage();
    return newList;
  }

  // Update List Metadata & Publication Status
  public updateList(id: string, updates: Partial<AnnualBeneficiaryList>, updatedBy: string): AnnualBeneficiaryList | null {
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
        this.addNotification('Beneficiary List Published', `Annual list "${list.title}" is now published live on the public website.`, 'success');
      } else if (updates.status === 'Archived') {
        this.addLog('List Archived', `Archived annual beneficiary list "${list.title}".`, updatedBy);
        this.addNotification('Beneficiary List Archived', `Annual list "${list.title}" was archived.`, 'warning');
      }
    } else {
      this.addLog('List Updated', `Updated metadata for annual list "${list.title}".`, updatedBy);
    }

    this.saveToStorage();
    return list;
  }

  public deleteList(id: string, deletedBy: string) {
    const list = this.lists.find(l => l.id === id);
    if (!list) return;

    this.lists = this.lists.filter(l => l.id !== id);
    this.records = this.records.filter(r => r.listId !== id);

    this.addLog('List Updated', `Deleted beneficiary list "${list.title}" and associated records.`, deletedBy);
    this.saveToStorage();
  }

  // Recalculate Sequential Serial Numbers (1..N) for a list
  private resequence(listId: string) {
    const listRecs = this.records
      .filter(r => r.listId === listId)
      .sort((a, b) => a.serialNumber - b.serialNumber);

    listRecs.forEach((r, idx) => {
      r.serialNumber = idx + 1;
    });
  }

  // Add Beneficiary Record
  public addBeneficiary(listId: string, fullName: string, school: string, addedBy: string): BeneficiaryRecord | null {
    const list = this.lists.find(l => l.id === listId);
    if (!list) return null;

    const listRecs = this.getRecordsByList(listId);
    const newSeq = listRecs.length + 1;
    const now = new Date().toISOString().split('T')[0];

    const newRecord: BeneficiaryRecord = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      listId,
      serialNumber: newSeq,
      fullName: fullName.toUpperCase(),
      maskedName: maskBeneficiaryName(fullName.toUpperCase()),
      school: school.toUpperCase(),
      year: list.year,
      dateAdded: now,
      status: 'Active'
    };

    this.records.push(newRecord);
    this.resequence(listId);
    this.addLog('Beneficiary Added', `Added beneficiary "${fullName}" to list ${list.yearIdentifier}.`, addedBy);
    this.saveToStorage();
    return newRecord;
  }

  // Edit Beneficiary Record
  public updateBeneficiary(id: string, fullName: string, school: string, updatedBy: string): BeneficiaryRecord | null {
    const rec = this.records.find(r => r.id === id);
    if (!rec) return null;

    rec.fullName = fullName.toUpperCase();
    rec.maskedName = maskBeneficiaryName(fullName.toUpperCase());
    rec.school = school.toUpperCase();

    this.addLog('Beneficiary Edited', `Updated beneficiary record No. ${rec.serialNumber} ("${fullName}").`, updatedBy);
    this.saveToStorage();
    return rec;
  }

  // Delete Beneficiary Record
  public deleteBeneficiary(id: string, deletedBy: string) {
    const rec = this.records.find(r => r.id === id);
    if (!rec) return;

    const listId = rec.listId;
    this.records = this.records.filter(r => r.id !== id);
    this.resequence(listId);

    this.addLog('Beneficiary Deleted', `Deleted beneficiary record No. ${rec.serialNumber} ("${rec.fullName}") from list.`, deletedBy);
    this.saveToStorage();
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
    this.saveToStorage();
  }

  // Bulk Import
  public bulkImport(listId: string, items: { fullName: string; school: string }[], importedBy: string): { imported: number; duplicates: number } {
    const list = this.lists.find(l => l.id === listId);
    if (!list) return { imported: 0, duplicates: 0 };

    const existingRecs = this.getRecordsByList(listId);
    const existingNames = new Set(existingRecs.map(r => r.fullName.toUpperCase()));

    let importedCount = 0;
    let duplicateCount = 0;
    const now = new Date().toISOString().split('T')[0];

    items.forEach(item => {
      const cleanName = item.fullName.trim().toUpperCase();
      const cleanSchool = item.school.trim().toUpperCase();

      if (!cleanName) return;

      if (existingNames.has(cleanName)) {
        duplicateCount++;
      } else {
        existingNames.add(cleanName);
        importedCount++;
        this.records.push({
          id: `rec_imp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          listId,
          serialNumber: this.records.filter(r => r.listId === listId).length + 1,
          fullName: cleanName,
          maskedName: maskBeneficiaryName(cleanName),
          school: cleanSchool,
          year: list.year,
          dateAdded: now,
          status: 'Active'
        });
      }
    });

    this.resequence(listId);
    this.addLog('Import Completed', `Imported ${importedCount} records into ${list.yearIdentifier} (${duplicateCount} duplicates skipped).`, importedBy);
    this.addNotification('Import Completed', `Successfully added ${importedCount} beneficiaries to list ${list.yearIdentifier}.`, 'success');
    this.saveToStorage();

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
      this.saveToStorage();
    }
  }
}

export const beneficiariesStore = new BeneficiariesStore();
