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

class BeneficiariesStore {
  private lists: AnnualBeneficiaryList[] = [];
  private records: BeneficiaryRecord[] = [];
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

      if (!listErr && remoteLists) {
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
      } else {
        this.lists = [];
      }

      // 2. Fetch beneficiaries from Supabase
      const { data: remoteRecs, error: recErr } = await supabase
        .from('beneficiaries')
        .select('*')
        .order('serial_number', { ascending: true });

      if (!recErr && remoteRecs) {
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
      } else {
        this.records = [];
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
