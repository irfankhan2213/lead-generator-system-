import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Globe, Send, DollarSign,
  Settings, ChevronRight, Search, Bell, Zap,
  TrendingUp, BarChart3, Target, BookOpen, Radio, Network
} from 'lucide-react';

export default function Sidebar({ activeView, onNavigate, liveCounts }) {
  const counts = liveCounts || {};

  const navItems = [
    { section: 'Command Center' },
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null, live: true },
    { id: 'workflow', label: 'Live Workflow', icon: Network, badge: 'LIVE', live: true },
    { id: 'pipeline', label: 'Pipeline', icon: Target, badge: null },
    { section: 'Operations' },
    { id: 'leads', label: 'Lead Management', icon: Users, badge: counts.leads || '142' },
    { id: 'websites', label: 'Website Gallery', icon: Globe, badge: counts.sites || '38' },
    { id: 'outreach', label: 'Outreach Tracker', icon: Send, badge: counts.outreach || '12' },
    { section: 'Intelligence' },
    { id: 'revenue', label: 'Revenue Analytics', icon: DollarSign, badge: null },
    { id: 'performance', label: 'Performance', icon: BarChart3, badge: null },
    { section: 'System' },
    { id: 'automation', label: 'Automation', icon: Zap, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">W</div>
        <div className="sidebar-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="sidebar-brand-name">WebLeadOS</span>
            <div className="live-dot" style={{ width: 6, height: 6 }} />
          </div>
          <span className="sidebar-brand-sub">AI Lead System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if (item.section) {
            return (
              <div key={`section-${i}`} className="sidebar-section-label">
                {item.section}
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-link ${activeView === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="sidebar-link-icon" size={18} />
              <span>{item.label}</span>
              {item.live && activeView === item.id && (
                <div className="live-badge" style={{ marginLeft: 'auto', padding: '1px 8px 1px 5px', fontSize: '9px' }}>
                  <span className="live-dot" style={{ width: 5, height: 5 }} />
                  LIVE
                </div>
              )}
              {item.badge && !item.live && (
                <span className="sidebar-link-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {/* System status */}
        <div style={{
          padding: 'var(--space-3)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-3)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 'var(--font-size-xs)',
            color: 'var(--accent-green)',
            fontWeight: 600,
            marginBottom: 6,
          }}>
            <div className="status-ring active" style={{ color: 'var(--accent-green)' }} />
            All Systems Operational
          </div>
          <div className="heartbeat-line" />
        </div>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">IR</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Irfan</div>
            <div className="sidebar-user-role">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
