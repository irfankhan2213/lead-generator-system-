import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  Users, Globe, Send, DollarSign, TrendingUp,
  ArrowUpRight, ArrowDownRight, ChevronRight, Zap, Eye,
  Activity, X, Radio
} from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import {
  mockLeads, getStats, statusConfig, pipelineStages,
  revenueChartData, outreachPerformanceData
} from '../data/mockLeads';
import { useLiveData, useAnimatedCounter, useLiveChartData } from '../data/liveEngine';
import { useAppState } from '../data/appState';

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
          {entry.name}: {entry.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
};

// Live Sparkline component
function Sparkline({ data, color }) {
  return (
    <div className="sparkline-container">
      {data.slice(-12).map((v, i) => (
        <div
          key={i}
          className="sparkline-bar"
          style={{
            height: `${Math.max(v * 8, 2)}px`,
            background: color,
          }}
        />
      ))}
    </div>
  );
}

// Toast notification
function LiveToast({ event, onDismiss }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setExiting(true);
      setTimeout(onDismiss, 300);
    }, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className={`live-toast ${exiting ? 'exiting' : ''}`}>
      <span className="live-toast-icon">{event.icon}</span>
      <div className="live-toast-content">
        <div className="live-toast-title">{event.text}</div>
        <div className="live-toast-detail">{event.detail}</div>
      </div>
      <button className="live-toast-close" onClick={() => { setExiting(true); setTimeout(onDismiss, 300); }}>
        <X size={14} />
      </button>
    </div>
  );
}

export default function OverviewPage({ onSelectLead }) {
  const { leads } = useAppState();
  const stats = useMemo(() => getStats(leads), [leads]);
  const { events, counters, liveIndicator } = useLiveData();
  const liveChartData = useLiveChartData(counters);

  // Animated counters
  const animLeads = useAnimatedCounter(counters.leads);
  const animSites = useAnimatedCounter(counters.sites);
  const animOutreach = useAnimatedCounter(counters.outreach);
  const animRevenue = useAnimatedCounter(counters.revenue);

  // Toasts — show high priority events
  const [toasts, setToasts] = useState([]);
  const prevEventsLen = useRef(0);

  useEffect(() => {
    if (events.length > prevEventsLen.current) {
      const newEvents = events.slice(0, events.length - prevEventsLen.current);
      const highPriority = newEvents.filter(e => e.priority === 'high');
      if (highPriority.length > 0) {
        setToasts(prev => [...prev, highPriority[0]].slice(-3));
      }
    }
    prevEventsLen.current = events.length;
  }, [events]);

  // Sparkline data from live events
  const sparklineData = useMemo(() => {
    return liveChartData.map(p => p.leads + p.sites + p.outreach);
  }, [liveChartData]);

  const kpis = [
    {
      label: 'Total Leads',
      value: animLeads.toLocaleString(),
      change: '+23%',
      direction: 'up',
      icon: Users,
      color: 'purple',
      sparkColor: 'var(--accent-primary)',
    },
    {
      label: 'Sites Generated',
      value: animSites.toLocaleString(),
      change: '+18%',
      direction: 'up',
      icon: Globe,
      color: 'blue',
      sparkColor: 'var(--accent-blue)',
    },
    {
      label: 'Outreach Sent',
      value: animOutreach.toLocaleString(),
      change: '+34%',
      direction: 'up',
      icon: Send,
      color: 'green',
      sparkColor: 'var(--accent-green)',
    },
    {
      label: 'Total Revenue',
      value: `$${animRevenue.toLocaleString()}`,
      change: '+42%',
      direction: 'up',
      icon: DollarSign,
      color: 'amber',
      sparkColor: 'var(--accent-amber)',
    },
  ];

  const pipelineCounts = useMemo(() => {
    return pipelineStages.map(stage => ({
      ...stage,
      count: leads.filter(l => l.status === stage.key).length,
      value: stage.key === 'closed_won'
        ? `$${leads.filter(l => l.status === 'closed_won').reduce((s, l) => s + (l.revenue?.setupFee || 0), 0).toLocaleString()}`
        : null,
    }));
  }, [leads]);

  return (
    <div>
      {/* Toasts */}
      {toasts.map((toast, i) => (
        <LiveToast
          key={toast.id}
          event={toast}
          onDismiss={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
        />
      ))}

      {/* Live Status Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div className="live-badge">
            <span className="live-dot" />
            LIVE
          </div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            System active • Processing leads in real-time
          </span>
          <div className="processing-dots">
            <span /><span /><span />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
            <div className="status-ring active" style={{ color: 'var(--accent-green)' }} />
            7 queues active
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
            <Activity size={12} style={{ color: 'var(--accent-primary)' }} />
            {events.length} events
          </div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <LiveClock />
          </span>
        </div>
      </div>

      {/* Heartbeat Line */}
      <div className="heartbeat-line" style={{ marginBottom: 'var(--space-4)' }} />

      {/* KPI Cards */}
      <div className="stats-grid animate-in">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={`stat-card ${kpi.color} counter-flash animate-in animate-in-delay-${i + 1}`}>
              <div className="stat-card-top">
                <div className="stat-card-icon">
                  <Icon size={20} />
                </div>
                <div className={`stat-card-change ${kpi.direction}`}>
                  {kpi.direction === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {kpi.change}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                  <div className="stat-card-value value-animate">{kpi.value}</div>
                  <div className="stat-card-label">{kpi.label}</div>
                </div>
                <Sparkline data={sparklineData} color={kpi.sparkColor} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Activity Chart */}
      <div className="card animate-in" style={{ marginTop: 'var(--space-4)' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div>
              <div className="card-title">Live System Activity</div>
              <div className="card-subtitle">Real-time events per 5-second window</div>
            </div>
            <div className="live-badge" style={{ marginLeft: 'var(--space-2)' }}>
              <span className="live-dot" />
              LIVE
            </div>
          </div>
        </div>
        <div className="chart-container live-chart-container" style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={liveChartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <linearGradient id="liveLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="liveSites" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="liveOutreach" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#44445a' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#44445a' }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="leads" name="Leads" stroke="#6366f1" fill="url(#liveLeads)" strokeWidth={2} animationDuration={500} />
              <Area type="monotone" dataKey="sites" name="Sites" stroke="#3b82f6" fill="url(#liveSites)" strokeWidth={2} animationDuration={500} />
              <Area type="monotone" dataKey="outreach" name="Outreach" stroke="#10b981" fill="url(#liveOutreach)" strokeWidth={2} animationDuration={500} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pipeline Funnel */}
      <div className="card animate-in" style={{ marginTop: 'var(--space-4)' }}>
        <div className="card-header">
          <div>
            <div className="card-title">Pipeline Overview</div>
            <div className="card-subtitle">Lead progression through system stages</div>
          </div>
          <button className="btn btn-ghost btn-sm">
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="pipeline-stages">
          {pipelineCounts.map((stage, i) => (
            <React.Fragment key={stage.key}>
              <div className={`pipeline-stage pipeline-stage-live ${i < 4 ? 'is-active' : ''}`}>
                <div style={{ fontSize: '16px', marginBottom: '4px' }}>{stage.icon}</div>
                <div className="pipeline-stage-count">{stage.count}</div>
                <div className="pipeline-stage-name">{stage.label}</div>
                {stage.value && <div className="pipeline-stage-value">{stage.value}</div>}
              </div>
              {i < pipelineCounts.length - 1 && (
                <div className="pipeline-connector">
                  <ChevronRight size={16} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="dashboard-grid">
        {/* Revenue Chart */}
        <div className="card animate-in">
          <div className="card-header">
            <div>
              <div className="card-title">Revenue Growth</div>
              <div className="card-subtitle">MRR + Setup fees — projected</div>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <defs>
                  <linearGradient id="gradientMRR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradientSetup" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#5a5a72' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#5a5a72' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="mrr" name="MRR" stroke="#6366f1" fill="url(#gradientMRR)" strokeWidth={2} />
                <Area type="monotone" dataKey="setup" name="Setup Fees" stroke="#10b981" fill="url(#gradientSetup)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Outreach Performance */}
        <div className="card animate-in">
          <div className="card-header">
            <div>
              <div className="card-title">Outreach Performance</div>
              <div className="card-subtitle">Weekly email metrics</div>
            </div>
          </div>
          <div className="chart-container">
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
      </div>

      {/* Bottom Row: Live Activity Feed + Conversion Metrics */}
      <div className="dashboard-grid" style={{ marginTop: 0 }}>
        {/* LIVE Activity Feed */}
        <div className="card animate-in">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div>
                <div className="card-title">Live Activity Feed</div>
                <div className="card-subtitle">Real-time system events</div>
              </div>
              <div className="live-badge" style={{ marginLeft: 4 }}>
                <span className="live-dot" />
                LIVE
              </div>
            </div>
          </div>
          <div style={{ maxHeight: 420, overflowY: 'auto', overflowX: 'hidden' }}>
            {events.slice(0, 15).map(item => {
              const matchedLead = leads.find(l => item.html.includes(l.businessName) || item.text.includes(l.businessName));
              return (
                <div
                  key={item.id}
                  className={`live-activity-item ${item.isNew ? 'is-new' : ''} ${item.priority === 'high' ? 'priority-high' : ''}`}
                  onClick={() => matchedLead && onSelectLead(matchedLead.id)}
                  style={{ cursor: matchedLead ? 'pointer' : 'default' }}
                >
                  <div
                    className="live-activity-icon"
                    style={{ background: `var(--accent-${item.color}-subtle)` }}
                  >
                    {item.icon}
                  </div>
                  <div className="activity-content">
                    <div className="activity-text" dangerouslySetInnerHTML={{ __html: item.html }} />
                    <div className="activity-time">{item.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversion Metrics + System Stats */}
        <div className="card animate-in">
          <div className="card-header">
            <div>
              <div className="card-title">System Performance</div>
              <div className="card-subtitle">Funnel metrics & live counters</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <LiveMetricRow label="Email Open Rate" value={`${stats.openRate}%`} target={40} current={stats.openRate} color="blue" />
            <LiveMetricRow label="Preview Click Rate" value={`${stats.clickRate}%`} target={25} current={stats.clickRate} color="cyan" />
            <LiveMetricRow label="Reply Rate" value={`${stats.replyRate}%`} target={5} current={stats.replyRate} color="green" />
            <LiveMetricRow label="Average LQS Score" value={stats.avgLQS} target={70} current={stats.avgLQS} color="purple" />
            <LiveMetricRow label="Deals Closed" value={stats.closedWon} target={20} current={stats.closedWon} color="amber" />

            {/* Live Revenue Counter */}
            <div style={{
              marginTop: 'var(--space-2)',
              padding: 'var(--space-4)',
              background: 'var(--accent-primary-subtle)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-accent)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
              }}>
                <div className="heartbeat-line" style={{ height: '100%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                    Total Revenue (Live)
                  </div>
                  <div style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 800,
                    color: 'var(--accent-green)',
                    letterSpacing: '-0.03em',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    ${animRevenue.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                    MRR: ${counters.mrr.toLocaleString()}/mo
                  </div>
                </div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--accent-green-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-green)',
                }}>
                  <TrendingUp size={20} />
                </div>
              </div>
            </div>

            {/* Queue summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--space-2)',
            }}>
              {[
                { label: 'Discovery', count: counters.leads, color: 'purple' },
                { label: 'Generation', count: counters.sites, color: 'blue' },
                { label: 'Outreach', count: counters.outreach, color: 'green' },
              ].map(q => (
                <div key={q.label} style={{
                  padding: 'var(--space-3)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    marginBottom: 4,
                  }}>
                    <div className="status-ring active" style={{ color: `var(--accent-${q.color})` }} />
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {q.label}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 800,
                    color: `var(--accent-${q.color})`,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {q.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Live clock
function LiveClock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);
  return <>{time}</>;
}

function LiveMetricRow({ label, value, target, current, color }) {
  const pct = Math.min(100, (current / target) * 100);
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '6px',
      }}>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: `var(--accent-${color})`, fontFamily: 'var(--font-mono)' }}>{value}</span>
      </div>
      <div style={{
        height: '6px',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: `var(--accent-${color})`,
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 0 8px var(--accent-${color})`,
        }} />
      </div>
    </div>
  );
}
