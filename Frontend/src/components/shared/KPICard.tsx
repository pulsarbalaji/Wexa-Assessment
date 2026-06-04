"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { cn, formatNumber, formatPercentage } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
  loading?: boolean;
  prefix?: string;
  suffix?: string;
  index?: number;
}

export function KPICard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-primary",
  loading = false,
  prefix,
  suffix,
  index = 0,
}: KPICardProps) {
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton w-9 h-9 rounded-lg" />
        </div>
        <div className="skeleton h-8 w-28 rounded mb-2" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    );
  }

  const displayValue =
    typeof value === "number" ? formatNumber(value) : value;
  const isPositive = change !== undefined && change >= 0;
  const isNeutral = change === undefined || change === 0;

  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  const trendColor = isNeutral
    ? "text-muted-foreground"
    : isPositive
    ? "text-emerald-500"
    : "text-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors group"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110",
            "bg-primary/10"
          )}
        >
          <Icon size={16} className={iconColor} />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-foreground tracking-tight">
            {prefix}
            {displayValue}
            {suffix}
          </p>
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 mt-1.5", trendColor)}>
              <TrendIcon size={12} />
              <span className="text-xs font-medium">
                {formatPercentage(change)} vs last period
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
