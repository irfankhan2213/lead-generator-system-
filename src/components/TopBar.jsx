import React, { useState, useEffect } from 'react';
import { Search, Bell, Plus, RefreshCw } from 'lucide-react';
import { useAppState } from '../data/appState';

function LiveClock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);
  return <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{time}</span>;
}

export default function TopBar({ title, subtitle, onAddLeadClick }) {
  const { notifications, markNotificationsRead } = useAppState();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotifClick = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen) {
      markNotificationsRead();
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
        {subtitle && <span className="topbar-subtitle">{subtitle}</span>}
      </div>

      <div className="topbar-right">
        <div className="topbar-search">
          <Search className="topbar-search-icon" size={14} />
          <input type="text" placeholder="Search leads, sites, campaigns..." />
        </div>

        <LiveClock />

        <button className="btn btn-primary btn-sm" onClick={onAddLeadClick} style={{ gap: '4px' }}>
          <Plus size={14} />
          <span>New Lead</span>
        </button>

        <button className="topbar-btn" title="Refresh data">
          <RefreshCw size={16} />
        </button>

        <div style={{ position: 'relative' }}>
          <button className="topbar-btn" title="Notifications" onClick={handleNotifClick}>
            <Bell size={16} />
            {unreadCount > 0 && <span className="topbar-btn-dot"></span>}
          </button>

          {isNotifOpen && (
            <>
              {/* Overlay backdrop to close dropdown */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 998 }}
                onClick={() => setIsNotifOpen(false)}
              />
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                width: 320,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 999,
                maxHeight: 320,
                overflowY: 'auto',
              }}>
                <div style={{
                  padding: 'var(--space-3) var(--space-4)',
                  borderBottom: '1px solid var(--border-primary)',
                  fontWeight: 600,
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--text-primary)',
                }}>
                  Notifications
                </div>
                <div>
                  {notifications.length === 0 ? (
                    <div style={{
                      padding: 'var(--space-5)',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: 'var(--font-size-xs)',
                    }}>
                      No recent notifications
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        style={{
                          padding: 'var(--space-3) var(--space-4)',
                          borderBottom: '1px solid var(--border-primary)',
                          fontSize: 'var(--font-size-xs)',
                          display: 'flex',
                          gap: 'var(--space-3)',
                          alignItems: 'start',
                          background: n.read ? 'transparent' : 'var(--bg-tertiary)',
                        }}
                      >
                        <div style={{ fontSize: 16 }}>
                          {n.type === 'status' ? '🔄' :
                           n.type === 'add' ? '✅' :
                           n.type === 'outreach' ? '📧' :
                           n.type === 'generate' ? '🏗️' : 'ℹ️'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            color: 'var(--text-primary)',
                            fontWeight: n.read ? 400 : 600,
                            lineHeight: 1.4,
                          }}>
                            {n.message}
                          </div>
                          <div style={{
                            color: 'var(--text-muted)',
                            fontSize: '10px',
                            marginTop: 4,
                          }}>
                            {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
