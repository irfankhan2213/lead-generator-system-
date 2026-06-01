import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

// ─── Global App State Context ───
const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [leads, setLeads] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [processing, setProcessing] = useState(new Set());

  // Initialize leads from mock data
  const initLeads = useCallback((mockLeads) => {
    if (leads.length === 0) {
      setLeads(mockLeads.map(l => ({ ...l })));
    }
  }, [leads.length]);

  // ─── Lead Actions ───
  const updateLeadStatus = useCallback((leadId, newStatus) => {
    setLeads(prev => prev.map(l =>
      l.id === leadId ? { ...l, status: newStatus, updatedAt: new Date().toISOString() } : l
    ));
    addNotification(`Lead ${leadId} moved to ${newStatus}`, 'status');
  }, []);

  const bulkUpdateStatus = useCallback((leadIds, newStatus) => {
    setLeads(prev => prev.map(l =>
      leadIds.includes(l.id) ? { ...l, status: newStatus, updatedAt: new Date().toISOString() } : l
    ));
    addNotification(`${leadIds.length} leads moved to ${newStatus}`, 'bulk');
  }, []);

  const deleteLead = useCallback((leadId) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    addNotification(`Lead ${leadId} archived`, 'delete');
  }, []);

  const addLead = useCallback((leadData) => {
    const newLead = {
      id: `lead-${String(Date.now()).slice(-6)}`,
      ...leadData,
      status: 'discovered',
      lqsScore: Math.floor(Math.random() * 30) + 60,
      source: 'Manual',
      website: { hasWebsite: false, lighthouseScore: 0, hasSsl: false, isMobile: false, missingFeatures: ['online_booking', 'contact_form', 'seo_optimization'] },
      social: { facebook: null, instagram: null, googleRating: null, reviewCount: 0 },
      generatedSite: null,
      outreach: null,
      revenue: null,
      createdAt: new Date().toISOString(),
    };
    setLeads(prev => [newLead, ...prev]);
    addNotification(`New lead added: ${leadData.businessName}`, 'add');
    addToast({ type: 'success', icon: '✅', title: 'Lead Added', detail: `${leadData.businessName} added to pipeline` });
    return newLead;
  }, []);

  // ─── Simulate Processing ───
  const generateSite = useCallback((leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setProcessing(prev => new Set([...prev, `gen-${leadId}`]));
    addToast({ type: 'info', icon: '🏗️', title: 'Generating Website', detail: `Building site for ${lead.businessName}...` });

    setTimeout(() => {
      setLeads(prev => prev.map(l => {
        if (l.id !== leadId) return l;
        return {
          ...l,
          status: 'generated',
          generatedSite: {
            previewUrl: `https://${lead.businessName.toLowerCase().replace(/[^a-z]/g, '-')}.preview.webleados.com`,
            lighthouseScore: Math.floor(Math.random() * 10) + 90,
            pages: Math.floor(Math.random() * 4) + 5,
            deployedAt: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        };
      }));
      setProcessing(prev => { const n = new Set(prev); n.delete(`gen-${leadId}`); return n; });
      addNotification(`Website generated for ${lead.businessName}`, 'generate');
      addToast({ type: 'success', icon: '✅', title: 'Website Ready', detail: `${lead.businessName} — site generated with Lighthouse 95+` });
    }, 3000);
  }, [leads]);

  const deploySite = useCallback((leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setProcessing(prev => new Set([...prev, `deploy-${leadId}`]));
    addToast({ type: 'info', icon: '🚀', title: 'Deploying Preview', detail: `Publishing ${lead.businessName} to preview...` });

    setTimeout(() => {
      setLeads(prev => prev.map(l =>
        l.id === leadId ? { ...l, status: 'deployed', updatedAt: new Date().toISOString() } : l
      ));
      setProcessing(prev => { const n = new Set(prev); n.delete(`deploy-${leadId}`); return n; });
      addToast({ type: 'success', icon: '🚀', title: 'Preview Live', detail: `${lead.businessName} is now live at preview URL` });
    }, 2000);
  }, [leads]);

  const sendOutreach = useCallback((leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setProcessing(prev => new Set([...prev, `outreach-${leadId}`]));
    addToast({ type: 'info', icon: '📧', title: 'Sending Outreach', detail: `Crafting personalized pitch for ${lead.businessName}...` });

    setTimeout(() => {
      setLeads(prev => prev.map(l => {
        if (l.id !== leadId) return l;
        return {
          ...l,
          status: 'outreach_sent',
          outreach: {
            channel: 'email',
            emailsSent: 1,
            opened: false,
            clicked: false,
            replied: false,
            sentAt: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        };
      }));
      setProcessing(prev => { const n = new Set(prev); n.delete(`outreach-${leadId}`); return n; });
      addNotification(`Outreach sent to ${lead.contact?.name} at ${lead.businessName}`, 'outreach');
      addToast({ type: 'success', icon: '📧', title: 'Outreach Sent', detail: `Email sent to ${lead.contact?.name}` });
    }, 2500);
  }, [leads]);

  const bulkGenerateSites = useCallback((leadIds) => {
    const count = leadIds.length;
    addToast({ type: 'info', icon: '🏗️', title: 'Batch Generation', detail: `Generating ${count} websites...` });
    setProcessing(prev => {
      const n = new Set(prev);
      leadIds.forEach(id => n.add(`gen-${id}`));
      return n;
    });

    leadIds.forEach((id, i) => {
      setTimeout(() => {
        setLeads(prev => prev.map(l => {
          if (l.id !== id) return l;
          return {
            ...l,
            status: 'generated',
            generatedSite: {
              previewUrl: `https://${l.businessName.toLowerCase().replace(/[^a-z]/g, '-')}.preview.webleados.com`,
              lighthouseScore: Math.floor(Math.random() * 10) + 90,
              pages: Math.floor(Math.random() * 4) + 5,
              deployedAt: new Date().toISOString(),
            },
            updatedAt: new Date().toISOString(),
          };
        }));
        setProcessing(prev => { const n = new Set(prev); n.delete(`gen-${id}`); return n; });

        if (i === leadIds.length - 1) {
          addToast({ type: 'success', icon: '✅', title: 'Batch Complete', detail: `${count} websites generated successfully` });
        }
      }, 2000 + i * 800);
    });
  }, []);

  const bulkSendOutreach = useCallback((leadIds) => {
    const count = leadIds.length;
    addToast({ type: 'info', icon: '📧', title: 'Batch Outreach', detail: `Sending outreach to ${count} leads...` });

    leadIds.forEach((id, i) => {
      setTimeout(() => {
        setLeads(prev => prev.map(l => {
          if (l.id !== id) return l;
          return {
            ...l,
            status: 'outreach_sent',
            outreach: {
              channel: 'email', emailsSent: 1, opened: false, clicked: false, replied: false,
              sentAt: new Date().toISOString(),
            },
            updatedAt: new Date().toISOString(),
          };
        }));
        if (i === leadIds.length - 1) {
          addToast({ type: 'success', icon: '📧', title: 'Outreach Complete', detail: `${count} emails sent` });
        }
      }, 1500 + i * 600);
    });
  }, []);

  // ─── Notifications ───
  const addNotification = useCallback((message, type = 'info') => {
    setNotifications(prev => [{
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      message,
      type,
      time: new Date().toISOString(),
      read: false,
    }, ...prev].slice(0, 50));
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // ─── Toasts ───
  const addToast = useCallback((toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
    setToasts(prev => [...prev, { ...toast, id }].slice(-4));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const isProcessing = useCallback((key) => processing.has(key), [processing]);

  const value = {
    leads, setLeads, initLeads,
    updateLeadStatus, bulkUpdateStatus, deleteLead, addLead,
    generateSite, deploySite, sendOutreach,
    bulkGenerateSites, bulkSendOutreach,
    notifications, addNotification, markNotificationsRead,
    toasts, addToast, dismissToast,
    processing, isProcessing,
  };

  return React.createElement(AppStateContext.Provider, { value }, children);
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be within AppStateProvider');
  return ctx;
}
