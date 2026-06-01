// Mock Lead Data for WebLeadOS Dashboard

const industries = [
  'Dentistry', 'HVAC', 'Plumbing', 'Law Firm', 'Auto Repair',
  'Restaurant', 'Salon & Spa', 'Real Estate', 'Fitness', 'Roofing',
  'Accounting', 'Chiropractor', 'Veterinary', 'Insurance', 'Landscaping'
];

const statuses = [
  'discovered', 'researching', 'researched', 'generating',
  'generated', 'deployed', 'outreach_sent', 'responded',
  'meeting_scheduled', 'closed_won', 'closed_lost'
];

const statusConfig = {
  discovered:        { label: 'Discovered',    color: 'purple' },
  researching:       { label: 'Researching',   color: 'blue' },
  researched:        { label: 'Researched',    color: 'cyan' },
  generating:        { label: 'Generating',    color: 'amber' },
  generated:         { label: 'Generated',     color: 'green' },
  deployed:          { label: 'Deployed',      color: 'green' },
  outreach_sent:     { label: 'Outreach Sent', color: 'blue' },
  responded:         { label: 'Responded',     color: 'pink' },
  meeting_scheduled: { label: 'Meeting Set',   color: 'amber' },
  closed_won:        { label: 'Closed Won',    color: 'green' },
  closed_lost:       { label: 'Closed Lost',   color: 'red' },
};

const sources = ['Google Maps', 'Yelp', 'Facebook', 'LinkedIn', 'Directory', 'Apollo.io', 'Referral'];

const cities = [
  'Austin, TX', 'Denver, CO', 'Miami, FL', 'Phoenix, AZ', 'Atlanta, GA',
  'Nashville, TN', 'Portland, OR', 'Charlotte, NC', 'San Diego, CA', 'Dallas, TX'
];

const firstNames = ['James', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Amanda', 'William', 'Rachel', 'Carlos', 'Maria', 'Ahmed', 'Lisa', 'Kevin', 'Priya', 'Chen', 'Fatima', 'John', 'Olivia'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Chen', 'Patel', 'Garcia', 'Martinez', 'Kim', 'Davis', 'Rodriguez', 'Thompson', 'Lee', 'Wilson', 'Anderson', 'Taylor', 'Brown', 'Harris', 'Clark', 'Lewis', 'Hall'];

const businessPrefixes = {
  'Dentistry': ['Bright Smile', 'Family', 'Advanced', 'Premier', 'Comfort', 'Sunrise', 'Golden', 'Perfect'],
  'HVAC': ['Cool Breeze', 'Arctic', 'Sun Valley', 'Metro', 'ProTemp', 'AirFlow', 'Climate', 'Alpine'],
  'Plumbing': ['QuickFlow', 'DrainMaster', 'PipePro', 'AquaFix', 'Rapid', 'TrustPipe', 'FirstCall'],
  'Law Firm': ['Sterling', 'Harbor', 'Justice', 'Shield', 'Cornerstone', 'Oak', 'Pinnacle', 'Guardian'],
  'Auto Repair': ['Fast Lane', 'Precision', 'AllStar', 'Metro', 'TrustAuto', 'Eagle', 'Summit'],
  'Restaurant': ['Golden Fork', 'Blue Flame', 'Fresh Bites', 'Urban Kitchen', 'Rustic Table', 'The Olive'],
  'Salon & Spa': ['Luxe', 'Radiance', 'Serenity', 'Bella', 'Glow', 'Elegant', 'Bliss', 'Harmony'],
  'Real Estate': ['Skyline', 'Keystone', 'Premier', 'Compass', 'Horizon', 'Crest', 'HomePoint'],
  'Fitness': ['Peak', 'Iron', 'Flex', 'Vitality', 'Surge', 'Pulse', 'PowerHouse', 'Core'],
  'Roofing': ['TopShield', 'SkyGuard', 'ProRoof', 'Apex', 'Summit', 'StormGuard', 'TrustTop'],
  'Accounting': ['Precision', 'Clear', 'Summit', 'Bridge', 'Keystone', 'ProBooks', 'TrustCount'],
  'Chiropractor': ['AlignWell', 'Spine', 'Balance', 'Pure', 'ActiveLife', 'Core', 'Harmony'],
  'Veterinary': ['Happy Paws', 'Gentle', 'PetCare', 'Furry Friends', 'WellPet', 'TailWag'],
  'Insurance': ['SafeGuard', 'Shield', 'SecureLife', 'TrustPlan', 'Reliable', 'CoverAll'],
  'Landscaping': ['GreenScape', 'Evergreen', 'NatureCraft', 'BloomPro', 'TerraCraft', 'Verdant'],
};

const industrySuffixes = {
  'Dentistry': ['Dental', 'Dentistry', 'Dental Care', 'Dental Group'],
  'HVAC': ['HVAC', 'Heating & Air', 'Climate Control', 'Air Services'],
  'Plumbing': ['Plumbing', 'Plumbing Co', 'Plumbing Services', 'Drain Services'],
  'Law Firm': ['Law', 'Law Group', 'Legal', 'Attorneys', '& Associates'],
  'Auto Repair': ['Auto', 'Auto Repair', 'Automotive', 'Car Care'],
  'Restaurant': ['Kitchen', 'Bistro', 'Grill', 'Eatery', 'Café'],
  'Salon & Spa': ['Salon', 'Spa', 'Beauty Bar', 'Studio'],
  'Real Estate': ['Realty', 'Real Estate', 'Properties', 'Homes'],
  'Fitness': ['Fitness', 'Gym', 'Training', 'Performance'],
  'Roofing': ['Roofing', 'Roof Co', 'Roofing Solutions'],
  'Accounting': ['Accounting', 'CPA', 'Financial', 'Tax Services'],
  'Chiropractor': ['Chiropractic', 'Wellness', 'Spine Care'],
  'Veterinary': ['Vet', 'Veterinary', 'Animal Hospital', 'Pet Clinic'],
  'Insurance': ['Insurance', 'Insurance Group', 'Coverage'],
  'Landscaping': ['Landscaping', 'Lawn Care', 'Gardens', 'Outdoor Services'],
};

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBusinessName(industry) {
  const prefix = randomItem(businessPrefixes[industry] || ['Pro']);
  const suffix = randomItem(industrySuffixes[industry] || [industry]);
  return `${prefix} ${suffix}`;
}

function generateLead(id) {
  const industry = randomItem(industries);
  const status = randomItem(statuses);
  const lqsScore = randomInt(25, 98);
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);
  const city = randomItem(cities);
  const source = randomItem(sources);
  const businessName = generateBusinessName(industry);
  const hasWebsite = Math.random() > 0.4;
  const lighthouseScore = hasWebsite ? randomInt(12, 65) : 0;

  const daysAgo = randomInt(0, 45);
  const createdAt = new Date(Date.now() - daysAgo * 86400000);

  return {
    id: `lead-${String(id).padStart(4, '0')}`,
    businessName,
    industry,
    status,
    lqsScore,
    source,
    city,
    contact: {
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}@${businessName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      phone: `+1-555-${String(randomInt(100, 999))}-${String(randomInt(1000, 9999))}`,
    },
    website: {
      hasWebsite,
      url: hasWebsite ? `http://www.${businessName.toLowerCase().replace(/[^a-z]/g, '')}.com` : null,
      lighthouseScore,
      hasSsl: Math.random() > 0.6,
      isMobile: Math.random() > 0.5,
      missingFeatures: [
        ...(Math.random() > 0.3 ? ['online_booking'] : []),
        ...(Math.random() > 0.4 ? ['contact_form'] : []),
        ...(Math.random() > 0.5 ? ['live_chat'] : []),
        ...(Math.random() > 0.3 ? ['testimonials'] : []),
        ...(Math.random() > 0.6 ? ['blog'] : []),
        ...(Math.random() > 0.5 ? ['seo_optimization'] : []),
      ],
    },
    social: {
      facebook: Math.random() > 0.3 ? { followers: randomInt(50, 5000) } : null,
      instagram: Math.random() > 0.5 ? { followers: randomInt(100, 3000) } : null,
      googleRating: Math.random() > 0.2 ? (Math.random() * 2 + 3).toFixed(1) : null,
      reviewCount: randomInt(0, 200),
    },
    generatedSite: ['generated', 'deployed', 'outreach_sent', 'responded', 'meeting_scheduled', 'closed_won'].includes(status) ? {
      previewUrl: `https://${businessName.toLowerCase().replace(/[^a-z]/g, '-')}.preview.webleados.com`,
      lighthouseScore: randomInt(85, 99),
      pages: randomInt(4, 8),
      deployedAt: new Date(Date.now() - randomInt(0, 20) * 86400000).toISOString(),
    } : null,
    outreach: ['outreach_sent', 'responded', 'meeting_scheduled', 'closed_won', 'closed_lost'].includes(status) ? {
      channel: randomItem(['email', 'sms', 'linkedin']),
      emailsSent: randomInt(1, 5),
      opened: Math.random() > 0.3,
      clicked: Math.random() > 0.5,
      replied: ['responded', 'meeting_scheduled', 'closed_won'].includes(status),
      sentAt: new Date(Date.now() - randomInt(0, 15) * 86400000).toISOString(),
    } : null,
    revenue: status === 'closed_won' ? {
      setupFee: randomItem([497, 997, 2497]),
      monthlyFee: randomItem([49, 149, 299]),
      plan: randomItem(['starter', 'professional', 'premium']),
    } : null,
    createdAt: createdAt.toISOString(),
  };
}

// Generate 150 leads
export const mockLeads = Array.from({ length: 150 }, (_, i) => generateLead(i + 1));

// Computed stats
export function getStats(leads) {
  const total = leads.length;
  const byStatus = {};
  statuses.forEach(s => { byStatus[s] = leads.filter(l => l.status === s).length; });

  const sitesGenerated = leads.filter(l => l.generatedSite).length;
  const outreachSent = leads.filter(l => l.outreach).length;
  const closedWon = leads.filter(l => l.status === 'closed_won');
  const totalRevenue = closedWon.reduce((sum, l) => sum + (l.revenue?.setupFee || 0), 0);
  const totalMRR = closedWon.reduce((sum, l) => sum + (l.revenue?.monthlyFee || 0), 0);
  const avgLQS = Math.round(leads.reduce((sum, l) => sum + l.lqsScore, 0) / total);

  const openRate = outreachSent > 0
    ? Math.round(leads.filter(l => l.outreach?.opened).length / outreachSent * 100)
    : 0;
  const clickRate = outreachSent > 0
    ? Math.round(leads.filter(l => l.outreach?.clicked).length / outreachSent * 100)
    : 0;
  const replyRate = outreachSent > 0
    ? Math.round(leads.filter(l => l.outreach?.replied).length / outreachSent * 100)
    : 0;

  return {
    total,
    byStatus,
    sitesGenerated,
    outreachSent,
    closedWon: closedWon.length,
    closedLost: byStatus.closed_lost || 0,
    totalRevenue,
    totalMRR,
    avgLQS,
    openRate,
    clickRate,
    replyRate,
  };
}

export { statusConfig, industries, statuses, sources, cities };

// Pipeline stages for visualization
export const pipelineStages = [
  { key: 'discovered', label: 'Discovered', icon: '🔍' },
  { key: 'researched', label: 'Researched', icon: '🔬' },
  { key: 'generated', label: 'Site Generated', icon: '🏗️' },
  { key: 'deployed', label: 'Deployed', icon: '🚀' },
  { key: 'outreach_sent', label: 'Outreach Sent', icon: '📧' },
  { key: 'responded', label: 'Responded', icon: '💬' },
  { key: 'meeting_scheduled', label: 'Meeting Set', icon: '📅' },
  { key: 'closed_won', label: 'Closed Won', icon: '🎉' },
];

// Activity feed items
export function generateActivityFeed(leads) {
  const actions = [
    { type: 'discovered', template: (l) => `New lead discovered: <strong>${l.businessName}</strong> (${l.industry})`, icon: '🔍', color: 'purple' },
    { type: 'researched', template: (l) => `Research completed for <strong>${l.businessName}</strong> — LQS: ${l.lqsScore}`, icon: '🔬', color: 'blue' },
    { type: 'generated', template: (l) => `Website generated for <strong>${l.businessName}</strong> — ${l.generatedSite?.pages || 5} pages`, icon: '🏗️', color: 'cyan' },
    { type: 'deployed', template: (l) => `Preview deployed for <strong>${l.businessName}</strong>`, icon: '🚀', color: 'green' },
    { type: 'outreach_sent', template: (l) => `Outreach sent to <strong>${l.contact.name}</strong> at ${l.businessName}`, icon: '📧', color: 'amber' },
    { type: 'responded', template: (l) => `<strong>${l.contact.name}</strong> replied to outreach — ${l.businessName}`, icon: '💬', color: 'pink' },
    { type: 'closed_won', template: (l) => `Deal closed! <strong>${l.businessName}</strong> — $${l.revenue?.setupFee} setup + $${l.revenue?.monthlyFee}/mo`, icon: '🎉', color: 'green' },
  ];

  const feed = [];
  leads.slice(0, 50).forEach(lead => {
    const action = actions.find(a => a.type === lead.status) || actions[0];
    const hoursAgo = Math.floor((Date.now() - new Date(lead.createdAt).getTime()) / 3600000);
    feed.push({
      id: `activity-${lead.id}`,
      html: action.template(lead),
      icon: action.icon,
      color: action.color,
      time: hoursAgo < 1 ? 'Just now' : hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.floor(hoursAgo / 24)}d ago`,
      timestamp: lead.createdAt,
    });
  });

  return feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 20);
}

// Revenue chart data (last 12 months)
export const revenueChartData = [
  { month: 'Jul', mrr: 0, setup: 0 },
  { month: 'Aug', mrr: 745, setup: 4985 },
  { month: 'Sep', mrr: 2235, setup: 9970 },
  { month: 'Oct', mrr: 4470, setup: 14955 },
  { month: 'Nov', mrr: 7450, setup: 19940 },
  { month: 'Dec', mrr: 11175, setup: 24925 },
  { month: 'Jan', mrr: 16120, setup: 34895 },
  { month: 'Feb', mrr: 22340, setup: 44865 },
  { month: 'Mar', mrr: 30050, setup: 54835 },
  { month: 'Apr', mrr: 42000, setup: 64800 },
  { month: 'May', mrr: 58500, setup: 74775 },
  { month: 'Jun', mrr: 78000, setup: 89250 },
];

// Outreach performance data
export const outreachPerformanceData = [
  { week: 'W1', sent: 45, opened: 18, clicked: 9, replied: 3 },
  { week: 'W2', sent: 62, opened: 28, clicked: 14, replied: 5 },
  { week: 'W3', sent: 78, opened: 35, clicked: 18, replied: 7 },
  { week: 'W4', sent: 95, opened: 42, clicked: 22, replied: 9 },
  { week: 'W5', sent: 110, opened: 52, clicked: 28, replied: 12 },
  { week: 'W6', sent: 135, opened: 65, clicked: 35, replied: 15 },
  { week: 'W7', sent: 158, opened: 78, clicked: 42, replied: 18 },
  { week: 'W8', sent: 180, opened: 90, clicked: 50, replied: 22 },
];
