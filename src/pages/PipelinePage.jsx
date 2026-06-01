import React, { useMemo } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { pipelineStages, statusConfig } from '../data/mockLeads';
import { useAppState } from '../data/appState';

const stageColors = [
  'var(--accent-purple)',
  'var(--accent-blue)',
  'var(--accent-cyan)',
  'var(--accent-green)',
  'var(--accent-blue)',
  'var(--accent-pink)',
  'var(--accent-amber)',
  'var(--accent-green)',
];

export default function PipelinePage({ onSelectLead }) {
  const { leads: globalLeads } = useAppState();

  const stageCounts = useMemo(() => {
    return pipelineStages.map((stage, i) => {
      const stageLeads = globalLeads.filter(l => l.status === stage.key);
      return { ...stage, leads: stageLeads, count: stageLeads.length, color: stageColors[i] };
    });
  }, [globalLeads]);

  const totalLeads = globalLeads.length;

  return (
    <div className="animate-in">
      {/* Funnel visualization */}
      <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="card-header">
          <div>
            <div className="card-title">Pipeline Funnel</div>
            <div className="card-subtitle">Lead progression through all stages</div>
          </div>
        </div>
        <div style={{ padding: 'var(--space-4) 0' }}>
          {stageCounts.map((stage, i) => {
            const pct = totalLeads > 0 ? (stage.count / totalLeads) * 100 : 0;
            const convRate = i > 0 && stageCounts[i - 1].count > 0
              ? ((stage.count / stageCounts[i - 1].count) * 100).toFixed(0)
              : '100';

            return (
              <div key={stage.key} style={{ marginBottom: 'var(--space-3)' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  marginBottom: 'var(--space-2)',
                }}>
                  <span style={{ fontSize: '16px', width: 24, textAlign: 'center' }}>{stage.icon}</span>
                  <span style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    minWidth: 120,
                  }}>
                    {stage.label}
                  </span>
                  <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: stage.color }}>
                    {stage.count}
                  </span>
                  {i > 0 && (
                    <span style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--text-muted)',
                      marginLeft: 'var(--space-2)',
                    }}>
                      ({convRate}% from prev)
                    </span>
                  )}
                </div>
                <div style={{
                  height: 28,
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <div style={{
                    width: `${Math.max(pct, 2)}%`,
                    height: '100%',
                    background: stage.color,
                    borderRadius: 'var(--radius-md)',
                    opacity: 0.25,
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  }} />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 'var(--space-3)',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                  }}>
                    {pct.toFixed(1)}% of total pipeline
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kanban-style columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(stageCounts.length, 4)}, 1fr)`,
        gap: 'var(--space-3)',
        overflowX: 'auto',
      }}>
        {stageCounts.slice(0, 4).map((stage, i) => (
          <div key={stage.key} className="card" style={{ padding: 'var(--space-4)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-4)',
              paddingBottom: 'var(--space-3)',
              borderBottom: `2px solid ${stage.color}`,
            }}>
              <span style={{ fontSize: '14px' }}>{stage.icon}</span>
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                {stage.label}
              </span>
              <span style={{
                marginLeft: 'auto',
                background: stage.color,
                color: 'white',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 700,
                padding: '1px 8px',
                borderRadius: 'var(--radius-full)',
              }}>
                {stage.count}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxHeight: 400, overflowY: 'auto' }}>
              {stage.leads.slice(0, 8).map(lead => (
                <div
                  key={lead.id}
                  onClick={() => onSelectLead(lead.id)}
                  style={{
                    padding: 'var(--space-3)',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--border-secondary)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-primary)'; }}
                >
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                    {lead.businessName}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--text-muted)',
                  }}>
                    <span>{lead.industry}</span>
                    <span style={{
                      fontWeight: 700,
                      color: lead.lqsScore >= 70 ? 'var(--accent-green)' : lead.lqsScore >= 50 ? 'var(--accent-amber)' : 'var(--accent-red)',
                    }}>
                      {lead.lqsScore}
                    </span>
                  </div>
                </div>
              ))}
              {stage.leads.length > 8 && (
                <div style={{
                  textAlign: 'center',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--text-muted)',
                  padding: 'var(--space-2)',
                }}>
                  +{stage.leads.length - 8} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Second row of columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(stageCounts.length - 4, 4)}, 1fr)`,
        gap: 'var(--space-3)',
        marginTop: 'var(--space-3)',
      }}>
        {stageCounts.slice(4).map((stage, i) => (
          <div key={stage.key} className="card" style={{ padding: 'var(--space-4)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-4)',
              paddingBottom: 'var(--space-3)',
              borderBottom: `2px solid ${stage.color}`,
            }}>
              <span style={{ fontSize: '14px' }}>{stage.icon}</span>
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                {stage.label}
              </span>
              <span style={{
                marginLeft: 'auto',
                background: stage.color,
                color: 'white',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 700,
                padding: '1px 8px',
                borderRadius: 'var(--radius-full)',
              }}>
                {stage.count}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxHeight: 400, overflowY: 'auto' }}>
              {stage.leads.slice(0, 8).map(lead => (
                <div
                  key={lead.id}
                  onClick={() => onSelectLead(lead.id)}
                  style={{
                    padding: 'var(--space-3)',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--border-secondary)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-primary)'; }}
                >
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                    {lead.businessName}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--text-muted)',
                  }}>
                    <span>{lead.industry}</span>
                    <span style={{
                      fontWeight: 700,
                      color: lead.lqsScore >= 70 ? 'var(--accent-green)' : lead.lqsScore >= 50 ? 'var(--accent-amber)' : 'var(--accent-red)',
                    }}>
                      {lead.lqsScore}
                    </span>
                  </div>
                </div>
              ))}
              {stage.leads.length > 8 && (
                <div style={{
                  textAlign: 'center',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--text-muted)',
                  padding: 'var(--space-2)',
                }}>
                  +{stage.leads.length - 8} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
