import {
  DashboardStats,
  EventTrendData,
  EventDistributionData,
  SourceAnalyticsData,
  AnalyticsEvent,
  Alert,
  Report,
  Dashboard,
  ReportDownload,
} from "@/types";
import { GRADIENT_COLORS } from "./utils";

// ─── Dashboard Stats ──────────────────────────────────────────
export const MOCK_STATS: DashboardStats = {
  total_events: 284_921,
  total_events_change: 12.4,
  total_purchases: 18_432,
  total_purchases_change: 8.1,
  active_alerts: 7,
  active_alerts_change: -2.3,
  reports_generated: 142,
  reports_generated_change: 24.6,
};

// ─── Event Trends ─────────────────────────────────────────────
const genTrends = (): EventTrendData[] => {
  const days = 30;
  const now = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      events: 6000 + Math.floor(Math.random() * 8000) + i * 100,
      purchases: 400 + Math.floor(Math.random() * 600),
      sessions: 2000 + Math.floor(Math.random() * 3000),
    };
  });
};
export const MOCK_EVENT_TRENDS: EventTrendData[] = genTrends();

// ─── Event Distribution ───────────────────────────────────────
export const MOCK_EVENT_DISTRIBUTION: EventDistributionData[] = [
  { source: "Web", count: 98432, percentage: 34.6 },
  { source: "Mobile", count: 74291, percentage: 26.1 },
  { source: "API", count: 52183, percentage: 18.3 },
  { source: "SDK", count: 34876, percentage: 12.3 },
  { source: "Webhook", count: 25139, percentage: 8.8 },
];

// ─── Source Analytics ─────────────────────────────────────────
export const MOCK_SOURCE_ANALYTICS: SourceAnalyticsData[] = [
  { name: "Organic", value: 82341, color: GRADIENT_COLORS[0] },
  { name: "Direct", value: 61298, color: GRADIENT_COLORS[1] },
  { name: "Referral", value: 48203, color: GRADIENT_COLORS[2] },
  { name: "Social", value: 37419, color: GRADIENT_COLORS[3] },
  { name: "Email", value: 29842, color: GRADIENT_COLORS[4] },
  { name: "Paid", value: 25818, color: GRADIENT_COLORS[5] },
];

// ─── Events ───────────────────────────────────────────────────
const SOURCES = ["web", "mobile", "api", "sdk", "webhook"];
const EVENT_NAMES = [
  "page_view", "button_click", "form_submit", "purchase", "signup",
  "login", "logout", "search", "add_to_cart", "checkout",
];

export const MOCK_EVENTS: AnalyticsEvent[] = Array.from({ length: 50 }, (_, i) => ({
  id: `evt_${i + 1}`,
  event_name: EVENT_NAMES[i % EVENT_NAMES.length],
  source: SOURCES[i % SOURCES.length],
  timestamp: new Date(Date.now() - i * 3600000 * Math.random() * 10).toISOString(),
  event_data: {
    page: `/${["home", "products", "checkout", "profile"][i % 4]}`,
    user_agent: "Mozilla/5.0",
    ip: `192.168.${(i % 255)}.${(i * 7) % 255}`,
  },
  user_id: `user_${(i % 20) + 1}`,
  session_id: `sess_${i}`,
  created_at: new Date(Date.now() - i * 3600000).toISOString(),
}));

// ─── Alerts ───────────────────────────────────────────────────
export const MOCK_ALERTS: Alert[] = [
  {
    id: "alert_1",
    name: "High Error Rate",
    description: "Triggers when error rate exceeds 5%",
    metric: "error_rate",
    condition: "greater_than",
    threshold: 5,
    time_window: 15,
    status: "triggered",
    notification_email: "ops@company.com",
    last_triggered: new Date(Date.now() - 3600000).toISOString(),
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "alert_2",
    name: "Low Event Volume",
    description: "Triggers when events drop below 1000/hour",
    metric: "event_count",
    condition: "less_than",
    threshold: 1000,
    time_window: 60,
    status: "active",
    notification_email: "analytics@company.com",
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "alert_3",
    name: "Revenue Spike",
    description: "Monitors for unusual revenue patterns",
    metric: "revenue",
    condition: "greater_than",
    threshold: 50000,
    time_window: 30,
    status: "resolved",
    notification_email: "finance@company.com",
    last_triggered: new Date(Date.now() - 2 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "alert_4",
    name: "API Latency",
    description: "P95 latency greater than 2000ms",
    metric: "latency",
    condition: "greater_than",
    threshold: 2000,
    time_window: 5,
    status: "active",
    notification_email: "engineering@company.com",
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "alert_5",
    name: "Purchase Drop",
    description: "Daily purchases below threshold",
    metric: "event_count",
    condition: "less_than",
    threshold: 100,
    time_window: 1440,
    status: "paused",
    notification_email: "sales@company.com",
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ─── Reports ──────────────────────────────────────────────────
export const MOCK_REPORTS: Report[] = [
  {
    id: "report_1",
    name: "Weekly Growth Report",
    description: "Overview of key growth metrics",
    frequency: "weekly",
    dashboard_id: "dash_1",
    dashboard_name: "Main Dashboard",
    recipient_email: "ceo@company.com",
    format: "pdf",
    status: "scheduled",
    next_run: new Date(Date.now() + 2 * 86400000).toISOString(),
    last_run: new Date(Date.now() - 7 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
  {
    id: "report_2",
    name: "Daily Event Summary",
    description: "Daily breakdown of all events",
    frequency: "daily",
    dashboard_id: "dash_2",
    dashboard_name: "Events Dashboard",
    recipient_email: "analytics@company.com",
    format: "csv",
    status: "completed",
    last_run: new Date(Date.now() - 86400000).toISOString(),
    next_run: new Date(Date.now() + 86400000).toISOString(),
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "report_3",
    name: "Monthly Executive Report",
    frequency: "monthly",
    dashboard_id: "dash_1",
    dashboard_name: "Main Dashboard",
    recipient_email: "board@company.com",
    format: "pdf",
    status: "running",
    created_at: new Date(Date.now() - 180 * 86400000).toISOString(),
  },
];

export const MOCK_REPORT_DOWNLOADS: ReportDownload[] = [
  {
    id: "dl_1",
    report_id: "report_1",
    report_name: "Weekly Growth Report",
    generated_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    format: "pdf",
    size: 245760,
    download_url: "#",
  },
  {
    id: "dl_2",
    report_id: "report_2",
    report_name: "Daily Event Summary",
    generated_at: new Date(Date.now() - 86400000).toISOString(),
    format: "csv",
    size: 102400,
    download_url: "#",
  },
  {
    id: "dl_3",
    report_id: "report_1",
    report_name: "Weekly Growth Report",
    generated_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    format: "pdf",
    size: 231424,
    download_url: "#",
  },
];

// ─── Dashboards ───────────────────────────────────────────────
export const MOCK_DASHBOARDS: Dashboard[] = [
  {
    id: "dash_1",
    name: "Main Dashboard",
    description: "Primary analytics overview",
    is_default: true,
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    widgets: [],
  },
  {
    id: "dash_2",
    name: "Events Dashboard",
    description: "Detailed event analytics",
    is_default: false,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    widgets: [],
  },
  {
    id: "dash_3",
    name: "Revenue Dashboard",
    description: "Purchase and revenue metrics",
    is_default: false,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    widgets: [],
  },
];
