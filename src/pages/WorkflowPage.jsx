import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search, Globe, Brain, FileCode, Cloud, Send, Eye, DollarSign,
  Activity, Clock, CheckCircle, AlertCircle, Loader, Settings,
  Play, ArrowRight, ChevronRight, Info, Terminal, Sliders, Zap
} from 'lucide-react';
import { useLiveData } from '../data/liveEngine';

// Node configurations and dimensions
const NODES_CONFIG = [
  {
    id: 'discovery',
    name: 'Lead Discovery',
    icon: Search,
    color: 'purple',
    x: 30,
    y: 80,
    portOut: { x: 210, y: 130, dir: 'right' },
    description: 'Scrapes Google Maps and Yelp for prospects',
    config: { source: 'Google Maps + Yelp', radius: '15 miles', query: 'Dentists' },
    stats: { speed: '1.2s', success: '98.5%' }
  },
  {
    id: 'research',
    name: 'Audit & Scoring',
    icon: Globe,
    color: 'blue',
    x: 240,
    y: 80,
    portIn: { x: 240, y: 130, dir: 'left' },
    portOut: { x: 330, y: 180, dir: 'bottom' },
    description: 'Audits SEO, SSL, mobile responsiveness, and scores LQS',
    config: { sslCheck: true, mobileCheck: true, minLQS: 50 },
    stats: { speed: '4.5s', success: '96.2%' }
  },
  {
    id: 'branding',
    name: 'AI Brand Analyzer',
    icon: Brain,
    color: 'pink',
    x: 240,
    y: 350,
    portIn: { x: 330, y: 350, dir: 'top' },
    portOut: { x: 420, y: 400, dir: 'right' },
    description: 'Extracts branding colors, tone, and service list',
    config: { model: 'Claude 3.5 Sonnet', temperature: 0.3, maxTokens: 1000 },
    stats: { speed: '2.8s', success: '99.1%' }
  },
  {
    id: 'generation',
    name: 'AI Page Generator',
    icon: FileCode,
    color: 'cyan',
    x: 450,
    y: 215,
    portIn: { x: 450, y: 265, dir: 'left' },
    portOut: { x: 630, y: 265, dir: 'right' },
    description: 'Compiles responsive HTML pages, copy, and stock images',
    config: { framework: 'Astro 5', pageCount: 5, compression: 'WebP' },
    stats: { speed: '8.5s', success: '94.8%' }
  },
  {
    id: 'deployment',
    name: 'CDN Deployer',
    icon: Cloud,
    color: 'green',
    x: 660,
    y: 215,
    portIn: { x: 660, y: 265, dir: 'left' },
    portOut: { x: 840, y: 265, dir: 'right' },
    description: 'Publishes preview build to Cloudflare Edge subdomains',
    config: { platform: 'Cloudflare Pages', ssl: 'Automatic', ttl: '30 days' },
    stats: { speed: '1.8s', success: '99.8%' }
  },
  {
    id: 'outreach',
    name: 'Outreach Pitcher',
    icon: Send,
    color: 'amber',
    x: 870,
    y: 80,
    portIn: { x: 870, y: 130, dir: 'left' },
    portOut: { x: 960, y: 180, dir: 'bottom' },
    description: 'Dispatches personalized pitch letters with preview links',
    config: { mailer: 'Resend SMTP', delay: '2 hours', followUps: 3 },
    stats: { speed: '0.9s', success: '97.6%' }
  },
  {
    id: 'engagement',
    name: 'Engagement Tracker',
    icon: Eye,
    color: 'red',
    x: 870,
    y: 350,
    portIn: { x: 960, y: 350, dir: 'top' },
    portOut: { x: 1050, y: 400, dir: 'right' },
    description: 'Hooks webviews, link clicks, email opens, and replies',
    config: { tracker: 'Pixel Webhooks', repliesCheck: 'IMAP Poll', interval: '5min' },
    stats: { speed: 'Realtime', success: '100%' }
  },
  {
    id: 'revenue',
    name: 'Sales Conversion',
    icon: DollarSign,
    color: 'emerald',
    x: 1080,
    y: 215,
    portIn: { x: 1080, y: 265, dir: 'left' },
    description: 'Manages setup fees, MRR subscription tiers, and closes deals',
    config: { processor: 'Stripe API', setupFee: '$997', monthlyFee: '$149/mo' },
    stats: { speed: 'Automatic', success: '34.2%' }
  }
];

// Connection curves
const CONNECTIONS = [
  { from: 'discovery', to: 'research', path: 'M 210 130 L 240 130' },
  { from: 'research', to: 'branding', path: 'M 330 180 L 330 350' },
  { from: 'branding', to: 'generation', path: 'M 420 400 C 435 400, 435 265, 450 265' },
  { from: 'generation', to: 'deployment', path: 'M 630 265 L 660 265' },
  { from: 'deployment', to: 'outreach', path: 'M 840 265 C 855 265, 855 130, 870 130' },
  { from: 'outreach', to: 'engagement', path: 'M 960 180 L 960 350' },
  { from: 'engagement', to: 'revenue', path: 'M 1050 400 C 1065 400, 1065 265, 1080 265' }
];

export default function WorkflowPage() {
  const { events } = useLiveData();
  const [selectedNodeId, setSelectedNodeId] = useState('discovery');
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [activePathIdx, setActivePathIdx] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(-1);
  const [dealClosedData, setDealClosedData] = useState(null);

  // Initialize node-specific log database
  const [nodeLogs, setNodeLogs] = useState({
    discovery: [
      `[info] Google Maps Scraper initialized`,
      `[info] Found "Bright Smile Dentistry" (Dentistry, Austin)`,
      `[info] Found "Comfort Dental Care" (Dentistry, Dallas)`,
      `[success] Discovery complete: pushed 2 leads to Audit Queue`
    ],
    research: [
      `[info] Audit triggered for "Bright Smile Dentistry"`,
      `[warning] SSL Certificate missing on http://brightsmile.com`,
      `[warning] Mobile friendliness score: 32% (Critical)`,
      `[success] LQS score computed: 82/100 (Hot Lead)`
    ],
    branding: [
      `[info] Initiating Claude brand extraction`,
      `[info] Extracted brand colors: [#2563EB, #FFFFFF, #10B981]`,
      `[info] Extracted services: Teeth Whitening, Implants`,
      `[success] Creative Brief JSON saved to database`
    ],
    generation: [
      `[info] Initializing Astro layout compiler`,
      `[info] Injected brand metadata & custom SEO copy`,
      `[info] Generated 5 pages: Home, Services, About, Contact, Reviews`,
      `[success] Static HTML build succeeded (0.8s)`
    ],
    deployment: [
      `[info] Syncing compiled assets to Cloudflare R2`,
      `[info] Deploying preview subdomain: brightsmile.preview.webleados.com`,
      `[info] Generating headless page screenshots`,
      `[success] Live Preview URL activated successfully`
    ],
    outreach: [
      `[info] Building personalized outreach template`,
      `[info] Email queue loaded: to Dr. Sarah Chen`,
      `[info] Sending cold pitch showing live site link`,
      `[success] Resend API: Email sent successfully (ID: re_4s32c)`
    ],
    engagement: [
      `[info] Tracking link webhooks active`,
      `[success] Pixel trigger: email opened by Dr. Sarah Chen`,
      `[success] Pixel trigger: preview site clicked (session length: 124s)`,
      `[success] IMAP check: Dr. Sarah Chen replied: "Interested. Let's schedule a call!"`
    ],
    revenue: [
      `[info] Generating invoice setups`,
      `[success] Stripe webhook: subscription created ($149/mo)`,
      `[success] Stripe webhook: setup fee paid ($997)`,
      `[success] DEAL WON: "Bright Smile Dental" converted successfully!`
    ]
  });

  // Watch background events to flash matching nodes
  const prevEventsLen = useRef(0);
  useEffect(() => {
    if (events.length > prevEventsLen.current && !isSimulating) {
      const latest = events[0];
      let nodeId = 'discovery';

      if (latest.type === 'lead_discovered') nodeId = 'discovery';
      else if (latest.type === 'research_complete') nodeId = 'research';
      else if (latest.type === 'site_generated') nodeId = 'generation';
      else if (latest.type === 'site_deployed') nodeId = 'deployment';
      else if (latest.type === 'outreach_sent') nodeId = 'outreach';
      else if (['email_opened', 'preview_clicked', 'reply_received'].includes(latest.type)) nodeId = 'engagement';
      else if (latest.type === 'deal_closed') nodeId = 'revenue';

      // Flash matching node
      setActiveNodeId(nodeId);
      // Append simulated event to log
      appendLog(nodeId, `[live-event] ${latest.text || latest.detail}`);

      if (latest.type === 'deal_closed') {
        const matched = latest.html.match(/<strong>(.*?)<\/strong>/);
        setDealClosedData({
          name: matched ? matched[1] : 'New Client',
          detail: latest.detail
        });
      }

      const timer = setTimeout(() => setActiveNodeId(null), 1500);
      return () => clearTimeout(timer);
    }
    prevEventsLen.current = events.length;
  }, [events, isSimulating]);

  const appendLog = (nodeId, text) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setNodeLogs(prev => ({
      ...prev,
      [nodeId]: [...prev[nodeId], `[${timestamp}] ${text}`].slice(-40)
    }));
  };

  const selectedNode = useMemo(() => {
    return NODES_CONFIG.find(n => n.id === selectedNodeId);
  }, [selectedNodeId]);

  // Run a manual sequential simulation
  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setDealClosedData(null);
    setSimulationStep(0);
  };

  useEffect(() => {
    if (isSimulating && simulationStep >= 0 && simulationStep < NODES_CONFIG.length) {
      const node = NODES_CONFIG[simulationStep];
      setActiveNodeId(node.id);
      appendLog(node.id, `[sim] Execution triggered via simulation macro...`);

      // Set active path index to show high-speed pulses
      if (simulationStep < CONNECTIONS.length) {
        setActivePathIdx(simulationStep);
      } else {
        setActivePathIdx(null);
      }

      const timer = setTimeout(() => {
        // Log progression
        if (simulationStep < NODES_CONFIG.length - 1) {
          appendLog(node.id, `[sim] Output sent to ${NODES_CONFIG[simulationStep + 1].name}`);
        } else {
          // Closed won!
          appendLog(node.id, `[sim] Conversion pipeline complete!`);
          setDealClosedData({
            name: 'Summit Law Group',
            detail: '$1,500 setup + $149/mo'
          });
        }
        setSimulationStep(prev => prev + 1);
      }, 1500);

      return () => clearTimeout(timer);
    } else if (simulationStep === NODES_CONFIG.length) {
      setIsSimulating(false);
      setSimulationStep(-1);
      setActiveNodeId(null);
      setActivePathIdx(null);
    }
  }, [isSimulating, simulationStep]);

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 'var(--space-4)' }}>
      {/* Top control bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-4)',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 'var(--radius-md)',
            background: 'var(--accent-primary-subtle)', color: 'var(--accent-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Activity size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>Live Flow Visualizer</h2>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Real-time execution paths & visual automation flow</span>
          </div>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={runSimulation}
          disabled={isSimulating}
          style={{ gap: 'var(--space-2)' }}
        >
          {isSimulating ? (
            <Loader size={14} className="animate-spin" />
          ) : (
            <Play size={14} />
          )}
          <span>{isSimulating ? `Running Node ${simulationStep + 1}...` : 'Run End-to-End Simulation'}</span>
        </button>
      </div>

      {/* Deal closed overlay alert */}
      {dealClosedData && (
        <div
          className="animate-in"
          style={{
            background: 'var(--accent-green-subtle)',
            border: '1px solid var(--accent-green)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'slideDown 0.3s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: 24 }}>🎉</span>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--accent-green)' }}>
                DEAL CLOSED WON!
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
                {dealClosedData.name} — {dealClosedData.detail}
              </div>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setDealClosedData(null)}
            style={{ color: 'var(--accent-green)' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main visual panel layout */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', flex: 1, minHeight: 560 }}>
        {/* Graph Canvas Container */}
        <div style={{
          flex: 1,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-xl)',
          overflowX: 'auto',
          position: 'relative',
          padding: 'var(--space-4)',
        }}>
          {/* Radial dotted grid canvas */}
          <div
            className="workflow-canvas"
            style={{
              width: 1290,
              height: 520,
              position: 'relative',
              backgroundColor: '#0b0b14',
              backgroundImage: 'radial-gradient(rgba(99, 102, 241, 0.08) 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255,255,255,0.02)',
              overflow: 'hidden'
            }}
          >
            {/* SVG Connecting Paths */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {CONNECTIONS.map((c, i) => {
                const isPathActive = activePathIdx === i;
                const pathColor = isPathActive ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.06)';
                const strokeWidth = isPathActive ? 2.5 : 1.5;

                return (
                  <g key={`conn-${i}`}>
                    {/* Background link line */}
                    <path
                      id={`line-${i}`}
                      d={c.path}
                      fill="none"
                      stroke={pathColor}
                      strokeWidth={strokeWidth}
                      style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                    />

                    {/* Slow default moving particle */}
                    <circle r="2.5" fill="var(--accent-primary)" opacity="0.3">
                      <animateMotion dur="6s" repeatCount="indefinite">
                        <mpath href={`#line-${i}`} />
                      </animateMotion>
                    </circle>

                    {/* High-speed pulse bubble on active flows */}
                    {isPathActive && (
                      <circle r="4.5" fill="var(--accent-primary)" filter="url(#glow)">
                        <animateMotion dur="1s" repeatCount="1">
                          <mpath href={`#line-${i}`} />
                        </animateMotion>
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Node cards layout */}
            {NODES_CONFIG.map(node => {
              const Icon = node.icon;
              const isSelected = selectedNodeId === node.id;
              const isActive = activeNodeId === node.id;
              const logCount = nodeLogs[node.id]?.length || 0;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{
                    position: 'absolute',
                    left: node.x,
                    top: node.y,
                    width: 180,
                    height: 100,
                    background: 'rgba(20, 20, 33, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: isSelected
                      ? `2px solid var(--accent-${node.color})`
                      : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-3)',
                    cursor: 'pointer',
                    zIndex: 2,
                    boxShadow: isActive
                      ? `0 0 20px var(--accent-${node.color})`
                      : '0 4px 12px rgba(0,0,0,0.4)',
                    transition: 'all 0.2s ease',
                    transform: isActive ? 'scale(1.04)' : 'scale(1)',
                  }}
                >
                  {/* Port Connectors */}
                  {node.portIn && (
                    <div style={{
                      position: 'absolute',
                      left: -5,
                      top: 45,
                      width: 8,
                      height: 8,
                      borderRadius: 'var(--radius-full)',
                      background: isSelected ? `var(--accent-${node.color})` : 'var(--border-secondary)',
                      border: '2px solid #0b0b14',
                    }} />
                  )}
                  {node.portOut && node.portOut.dir === 'right' && (
                    <div style={{
                      position: 'absolute',
                      right: -5,
                      top: 45,
                      width: 8,
                      height: 8,
                      borderRadius: 'var(--radius-full)',
                      background: isSelected ? `var(--accent-${node.color})` : 'var(--border-secondary)',
                      border: '2px solid #0b0b14',
                    }} />
                  )}
                  {node.portOut && node.portOut.dir === 'bottom' && (
                    <div style={{
                      position: 'absolute',
                      left: 86,
                      bottom: -5,
                      width: 8,
                      height: 8,
                      borderRadius: 'var(--radius-full)',
                      background: isSelected ? `var(--accent-${node.color})` : 'var(--border-secondary)',
                      border: '2px solid #0b0b14',
                    }} />
                  )}
                  {node.portIn && node.portIn.dir === 'top' && (
                    <div style={{
                      position: 'absolute',
                      left: 86,
                      top: -5,
                      width: 8,
                      height: 8,
                      borderRadius: 'var(--radius-full)',
                      background: isSelected ? `var(--accent-${node.color})` : 'var(--border-secondary)',
                      border: '2px solid #0b0b14',
                    }} />
                  )}

                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 'var(--radius-md)',
                      background: `var(--accent-${node.color}-subtle)`, color: `var(--accent-${node.color})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Icon size={14} />
                    </div>
                    <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {node.name}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {node.description.slice(0, 48)}...
                  </div>

                  {/* Footer status status dot */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginTop: 'var(--space-2)', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 4
                  }}>
                    <span style={{ fontSize: '9px', color: 'var(--text-tertiary)' }}>logs: {logCount}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{
                        width: 5, height: 5, borderRadius: 'var(--radius-full)',
                        background: isActive ? 'var(--accent-green)' : 'var(--text-muted)'
                      }} />
                      <span style={{ fontSize: '8px', textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
                        {isActive ? 'ACTIVE' : 'IDLE'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Inspect Drawer Panel */}
        {selectedNode && (
          <div style={{
            width: 320,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: 'var(--space-4)',
              borderBottom: '1px solid var(--border-primary)',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)'
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 'var(--radius-md)',
                background: `var(--accent-${selectedNode.color}-subtle)`, color: `var(--accent-${selectedNode.color})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {React.createElement(selectedNode.icon, { size: 16 })}
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedNode.name}</h3>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Status: Active Node Inspector</span>
              </div>
            </div>

            {/* Inspector body contents */}
            <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', flex: 1, overflowY: 'auto' }}>
              {/* Parameters Box */}
              <div>
                <h4 style={{
                  fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-tertiary)',
                  textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)',
                  display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <Sliders size={12} /> CONFIG PARAMETERS
                </h4>
                <div style={{
                  background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)', padding: 'var(--space-3)',
                  display: 'flex', flexDirection: 'column', gap: 'var(--space-3)'
                }}>
                  {Object.entries(selectedNode.config).map(([key, val]) => (
                    <div key={key}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <div style={{
                        fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)', fontWeight: 600,
                        marginTop: 2, background: 'var(--bg-card)', padding: '4px 8px', borderRadius: 'var(--radius-sm)'
                      }}>
                        {typeof val === 'boolean' ? (val ? 'Enabled' : 'Disabled') : val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Box */}
              <div>
                <h4 style={{
                  fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-tertiary)',
                  textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)',
                  display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <Activity size={12} /> METRICS
                </h4>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)'
                }}>
                  <div style={{
                    background: 'var(--bg-tertiary)', padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Latency</span>
                    <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                      {selectedNode.stats.speed}
                    </div>
                  </div>
                  <div style={{
                    background: 'var(--bg-tertiary)', padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Success</span>
                    <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 800, color: 'var(--accent-green)', marginTop: 2 }}>
                      {selectedNode.stats.success}
                    </div>
                  </div>
                </div>
              </div>

              {/* Terminal Console Logs */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 180 }}>
                <h4 style={{
                  fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-tertiary)',
                  textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)',
                  display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <Terminal size={12} /> EXECUTION CONSOLE LOG
                </h4>
                <div
                  style={{
                    background: '#07070f',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-primary)',
                    padding: 'var(--space-3)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: '#a5f3fc',
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    maxHeight: 220
                  }}
                >
                  {nodeLogs[selectedNode.id]?.map((log, i) => {
                    let color = '#d4d4d8';
                    if (log.includes('[success]')) color = 'var(--accent-green)';
                    else if (log.includes('[warning]')) color = 'var(--accent-amber)';
                    else if (log.includes('[live-event]')) color = 'var(--accent-pink)';
                    else if (log.includes('[sim]')) color = 'var(--accent-primary)';

                    return (
                      <div key={i} style={{ color, lineBreak: 'anywhere' }}>
                        {log}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Test Node Action */}
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setActiveNodeId(selectedNode.id);
                  appendLog(selectedNode.id, `Manual trigger test executed.`);
                  setTimeout(() => setActiveNodeId(null), 1200);
                }}
                style={{ alignSelf: 'stretch', gap: 6 }}
              >
                <Zap size={13} style={{ color: `var(--accent-${selectedNode.color})` }} />
                <span>Test Node Exec</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
