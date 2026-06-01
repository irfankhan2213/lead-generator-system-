import React, { useState } from 'react';
import {
  Zap, Play, Pause, Settings, Clock, RefreshCw,
  CheckCircle, AlertCircle, Loader
} from 'lucide-react';

const automationJobs = [
  {
    id: 'discovery',
    name: 'Lead Discovery',
    description: 'Scans Google Maps, Yelp, and directories for businesses needing website upgrades',
    schedule: 'Every 6 hours',
    lastRun: '2 hours ago',
    nextRun: 'In 4 hours',
    status: 'active',
    stats: { processed: 1847, success: 1832, failed: 15 },
  },
  {
    id: 'research',
    name: 'Business Research',
    description: 'Automatically gathers business info, branding, reviews, and competitor data',
    schedule: 'On new qualified lead',
    lastRun: '35 minutes ago',
    nextRun: 'On trigger',
    status: 'active',
    stats: { processed: 1234, success: 1220, failed: 14 },
  },
  {
    id: 'ai-analysis',
    name: 'AI Brand Analysis',
    description: 'Generates creative briefs — copy, design direction, CTA strategy',
    schedule: 'On research completion',
    lastRun: '1 hour ago',
    nextRun: 'On trigger',
    status: 'active',
    stats: { processed: 982, success: 970, failed: 12 },
  },
  {
    id: 'generation',
    name: 'Website Generation',
    description: 'Builds personalized websites — homepage, services, contact, SEO pages',
    schedule: 'On brief completion',
    lastRun: '45 minutes ago',
    nextRun: 'On trigger',
    status: 'active',
    stats: { processed: 756, success: 740, failed: 16 },
  },
  {
    id: 'deployment',
    name: 'Preview Deployment',
    description: 'Deploys generated sites to Cloudflare Pages with SSL and screenshots',
    schedule: 'On generation completion',
    lastRun: '50 minutes ago',
    nextRun: 'On trigger',
    status: 'active',
    stats: { processed: 654, success: 650, failed: 4 },
  },
  {
    id: 'outreach',
    name: 'Outreach Campaigns',
    description: 'Sends personalized pitches via email, SMS, and LinkedIn',
    schedule: 'On deployment + delay',
    lastRun: '20 minutes ago',
    nextRun: 'In 10 minutes',
    status: 'active',
    stats: { processed: 543, success: 535, failed: 8 },
  },
  {
    id: 'followup',
    name: 'Follow-up Sequences',
    description: 'Automated follow-ups based on engagement (open, click, no-response)',
    schedule: 'Daily at 9 AM',
    lastRun: '14 hours ago',
    nextRun: 'Tomorrow 9 AM',
    status: 'paused',
    stats: { processed: 312, success: 308, failed: 4 },
  },
];

export default function AutomationPage() {
  const [jobs, setJobs] = useState(automationJobs);

  const toggleJob = (id) => {
    setJobs(prev => prev.map(j =>
      j.id === id ? { ...j, status: j.status === 'active' ? 'paused' : 'active' } : j
    ));
  };

  return (
    <div className="animate-in">
      {/* Header Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 'var(--space-5)' }}>
        <div className="stat-card green">
          <div className="stat-card-top">
            <div className="stat-card-icon"><Zap size={18} /></div>
          </div>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-2xl)' }}>
            {jobs.filter(j => j.status === 'active').length}/{jobs.length}
          </div>
          <div className="stat-card-label">Active Automations</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-card-top">
            <div className="stat-card-icon"><CheckCircle size={18} /></div>
          </div>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-2xl)' }}>
            {jobs.reduce((s, j) => s + j.stats.processed, 0).toLocaleString()}
          </div>
          <div className="stat-card-label">Total Jobs Processed</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-card-top">
            <div className="stat-card-icon"><RefreshCw size={18} /></div>
          </div>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-2xl)' }}>
            {(jobs.reduce((s, j) => s + j.stats.success, 0) / Math.max(jobs.reduce((s, j) => s + j.stats.processed, 0), 1) * 100).toFixed(1)}%
          </div>
          <div className="stat-card-label">Success Rate</div>
        </div>
      </div>

      {/* Automation Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {jobs.map((job, i) => {
          const isActive = job.status === 'active';
          const successRate = ((job.stats.success / Math.max(job.stats.processed, 1)) * 100).toFixed(1);

          return (
            <div
              key={job.id}
              className="card"
              style={{
                padding: 'var(--space-5)',
                borderLeft: `3px solid ${isActive ? 'var(--accent-green)' : 'var(--accent-amber)'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-4)' }}>
                {/* Status icon */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-lg)',
                  background: isActive ? 'var(--accent-green-subtle)' : 'var(--accent-amber-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? 'var(--accent-green)' : 'var(--accent-amber)',
                  flexShrink: 0,
                }}>
                  {isActive ? <Zap size={20} /> : <Pause size={20} />}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 4 }}>
                    <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {job.name}
                    </span>
                    <span className={`badge ${isActive ? 'badge-green' : 'badge-amber'}`}>
                      <span className="badge-dot" />
                      {isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>
                    {job.description}
                  </div>

                  {/* Meta row */}
                  <div style={{
                    display: 'flex',
                    gap: 'var(--space-6)',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--text-muted)',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} /> Schedule: <strong style={{ color: 'var(--text-secondary)' }}>{job.schedule}</strong>
                    </span>
                    <span>Last run: <strong style={{ color: 'var(--text-secondary)' }}>{job.lastRun}</strong></span>
                    <span>Next: <strong style={{ color: 'var(--text-secondary)' }}>{job.nextRun}</strong></span>
                  </div>
                </div>

                {/* Stats */}
                <div style={{
                  display: 'flex',
                  gap: 'var(--space-4)',
                  alignItems: 'center',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {job.stats.processed.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Processed</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: 'var(--accent-green)' }}>
                      {successRate}%
                    </div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Success</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: job.stats.failed > 10 ? 'var(--accent-red)' : 'var(--accent-amber)' }}>
                      {job.stats.failed}
                    </div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Failed</div>
                  </div>

                  {/* Toggle button */}
                  <button
                    className={`btn ${isActive ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                    onClick={() => toggleJob(job.id)}
                    style={{ marginLeft: 'var(--space-2)' }}
                  >
                    {isActive ? <Pause size={13} /> : <Play size={13} />}
                    {isActive ? 'Pause' : 'Start'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
