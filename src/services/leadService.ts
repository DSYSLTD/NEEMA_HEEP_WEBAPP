import { supabase } from '../lib/supabase';

export type LeadType = 
  | 'Registration' 
  | 'Individual Registration'
  | 'Group Registration'
  | 'Pre-Qualification' 
  | 'Contact' 
  | 'Resource' 
  | 'Career' 
  | 'Partnership' 
  | 'Callback' 
  | 'Volunteer' 
  | 'Member Activation' 
  | 'Sponsorship'
  | 'Newsletter';

export const FORM_TABLE_MAP: Record<string, string> = {
  'Pre-Qualification': 'prequalifications',
  'Callback': 'callback_requests',
  'Contact': 'contact_messages',
  'Career': 'job_applications',
  'Volunteer': 'volunteer_applications',
  'Partnership': 'partnership_requests',
  'Sponsorship': 'sponsorship_requests',
  'Newsletter': 'newsletter_subscriptions',
  'Registration': 'individual_registrations',
  'Individual Registration': 'individual_registrations',
  'Group Registration': 'group_registrations',
  'Member Activation': 'individual_registrations'
};

export interface Lead {
  id: string;
  type: LeadType;
  name: string;
  email?: string;
  phone?: string;
  details?: any;
  status: 'New' | 'Followed-up' | 'Qualified' | 'Closed' | 'Submitted';
  timestamp: number;
  consentGiven?: string | boolean;
  signupSource?: string;
}

class LeadService {
  private static instance: LeadService;
  private leads: Lead[] = [];
  private listeners: ((leads: Lead[]) => void)[] = [];
  private channel: any = null;

  private constructor() {}

  public static getInstance(): LeadService {
    if (!LeadService.instance) {
      LeadService.instance = new LeadService();
    }
    return LeadService.instance;
  }

  public async startSync() {
    await this.fetchLeads();
  }

  private async fetchLeads() {
    try {
      const combined: Lead[] = [];

      // 1. Fetch Contact Messages
      const { data: contacts } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(25);
      if (contacts) {
        contacts.forEach((item: any) => {
          combined.push({
            id: item.id,
            type: 'Contact',
            name: item.name || 'Anonymous',
            email: item.email,
            phone: item.phone,
            details: { interest: item.interest, urgency: item.urgency, message: item.message, ...item.details },
            status: item.status || 'New',
            timestamp: item.created_at ? new Date(item.created_at).getTime() : Date.now()
          });
        });
      }

      // 2. Fetch Callbacks
      const { data: callbacks } = await supabase
        .from('callback_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(25);
      if (callbacks) {
        callbacks.forEach((item: any) => {
          combined.push({
            id: item.id,
            type: 'Callback',
            name: item.name || 'Anonymous',
            email: item.email,
            phone: item.phone,
            details: { interest: item.interest, preferredTime: item.preferred_time, ...item.details },
            status: item.status || 'New',
            timestamp: item.created_at ? new Date(item.created_at).getTime() : Date.now()
          });
        });
      }

      // 3. Fetch Pre-Qualifications
      const { data: prequals } = await supabase
        .from('prequalifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(25);
      if (prequals) {
        prequals.forEach((item: any) => {
          combined.push({
            id: item.id,
            type: 'Pre-Qualification',
            name: item.full_name || 'Anonymous',
            email: item.email,
            phone: item.phone,
            details: item.details || {},
            status: item.status || 'New',
            timestamp: item.created_at ? new Date(item.created_at).getTime() : Date.now()
          });
        });
      }

      // 4. Fetch Volunteers
      const { data: vols } = await supabase
        .from('volunteer_applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(25);
      if (vols) {
        vols.forEach((item: any) => {
          combined.push({
            id: item.id,
            type: 'Volunteer',
            name: item.full_name || 'Anonymous',
            email: item.email,
            phone: item.phone,
            details: item.details || {},
            status: item.status || 'New',
            timestamp: item.created_at ? new Date(item.created_at).getTime() : Date.now()
          });
        });
      }

      // Sort descending by timestamp
      combined.sort((a, b) => b.timestamp - a.timestamp);
      this.leads = combined;
      this.notify();
    } catch (err) {
      console.warn("Fetch leads error:", err);
    }
  }

  public stopSync() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }

  public async syncPartialLead(partialData: { name?: string; email: string; phone?: string; type: string; step?: number }) {
    try {
      await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...partialData,
          name: partialData.name || 'Incomplete Lead',
          signupSource: (typeof window !== 'undefined' ? window.location.href : '') + ' (Partial Step 1 Sync)',
          details: { partialSync: true, stepCompleted: partialData.step || 1 }
        })
      });
    } catch (err) {
      console.warn('Partial Lead Sync Warning:', err);
    }
  }

  public async submitLead(leadData: Omit<Lead, 'id' | 'status' | 'timestamp'> & { customTable?: string }) {
    const targetTable = leadData.customTable || FORM_TABLE_MAP[leadData.type] || 'contact_messages';
    const details = leadData.details || {};
    
    // Construct schema-specific payload for the dedicated target table
    let payload: Record<string, any> = {
      status: 'New',
      created_at: new Date().toISOString()
    };

    switch (targetTable) {
      case 'callback_requests':
        payload = {
          name: leadData.name || 'Anonymous',
          phone: leadData.phone || '',
          email: leadData.email || '',
          interest: details.interest || 'General Loan Inquiry',
          preferred_time: details.preferredTime || 'Morning (8am - 12pm)',
          status: 'New',
          notes: details.notes || '',
          details: details,
          created_at: new Date().toISOString()
        };
        break;

      case 'contact_messages':
        payload = {
          name: leadData.name || 'Anonymous',
          phone: leadData.phone || '',
          email: leadData.email || '',
          interest: details.interest || 'General Inquiry',
          urgency: details.urgency || 'Normal',
          message: details.message || '',
          status: 'New',
          notes: details.notes || '',
          details: details,
          created_at: new Date().toISOString()
        };
        break;

      case 'prequalifications':
        payload = {
          full_name: leadData.name || 'Anonymous',
          phone: leadData.phone || '',
          email: leadData.email || '',
          business_type: details.businessType || details.sector || '',
          years_in_business: details.yearsInBusiness || details.businessAge || '',
          requested_amount: details.requestedAmount || details.loanAmount || details.amount || '',
          monthly_turnover: details.monthlyTurnover || details.monthlyRevenue || '',
          collateral_type: details.collateralType || details.collateral || '',
          prequalification_score: details.score ? Number(details.score) : 85,
          recommended_product: details.recommendedProduct || '',
          county: details.county || '',
          details: details,
          status: 'New',
          signup_source: leadData.signupSource || '',
          consent_given: 'Yes',
          created_at: new Date().toISOString()
        };
        break;

      case 'volunteer_applications':
        payload = {
          full_name: leadData.name || 'Anonymous',
          email: leadData.email || '',
          phone: leadData.phone || '',
          profession: details.profession || '',
          role: details.role || 'Academic Mentorship',
          availability: details.availability || '',
          motivation: details.motivation || '',
          county: details.county || '',
          status: 'New',
          details: details,
          created_at: new Date().toISOString()
        };
        break;

      case 'partnership_requests':
        payload = {
          organization_name: details.orgName || details.organizationName || leadData.name || '',
          contact_person: details.contactPerson || leadData.name || '',
          email: leadData.email || '',
          phone: leadData.phone || '',
          partnership_type: details.partnershipType || 'Donor / Grant Funding',
          proposal_summary: details.message || details.summary || '',
          status: 'New',
          details: details,
          created_at: new Date().toISOString()
        };
        break;

      case 'sponsorship_requests':
        payload = {
          organization_name: details.organizationName || details.orgName || leadData.name || '',
          contact_person: details.contactPerson || leadData.name || '',
          email: leadData.email || '',
          phone: leadData.phone || '',
          program_name: details.programName || 'Education Support',
          sponsorship_amount: details.sponsorshipAmount ? Number(details.sponsorshipAmount) : 0,
          beneficiary_focus: details.beneficiaryFocus || '',
          status: 'New',
          details: details,
          created_at: new Date().toISOString()
        };
        break;

      case 'newsletter_subscriptions':
        payload = {
          email: leadData.email || '',
          name: leadData.name || '',
          frequency: details.frequency || 'Weekly',
          interests: details.interests || 'Financial Insights & News',
          status: 'Active',
          source: leadData.signupSource || 'Website',
          created_at: new Date().toISOString()
        };
        break;

      case 'individual_registrations':
        payload = {
          full_name: leadData.name || '',
          phone: leadData.phone || '',
          email: leadData.email || '',
          details: details,
          status: 'Submitted',
          created_at: new Date().toISOString()
        };
        break;

      case 'group_registrations':
        payload = {
          group_name: leadData.name || 'Unnamed Group',
          representative_phone: leadData.phone || '',
          representative_email: leadData.email || '',
          details: details,
          status: 'Submitted',
          created_at: new Date().toISOString()
        };
        break;

      default:
        payload = {
          full_name: leadData.name || 'Anonymous',
          email: leadData.email || '',
          phone: leadData.phone || '',
          details: details,
          status: 'New',
          created_at: new Date().toISOString()
        };
        break;
    }

    try {
      const { data, error } = await supabase
        .from(targetTable)
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.warn(`[leadService] Primary insert into ${targetTable} notice:`, error.message);
        // Fallback to contact_messages if specialized insert had an issue
        if (targetTable !== 'contact_messages') {
          try {
            await supabase.from('contact_messages').insert([{
              name: leadData.name || 'Anonymous',
              email: leadData.email || '',
              phone: leadData.phone || '',
              interest: leadData.type,
              message: JSON.stringify(details),
              status: 'New'
            }]);
          } catch {}
        }
      }

      // Add to local state
      const newLead: Lead = {
        id: data?.id || 'temp-' + Date.now(),
        type: leadData.type,
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        details: leadData.details,
        status: 'New',
        timestamp: Date.now()
      };
      this.leads.unshift(newLead);
      this.notify();

      return newLead;
    } catch (error) {
      console.error(`Error submitting lead to Supabase (${targetTable}): `, error);
      return { id: 'temp-' + Date.now(), ...leadData, status: 'New', timestamp: Date.now() };
    }
  }

  public getLeads() {
    return this.leads;
  }

  public async updateLeadStatus(id: string, status: Lead['status']) {
    try {
      await supabase.from('contact_messages').update({ status }).eq('id', id);
    } catch {}
    this.leads = this.leads.map(l => l.id === id ? { ...l, status } : l);
    this.notify();
  }

  public subscribe(callback: (leads: Lead[]) => void) {
    this.listeners.push(callback);
    callback(this.leads);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.leads));
  }
}

export const leadService = LeadService.getInstance();
