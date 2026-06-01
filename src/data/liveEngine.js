import { useState, useEffect, useRef, useCallback } from 'react';
import { mockLeads, industries, statusConfig, sources, cities } from './mockLeads';

// ─── Event Types ───
const EVENT_TYPES = [
  {
    type: 'lead_discovered',
    weight: 30,
    generate: () => {
      const industry = industries[Math.floor(Math.random() * industries.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const names = ['Bright Smile Dental', 'ProTemp HVAC', 'QuickFlow Plumbing', 'Sterling Law', 'Fast Lane Auto',
        'Golden Fork Kitchen', 'Luxe Salon', 'Skyline Realty', 'Peak Fitness', 'TopShield Roofing',
        'Summit Accounting', 'AlignWell Chiropractic', 'Happy Paws Vet', 'SafeGuard Insurance', 'GreenScape Landscaping',
        'Metro Climate Control', 'DrainMaster Plumbing', 'Cornerstone Legal', 'Precision Auto Care', 'Urban Kitchen Bistro',
        'Radiance Spa', 'Compass Homes', 'Iron Gym', 'Apex Roofing Co', 'Clear CPA Services'];
      const name = names[Math.floor(Math.random() * names.length)];
      const lqs = Math.floor(Math.random() * 40) + 55;
      const source = sources[Math.floor(Math.random() * sources.length)];
      return {
        icon: '🔍',
        color: 'purple',
        html: `New lead discovered: <strong>${name}</strong> (${industry}) in ${city}`,
        text: `Discovered ${name}`,
        detail: `LQS: ${lqs} • Source: ${source}`,
        metric: 'leads',
        value: 1,
      };
    },
  },
  {
    type: 'research_complete',
    weight: 20,
    generate: () => {
      const names = ['City Dental Group', 'Arctic HVAC', 'AquaFix Plumbing', 'Harbor Law', 'AllStar Auto',
        'Fresh Bites Café', 'Serenity Spa', 'Horizon Properties', 'Surge Fitness', 'StormGuard Roofing'];
      const name = names[Math.floor(Math.random() * names.length)];
      const lqs = Math.floor(Math.random() * 30) + 65;
      const features = ['online booking', 'SSL certificate', 'mobile optimization', 'contact form', 'testimonials page'];
      const missing = features.slice(0, Math.floor(Math.random() * 3) + 1).join(', ');
      return {
        icon: '🔬',
        color: 'blue',
        html: `Research completed for <strong>${name}</strong> — LQS: ${lqs}, missing: ${missing}`,
        text: `Researched ${name}`,
        detail: `LQS: ${lqs} • ${Math.floor(Math.random() * 5) + 2} gaps found`,
        metric: 'researched',
        value: 1,
      };
    },
  },
  {
    type: 'site_generated',
    weight: 15,
    generate: () => {
      const names = ['Premier Dentistry', 'Sun Valley HVAC', 'PipePro Plumbing', 'Justice Law Group', 'TrustAuto Repair',
        'Blue Flame Grill', 'Bella Beauty', 'Keystone Realty', 'Vitality Gym', 'ProRoof Solutions'];
      const name = names[Math.floor(Math.random() * names.length)];
      const pages = Math.floor(Math.random() * 4) + 5;
      const lighthouse = Math.floor(Math.random() * 10) + 90;
      return {
        icon: '🏗️',
        color: 'cyan',
        html: `Website generated for <strong>${name}</strong> — ${pages} pages, Lighthouse: ${lighthouse}`,
        text: `Generated site for ${name}`,
        detail: `${pages} pages • Score: ${lighthouse}`,
        metric: 'sites',
        value: 1,
      };
    },
  },
  {
    type: 'site_deployed',
    weight: 12,
    generate: () => {
      const names = ['Comfort Dental Care', 'Alpine Air Services', 'Rapid Plumbing', 'Shield Attorneys', 'Eagle Automotive'];
      const name = names[Math.floor(Math.random() * names.length)];
      const slug = name.toLowerCase().replace(/[^a-z]/g, '-');
      return {
        icon: '🚀',
        color: 'green',
        html: `Preview deployed: <strong>${name}</strong> → <span style="color:var(--accent-primary)">${slug}.preview.webleados.com</span>`,
        text: `Deployed ${name}`,
        detail: `Live at preview.webleados.com`,
        metric: 'deployed',
        value: 1,
      };
    },
  },
  {
    type: 'outreach_sent',
    weight: 15,
    generate: () => {
      const contacts = [
        { name: 'Dr. Sarah Chen', biz: 'Bright Smile Dental' },
        { name: 'Mike Johnson', biz: 'ProTemp HVAC' },
        { name: 'Lisa Rodriguez', biz: 'QuickFlow Plumbing' },
        { name: 'James Williams', biz: 'Sterling Law Group' },
        { name: 'Emily Davis', biz: 'Luxe Salon & Spa' },
        { name: 'Carlos Martinez', biz: 'Golden Fork Kitchen' },
        { name: 'Priya Patel', biz: 'Skyline Realty' },
        { name: 'Ahmed Hassan', biz: 'Peak Performance Gym' },
      ];
      const c = contacts[Math.floor(Math.random() * contacts.length)];
      const channel = ['email', 'sms', 'linkedin'][Math.floor(Math.random() * 3)];
      const channelIcon = { email: '📧', sms: '📱', linkedin: '💼' }[channel];
      return {
        icon: channelIcon,
        color: 'amber',
        html: `Outreach sent to <strong>${c.name}</strong> at ${c.biz} via ${channel}`,
        text: `Pitched ${c.biz}`,
        detail: `Channel: ${channel}`,
        metric: 'outreach',
        value: 1,
      };
    },
  },
  {
    type: 'email_opened',
    weight: 10,
    generate: () => {
      const contacts = [
        { name: 'Dr. Sarah Chen', biz: 'Bright Smile Dental' },
        { name: 'Mike Johnson', biz: 'ProTemp HVAC' },
        { name: 'Robert Thompson', biz: 'Apex Roofing' },
      ];
      const c = contacts[Math.floor(Math.random() * contacts.length)];
      return {
        icon: '👁️',
        color: 'blue',
        html: `<strong>${c.name}</strong> opened email — ${c.biz}`,
        text: `Email opened by ${c.name}`,
        detail: c.biz,
        metric: 'opens',
        value: 1,
      };
    },
  },
  {
    type: 'preview_clicked',
    weight: 6,
    generate: () => {
      const names = ['City Dental Group', 'Metro HVAC', 'TrustPipe Plumbing'];
      const name = names[Math.floor(Math.random() * names.length)];
      const duration = Math.floor(Math.random() * 180) + 30;
      return {
        icon: '🖱️',
        color: 'cyan',
        html: `Preview site clicked for <strong>${name}</strong> — viewed for ${duration}s`,
        text: `Preview clicked: ${name}`,
        detail: `${duration}s on site`,
        metric: 'clicks',
        value: 1,
      };
    },
  },
  {
    type: 'reply_received',
    weight: 4,
    generate: () => {
      const replies = [
        { name: 'Dr. Sarah Chen', biz: 'Bright Smile Dental', msg: 'This looks great! Can we schedule a call?' },
        { name: 'Mike Johnson', biz: 'ProTemp HVAC', msg: 'Interested. What are your prices?' },
        { name: 'Lisa Rodriguez', biz: 'QuickFlow Plumbing', msg: 'I love the design. Let\'s talk.' },
      ];
      const r = replies[Math.floor(Math.random() * replies.length)];
      return {
        icon: '💬',
        color: 'pink',
        html: `<strong>${r.name}</strong> replied: "${r.msg}"`,
        text: `Reply from ${r.name}`,
        detail: r.biz,
        metric: 'replies',
        value: 1,
        priority: 'high',
      };
    },
  },
  {
    type: 'deal_closed',
    weight: 2,
    generate: () => {
      const deals = [
        { biz: 'Premier Dentistry', plan: 'Professional', setup: 997, monthly: 149 },
        { biz: 'FastLane Auto Repair', plan: 'Starter', setup: 497, monthly: 49 },
        { biz: 'Sterling Law Group', plan: 'Premium', setup: 2497, monthly: 299 },
      ];
      const d = deals[Math.floor(Math.random() * deals.length)];
      return {
        icon: '🎉',
        color: 'green',
        html: `Deal closed! <strong>${d.biz}</strong> — ${d.plan} plan: $${d.setup} setup + $${d.monthly}/mo`,
        text: `CLOSED: ${d.biz}`,
        detail: `$${d.setup} + $${d.monthly}/mo`,
        metric: 'revenue',
        value: d.setup,
        monthlyValue: d.monthly,
        priority: 'high',
      };
    },
  },
];

// Weighted random event selection
function pickEvent() {
  const totalWeight = EVENT_TYPES.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * totalWeight;
  for (const evt of EVENT_TYPES) {
    r -= evt.weight;
    if (r <= 0) return evt;
  }
  return EVENT_TYPES[0];
}

// ─── Live Data Hook ───
export function useLiveData() {
  const [events, setEvents] = useState([]);
  const [counters, setCounters] = useState({
    leads: 150,
    sites: 38,
    outreach: 42,
    revenue: 14920,
    mrr: 2847,
    deployed: 34,
    researched: 78,
    opens: 28,
    clicks: 16,
    replies: 8,
  });
  const [liveIndicator, setLiveIndicator] = useState(true);
  const eventIdRef = useRef(0);
  const intervalRef = useRef(null);

  const generateEvent = useCallback(() => {
    const eventType = pickEvent();
    const eventData = eventType.generate();
    const id = ++eventIdRef.current;

    const newEvent = {
      id: `live-${id}`,
      ...eventData,
      time: 'Just now',
      timestamp: new Date().toISOString(),
      isNew: true,
    };

    setEvents(prev => [newEvent, ...prev].slice(0, 50));

    // Update counters
    setCounters(prev => {
      const updated = { ...prev };
      if (eventData.metric === 'revenue') {
        updated.revenue = (updated.revenue || 0) + (eventData.value || 0);
        updated.mrr = (updated.mrr || 0) + (eventData.monthlyValue || 0);
      } else if (eventData.metric) {
        updated[eventData.metric] = (updated[eventData.metric] || 0) + (eventData.value || 0);
      }
      return updated;
    });

    // Mark event as no longer "new" after animation
    setTimeout(() => {
      setEvents(prev =>
        prev.map(e => e.id === `live-${id}` ? { ...e, isNew: false } : e)
      );
    }, 2000);

    // Pulse live indicator
    setLiveIndicator(false);
    setTimeout(() => setLiveIndicator(true), 200);
  }, []);

  useEffect(() => {
    // Generate initial batch
    for (let i = 0; i < 5; i++) {
      setTimeout(() => generateEvent(), i * 300);
    }

    // Random interval between 2-6 seconds for new events
    const scheduleNext = () => {
      const delay = Math.random() * 4000 + 2000;
      intervalRef.current = setTimeout(() => {
        generateEvent();
        scheduleNext();
      }, delay);
    };
    scheduleNext();

    // Update "time ago" labels every 30s
    const timeUpdater = setInterval(() => {
      setEvents(prev => prev.map(e => {
        const secs = Math.floor((Date.now() - new Date(e.timestamp).getTime()) / 1000);
        let time;
        if (secs < 5) time = 'Just now';
        else if (secs < 60) time = `${secs}s ago`;
        else if (secs < 3600) time = `${Math.floor(secs / 60)}m ago`;
        else time = `${Math.floor(secs / 3600)}h ago`;
        return { ...e, time };
      }));
    }, 10000);

    return () => {
      clearTimeout(intervalRef.current);
      clearInterval(timeUpdater);
    };
  }, [generateEvent]);

  return { events, counters, liveIndicator, generateEvent };
}

// ─── Animated Counter Hook ───
export function useAnimatedCounter(targetValue, duration = 1200) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const prevValue = useRef(targetValue);
  const frameRef = useRef(null);

  useEffect(() => {
    const start = prevValue.current;
    const end = targetValue;
    if (start === end) return;

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);

      setDisplayValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        prevValue.current = end;
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [targetValue, duration]);

  return displayValue;
}

// ─── Live Chart Data Hook ───
export function useLiveChartData(counters) {
  const [chartPoints, setChartPoints] = useState(() => {
    const now = Date.now();
    return Array.from({ length: 20 }, (_, i) => ({
      time: new Date(now - (19 - i) * 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      leads: Math.floor(Math.random() * 3),
      sites: Math.floor(Math.random() * 2),
      outreach: Math.floor(Math.random() * 2),
    }));
  });

  const lastCounters = useRef(counters);

  useEffect(() => {
    const interval = setInterval(() => {
      const leadsAdded = counters.leads - lastCounters.current.leads;
      const sitesAdded = counters.sites - lastCounters.current.sites;
      const outreachAdded = counters.outreach - lastCounters.current.outreach;
      lastCounters.current = { ...counters };

      setChartPoints(prev => {
        const next = [
          ...prev.slice(1),
          {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            leads: Math.max(leadsAdded, Math.floor(Math.random() * 3)),
            sites: Math.max(sitesAdded, Math.floor(Math.random() * 2)),
            outreach: Math.max(outreachAdded, Math.floor(Math.random() * 2)),
          },
        ];
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [counters]);

  return chartPoints;
}
