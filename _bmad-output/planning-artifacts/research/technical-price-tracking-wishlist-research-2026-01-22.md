# Price Tracking & Wishlist APIs Research - Phase 0

**Document Version**: 1.0
**Research Date**: January 22, 2026
**Project**: lab-clean-architecture-react (Clean Architecture Educational Lab)
**Phase**: Phase 0 - API Research (Pre-MVP)
**Researcher**: GitHub Copilot
**Reviewed By**: Paul

---

## Executive Summary

### ⏸️ FEATURE DEFERRED POST-MVP

**Project Decision**: Price tracking features are **DEFERRED** to post-MVP phase.

**Rationale**:
- Focus MVP on core collection management (CRUD, search, filters)
- Price tracking adds complexity (OAuth2, external APIs, rate limits)
- Research complete and documented for future implementation
- Opportunity-driven: Will implement if compelling use case emerges

---

### ✅ Recommended Solution (When Implemented): IsThereAnyDeal (ITAD) API

**Primary Solution**: IsThereAnyDeal API v2.8.1
**Cost**: FREE (with attribution requirement)
**Platform Coverage**: PC Games (Steam, GOG, Epic Games, PlayStation Store PC, Xbox PC, 40+ stores)
**Multilingual**: Partial (game data in English primarily, but supports regional pricing)
**Official Documentation**: https://docs.isthereanydeal.com/

**Key Features**:
- ✅ **Price History Tracking** - Historical low prices across all tracked stores
- ✅ **Current Prices** - Real-time pricing from 40+ official stores
- ✅ **Wishlist Management** - User wishlist with OAuth2 authentication
- ✅ **Price Alerts** - Webhook notifications when wishlist games hit target prices
- ✅ **Deal Discovery** - Browse current deals with filtering/sorting
- ✅ **Multi-Store Comparison** - Compare prices across Steam, GOG, Epic, etc.
- ✅ **Regional Pricing** - Support for multiple countries/currencies
- ✅ **FREE** - No cost, only requires attribution link
- ⚠️ **PC Only** - No console game pricing (PlayStation/Xbox/Switch physical/digital console stores)

**Alternative Solution**: CheapShark API
**Cost**: FREE
**Coverage**: PC Games (fewer stores than ITAD, primarily digital PC games)
**Limitation**: No wishlist/OAuth features, price tracking only

**Why Not General Marketplaces** (eBay, Amazon, Leboncoin):
- ❌ No price history tracking (critical missing feature)
- ❌ Production approval required (eBay) or revenue requirements (Amazon)
- ❌ Physical products focus, not digital game pricing
- ❌ Most have no public APIs (Leboncoin, Cdiscount, Fnac)

---

## Table of Contents

1. [Research Context](#research-context)
2. [API Comparison Matrix](#api-comparison-matrix)
3. [IsThereAnyDeal API - Detailed Analysis](#isthereanydeal-api---detailed-analysis)
4. [CheapShark API - Alternative Option](#cheapshark-api---alternative-option)
5. [General Marketplace APIs](#general-marketplace-apis)
6. [Console-Specific Solutions](#console-specific-solutions)
7. [Implementation Recommendations](#implementation-recommendations)
8. [Phase 0 Action Plan](#phase-0-action-plan)
9. [Verified Sources](#verified-sources)

---

## Research Context

### User Requirements (from conversations)

1. **FREE APIs Mandatory** - No paid tiers acceptable for MVP
2. **Official APIs Preferred** - When available and free
3. **Multilingual Support** - French language support desired but not blocking
4. **React/TypeScript Stack** - Must integrate with project stack
5. **Personal Use** - Single user initially, multi-user optional later
6. **OAuth Understanding** - User comfortable with OAuth2 flows
7. **Price Tracking Features**:
   - Historical price data (lowest price ever, price trends)
   - Current prices across multiple stores
   - Price drop alerts/notifications
   - Wishlist management
   - Deal discovery/browsing

### Research Scope

**In Scope**:
- PC game price tracking (Steam, GOG, Epic Games, etc.)
- Wishlist management APIs
- Price alert/notification systems
- Historical pricing data
- Multi-store price comparison
- Free solutions only

**Out of Scope** (for MVP):
- Paid API tiers
- Console-specific pricing (PlayStation Store, Xbox Store, Nintendo eShop for console games)
- Mobile game pricing (iOS App Store, Google Play)
- Physical game retailers (GameStop, Amazon physical copies)
- Key resellers (G2A, Kinguin, CDKeys - grey market)

---

## API Comparison Matrix

| Feature | IsThereAnyDeal | CheapShark | Deku Deals | Official Stores |
|---------|---------------|------------|------------|-----------------|
| **Cost** | FREE | FREE | No API | Varies |
| **PC Games** | ✅ 40+ stores | ✅ 15+ stores | ❌ Console only | Platform-specific |
| **Console Games** | ❌ PC only | ❌ PC only | ✅ Switch/PS/Xbox | Platform-specific |
| **Price History** | ✅ Full history | ✅ Full history | ✅ (web only) | Limited |
| **Wishlist API** | ✅ OAuth2 | ❌ Alert emails | ❌ No API | Platform accounts |
| **Webhooks** | ✅ Price alerts | ❌ | ❌ | ❌ |
| **Multi-Store** | ✅ 40+ stores | ✅ 15+ stores | ✅ All major | Single store |
| **Regional Pricing** | ✅ 50+ countries | ✅ US-centric | ✅ Regional | Per-store |
| **Rate Limits** | Yes (undocumented) | Yes (429 errors) | N/A | Varies |
| **Authentication** | API Key + OAuth2 | None | N/A | Per-store |
| **Documentation** | ✅ Excellent | ✅ Good | N/A | Varies |
| **Game Lookup** | Steam/ITAD IDs | Steam IDs | N/A | Platform IDs |
| **Multilingual** | ⚠️ English data | ⚠️ English only | ✅ Regional | Per-store |
| **Match for Project** | ✅ EXCELLENT | ⚠️ LIMITED | ❌ Wrong platform | ❌ Too fragmented |

### Decision Factors

**IsThereAnyDeal Advantages**:
1. Most comprehensive PC game coverage (40+ stores)
2. Full-featured wishlist with OAuth2
3. Webhook support for price alerts
4. Excellent documentation
5. Active community and updates
6. Game lookup by title/Steam ID
7. Regional pricing support
8. FREE with simple attribution

**IsThereAnyDeal Limitations**:
1. PC games only (no console store pricing)
2. Primarily English game data
3. Requires attribution link
4. Rate limits (undocumented, but enforced)

**Why Not CheapShark**:
- No wishlist/OAuth features
- Fewer stores covered
- Price tracking only (no user accounts)
- Better for simple price checks, not full app integration

**Why Not Official Store APIs**:
- **Steam**: No official price tracking API (Web API for owned games only)
- **PlayStation Store**: No official API (see trophy research for details)
- **Xbox Store**: No consumer API (developer-only Game Dev Kit)
- **Epic Games Store**: No public API
- **GOG**: Limited API (Galaxy features only)
- **Fragmentation**: Would require 40+ separate integrations

---

## IsThereAnyDeal API - Detailed Analysis

### Official Documentation
- **API Docs**: https://docs.isthereanydeal.com/
- **OpenAPI Spec**: Available for download
- **GitHub**: https://github.com/IsThereAnyDeal/API
- **Changelog**: https://github.com/IsThereAnyDeal/API/blob/master/CHANGELOG.md
- **Terms of Service**: https://github.com/IsThereAnyDeal/API/blob/master/TERMS_OF_SERVICE.md

### Authentication & Access

**API Key Registration**:
1. Register app at https://isthereanydeal.com/apps/my/
2. Receive API key + OAuth2 credentials instantly
3. No approval process for basic endpoints
4. Some endpoints require explicit approval (contact them)

**OAuth2 Flow**:
- Authorization Code flow with PKCE extension
- Variable-length JWT access tokens
- Tutorial: https://www.oauth.com/playground/authorization-code-with-pkce.html

**Rate Limiting**:
- Rate limits enforced but not documented precisely
- Headers provide limit info: check response headers
- Designed for real-time user queries (not bulk scraping)
- CORS fully supported (browser-safe)
- Contact for higher limits: api@isthereanydeal.com

### Core Endpoints for Price Tracking

#### 1. Game Lookup & Search

**Search by Title**:
```http
GET /games/search/v1?title={query}&results={max}
Authorization: Bearer {api_key}
```

**Response Example**:
```json
[
  {
    "id": "018d937f-07fc-72ed-8517-d8e24cb1eb22",
    "slug": "europa-universalis-iv",
    "title": "Europa Universalis IV",
    "type": "game",
    "mature": false,
    "assets": {
      "boxart": "https://...",
      "banner145": "https://..."
    }
  }
]
```

**Lookup by Steam AppID**:
```http
GET /games/lookup/v1?appid={steam_appid}
Authorization: Bearer {api_key}
```

**Lookup ITAD IDs from Steam IDs**:
```http
POST /lookup/id/shop/61/v1
Authorization: Bearer {api_key}
Content-Type: application/json

["app/220", "app/730"]
```

#### 2. Current Prices

**Get Current Prices** (up to 200 games):
```http
POST /games/prices/v3?country=FR&deals=false&vouchers=true
Authorization: Bearer {api_key}
Content-Type: application/json

["018d937f-012f-73b8-ab2c-898516969e6a"]
```

**Response**:
```json
[
  {
    "id": "018d937f-012f-73b8-ab2c-898516969e6a",
    "historyLow": {
      "amount": 9.99,
      "currency": "EUR",
      "shop": { "id": 61, "name": "Steam" },
      "timestamp": "2023-06-15T12:00:00Z"
    },
    "deals": [
      {
        "shop": { "id": 35, "name": "GOG" },
        "price": {
          "amount": 14.99,
          "currency": "EUR",
          "cut": 50
        },
        "url": "https://..."
      }
    ]
  }
]
```

**Parameters**:
- `country`: 2-letter code (ISO 3166-1 alpha-2) - e.g., "FR", "US"
- `deals`: Only show sale prices (excludes regular prices)
- `vouchers`: Include voucher-based discounts
- `capacity`: Max prices per game (0 = unlimited)
- `shops`: Filter by shop IDs (e.g., `shops=61,35` for Steam + GOG)

#### 3. Price History

**Historical Low Prices**:
```http
POST /games/historylow/v1?country=FR
Authorization: Bearer {api_key}
Content-Type: application/json

["018d937f-012f-73b8-ab2c-898516969e6a"]
```

**Store-Specific Lows**:
```http
POST /games/storelow/v2?country=FR&shops=61,35
Authorization: Bearer {api_key}
Content-Type: application/json

["018d937f-012f-73b8-ab2c-898516969e6a"]
```

**Full Price History Log**:
```http
GET /games/history/v2?id={game_id}&country=FR&shops=61&since=2024-01-01T00:00:00Z
Authorization: Bearer {api_key}
```

**Response**:
```json
[
  {
    "timestamp": "2022-12-27T11:21:08+01:00",
    "shop": { "id": 61, "name": "Steam" },
    "deal": {
      "price": { "amount": 19.99, "currency": "EUR", "cut": 33 },
      "regular": { "amount": 29.99, "currency": "EUR" },
      "url": "https://..."
    }
  }
]
```

#### 4. Deals Discovery

**Browse Current Deals**:
```http
GET /deals/v2?country=FR&offset=0&limit=20&sort=-cut&shops=61,35
Authorization: Bearer {api_key}
```

**Parameters**:
- `sort`: `-cut` (highest discount), `price` (lowest price), etc.
- `nondeals`: Include non-sale prices
- `mature`: Include mature-rated games
- `filter`: Filter string (see docs)

#### 5. Wishlist Management (OAuth Required)

**Get User's Wishlist**:
```http
GET /waitlist/games/v1
Authorization: Bearer {oauth_access_token}
```

**Response**:
```json
[
  {
    "id": "018d937e-e9e5-72fa-a1dc-e7e090b64d2f",
    "slug": "dwarven-skykeep",
    "title": "Dwarven Skykeep",
    "type": "game",
    "assets": { "boxart": "..." },
    "mature": false,
    "added": "2023-02-01T21:04:21+01:00"
  }
]
```

**Add to Wishlist**:
```http
PUT /waitlist/games/v1
Authorization: Bearer {oauth_access_token}
Content-Type: application/json

["018d937f-012f-73b8-ab2c-898516969e6a"]
```

**Remove from Wishlist**:
```http
DELETE /waitlist/games/v1
Authorization: Bearer {oauth_access_token}
Content-Type: application/json

["018d937f-012f-73b8-ab2c-898516969e6a"]
```

#### 6. Price Alerts via Webhooks

**User Registration** (in user settings):
- Users register webhooks at https://isthereanydeal.com/settings/webhooks/
- Choose events: `notification-waitlist` for price alerts
- Provide webhook URL to receive notifications

**Webhook Payload** (sent to user's webhook URL):
```json
[
  {
    "id": "018d937e-f835-710c-b95b-928e277b187e",
    "slug": "stardew-valley",
    "title": "Stardew Valley",
    "type": "game",
    "mature": false,
    "historyLow": {
      "amount": 9.99,
      "currency": "EUR",
      "shop": { "id": 61, "name": "Steam" }
    },
    "lastPrice": {
      "amount": 14.99,
      "currency": "EUR"
    },
    "deals": [
      {
        "shop": { "id": 35, "name": "GOG" },
        "price": { "amount": 11.99, "currency": "EUR", "cut": 40 },
        "url": "https://..."
      }
    ]
  }
]
```

**Headers**:
- `User-Agent`: `ITAD-Webhooks/1.0 (+https://isthereanydeal.com)`
- `Content-Type`: `application/json`
- `ITAD-Hook-ID`: UUID of the webhook
- `ITAD-Event`: `notification-waitlist`

**Alternative: Notification Polling**:
```http
GET /notifications/v1
Authorization: Bearer {oauth_access_token}
```

```http
GET /notifications/waitlist/v1?id={notification_id}
Authorization: Bearer {oauth_access_token}
```

### Regional Pricing & Stores

**Supported Countries**: 50+ countries (US, FR, DE, UK, etc.)
**Supported Stores** (40+):
- **Major**: Steam (61), GOG (35), Epic Games Store (26), Humble Store, Fanatical
- **Regional**: GamersGate, GreenManGaming, WinGameStore, GamesPlanet
- **Bundles**: Humble Bundle tracking
- **Full List**: `GET /service/shops/v1?country=FR`

**Example Store Response**:
```json
[
  {
    "id": 61,
    "title": "Steam",
    "deals": 15234,
    "games": 52847,
    "update": "2026-01-22T10:30:00Z"
  },
  {
    "id": 35,
    "title": "GOG",
    "deals": 3420,
    "games": 4567,
    "update": "2026-01-22T09:45:00Z"
  }
]
```

### Terms of Service (Important)

**Attribution Requirement**:
> You SHOULD provide a link to IsThereAnyDeal.com or mention IsThereAnyDeal API.

**Permitted Use**:
- ✅ Commercial use IF app is publicly available
- ✅ Use partial data + enrich from own sources
- ✅ User-driven queries (search, browse, price checks)

**Prohibited Use**:
- ❌ Private/internal use without approval
- ❌ Claim affiliation with ITAD
- ❌ Modify provided data (prices, URLs, affiliate tags)
- ❌ Build competing service to ITAD
- ❌ Help ITAD competitors
- ❌ Bulk scraping to build static catalog (triggers rate limits)

**Data Policy**:
> You MUST NOT change provided data in any way. This means that you can't remove affiliate tags from the URLs, change prices and so on.

**Contact for Approval**: api@isthereanydeal.com

### Unofficial SDKs

**Node.js/TypeScript**:
- **isthereanydeal-nodejs**: https://www.npmjs.com/package/isthereanydeal-nodejs
- Unofficial but well-maintained
- TypeScript definitions included

### Integration Examples

**React Hook for Price Tracking**:
```typescript
import { useState, useEffect } from 'react';

interface GamePrice {
  id: string;
  title: string;
  currentPrice: { amount: number; currency: string; shop: string };
  historyLow: { amount: number; currency: string; shop: string };
  deals: Array<{ shop: string; price: number; cut: number; url: string }>;
}

export function useGamePrices(gameIds: string[], country: string = 'FR') {
  const [prices, setPrices] = useState<GamePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.isthereanydeal.com/games/prices/v3?country=${country}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_ITAD_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameIds),
          }
        );

        if (!response.ok) {
          throw new Error(`ITAD API error: ${response.status}`);
        }

        const data = await response.json();
        setPrices(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    if (gameIds.length > 0) {
      fetchPrices();
    }
  }, [gameIds, country]);

  return { prices, loading, error };
}
```

**Clean Architecture Repository Interface**:
```typescript
// domain/repositories/PriceTrackingRepository.ts
export interface PriceTrackingRepository {
  searchGames(query: string): Promise<Game[]>;
  getCurrentPrices(gameIds: string[], country: string): Promise<GamePrice[]>;
  getPriceHistory(gameId: string, country: string): Promise<PriceHistoryEntry[]>;
  getWishlist(): Promise<WishlistGame[]>;
  addToWishlist(gameId: string): Promise<void>;
  removeFromWishlist(gameId: string): Promise<void>;
}

// infrastructure/adapters/IsThereAnyDealAdapter.ts
export class IsThereAnyDealAdapter implements PriceTrackingRepository {
  constructor(
    private apiKey: string,
    private oauthToken?: string
  ) {}

  async searchGames(query: string): Promise<Game[]> {
    const response = await fetch(
      `https://api.isthereanydeal.com/games/search/v1?title=${encodeURIComponent(query)}`,
      {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
      }
    );

    if (!response.ok) throw new Error('Search failed');

    const data = await response.json();
    return data.map(this.mapToGame);
  }

  async getCurrentPrices(gameIds: string[], country: string): Promise<GamePrice[]> {
    // Implementation with caching, error handling, etc.
  }

  // ... other methods
}
```

---

## CheapShark API - Alternative Option

### Official Documentation
- **API Docs**: https://apidocs.cheapshark.com/
- **Website**: https://www.cheapshark.com/
- **Support**: Discord #api-help, admin@cheapshark.com

### Key Features

**Advantages**:
- ✅ Completely free, no API key needed
- ✅ No authentication required
- ✅ CORS enabled (browser-safe)
- ✅ Good documentation
- ✅ Price history tracking
- ✅ Deal discovery

**Limitations**:
- ❌ No wishlist/user account features
- ❌ No OAuth authentication
- ❌ Email alerts only (not programmatic)
- ❌ Fewer stores than ITAD (~15 vs 40+)
- ❌ US-centric pricing

### Main Endpoints

**Search Games**:
```http
GET https://www.cheapshark.com/api/1.0/games?title={query}&limit=10
```

**Get Game Deals**:
```http
GET https://www.cheapshark.com/api/1.0/games?id={gameId}
```

**Browse Deals**:
```http
GET https://www.cheapshark.com/api/1.0/deals?storeID=1&pageNumber=0&pageSize=20
```

**Price Alerts** (User-driven, not API):
- Users sign up at https://www.cheapshark.com/manageAlerts
- Email notifications sent automatically
- No programmatic webhook/API access

### Rate Limiting

**Behavior**:
- Rate limits enforced (undocumented thresholds)
- HTTP 429 response when exceeded
- `Retry-After` header shows ban duration in seconds
- Ban auto-lifts after expiry

**Best Practices**:
- Call API in response to user input (not automated bulk)
- Use mock API during development (Postman offers this)
- Browser requests preferred (CORS enabled)

### Use Case

**Best For**:
- Simple price comparison widgets
- Public price display (no login required)
- Quick deal lookups
- Prototyping without OAuth complexity

**Not Suitable For**:
- User wishlist management
- Personalized price alerts
- Multi-user accounts
- Full-featured price tracking app

### Attribution Requirement

> The only condition being that you use CheapShark links when sending users to deals.

**Implementation**:
```typescript
// Use deal URLs provided by API (contain affiliate tags)
const dealUrl = deal.url; // Already contains CheapShark tracking
window.open(dealUrl, '_blank');
```

---

## General Marketplace APIs

### Overview

Beyond game-specific platforms, general marketplaces like eBay, Amazon, and Leboncoin offer APIs that can be used to track prices for physical game products and gaming hardware.

### eBay Developer Program

**Website**: https://developer.ebay.com/
**Status**: FREE to join, production use requires approval
**Coverage**: Global marketplace (eBay.com, eBay.fr, eBay.de, etc.)
**Official Documentation**: https://developer.ebay.com/api-docs/buy/browse/overview.html

#### Key Features

**Buy Browse API**:
- ✅ **Search Items** by keyword, category, GTIN, product ID
- ✅ **Price Information** current Buy It Now prices (auctions excluded by default)
- ✅ **Filter & Refinements** by price range, condition, location, seller
- ✅ **Item Details** full product information including images, descriptions
- ✅ **FREE** API access for approved developers
- ⚠️ **Production Approval Required** (sandbox available without approval)

**API Endpoints**:
```http
GET /buy/browse/v1/item_summary/search?q=playstation+5&limit=50
Headers:
  Authorization: Bearer {oauth_token}
  X-EBAY-C-MARKETPLACE-ID: EBAY_FR
```

**Response Example**:
```json
{
  "total": 5000,
  "itemSummaries": [
    {
      "itemId": "v1|123456789|0",
      "title": "Sony PlayStation 5 Console",
      "price": {
        "value": "499.99",
        "currency": "EUR"
      },
      "condition": "New",
      "buyingOptions": ["FIXED_PRICE"],
      "itemWebUrl": "https://www.ebay.fr/itm/...",
      "image": {
        "imageUrl": "https://..."
      }
    }
  ]
}
```

#### Limitations

**Restrictions**:
- ❌ **No Price History** - Only current prices available
- ❌ **No Wishlist API** - No user account/wishlist features
- ❌ **Production Approval** - Requires eBay approval for production use
- ❌ **FIXED_PRICE Only** - Auction items excluded by default
- ⚠️ **Rate Limits** - Enforced per application (see [Call Limits](https://developer.ebay.com/develop/apis/api-call-limits))
- ⚠️ **10,000 Item Limit** - Maximum result set size

**Production Requirements**:
> "Use of the APIs in production is restricted. Users must meet standard eligibility requirements, get approvals from eBay support organizations, and sign contracts with eBay."

**Use Case for Games**:
- Search for physical game copies (disc versions)
- Track hardware prices (consoles, controllers, accessories)
- Compare seller prices
- Monitor availability

**Why Not Ideal for This Project**:
1. No price history tracking (critical feature missing)
2. Production approval required (MVP blocker)
3. Physical products only (no digital game keys/codes)
4. No wishlist/user features
5. Rate limits may be restrictive

---

### Amazon Product Advertising API

**Website**: https://webservices.amazon.com/paapi5/documentation/
**Status**: FREE but requires Amazon Associates membership
**Coverage**: Amazon.fr, Amazon.com, Amazon.de, etc. (23+ locales)
**API Version**: Product Advertising API 5.0 (PA-API 5.0)

#### Key Features

**PA-API 5.0 Capabilities**:
- ✅ **Search Products** by keyword, ASIN, UPC/EAN/ISBN
- ✅ **Product Details** titles, images, descriptions, variations
- ✅ **Pricing Information** current prices, Prime eligibility, deals
- ✅ **Browse Nodes** category navigation
- ⚠️ **FREE but with Conditions** - Must be Amazon Associate + generate revenue

**API Operations**:
```http
POST https://webservices.amazon.fr/paapi5/searchitems
Content-Type: application/json
Headers:
  Authorization: AWS4-HMAC-SHA256 ...

{
  "Keywords": "God of War Ragnarök PS5",
  "SearchIndex": "VideoGames",
  "Resources": [
    "ItemInfo.Title",
    "Offers.Listings.Price",
    "Images.Primary.Large"
  ],
  "PartnerTag": "your-associate-tag",
  "PartnerType": "Associates"
}
```

#### Critical Limitations

**Revenue Requirement**:
> "Best of all, Product Advertising API is free. By signing up to become a Product Advertising API developer, you join the tens of thousands of developers who are already realizing financial gains..."

**Amazon Associates Program Requirements**:
1. ✅ **FREE to Join** - No upfront costs
2. ❌ **Must Generate Sales** - Account closed if no qualifying sales within first 180 days
3. ❌ **Must Use Affiliate Links** - All product links must include Associate tracking tags
4. ❌ **Revenue Sharing** - You receive commission (1-10% depending on category)
5. ⚠️ **Strict Terms** - Violation = account termination + API access revoked

**From PA-API Documentation**:
> "This guide is intended for developers who want to build an e-commerce storefront that sells items listed on Amazon.com, or an application that helps others build e-commerce storefronts."

**Key Restrictions**:
- ❌ **No Price History** - Only current prices (no historical tracking)
- ❌ **No Wishlist API** - No user account features
- ❌ **Must Drive Sales** - API designed for affiliate marketing, not passive price tracking
- ❌ **Strict Rate Limits** - 1 request/second initially, increases with revenue
- ⚠️ **Account Risk** - Account closed if no sales generated

**Associate Program Terms (Critical)**:
- Must generate at least 3 qualifying sales within first 180 days
- If no sales → account closed → API access revoked
- Cannot use API purely for price comparison without driving Amazon sales
- All links must include your Associate tag

**Why Not Suitable for This Project**:
1. **Revenue Requirement** - Personal price tracking won't generate sales
2. **No Price History** - Missing critical feature
3. **ToS Violation Risk** - Using API without driving sales = account closure
4. **Affiliate Obligation** - Must redirect users to Amazon with tracking tags
5. **Not for Price Comparison** - Designed for e-commerce, not comparison shopping

---

### Leboncoin (No Public API)

**Website**: https://www.leboncoin.fr/
**Status**: NO public API available
**Coverage**: France (classified ads marketplace)

**Findings**:
- ❌ **No Public API** - No developer program or API documentation
- ❌ **No api.leboncoin.fr** - Attempted URL returns no content
- ⚠️ **Scraping = ToS Violation** - Web scraping prohibited
- ✅ **Web Only** - Users can browse site manually

**Alternative Approach**:
- Link users directly to Leboncoin search results
- Example: `https://www.leboncoin.fr/recherche?category=84&text=PlayStation+5`
- No automated price tracking possible

---

### Other French Marketplaces

#### Cdiscount (No Public API)
- **Status**: No developer program/API
- **Coverage**: France, electronics & games
- **Workaround**: Web scraping (violates ToS)

#### Fnac (No Public API)
- **Status**: No public API for product search/pricing
- **Coverage**: France, books/games/electronics
- **Workaround**: Not viable for automated tracking

#### Vinted / BackMarket (No Public APIs)
- **Status**: No developer programs
- **Coverage**: Second-hand marketplaces
- **Limitation**: No API access

---

### General Marketplace Comparison

| Marketplace | API Available | Free Tier | Price History | Wishlist | Approval Required | Best For |
|-------------|--------------|-----------|---------------|----------|-------------------|----------|
| **eBay** | ✅ Yes | ✅ FREE | ❌ No | ❌ No | ⚠️ Production only | Physical products, hardware |
| **Amazon PA-API** | ✅ Yes | ⚠️ Conditional | ❌ No | ❌ No | ⚠️ Must generate sales | E-commerce storefronts |
| **Leboncoin** | ❌ No | N/A | N/A | N/A | N/A | Manual browsing only |
| **Cdiscount** | ❌ No | N/A | N/A | N/A | N/A | Manual browsing only |
| **Fnac** | ❌ No | N/A | N/A | N/A | N/A | Manual browsing only |

---

### Why General Marketplaces Don't Fit This Project

**Critical Missing Features**:
1. ❌ **No Price History Tracking** - All marketplaces only provide current prices
2. ❌ **No Wishlist/User Features** - No OAuth, no personal tracking
3. ❌ **Physical Products Focus** - Not optimized for digital game keys
4. ⚠️ **Approval/Revenue Requirements** - eBay production + Amazon sales requirements

**ToS/Legal Risks**:
- Amazon PA-API: Account closure if no sales generated (non-commercial use prohibited)
- eBay: Production approval required (sandbox only for development)
- Leboncoin/Cdiscount/Fnac: No APIs, scraping violates ToS

**Recommendation**:
**Stick with IsThereAnyDeal (ITAD) for MVP**. General marketplaces:
- Are better for **physical product** price tracking (consoles, accessories)
- Lack **price history** (the core feature users want)
- Require **commercial use** (Amazon) or **approval** (eBay)
- Don't specialize in **digital game pricing**

**Future Enhancement (Post-MVP)**:
- Add eBay Buy API for **hardware tracking** (controllers, headsets, consoles)
- Requires production approval → deferred to Phase 2+
- Physical products separate feature from digital game price tracking

---

## Console-Specific Solutions

### Deku Deals (No API)

**Website**: https://www.dekudeals.com/
**Coverage**: Nintendo Switch, PlayStation, Xbox, Steam
**Features**:
- Price tracking across official stores
- Historical pricing
- Email price alerts
- Wishlist management
- **Limitation**: Web-only, NO public API

**User-Facing Alternative**:
- Redirect users to Deku Deals for console game tracking
- Link format: `https://www.dekudeals.com/items/{game-slug}`

### Official Store APIs

**Steam**:
- **Web API**: https://steamcommunity.com/dev
- **Limitation**: No price data endpoint (owned games only)
- **Workaround**: Scrape store pages (violates ToS, fragile)

**PlayStation Store**:
- **Status**: No official API (see trophy research)
- **Workaround**: Third-party scrapers (unreliable, ToS violation)

**Xbox Store**:
- **GDK**: Game Developer Kit only (see trophy research)
- **Limitation**: For adding Xbox Live to YOUR games, not consuming others' data

**Epic Games Store**:
- **Status**: No public API
- **Workaround**: GraphQL endpoint (undocumented, unsupported)

**GOG**:
- **Galaxy API**: https://api.gog.com/
- **Limitation**: Client features only, no price tracking

**Recommendation**: Use IsThereAnyDeal which aggregates PC stores officially, avoiding ToS violations.

---

## Implementation Recommendations

### Recommended Architecture

**Clean Architecture Layers**:

```
src/
├── domain/
│   ├── entities/
│   │   ├── Game.ts
│   │   ├── Price.ts
│   │   ├── Deal.ts
│   │   └── Wishlist.ts
│   ├── repositories/
│   │   └── PriceTrackingRepository.ts
│   └── use-cases/
│       ├── SearchGames.ts
│       ├── GetCurrentPrices.ts
│       ├── GetPriceHistory.ts
│       ├── ManageWishlist.ts
│       └── DiscoverDeals.ts
├── infrastructure/
│   ├── adapters/
│   │   ├── IsThereAnyDealAdapter.ts
│   │   └── CacheAdapter.ts (IndexedDB)
│   ├── config/
│   │   └── itad.config.ts
│   └── services/
│       ├── ITADAuthService.ts (OAuth2)
│       └── WebhookService.ts (price alerts)
└── presentation/
    ├── components/
    │   ├── GameSearch.tsx
    │   ├── PriceComparison.tsx
    │   ├── PriceHistoryChart.tsx
    │   ├── WishlistManager.tsx
    │   └── DealsBrowser.tsx
    └── hooks/
        ├── useGamePrices.ts
        ├── usePriceHistory.ts
        ├── useWishlist.ts
        └── useDeals.ts
```

### Caching Strategy

**IndexedDB Schema**:
```typescript
interface CachedPrice {
  gameId: string;
  country: string;
  prices: GamePrice;
  timestamp: number; // Unix timestamp
  ttl: number; // Time-to-live in ms (e.g., 3600000 = 1 hour)
}

interface CachedGame {
  id: string;
  title: string;
  slug: string;
  assets: { boxart: string; banner: string };
  timestamp: number;
  ttl: number; // 24 hours for game metadata
}
```

**TTL Recommendations**:
- **Game Metadata**: 24 hours (game info changes rarely)
- **Current Prices**: 1-3 hours (prices update frequently during sales)
- **Price History**: 7 days (historical data is static)
- **Wishlist**: No cache (always fetch fresh for accuracy)

**Invalidation Strategy**:
- Invalidate on user action (manual refresh button)
- Background refresh when TTL expires
- Clear cache on country change

### Rate Limiting Client-Side

```typescript
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private requestCount = 0;
  private windowStart = Date.now();
  private readonly maxRequests = 30; // Conservative limit
  private readonly windowMs = 60000; // 1 minute

  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      if (now - this.windowStart >= this.windowMs) {
        this.requestCount = 0;
        this.windowStart = now;
      }

      if (this.requestCount >= this.maxRequests) {
        const waitTime = this.windowMs - (now - this.windowStart);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        this.requestCount = 0;
        this.windowStart = Date.now();
      }

      const task = this.queue.shift();
      if (task) {
        this.requestCount++;
        await task();
      }
    }

    this.processing = false;
  }
}

export const rateLimiter = new RateLimiter();
```

### OAuth2 Implementation

**Authorization Flow** (PKCE):

```typescript
// services/ITADAuthService.ts
import { generatePKCE } from './pkce-utils';

export class ITADAuthService {
  private readonly authUrl = 'https://isthereanydeal.com/oauth/authorize';
  private readonly tokenUrl = 'https://isthereanydeal.com/oauth/token';
  private readonly clientId = import.meta.env.VITE_ITAD_CLIENT_ID;
  private readonly redirectUri = `${window.location.origin}/auth/callback`;

  async initiateLogin(): Promise<void> {
    const { codeVerifier, codeChallenge } = await generatePKCE();

    // Store verifier for later
    sessionStorage.setItem('pkce_verifier', codeVerifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      scope: 'wait_read wait_write', // Wishlist permissions
    });

    window.location.href = `${this.authUrl}?${params}`;
  }

  async handleCallback(code: string): Promise<string> {
    const codeVerifier = sessionStorage.getItem('pkce_verifier');
    if (!codeVerifier) throw new Error('PKCE verifier not found');

    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) throw new Error('Token exchange failed');

    const { access_token } = await response.json();
    sessionStorage.removeItem('pkce_verifier');

    // Store token securely (consider using httpOnly cookie via backend)
    return access_token;
  }
}
```

### Error Handling

```typescript
export class ITADError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public retryAfter?: number
  ) {
    super(message);
    this.name = 'ITADError';
  }
}

export async function handleITADResponse<T>(response: Response): Promise<T> {
  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
    throw new ITADError(
      `Rate limit exceeded. Retry after ${retryAfter}s`,
      429,
      retryAfter
    );
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ITADError(
      error.reason_phrase || 'ITAD API request failed',
      response.status
    );
  }

  return response.json();
}
```

### Attribution Implementation

**Footer Attribution**:
```tsx
// components/Footer.tsx
export function Footer() {
  return (
    <footer className="app-footer">
      <p>
        Price data provided by{' '}
        <a
          href="https://isthereanydeal.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          IsThereAnyDeal
        </a>
      </p>
    </footer>
  );
}
```

**Deal Link Handling** (preserve affiliate tags):
```tsx
// components/DealCard.tsx
export function DealCard({ deal }: { deal: Deal }) {
  const handleDealClick = () => {
    // Use ITAD-provided URL directly (contains affiliate tags)
    window.open(deal.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="deal-card">
      <h3>{deal.game.title}</h3>
      <p className="price">
        {deal.price.amount} {deal.price.currency}
        {deal.price.cut > 0 && (
          <span className="discount">-{deal.price.cut}%</span>
        )}
      </p>
      <button onClick={handleDealClick}>
        View on {deal.shop.name}
      </button>
    </div>
  );
}
```

---

## Phase 0 Action Plan

### ✅ Research Complete

**Deliverables**:
- ✅ Comprehensive API comparison (ITAD vs CheapShark vs alternatives)
- ✅ ITAD API detailed analysis (authentication, endpoints, features)
- ✅ Implementation recommendations (Clean Architecture patterns)
- ✅ Code examples (React hooks, repository pattern, OAuth2 flow)

### 🎯 Next Steps (Implementation Phase)

**Day 1: API Setup & Authentication**
- [ ] Register app at https://isthereanydeal.com/apps/my/
- [ ] Obtain API key + OAuth2 credentials
- [ ] Create `.env` file with credentials:
  ```
  VITE_ITAD_API_KEY=your_api_key
  VITE_ITAD_CLIENT_ID=your_client_id
  VITE_ITAD_CLIENT_SECRET=your_client_secret
  ```
- [ ] Test basic API call (game search):
  ```bash
  curl "https://api.isthereanydeal.com/games/search/v1?title=witcher" \
    -H "Authorization: Bearer YOUR_API_KEY"
  ```

**Day 2: Core Repository Implementation**
- [ ] Create domain entities (`Game`, `Price`, `Deal`, `Wishlist`)
- [ ] Define `PriceTrackingRepository` interface
- [ ] Implement `IsThereAnyDealAdapter`
- [ ] Add error handling (`ITADError` class)
- [ ] Add rate limiter (client-side queuing)

**Day 3: Caching Layer**
- [ ] Set up IndexedDB schema
- [ ] Create `CacheAdapter` with TTL logic
- [ ] Integrate caching into `IsThereAnyDealAdapter`
- [ ] Test cache invalidation strategies

**Day 4: OAuth2 Integration**
- [ ] Implement PKCE helper functions
- [ ] Create `ITADAuthService`
- [ ] Build OAuth callback route (`/auth/callback`)
- [ ] Add login/logout UI components
- [ ] Test full authorization flow

**Day 5: UI Components**
- [ ] `<GameSearch />` with debounced search
- [ ] `<PriceComparison />` with multi-store table
- [ ] `<PriceHistoryChart />` with historical data visualization
- [ ] `<WishlistManager />` with add/remove actions
- [ ] `<DealsBrowser />` with filtering/sorting

**Day 6: Polish & Testing**
- [ ] Add attribution footer/links
- [ ] Test rate limit handling (HTTP 429 response)
- [ ] Test offline behavior (cache fallback)
- [ ] Verify OAuth token refresh (if needed)
- [ ] Test regional pricing (switch between US/FR)

**Day 7: Documentation**
- [ ] Update README with API setup instructions
- [ ] Document environment variables
- [ ] Add code comments for complex logic
- [ ] Create API usage examples

### Testing Checklist

**Functional Tests**:
- [ ] Search games by title
- [ ] Fetch current prices for multiple games
- [ ] Display price history chart
- [ ] Add/remove games from wishlist
- [ ] Browse deals with sorting/filtering
- [ ] Handle rate limit errors gracefully
- [ ] Cache invalidation on TTL expiry

**Integration Tests**:
- [ ] OAuth2 login flow (authorization code + PKCE)
- [ ] Token storage and reuse
- [ ] Authenticated wishlist operations
- [ ] Webhook notification simulation (if implemented)

**Edge Cases**:
- [ ] Game not found (404 response)
- [ ] Network failure (offline mode)
- [ ] Rate limit exceeded (429 response)
- [ ] Invalid OAuth token (401 response)
- [ ] Country change (clear cache)

---

## Verified Sources

### Official Documentation
1. **IsThereAnyDeal API Docs**: https://docs.isthereanydeal.com/
   - OpenAPI 2.8.1 specification
   - Full endpoint documentation
   - Terms of Service
   - Changelog

2. **CheapShark API Docs**: https://apidocs.cheapshark.com/
   - REST API documentation
   - Rate limiting guidelines
   - Support channels (Discord, email)

3. **OAuth2 PKCE Tutorial**: https://www.oauth.com/playground/authorization-code-with-pkce.html
   - Step-by-step PKCE flow
   - Code verifier/challenge generation

### Community Resources
4. **isthereanydeal-nodejs**: https://www.npmjs.com/package/isthereanydeal-nodejs
   - Unofficial TypeScript SDK
   - Usage examples

5. **GitHub API Repository**: https://github.com/IsThereAnyDeal/API
   - Issue tracker
   - API updates/announcements
   - Community contributions

### Support Channels
6. **ITAD Contact**: api@isthereanydeal.com (for API questions/approval)
7. **CheapShark Discord**: https://discord.gg/cheapshark (#api-help channel)
8. **CheapShark Email**: admin@cheapshark.com

---

## Conclusion

### ⏸️ PROJECT DECISION: DEFERRED POST-MVP

**Status**: Research complete, implementation deferred to focus on core MVP features.

**Decision Rationale**:
1. 🎯 **MVP Focus** - Prioritize collection management CRUD, search, filters
2. ⏱️ **Time Budget** - 5h/week development time, ship 1 feature/week discipline
3. 🏗️ **Complexity** - Price tracking adds OAuth2, webhooks, rate limiting, caching
4. 📚 **Learning Goals** - Core Clean Architecture patterns demonstrated without external APIs
5. 🚀 **Shipping Velocity** - Avoid feature creep, deliver functional MVP faster

**Recommended Solution (When Implemented)**: IsThereAnyDeal API

**Rationale**:
1. ✅ **FREE** with simple attribution (meets budget requirement)
2. ✅ **Comprehensive** PC game coverage (40+ stores)
3. ✅ **Full-Featured** wishlist + OAuth2 + webhooks (complete solution)
4. ✅ **Well-Documented** with active community support
5. ✅ **React-Friendly** CORS-enabled, TypeScript SDK available
6. ✅ **Regional Pricing** supports France + 50 countries
7. ⚠️ **Limitation**: PC games only (acceptable for MVP)

**Why Not General Marketplaces**:
- eBay: Production approval required, no price history
- Amazon PA-API: Revenue requirements (account closure if no sales), ToS violations for non-commercial use
- Leboncoin/Cdiscount/Fnac: No public APIs available

**Implementation Plan (Future)**:
- **Phase 2+**: Evaluate if price tracking adds value post-MVP
- **If Implemented**: IsThereAnyDeal adapter as Infrastructure layer (Clean Arch)
- **Architecture**: Repository pattern ready to accept PriceTrackingRepository interface
- **Effort**: ~2-3 weeks (OAuth2, caching, webhooks, UI components)

**MVP Scope (Confirmed)**:
- ✅ Manual wishlist management (no external APIs)
- ✅ User-entered target prices (optional)
- ✅ Manual price tracking (user responsibility)
- ⏸️ Automated price alerts (deferred post-MVP)

**Document Preservation**:
- Research complete and preserved for future reference
- Implementation ready when/if feature becomes priority
- Demonstrates thorough Phase 0 API validation process

---

**Document Status**: ✅ RESEARCH COMPLETE | ⏸️ IMPLEMENTATION DEFERRED POST-MVP
**Next Action**: Proceed to Phase 1 Architecture Design (next-steps.md)
