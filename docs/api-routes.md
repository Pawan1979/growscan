# API Contract & Routes

## 1. Price Comparison
**Endpoint:** `GET /api/compare`
**Purpose:** Fetches prices across 5 quick-commerce platforms for a specific item.

**Query Parameters:**
- `q` (string, required): Product name to search for (e.g., "Amul Milk").
- `pin` (string, required): 6-digit Indian Pincode.
- `passes` (string, optional): Comma-separated active loyalty passes (e.g., "swiggy_one,zepto_super").

**Response (200 OK):**
```json
{
  "query": "Amul Milk",
  "pincode": "400001",
  "city": "Mumbai",
  "state": "Maharashtra",
  "cheapestPlatform": "zepto",
  "fastestPlatform": "blinkit",
  "bestValuePlatform": "zepto",
  "timestamp": "2026-07-29T18:00:00.000Z",
  "results": [
    {
      "platformId": "zepto",
      "platformName": "Zepto",
      "productName": "Amul Taaza Milk 500ml",
      "mrp": 29,
      "price": 27,
      "available": true,
      "etaMinutes": 9,
      "unit": "500 ml"
    }
  ]
}
```

## 2. Cart Optimization
**Endpoint:** `POST /api/cart`
**Purpose:** Compares a full cart of items and calculates split-cart recommendations.

**Request Body:**
```json
{
  "pincode": "400001",
  "items": [
    { "name": "Tata Salt", "quantity": 1 }
  ]
}
```
