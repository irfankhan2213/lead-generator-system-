import React, { useMemo } from 'react';
import {
  Activity, Gauge, Clock, TrendingUp, Zap,
  CheckCircle, AlertTriangle, XCircle
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { mockLeads, getStats } from '../data/mockLeads';

const processingTimeData = [
  { day: 'Mon', discovery: 2.1, research: 4.5, generation: 8.2, deployment: 1.5 },
  { day: 'Tue', discovery: 1.8, research: 3.9, generation: 7.1, deployment: 1.2 },
  { day: 'Wed', discovery: 2.4, research: 4.2, generation: 6.8, deployment: 1.4 },
  { day: 'Thu', discovery: 1.6, research: 3.5, generation: 7.5, deployment: 1.1 },
  { day: 'Fri', discovery: 2.0, research: 4.0, generation: 7.0, deployment: 1.3 },
  { day: 'Sat', discovery: 1.5, research: 3.2, generation: 6.5, deployment: 1.0 },
  { day: 'Sun', discovery: 1.9, research: 3.8, generation: 7.2, deployment: 1.2 },
];

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
          {entry.name}: {entry.value}min
        </div>
      ))}
    </div>
  );
};

export default function PerformancePage() {
  const stats = useMemo(() => getStats(mockLeads), []);

  const systemMetrics = [
    { label: 'System Uptime', value: '99.9%', status: 'healthy', icon: Activity },
    { label: 'Avg. Processing Time', value: '14.2min', status: 'healthy', icon: Clock },
    { label: 'AI Success Rate', value: '97.3%', status: 'healthy', icon: Zap },
    { label: 'Lighthouse Avg.', value: '92', status: 'healthy', icon: Gauge },
  ];

  const queueStatus = [
    { name: 'discovery-queue', pending: 12, processing: 3, completed: 1847, failed: 2, status: 'active' },
    { name: 'research-queue', pending: 8, processing: 5, completed: 1234, failed: 5, status: 'active' },
    { name: 'ai-analysis-queue', pending: 4, processing: 2, completed: 982, failed: 3, status: 'active' },
    { name: 'generation-queue', pending: 6, processing: 2, completed: 756, failed: 8, status: 'active' },
    { name: 'deployment-queue', pending: 2, processing: 1, completed: 654, failed: 1, status: 'active' },
    { name: 'outreach-queue', pending: 15, processing: 4, completed: 543, failed: 4, status: 'active' },
    { name: 'follow-up-queue', pending: 23, processing: 0, completed: 312, failed: 0, status: 'waiting' },
  ];

  return (
    <div className="animate-in">
      {/* System health */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--space-5)' }}>
        {systemMetrics.map(metric => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="stat-card green">
              <div className="stat-card-top">
                <div className="stat-card-icon">
                  <Icon size={18} />
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--accent-green)',
                  fontWeight: 600,
                }}>
                  <CheckCircle size={12} />
                  Healthy
                </div>
              </div>
              <div className="stat-card-value" style={{ fontSize: 'var(--font-size-2xl)' }}>{metric.value}</div>
              <div className="stat-card-label">{metric.label}</div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        {/* Processing Time Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Processing Times</div>
              <div className="card-subtitle">Average time per pipeline stage (minutes)</div>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processingTimeData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5a5a72' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#5a5a72' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="discovery" name="Discovery" stroke="#6366f1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="research" name="Research" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="generation" name="Generation" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="deployment" name="Deployment" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Queue Status */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Queue Status</div>
              <div className="card-subtitle">BullMQ job queue health</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {queueStatus.map(q => (
              <div
                key={q.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: 'var(--radius-full)',
                  background: q.status === 'active' ? 'var(--accent-green)' : 'var(--accent-amber)',
                  boxShadow: q.status === 'active' ? '0 0 6px var(--accent-green)' : 'none',
                }} />
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-primary)',
                  flex: 1,
                  fontWeight: 500,
                }}>
                  {q.name}
                </span>
                <QueueBadge label="Pending" value={q.pending} color="amber" />
                <QueueBadge label="Active" value={q.processing} color="blue" />
                <QueueBadge label="Done" value={q.completed} color="green" />
                {q.failed > 0 && <QueueBadge label="Failed" value={q.failed} color="red" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="card" style={{ marginTop: 'var(--space-4)' }}>
        <div className="card-header">
          <div>
            <div className="card-title">Cost Per Lead Breakdown</div>
            <div className="card-subtitle">Infrastructure cost analysis</div>
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-3)',
        }}>
          {[
            { label: 'Discovery', cost: '$0.05', detail: 'API calls + scraping' },
            { label: 'Research', cost: '$0.15', detail: 'Google Places + enrichment' },
            { label: 'AI Analysis', cost: '$0.12', detail: 'GPT-4o / Claude API' },
            { label: 'Generation', cost: '$0.08', detail: 'Compute + images' },
            { label: 'Deployment', cost: '$0.03', detail: 'Cloudflare Pages' },
            { label: 'Outreach', cost: '$0.07', detail: 'Resend + tracking' },
            { label: 'Total / Lead', cost: '$0.50', detail: 'All-in cost', highlight: true },
          ].map(item => (
            <div
              key={item.label}
              style={{
                padding: 'var(--space-4)',
                background: item.highlight ? 'var(--accent-primary-subtle)' : 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${item.highlight ? 'var(--border-accent)' : 'var(--border-primary)'}`,
              }}
            >
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 800,
                color: item.highlight ? 'var(--accent-primary)' : 'var(--text-primary)',
              }}>
                {item.cost}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QueueBadge({ label, value, color }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: 40,
    }}>
      <span style={{
        fontSize: 'var(--font-size-sm)',
        fontWeight: 700,
        color: `var(--accent-${color})`,
      }}>
        {value}
      </span>
      <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
    </div>
  );
}
