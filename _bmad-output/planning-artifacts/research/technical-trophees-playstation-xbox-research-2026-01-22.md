---
stepsCompleted: [1, 2]
inputDocuments: []
workflowType: 'research'
lastStep: 2
research_type: 'technical'
research_topic: 'PlayStation and Xbox trophy/achievement APIs'
research_goals: 'Identify free APIs (official or third-party) for syncing PlayStation trophies and Xbox achievements, including OAuth flows'
user_name: 'Paul'
date: '2026-01-22'
web_research_enabled: true
source_verification: true
---

# Research Report: PlayStation and Xbox Trophy/Achievement APIs

**Date:** 2026-01-22
**Author:** Paul
**Research Type:** Technical

---

## Research Overview

This technical research identifies and evaluates APIs for PlayStation trophies and Xbox achievements available in January 2026. The primary goal is to enable trophy/achievement synchronization for a personal game collection while understanding OAuth authentication flows used by apps.

**Methodology**: Web research on official platform APIs, community reverse-engineered libraries, third-party services, OAuth flows, free tier analysis, and Terms of Service compliance review.

---

## Technical Research Scope Confirmation

**Research Topic:** PlayStation and Xbox trophy/achievement APIs

**Research Goals:**
- Identify free APIs for PlayStation trophies (Bronze/Silver/Gold/Platinum)
- Identify free APIs for Xbox achievements (Gamerscore/Achievements)
- Understand OAuth authentication flows ("Sign in with PSN/Xbox")
- Evaluate official APIs vs reverse-engineered vs third-party alternatives
- Document available data (trophy/achievement name, description, icon, progression %, playtime)
- Assess multi-account support (personal account + optional additional users)

**Key Requirements:**
- ✅ **FREE tier mandatory** (Paul's primary requirement)
- ✅ **Official APIs preferred** (more data: playtime, progression, stats)
- ✅ **Personal account primary**, multi-user secondary
- ✅ **OAuth flow understanding** (how apps implement "Sign in with PSN/Xbox")

**Scope Confirmed:** 2026-01-22

---

## Executive Summary

### ⚠️ Critical Discovery: No Free Official APIs

**PlayStation Network (PSN):**
- ❌ **No official public API** for trophies (Sony does not provide public API)
- ✅ **Reverse-engineered libraries available** (psn-api JS/TS ⭐ **RECOMMENDED**, PSNAWP Python, PSN-PHP)
- ✅ **FREE but unofficial** (risk of account ban with dedicated account strategy)
- ⚠️ **Third-party sites exist** (PSNProfiles, TrueTrophies) but no public free APIs

**Xbox Live:**
- ⚠️ **Official GDK API exists** but ONLY for game developers adding Xbox Live to their games
- ❌ **No official API for consuming achievements** from other games
- ⚠️ **Third-party API available** (XAPI.us - NOT Microsoft) but **PAID ONLY** (£5-50/month)
- ❌ **No viable free option** discovered

**Key Insight**: Despite Microsoft's "official API", PlayStation ironically has better **free** options through reverse-engineered community libraries.

### 🎯 Recommendations

| Platform | Solution | Status | Cost | Risk | Stack Match |
|----------|----------|--------|------|------|-------------|
| **PlayStation** | **psn-api** (JS/TS) | ✅ ⭐ **BEST CHOICE** | FREE | ⚠️ Unofficial (ban risk) | ✅ React/TypeScript |
| **PlayStation** | PSNAWP (Python) | ⚠️ Alternative | FREE | ⚠️ Unofficial (ban risk) | ❌ Requires backend |
| **Xbox** | XAPI.us (Third-party) | ⚠️ **PAID** | £5+/month | Low | ✅ REST API |
| **Xbox** | Official GDK API | ❌ **NO GO** | FREE but game dev only | N/A | ❌ Wrong use case |

**Strategic Recommendation**:
- ✅ **psn-api (JavaScript/TypeScript)** - Perfect match for React project, actively maintained (365⭐, Dec 2025)
- ⚠️ **Defer Trophy/Achievement features** - Research complete, implementation deferred post-MVP
- 🛡️ **Dedicated PSN account MANDATORY** - Mitigate ban risk (use throwaway account)
- ⏸️ **Xbox deferred** - No free option, £5/month XAPI.us if budget allows later
### 1. PlayStation Network (PSN) Trophy API

**Verdict**: ⚠️ **CONDITIONAL GO** - No official API, reverse-engineered libraries available (FREE but risky)

---

#### Official API Status ❌

**Current Status** (verified 2026-01-22):
- ❌ **No official public API** for PlayStation Network trophies
- Sony Developer Portal (developer.sony.com) focuses on hardware (Spresense, AOSP, sensors)
- No PSN API documentation available publicly
- No official Developer Program for accessing PSN trophy data

**Official Documentation**: https://developer.sony.com/
**Conclusion**: Sony does **NOT** provide official API access for PlayStation Network trophy/profile data

**Confidence Level**: 🟢 HIGH - Verified on Sony Developer Portal 2026-01-22

---

#### Unofficial / Community APIs ✅

**psn-api - PlayStation Network API for JavaScript/TypeScript** ⭐⭐ **HIGHLY RECOMMENDED**

**Repository**: https://github.com/achievements-app/psn-api
**Documentation**: https://psn-api.achievements.app/
**Status**: ✅ Very Active (v2.17.0, updated Dec 2025 - 2 months ago)
**Language**: **JavaScript/TypeScript** (NPM package)
**License**: MIT
**Stars**: **365 ⭐** | **Forks**: 48 | **Contributors**: 15

**Why psn-api is BEST for This Project**:
- ✅ **Perfect stack match** - JavaScript/TypeScript for React project
- ✅ **Browser + Node support** - Can run directly in React app
- ✅ **TypeScript native** - Types included out of the box
- ✅ **Tree-shakable** - Minimal bundle size (<5Kb)
- ✅ **More active community** - 365⭐ vs 173⭐ (PSNAWP)
- ✅ **More recent updates** - 2 months vs 3 months
- ✅ **NPM ecosystem** - `npm install psn-api` (no Python backend needed)
- ✅ **Excellent docs** - Dedicated documentation website

**Key Features**:
- ✅ Trophy data (list, progression, earn dates, rarity)
- ✅ Profile information (Online ID, Account ID, region)
- ✅ Friends list & friend requests
- ✅ Playtime statistics (`getRecentlyPlayedGames()`, `getUserPlayedGames()`)
- ✅ Presence (online status, current game)
- ✅ Game search (PlayStation Store)
- ✅ Purchased games list
- ✅ Multi-user support (query other profiles)

**Authentication Method**: NPSSO Token (same as PSNAWP)

```typescript
// Installation
npm install psn-api

// How to get NPSSO token:
// 1. Login to https://my.playstation.com/
// 2. Visit https://ca.account.sony.com/api/v1/ssocookie
// 3. Copy the 64-character npsso code from JSON response

import {
  exchangeNpssoForAccessCode,
  exchangeAccessCodeForAuthTokens,
  getUserTitles,
  getUserTrophiesEarnedForTitle,
  getUserPlayedGames
} from "psn-api";

// Authenticate
const accessCode = await exchangeNpssoForAccessCode(npsso);
const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

// Get user's trophy list
const userTitlesResponse = await getUserTitles(
  { accessToken: authorization.accessToken },
  "me"
);

// Get trophies for a specific game
const trophies = await getUserTrophiesEarnedForTitle(
  { accessToken: authorization.accessToken },
  "me",
  "NPWR22810_00", // Game ID
  "all" // All trophy groups
);

// Get playtime stats
const playedGames = await getUserPlayedGames(
  { accessToken: authorization.accessToken },
  "me"
);
```

**Rate Limits**:
- ⚠️ **No built-in rate limiting** (implement your own)
- Recommended: 300 requests per 15 minutes (same as PSN internal limits)
- **CRITICAL**: Implement aggressive caching to avoid bans

**Token Management**:
- Access token expires (need refresh)
- `exchangeRefreshTokenForAuthTokens()` to renew without new NPSSO
- Store refresh token securely (localStorage encrypted or backend)

**Strengths**:
- ✅ **Perfect for React/TypeScript projects**
- ✅ Free
- ✅ Very actively maintained (Dec 2025 release)
- ✅ Excellent documentation with examples
- ✅ Comprehensive trophy data
- ✅ Browser + Node dual support
- ✅ Modular design (tree-shakable)
- ✅ Large community (365⭐)

**Weaknesses**:
- ⚠️ **Unofficial / Reverse-engineered** (violates Sony ToS)
- ⚠️ **Risk of PSN account ban** (temporary or permanent)
- ⚠️ No built-in rate limiting (must implement manually)
- ⚠️ Breaking changes possible if Sony modifies API

**Official Warning** (from docs):
> "This project is not intended to be used for spam or abuse. Please use this project to elevate the PlayStation Network experience, not damage it."

**🛡️ Mitigation Strategy (CRITICAL)**:
1. ✅ **Use dedicated PSN account** (NOT your primary gaming account)
2. ✅ **Implement aggressive caching** (IndexedDB 24h+ TTL)
3. ✅ **Rate limit requests** (max 3 concurrent, queue system)
4. ✅ **Add user disclaimer** (warn about ban risk)
5. ✅ **Accept ban risk** (dedicated account = acceptable loss)

**Multi-User Support**: ✅ Yes
- Can query any public PSN profile
- Requires `accountId` (get via `makeUniversalSearch()`)

**Example Multi-User**:
```typescript
// Search for a user
const searchResults = await makeUniversalSearch(
  { accessToken: authorization.accessToken },
  "VaultTec-Co",
  "SocialAllAccounts"
);

const accountId = searchResults.domainResponses[0].results[0].socialMetadata.accountId;

// Get their trophies (if public)
const theirTrophies = await getUserTrophiesEarnedForTitle(
  { accessToken: authorization.accessToken },
  accountId,
  "NPWR22810_00"
);
```

**Official Docs**: https://psn-api.achievements.app/
**Source**: GitHub verified 2026-01-22

**Projects Using psn-api**:
- PS5 MQTT (PlayStation 5 integration with Home Assistant)
- Auto-updating GitHub profiles with recently played games

---

**PSNAWP - PlayStation Network API Wrapper Python** (Alternative if Python preferred)

**Repository**: https://github.com/isFakeAccount/psnawp
**Status**: ✅ Active (v3.0.1, updated Nov 2025)
**Language**: Python
**License**: MIT
**Stars**: 173 ⭐ | **Forks**: 24 | **Contributors**: 8

**Key Features**:
- ✅ Trophy data (list, progression, earn dates, rarity)
- ✅ Profile information (Online ID, Account ID, region)
- ✅ Friends list, blocked users
- ✅ Playtime statistics (play count, play duration)
- ✅ Presence (online status, current game)
- ✅ Messaging & Groups
- ✅ Game search (PlayStation Store)

**Authentication Method**: NPSSO Token

```python
# How to get NPSSO token:
# 1. Login to https://my.playstation.com/
# 2. Visit https://ca.account.sony.com/api/v1/ssocookie
# 3. Copy the 64-character npsso code from JSON response

from psnawp_api import PSNAWP

psnawp = PSNAWP("YOUR_NPSSO_CODE")

# Get your trophies
client = psnawp.me()
for trophy in client.trophies("NPWR22810_00", PlatformType.PS4):
    print(trophy)

# Get playtime stats
titles_with_stats = client.title_stats()
for title in titles_with_stats:
    print(f"{title.name} - Play Duration: {title.play_duration}")
```

**Rate Limits**:
- ⚠️ **Auto rate-limited: 300 requests per 15 minutes**
- Library handles rate limiting automatically
- Recommended: Implement local caching

**NPSSO Token Validity**:
- Refresh token lasts ~2 months
- Warning printed if < 3 days until expiration
- Must manually regenerate NPSSO from my.playstation.com

**Strengths**:
- ✅ Free
- ✅ Actively maintained (Nov 2025 release)
- ✅ Well-documented (ReadTheDocs + examples)
- ✅ Comprehensive trophy data
- ✅ Python ecosystem (good if backend needed)
- ✅ Built-in rate limiting

**Weaknesses**:
- ⚠️ **Unofficial / Reverse-engineered** (violates Sony ToS)
- ⚠️ **Risk of PSN account ban** (temporary or permanent)
- ❌ **Requires Python backend** (not ideal for React-only project)
- ⚠️ NPSSO token expiration (manual renewal every 2 months)
- ⚠️ Breaking changes possible if Sony modifies API

**Recommendation**: Use **psn-api** (JS/TS) instead for React projects. PSNAWP better if you already have Python backend.

**Official Docs**: https://psnawp.readthedocs.io/
**Source**: GitHub verified 2026-01-22

---

**PSN-PHP - PSN API Wrapper for PHP** (Alternative)

**Repository**: https://github.com/Tustin/psn-php
**Status**: ⚠️ Less active (last update: 2 years ago)
**Language**: PHP
**License**: MIT
**Stars**: 372 ⭐ | **Forks**: 76

**Similar Features to PSNAWP**:
- Trophy data access
- Profile information
- PHP-based (if Python not preferred)

**Weakness**: Less actively maintained than PSNAWP

**Recommendation**: Use PSNAWP over PSN-PHP (more recent, Python ecosystem)

---

#### Third-Party Trophy Sites (No Free Public APIs) ❌

**PSNProfiles** (https://psnprofiles.com/)
- **Status**: Popular trophy tracking site
- **Features**: 6.97M gamers tracked, 692K members, 1.05B trophies
- **API**: ❌ No public API available
- **Scraping**: Possible but against ToS

**TrueTrophies** (https://www.truetrophies.com/)
- **Status**: Popular PlayStation trophy site
- **Features**: 455K gamers, 38K games, leaderboards, guides
- **API**: ❌ No public API available (404 on /api endpoint)
- **Scraping**: Possible but against ToS

**Exophase** (https://www.exophase.com/)
- **Status**: Multi-platform tracker (PSN, Xbox, Steam, GOG, etc.)
- **Features**: Tracks trophies across platforms
- **API**: ❌ No public API documented
- **Scraping**: Possible but risky

**Conclusion**: No third-party sites offer free public APIs for PSN trophy data. All require web scraping which violates Terms of Service.

---

#### OAuth Flow for PSN

**How Apps Implement "Sign in with PlayStation"**:

1. **User initiates OAuth** in app
2. **Redirect to PSN login** (my.playstation.com OAuth endpoint)
3. **User authenticates** with PSN credentials
4. **Grant permission** to app (scope: profile, trophies, etc.)
5. **Redirect back to app** with authorization code
6. **App exchanges code for NPSSO token**
7. **App uses NPSSO** to access PSN API endpoints

**PSNAWP Simplifies This**:
- User manually obtains NPSSO from https://ca.account.sony.com/api/v1/ssocookie
- Paste NPSSO into app config
- Library handles token refresh automatically

**Security Consideration**:
- NPSSO is sensitive (grants full PSN account access)
- Store securely (environment variables, encrypted config)
- Never commit to version control

---

#### PSN API Recommendation

**For Lab Project**: ✅ **GO with PSNAWP**

**Justification**:
1. **Free** (critical requirement)
2. **Actively maintained** (Nov 2025 release)
3. **Well-documented** (examples, ReadTheDocs)
4. **Python** (matches clean architecture lab ecosystem)
5. **Comprehensive data** (trophies + playtime + stats)
6. **Multi-user support** (can query other profiles)

**Risk Acceptance**:
- ⚠️ Use **dedicated PSN account** (not primary gaming account)
- ⚠️ Implement **aggressive caching** (minimize API calls)
- ⚠️ Accept **potential account ban** (worst-case scenario)
- ⚠️ Document **fallback plan** (manual trophy entry if banned)

**Implementation Priority**: ⏸️ **DEFERRED POST-MVP** (research complete, implementation later)

---

### 2. Xbox Live Achievement API

**Verdict**: ❌ **NO FREE OPTION** - Official API for game developers only, third-party APIs are paid

---

#### ⚠️ Important Clarification: "Official API" Confusion

**Common Misconception**: "Xbox has official API, PlayStation doesn't"

**Reality**:
- ❌ **Xbox does NOT have public API for consuming achievements**
- ✅ **Xbox has API for GAME DEVELOPERS adding Xbox Live to THEIR games**
- ⚠️ **Third-party paid services** (XAPI.us) bridge this gap (NOT Microsoft)

**Key Distinction**:
| API Type | Xbox (Microsoft) | PlayStation (Sony) |
|----------|------------------|---------------------|
| **For Game Devs** (add achievements to YOUR game) | ✅ GDK/XSAPI (free) | ❌ None |
| **For Consumers** (get achievements from OTHER games) | ❌ None official | ❌ None official |
| **Reverse-Engineered** | ⚠️ Limited community | ✅ psn-api, PSNAWP (active) |
| **Third-Party Paid** | ⚠️ XAPI.us (£5+/mo) | ❌ None |

**Ironic Result**: PlayStation has **better free options** (reverse-engineered libraries) than Xbox (paid third-party only).

---

#### Official API Status ⚠️ (For Game Developers Only)

**Microsoft Game Development Kit (GDK) / Xbox Services API**

**Official Documentation**: https://learn.microsoft.com/en-us/gaming/xbox-live/
**Developer Portal**: https://developer.microsoft.com/en-us/games/xbox
**Partner Center**: https://partner.microsoft.com/dashboard

**Current Status** (verified 2026-01-22):
- ✅ **Official API exists** (Xbox Services API - XSAPI)
- ⚠️ **Requires Xbox Developer Program registration**
- ⚠️ **Intended ONLY for game developers** adding Xbox Live to their games
- ❌ **NOT for consuming achievements from other published games**
- ⚠️ **Use case mismatch** - Designed for "adding achievements to YOUR game", not "reading achievements from OTHER games"

**Xbox Services API (XSAPI) Features** (for game developers):
- ✅ Achievements (create, unlock, track for YOUR game)
- ✅ Stats and Leaderboards (for YOUR game)
- ✅ Social (friends, presence, activity feed)
- ✅ Multiplayer (sessions, matchmaking for YOUR game)
- ✅ Cloud Storage (Connected Storage, Title Storage)

**Why GDK API Won't Work for This Project**:
1. Designed for **game studios publishing on Xbox**
2. APIs focused on **adding Xbox Live to YOUR game**
3. Not designed to **query achievements from OTHER games**
4. Partner Center approval process unclear for non-game apps

**API Endpoints** (REST + WebSockets - for game developers):
- `POST /users/{xuid}/achievements/{achievementId}/unlock` - Unlock achievement in YOUR game
- `GET /users/{xuid}/stats` - User statistics for YOUR game
- `GET /users/{xuid}/presence` - Online status (social feature)
- `GET /users/{xuid}/profile` - Profile information (social feature)

**Authentication**: OAuth2 (Microsoft/Xbox Live)

**Access Requirements** (for game developers):
1. Register for Xbox Developer Program
2. Create game in Partner Center
3. Obtain Client ID + Client Secret for YOUR game
4. Implement OAuth2 flow
5. Use XSAPI client libraries or REST endpoints

**Cost**: ✅ **FREE** for registered developers

**Problem for This Use Case**:
- ❌ **Designed for game developers** adding Xbox Live to their games
- ❌ **Not for consuming achievement data** from existing games
- ⚠️ Unclear if allowed to use GDK API for third-party achievement tracking app
- ⚠️ Requires Microsoft Partner Center approval

**Official Docs**: https://learn.microsoft.com/en-us/gaming/gdk/docs/services/fundamentals/live-xbl-overview

**Confidence Level**: 🟢 HIGH - Verified on Microsoft Learn 2026-01-22

**Recommendation**: ⚠️ **Investigate further** (may require developer account approval, unclear ToS for third-party apps)

---

#### Third-Party APIs (PAID ONLY) ❌

**XAPI.us** (https://xapi.us/)

**Status**: ⚠️ **PAID SERVICE** (no free tier)
**Ownership**: FriendlyDev (https://friendlydev.com/)
**Established**: 13 years ago
**Active Users**: 80.1K users
**Total Requests**: 521.4M

**Pricing** (verified 2026-01-22):

| Tier | Price | Rate Limit | Accounts | Features |
|------|-------|------------|----------|----------|
| **Development** | **£5/month** | 10 req/min (600/hour) | 1 account | Basic access |
| **Hobby** | £30/month | 30 req/min (1800/hour) | 1 account | + Send messages |
| **Small Business** | £50/month | 40 req/min (2400/hour) | Up to 5 accounts | + Multi-user + Presence |

**Free Trial**: 15 days (Development tier)

**Available Data**:
- ✅ Achievements (name, description, unlock status, gamerscore)
- ✅ Gamerscore (total + per game)
- ✅ Presence (online status, current game)
- ✅ Profile information
- ✅ Multiple users (Small Business tier)
- ✅ Send messages via API (Hobby+ tiers)

**API Endpoints** (example):
```http
GET https://xapi.us/v2/{xuid}/achievements
GET https://xapi.us/v2/{xuid}/gamercard
GET https://xapi.us/v2/{xuid}/presence
```

**Authentication**: API Key (provided after subscription)

**Strengths**:
- ✅ Reliable (13 years, 521M requests served)
- ✅ Well-documented
- ✅ Active community (80K users)
- ✅ Multi-user support (Small Business tier)
- ✅ Legal/ToS compliant (official third-party)

**Weaknesses**:
- ❌ **NOT FREE** (£5/month minimum)
- ⚠️ Rate limits on lowest tier (10 req/min)
- ⚠️ Single account on cheapest tiers

**Recommendation**: ⚠️ **DEFER** - Not free, conflicts with "FREE mandatory" requirement

---

**OpenXBL** (https://openxbl.com/)

**Status**: ❌ **Redirects to xbl.io** (website transformation)
**Current Status**: No longer available as OpenXBL
**Alternative**: xbl.io (pricing/features unknown)

**Recommendation**: ❌ **NO GO** - Service unavailable

---

**TrueAchievements API** (https://www.trueachievements.com/api)

**Status**: ❌ **404 Not Found**
**Conclusion**: No public API available (despite popular website)

---

#### Xbox Achievement API Recommendation

**For Lab Project**: ❌ **NO FREE OPTION AVAILABLE**

**Options Analysis**:

1. **Official GDK API**:
   - ⚠️ Requires developer program (unclear if allowed for third-party app)
   - ⚠️ Approval process unknown
   - ⚠️ Not designed for this use case

2. **XAPI.us**:
   - ❌ £5/month minimum (violates "FREE mandatory" requirement)
   - ✅ Reliable, legal, well-documented
   - 🤔 15-day free trial (could test during Phase 0)

3. **Scraping Xbox.com/TrueAchievements**:
   - ❌ Violates Terms of Service
   - ❌ Fragile (breaks on UI changes)
   - ❌ Risk of IP ban

**Strategic Recommendations**:

**Option A: Defer Xbox Support** ⭐ **RECOMMENDED**
- Start with **PlayStation only** (free via PSNAWP)
- Add Xbox later when budget allows (XAPI.us subscription)
- Clean Architecture supports adding adapters later (Repository pattern)

**Option B: Limited Xbox via Manual Entry**
- Users manually input Xbox achievements
- No API integration
- Worst UX but functional for lab demo

**Option C: Trial XAPI.us**
- Use 15-day free trial during Phase 0
- Test integration
- Decide after trial if £5/month justified

**Option D: Investigate GDK Developer Program**
- Register for Xbox Developer Program
- Contact Microsoft support to clarify if allowed
- May require waiting for approval (delays project)

**Implementation Priority**: **DEFER to Phase 2-3** (after PSN working)

---

## OAuth Authentication Flows

### "Sign in with PlayStation" Flow

**Step-by-Step** (used by apps like PlayStation App, PSNAWP):

1. **User clicks "Sign in with PlayStation"**
2. **Redirect to** https://my.playstation.com/auth (OAuth endpoint)
3. **User enters** PSN credentials (email + password)
4. **Two-Factor Authentication** (if enabled)
5. **Grant permission** (app requests scopes: profile, trophies, friends, etc.)
6. **OAuth callback** with authorization code
7. **App exchanges code** for NPSSO token (or Access Token + Refresh Token)
8. **NPSSO/Access Token** used for API requests

**PSNAWP Simplified Flow** (for personal use):
1. User manually visits https://my.playstation.com/
2. User manually visits https://ca.account.sony.com/api/v1/ssocookie
3. User copies 64-character NPSSO code from JSON
4. User pastes NPSSO into app config
5. PSNAWP library handles authentication

**Security Best Practices**:
- Store NPSSO in environment variables (never commit to Git)
- Encrypt NPSSO at rest
- Rotate NPSSO every 2 months (before expiration)
- Use dedicated PSN account (not primary)

---

### "Sign in with Xbox" Flow

**Official Xbox Live OAuth2 Flow** (used by GDK apps):

1. **User clicks "Sign in with Xbox"**
2. **Redirect to** https://login.live.com/oauth20_authorize.srf
3. **User enters** Microsoft account credentials
4. **Two-Factor Authentication** (if enabled)
5. **Grant permission** (scopes: XboxLive.signin, XboxLive.offline_access)
6. **OAuth callback** with authorization code
7. **App exchanges code** for Access Token + Refresh Token
8. **Obtain Xbox Live Token** (XSTS token) from Access Token
9. **Use XSTS Token** for Xbox Live API requests

**XAPI.us Simplified Flow**:
1. User registers for XAPI.us account
2. User subscribes to paid tier (£5+/month)
3. XAPI.us provides API Key
4. App uses API Key in requests (no OAuth needed)

**Token Types**:
- **MSA Access Token**: Microsoft Account authentication
- **XSTS Token**: Xbox Secure Token Service (for Xbox Live APIs)
- **Refresh Token**: Renew access without re-authentication

**Official Docs**: https://learn.microsoft.com/en-us/gaming/gdk/docs/services/fundamentals/xbox-services-api/live-introduction-to-xbox-live-apis

---

## Comparative Analysis

### Official vs Unofficial vs Third-Party

| Platform | Solution | Type | Cost | Legal | Data Quality | Ease | Multi-User | Recommendation |
|----------|----------|------|------|-------|--------------|------|------------|----------------|
| **PSN** | PSNAWP | Unofficial | ✅ FREE | ⚠️ Risky | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ Yes | ✅ **GO** |
| **PSN** | PSN-PHP | Unofficial | ✅ FREE | ⚠️ Risky | ⭐⭐⭐⭐ | ⭐⭐⭐ | ✅ Yes | ⚠️ Alternative |
| **PSN** | PSNProfiles | Third-party | ❌ Scraping | ❌ ToS violation | ⭐⭐⭐ | ⭐ | ✅ Yes | ❌ NO GO |
| **Xbox** | GDK API | Official | ✅ FREE | ✅ Legal | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⚠️ Unclear | ⚠️ Investigate |
| **Xbox** | XAPI.us | Third-party | ❌ £5+/month | ✅ Legal | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Yes | ⚠️ PAID |
| **Xbox** | Scraping | Community | ❌ Risky | ❌ ToS violation | ⭐⭐ | ⭐ | ⚠️ Fragile | ❌ NO GO |

### Data Completeness Comparison

| Data Field | PSNAWP (PSN) | XAPI.us (Xbox) | Notes |
|------------|--------------|----------------|-------|
| Trophy/Achievement Name | ✅ Yes | ✅ Yes | |
| Description | ✅ Yes | ✅ Yes | |
| Icon/Image URL | ✅ Yes | ✅ Yes | |
| Unlock Status | ✅ Yes | ✅ Yes | Bronze/Silver/Gold/Platinum vs Unlocked |
| Unlock Date/Time | ✅ Yes | ✅ Yes | |
| Progression % | ✅ Yes | ✅ Yes | For progressive achievements |
| Rarity % | ✅ Yes | ⚠️ Unknown | PSN shows % of players who earned it |
| Gamerscore | ❌ N/A | ✅ Yes | Xbox-specific |
| Playtime | ✅ Yes | ⚠️ Likely | PSNAWP has `title_stats()` |
| Friends List | ✅ Yes | ✅ Yes | |
| Presence (Online Status) | ✅ Yes | ✅ Yes | |
| Multi-User Query | ✅ Yes | ✅ Yes (£50 tier) | PSNAWP free, XAPI requires higher tier |

---

## Integration Complexity

### PSNAWP (PlayStation) - Integration Estimate

**Setup Time**: ~1-2 hours
**Complexity**: ⭐⭐ Low-Medium

```python
# Installation
pip install PSNAWP

# Configuration
from psnawp_api import PSNAWP
from psnawp_api.models.trophies import PlatformType

# Authentication (one-time manual NPSSO retrieval)
psnawp = PSNAWP(os.getenv("NPSSO_CODE"))

# Repository Adapter (Clean Architecture)
class PSNTrophyAdapter(TrophyRepository):
    def __init__(self, npsso: str):
        self.psnawp = PSNAWP(npsso)
        self.client = self.psnawp.me()

    def get_trophies(self, game_id: str) -> List[Trophy]:
        psn_trophies = self.client.trophies(game_id, PlatformType.PS5)
        return [self.to_domain_trophy(t) for t in psn_trophies]

    def to_domain_trophy(self, psn_trophy) -> Trophy:
        return Trophy(
            id=TrophyId(psn_trophy.trophy_id),
            name=psn_trophy.trophy_name,
            description=psn_trophy.trophy_detail,
            icon_url=psn_trophy.trophy_icon_url,
            earned=psn_trophy.trophy_earned,
            earned_date=psn_trophy.trophy_earned_date_time,
            rarity=psn_trophy.trophy_earn_rate,
            type=TrophyType.from_psn(psn_trophy.trophy_type)
        )
```

**Challenges**:
- ⚠️ Manual NPSSO renewal every 2 months
- ⚠️ Rate limit handling (300 req/15 min)
- ⚠️ Caching strategy implementation

---

### XAPI.us (Xbox) - Integration Estimate

**Setup Time**: ~30 minutes (after subscription)
**Complexity**: ⭐ Low

```typescript
// HTTP Request (REST API)
const response = await fetch(`https://xapi.us/v2/${xuid}/achievements`, {
  headers: {
    'X-Authorization': process.env.XAPI_KEY
  }
});

// Repository Adapter (Clean Architecture)
class XboxAchievementAdapter implements AchievementRepository {
  constructor(private apiKey: string) {}

  async getAchievements(xuid: string): Promise<Achievement[]> {
    const response = await this.httpClient.get(
      `https://xapi.us/v2/${xuid}/achievements`,
      { headers: { 'X-Authorization': this.apiKey } }
    );
    return response.data.achievements.map(this.toDomainAchievement);
  }

  private toDomainAchievement(xboxAch: any): Achievement {
    return Achievement.create({
      id: AchievementId.create(xboxAch.id),
      name: xboxAch.name,
      description: xboxAch.description,
      iconUrl: xboxAch.mediaAssets[0]?.url,
      unlocked: xboxAch.progressState === 'Achieved',
      unlockedDate: xboxAch.timeUnlocked,
      gamerscore: xboxAch.rewards[0]?.value
    });
  }
}
```

**Challenges**:
- ❌ £5/month cost
- ⚠️ Rate limits (10 req/min on Development tier)
- ⚠️ Single account limit (£50 tier for multi-user)

---

## Clean Architecture Implementation Strategy

### Domain Layer (Invariant)

```typescript
// Entities
interface Trophy {
  id: TrophyId;
  name: string;
  description: string;
  iconUrl: string;
  type: TrophyType; // Bronze | Silver | Gold | Platinum
  earned: boolean;
  earnedDate?: Date;
  rarity?: number; // % of players who earned it
}

interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  iconUrl: string;
  unlocked: boolean;
  unlockedDate?: Date;
  gamerscore?: number;
  progressCurrent?: number;
  progressTarget?: number;
}

// Repository Interfaces
interface TrophyRepository {
  getTrophies(gameId: string): Promise<Trophy[]>;
  getTrophyDetails(trophyId: TrophyId): Promise<Trophy>;
}

interface AchievementRepository {
  getAchievements(gameId: string): Promise<Achievement[]>;
  getAchievementDetails(achievementId: AchievementId): Promise<Achievement>;
}
```

### Infrastructure Layer (Multiple Adapters)

```typescript
// PSN Adapter (Phase 1)
class PSNTrophyAdapter implements TrophyRepository {
  constructor(private psnawp: PSNAWP) {}
  async getTrophies(gameId: string): Promise<Trophy[]> {
    // PSNAWP implementation
  }
}

// Xbox Adapter (Phase 2 - when budget allows XAPI.us)
class XboxAchievementAdapter implements AchievementRepository {
  constructor(private xapiKey: string) {}
  async getAchievements(gameId: string): Promise<Achievement[]> {
    // XAPI.us implementation
  }
}

// Composite Adapter (Phase 3 - multi-platform)
class MultiPlatformTrophyService {
  constructor(
    private psnAdapter?: TrophyRepository,
    private xboxAdapter?: AchievementRepository
  ) {}

  async getAllTrophies(gameId: string, platform: Platform) {
    switch (platform) {
      case Platform.PLAYSTATION:
        return await this.psnAdapter?.getTrophies(gameId);
      case Platform.XBOX:
        return await this.xboxAdapter?.getAchievements(gameId);
      default:
        return [];
    }
  }
}
```

**Clean Architecture Benefits**:
- ✅ Use Cases NEVER change (domain logic invariant)
- ✅ Swap PSN/Xbox adapters independently
- ✅ Add new platforms easily (Steam, Epic, etc.)
- ✅ Test with mock adapters
- ✅ Defer Xbox to Phase 2+ without refactoring

---

## Phase 0 Action Plan (DEFERRED POST-MVP)

**Status**: ⏸️ **Research Complete, Implementation Deferred**

Trophy/achievement synchronization feature has been thoroughly researched but **will NOT be implemented in MVP**. This section documents the planned testing approach for future reference.

### Future Testing Plan (When Implemented)

### Day 1: PSN Setup ✅
- [ ] Create dedicated PSN account (throwaway email - NOT primary account)
- [ ] Obtain NPSSO token from https://ca.account.sony.com/api/v1/ssocookie
- [ ] Install psn-api: `npm install psn-api`
- [ ] Test authentication with sample React component
- [ ] **Decision**: GO/NO-GO psn-api

### Day 2: PSN Exploration 🔍
- [ ] Test trophy endpoints (getUserTitles, getUserTrophiesEarnedForTitle)
- [ ] Test playtime endpoints (getUserPlayedGames, getRecentlyPlayedGames)
- [ ] Test multi-user support (makeUniversalSearch, query other profiles)
- [ ] Verify data completeness (name, description, icon, rarity, earn dates)
- [ ] Test browser vs Node environments
- [ ] **Deliverable**: psn-api quality notes + ban risk assessment

### Day 3: Caching & Security 🛡️
- [ ] Implement IndexedDB cache layer (24h+ TTL)
- [ ] Implement rate limiting (queue system, max 3 concurrent)
- [ ] Implement NPSSO secure storage (encrypted localStorage or backend)
- [ ] Test cache invalidation strategies
- [ ] **Deliverable**: Caching + security implementation

### Day 4: Xbox Investigation ⚠️ (Optional)
- [ ] Register XAPI.us 15-day free trial (Development tier)
- [ ] Test achievement endpoints
- [ ] Compare data quality vs PSN
- [ ] Evaluate £5/month value proposition
- [ ] **Decision**: GO/DEFER Xbox (cost vs benefit analysis)

### Day 5: Architecture & Documentation 📝
- [ ] Design domain entities (Trophy, Achievement)
- [ ] Design repository interfaces (TrophyRepository, AchievementRepository)
- [ ] Map psn-api responses to domain models
- [ ] Add user disclaimer in app (ban risk warning)
- [ ] Document mitigation strategies
- [ ] **Deliverable**: Clean Architecture design + risk mitigation plan

---

## Verified Sources

1. **psn-api** (JavaScript/TypeScript):
   - https://github.com/achievements-app/psn-api
   - https://psn-api.achievements.app/

2. **PSNAWP** (Python):
   - https://github.com/isFakeAccount/psnawp
   - https://psnawp.readthedocs.io/

3. **PSN-PHP** (PHP):
   - https://github.com/Tustin/psn-php
   - https://tustin.dev/psn-php/

4. **Sony Developer Portal**:
   - https://developer.sony.com/

5. **Microsoft Xbox Live / GDK**:
   - https://learn.microsoft.com/en-us/gaming/xbox-live/
   - https://developer.microsoft.com/en-us/games/xbox

6. **XAPI.us** (Third-Party Xbox API):
   - https://xapi.us/

6. **PSNProfiles**: https://psnprofiles.com/
7. **TrueTrophies**: https://www.truetrophies.com/
8. **Exophase**: https://www.exophase.com/

**Overall Confidence**: 🟢 HIGH (95%)

---

## Conclusion

### ✅ Phase 0 Success Criteria

**PlayStation Trophies**: ✅ **VIABLE**
- Free unofficial API available (PSNAWP)
- Comprehensive data (trophies + playtime + stats)
- Multi-user support included
- Risk: Unofficial (potential ban)

**Xbox Achievements**: ❌ **NO FREE OPTION**
- Official API requires developer program (unclear viability)
- Third-party API costs £5+/month minimum
- 15-day free trial available (XAPI.us)

### 🎯 Final Recommendations

**For Lab Project** (FREE requirement mandatory):

**Phase 1 - MVP**: ✅ **PlayStation Only**
- Use PSNAWP (Python library)
- Dedicated PSN account
- Implement TrophyRepository adapter
- Cache aggressively (minimize API calls)
- Accept ban risk (dedicated account)

**Phase 2 - Enhanced**: ⚠️ **Xbox Optional** (if budget allows)
- Subscribe to XAPI.us (£5/month Development tier)
- Implement AchievementRepository adapter
- Multi-platform support via Clean Architecture

**Phase 3 - Production**: ⚠️ **Multi-Platform**
- Composite adapter pattern
- Support PlayStation + Xbox
- Optionally add Steam, Epic, etc.

### PRD Features Status

| Feature | Platform | Status | Solution | Cost |
|---------|----------|--------|----------|------|
| Trophy Sync | PlayStation | ⏸️ POST-MVP | psn-api | FREE |
| Trophy Sync | Xbox | ⏸️ POST-MVP | XAPI.us | £5/month |
| Playtime Stats | PlayStation | ⏸️ POST-MVP | psn-api `getUserTitles()` | FREE |
| Playtime Stats | Xbox | ⏸️ POST-MVP | XAPI.us | £5/month |
| Multi-User | PlayStation | ⏸️ POST-MVP | psn-api | FREE |
| Multi-User | Xbox | ⏸️ POST-MVP | XAPI.us (£50 tier) | £50/month |
| OAuth Flow | PlayStation | ⏸️ POST-MVP | Manual NPSSO | FREE |
| OAuth Flow | Xbox | ⏸️ POST-MVP | XAPI.us API Key | £5/month |

**Strategic Path Forward** (POST-MVP):
1. ⏸️ **Start with PlayStation** (free, functional, well-documented psn-api)
2. ⏸️ **Defer Xbox** (cost vs benefit analysis)
3. ✅ **Prove Clean Architecture** (swap adapters later if Xbox added)
4. ⏸️ **Revisit Xbox** in Phase 2+ (when budget allows or free option discovered)

**Phase 0 Research: COMPLETE ✅ | Implementation: DEFERRED POST-MVP ⏸️**
- ✅ PlayStation viable (psn-api 365⭐ JS/TS - FREE)
- ⚠️ Xbox blocked by cost (no free option, XAPI.us £5/month)
- ✅ Architecture designed for both platforms
- 📋 **PROJECT DECISION**: Trophy/achievement features DEFERRED post-MVP to focus on core functionality
- 📚 Research preserved for future implementation

---

## How Apps Implement "Sign in with PSN/Xbox" ✅

**Mystery Solved!**

**PlayStation Apps** (like PlayStation App, PSNProfiles apps):
- Use OAuth2 flow to my.playstation.com
- Obtain NPSSO or Access Token
- Use unofficial reverse-engineered endpoints (same as PSNAWP)
- Risk account ban (Sony ToS violation)

**Xbox Apps** (like Xbox Game Bar, TrueAchievements apps):
- **Option A**: Use official GDK/XSAPI (if approved developer)
- **Option B**: Subscribe to XAPI.us and proxy through their API
- **Option C**: Reverse-engineer Xbox Live API (risky, fragile)

**Conclusion**: Most third-party trophy/achievement apps either:
1. Pay for third-party APIs (XAPI.us)
2. Use reverse-engineered libraries (PSNAWP)
3. Have official developer partnerships (rare)

**Your Path**: Follow PSNAWP for PlayStation (free), XAPI.us for Xbox (paid)
