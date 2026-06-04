"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Zap, ShoppingCart, Bell, FileBarChart2,
  RefreshCw, Plus, Calendar
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { KPICard } from "@/components/shared/KPICard";
import {
  EventTrendChart,
  EventDistributionChart,
  SourceAnalyticsChart,
  ChartSkeleton,
} from "@/components/charts";
import { Button } from "@/components/shared/Button";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useAuthStore } from "@/stores/auth.store";
import { dashboardService } from "@/services/dashboard.service";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const setDashboards = useDashboardStore((s) => s.setDashboards);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats", refreshKey],
    queryFn: async () => {
      return dashboardService.getDashboardStats();
    },
  });

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ["event-trends", refreshKey],
    queryFn: async () => {
      return dashboardService.getEventTrends();
    },
  });

  const { data: distribution, isLoading: distLoading } = useQuery({
    queryKey: ["event-distribution", refreshKey],
    queryFn: async () => {
      return dashboardService.getEventDistribution();
    },
  });

  const { data: sources, isLoading: sourcesLoading } = useQuery({
    queryKey: ["source-analytics", refreshKey],
    queryFn: async () => {
      return dashboardService.getSourceAnalytics();
    },
  });

  const {
    data: dashboardsData
  } = useQuery({

    queryKey: [
      "dashboards-list"
    ],

    queryFn:
      dashboardService
        .getDashboards,
  });

  useEffect(() => {

    if (
      dashboardsData
    ) {

      setDashboards(
        dashboardsData
      );
    }

  }, [
    dashboardsData,
    setDashboards
  ]);

  const kpis = [
    {
      title: "Total Events",
      value: stats?.total_events ?? 0,
      change: stats?.total_events_change,
      icon: Zap,
      iconColor: "text-blue-500",
    },
    {
      title: "Total Purchases",
      value: stats?.total_purchases ?? 0,
      change: stats?.total_purchases_change,
      icon: ShoppingCart,
      iconColor: "text-violet-500",
    },
    {
      title: "Active Alerts",
      value: stats?.active_alerts ?? 0,
      change: stats?.active_alerts_change,
      icon: Bell,
      iconColor: "text-amber-500",
    },
    {
      title: "Reports Generated",
      value: stats?.reports_generated ?? 0,
      change: stats?.reports_generated_change,
      icon: FileBarChart2,
      iconColor: "text-emerald-500",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-xl font-bold text-foreground">
              Good morning, {user?.username || "User"}  👋
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <Calendar size={13} />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </motion.div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw size={13} />}
              onClick={() => setRefreshKey((k) => k + 1)}
            >
              Refresh
            </Button>
            <Button size="sm" leftIcon={<Plus size={13} />}>
              New Dashboard
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <KPICard
              key={kpi.title}
              {...kpi}
              loading={statsLoading}
              index={i}
            />
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {trendsLoading ? (
              <ChartSkeleton height={280} />
            ) : (
              <EventTrendChart
                data={
                  (trends || []).map(
                    (
                      item: any
                    ) => ({

                      name:
                        item.date,

                      events:
                        item.count || 0,

                      purchases:
                        0,
                    })
                  )
                }
              />
            )}
          </div>
          <div>
            {sourcesLoading ? (
              <ChartSkeleton height={280} />
            ) : (
              <SourceAnalyticsChart
                data={
                  (sources || []).map(
                    (
                      item: any
                    ) => ({
                      name:
                        item.source,

                      value:
                        item.value
                    })
                  )
                }
              />
            )}
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {distLoading ? (
            <ChartSkeleton height={280} />
          ) : (
            <EventDistributionChart
              data={
                (distribution || []).map(
                  (
                    item: any
                  ) => ({
                    source:
                      item.name,

                    value:
                      item.value
                  })
                )
              }
            />
          )}

          {/* Quick stats card */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Top Event Sources
            </h3>
            <div className="space-y-3">
              {(sources || []).map((item: any, i: number) => (
                <div key={`${item.source}-${i}`} >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-foreground font-medium">{item.source}</span>
                    <span className="text-muted-foreground">
                      {
                        Number(
                          item.percentage || 0
                        ).toFixed(1)
                      }%
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                      className="h-full rounded-full bg-primary"
                      style={{ opacity: 1 - i * 0.15 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
