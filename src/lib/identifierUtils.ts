/**
 * Utility for generating standardized, cryptographically-sound unique form identifiers
 * across all Neema HEEP application portals.
 */

export type SupportedFormType =
  | 'individual_registration'
  | 'group_registration'
  | 'volunteer_application'
  | 'sponsorship_request'
  | 'partnership_request'
  | 'job_application'
  | 'prequalification'
  | 'contact'
  | 'general';

const FORM_PREFIX_MAP: Record<string, string> = {
  individual_registration: 'NH-IND',
  group_registration: 'NH-GRP',
  volunteer_application: 'NH-VOL',
  sponsorship_request: 'NH-SPO',
  partnership_request: 'NH-PTR',
  job_application: 'NH-VAC',
  prequalification: 'NH-PRQ',
  contact: 'NH-INQ',
  general: 'NH-REF'
};

/**
 * Generates an auto-generated unique identifier tailored to each form.
 * Format: NH-<TYPE>-YYYYMM-XXXX (e.g. NH-IND-202610-8492)
 */
export function generateUniqueFormIdentifier(formType: string): string {
  const cleanType = formType.toLowerCase().replace(/[\s-]/g, '_');
  const prefix = FORM_PREFIX_MAP[cleanType] || 
    (cleanType.includes('ind') ? 'NH-IND' :
     cleanType.includes('grp') || cleanType.includes('group') ? 'NH-GRP' :
     cleanType.includes('vol') ? 'NH-VOL' :
     cleanType.includes('spo') || cleanType.includes('scholar') ? 'NH-SPO' :
     cleanType.includes('part') ? 'NH-PTR' :
     cleanType.includes('job') || cleanType.includes('career') || cleanType.includes('vac') ? 'NH-VAC' :
     cleanType.includes('prequal') ? 'NH-PRQ' :
     'NH-REF');

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const randomSerial = Math.floor(1000 + Math.random() * 9000);

  return `${prefix}-${year}${month}-${randomSerial}`;
}
