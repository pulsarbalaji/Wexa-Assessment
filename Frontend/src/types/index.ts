// ============================================================
// AUTH TYPES
// ============================================================
export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar?: string;
  role: "admin" | "member" | "viewer";
  created_at: string;
  organization: Organization;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  plan: "free" | "pro" | "enterprise";
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface SignupData {
  company_name: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ============================================================
// DASHBOARD TYPES
// ============================================================
export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  widgets: Widget[];
}

export interface Widget {
  id: string;
  type: "line" | "bar" | "pie" | "kpi" | "table";
  title: string;
  config: Record<string, unknown>;
  position: { x: number; y: number; w: number; h: number };
}

export interface DashboardStats {
  total_events: number;
  total_events_change: number;
  total_purchases: number;
  total_purchases_change: number;
  active_alerts: number;
  active_alerts_change: number;
  reports_generated: number;
  reports_generated_change: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface EventTrendData {
  date: string;
  events: number;
  purchases: number;
  sessions: number;
}

export interface EventDistributionData {
  source: string;
  count: number;
  percentage: number;
}

export interface SourceAnalyticsData {
  name: string;
  value: number;
  color: string;
}

// ============================================================
// EVENT TYPES
// ============================================================
export interface AnalyticsEvent {
  id: string;
  event_name: string;
  source: string;
  timestamp: string;
  event_data: Record<string, unknown>;
  user_id?: string;
  session_id?: string;
  ip_address?: string;
  created_at: string;
}

export interface CreateEventData {
  event_name: string;
  source: string;
  event_data: Record<string, unknown>;
  timestamp?: string;
}

export interface EventFilter {
  search?: string;
  source?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}

// ============================================================
// ALERT TYPES
// ============================================================
export type AlertStatus = "active" | "triggered" | "resolved" | "paused";
export type AlertCondition = "greater_than" | "less_than" | "equals" | "not_equals";
export type AlertMetric = "event_count" | "error_rate" | "latency" | "revenue";

export interface Alert {
  id: string;
  name: string;
  description?: string;
  metric: AlertMetric;
  condition: AlertCondition;
  threshold: number;
  time_window: number;
  status: AlertStatus;
  notification_email: string;
  last_triggered?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAlertData {
  name: string;
  description?: string;
  metric: AlertMetric;
  condition: AlertCondition;
  threshold: number;
  time_window: number;
  notification_email: string;
}

// ============================================================
// REPORT TYPES
// ============================================================
export type ReportFrequency = "daily" | "weekly" | "monthly" | "once";
export type ReportStatus = "scheduled" | "running" | "completed" | "failed";
export type ReportFormat = "pdf" | "csv" | "excel";

export interface Report {
  id: string;
  name: string;
  description?: string;
  frequency: ReportFrequency;
  dashboard_id: string;
  dashboard_name?: string;
  recipient_email: string;
  format: ReportFormat;
  status: ReportStatus;
  next_run?: string;
  last_run?: string;
  created_at: string;
}

export interface CreateReportData {
  name: string;
  description?: string;
  frequency: ReportFrequency;
  dashboard_id: string;
  recipient_email: string;
  format: ReportFormat;
}

export interface ReportDownload {
  id: string;
  report_id: string;
  report_name: string;
  generated_at: string;
  format: ReportFormat;
  size: number;
  download_url: string;
}

// ============================================================
// API TYPES
// ============================================================
export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  current_page: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// ============================================================
// SETTINGS TYPES
// ============================================================
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  key_preview: string;
  created_at: string;
  last_used?: string;
  permissions: string[];
}

export interface OrganizationSettings {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  timezone: string;
  plan: string;
  max_events_per_month: number;
  current_events_count: number;
}

// ============================================================
// NOTIFICATION TYPES
// ============================================================
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  created_at: string;
  link?: string;
}

// ============================================================
// WEBSOCKET TYPES
// ============================================================
export interface WSMessage {
  type: "event" | "alert" | "stats_update" | "ping";
  payload: unknown;
  timestamp: string;
}
