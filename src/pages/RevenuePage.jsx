import React, { useMemo } from 'react';
import {
  DollarSign, TrendingUp, Users, CreditCard, ArrowUpRight,
  Repeat, ChevronRight, Crown, Star
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { getStats, revenueChartData } from '../data/mockLeads';
import { useAppState } from '../data/appState';

const PLAN_COLORS = {
  starter: '#6366f1',
  professional: '#3b82f6',
  premium: '#f59e0b',
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
          {entry.name}: ${entry.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
};

export default function RevenuePage() {
  const { leads } = useAppState();

  const stats = useMemo(() => getStats(leads), [leads]);
  const clients = useMemo(() => leads.filter(l => l.status === 'closed_won'), [leads]);

  const planDistribution = useMemo(() => {
    const counts = { starter: 0, professional: 0, premium: 0 };
    clients.forEach(c => {
      if (c.revenue?.plan) counts[c.revenue.plan]++;
    });
    return [
      { name: 'Starter', value: counts.starter, color: PLAN_COLORS.starter },
      { name: 'Professional', value: counts.professional, color: PLAN_COLORS.professional },
      { name: 'Premium', value: counts.premium, color: PLAN_COLORS.premium },
    ];
  }, [clients]);

  const totalSetup = useMemo(() => clients.reduce((s, c) => s + (c.revenue?.setupFee || 0), 0), [clients]);
  const totalMonthly = useMemo(() => clients.reduce((s, c) => s + (c.revenue?.monthlyFee || 0), 0), [clients]);
  const avgDealSize = useMemo(() => clients.length ? Math.round(totalSetup / clients.length) : 0, [clients, totalSetup]);
  const ltv = useMemo(() => avgDealSize + (clients.length ? Math.round(totalMonthly / clients.length) : 0) * 18, [clients, avgDealSize, totalMonthly]);

  return (
    <div className="animate-in">
      {/* Revenue Highlight */}
      <div className="revenue-highlight" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="revenue-highlight-value">
          ${(totalSetup + totalMonthly).toLocaleString()}
        </div>
        <div className="revenue-highlight-label">
          Total Revenue Generated
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-8)',
          marginTop: 'var(--space-4)',
          position: 'relative',
          zIndex: 1,
        }}>
          <div>
            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--accent-primary)' }}>
              ${totalSetup.toLocaleString()}
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Setup Fees</div>
          </div>
          <div style={{ width: 1, background: 'var(--border-secondary)' }} />
          <div>
            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--accent-green)' }}>
              ${totalMonthly.toLocaleString()}/mo
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Monthly Recurring</div>
          </div>
          <div style={{ width: 1, background: 'var(--border-secondary)' }} />
          <div>
            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--accent-amber)' }}>
              ${ltv.toLocaleString()}
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Avg. LTV (18mo)</div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--space-4)' }}>
        <div className="stat-card purple">
          <div className="stat-card-top">
            <div className="stat-card-icon"><Users size={18} /></div>
          </div>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-2xl)' }}>{clients.length}</div>
          <div className="stat-card-label">Active Clients</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-card-top">
            <div className="stat-card-icon"><CreditCard size={18} /></div>
          </div>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-2xl)' }}>${avgDealSize}</div>
          <div className="stat-card-label">Avg. Setup Fee</div>
        </div>
        <div className="stat-card green">
          <div className="stat-card-top">
            <div className="stat-card-icon"><Repeat size={18} /></div>
          </div>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-2xl)' }}>
            ${clients.length ? Math.round(totalMonthly / clients.length) : 0}
          </div>
          <div className="stat-card-label">Avg. Monthly Fee</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-card-top">
            <div className="stat-card-icon"><TrendingUp size={18} /></div>
          </div>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-2xl)' }}>
            {stats.total > 0 ? ((clients.length / stats.total) * 100).toFixed(1) : 0}%
          </div>
          <div className="stat-card-label">Conversion Rate</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Revenue Trend */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Revenue Trend</div>
              <div className="card-subtitle">Projected 12-month trajectory</div>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="setupGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#5a5a72' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#5a5a72' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="mrr" name="MRR" stroke="#6366f1" fill="url(#revGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="setup" name="Setup Fees" stroke="#10b981" fill="url(#setupGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Plan Distribution</div>
              <div className="card-subtitle">Client breakdown by tier</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  formatter={(value, entry) => (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{value}</span>
                  )}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div style={{
                        background: '#1a1a2e',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        fontSize: '12px',
                      }}>
                        <div style={{ color: payload[0].payload.color, fontWeight: 600 }}>
                          {payload[0].name}: {payload[0].value} clients
                        </div>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Pricing tiers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            {[
              { plan: 'Starter', setup: '$497', monthly: '$49/mo', icon: Star, color: 'purple' },
              { plan: 'Professional', setup: '$997', monthly: '$149/mo', icon: Crown, color: 'blue' },
              { plan: 'Premium', setup: '$2,497', monthly: '$299/mo', icon: Crown, color: 'amber' },
            ].map(tier => (
              <div
                key={tier.plan}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                }}
              >
                <tier.icon size={14} style={{ color: `var(--accent-${tier.color})` }} />
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', fontWeight: 600, flex: 1 }}>
                  {tier.plan}
                </span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                  {tier.setup} + {tier.monthly}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clients table */}
      <div className="card" style={{ marginTop: 'var(--space-4)' }}>
        <div className="card-header">
          <div>
            <div className="card-title">Closed Deals</div>
            <div className="card-subtitle">{clients.length} clients converted</div>
          </div>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Business</th>
                <th>Industry</th>
                <th>Plan</th>
                <th>Setup Fee</th>
                <th>Monthly</th>
                <th>LTV (18mo)</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(lead => {
                const planColor = lead.revenue?.plan === 'premium' ? 'amber' : lead.revenue?.plan === 'professional' ? 'blue' : 'purple';
                const ltvVal = (lead.revenue?.setupFee || 0) + (lead.revenue?.monthlyFee || 0) * 18;
                return (
                  <tr key={lead.id}>
                    <td>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                        {lead.businessName}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-purple">{lead.industry}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${planColor}`}>
                        {lead.revenue?.plan ? lead.revenue.plan.charAt(0).toUpperCase() + lead.revenue.plan.slice(1) : 'Starter'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      ${(lead.revenue?.setupFee || 0).toLocaleString()}
                    </td>
                    <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>
                      ${lead.revenue?.monthlyFee || 0}/mo
                    </td>
                    <td style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>
                      ${ltvVal.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
