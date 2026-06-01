import React, { useState, useMemo } from 'react';
import {
  ExternalLink, RefreshCw, Eye, Send, Search,
  Globe, Gauge, Smartphone, FileCode, Loader
} from 'lucide-react';
import { statusConfig } from '../data/mockLeads';
import { useAppState } from '../data/appState';

export default function WebsitesPage({ onSelectLead }) {
  const { leads, sendOutreach, isProcessing } = useAppState();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const sitesLeads = useMemo(() => {
    let list = leads.filter(l => l.generatedSite);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(l => l.businessName.toLowerCase().includes(q));
    }
    if (filter !== 'all') {
      list = list.filter(l => l.status === filter);
    }
    return list;
  }, [leads, filter, search]);

  return (
    <div className="animate-in">
      {/* Header stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--space-5)' }}>
        <MiniStat label="Total Generated" value={sitesLeads.length} icon="🏗️" />
        <MiniStat
          label="Avg. Lighthouse"
          value={Math.round(sitesLeads.reduce((s, l) => s + (l.generatedSite?.lighthouseScore || 0), 0) / (sitesLeads.length || 1))}
          icon="⚡"
        />
        <MiniStat
          label="Total Pages"
          value={sitesLeads.reduce((s, l) => s + (l.generatedSite?.pages || 0), 0)}
          icon="📄"
        />
        <MiniStat
          label="Deployed Live"
          value={sitesLeads.filter(l => l.status === 'deployed' || l.status === 'outreach_sent').length}
          icon="🚀"
        />
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="filter-search">
          <Search className="filter-search-icon" size={14} />
          <input
            type="text"
            placeholder="Search generated sites..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          {[
            { key: 'all', label: 'All Sites' },
            { key: 'generated', label: 'Generated' },
            { key: 'deployed', label: 'Deployed' },
            { key: 'outreach_sent', label: 'Outreach Sent' },
          ].map(f => (
            <button
              key={f.key}
              className={`filter-chip ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {sitesLeads.map(lead => {
          const site = lead.generatedSite;
          const sc = statusConfig[lead.status] || { label: lead.status, color: 'purple' };
          const scoreLabel = site.lighthouseScore >= 90 ? 'high' : 'medium';
          const isSending = isProcessing(`outreach-${lead.id}`);

          return (
            <div key={lead.id} className="gallery-card" style={{ cursor: 'pointer' }} onClick={() => onSelectLead(lead.id)}>
              <div className="gallery-card-preview" onClick={e => e.stopPropagation()}>
                <div className="gallery-card-preview-placeholder">
                  <Globe size={32} style={{ opacity: 0.3 }} />
                  <span>{lead.businessName}</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                    {lead.industry} • {site.pages} pages
                  </span>
                </div>
                <div className="gallery-card-overlay">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => window.open(site.previewUrl, '_blank')}
                  >
                    <Eye size={13} /> Preview
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={isSending || !!lead.outreach}
                    onClick={() => sendOutreach(lead.id)}
                    style={{ gap: 4 }}
                  >
                    {isSending ? (
                      <Loader size={13} className="animate-spin" />
                    ) : (
                      <Send size={13} />
                    )}
                    {isSending ? 'Sending...' : lead.outreach ? 'Pitched' : 'Outreach'}
                  </button>
                </div>
              </div>
              <div className="gallery-card-body">
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <div>
                    <div className="gallery-card-name">{lead.businessName}</div>
                    <div className="gallery-card-industry">{lead.industry} • {lead.city}</div>
                  </div>
                  <span className={`badge badge-${sc.color}`} style={{ flexShrink: 0 }}>
                    <span className="badge-dot" />
                    {sc.label}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  paddingTop: 'var(--space-3)',
                  borderTop: '1px solid var(--border-primary)',
                }} onClick={e => e.stopPropagation()}>
                  <div className={`gallery-card-score ${scoreLabel}`} title="Lighthouse Score">
                    <Gauge size={12} />
                    {site.lighthouseScore}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FileCode size={11} />
                    {site.pages} pages
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Smartphone size={11} />
                    Responsive
                  </div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(site.previewUrl, '_blank');
                    }}
                    style={{
                      marginLeft: 'auto',
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <ExternalLink size={11} /> View
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sitesLeads.length === 0 && (
        <div className="empty-state">
          <Globe className="empty-state-icon" size={48} />
          <p>No generated websites match your filters.</p>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, icon }) {
  return (
    <div className="stat-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
      <div style={{ fontSize: '24px' }}>{icon}</div>
      <div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>{label}</div>
      </div>
    </div>
  );
}
