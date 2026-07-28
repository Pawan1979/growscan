# 💰 GrocScan — Total Cost of Ownership (TCO)
## Complete Google Cloud + All Services Breakdown

> **Currency**: All costs in ₹ (INR). USD converted at ₹84 = $1  
> **Region**: asia-south1 (Mumbai) — lowest latency for Indian users  
> **Strategy**: Maximize free tiers → Pay only for what you use

---

## 🏗️ Full Architecture Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                    USERS (Mobile / Web)                          │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────────────┐
│           Firebase Hosting (CDN + Static Frontend)               │
│           Next.js PWA — Mobile-first                            │
└────────────────────────┬────────────────────────────────────────┘
                         │ API Calls
┌────────────────────────▼────────────────────────────────────────┐
│                  Cloud Run (Backend API)                          │
│                  Node.js / Python FastAPI                        │
└──────┬─────────────────┬──────────────────┬───────────────────┘
       │                 │                  │
┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐
│  Cloud SQL  │   │  Upstash    │   │  Cloud      │
│  PostgreSQL │   │  Redis      │   │  Storage    │
│  (History)  │   │  (Cache)    │   │  (Images)   │
└─────────────┘   └─────────────┘   └─────────────┘
       │
┌──────▼──────────────────────────────────────────┐
│              External APIs                        │
│  QuickCommerceAPI + Google Maps + Firebase FCM   │
└──────────────────────────────────────────────────┘
```

---

## 💳 ONE-TIME SETUP COSTS (Pay Once)

| Item | Service | Cost (₹) | Notes |
|---|---|---|---|
| Domain name (.in) | GoDaddy / Google Domains | ₹800–1,200/year | grocscan.in |
| Google Play Store | Google Developer Account | ₹2,100 (one-time) | ~$25 |
| Apple App Store | Apple Developer Program | ₹8,200/year | ~$99/year, skip for MVP |
| SSL Certificate | Let's Encrypt via Firebase | ₹0 | Free, auto-renews |
| GCP Account Setup | Google Cloud | ₹0 | Free |
| **GCP New Account Credit** | Google Cloud | **-₹25,200** | **$300 free trial credit** |
| Firebase Setup | Firebase | ₹0 | Free |
| **Total One-Time (Net)** | | **~₹0** (credit covers it) | First 3 months essentially free |

> 🎁 **Google Cloud gives $300 (~₹25,200) free trial credit** to all new accounts. This alone covers 3-6 months of MVP costs.

---

## 📅 PHASE 1 — MVP (Month 1–3)
### Scale: 0–500 Daily Active Users (DAU)
### Daily searches: ~1,500 (3 per user × 500 users)

---

### 🟢 Google Cloud Services

#### 1. Cloud Run (Backend API)
| Metric | Value |
|---|---|
| Free tier | 2M requests/month + 180K vCPU-seconds + 360K GiB-seconds |
| MVP usage | ~45K requests/month (well within free tier) |
| **Monthly cost** | **₹0** ✅ |

#### 2. Firebase Hosting (Frontend)
| Metric | Value |
|---|---|
| Free tier | 10 GB storage + 360 MB/day transfer |
| MVP usage | ~100 MB storage, ~50 MB/day transfer |
| **Monthly cost** | **₹0** ✅ |

#### 3. Firebase Authentication
| Metric | Value |
|---|---|
| Free tier | 10,000 MAU |
| Strategy | No login required for MVP (skip auth entirely) |
| **Monthly cost** | **₹0** ✅ |

#### 4. Cloud SQL PostgreSQL (Price History DB)
| Metric | Value |
|---|---|
| Instance | db-f1-micro (shared, dev/test) |
| Cost | ~$7.67/month |
| Storage | 10 GB SSD @ $0.17/GB |
| **Monthly cost** | **~₹730** (~$8.70) |

> 💡 **MVP Alternative**: Use Firebase Firestore (free tier: 50K reads + 20K writes/day). Skip Cloud SQL until you need price history.

#### 4b. Firebase Firestore (Alternative to Cloud SQL for MVP)
| Metric | Value |
|---|---|
| Free tier | 1 GiB storage + 50K reads + 20K writes/day |
| MVP usage | Well within free tier |
| **Monthly cost** | **₹0** ✅ |

#### 5. Cloud Storage (Product Images Cache)
| Metric | Value |
|---|---|
| Free tier | 5 GB storage + 1 GB egress/month |
| MVP usage | ~1 GB images |
| **Monthly cost** | **₹0** ✅ |

#### 6. Google Maps — Geocoding API (Pincode → Lat/Lng)
| Metric | Value |
|---|---|
| Previous free tier | $200/month credit (now retired March 2025) |
| Current model | Free requests cap per API type |
| Geocoding free | ~$5 worth/month under new caps |
| MVP requests | ~500 unique pincodes/day = 15K/month |
| Cost at $0.005/request | $75/month IF fully charged |
| **Optimization** | Cache pincode→lat/lng in Redis (each pincode used 100s of times) |
| **With caching (99% hit)** | **~150 unique API calls/month = ~₹62** |

> 💡 **Key optimization**: Cache `pincode → lat/lng` permanently. There are only ~30,000 unique pincodes in India. After the first lookup, it's free forever.

#### 7. Firebase Cloud Messaging — Push Notifications
| Free tier | Unlimited push notifications |
| **Monthly cost** | **₹0** ✅ |

#### 8. Cloud Build (CI/CD)
| Free tier | 120 build-minutes/day |
| **Monthly cost** | **₹0** ✅ |

#### 9. Cloud Monitoring + Logging
| Free tier | 50 GB logs/month, basic metrics |
| **Monthly cost** | **₹0** ✅ |

#### 10. Secret Manager (API keys storage)
| Free tier | 6 active secrets + 10K access operations |
| **Monthly cost** | **₹0** ✅ |

---

### 🔵 Third-Party Services

#### 11. QuickCommerceAPI.com (Core Data Source)
| Metric | Value |
|---|---|
| Daily searches | 1,500 × 5 platforms = 7,500 credits/day |
| Monthly raw need | 225,000 credits |
| Cache hit rate (5-min TTL) | 70% — popular products in same pincode |
| Effective credits needed | 225,000 × 30% = **67,500 credits/month** |
| Pack to buy | Growth pack: ₹1,800 = 10,000 credits |
| Packs needed | 7 packs = **₹12,600/month** |
| **Better option** | Pro pack: ₹7,500 = 50,000 credits (need 2 packs = ₹15,000) |

> ⚠️ **Reality check**: At 500 DAU, API cost is the biggest expense. You MUST implement aggressive caching.

> 💡 **Cost hack**: With a **10-minute cache TTL** instead of 5 min, hit rate jumps to 85% → effective credits = 33,750/month = 1.3 Growth packs = **₹2,340/month**

| Cache Strategy | Cache TTL | Hit Rate | Credits/Month | API Cost |
|---|---|---|---|---|
| No cache | — | 0% | 225,000 | ₹40,500 |
| Basic cache | 5 min | 70% | 67,500 | ₹12,150 |
| Smart cache | 10 min | 85% | 33,750 | ₹6,075 |
| Aggressive cache | 30 min | 95% | 11,250 | ₹2,025 |

> 🎯 **Recommendation**: Use **10-minute cache** for prices (they don't change that often). This drops API cost to ~₹6,000/month at 500 DAU.

#### 12. Upstash Redis (Caching Layer)
| Metric | Value |
|---|---|
| Free tier | 500,000 requests/month |
| MVP usage | ~300K commands/month |
| **Monthly cost** | **₹0** ✅ (within free tier) |

#### 13. SendGrid (Email — Alerts & OTP)
| Free tier | 100 emails/day (3,000/month) |
| MVP usage | ~500 emails/month |
| **Monthly cost** | **₹0** ✅ |

#### 14. Sentry (Error Monitoring)
| Free tier | 5,000 errors/month |
| **Monthly cost** | **₹0** ✅ |

#### 15. GitHub (Code Repository + CI/CD)
| Free tier | Unlimited public repos, 2,000 CI minutes/month |
| **Monthly cost** | **₹0** ✅ |

---

### 📊 PHASE 1 TOTAL — Monthly Burn Rate

| Category | Service | Monthly Cost (₹) |
|---|---|---|
| **Google Cloud** | Cloud Run | ₹0 |
| | Firebase Hosting | ₹0 |
| | Firebase Auth | ₹0 |
| | Firestore (instead of Cloud SQL) | ₹0 |
| | Cloud Storage | ₹0 |
| | Google Maps (cached) | ₹62 |
| | FCM Notifications | ₹0 |
| | Cloud Build / Monitoring | ₹0 |
| **Third-Party** | QuickCommerceAPI (10-min cache) | ₹6,075 |
| | Upstash Redis | ₹0 |
| | SendGrid | ₹0 |
| | Sentry | ₹0 |
| | GitHub | ₹0 |
| **Infrastructure** | Domain (grocscan.in) | ₹83 |
| | SSL | ₹0 |
| **TOTAL** | | **~₹6,220/month** |

> 🎁 **With $300 GCP credit**: First 3 months effectively **₹6,220/month** (only API cost matters)  
> 🎁 **With QuickCommerceAPI 100 free credits**: Month 1 even cheaper

---

## 📅 PHASE 2 — GROWTH (Month 4–8)
### Scale: 500–5,000 Daily Active Users
### Daily searches: ~15,000 (3 per user × 5,000 DAU)

---

### Service Cost Changes vs Phase 1

#### Cloud Run (Backend)
| Metric | Value |
|---|---|
| Requests | ~450K/month (beyond free 2M? No, still free!) |
| vCPU usage | ~500K vCPU-seconds (beyond 180K free tier) |
| Extra cost | ~$3.84/month for vCPU overage |
| **Monthly cost** | **~₹320** |

#### Cloud SQL PostgreSQL (Now needed for price history)
| Metric | Value |
|---|---|
| Instance | db-g1-small ($25.46/month) |
| Storage | 20 GB SSD ($3.40/month) |
| Static IP | $7.30/month |
| **Monthly cost** | **~₹3,035** (~$36) |

#### Google Maps Geocoding
| Metric | Value |
|---|---|
| Unique pincodes (cached) | ~1,500 new unique pincodes/month |
| Cost at $0.005/request | $7.50/month |
| **Monthly cost** | **~₹630** |

#### Upstash Redis (Exceeds free tier)
| Metric | Value |
|---|---|
| Commands/month | ~5M (beyond 500K free) |
| Cost | $0.20 per 100K commands = $8.50/month |
| **Monthly cost** | **~₹714** |

#### QuickCommerceAPI
| Metric | Value |
|---|---|
| Daily searches | 15,000 × 5 platforms = 75,000 raw credits/day |
| Monthly raw | 2,250,000 credits |
| With 10-min cache (85% hit) | 337,500 credits/month |
| Pro pack: 50,000 credits = ₹7,500 | Need 7 packs = ₹52,500 |
| Scale pack: 200,000 credits = ₹24,000 | Need 2 packs = ₹48,000 |
| **Monthly cost** | **~₹48,000** (Scale pack × 2) |

> ⚠️ **API cost becomes the dominant cost at growth stage**. This is where you need to increase cache TTL and negotiate with QuickCommerceAPI for bulk/custom pricing.

#### Firebase Hosting (CDN - still free)
| **Monthly cost** | **₹0** ✅ |

#### Cloud CDN (for faster mobile performance)
| Cost | $0.08/GB |
| Data transferred | ~50 GB/month |
| **Monthly cost** | **~₹336** (~$4) |

#### SendGrid (Email Alerts - paid tier)
| Plan | Essentials: $19.95/month |
| **Monthly cost** | **~₹1,676** |

#### Sentry (Team plan)
| Plan | $26/month |
| **Monthly cost** | **~₹2,184** |

---

### 📊 PHASE 2 TOTAL — Monthly Burn Rate

| Category | Service | Monthly Cost (₹) |
|---|---|---|
| **Google Cloud** | Cloud Run | ₹320 |
| | Firebase Hosting + CDN | ₹336 |
| | Cloud SQL PostgreSQL | ₹3,035 |
| | Cloud Storage | ₹0 |
| | Google Maps | ₹630 |
| | FCM | ₹0 |
| | Cloud Monitoring | ₹0 |
| **Third-Party** | QuickCommerceAPI | ₹48,000 |
| | Upstash Redis | ₹714 |
| | SendGrid | ₹1,676 |
| | Sentry | ₹2,184 |
| | GitHub | ₹0 |
| **Infrastructure** | Domain | ₹83 |
| **TOTAL** | | **~₹56,978/month** |

---

## 📅 PHASE 3 — SCALE (Month 9–12+)
### Scale: 5,000–50,000 Daily Active Users
### Daily searches: ~150,000 (3 per user × 50,000 DAU)

---

### Major Cost Shifts at Scale

#### Cloud Run (High traffic)
| Instance count | 2–4 auto-scaled instances |
| vCPU-seconds/month | ~5M (way beyond free tier) |
| Cost | ~$40–80/month |
| **Monthly cost** | **~₹3,360–6,720** |

#### Cloud SQL (Larger instance)
| Instance | db-n1-standard-2 (2 vCPU, 7.5 GB RAM) |
| Cost | ~$51/month + storage |
| Read replicas for performance | +$51/month |
| **Monthly cost** | **~₹8,820** (~$105) |

#### Google Maps Geocoding
| Unique requests | ~10K/month (pincode cache = low) |
| **Monthly cost** | **~₹4,200** (~$50) |

#### Upstash Redis → Switch to Fixed Plan
| Plan | $80/month fixed (1 GB) |
| **Monthly cost** | **~₹6,720** |

#### QuickCommerceAPI — CRITICAL DECISION POINT
| Daily credits (raw) | 750,000/day |
| Monthly raw | 22,500,000 credits |
| With 85% cache | 3,375,000 credits/month |
| Scale pack cost (₹0.12/credit) | **₹405,000/month** 😱 |

> ⛔ **At this scale, QuickCommerceAPI becomes too expensive.**

#### 🔄 Phase 3 Strategy: Hybrid Data Approach

**Option A — Negotiate Custom Enterprise Rate**
- Contact QuickCommerceAPI directly
- At 3M+ credits/month, negotiate ₹0.03–0.05/credit
- Cost: ₹90,000–150,000/month

**Option B — Build Your Own Scraper (Partial)**
- Use QuickCommerceAPI for real-time, on-demand searches
- Run your own Playwright scraper for background price refresh
- Scrapers run on Cloud Run Jobs (batch) with Bright Data proxies
- Cost: ~₹15,000–25,000/month for self-hosted scraping

**Option C — Hybrid (Best)**
- QuickCommerceAPI for fresh user searches (30% traffic) → ~₹120,000/month
- Self-scraped background cache refresh (70% traffic served from DB) → ~₹20,000/month
- **Total: ~₹140,000/month** vs ₹405,000 without optimization

#### Cloud Run Jobs (Background Scrapers)
| Use case | Scheduled price refresh every 30 min for top 500 products |
| Tool | Playwright + Bright Data proxies |
| Bright Data India residential | ~$5/GB, ~100 GB/month = $500/month |
| Cloud Run Jobs | ~$20/month |
| **Monthly cost** | **~₹42,840** (~$510) |

#### Cloud Armor (DDoS Protection)
| Cost | $15/month + $1 per million requests |
| **Monthly cost** | **~₹1,890** |

#### Firebase → Cloud Firestore (paid tier)
| Reads beyond free | $0.06 per 100K |
| Writes beyond free | $0.18 per 100K |
| **Monthly cost** | **~₹2,520** |

---

### 📊 PHASE 3 TOTAL — Monthly Burn Rate (Optimized)

| Category | Service | Monthly Cost (₹) |
|---|---|---|
| **Google Cloud** | Cloud Run (API) | ₹5,040 |
| | Cloud Run Jobs (scrapers) | ₹1,680 |
| | Firebase Hosting | ₹0 |
| | Cloud CDN | ₹2,520 |
| | Cloud SQL (n1-standard-2) | ₹8,820 |
| | Cloud Storage | ₹840 |
| | Google Maps | ₹4,200 |
| | Cloud Armor (DDoS) | ₹1,890 |
| | Firestore (paid) | ₹2,520 |
| | FCM | ₹0 |
| | Cloud Monitoring | ₹1,680 |
| **Third-Party** | QuickCommerceAPI (negotiated) | ₹120,000 |
| | Bright Data Proxies (scrapers) | ₹42,000 |
| | Upstash Redis (fixed) | ₹6,720 |
| | SendGrid | ₹2,520 |
| | Sentry Team | ₹2,184 |
| | GitHub Team | ₹840 |
| **Infrastructure** | Domain + SSL | ₹250 |
| **Apple Dev** | App Store fee | ₹683/month (₹8,200/year) |
| **TOTAL** | | **~₹204,387/month** |

---

## 👨‍💻 HUMAN RESOURCE COSTS

### Option A: Solo Founder (You build everything)
| | MVP | Growth | Scale |
|---|---|---|---|
| Developers | 1 (you) | 1 | 2 |
| Cost | ₹0 | ₹0 | ₹80K–1.5L/month |

### Option B: Small Team (Outsource/Hire)
| Role | Monthly Cost |
|---|---|
| Full-stack developer (mid) | ₹60,000–80,000 |
| Part-time designer | ₹20,000–30,000 |
| Part-time DevOps | ₹20,000–30,000 |
| **Total team cost** | **₹1,00,000–1,40,000/month** |

### Option C: Freelancers for MVP only
| Task | One-time Cost |
|---|---|
| UI Design (Figma) | ₹15,000–30,000 |
| Frontend dev (Next.js) | ₹30,000–50,000 |
| Backend dev (Node.js) | ₹20,000–40,000 |
| **Total freelancer MVP** | **₹65,000–1,20,000** |

---

## 📈 COMPLETE TCO SUMMARY TABLE

| Phase | Duration | Users (DAU) | Infra Cost/Month | API Cost/Month | **Total/Month** |
|---|---|---|---|---|---|
| **MVP** | Month 1–3 | 0–500 | ₹145 | ₹6,075 | **₹6,220** |
| **Growth** | Month 4–8 | 500–5,000 | ₹8,965 | ₹48,000 | **₹56,978** |
| **Scale** | Month 9–12 | 5,000–50,000 | ₹32,145 | ₹162,000 | **₹1,94,145** |

### With one-time costs:
| Item | Cost |
|---|---|
| Domain (year 1) | ₹1,000 |
| Google Play Store | ₹2,100 |
| Apple Dev (year 1) | ₹8,200 |
| Freelancer MVP build | ₹80,000 |
| **Total one-time** | **~₹91,300** |

### GCP Free Credits Savings:
- $300 new account credit = ₹25,200
- Covers ~4 months of Phase 1 infra costs

---

## 💡 TOP 10 COST OPTIMIZATION STRATEGIES

### 1. ♻️ Pin Code Geocoding Cache (PERMANENT)
```
Store pincode → lat/lng in Cloud SQL FOREVER
India has only 29,000 pincodes
Cost after seeding: ₹0 for geocoding
Savings: ₹600–4,200/month
```

### 2. 🕐 Aggressive Price Cache (30-min TTL)
```
Cache: search:{product}:{pincode} = 30 min TTL
Hit rate: 90-95% at scale
API credit savings: 90% reduction
Impact: ₹40,000 → ₹4,000/month
```

### 3. 🔥 Popular Products Pre-fetch (Background Jobs)
```
Top 200 products × 100 pincodes = 20,000 combos
Refresh every 30 min via Cloud Run Jobs (off-peak)
Cost: cheap batch compute vs expensive real-time per user
```

### 4. 📦 Use Firebase Firestore Instead of Cloud SQL for MVP
```
Firestore free tier: 50K reads + 20K writes/day
Skip Cloud SQL until Month 4+
Savings: ₹730/month in Phase 1
```

### 5. 🌐 Use Cloud Run's 0-to-1 Scaling
```
Configure min-instances = 0 (scale to zero at night)
Indian users mostly active 7AM–11PM
~8 hours/day idle = 33% compute savings
```

### 6. 📊 Negotiate QuickCommerceAPI Volume Discount
```
At 1M+ credits/month, contact them for custom rate
Target: ₹0.05/credit vs ₹0.12 (58% savings)
Monthly savings at scale: ₹210,000
```

### 7. 🤖 Build Partial Self-Scraper After Month 6
```
Scrape top 100 products in 10 major cities on schedule
Use Playwright + Cloud Run Jobs
Cost: ~₹15,000/month in proxies+compute
Saves: ₹100,000+/month in API credits
```

### 8. 🖼️ Lazy Load & Cache Product Images
```
Store product images in Cloud Storage CDN
Don't hit QuickCommerceAPI image URLs repeatedly
Saves bandwidth + improves app speed
```

### 9. 💳 GCP Committed Use Discounts (Phase 3+)
```
1-year commitment on Cloud SQL → 25% savings
3-year commitment → 52% savings
Applicable once usage is predictable
```

### 10. 📱 PWA First, Native App Later
```
Build Progressive Web App first (no App Store fees)
Add to home screen = feels like native app
Save ₹8,200/year in Apple fees until you have revenue
```

---

## 💰 REVENUE VS COST — BREAK-EVEN ANALYSIS

### Revenue Model:
| Source | Rate | At 500 DAU | At 5,000 DAU | At 50,000 DAU |
|---|---|---|---|---|
| Affiliate (2% × ₹500 avg order) | ₹10/converted order | ₹5,000/month | ₹50,000/month | ₹5,00,000/month |
| Conversion rate | 5% of searches | | | |
| Premium alerts | ₹49/month | ₹490/month | ₹4,900/month | ₹49,000/month |
| **Total Revenue** | | **~₹5,500** | **~₹54,900** | **~₹5,49,000** |
| **Total Cost** | | **₹6,220** | **₹56,978** | **₹2,04,387** |
| **Net P&L** | | **-₹720** | **-₹2,078** | **+₹3,44,613** |

### Break-even:
- **Near break-even at ~4,500–5,000 DAU**
- **Profitable from ~6,000+ DAU**
- **Strong profit from ~10,000+ DAU**

---

## 🗓️ Month-by-Month Cost Forecast (First Year)

| Month | DAU | Infra (₹) | API (₹) | Total (₹) | Revenue (₹) | Net (₹) |
|---|---|---|---|---|---|---|
| 1 | 50 | 0 (free credit) | 607 | 607 | 550 | -57 |
| 2 | 150 | 0 (free credit) | 1,821 | 1,821 | 1,650 | -171 |
| 3 | 500 | 0 (free credit) | 6,075 | 6,075 | 5,500 | -575 |
| 4 | 1,000 | 4,305 | 12,150 | 16,455 | 11,000 | -5,455 |
| 5 | 2,000 | 6,985 | 24,300 | 31,285 | 22,000 | -9,285 |
| 6 | 3,500 | 8,965 | 42,525 | 51,490 | 38,500 | -12,990 |
| 7 | 5,000 | 8,965 | 48,000 | 56,965 | 55,000 | -1,965 |
| 8 | 8,000 | 15,000 | 60,000 | 75,000 | 88,000 | +13,000 |
| 9 | 15,000 | 32,000 | 100,000 | 132,000 | 165,000 | +33,000 |
| 10 | 25,000 | 45,000 | 130,000 | 175,000 | 275,000 | +100,000 |
| 11 | 35,000 | 55,000 | 150,000 | 205,000 | 385,000 | +180,000 |
| 12 | 50,000 | 65,000 | 162,000 | 227,000 | 550,000 | +323,000 |

### Year 1 Totals:
| | Amount |
|---|---|
| **Total spend** | ~₹9,74,697 |
| **Total revenue** | ~₹15,96,700 |
| **Year 1 Net Profit** | **~₹6,22,003** ✅ |
| **Break-even month** | **Month 7–8** |

---

## 🚀 RECOMMENDED LAUNCH STACK (Cost-Optimized)

```
MVP (Month 1-3): Total ₹6,220/month
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Cloud Run (free tier)
✅ Firebase Hosting (free)
✅ Firebase Firestore (free)
✅ Upstash Redis (free tier)
✅ QuickCommerceAPI Growth pack (₹1,800 = 10K credits)
   + 10-min cache = lasts ~3 days per pack
   Monthly: ~7 packs but with caching ~2 packs = ₹3,600-6,075
✅ Google Maps Geocoding (cached pincode table)
✅ Firebase FCM notifications (free)
✅ GitHub (free)
✅ Sentry (free tier)
✅ Domain: grocscan.in (₹83/month)

TOTAL: ~₹6,220/month
With $300 GCP credit: Effectively FREE for 3 months
```
