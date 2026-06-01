import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { industries, cities } from '../data/mockLeads';
import { useAppState } from '../data/appState';

export default function AddLeadModal({ onClose }) {
  const { addLead } = useAppState();
  const [form, setForm] = useState({
    businessName: '',
    industry: 'Dentistry',
    city: 'Austin, TX',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.businessName.trim()) return;

    addLead({
      businessName: form.businessName,
      industry: form.industry,
      city: form.city,
      contact: {
        name: form.contactName || 'Unknown',
        email: form.contactEmail || `info@${form.businessName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
        phone: form.contactPhone || '+1-555-000-0000',
      },
    });
    onClose();
  };

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 950 }}
        onClick={onClose}
      />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 480, background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-xl)', zIndex: 951, animation: 'modalIn 0.3s ease-out',
        overflow: 'hidden',
      }}>
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
        `}</style>

        {/* Header */}
        <div style={{
          padding: 'var(--space-5)', borderBottom: '1px solid var(--border-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
            Add New Lead
          </h2>
          <button onClick={onClose} style={{ padding: 4, color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: 'var(--space-5)' }}>
          <FormField label="Business Name *" required>
            <input
              type="text" value={form.businessName}
              onChange={e => updateField('businessName', e.target.value)}
              placeholder="e.g., Bright Smile Dental"
              style={{ width: '100%' }}
              autoFocus
            />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <FormField label="Industry">
              <select
                value={form.industry}
                onChange={e => updateField('industry', e.target.value)}
                style={{ width: '100%' }}
              >
                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </FormField>
            <FormField label="City">
              <select
                value={form.city}
                onChange={e => updateField('city', e.target.value)}
                style={{ width: '100%' }}
              >
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
          </div>

          <FormField label="Contact Name">
            <input
              type="text" value={form.contactName}
              onChange={e => updateField('contactName', e.target.value)}
              placeholder="e.g., Dr. Sarah Chen"
              style={{ width: '100%' }}
            />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <FormField label="Email">
              <input
                type="email" value={form.contactEmail}
                onChange={e => updateField('contactEmail', e.target.value)}
                placeholder="email@example.com"
                style={{ width: '100%' }}
              />
            </FormField>
            <FormField label="Phone">
              <input
                type="tel" value={form.contactPhone}
                onChange={e => updateField('contactPhone', e.target.value)}
                placeholder="+1-555-000-0000"
                style={{ width: '100%' }}
              />
            </FormField>
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)',
            marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--border-primary)',
          }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!form.businessName.trim()}>
              <Plus size={14} /> Add Lead
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 'var(--space-4)' }}>
      <label style={{
        display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 500,
        color: 'var(--text-secondary)', marginBottom: 'var(--space-1)',
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}
