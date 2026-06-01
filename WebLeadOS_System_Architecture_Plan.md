# WebLeadOS — AI-Powered Website Generation & Outreach System

> **System Codename:** WebLeadOS  
> **Version:** 1.0 CTO Technical Architecture & Startup Blueprint  
> **Classification:** Startup Execution Document  

---

## 1. Executive Summary

WebLeadOS is an end-to-end, AI-orchestrated customer acquisition and website generation engine designed to run autonomously. The system solves the primary conversion friction in agency sales: **the visual objection**. By generating a customized, production-grade website preview for a business *before* initiating first contact, WebLeadOS increases cold outreach response and conversion rates.

### Core Lifecycle Flow:
1. **Discover:** Identifies businesses with obsolete, slow, or missing websites.
2. **Research:** Scrapes details (Google rating, social media followers, reviews) to identify feature gaps.
3. **Understand:** Uses LLM agents to draft custom copy, match brand colors, and formulate CTAs.
4. **Generate:** Compiles a fast static Astro/HTML website tailored to their services.
5. **Deploy:** Publishes a live version to a preview subdomain on Cloudflare Pages.
6. **Pitch:** Sends a personalized cold outreach email featuring screenshots of their new site.
7. **CRM & Conversion:** Tracks opens, clicks, and closes deals via subscription portals.

---

## 2. System Architecture & Component Mapping

```
[Lead Sources] ──> [Discovery Engine] ──> [Research & Audit]
                                                 │
                                                 ▼
[Astro Compiler] <── [Brand Brief Layer] <── [LLM Brand Parser]
       │
       ▼
[Cloudflare CDN] ──> [Resend Emailer] ──> [Stripe Conversion Portal]
```

### Stage 1: Lead Discovery Engine
The system discovers prospects by queries targeting local directories and search engines.
* **API Providers:** Google Places API, Yelp Fusion API, SerpAPI (to audit search indexes).
* **Target Verticals:** Focuses on service niches with high average transaction value and low tech overhead (e.g. Dentistry, HVAC, Law Firms, Plumbing, Roofing).
* **Lead Quality Score (LQS):** A 0-100 score prioritizing leads:
  $$LQS = (25 \times \text{Website Gap}) + (20 \times \text{Est. Revenue}) + (15 \times \text{Social Digital Presence}) + (40 \times \text{Data Quality})$$
* **Priority Thresholds:**
  * **LQS ≥ 70:** Hot Lead. Pushed directly to real-time site generation queue.
  * **LQS 50-69:** Warm Lead. Scheduled for the next nightly batch.
  * **LQS < 50:** Archive.

### Stage 2: Business Research Engine
Autonomously audits the prospect's active brand presence:
* **Branding Scrape:** Extracts existing logos, color styles, and fonts from active social pages.
* **Service Audit:** Captures service scope and business locations.
* **Lighthouse Performance Audit:** Runs a headless Lighthouse execution to document page load times, SSL security status, mobile usability, and key accessibility scores.
* **Gaps Matrix:** Flags missing operational features (e.g. online booking widgets, responsive layouts, text review displays).

### Stage 3: AI Brand Understanding Layer
Translates raw business research metrics into creative design tokens:
* **LLM Prompts (Claude 3.5 Sonnet / GPT-4o):** Analyses review sentiments and service portfolios to generate:
  * Brand voice guidelines (warmth, authority scale).
  * Page-by-page copywriting.
  * Custom call-to-action triggers (e.g., "Schedule Dental Consultation").
  * Complementary HSL hex color codes and typographic layout directives.

### Stage 4: Static Page Compiler
Assembles and prepares the production-grade static replacement site:
* **Framework:** Astro 5 (compiled to pure, script-free HTML for sub-second loading).
* **Niche Template Library:** Component configurations for local businesses (hero sections, contact forms, service lists, review carousels).
* **SEO Injections:** Auto-generates schemas (`LocalBusiness`, `FAQPage`, `Review`), optimized meta titles/descriptions, alt text for photos, and internal linking paths.

### Stage 5: CDN Preview Deployment
* **Cloudflare Pages:** Deploys the static files to subdomains like `prospect-name.preview.webleados.com`.
* **Headless Visualizer:** Executes Puppeteer to capture desktop and mobile screenshots of the live preview subdomain, ready to be attached to outreach pitches.
* **Expiration Hooks:** Configures automated Cloudflare worker rules to purge preview assets after 30 days unless converted.

---

## 3. Database Schema Design (Neon PostgreSQL)

```sql
-- Leads Table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    source VARCHAR(100) DEFAULT 'Google Maps',
    lqs_score INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'discovered', -- discovered, researching, generated, deployed, outreach_sent, closed_won
    contact_name VARCHAR(150),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business Profiles (Research Logs)
CREATE TABLE business_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    has_website BOOLEAN DEFAULT FALSE,
    lighthouse_score INTEGER DEFAULT 0,
    missing_features JSONB, -- ['online_booking', 'contact_form']
    facebook_followers INTEGER,
    instagram_followers INTEGER,
    google_rating DECIMAL(2,1),
    review_count INTEGER,
    brand_colors VARCHAR(7)[], -- Hex codes array
    researched_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creative Briefs (AI Copy)
CREATE TABLE creative_briefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    headings JSONB, -- { 'hero_title': '...', 'hero_subtitle': '...' }
    services_copy JSONB,
    cta_text VARCHAR(100),
    brand_tone VARCHAR(100),
    seo_metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated Websites
CREATE TABLE generated_websites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    brief_id UUID REFERENCES creative_briefs(id),
    subdomain VARCHAR(100) UNIQUE,
    preview_url VARCHAR(500),
    pages_count INTEGER DEFAULT 5,
    deployed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ
);

-- Outreach Campaigns
CREATE TABLE outreach_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    website_id UUID REFERENCES generated_websites(id),
    channel VARCHAR(50) DEFAULT 'email', -- email, sms, linkedin
    emails_sent INTEGER DEFAULT 1,
    opened BOOLEAN DEFAULT FALSE,
    clicked BOOLEAN DEFAULT FALSE,
    replied BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    last_action_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client Subscriptions (Closed Deals)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    plan_tier VARCHAR(50) DEFAULT 'professional', -- starter, professional, premium
    setup_fee_paid NUMERIC(10,2),
    monthly_fee NUMERIC(10,2),
    active_domain VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active', -- active, cancelled
    subscribed_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. BullMQ Queue Architecture

To run asynchronously without exceeding API rate limits or overloading server memory, tasks are processed through Redis-backed queues:

```
[Discovery Queue] ──> [Research Queue] ──> [AI Synthesis Queue]
                                                 │
                                                 ▼
[Outreach Queue]  <── [Deploy Queue]   <── [Generation Queue]
```

1. **`discovery-queue`:** Pulls listing data from Google Places. Rate-limited to **10 concurrent requests/minute** to protect API quotas.
2. **`research-queue`:** Audits website speeds. Processes **5 concurrent jobs** using headless browser pools.
3. **`ai-analysis-queue`:** Dispatches API requests to OpenAI / Claude. Uses exponential backoff to handle token limits.
4. **`generation-queue`:** Compiles static Astro web assets.
5. **`deployment-queue`:** Deploys static builds to Cloudflare Pages via CLI tools.
6. **`outreach-queue`:** Sends emails via Resend. Configured to spacing schedules (e.g., 20 seconds between sends) to protect domain sender reputation.

---

## 5. Monetization Model & Financial Projections

WebLeadOS monetizes through setup fees and recurring subscriptions:

### Subscription Tiers:
| Tier Name | Setup Fee | Monthly Subscription | Best For |
|---|---|---|---|
| **Starter** | \$497 | \$49/mo | Minimal 1-page business card layout |
| **Professional** | \$997 | \$149/mo | Standard 5-page localized SEO website |
| **Premium** | \$2,497 | \$299/mo | Full layout with custom booking integration |

### Unit Economics per Lead:
* **Discovery API Cost:** \$0.05
* **Research & Enrichment:** \$0.15
* **LLM Copywriting Tokens:** \$0.12
* **Stock Photo Licensing:** \$0.04
* **CDN Deployment Cost:** \$0.07
* **Resend Pitch Email:** \$0.07
* **All-in Pipeline Cost per Lead:** **\$0.50**

### Conversion Mathematics:
* **Monthly Budget:** \$1,500 (covers 3,000 leads pitched)
* **Average Email Open Rate:** 35% (1,050 opens)
* **Average Preview Click Rate:** 15% (450 visits)
* **Closed Conversion Rate (from Clicks):** 2.2% (10 new clients won)
* **Setup Fee Revenue:** 10 × \$997 = \$9,970  
* **New MRR Added:** 10 × \$149/mo = \$1,490/mo  
* **First Month Return on Ad Spend/API Spend:** **\$11,460** (764% ROI)

---

## 6. Project Rollout Roadmap

```
Phase 1: Foundation (Days 1-15)
├─ Setup Dashboard Shell
├─ CRM tables & Lead manager
└─ Static mockup layout

Phase 2: Automation (Days 16-30)
├─ Google Maps & Yelp scrapers
├─ Claude API copy writers
└─ CF pages auto deployments

Phase 3: Production (Days 31-45)
├─ Resend email sequences
├─ BullMQ background tasks
└─ Stripe subscriptions integration
```

* **Phase 1: MVP Dashboard (Days 1-15):** Dashboard interface, CRM tables, manual lead creator, website gallery, and layout structures. (Completed in this session).
* **Phase 2: Automated Core Engines (Days 16-30):** Integrations for Google Maps, Claude API copywriting, Astro code compilation, and Cloudflare CLI subdomain deployment.
* **Phase 3: Scale & Launch (Days 31-45):** Setup transactional email templates, webhook tracking, BullMQ job queues, Stripe onboarding billing portals, and custom domain mapping.