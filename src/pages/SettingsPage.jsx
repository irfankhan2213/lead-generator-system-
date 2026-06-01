import React, { useState } from 'react';
import {
  Settings, Key, Globe, Mail, Database, Bell,
  Shield, Save, Eye, EyeOff
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState({});

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'discovery', label: 'Discovery', icon: Globe },
    { id: 'outreach', label: 'Outreach', icon: Mail },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="animate-in">
      {/* Tabs */}
      <div className="tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon size={14} />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {activeTab === 'general' && (
        <div style={{ maxWidth: 600 }}>
          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
              System Configuration
            </h3>
            <SettingField label="System Name" defaultValue="WebLeadOS" />
            <SettingField label="Preview Subdomain" defaultValue="preview.webleados.com" />
            <SettingField label="Max Leads Per Day" defaultValue="500" type="number" />
            <SettingField label="Default Industry" defaultValue="All Industries" />
            <SettingField label="Lead Score Threshold" defaultValue="50" type="number" />
          </div>

          <div className="card">
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
              Deployment Settings
            </h3>
            <SettingField label="Hosting Provider" defaultValue="Cloudflare Pages" />
            <SettingField label="Preview Expiry (days)" defaultValue="30" type="number" />
            <SettingField label="Lighthouse Min. Score" defaultValue="85" type="number" />
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div style={{ maxWidth: 600 }}>
          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
              AI Provider Keys
            </h3>
            <ApiKeyField
              label="OpenAI API Key"
              value="sk-proj-••••••••••••••••••••"
              show={showApiKey.openai}
              onToggle={() => setShowApiKey(p => ({ ...p, openai: !p.openai }))}
            />
            <ApiKeyField
              label="Anthropic (Claude) API Key"
              value="sk-ant-••••••••••••••••••••"
              show={showApiKey.claude}
              onToggle={() => setShowApiKey(p => ({ ...p, claude: !p.claude }))}
            />
          </div>

          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
              Data Provider Keys
            </h3>
            <ApiKeyField
              label="Google Places API Key"
              value="AIza••••••••••••••••••••"
              show={showApiKey.google}
              onToggle={() => setShowApiKey(p => ({ ...p, google: !p.google }))}
            />
            <ApiKeyField
              label="SerpAPI Key"
              value="serp-••••••••••••••••••••"
              show={showApiKey.serp}
              onToggle={() => setShowApiKey(p => ({ ...p, serp: !p.serp }))}
            />
            <ApiKeyField
              label="Apollo.io Key"
              value="apollo-••••••••••••••••••••"
              show={showApiKey.apollo}
              onToggle={() => setShowApiKey(p => ({ ...p, apollo: !p.apollo }))}
            />
          </div>

          <div className="card">
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
              Infrastructure Keys
            </h3>
            <ApiKeyField
              label="Cloudflare API Token"
              value="cf-••••••••••••••••••••"
              show={showApiKey.cf}
              onToggle={() => setShowApiKey(p => ({ ...p, cf: !p.cf }))}
            />
            <ApiKeyField
              label="Resend API Key"
              value="re_••••••••••••••••••••"
              show={showApiKey.resend}
              onToggle={() => setShowApiKey(p => ({ ...p, resend: !p.resend }))}
            />
          </div>
        </div>
      )}

      {activeTab === 'discovery' && (
        <div style={{ maxWidth: 600 }}>
          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
              Target Configuration
            </h3>
            <SettingField label="Target Cities" defaultValue="Austin TX, Denver CO, Miami FL" />
            <SettingField label="Target Industries" defaultValue="Dentistry, HVAC, Law Firm, Plumbing" />
            <SettingField label="Discovery Frequency" defaultValue="Every 6 hours" />
            <SettingField label="Max Distance (miles)" defaultValue="25" type="number" />
          </div>
          <div className="card">
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
              Scoring Weights
            </h3>
            <SettingField label="Website Quality Weight" defaultValue="25" type="number" />
            <SettingField label="Revenue Potential Weight" defaultValue="20" type="number" />
            <SettingField label="Digital Maturity Weight" defaultValue="15" type="number" />
            <SettingField label="Contact Availability Weight" defaultValue="15" type="number" />
            <SettingField label="Competition Weight" defaultValue="15" type="number" />
            <SettingField label="Recency Weight" defaultValue="10" type="number" />
          </div>
        </div>
      )}

      {(activeTab === 'outreach' || activeTab === 'database' || activeTab === 'notifications') && (
        <div className="card" style={{ maxWidth: 600 }}>
          <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
            <Settings size={32} style={{ opacity: 0.2, marginBottom: 'var(--space-3)' }} />
            <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings — configure during backend setup.
            </p>
          </div>
        </div>
      )}

      {/* Save */}
      <div style={{ marginTop: 'var(--space-5)', display: 'flex', gap: 'var(--space-3)' }}>
        <button className="btn btn-primary">
          <Save size={14} />
          Save Changes
        </button>
        <button className="btn btn-secondary">
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}

function SettingField({ label, defaultValue, type = 'text' }) {
  return (
    <div style={{ marginBottom: 'var(--space-4)' }}>
      <label style={{
        display: 'block',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        marginBottom: 'var(--space-1)',
      }}>
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        style={{ width: '100%' }}
      />
    </div>
  );
}

function ApiKeyField({ label, value, show, onToggle }) {
  return (
    <div style={{ marginBottom: 'var(--space-4)' }}>
      <label style={{
        display: 'block',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        marginBottom: 'var(--space-1)',
      }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <input
          type={show ? 'text' : 'password'}
          defaultValue={value}
          style={{ flex: 1 }}
        />
        <button
          className="btn btn-ghost"
          onClick={onToggle}
          style={{ padding: '6px 10px' }}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}
