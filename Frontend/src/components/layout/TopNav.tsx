"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  LogOut,
  User,
  Settings,
  CircleDot,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useAlertStore } from "@/stores/alert.store";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

const ROUTE_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/events": "Events",
  "/alerts": "Alerts",
  "/reports": "Reports",
  "/settings": "Settings",
  "/profile": "Profile",
};

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const icons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };
  const Icon = icons[theme as keyof typeof icons] || Monitor;

  const cycle = () => {
    const order = ["light", "dark", "system"];
    const next = order[(order.indexOf(theme || "system") + 1) % order.length];
    setTheme(next);
  };

  return (
    <button
      onClick={cycle}
      className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      title={`Theme: ${theme}`}
    >
      <Icon size={15} />
    </button>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md hover:bg-muted transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
          {getInitials(user.full_name || user.username)}
        </div>
        <span className="text-sm font-medium text-foreground hidden sm:block max-w-[100px] truncate">
          {user.username}
        </span>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.12 }}
          className="absolute right-0 mt-1.5 w-52 bg-popover border border-border rounded-lg shadow-xl z-50 py-1.5 overflow-hidden"
        >
          <div className="px-3 py-2 border-b border-border mb-1">
            <p className="text-sm font-medium text-foreground truncate">
              {user.full_name || user.username}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <User size={14} className="text-muted-foreground" />
            Profile
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <Settings size={14} className="text-muted-foreground" />
            Settings
          </Link>
          <div className="border-t border-border mt-1 pt-1">
            <button
              onClick={() => { setOpen(false); logout(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface TopNavProps {
  wsConnected?: boolean;
}

export function TopNav({ wsConnected }: TopNavProps) {
  const pathname = usePathname();
  const { unreadCount, clearUnread } = useAlertStore();

  // Build breadcrumbs
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = ROUTE_LABELS[href] || seg.charAt(0).toUpperCase() + seg.slice(1);
    return { href, label };
  });

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30 shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm min-w-0">
        {breadcrumbs.map((crumb, i) => (
          <div key={crumb.href} className="flex items-center gap-1 min-w-0">
            {i > 0 && (
              <ChevronRight size={13} className="text-muted-foreground shrink-0" />
            )}
            {i === breadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground truncate">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground hover:text-foreground transition-colors truncate"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* WS status */}
        {wsConnected !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
              wsConnected
                ? "text-emerald-500 bg-emerald-500/10"
                : "text-muted-foreground bg-muted"
            )}
          >
            <CircleDot size={10} className={wsConnected ? "animate-pulse" : ""} />
            <span className="hidden sm:inline">{wsConnected ? "Live" : "Offline"}</span>
          </div>
        )}

        <button className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Search size={15} />
        </button>

        <ThemeToggle />

        {/* Notifications */}
        <button
          className="relative w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={clearUnread}
        >
          <Bell size={15} />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </button>

        <div className="w-px h-5 bg-border mx-1" />

        <UserMenu />
      </div>
    </header>
  );
}
