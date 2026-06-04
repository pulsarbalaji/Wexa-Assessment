import { cn } from "@/lib/utils";

type BadgeVariant = "active" | "triggered" | "resolved" | "paused" | "scheduled" | "running" | "completed" | "failed" | "success" | "warning" | "error" | "info";

const VARIANTS: Record<BadgeVariant, string> = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  triggered: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  resolved: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  paused: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  scheduled: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  running: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  failed: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  warning: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  error: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
};

const DOTS: Record<BadgeVariant, string> = {
  active: "bg-emerald-500",
  triggered: "bg-red-500 animate-pulse",
  resolved: "bg-blue-500",
  paused: "bg-yellow-500",
  scheduled: "bg-purple-500",
  running: "bg-blue-500 animate-pulse",
  completed: "bg-emerald-500",
  failed: "bg-red-500",
  success: "bg-emerald-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

interface StatusBadgeProps {
  status: BadgeVariant;
  label?: string;
  dot?: boolean;
  size?: "sm" | "md";
}

export function StatusBadge({
  status,
  label,
  dot = true,
  size = "sm",
}: StatusBadgeProps) {
  const displayLabel =
  label ||
  (
    status || "unknown"
  )
    .charAt(0)
    .toUpperCase() +
  (
    status || "unknown"
  )
    .slice(1);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        VARIANTS[status]
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", DOTS[status])} />
      )}
      {displayLabel}
    </span>
  );
}
