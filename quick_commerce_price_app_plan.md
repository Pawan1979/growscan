# Quick Commerce Price Comparison App — Architecture Guide

## 🎯 What You're Building

A mobile-friendly web app that:
1. Takes a **product name** (e.g., "Amul Toned Milk 500ml")
2. Takes **user location** (GPS or pincode)
3. Fetches **real-time prices** from Blinkit, Zepto, Instamart, BigBasket Now, Amazon Fresh, etc.
4. Displays a **side-by-side price comparison** with delivery time & availability

---

## 🚧 The Big Challenge: Data Acquisition

None of the quick commerce platforms (Blinkit, Zepto, Instamart) offer **official public APIs**. So you have three main strategies:

### Strategy 1: Web Scraping (Most Common, Legally Grey)
Scrape product prices directly from their websites/apps.

| Platform | Approach |
|---|---|
| Blinkit | Scrape `blinkit.com` — pincode-based, SPA (React) |
| Zepto | Scrape `zeptonow.com` — requires location/pincode |
| Instamart (Swiggy) | Scrape `swiggy.com/instamart` |
| BigBasket Now | Scrape `bigbasket.com` |
| Amazon Fresh | Scrape `amazon.in/fresh` |

**Tools**: Playwright / Puppeteer (headless browser), rotating proxies, CAPTCHA solvers.

> ⚠️ **Legal Risk**: Scraping violates most platforms' ToS. Use this for personal/demo use only.

---

### Strategy 2: Unofficial/Reverse-Engineered APIs (Preferred for Scale)
Platforms expose internal REST APIs used by their mobile apps. These can be reverse-engineered using tools like Charles Proxy or mitmproxy.

For example:
- **Blinkit** has an internal API that accepts `lat/lng` and returns product listings.
- **Zepto** similarly uses internal REST endpoints.

**Risk**: APIs can change without notice, may require auth tokens.

---

### Strategy 3: Third-Party Aggregator APIs (Easiest, Paid)
Some services aggregate this data:
- **Valence** (B2B data providers)
- **Rainforest API** (Amazon)
- **ScaleSerp**, **Oxylabs**, **Bright Data** — provide structured e-commerce data

---

## 🏗️ Recommended Architecture

```
┌─────────────────────────────────────────────────────┐
│                  User (Browser/Mobile)               │
│  - Search product                                    │
│  - Share location / enter pincode                    │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────────────┐
│              Frontend (Next.js / React)              │
│  - Product search UI                                 │
│  - Location picker                                   │
│  - Price comparison cards                            │
└──────────────────┬──────────────────────────────────┘
                   │ REST/GraphQL
┌──────────────────▼──────────────────────────────────┐
│              Backend API (Node.js / Python)          │
│  - Orchestrates scraper workers                      │
│  - Caches results (Redis — 5-10 min TTL)             │
│  - Normalizes product names                          │
│  - Rate limiting & auth                              │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
   ┌─────────┐ ┌────────┐ ┌────────┐
   │ Blinkit │ │ Zepto  │ │Instamart│
   │ Scraper │ │Scraper │ │ Scraper │
   └─────────┘ └────────┘ └─────────┘
        (Playwright workers / serverless functions)
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router) or React + Vite
- **Styling**: Tailwind CSS or Vanilla CSS
- **Location**: Browser Geolocation API + reverse geocoding (Google Maps / OpenStreetMap)
- **State**: Zustand or React Query

### Backend
- **API Server**: Node.js (Express/Fastify) or Python (FastAPI)
- **Scraping**: Playwright (Python/Node) — handles JS-rendered pages
- **Queue**: BullMQ (Redis-backed) — parallel scraping jobs
- **Cache**: Redis — cache results by `(product_id, pincode)` for 5-10 minutes
- **DB**: PostgreSQL — store products, history, user searches

### Infrastructure
- **Hosting**: Railway, Render, or AWS
- **Scraping Proxies**: Bright Data, Oxylabs, or residential proxies
- **Serverless scrapers**: AWS Lambda or Google Cloud Functions

---

## 📱 Core Features (MVP)

### Phase 1 — MVP
- [ ] Product search bar
- [ ] Location input (pincode or GPS)
- [ ] Scrape 2-3 platforms (Blinkit + Zepto + BigBasket)
- [ ] Show price, availability, delivery time per platform
- [ ] Basic caching

### Phase 2 — Enhanced
- [ ] Price history graph (track over time)
- [ ] Price alerts (notify when price drops)
- [ ] More platforms (Amazon Fresh, Instamart, Swiggy Instamart)
- [ ] Product catalog with barcode scan

### Phase 3 — Scale
- [ ] User accounts & saved products
- [ ] Affiliate links for monetization
- [ ] Mobile app (React Native / Flutter)

---

## 🔑 Key Technical Challenges

| Challenge | Solution |
|---|---|
| Platforms block scrapers | Rotating residential proxies + randomized delays |
| Location-based content | Pass pincode/lat-lng in scraper requests |
| JS-rendered pages | Playwright (full browser) instead of curl |
| Product name matching | Fuzzy matching (Fuse.js) + product catalog normalization |
| Rate limits | Queue system with delays + multiple proxy IPs |
| API changes | Monitor + alert system, fallback strategies |

---

## 🚀 Recommended Starting Point

1. **Start with Blinkit** — their website is relatively straightforward to scrape
2. **Use Playwright** in Python with `asyncio` for concurrent scraping
3. **Build a simple REST API** that accepts `product_name + pincode` and returns prices
4. **Build a clean React frontend** that calls your API and shows a comparison table

---

## 📦 Sample Blinkit Scraper (Concept)

```python
from playwright.async_api import async_playwright

async def get_blinkit_prices(product: str, pincode: str):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Set location via pincode
        await page.goto(f"https://blinkit.com")
        await page.fill('[placeholder="Enter pincode"]', pincode)
        await page.press('[placeholder="Enter pincode"]', "Enter")
        
        # Search product
        await page.fill('[placeholder="Search for products"]', product)
        await page.press('[placeholder="Search for products"]', "Enter")
        
        # Wait and extract
        await page.wait_for_selector(".product-card")
        products = await page.query_selector_all(".product-card")
        
        results = []
        for p in products:
            name = await p.query_selector(".product-name")
            price = await p.query_selector(".product-price")
            results.append({
                "name": await name.inner_text(),
                "price": await price.inner_text(),
                "platform": "Blinkit"
            })
        
        return results
```

---

## 💡 Alternative: Use GrocScan / Existing Tools

Apps like **GrocScan**, **Price Hunt**, and **ShopSmart** already do this for Indian markets. Study their approach for inspiration.

---

## 📊 Monetization Ideas
- Affiliate links to each platform
- Premium alerts & features (subscription)
- B2B API access for brands to monitor their own pricing
- Data analytics for FMCG companies
