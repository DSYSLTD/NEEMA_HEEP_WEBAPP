
import { useState, useEffect } from 'react';
import { leadService, Lead } from '../services/leadService';

export function useLeads(shouldSubscribe = false) {
  const [leads, setLeads] = useState<Lead[]>(leadService.getLeads());

  useEffect(() => {
    if (shouldSubscribe) {
      leadService.startSync();
      const unsub = leadService.subscribe(setLeads);
      return () => {
        unsub();
      };
    }
  }, [shouldSubscribe]);

  return {
    leads,
    submitLead: leadService.submitLead.bind(leadService),
    updateLeadStatus: leadService.updateLeadStatus.bind(leadService)
  };
}
