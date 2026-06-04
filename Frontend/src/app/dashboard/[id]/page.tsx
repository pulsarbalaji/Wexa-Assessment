"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { EventTrendChart, EventDistributionChart, ChartSkeleton } from "@/components/charts";
import { motion } from "framer-motion";
import { LayoutDashboard, Star } from "lucide-react";
import { dashboardService } from "@/services/dashboard.service";

export default function DashboardDetailPage() {
  const { id } = useParams();

  const {
    data:
    dashboard,
    isLoading
  } = useQuery({

    queryKey: [
      "dashboard",
      id
    ],

    queryFn:
      async () => {

        return (
          await dashboardService
            .getDashboardById(
              String(id)
            )
        );
      },

    enabled:
      !!id,
  });

  const {
    data:
    analytics,
    isLoading:
    analyticsLoading
  } = useQuery({

    queryKey: [
      "dashboard-analytics",
      id
    ],

    queryFn:
      async () => {

        return (
          await dashboardService
            .getDashboardAnalytics(
              String(id)
            )
        );
      },

    enabled:
      !!id,
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <LayoutDashboard size={16} className="text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                {isLoading ? (
                  <span className="skeleton h-5 w-40 rounded inline-block" />
                ) : (
                  dashboard?.name
                )}
              </h1>
              <p className="text-xs text-muted-foreground">
                {dashboard?.description || "Custom analytics dashboard"}
              </p>
            </div>
          </div>
          {dashboard?.is_default && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              <Star size={11} fill="currentColor" /> Default
            </span>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {analyticsLoading ? (
            <ChartSkeleton />
          ) : (
            <EventTrendChart
              data={
                (analytics?.trends || []).map((item: any) => ({
                  name: item.date,
                  events: item.count || 0,
                  purchases: 0,
                }))
              }
            />
          )}
          {analyticsLoading ? (
            <ChartSkeleton />
          ) : (
            <EventDistributionChart
              data={
                (analytics?.distribution || []).map((item: any) => ({
                  source: item.event_name,
                  value: item.value,
                }))
              }
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
