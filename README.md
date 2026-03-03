https://x.com/ClawchanInt12

<div align="center">

<img src="https://img.shields.io/badge/CLASSIFIED-TOP%20SECRET-red?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAxTDMgNXY2YzAgNS41NSAzLjQ1IDEwLjI1IDggMTEuNSA5LjU1LTEuMjUgMTYtNS43NSAxNi0xMVY1bC05LTR6bTAgMTBjMS42NiAwIDMgMS4zNCAzIDNzLTEuMzQgMy0zIDMtMy0xLjM0LTMtMyAxLjM0LTMgMy0zeiIvPjwvc3ZnPg==&logoColor=white" />

# 🦅 CLAWCHAN INTELLIGENCE AGENCY

### *Global Situational Awareness & Predictive Intelligence Platform*

[![Build Status](https://img.shields.io/badge/BUILD-OPERATIONAL-brightgreen?style=flat-square)](https://clawchan.io)
[![Coverage](https://img.shields.io/badge/COVERAGE-98%25-brightgreen?style=flat-square)](https://clawchan.io)
[![Version](https://img.shields.io/badge/VERSION-2.0.0--ALPHA-blue?style=flat-square)](https://clawchan.io)
[![License](https://img.shields.io/badge/LICENSE-CLASSIFIED-red?style=flat-square)](https://clawchan.io)

<br/>

<p align="center">
  <img src="img1 (2).jpeg" width="100%" alt="Clawchan Intelligence Agency Hero" />
</p>


<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black&style=flat-square" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white&style=flat-square" />
</p>

<p align="center">
  <em>"The owl sees all, the claw strikes true"</em>
</p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%">

</div>

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#-executive-summary)
2. [Mission Architecture](#-mission-architecture)
3. [Intelligence Modules](#-intelligence-modules)
4. [Data Sources & APIs](#-data-sources--apis)
5. [Technical Stack](#-technical-stack)
6. [Installation & Deployment](#-installation--deployment)
7. [Configuration](#-configuration)
8. [Screenshots](#-screenshots)
9. [Security & Compliance](#-security--compliance)
10. [Contributing](#-contributing)
11. [Changelog](#-changelog)
12. [Acknowledgments](#-acknowledgments)

---

## 🎯 EXECUTIVE SUMMARY

**CLAWCHAN** is a next-generation intelligence fusion platform designed for real-time global situational awareness. Inspired by the operational capabilities of the CIA, Pentagon's situational rooms, and Palantir's data integration frameworks, CLAWCHAN aggregates multi-source intelligence into a unified command interface.

### Core Capabilities

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CLAWCHAN INTELLIGENCE FUSION                         │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │   GEOSPATIAL │  │   THREAT     │  │   ECONOMIC   │  │  PREDICTIVE│  │
│  │   ANALYTICS  │  │   DETECTION  │  │   MONITORING │  │  ANALYTICS │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘  │
│         │                 │                 │                │         │
│         └─────────────────┴─────────────────┴────────────────┘         │
│                                    │                                    │
│                         ┌──────────┴──────────┐                        │
│                         │   FUSION ENGINE     │                        │
│                         │   (Real-time)       │                        │
│                         └──────────┬──────────┘                        │
│                                    │                                    │
│                         ┌──────────┴──────────┐                        │
│                         │   COMMAND DASHBOARD │                        │
│                         └─────────────────────┘                        │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Metrics

| Metric | Value |
|--------|-------|
| **Data Sources** | 15+ Live APIs |
| **Update Frequency** | Real-time (2-30s intervals) |
| **Global Coverage** | 195 Countries |
| **Concurrent Tracks** | 10,000+ Objects |
| **Latency** | < 500ms |

---

## 🏗 MISSION ARCHITECTURE

### System Overview

```
                                    ┌─────────────────────────────────────┐
                                    │         USER INTERFACE LAYER        │
                                    │    (React 18 + TypeScript + Vite)   │
                                    └───────────────┬─────────────────────┘
                                                    │
                       ┌────────────────────────────┼────────────────────────────┐
                       │                            │                            │
            ┌──────────▼──────────┐    ┌───────────▼────────────┐   ┌──────────▼──────────┐
            │   VISUALIZATION     │    │     STATE MANAGEMENT   │   │     DATA LAYER      │
            │   • Leaflet Maps    │    │     • Zustand Store    │   │   • React Query     │
            │   • D3 Charts       │    │     • Persist Middleware│   │   • WebSockets      │
            │   • CSS Animations  │    │     • Real-time Sync   │   │   • REST APIs       │
            └──────────┬──────────┘    └───────────┬────────────┘   └──────────┬──────────┘
                       │                           │                           │
            ┌──────────┴───────────────────────────┴───────────────────────────┴──────────┐
            │                              INTELLIGENCE ENGINE                             │
            ├──────────────────────────────────────────────────────────────────────────────┤
            │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────┐  │
            │  │  CONFLICT  │  │  DISASTER  │  │  ECONOMIC  │  │  AIRCRAFT  │  │ SATELL │  │
            │  │  MONITOR   │  │  RESPONSE  │  │  WARFARE   │  │  TRACKING  │  │  ITE   │  │
            │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └───┬────┘  │
            │        │               │               │               │             │       │
            └────────┴───────────────┴───────────────┴───────────────┴─────────────┴───────┘
                                                    │
            ┌───────────────────────────────────────┴───────────────────────────────────────┐
            │                              EXTERNAL DATA SOURCES                             │
            ├───────────────────────────────────────────────────────────────────────────────┤
            │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
            │  │   USGS   │ │   NASA   │ │  GDACS   │ │  ADS-B   │ │CelesTrak │ │ Google │  │
            │  │Earthquake│ │  EONET   │ │  Alerts  │ │  (lol)   │ │ Satellite│ │  Earth │  │
            │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘  │
            │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
            │  │ CoinGecko│ │  NewsAPI  │ │  Austin  │ │ OpenSky  │ │  Other   │             │
            │  │  Crypto  │ │   RSS    │ │ Traffic  │ │ Network  │ │ Sources  │             │
            │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘             │
            └───────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              DATA INGESTION PIPELINE                                     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     │
│   │  Source  │────▶│  Fetch   │────▶│ Transform│────▶│  Cache   │────▶│  Store   │     │
│   │   API    │     │  Layer   │     │  Layer   │     │  Layer   │     │ (Zustand)│     │
│   └──────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘     │
│        │                │                │                │                │           │
│        │           ┌────┴────┐      ┌────┴────┐      ┌────┴────┐           │           │
│        │           │ Retry   │      │ Normalize│      │  TTL    │           │           │
│        │           │ Logic   │      │  Format  │      │  Expiry │           │           │
│        │           └─────────┘      └─────────┘      └─────────┘           │           │
│        │                                                                    │           │
│        └────────────────────────────────────────────────────────────────────┘           │
│                                    │                                                    │
│                                    ▼                                                    │
│   ┌──────────────────────────────────────────────────────────────────────────────┐     │
│   │                         REACTIVE UPDATE ENGINE                                │     │
│   │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐            │     │
│   │  │  WebSocket │  │   Polling  │  │   Push     │  │   Batch    │            │     │
│   │  │   Stream   │  │   (2-30s)  │  │   Events   │  │   Updates  │            │     │
│   │  └────────────┘  └────────────┘  └────────────┘  └────────────┘            │     │
│   └──────────────────────────────────────────────────────────────────────────────┘     │
│                                    │                                                    │
│                                    ▼                                                    │
│   ┌──────────────────────────────────────────────────────────────────────────────┐     │
│   │                         RENDER ENGINE                                         │     │
│   │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐            │     │
│   │  │   Marker   │  │   Layer    │  │   Popup    │  │  Animation │            │     │
│   │  │   Render   │  │   Filter   │  │   Display  │  │   (CSS)    │            │     │
│   │  └────────────┘  └────────────┘  └────────────┘  └────────────┘            │     │
│   └──────────────────────────────────────────────────────────────────────────────┘     │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 INTELLIGENCE MODULES

### 1. 🌍 GEOSPATIAL COMMAND CENTER

Real-time satellite imagery with multi-layer intelligence overlay.

```
┌─────────────────────────────────────────────────────────────────┐
│                    GEOSPATIAL LAYERS                             │
├─────────────────────────────────────────────────────────────────┤
│  Base Layer: Google Earth Satellite (max zoom 22)               │
│  Hybrid Layer: Satellite + Labels + Roads                       │
├─────────────────────────────────────────────────────────────────┤
│  Intelligence Overlays:                                         │
│  ┌────────────────┬────────────────┬────────────────┐          │
│  │ 🔴 Conflict    │ 🟠 Military    │ 🟡 Nuclear     │          │
│  │    Zones       │   Activity     │    Sites       │          │
│  ├────────────────┼────────────────┼────────────────┤          │
│  │ 🔵 Data Centers│ 🟣 Ship Traffic│ 🟤 Earthquakes │          │
│  │    (AI)        │   (AIS)        │   (USGS)       │          │
│  ├────────────────┼────────────────┼────────────────┤          │
│  │ 🟢 Disasters   │ ⚫ Undersea    │ ⚪ Pipelines   │          │
│  │   (NASA)       │    Cables      │                │          │
│  └────────────────┴────────────────┴────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Zoom level 2-22 (building-level detail)
- Layer toggle system
- Real-time marker updates
- Click-to-intelligence popup

### 2. ✈️ ADS-B AIRCRAFT TRACKING SYSTEM

Global aircraft surveillance using ADS-B transponder data.

```
┌─────────────────────────────────────────────────────────────────┐
│              AIRCRAFT TRACKING CAPABILITIES                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Data Points:                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   ICAO24     │   Callsign     │   Altitude     │          │
│  │   Address    │   (Flight ID)  │   (feet MSL)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Speed     │   Heading      │   Squawk       │          │
│  │   (knots)    │   (degrees)    │   (Mode 3/A)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │  Vertical    │   Last Contact │                            │
│  │    Rate      │   (timestamp)  │                            │
│  └──────────────┘  └──────────────┘                            │
│                                                                  │
│  Visual Features:                                                │
│  • Heading-rotated SVG icons                                    │
│  • Altitude-based color coding                                  │
│  • Speed indicators                                             │
│  • Real-time movement (2s refresh)                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Data Sources:**
- Primary: `api.adsb.lol` (free, global coverage)
- Fallback: Simulated traffic on major routes

### 3. 🛰️ SATELLITE ORBITAL TRACKING

Space situational awareness for orbital objects.

```
┌─────────────────────────────────────────────────────────────────┐
│              SATELLITE TRACKING MODULE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tracked Objects:                                                │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  🛰️ ISS (ZARYA)        │  NORAD: 25544  │  LEO       │    │
│  │  🔭 Hubble Telescope    │  NORAD: 20580  │  LEO       │    │
│  │  🏠 Tiangong Station    │  NORAD: 48274  │  LEO       │    │
│  │  📡 NOAA Satellites     │  Various       │  Polar     │    │
│  │  🌐 GPS Constellation   │  30+ active    │  MEO       │    │
│  │  ⭐ Starlink Fleet      │  5000+ active  │  LEO       │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Data Source: CelesTrak TLE (Two-Line Element)                  │
│  Update: Real-time position propagation                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4. 🌊 DISASTER & CRISIS MONITORING

Multi-source disaster intelligence aggregation.

| Source | Type | Latency | Coverage |
|--------|------|---------|----------|
| **USGS** | Earthquakes | Real-time | Global |
| **NASA EONET** | Wildfires, Floods, Storms | ~15 min | Global |
| **GDACS** | Alerts & Warnings | Real-time | Global |
| **GDACS** | Tsunami Warnings | Real-time | Oceanic |

```
┌─────────────────────────────────────────────────────────────────┐
│              DISASTER CLASSIFICATION MATRIX                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Severity Levels:                                                │
│  ┌──────────┬──────────┬──────────┬──────────┐                 │
│  │ 🔴 RED   │ 🟠 ORANGE│ 🟡 YELLOW│ 🟢 GREEN │                 │
│  │ Critical │  High    │ Moderate │   Low    │                 │
│  └──────────┴──────────┴──────────┴──────────┘                 │
│                                                                  │
│  Event Types:                                                    │
│  • Earthquake (Magnitude, Depth, Tsunami Risk)                  │
│  • Wildfire (Area, Direction, Containment)                      │
│  • Flood (Severity, Affected Population)                        │
│  • Severe Weather (Wind, Hail, Tornado)                         │
│  • Volcanic Activity (Ash, Lava Flow)                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5. 💰 ECONOMIC WARFARE MONITOR

Financial intelligence for economic threat detection.

```
┌─────────────────────────────────────────────────────────────────┐
│              ECONOMIC INTELLIGENCE DASHBOARD                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Cryptocurrency Tracking:                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │   BTC    │ │   ETH    │ │   BNB    │ │   SOL    │          │
│  │  Price   │ │  Price   │ │  Price   │ │  Price   │          │
│  │  24h Δ   │ │  24h Δ   │ │  24h Δ   │ │  24h Δ   │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                                  │
│  Fiat Currency Monitoring:                                       │
│  • USD Index (DXY)                                              │
│  • Major Pairs (EUR/USD, GBP/USD, USD/JPY)                      │
│  • Emerging Markets (CNY, RUB, BRL)                             │
│                                                                  │
│  Market Indicators:                                              │
│  • Fear & Greed Index                                           │
│  • Volatility (VIX)                                             │
│  • Liquidity Metrics                                            │
│                                                                  │
│  Data Source: CoinGecko API (free tier)                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6. 📺 LIVE INTELLIGENCE FEED

Real-time news and broadcast monitoring.

```
┌─────────────────────────────────────────────────────────────────┐
│              LIVE INTELLIGENCE SOURCES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Video Streams:                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  📺 Bloomberg TV    │  📺 CNN International          │    │
│  │  📺 BBC World News  │  📺 Al Jazeera English         │    │
│  │  📺 CNBC            │  📺 Reuters                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  News Feeds:                                                     │
│  • RSS Aggregation (multi-source)                               │
│  • Twitter/X Intelligence                                       │
│  • Telegram Channels                                            │
│  • Reddit Monitoring                                            │
│                                                                  │
│  Alert System:                                                   │
│  • BREAKING: Critical events                                    │
│  • WARNING: Elevated threats                                    │
│  • ADVISORY: General updates                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7. 🌬️ GOOGLE EARTH AI INTEGRATION

Environmental and atmospheric intelligence.

```
┌─────────────────────────────────────────────────────────────────┐
│              ENVIRONMENTAL INTELLIGENCE LAYERS                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Air Quality Index (AQI):                                        │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐      │
│  │ 🟢 Good  │ 🟡 Mod   │ 🟠 Unhealthy│ 🔴 Hazardous│ 🟣 Emergency│
│  │  0-50    │  51-100  │  101-150    │  151-200    │  201+       │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘      │
│                                                                  │
│  Solar Potential:                                                │
│  • Max Array Panels                                              │
│  • Sunshine Hours/Year                                           │
│  • Carbon Offset Factor                                          │
│                                                                  │
│  Pollen Levels:                                                  │
│  • Tree Pollen Index                                             │
│  • Grass Pollen Index                                            │
│  • Weed Pollen Index                                             │
│                                                                  │
│  API: Google Air Quality, Solar, Pollen APIs                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 8. 🚦 TRAFFIC SURVEILLANCE (AUSTIN, TX)

Urban mobility intelligence for critical infrastructure monitoring.

```
┌─────────────────────────────────────────────────────────────────┐
│              TRAFFIC INTELLIGENCE NETWORK                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Camera Network:                                                 │
│  • 12+ Traffic Cameras (I-35, Mopac, US-183)                    │
│  • Real-time image feed (HTTPS proxied)                         │
│  • Status monitoring (online/offline)                           │
│                                                                  │
│  Incident Reporting:                                             │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Type          │ Severity │ Status    │ Location      │    │
│  ├────────────────┼──────────┼───────────┼───────────────┤    │
│  │ Accident       │ Severe   │ Active    │ I-35 NB       │    │
│  │ Construction   │ Moderate │ Active    │ Mopac SB      │    │
│  │ Stalled Vehicle│ Minor    │ Active    │ US-183 NB     │    │
│  │ Debris         │ Moderate │ Active    │ I-35 SB       │    │
│  └────────────────┴──────────┴───────────┴───────────────┘    │
│                                                                  │
│  Data Source: Austin Mobility Open Data (Socrata)               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔌 DATA SOURCES & APIs

### Complete API Inventory

| Service | Endpoint | Auth | Rate Limit | Status |
|---------|----------|------|------------|--------|
| **ADS-B Aircraft** | `api.adsb.lol/v2/lat/{lat}/lon/{lon}/dist/{radius}` | ❌ None | 100 req/min | ✅ Active |
| **OpenSky Network** | `opensky-network.org/api/states/all` | ❌ Anonymous | 4000/day | ⚠️ Limited |
| **USGS Earthquakes** | `earthquake.usgs.gov/fdsnws/event/1/query` | ❌ None | Unlimited | ✅ Active |
| **NASA EONET** | `eonet.gsfc.nasa.gov/api/v3/events` | ❌ None | Unlimited | ✅ Active |
| **GDACS Alerts** | `gdacs.org/xml/rss.xml` | ❌ None | Unlimited | ✅ Active |
| **CelesTrak** | `celestrak.org/NORAD/elements/gp.php` | ❌ None | Unlimited | ✅ Active |
| **CoinGecko** | `api.coingecko.com/api/v3` | ❌ Free tier | 10-30 calls/min | ✅ Active |
| **Google Earth** | `mt1.google.com/vt/lyrs=s` | ✅ API Key | 100k req/day | ✅ Active |
| **Google Air Quality** | `airquality.googleapis.com/v1` | ✅ API Key | 10k req/day | ✅ Active |
| **Austin Traffic** | `data.austintexas.gov/resource/b4k4-adkb.json` | ❌ None | 1000/hour | ✅ Active |
| **Austin Incidents** | `data.austintexas.gov/resource/dx9v-zd7x.json` | ❌ None | 1000/hour | ✅ Active |

### API Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    REQUEST HANDLER                       │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │   │
│  │  │  Retry  │  │ Timeout │  │  Cache  │  │  Rate   │    │   │
│  │  │  Logic  │  │  (3s)   │  │  (30s)  │  │  Limit  │    │   │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘    │   │
│  │       └─────────────┴─────────────┴─────────────┘        │   │
│  └───────────────────────────┬───────────────────────────────┘   │
│                              │                                    │
│  ┌───────────────────────────┴───────────────────────────────┐   │
│  │                    FALLBACK SYSTEM                         │   │
│  │  Primary API Fail ──▶ Secondary API ──▶ Mock Data        │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠 TECHNICAL STACK

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    TECHNOLOGY STACK                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Core Framework:                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  React 18.2        │  Component-based UI               │    │
│  │  TypeScript 5.0    │  Type-safe development            │    │
│  │  Vite 5.0          │  Fast build & HMR                 │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Styling & UI:                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Tailwind CSS 3.4  │  Utility-first styling            │    │
│  │  shadcn/ui         │  Accessible components            │    │
│  │  Lucide React      │  Icon library                     │    │
│  │  CSS Animations    │  Smooth transitions               │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  State Management:                                               │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Zustand 4.4       │  Global state store               │    │
│  │  TanStack Query    │  Server state & caching           │    │
│  │  Persist Middleware│  Local storage persistence        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Mapping & Visualization:                                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Leaflet 1.9       │  Interactive maps                 │    │
│  │  React-Leaflet     │  React integration                │    │
│  │  Google Maps Tiles │  Satellite imagery                │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Data Fetching:                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  TanStack Query    │  Async data management            │    │
│  │  Native Fetch      │  HTTP requests                    │    │
│  │  AbortController   │  Request cancellation             │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Development Tools

| Category | Tool | Purpose |
|----------|------|---------|
| **Build** | Vite | Fast bundling & HMR |
| **Linting** | ESLint | Code quality |
| **Formatting** | Prettier | Consistent style |
| **Types** | TypeScript | Type safety |
| **Testing** | Vitest | Unit testing |
| **CI/CD** | GitHub Actions | Automated deployment |

---

## 🚀 INSTALLATION & DEPLOYMENT

### Prerequisites

```bash
# Required
Node.js >= 18.0.0
npm >= 9.0.0

# Optional (for development)
Git >= 2.30.0
VS Code (recommended)
```

### Quick Start

```bash
# Clone the repository
git clone https://github.com/clawchan/agency-dashboard.git
cd agency-dashboard

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

```bash
# Google APIs (required for satellite & Earth AI features)
VITE_GOOGLE_API_KEY=your_google_api_key_here

# Optional: Analytics
VITE_ANALYTICS_ID=your_analytics_id

# Optional: Error Tracking
VITE_SENTRY_DSN=your_sentry_dsn
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run with Docker
docker build -t clawchan-dashboard .
docker run -p 8080:80 clawchan-dashboard
```

### Cloud Deployment

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

---

## ⚙️ CONFIGURATION

### Layer Configuration

```typescript
// Default layer visibility
const defaultLayers = {
  // Intelligence Layers
  intelHotspots: true,
  conflictZones: true,
  militaryBases: true,
  nuclearSites: false,
  
  // Infrastructure
  underseaCables: false,
  pipelines: false,
  aiDataCenters: false,
  
  // Monitoring
  militaryActivity: true,
  shipTraffic: true,
  earthquakes: true,
  disasters: true,
  
  // Earth AI
  airQuality: false,
  solarPotential: false,
  pollenLevels: false,
  
  // Tracking
  aircraft: false,
  satellites: false,
  trafficCameras: false,
  trafficIncidents: false,
};
```

### Update Intervals

| Module | Interval | Reason |
|--------|----------|--------|
| Aircraft | 2 seconds | Smooth movement |
| Satellites | 10 seconds | Orbital propagation |
| Earthquakes | 30 seconds | USGS feed update |
| Disasters | 60 seconds | EONET refresh |
| Crypto | 30 seconds | Market volatility |
| Traffic | 30 seconds | Camera refresh |

---

## 📸 SCREENSHOTS

### Main Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CLAWCHAN INTELLIGENCE AGENCY          [LIVE] 🔴    DEFCON: 5    [⚙] [👤]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐  ┌─────────────────────────────────────────────────────┐  │
│  │ ☰ LAYERS     │  │                                                     │  │
│  │              │  │           🛰️ SATELLITE VIEW                         │  │
│  │ ☑ Conflict   │  │                                                     │  │
│  │ ☑ Military   │  │     ✈️                    ✈️                        │  │
│  │ ☐ Nuclear    │  │          ✈️        🛰️                               │  │
│  │ ☑ Earthquake │  │               ✈️                                    │  │
│  │ ☑ Aircraft   │  │     🌊                                              │  │
│  │              │  │                                                     │  │
│  │ ──────────── │  │  [ZOOM: 18] [BUILDING] [SATELLITE↔HYBRID]          │  │
│  │ GOOGLE EARTH │  │                                                     │  │
│  │ ☐ Air Quality│  └─────────────────────────────────────────────────────┘  │
│  │ ☐ Solar      │                                                          │  │
│  │ └──────────────┘  ┌──────────────┬──────────────┬──────────────┐          │
│                    │ 📺 LIVE NEWS │ 🤖 AI INSIGHT│ 🎯 STRATEGIC │          │
│                    │   & TV       │              │   POSTURE    │          │
│                    │              │              │              │          │
│                    │ [Bloomberg]  │ Threat: 73%  │ USA: HIGH    │          │
│                    │ [CNN]        │ Risk: MEDIUM │ RUS: CRIT    │          │
│                    │ [BBC]        │              │ CHN: ELEV    │          │
│                    └──────────────┴──────────────┴──────────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Intelligence Modules & Global Tracking

<p align="center">
  <img src="img1 (1).jpeg" width="49%" alt="Intelligence Module View" />
  <img src="img1 (3).jpeg" width="49%" alt="Global Tracking Interface" />
</p>

### Aircraft Tracking Detail

```
┌─────────────────────────────────────────────────────────────┐
│  ✈ UAL247                                                    │
│  ─────────────────────────────────────────────────────────  │
│  ICAO: A1B2C3    │  Squawk: 7421                            │
│  Altitude: 35,000 ft                                        │
│  Speed: 487 kts  │  Heading: 247°                           │
│  V/S: +1,200 fpm │  Last: 2s ago                            │
└─────────────────────────────────────────────────────────────┘
```


---

## 🔒 SECURITY & COMPLIANCE

### Data Handling

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY POSTURE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ All API requests use HTTPS                                  │
│  ✅ No sensitive data stored client-side                        │
│  ✅ API keys in environment variables                           │
│  ✅ CORS-compliant data fetching                                │
│  ✅ No user tracking or analytics (optional)                    │
│                                                                  │
│  Data Retention:                                                 │
│  • Cache: 30 seconds                                            │
│  • Local Storage: Layer preferences only                        │
│  • No PII collected                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Compliance

- **GDPR**: No personal data collection
- **CCPA**: No tracking cookies (optional)
- **MIT License**: Open source

---

## 🤝 CONTRIBUTING

### Development Workflow

```bash
# Fork and clone
git clone https://github.com/yourusername/agency-dashboard.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m "feat: add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: 2-space indentation
- **Commits**: Conventional commits

### Reporting Issues

1. Check existing issues first
2. Use issue templates
3. Include reproduction steps
4. Attach screenshots if applicable

---

## 📝 CHANGELOG

### v2.0.0-ALPHA (Current)

- ✅ Complete UI redesign (CIA/Pentagon inspired)
- ✅ Google Earth satellite integration
- ✅ ADS-B aircraft tracking (real-time)
- ✅ Satellite orbital tracking
- ✅ Multi-source disaster monitoring
- ✅ Economic warfare dashboard
- ✅ Live TV news integration
- ✅ Traffic surveillance (Austin)
- ✅ Google Earth AI (Air Quality, Solar, Pollen)

### v1.0.0 (Legacy)

- Initial release with basic map
- Mock data visualization
- Static news feed

---

## 🙏 ACKNOWLEDGMENTS

### Data Providers

| Organization | Contribution |
|--------------|--------------|
| **USGS** | Earthquake data |
| **NASA** | EONET disaster feed |
| **GDACS** | Global disaster alerts |
| **OpenSky Network** | ADS-B aircraft data |
| **CelesTrak** | Satellite TLE data |
| **CoinGecko** | Cryptocurrency prices |
| **Google** | Maps & Earth AI APIs |
| **Austin Mobility** | Traffic camera data |

### Open Source

- React Team (Meta)
- Leaflet Contributors
- TanStack Team
- Vite Team
- Tailwind Labs

---

## 📜 LICENSE

```
MIT License

Copyright (c) 2024 Clawchan Intelligence Agency

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%">

### 🦅 CLAWCHAN INTELLIGENCE AGENCY

**"The owl sees all, the claw strikes true"**

<p>
  <a href="https://clawchan.io">Website</a> •
  <a href="https://docs.clawchan.io">Documentation</a> •
  <a href="https://twitter.com/clawchan">Twitter</a> •
  <a href="https://discord.gg/clawchan">Discord</a>
</p>

<img src="https://img.shields.io/badge/CLASSIFIED-TOP%20SECRET-red?style=for-the-badge" />

</div>
