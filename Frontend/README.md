# Pulse Analytics — Real-Time Analytics & Reporting Platform

A production-grade, enterprise-level SaaS analytics frontend built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **Zustand**, **TanStack Query**, **Recharts**, and **Framer Motion**.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with any email/password.

> **Demo Mode**: The app works fully without a backend. All data is mocked locally.

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js 15 App Router pages
│   ├── login/              # Public login page
│   ├── signup/             # Public signup page
│   ├── dashboard/          # Main dashboard + [id] dynamic route
│   ├── events/             # Events management
│   ├── alerts/             # Alert configuration
│   ├── reports/            # Report scheduling
│   ├── settings/           # Account settings (tabbed)
│   └── profile/            # User profile
│
├── components/
│   ├── layout/             # AppLayout, Sidebar, TopNav
│   ├── charts/             # Recharts wrappers (Area, Bar, Pie)
│   └── shared/             # Button, Input, Modal, DataTable, KPICard, etc.
│
├── services/               # API service layer (Axios)
│   ├── auth.service.ts
│   ├── dashboard.service.ts
│   ├── event.service.ts
│   ├── alert.service.ts
│   ├── report.service.ts
│   └── websocket.service.ts
│
├── stores/                 # Zustand state management
│   ├── auth.store.ts
│   ├── dashboard.store.ts
│   └── alert.store.ts
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useWebSocket.ts
│   └── useDebounce.ts
│
├── types/                  # TypeScript type definitions
├── lib/                    # Utilities, Axios instance, mock data
└── middleware.ts            # Route protection middleware
```

---

## 🏗️ Architecture

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 15 App Router | SSR, routing, middleware |
| Styling | Tailwind CSS + CSS Variables | Theming, dark mode |
| State | Zustand (persisted) | Auth, dashboard, alerts |
| Data Fetching | TanStack Query v5 | Caching, loading states |
| HTTP | Axios + interceptors | JWT auth, token refresh |
| Charts | Recharts | Area, Bar, Pie charts |
| Animation | Framer Motion | Page transitions, micro-interactions |
| Auth | JWT (access + refresh) | Auto-refresh, route protection |
| Realtime | WebSocket service | Live dashboard updates |

---

## 🔌 Connecting a Real Backend (Django REST Framework)

1. Update `NEXT_PUBLIC_API_BASE_URL` in `.env.local`:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   NEXT_PUBLIC_WS_BASE_URL=ws://localhost:8000/ws
   ```

2. Replace mock data calls in pages with real service calls:
   ```ts
   // Before (mock)
   queryFn: async () => { await delay(700); return MOCK_STATS; }

   // After (real API)
   queryFn: () => dashboardService.getStats()
   ```

3. Required DRF endpoints:
   - `POST /api/auth/login/` → `{ user, tokens: { access, refresh } }`
   - `POST /api/auth/signup/`
   - `POST /api/auth/token/refresh/`
   - `GET /api/auth/me/`
   - `GET/POST /api/dashboards/`
   - `GET /api/dashboards/stats/`
   - `GET /api/analytics/event-trends/`
   - `GET/POST /api/events/`
   - `GET/POST /api/alerts/`
   - `GET/POST /api/reports/`
   - `ws://localhost:8000/ws/dashboard/`

---

## ✨ Features

- ✅ JWT authentication with auto token refresh
- ✅ Protected routes via Next.js middleware
- ✅ Dark/Light/System theme toggle
- ✅ Collapsible sidebar with active states
- ✅ KPI cards with trend indicators
- ✅ Area, Bar, Pie charts (Recharts)
- ✅ Searchable, sortable, paginated data table
- ✅ Event management + CSV upload modal
- ✅ Alert creation with status badges
- ✅ Report scheduling + download history
- ✅ Settings: profile, org, API keys, security
- ✅ WebSocket service with auto-reconnect
- ✅ Toast notifications
- ✅ Loading skeletons throughout
- ✅ Fully responsive (mobile + tablet + desktop)
- ✅ TypeScript strict mode
- ✅ Zustand stores with persistence

---

## 🧰 Tech Stack

- **Next.js 15** (App Router)
- **TypeScript 5**
- **Tailwind CSS 3**
- **Zustand 5** (state management)
- **TanStack Query 5** (server state)
- **Axios** (HTTP client)
- **Recharts** (charts)
- **Framer Motion** (animations)
- **next-themes** (dark mode)
- **react-hot-toast** (notifications)
- **lucide-react** (icons)
- **date-fns** (date utilities)
