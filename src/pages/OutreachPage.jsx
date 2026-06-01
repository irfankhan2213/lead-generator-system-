import React, { useState, useMemo } from 'react';
import {
  Search, Mail, MessageSquare, Link2, Phone,
  Eye, MousePointerClick, Reply, ChevronRight, Clock,
  Send, Loader
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { statusConfig, outreachPerformanceData } from '../data/mockLeads';
import { useAppState } from '../data/appState';

const channelIcons = {
  email: { icon: Mail, color: 'var(--accent-blue)', bg: 'var(--accent-blue-subtle)' },
  sms: { icon: MessageSquare, color: 'var(--accent-green)', bg: 'var(--accent-green-subtle)' },
  linkedin: { icon: Link2, color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-subtle)' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1a1a2e',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '12px',
    }}>
      <div style={{ color: '#8b8b9e', marginBottom: '6px' }}>{label}</div>
      {payload.map((entry, i) => (
        <div key={i} style={{ color: entry.color, fontWeight: 600 }}>
          {entry.name}: {entry.value}
        </div>
      ))}
    </div>
  );
};

export default function OutreachPage({ onSelectLead }) {
  const { leads, sendOutreach, isProcessing } = useAppState();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const outreachLeads = useMemo(() => {
    let list = leads.filter(l => l.outreach);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(l =>
        l.businessName.toLowerCase().includes(q) ||
        l.contact.name.toLowerCase().includes(q)
      );
    }
    if (tab === 'opened') list = list.filter(l => l.outreach.opened);
    if (tab === 'clicked') list = list.filter(l => l.outreach.clicked);
    if (tab === 'replied') list = list.filter(l => l.outreach.replied);
    return list;
  }, [leads, search, tab]);

  const totalSent = useMemo(() => leads.filter(l => l.outreach).length, [leads]);
  const opened = useMemo(() => leads.filter(l => l.outreach?.opened).length, [leads]);
  const clicked = useMemo(() => leads.filter(l => l.outreach?.clicked).length, [leads]);
  const replied = useMemo(() => leads.filter(l => l.outreach?.replied).length, [leads]);

  return (
    <div className="animate-in">
      {/* Stats Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--space-5)' }}>
        <StatBox icon={Send} label="Total Sent" value={totalSent} color="purple" />
        <StatBox icon={Eye} label="Opened" value={opened} sub={`${totalSent ? Math.round(opened/totalSent*100) : 0}%`} color="blue" />
        <StatBox icon={MousePointerClick} label="Clicked Preview" value={clicked} sub={`${totalSent ? Math.round(clicked/totalSent*100) : 0}%`} color="green" />
        <StatBox icon={Reply} label="Replied" value={replied} sub={`${totalSent ? Math.round(replied/totalSent*100) : 0}%`} color="amber" />
      </div>

      {/* Outreach chart */}
      <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
        <div className="card-header">
          <div>
            <div className="card-title">Outreach Funnel — Weekly</div>
            <div className="card-subtitle">Email open, click, and reply rates</div>
          </div>
        </div>
        <div className="chart-container" style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={outreachPerformanceData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#5a5a72' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5a5a72' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sent" name="Sent" fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="opened" name="Opened" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="clicked" name="Clicked" fill="#10b981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="replied" name="Replied" fill="#f59e0b" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter + Tabs */}
      <div className="filter-bar">
        <div className="filter-search">
          <Search className="filter-search-icon" size={14} />
          <input
            type="text"
            placeholder="Search outreach campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          {[
            { key: 'all', label: 'All' },
            { key: 'opened', label: 'Opened' },
            { key: 'clicked', label: 'Clicked' },
            { key: 'replied', label: 'Replied' },
          ].map(f => (
            <button
              key={f.key}
              className={`filter-chip ${tab === f.key ? 'active' : ''}`}
              onClick={() => setTab(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Business</th>
              <th>Contact</th>
              <th>Channel</th>
              <th>Emails Sent</th>
              <th>Status</th>
              <th>Sent At</th>
              <th style={{ width: 80 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {outreachLeads.slice(0, 30).map(lead => {
              const outreach = lead.outreach;
              const channel = channelIcons[outreach.channel] || channelIcons.email;
              const ChannelIcon = channel.icon;
              const isSending = isProcessing(`outreach-${lead.id}`);

              let outreachStatus = 'Sent';
              let statusColor = 'purple';
              if (outreach.replied) { outreachStatus = 'Replied'; statusColor = 'green'; }
              else if (outreach.clicked) { outreachStatus = 'Clicked'; statusColor = 'cyan'; }
              else if (outreach.opened) { outreachStatus = 'Opened'; statusColor = 'blue'; }

              const sentDate = new Date(outreach.sentAt);
              const daysAgo = Math.floor((Date.now() - sentDate.getTime()) / 86400000);

              return (
                <tr key={lead.id} style={{ cursor: 'pointer' }} onClick={() => onSelectLead(lead.id)}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                        {lead.businessName}
                      </span>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                        {lead.industry}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                        {lead.contact.name}
                      </span>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                        {lead.contact.email.length > 28 ? lead.contact.email.slice(0, 28) + '...' : lead.contact.email}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: channel.bg,
                      color: channel.color,
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 600,
                    }}>
                      <ChannelIcon size={12} />
                      {outreach.channel.charAt(0).toUpperCase() + outreach.channel.slice(1)}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                      {outreach.emailsSent} / 5
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${statusColor}`}>
                      <span className="badge-dot" />
                      {outreachStatus}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                      <Clock size={11} />
                      {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
                    </div>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        title="Send follow-up"
                        style={{ padding: '4px' }}
                        disabled={isSending}
                        onClick={() => sendOutreach(lead.id)}
                      >
                        {isSending ? (
                          <Loader size={13} className="animate-spin" />
                        ) : (
                          <Send size={13} />
                        )}
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        title="View details"
                        style={{ padding: '4px' }}
                        onClick={() => onSelectLead(lead.id)}
                      >
                        <Eye size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, sub, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-top">
        <div className="stat-card-icon">
          <Icon size={18} />
        </div>
        {sub && <span style={{ fontSize: 'var(--font-size-xs)', color: `var(--accent-${color})`, fontWeight: 700 }}>{sub}</span>}
      </div>
      <div className="stat-card-value" style={{ fontSize: 'var(--font-size-2xl)' }}>{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}
