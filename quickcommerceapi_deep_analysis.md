# 🔬 QuickCommerceAPI.com — Complete Deep Analysis

> **Company**: QuickCompare AI Technologies Pvt Ltd  
> **Website**: https://quickcommerceapi.com  
> **API Base URL**: `https://api.quickcommerceapi.com/v1`  
> **Auth**: `X-API-Key` header  
> **Response time**: < 2 seconds typical  
> **Uptime SLA**: 99.9%

---

## 🏪 Platforms Supported (11 Total)

### Quick Commerce (7) — Price + Stock + Delivery ETA
| Platform | Available Data |
|---|---|
| **Blinkit** | Price, MRP, Stock, Delivery ETA, Deeplink |
| **Zepto** | Price, MRP, Stock, Delivery ETA, Deeplink |
| **Swiggy Instamart** | Price, MRP, Stock, Delivery ETA, Deeplink |
| **BigBasket** | Price, MRP, Stock, Delivery ETA, Deeplink |
| **DMart Ready** | Price, MRP, Stock, Delivery ETA, Deeplink |
| **JioMart** | Price, MRP, Stock, Delivery ETA, Deeplink |
| **Flipkart Minutes** | Price, MRP, Stock, Delivery ETA, Deeplink |

### E-Commerce (4) — Price + Stock only (No ETA)
| Platform | Available Data |
|---|---|
| **Amazon** | Price, MRP, Stock, Deeplink |
| **Nykaa** | Price, MRP, Stock, Deeplink |
| **Myntra** | Price, MRP, Stock, Deeplink |
| **Flipkart** | Price, MRP, Stock, Deeplink |

---

## 🔌 API Endpoints — Complete Reference

### 1. `GET /v1/search` — Search Products on ONE Platform
**Best for**: Initial search on a single platform

**Parameters:**
| Param | Type | Required | Description |
|---|---|---|---|
| `q` | string | ✅ | Search query e.g., `"amul milk"` |
| `platform` | string | ✅ | Platform name (see list below) |
| `lat` | float | ✅ | Latitude of user location |
| `lon` | float | ✅ | Longitude of user location |
| `pincode` | string | For DMart/JioMart/Minutes | 6-digit pincode |

**Example Request:**
```bash
curl -H "X-API-Key: sk_live_..." \
"https://api.quickcommerceapi.com/v1/search?q=amul+milk&platform=BlinkIt&lat=12.90&lon=77.66"
```

**Response Fields per product:**
```json
{
  "status": "success",
  "data": {
    "total_results": 24,
    "products": [
      {
        "id": "501346",
        "name": "Amul Taaza Toned Milk 500ml",
        "brand": "Amul",
        "mrp": 30,
        "offer_price": 27,
        "discount_percent": 10,
        "quantity": "500 ml",
        "available": true,
        "inventory": 15,
        "rating": 4.5,
        "rating_count": 1280,
        "image": "https://cdn.blinkit.com/products/amul-milk.jpg",
        "images": ["https://..."],
        "deeplink": "https://blinkit.com/pn/amul-taaza-500ml/prid/501346",
        "platform_sla": "8 mins",
        "platform": "BlinkIt"
      }
    ]
  }
}
```

**Cost**: 1 credit per call

---

### 2. `GET /v1/groupsearch` ⭐ KEY ENDPOINT FOR YOUR APP
**Best for**: Searching SAME product across MULTIPLE platforms in ONE API call

**Parameters:**
| Param | Type | Required | Description |
|---|---|---|---|
| `q` | string | ✅ | Search query |
| `lat` | float | ✅ | User latitude |
| `lon` | float | ✅ | User longitude |
| `platforms` | string | ✅ | Comma-separated: `BlinkIt,Zepto,Swiggy,BigBasket` |
| `pincode` | string | For DMart/JioMart/Minutes | 6-digit pincode |
| `group` | boolean | No | `true` = raw grouped response |

**Example Request:**
```bash
curl -H "X-API-Key: sk_live_..." \
"https://api.quickcommerceapi.com/v1/groupsearch?q=amul+milk&lat=12.90&lon=77.66&platforms=BlinkIt,Zepto,Swiggy,BigBasket,DMart&pincode=560001"
```

**Response Structure:**
```json
{
  "status": "success",
  "data": {
    "BlinkIt": {
      "total_results": 12,
      "products": [{ "name": "Amul Taaza 500ml", "offer_price": 27, "mrp": 30, "platform_sla": "8 mins", "available": true }]
    },
    "Zepto": {
      "total_results": 8,
      "products": [{ "name": "Amul Toned Milk 500ml", "offer_price": 26, "mrp": 30, "platform_sla": "10 mins", "available": true }]
    },
    "Swiggy": {
      "total_results": 10,
      "products": [{ "name": "Amul Milk 500ml", "offer_price": 28, "mrp": 30, "platform_sla": "12 mins", "available": false }]
    }
  }
}
```

**Cost**: **1 credit PER PLATFORM** requested  
(5 platforms = 5 credits per groupsearch call)

---

### 3. `GET /v1/item` — Live Price for a Specific Product
**Best for**: Price monitoring — track exact item price in real-time by platform product ID

**Parameters:**
| Param | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✅ | Platform product ID (from search result) |
| `platform` | string | ✅ | Platform name |
| `lat` | float | ✅ | User latitude |
| `lon` | float | ✅ | User longitude |

**Example Request:**
```bash
curl -H "X-API-Key: sk_live_..." \
"https://api.quickcommerceapi.com/v1/item?id=501346&platform=BlinkIt&lat=12.90&lon=77.66"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "items": [{
      "id": "501346",
      "name": "Amul Taaza Toned Milk 500ml",
      "brand": "Amul",
      "available": true,
      "mrp": 30,
      "offer_price": 27,
      "quantity": "500 ml",
      "inventory": 6,
      "rating": 4.5,
      "rating_count": 1200,
      "deeplink": "https://blinkit.com/pn/amul-milk/prid/501346",
      "images": ["https://cdn.blinkit.com/image.jpg"],
      "platform": {
        "name": "BlinkIt",
        "sla": "8 mins",
        "open": true
      }
    }]
  }
}
```

**Cost**: 1 credit per call  
**Best Use**: After first search, save `id` → use `/v1/item` for recurring price checks (cheaper pattern)

---

### 4. `GET /v1/eta` — Delivery Time & Store Status
**Best for**: Showing which platforms currently deliver to user's location

**Parameters:**
| Param | Type | Required | Description |
|---|---|---|---|
| `platform` | string | ✅ | Platform name |
| `lat` | float | ✅ | User latitude |
| `lon` | float | ✅ | User longitude |

**Response:**
```json
{
  "status": "success",
  "data": {
    "platform": "BlinkIt",
    "open": true,
    "sla": "8 mins",
    "store_id": "BLR-KORAMANGALA-01",
    "serviceable": true
  }
}
```

**Cost**: 1 credit per call

---

## 💰 Pricing — Full Breakdown

### One-Time Credit Packs (Pay-as-you-go, 30-day expiry)

| Pack | Credits | Price | Per Credit | Savings |
|---|---|---|---|---|
| **Starter** | 2,500 | ₹500 | ₹0.20 | — |
| **Growth** | 10,000 | ₹1,800 | ₹0.18 | 10% |
| **Pro** ⭐ Most Popular | 50,000 | ₹7,500 | ₹0.15 | 25% |
| **Scale** | 2,00,000 | ₹24,000 | ₹0.12 | 40% |
| **Custom slider** | 2.5K–5L | Variable | ₹0.12–0.20 | — |

### Free Tier
- **100 credits** on signup (no credit card)
- Promo code **EXTRA10** → 10% extra credits on any pack

### Important Rules
- **1 credit = 1 API call** (deducted only on 2xx success)
- Credits expire in **30 days** for one-time packs
- **Stack freely**: multiple packs combine in one wallet

---

## 📦 Product Data Fields — What You Get

Every product result contains:

| Field | Type | Description |
|---|---|---|
| `id` | string | Platform-specific product ID |
| `name` | string | Full product name |
| `brand` | string | Brand name |
| `mrp` | number | Maximum Retail Price |
| `offer_price` | number | Current selling price |
| `discount_percent` | number | Discount % off MRP |
| `quantity` | string | Pack size (e.g., "500 ml", "1 kg") |
| `available` | boolean | In stock or not |
| `inventory` | number | Stock count (where available) |
| `rating` | number | Product rating (out of 5) |
| `rating_count` | number | Number of ratings |
| `image` | string | Primary product image URL |
| `images` | array | All product image URLs |
| `deeplink` | string | Direct link to product on platform |
| `platform_sla` | string | Delivery time e.g., "8 mins" |
| `platform` | string | Platform name |

---

## 🧮 Cost Calculator for Your App

### How a typical user search works:
- User searches "Amul Milk" in Mumbai pincode
- You call `/v1/groupsearch` with 5 platforms (Blinkit, Zepto, Instamart, BigBasket, DMart)
- **Cost: 5 credits per search** (1 per platform)

### Monthly cost estimates:

| Users/day | Searches/user | Platforms | Credits/day | Credits/month | Cost (Growth pack ₹0.18) |
|---|---|---|---|---|---|
| 10 | 3 | 5 | 150 | 4,500 | ₹810/month |
| 50 | 3 | 5 | 750 | 22,500 | ₹4,050/month |
| 100 | 3 | 5 | 1,500 | 45,000 | ₹8,100/month |
| 500 | 3 | 5 | 7,500 | 2,25,000 | ₹27,000/month |

### 💡 Cost Optimization Strategy with Caching:

**Without caching**: 100 users × 3 searches × 5 platforms = 1,500 credits/day

**With Redis caching (5-min TTL)**:
- If 10 users search "Amul Milk 500ml" in same pincode within 5 min → only 1 API call made
- Cache hit rate ~60–70% for popular products in dense areas
- **Effective cost reduced by 60–70%** → ~450–600 credits/day instead of 1,500

```
Cache key: "search:{product_slug}:{pincode}:{platform}"
TTL: 5 minutes (prices update rarely in <5 mins)
Result: Save 60-70% on API credits
```

---

## 🏗️ How to Use It in Your App — Flow Diagram

```
User types "Amul Milk" + enters pincode "400001"
        |
        ↓
[Your Backend]
   1. Convert pincode → lat/lng (Google Maps Geocoding API - free 28K/month)
   2. Check Redis cache: search:amul-milk:400001:all_platforms
      → HIT: return cached result (0 credits used!)
      → MISS: call QuickCommerceAPI
        |
        ↓
[QuickCommerceAPI /v1/groupsearch]
   q=amul milk
   lat=18.96, lon=72.82
   platforms=BlinkIt,Zepto,Swiggy,BigBasket,DMart
   pincode=400001
   Cost: 5 credits
        |
        ↓
[Your Backend]
   3. Parse & normalize results (match "Amul Taaza 500ml" = "Amul Milk 500ml")
   4. Store in Redis with 5-min TTL
   5. Return to frontend
        |
        ↓
[Frontend]
   Show comparison table with:
   - Platform logo
   - Price (highlighted cheapest in green)
   - MRP & discount %
   - Delivery time (ETA)
   - Stock status
   - "Buy" button → deeplink to platform
```

---

## 🔑 Platform Name Values for API Calls

Use exactly these strings in the `platform` / `platforms` parameter:

```
BlinkIt        → Blinkit
Zepto          → Zepto  
Swiggy         → Swiggy Instamart
BigBasket      → BigBasket
DMart          → DMart Ready
JioMart        → JioMart
Minutes        → Flipkart Minutes
Amazon         → Amazon
Nykaa          → Nykaa
Myntra         → Myntra
Flipkart       → Flipkart
```

---

## ✅ Recommended Stack for Your App (Cost-Optimized)

### Backend
```
Node.js (Express) or Python (FastAPI)
  ↓
Redis (cache layer - 5 min TTL)
  ↓
QuickCommerceAPI.com (primary data)
  ↓
PostgreSQL (price history storage)
```

### Frontend
```
Next.js (React) — mobile-first responsive
Browser Geolocation API → lat/lng
OR pincode input → geocode to lat/lng
```

### Location
```
Google Maps Geocoding API
  → Free: 28,500 requests/month
  → Converts pincode → lat/lng for QuickCommerceAPI
```

---

## 🚀 Quickstart Code

### Node.js Example — Price Comparison
```javascript
const axios = require('axios');

async function comparePrices(query, lat, lon, pincode) {
  const platforms = 'BlinkIt,Zepto,Swiggy,BigBasket,DMart';

  const response = await axios.get('https://api.quickcommerceapi.com/v1/groupsearch', {
    headers: { 'X-API-Key': process.env.QC_API_KEY },
    params: { q: query, lat, lon, platforms, pincode }
  });

  const results = response.data.data;

  // Normalize: get cheapest product per platform
  const comparison = Object.entries(results).map(([platform, data]) => {
    const topProduct = data.products?.[0];
    return {
      platform,
      product: topProduct?.name,
      price: topProduct?.offer_price,
      mrp: topProduct?.mrp,
      discount: topProduct?.discount_percent,
      eta: topProduct?.platform_sla,
      inStock: topProduct?.available,
      buyLink: topProduct?.deeplink,
      image: topProduct?.image
    };
  });

  // Sort by price (cheapest first)
  return comparison.sort((a, b) => a.price - b.price);
}

// Usage
comparePrices('amul milk 500ml', 19.076, 72.877, '400001')
  .then(results => console.log(results));
```

### With Redis Caching
```javascript
const redis = require('redis');
const client = redis.createClient();

async function getCachedPrices(query, pincode) {
  const cacheKey = `prices:${query.toLowerCase().replace(/\s+/g, '-')}:${pincode}`;

  // Check cache first
  const cached = await client.get(cacheKey);
  if (cached) {
    return { source: 'cache', data: JSON.parse(cached) };
  }

  // Cache miss — call API
  const { lat, lon } = await geocodePincode(pincode); // Google Maps
  const freshData = await comparePrices(query, lat, lon, pincode);

  // Store in cache for 5 minutes
  await client.setEx(cacheKey, 300, JSON.stringify(freshData));
  return { source: 'api', data: freshData };
}
```

---

## 📊 MVP Cost Estimate — Starting Out

| Item | Details | Monthly Cost |
|---|---|---|
| **QuickCommerceAPI** | 100 free credits → buy Starter pack ₹500 | ₹0 → ₹500 |
| **Redis** (Upstash free tier) | 10K commands/day free | ₹0 |
| **Google Maps Geocoding** | 28,500 free requests/month | ₹0 |
| **Hosting** (Railway/Render free tier) | Backend + DB | ₹0 |
| **Total MVP Cost** | | **₹0–500/month** |

### After caching optimization:
- Free 100 credits → ~20 unique searches across 5 platforms
- ₹500 Starter pack → 2,500 credits → ~500 unique searches across 5 platforms
- With 70% cache hit rate → effectively 1,667 unique searches for ₹500

---

## ⚠️ Key Limitations to Know

1. **30-day credit expiry** on one-time packs — plan usage accordingly
2. **Location required** — lat/lng or pincode mandatory for all quick commerce searches  
3. **Product matching is manual** — "Amul Taaza 500ml" on Blinkit vs "Amul Milk 500ml" on Zepto need fuzzy matching in your code
4. **Not all pincodes served** — if a platform's dark store doesn't cover the area, it returns empty
5. **API is unofficial** — underlying data from scraped sources, occasional gaps possible

---

## 🔗 Direct Links

- **Sign up (100 free credits)**: https://quickcommerceapi.com/auth/signup
- **API Docs**: https://quickcommerceapi.com/docs
- **Pricing**: https://quickcommerceapi.com/pricing
- **Live Playground**: https://quickcommerceapi.com/playground
- **Promo code**: `EXTRA10` (10% extra credits)
