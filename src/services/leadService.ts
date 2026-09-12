import { supabase } from '../lib/supabase';

export type LeadType = 'Registration' | 'Pre-Qualification' | 'Contact' | 'Resource' | 'Career' | 'Partnership' | 'Callback' | 'Volunteer' | 'Member Activation' | 'Sponsorship';

export const FORM_TABLE_MAP: Record<string, string> = {
  'Contact': 'contact_inquiries',
  'Sponsorship': 'sponsorship_requests',
  'Career': 'job_applications',
  'Pre-Qualification': 'pre_qualifications',
  'Volunteer': 'volunteer_applications',
  'Partnership': 'partnership_requests',
  'Callback': 'callback_requests',
  'Registration': 'membership_registrations',
  'Member Activation': 'membership_registrations',
  'Resource': 'newsletter_subscriptions',
  'Newsletter': 'newsletter_subscriptions',
  'Comment': 'article_comments'
};

export interface Lead {
  id: string;
  type: LeadType;
  name: string;
  email?: string;
  phone?: string;
  details?: any;
  status: 'New' | 'Followed-up' | 'Qualified' | 'Closed';
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
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && data) {
        this.leads = data.map((item: any) => ({
          id: item.id,
          type: item.type || 'Contact',
          name: item.full_name || item.name || 'Anonymous',
          email: item.email,
          phone: item.phone,
          details: item.details,
          status: item.status || 'New',
          timestamp: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
          signupSource: item.signup_source
        }));
        this.notify();
      }

      // Realtime subscription via Supabase
      if (!this.channel) {
        this.channel = supabase
          .channel('public:leads')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
            this.fetchLeads();
          })
          .subscribe();
      }
    } catch (error) {
      console.warn("Supabase Lead Sync Notice:", error);
    }
  }

  private async fetchLeads() {
    try {
      const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(100);
      if (data) {
        this.leads = data.map((item: any) => ({
          id: item.id,
          type: item.type || 'Contact',
          name: item.full_name || item.name || 'Anonymous',
          email: item.email,
          phone: item.phone,
          details: item.details,
          status: item.status || 'New',
          timestamp: item.created_at ? new Date(item.created_at).getTime() : Date.now()
        }));
        this.notify();
      }
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
    const targetTable = leadData.customTable || FORM_TABLE_MAP[leadData.type] || 'leads';
    const payload = {
      full_name: leadData.name || 'Anonymous',
      email: leadData.email || '',
      phone: leadData.phone || '',
      type: leadData.type,
      details: leadData.details || {},
      status: 'New',
      consent_given: leadData.consentGiven ? 'Yes' : 'No',
      signup_source: leadData.signupSource || (typeof window !== 'undefined' ? window.location.href : ''),
      created_at: new Date().toISOString()
    };

    try {
      // 1. Primary insert to form-specific individual Supabase table
      const { data, error } = await supabase
        .from(targetTable)
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.warn(`[leadService] Primary insert into ${targetTable} notice:`, error.message);
        // Fallback to generic leads table
        const { data: fbData } = await supabase
          .from('leads')
          .insert([payload])
          .select()
          .single();
        return { id: fbData?.id || 'temp-' + Date.now(), ...leadData };
      }

      // 2. Also record in leads table for consolidated tracking
      if (targetTable !== 'leads') {
        (async () => {
          try {
            await supabase.from('leads').insert([payload]);
          } catch {}
        })();
      }

      return { id: data?.id || 'temp-' + Date.now(), ...leadData };
    } catch (error) {
      console.error(`Error submitting lead to Supabase (${targetTable}): `, error);
      return { id: 'temp-' + Date.now(), ...leadData };
    }
  }

  public getLeads() {
    return this.leads;
  }

  public async updateLeadStatus(id: string, status: Lead['status']) {
    try {
      await supabase.from('leads').update({ status }).eq('id', id);
      this.fetchLeads();
    } catch (error) {
      console.error("Error updating lead status in Supabase: ", error);
    }
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
