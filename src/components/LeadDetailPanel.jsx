import React from 'react';
import {
  X, Globe, Mail, Phone, MapPin, Star, ExternalLink,
  Zap, Send, Rocket, Clock, AlertTriangle, CheckCircle,
  ChevronRight, Eye, Loader
} from 'lucide-react';
import { statusConfig } from '../data/mockLeads';
import { useAppState } from '../data/appState';

export default function LeadDetailPanel({ lead, onClose }) {
  const { updateLeadStatus, generateSite, deploySite, sendOutreach, isProcessing } = useAppState();

  if (!lead) return null;

  const sc = statusConfig[lead.status] || { label: lead.status, color: 'purple' };
  const isGenerating = isProcessing(`gen-${lead.id}`);
  const isDeploying = isProcessing(`deploy-${lead.id}`);
  const isSendingOutreach = isProcessing(`outreach-${lead.id}`);

  const getScoreColor = (score) => score >= 70 ? 'green' : score >= 50 ? 'amber' : 'red';

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 900, transition: 'opacity 0.3s',
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 480,
        background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border-primary)',
        zIndex: 901, overflowY: 'auto', animation: 'slideInPanel 0.3s ease-out',
        display: 'flex', flexDirection: 'column',
      }}>
        <style>{`
          @keyframes slideInPanel {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Header */}
        <div style={{
          padding: 'var(--space-5)', borderBottom: '1px solid var(--border-primary)',
          display: 'flex', alignItems: 'start', justifyContent: 'space-between',
          position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1,
        }}>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              {lead.businessName}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span className={`badge badge-${sc.color}`}>
                <span className="badge-dot" /> {sc.label}
              </span>
              <span className="badge badge-purple">{lead.industry}</span>
            </div>
          </div>
          <button onClick={onClose} style={{
            padding: 6, borderRadius: 'var(--radius-md)', color: 'var(--text-muted)',
            transition: 'all 0.15s',
          }} onMouseOver={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
             onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 'var(--space-5)', flex: 1 }}>
          {/* Quick Actions */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)',
            marginBottom: 'var(--space-5)',
          }}>
            <ActionButton
              icon={isGenerating ? Loader : Zap}
              label={isGenerating ? 'Generating...' : 'Generate Site'}
              color="purple"
              onClick={() => generateSite(lead.id)}
              disabled={isGenerating || !!lead.generatedSite}
              loading={isGenerating}
            />
            <ActionButton
              icon={isDeploying ? Loader : Rocket}
              label={isDeploying ? 'Deploying...' : 'Deploy Preview'}
              color="blue"
              onClick={() => deploySite(lead.id)}
              disabled={isDeploying || !lead.generatedSite || lead.status === 'deployed'}
              loading={isDeploying}
            />
            <ActionButton
              icon={isSendingOutreach ? Loader : Send}
              label={isSendingOutreach ? 'Sending...' : 'Send Outreach'}
              color="green"
              onClick={() => sendOutreach(lead.id)}
              disabled={isSendingOutreach || !!lead.outreach}
              loading={isSendingOutreach}
            />
            <ActionButton
              icon={Eye}
              label="View Preview"
              color="cyan"
              onClick={() => window.open(lead.generatedSite?.previewUrl || '#', '_blank')}
              disabled={!lead.generatedSite}
            />
          </div>

          {/* LQS Score */}
          <Section title="Lead Quality Score">
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
              padding: 'var(--space-4)', background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-lg)',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 'var(--radius-full)',
                background: `var(--accent-${getScoreColor(lead.lqsScore)}-subtle)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'var(--font-size-xl)', fontWeight: 900,
                color: `var(--accent-${getScoreColor(lead.lqsScore)})`,
              }}>
                {lead.lqsScore}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  height: 8, background: 'var(--bg-card)', borderRadius: 'var(--radius-full)',
                  overflow: 'hidden', marginBottom: 6,
                }}>
                  <div style={{
                    width: `${lead.lqsScore}%`, height: '100%',
                    background: `var(--accent-${getScoreColor(lead.lqsScore)})`,
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.8s ease',
                  }} />
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                  {lead.lqsScore >= 70 ? '🔥 Hot Lead — High conversion potential' :
                   lead.lqsScore >= 50 ? '🎯 Warm Lead — Worth pursuing' :
                   '❄️ Cold Lead — Needs nurturing'}
                </div>
              </div>
            </div>
          </Section>

          {/* Contact Info */}
          <Section title="Contact Information">
            <InfoRow icon={<span style={{ fontSize: 14 }}>👤</span>} label="Contact" value={lead.contact.name} />
            <InfoRow icon={<Mail size={14} />} label="Email" value={lead.contact.email} clickable />
            <InfoRow icon={<Phone size={14} />} label="Phone" value={lead.contact.phone} clickable />
            <InfoRow icon={<MapPin size={14} />} label="Location" value={lead.city} />
          </Section>

          {/* Website Audit */}
          <Section title="Website Audit">
            {lead.website.hasWebsite ? (
              <>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)',
                  marginBottom: 'var(--space-3)',
                }}>
                  <MiniMetric
                    label="Lighthouse"
                    value={lead.website.lighthouseScore}
                    color={lead.website.lighthouseScore < 40 ? 'red' : 'amber'}
                  />
                  <MiniMetric label="SSL" value={lead.website.hasSsl ? '✅' : '❌'} color={lead.website.hasSsl ? 'green' : 'red'} />
                  <MiniMetric label="Mobile" value={lead.website.isMobile ? '✅' : '❌'} color={lead.website.isMobile ? 'green' : 'red'} />
                </div>
                {lead.website.missingFeatures.length > 0 && (
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 6 }}>
                      Missing Features:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {lead.website.missingFeatures.map(f => (
                        <span key={f} className="badge badge-red" style={{ fontSize: '10px' }}>
                          {f.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{
                padding: 'var(--space-4)', background: 'var(--accent-red-subtle)',
                borderRadius: 'var(--radius-lg)', textAlign: 'center',
              }}>
                <AlertTriangle size={20} style={{ color: 'var(--accent-red)', marginBottom: 4 }} />
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--accent-red)', fontWeight: 600 }}>
                  No Website Found
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 4 }}>
                  Perfect candidate for website generation
                </div>
              </div>
            )}
          </Section>

          {/* Social Presence */}
          <Section title="Social Presence">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)' }}>
              <SocialCard platform="Facebook" data={lead.social.facebook} />
              <SocialCard platform="Instagram" data={lead.social.instagram} />
              <SocialCard platform="Google" data={lead.social.googleRating ? { rating: lead.social.googleRating, reviews: lead.social.reviewCount } : null} />
              <SocialCard platform="Reviews" data={lead.social.reviewCount > 0 ? { count: lead.social.reviewCount } : null} />
            </div>
          </Section>

          {/* Generated Site */}
          {lead.generatedSite && (
            <Section title="Generated Website">
              <div style={{
                padding: 'var(--space-4)', background: 'var(--accent-green-subtle)',
                borderRadius: 'var(--radius-lg)', border: '1px solid rgba(16,185,129,0.15)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--accent-green)' }} />
                  <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--accent-green)' }}>
                    Site Generated
                  </span>
                </div>
                <InfoRow icon={<Globe size={14} />} label="Preview" value={lead.generatedSite.previewUrl} clickable />
                <InfoRow icon={<Zap size={14} />} label="Lighthouse" value={lead.generatedSite.lighthouseScore} />
                <InfoRow icon={<span style={{ fontSize: 12 }}>📄</span>} label="Pages" value={lead.generatedSite.pages} />
              </div>
            </Section>
          )}

          {/* Change Status */}
          <Section title="Change Status">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  className={`badge badge-${cfg.color}`}
                  style={{
                    cursor: 'pointer', transition: 'all 0.15s',
                    opacity: lead.status === key ? 1 : 0.5,
                    border: lead.status === key ? `1px solid var(--accent-${cfg.color})` : '1px solid transparent',
                    transform: lead.status === key ? 'scale(1.05)' : 'scale(1)',
                  }}
                  onClick={() => updateLeadStatus(lead.id, key)}
                  onMouseOver={e => { if (lead.status !== key) e.currentTarget.style.opacity = 0.8; }}
                  onMouseOut={e => { if (lead.status !== key) e.currentTarget.style.opacity = 0.5; }}
                >
                  <span className="badge-dot" /> {cfg.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Metadata */}
          <div style={{
            marginTop: 'var(--space-4)', padding: 'var(--space-3)',
            background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span>ID: {lead.id}</span>
            <span>Source: {lead.source}</span>
            <span>Added: {new Date(lead.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 'var(--space-5)' }}>
      <h3 style={{
        fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-tertiary)',
        textTransform: 'uppercase', letterSpacing: '0.06em',
        marginBottom: 'var(--space-3)',
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value, clickable }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
      padding: '6px 0', borderBottom: '1px solid var(--border-primary)',
    }}>
      <span style={{ color: 'var(--text-muted)', width: 20, display: 'flex', justifyContent: 'center' }}>{icon}</span>
      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', width: 70 }}>{label}</span>
      <span style={{
        fontSize: 'var(--font-size-sm)', color: clickable ? 'var(--accent-primary)' : 'var(--text-primary)',
        fontWeight: 500, cursor: clickable ? 'pointer' : 'default', flex: 1, wordBreak: 'break-all',
      }}>
        {value || '—'}
      </span>
    </div>
  );
}

function MiniMetric({ label, value, color }) {
  return (
    <div style={{
      padding: 'var(--space-3)', background: 'var(--bg-tertiary)',
      borderRadius: 'var(--radius-md)', textAlign: 'center',
    }}>
      <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: `var(--accent-${color})` }}>
        {value}
      </div>
      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 }}>
        {label}
      </div>
    </div>
  );
}

function SocialCard({ platform, data }) {
  return (
    <div style={{
      padding: 'var(--space-3)', background: 'var(--bg-tertiary)',
      borderRadius: 'var(--radius-md)',
    }}>
      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 4 }}>
        {platform}
      </div>
      {data ? (
        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
          {data.followers ? `${data.followers.toLocaleString()} followers` :
           data.rating ? `⭐ ${data.rating} (${data.reviews} reviews)` :
           data.count ? `${data.count} reviews` : 'Active'}
        </div>
      ) : (
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>Not found</div>
      )}
    </div>
  );
}

function ActionButton({ icon: Icon, label, color, onClick, disabled, loading }) {
  return (
    <button
      className="btn btn-secondary"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: 'var(--space-3)',
        flexDirection: 'column',
        gap: 4,
        height: 'auto',
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderColor: disabled ? 'var(--border-primary)' : `var(--accent-${color})`,
        background: disabled ? 'var(--bg-tertiary)' : `var(--accent-${color}-subtle)`,
      }}
    >
      <Icon size={18} style={{
        color: `var(--accent-${color})`,
        animation: loading ? 'spin 1s linear infinite' : 'none',
      }} />
      <span style={{ fontSize: 'var(--font-size-xs)', color: disabled ? 'var(--text-muted)' : `var(--accent-${color})` }}>
        {label}
      </span>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
