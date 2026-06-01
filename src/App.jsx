import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import OverviewPage from './pages/OverviewPage';
import LeadsPage from './pages/LeadsPage';
import WebsitesPage from './pages/WebsitesPage';
import OutreachPage from './pages/OutreachPage';
import RevenuePage from './pages/RevenuePage';
import PipelinePage from './pages/PipelinePage';
import PerformancePage from './pages/PerformancePage';
import AutomationPage from './pages/AutomationPage';
import SettingsPage from './pages/SettingsPage';

// Context & Modals
import { useAppState } from './data/appState';
import LeadDetailPanel from './components/LeadDetailPanel';
import AddLeadModal from './components/AddLeadModal';
import { X } from 'lucide-react';

const viewConfig = {
  overview:    { title: 'Overview',           subtitle: 'System command center' },
  pipeline:    { title: 'Pipeline',           subtitle: 'Lead progression tracker' },
  leads:       { title: 'Lead Management',    subtitle: 'Discover & qualify prospects' },
  websites:    { title: 'Website Gallery',    subtitle: 'AI-generated sites' },
  outreach:    { title: 'Outreach Tracker',   subtitle: 'Campaigns & engagement' },
  revenue:     { title: 'Revenue Analytics',  subtitle: 'Financial performance' },
  performance: { title: 'Performance',        subtitle: 'System health & metrics' },
  automation:  { title: 'Automation',         subtitle: 'Pipeline job control' },
  settings:    { title: 'Settings',           subtitle: 'System configuration' },
};

export default function App() {
  const [activeView, setActiveView] = useState('overview');
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  const { leads, toasts, dismissToast } = useAppState();

  // Find the selected lead object
  const selectedLead = useMemo(() => {
    return leads.find(l => l.id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  // Compute live counts for Sidebar badges
  const liveCounts = useMemo(() => {
    const totalLeads = leads.length;
    const totalSites = leads.filter(l => l.generatedSite).length;
    const totalOutreach = leads.filter(l => l.outreach).length;
    return {
      leads: totalLeads.toString(),
      sites: totalSites.toString(),
      outreach: totalOutreach.toString()
    };
  }, [leads]);

  const config = viewConfig[activeView] || viewConfig.overview;

  const renderPage = () => {
    switch (activeView) {
      case 'overview':    return <OverviewPage onSelectLead={setSelectedLeadId} />;
      case 'pipeline':    return <PipelinePage onSelectLead={setSelectedLeadId} />;
      case 'leads':       return <LeadsPage onSelectLead={setSelectedLeadId} />;
      case 'websites':    return <WebsitesPage onSelectLead={setSelectedLeadId} />;
      case 'outreach':    return <OutreachPage onSelectLead={setSelectedLeadId} />;
      case 'revenue':     return <RevenuePage />;
      case 'performance': return <PerformancePage />;
      case 'automation':  return <AutomationPage />;
      case 'settings':    return <SettingsPage />;
      default:            return <OverviewPage onSelectLead={setSelectedLeadId} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activeView={activeView} onNavigate={setActiveView} liveCounts={liveCounts} />
      <div className="main-content">
        <TopBar
          title={config.title}
          subtitle={config.subtitle}
          onAddLeadClick={() => setIsAddLeadModalOpen(true)}
        />
        <div className="page-content" key={activeView}>
          {renderPage()}
        </div>
      </div>

      {/* Slide-out details drawer */}
      {selectedLead && (
        <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedLeadId(null)} />
      )}

      {/* Add Lead Modal */}
      {isAddLeadModalOpen && (
        <AddLeadModal onClose={() => setIsAddLeadModalOpen(false)} />
      )}

      {/* Toast Notifications Stack */}
      <div style={{
        position: 'fixed',
        top: 'var(--space-4)',
        right: 'var(--space-4)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div
            key={t.id}
            className="live-toast animate-in"
            style={{
              position: 'relative',
              top: 'auto',
              right: 'auto',
              pointerEvents: 'auto',
            }}
          >
            <span className="live-toast-icon">{t.icon}</span>
            <div className="live-toast-content">
              <div className="live-toast-title">{t.title}</div>
              <div className="live-toast-detail">{t.detail}</div>
            </div>
            <button className="live-toast-close" onClick={() => dismissToast(t.id)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
