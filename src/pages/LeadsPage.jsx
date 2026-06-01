import React, { useState, useMemo } from 'react';
import {
  Search, Filter, ChevronDown, ExternalLink, Mail, Phone,
  Globe, ArrowUpDown, Eye, Zap, Send, Trash2
} from 'lucide-react';
import { statusConfig, industries, sources } from '../data/mockLeads';
import { useAppState } from '../data/appState';

export default function LeadsPage({ onSelectLead }) {
  const {
    leads,
    deleteLead,
    bulkGenerateSites,
    bulkSendOutreach,
  } = useAppState();

  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('lqsScore');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Filtered and sorted leads
  const filtered = useMemo(() => {
    let result = [...leads];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(l =>
        l.businessName.toLowerCase().includes(q) ||
        l.contact.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q)
      );
    }

    if (industryFilter !== 'all') {
      result = result.filter(l => l.industry === industryFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter(l => l.status === statusFilter);
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return result;
  }, [leads, searchTerm, industryFilter, statusFilter, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const getScoreClass = (score) => {
    if (score >= 70) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  };

  // Checkbox interactions
  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (filtered.length === 0) return;
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(l => l.id)));
    }
  };

  const handleBulkGenerate = () => {
    if (selectedIds.size === 0) return;
    bulkGenerateSites(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleBulkOutreach = () => {
    if (selectedIds.size === 0) return;
    bulkSendOutreach(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  return (
    <div className="animate-in">
      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-search">
          <Search className="filter-search-icon" size={14} />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          style={{
            padding: '6px 12px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--text-secondary)',
          }}
        >
          <option value="all">All Industries</option>
          {industries.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '6px 12px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--text-secondary)',
          }}
        >
          <option value="all">All Statuses</option>
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-2)' }}>
          <button
            className="btn btn-primary btn-sm"
            disabled={selectedIds.size === 0}
            onClick={handleBulkGenerate}
            style={{ opacity: selectedIds.size === 0 ? 0.5 : 1 }}
          >
            <Zap size={13} /> Generate Sites {selectedIds.size > 0 && `(${selectedIds.size})`}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            disabled={selectedIds.size === 0}
            onClick={handleBulkOutreach}
            style={{ opacity: selectedIds.size === 0 ? 0.5 : 1 }}
          >
            <Send size={13} /> Send Outreach {selectedIds.size > 0 && `(${selectedIds.size})`}
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div style={{
        fontSize: 'var(--font-size-xs)',
        color: 'var(--text-tertiary)',
        marginBottom: 'var(--space-3)',
      }}>
        Showing {filtered.length} of {leads.length} leads
      </div>

      {/* Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  style={{ width: 14, height: 14, cursor: 'pointer' }}
                  checked={filtered.length > 0 && selectedIds.size === filtered.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th onClick={() => toggleSort('businessName')} style={{ cursor: 'pointer' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  Business <ArrowUpDown size={12} />
                </span>
              </th>
              <th>Industry</th>
              <th onClick={() => toggleSort('lqsScore')} style={{ cursor: 'pointer' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  LQS <ArrowUpDown size={12} />
                </span>
              </th>
              <th>Status</th>
              <th>Contact</th>
              <th>Source</th>
              <th>Website</th>
              <th>Location</th>
              <th style={{ width: 80 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map(lead => {
              const sc = statusConfig[lead.status] || { label: lead.status, color: 'purple' };
              const scoreClass = getScoreClass(lead.lqsScore);

              return (
                <tr key={lead.id} style={{
                  background: selectedIds.has(lead.id) ? 'var(--bg-tertiary)' : 'transparent',
                  transition: 'background 0.15s'
                }}>
                  <td>
                    <input
                      type="checkbox"
                      style={{ width: 14, height: 14, cursor: 'pointer' }}
                      checked={selectedIds.has(lead.id)}
                      onChange={() => toggleSelect(lead.id)}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                        {lead.businessName}
                      </span>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                        {lead.id}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-purple">
                      {lead.industry}
                    </span>
                  </td>
                  <td>
                    <div className="score-bar">
                      <span className={`score-value ${scoreClass}`}>{lead.lqsScore}</span>
                      <div className="score-bar-track">
                        <div
                          className={`score-bar-fill ${scoreClass}`}
                          style={{ width: `${lead.lqsScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${sc.color}`}>
                      <span className="badge-dot" />
                      {sc.label}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                        {lead.contact.name}
                      </span>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Mail size={10} /> {lead.contact.email.length > 25 ? lead.contact.email.slice(0, 25) + '...' : lead.contact.email}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                      {lead.source}
                    </span>
                  </td>
                  <td>
                    {lead.website.hasWebsite ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className={`badge ${lead.website.lighthouseScore < 40 ? 'badge-red' : 'badge-amber'}`}>
                          {lead.website.lighthouseScore}
                        </span>
                        {!lead.website.hasSsl && (
                          <span style={{ fontSize: '10px', color: 'var(--accent-red)' }} title="No SSL">🔓</span>
                        )}
                        {!lead.website.isMobile && (
                          <span style={{ fontSize: '10px', color: 'var(--accent-amber)' }} title="Not mobile-friendly">📱</span>
                        )}
                      </div>
                    ) : (
                      <span className="badge badge-red">
                        <span className="badge-dot" />
                        No Site
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                      {lead.city}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        title="View details"
                        style={{ padding: '4px' }}
                        onClick={() => onSelectLead(lead.id)}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        title="Archive lead"
                        style={{ padding: '4px', color: 'var(--accent-red)' }}
                        onClick={() => deleteLead(lead.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length > 50 && (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-4)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-tertiary)',
        }}>
          Showing 50 of {filtered.length} results. Use filters to narrow down.
        </div>
      )}
    </div>
  );
}
