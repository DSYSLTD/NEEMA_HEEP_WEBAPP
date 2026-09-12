import { supabase } from '../lib/supabase';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  actorRole: string;
  category: 'Auth' | 'Security Policy' | 'Session' | 'Device' | 'API' | 'System' | 'Backup' | 'CMS' | 'Database' | string;
  status: 'Success' | 'Failed' | 'Warning' | 'Blocked';
  ipAddress: string;
  location: string;
  details: string;
  riskScore: number;
}

const LOCAL_STORAGE_KEY = 'neema_global_audit_logs_v1';

export async function fetchAuditLogsFromDB(): Promise<AuditLogEntry[]> {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const mapped: AuditLogEntry[] = data.map((item: any) => ({
        id: item.id,
        timestamp: item.created_at ? new Date(item.created_at).toLocaleString() : new Date().toLocaleString(),
        event: item.event || 'System Action',
        actor: item.actor || 'Patrick Munene',
        actorRole: item.actor_role || 'Superadmin',
        category: item.category || 'System',
        status: item.status || 'Success',
        ipAddress: item.ip_address || '102.218.45.12',
        location: item.location || 'Nairobi, Kenya',
        details: item.details || '',
        riskScore: item.risk_score || 0,
      }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mapped));
      return mapped;
    }
  } catch (err) {
    console.warn('[AuditService] Supabase audit log fetch failed, using cached logs:', err);
  }

  // Fallback to local cache if offline or table empty
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }

  return [];
}

export async function logGlobalAudit(
  event: string,
  details: string,
  category: string = 'System',
  status: 'Success' | 'Failed' | 'Warning' | 'Blocked' = 'Success',
  actor: string = 'Patrick Munene',
  actorRole: string = 'Superadmin'
): Promise<void> {
  const newEntry: AuditLogEntry = {
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    timestamp: new Date().toLocaleString(),
    event,
    actor,
    actorRole,
    category,
    status,
    ipAddress: '102.218.45.12',
    location: 'Nairobi, Kenya',
    details,
    riskScore: status === 'Failed' ? 50 : 0,
  };

  // 1. Update Local Storage
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  let existing: AuditLogEntry[] = [];
  if (saved) {
    try { existing = JSON.parse(saved); } catch (e) { console.error(e); }
  }
  const updated = [newEntry, ...existing];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

  // Broadcast event for UI components to reload audit logs
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('neema_audit_log_updated'));
  }

  // 2. Persist to Supabase audit_logs table
  try {
    await supabase.from('audit_logs').insert([{
      actor,
      actor_role: actorRole,
      event,
      category,
      status,
      ip_address: '102.218.45.12',
      location: 'Nairobi, Kenya',
      details,
      risk_score: newEntry.riskScore,
    }]);
  } catch (err) {
    console.warn('[AuditService] Could not insert log into Supabase audit_logs table:', err);
  }
}
