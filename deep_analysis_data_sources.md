# 🔬 Deep Analysis: Data Sources for Quick Commerce Price Comparison App

## Executive Summary

There are **NO official public APIs** from Blinkit, Zepto, Swiggy Instamart, or JioMart for third-party developers. All data access falls into 4 categories:
1. **Government open data** (limited to essential commodities)
2. **Amazon's official PA-API** (Amazon Fresh only)
3. **Commercial data scraping providers** (paid, reliable, legal)
4. **DIY web scraping / reverse-engineered APIs** (free, fragile, grey area)

---

## 🏛️ TIER 1: Official / Legal Data Sources

### 1. Amazon Product Advertising API (PA-API v5)
| Field | Detail |
|---|---|
| **Covers** | Amazon.in Fresh, Pantry, daily groceries |
| **URL** | https://webservices.amazon.in/paapi5/documentation/ |
| **Auth** | Amazon Associates account + API keys |
| **Data** | Product name, price, MRP, availability, delivery estimate |
| **Location** | Pincode-based via API parameters |
| **Cost** | Free (requires active Associates account) |
| **Reliability** | ⭐⭐⭐⭐⭐ Very High — official API |
| **Limitation** | Only covers Amazon Fresh, not Blinkit/Zepto |

**Sample Request:**
```json
{
  "Keywords": "Amul Toned Milk 500ml",
  "Resources": ["Offers.Listings.Price", "ItemInfo.Title"],
  "PartnerTag": "your-associate-tag",
  "MarketPlace": "www.amazon.in"
}
```

---

### 2. Ministry of Consumer Affairs — Price Monitoring System (PMS)
| Field | Detail |
|---|---|
| **Portal** | https://fcainfoweb.nic.in/ |
| **Data** | Retail & wholesale prices of 38 essential commodities |
| **Commodities** | Onion, potato, tomato, pulses, edible oils, wheat, rice, sugar, milk |
| **Frequency** | Daily updates |
| **Coverage** | 550+ reporting centers across India |
| **Bulk data** | https://data.gov.in (Open Government Data India) |
| **API** | No direct REST API; requires NIC coordination for bulk enterprise access |
| **Best For** | Price baselines, historical trends, govt. reference data |

> ⚠️ This covers staple commodities — it does NOT give platform-specific prices (i.e., it won't tell you Blinkit's price vs Zepto's price, just the market retail price).

---

## 🏢 TIER 2: Commercial Data Providers (Paid, Reliable)

These are the **best option for a production app**. They handle all scraping complexity, proxy rotation, and maintenance.

### 1. QuickCommerceAPI.com ⭐ BEST FOR YOUR USE CASE
| Field | Detail |
|---|---|
| **Website** | https://quickcommerceapi.com |
| **Platforms** | Blinkit, Zepto, Swiggy Instamart, BigBasket, Amazon Fresh, JioMart |
| **Data** | Real-time price, MRP, stock status, delivery ETA |
| **Location** | Pincode or lat/lng based |
| **Free Tier** | 100 free credits on signup (no credit card) |
| **Pricing** | Pay-as-you-go credit system |
| **Output** | JSON |
| **Reliability** | ⭐⭐⭐⭐ High (they maintain the scrapers) |

**Sample Response Structure:**
```json
{
  "product": "Amul Toned Milk 500ml",
  "pincode": "400001",
  "results": [
    { "platform": "Blinkit", "price": 28, "mrp": 30, "in_stock": true, "delivery_eta": "10 mins" },
    { "platform": "Zepto", "price": 27, "mrp": 30, "in_stock": true, "delivery_eta": "8 mins" },
    { "platform": "Instamart", "price": 29, "mrp": 30, "in_stock": false, "delivery_eta": null }
  ]
}
```

---

### 2. Foodspark.io
| Field | Detail |
|---|---|
| **Website** | https://foodspark.io |
| **Platforms** | Blinkit, Zepto, Swiggy Instamart, BigBasket, Dunzo |
| **Data** | Price, MRP, discounts, stock levels, product assortment, delivery ETA |
| **Coverage** | Multi-city, specific pincodes |
| **Pricing** | Custom quote based on volume, frequency, platforms |
| **Best For** | Enterprise/B2B market intelligence, FMCG brand monitoring |
| **Reliability** | ⭐⭐⭐⭐ High |

---

### 3. Actowiz Solutions
| Field | Detail |
|---|---|
| **Website** | https://actowizsolutions.com |
| **Services** | Custom scraping + structured data delivery |
| **Platforms** | All major Indian quick commerce + e-commerce |
| **Delivery** | CSV, JSON, API feed, scheduled dumps |
| **Pricing** | Project-based / subscription |
| **Best For** | One-time data dumps + ongoing monitoring |

---

### 4. RetailGators
| Field | Detail |
|---|---|
| **Website** | https://retailgators.com |
| **Focus** | Indian retail + quick commerce price tracking |
| **Data** | Price, availability, promotions, share of shelf |
| **Best For** | Brand analytics and competitor pricing |

---

### 5. Bright Data (formerly Luminati) — Proxy + Scraper
| Field | Detail |
|---|---|
| **Website** | https://brightdata.com |
| **What it is** | Managed proxy network + ready-to-use datasets |
| **Indian IP pool** | Millions of IPs, city/ASN-level targeting |
| **Ready datasets** | E-commerce product datasets (check for Indian QC platforms) |
| **Pricing** | ~$4–8/GB (residential); dataset pricing varies |
| **Best For** | Building your own scraper with premium proxies |

---

## 🔧 TIER 3: Apify Marketplace (Pre-built Scrapers)

Apify has **ready-made actors** you can run via API. Best for MVPs and prototyping.

### Available Actors for Indian Quick Commerce

| Platform | Actor Name | Author | What it does |
|---|---|---|---|
| **Blinkit** | Blinkit Data Extractor | Smacient | Extracts price, MRP, stock status by location |
| **Zepto** | Zepto Data Extractor | Smacient | Keyword/category search with local pricing |
| **Swiggy Instamart** | Swiggy Instamart Extractor | Smacient | Product data, search, categories for any Indian city |

**Find them at:** https://apify.com/store (search: "Blinkit", "Zepto", "Instamart")

> ⚠️ **Requirement**: Apify residential proxies are mandatory — datacenter IPs are blocked by these platforms.

**How to call via API:**
```javascript
const { ApifyClient } = require('apify-client');
const client = new ApifyClient({ token: 'YOUR_APIFY_TOKEN' });

const run = await client.actor('smacient/blinkit-scraper').call({
  searchQuery: 'Amul Milk',
  latitude: 12.9716,
  longitude: 77.5946,
  maxResults: 20
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();
```

**Pricing:**
- Apify free tier: $5/month compute units
- Residential proxy: ~$12–15/GB
- Estimated cost per search: $0.01–0.05

---

## 🛠️ TIER 4: DIY Scraping (Self-Built)

### Platform Technical Architecture (Anti-bot Analysis)

| Platform | Frontend Stack | Anti-Bot Protection | Location Mechanism |
|---|---|---|---|
| **Blinkit** | Next.js + React (Hybrid SSR/SPA) | **Cloudflare WAF** + Bot Management, TLS fingerprinting, Turnstile CAPTCHA | lat/lng in API payload or pincode session |
| **Zepto** | Next.js + React (Mobile-first SPA) | **Cloudflare + Akamai** + device fingerprinting, request signing | GPS pin via session token — strict dark store mapping |
| **Swiggy Instamart** | React SPA (micro-frontend inside Swiggy) | **Akamai Edge** + custom WAF, `x-device-id` header, CSRF tokens | Address/lat-long session initialization required |
| **BigBasket** | React SPA | Cloudflare protection | Pincode-based |
| **Amazon Fresh** | React SPA | Amazon Bot Shield | Pincode-based |

---

### Reverse-Engineered API Patterns (from mitmproxy analysis)

> These are internal endpoints discovered via traffic interception. They change without notice.

**Common endpoint patterns:**
```
# Store mapping — get dark store ID from coordinates
GET /v1/location/store-mapping?lat=12.97&lng=77.59
GET /api/v2/darkstore/select?pincode=560001

# Product search — once store ID is established
GET /v2/search/products?query=amul+milk&store_id=123
GET /api/v1/catalog/items?q=milk&lat=12.97&lng=77.59

# Product detail page
GET /v1/pdp/details?product_id=456&store_id=123
```

**Required headers (vary by platform):**
```
Authorization: Bearer <JWT_TOKEN>
x-device-id: <fingerprint>
x-app-version: <mobile_app_version>
Content-Type: application/json
User-Agent: <mobile_user_agent>
```

---

### Playwright Scraping Setup (Best DIY Approach)

**Step 1: Location Injection**
```javascript
// Playwright - inject geolocation before navigation
const context = await browser.newContext({
  geolocation: { latitude: 12.9716, longitude: 77.5946 }, // Bengaluru
  permissions: ['geolocation']
});

// OR inject via localStorage/cookies
await page.addInitScript(() => {
  localStorage.setItem('userPincode', '560001');
  localStorage.setItem('userLat', '12.9716');
  localStorage.setItem('userLng', '77.5946');
});
```

**Step 2: Intercept XHR/Fetch (better than DOM parsing)**
```javascript
// Intercept the actual API response — more reliable than DOM selectors
page.on('response', async (response) => {
  const url = response.url();
  if (url.includes('/api/v2/search') || url.includes('/v2/search/products')) {
    try {
      const data = await response.json();
      // data contains real-time product catalog with prices
      console.log('Products:', data.products);
    } catch (e) {}
  }
});

await page.goto('https://blinkit.com');
await page.fill('[data-testid="search-input"]', 'Amul Milk');
await page.press('[data-testid="search-input"]', 'Enter');
await page.waitForTimeout(3000); // wait for API response
```

**Step 3: Anti-detection (Stealth)**
```javascript
// Use playwright-stealth to avoid bot detection
const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth');
chromium.use(stealth());

const browser = await chromium.launch({
  args: ['--disable-blink-features=AutomationControlled']
});
```

---

### Proxy Provider Comparison for India

| Provider | Indian IP Pool | Pricing | Best For |
|---|---|---|---|
| **Bright Data** | Excellent (Millions, city-level targeting) | ~$4–8/GB | Enterprise, max success rate |
| **Oxylabs** | High (ethically sourced) | ~$8/GB; plans from $300/mo | Enterprise, high reliability |
| **Smartproxy** | Strong | ~$4.50–7/GB | Mid-market, good balance |
| **IPRoyal** | Moderate | ~$5.25/GB (**traffic never expires**) | Small projects, pay-as-you-go |
| **Apify Proxy** | Good (via residential pool) | ~$12–15/GB | If already using Apify actors |

---

## 📦 GitHub Open Source Projects

These repos are available as starting points:

| Project | URL | Description |
|---|---|---|
| **Quick_Commerce_Intelligence_System** | github.com/allaboutaayushi/Quick_Commerce_Intelligence_System | AI-powered tracker for Blinkit, Zepto, Instamart in Python |
| **QuickCom** | github.com/KshKnsl/QuickCom | Full-stack Node.js app comparing Blinkit, Zepto, Instamart prices |
| **Blinkit-Scraping** | github.com/Mayankt-21/Blinkit-Scraping | Python + Selenium with location spoofing |
| **zepto-blinkit (hermes-agent)** | github.com/LoneTraderRishi/zepto-blinkit | AI agent for searching across Zepto + Blinkit |
| **Blinkit_Data_Analytics_Project** | github.com/vimlesh-gupta/Blinkit_Data_Analytics_Project | End-to-end analytics with Power BI |

---

## ⚖️ Legal Landscape in India

### IT Act 2000
| Section | Risk |
|---|---|
| Section 43 | Civil liability for unauthorized computer system access |
| Section 66 | Criminal liability (imprisonment + fines) for fraudulent unauthorized access |
| Section 66E | Privacy violations if PII (user reviews, ratings with names) are extracted |

### DPDP Act 2023
- Restricts handling personal data without explicit consent
- Product catalogs and prices are NOT personal data — generally safe
- User reviews with names/photos — risky to extract

### ToS Enforcement Reality
- All platforms (Blinkit, Zepto, Swiggy) explicitly **prohibit** automated scraping in ToS
- **Practical risk**: IP bans are common; legal action is rare for small-scale / non-commercial use
- **Commercial use**: Higher legal risk — use authorized providers (QuickCommerceAPI, Foodspark)

---

## 🗺️ Decision Framework: Which Data Source to Use?

```
Are you building for personal/demo use?
  └── YES → DIY Playwright scraper + IPRoyal proxies (~$20–50/month)
  └── NO  → Is budget < $200/month?
              └── YES → Apify Actors (Smacient's actors) + Apify proxy
              └── NO  → QuickCommerceAPI.com (most comprehensive, easiest integration)
                          OR Foodspark.io (enterprise-grade, custom pricing)
```

---

## 🔌 Recommended Data Stack for Your App

### MVP (Low Cost)
| Component | Tool | Cost |
|---|---|---|
| Amazon Fresh | Amazon PA-API | Free |
| Blinkit + Zepto | QuickCommerceAPI.com | Free tier → pay-as-you-go |
| Government baseline | data.gov.in | Free |
| Caching | Redis | ~$10/month |

### Production Scale
| Component | Tool | Cost |
|---|---|---|
| All platforms | QuickCommerceAPI.com or Foodspark.io | Custom pricing |
| Fallback scraping | Playwright + Bright Data residential proxies | ~$4–8/GB |
| Apify actors | Smacient's Blinkit/Zepto actors | ~$0.01–0.05/search |
| DB + cache | PostgreSQL + Redis | ~$30/month |

---

## 📋 Platforms Coverage Summary

| Platform | Official API | QuickCommerceAPI | Apify Actor | DIY Scraping Difficulty |
|---|---|---|---|---|
| **Amazon Fresh** | ✅ PA-API v5 | ✅ | ✅ | 🟡 Medium |
| **Blinkit** | ❌ | ✅ | ✅ (Smacient) | 🔴 Hard (Cloudflare) |
| **Zepto** | ❌ | ✅ | ✅ (Smacient) | 🔴 Hard (Cloudflare+Akamai) |
| **Swiggy Instamart** | ❌ | ✅ | ✅ (Smacient) | 🔴 Hard (Akamai) |
| **BigBasket** | ❌ | ✅ | ⚠️ Limited | 🟡 Medium |
| **JioMart** | ❌ | ✅ | ⚠️ Limited | 🟡 Medium |
| **Dunzo** | ❌ | ⚠️ Partial | ❌ | 🔴 Hard |
| **Govt PMS data** | ✅ (limited) | ❌ | ❌ | ✅ Easy |

---

## 🚀 Recommended Action Plan

### Phase 1: Validate Idea (Week 1-2)
1. Sign up for **QuickCommerceAPI.com** free tier (100 credits)
2. Use **Amazon PA-API** for Amazon Fresh (free)
3. Build a simple frontend to show price comparison
4. Test with real pincodes for Blinkit, Zepto, Instamart

### Phase 2: Build MVP (Week 3-6)
1. Integrate QuickCommerceAPI into your backend
2. Add Redis caching (cache by `product + pincode` for 5 minutes)
3. Build product search + location input UI
4. Add Apify actors as fallback for platforms not covered

### Phase 3: Scale (Month 2+)
1. Negotiate bulk pricing with QuickCommerceAPI or Foodspark
2. Add price history tracking (store in PostgreSQL)
3. Price alert system (notify users when price drops)
4. Add affiliate links for monetization
