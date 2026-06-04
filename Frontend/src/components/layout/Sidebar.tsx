"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Zap, Bell, FileBarChart2, Settings,
  ChevronLeft, ChevronRight, Activity, ChevronDown, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useQuery } from "@tanstack/react-query";
import { MOCK_DASHBOARDS } from "@/lib/mock-data";
import { dashboardService } from "@/services/dashboard.service";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/events", icon: Zap, label: "Events" },
  { href: "/alerts", icon: Bell, label: "Alerts" },
  { href: "/reports", icon: FileBarChart2, label: "Reports" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { currentOrg } = useAuthStore();
  const { dashboards, setDashboards } = useDashboardStore();
  const [dashboardsExpanded, setDashboardsExpanded] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [dashboardName, setDashboardName] = useState("");
  const [dashboardDescription, setDashboardDescription] = useState("");

  useQuery({
    queryKey: [
      "dashboards-sidebar"
    ],

    queryFn:
      async () => {

        const response =
          await dashboardService
            .getDashboards();

        setDashboards(
          response
        );

        return response;
      },

    staleTime:
      Infinity,
  });
  const handleCreateDashboard =
    async () => {

      try {

        const dashboard =

          await dashboardService
            .createDashboard({

              name:
                dashboardName,

              description:
                dashboardDescription,
            });

        setDashboards([
          dashboard,
          ...dashboards
        ]);

        setCreateModal(
          false
        );

        setDashboardName(
          ""
        );

        setDashboardDescription(
          ""
        );

      } catch {

        alert(
          "Dashboard creation failed"
        );
      }
    };
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative flex flex-col h-full bg-sidebar border-r border-sidebar-border shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Activity className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <span className="font-semibold text-sidebar-foreground text-sm whitespace-nowrap tracking-tight">
                  Pulse Analytics
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Org badge */}
      {!collapsed && currentOrg && (
        <div className="px-3 py-2.5 border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-sidebar-accent cursor-pointer hover:bg-sidebar-accent/80 transition-colors">
            <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-primary">
                {
                  (
                    currentOrg?.name ||
                    "NA"
                  )
                    .slice(0, 2)
                    .toUpperCase()
                }
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{currentOrg?.name || "Organization"}</p>
              <p className="text-[10px] text-sidebar-foreground/50 capitalize">{
                currentOrg?.plan
                  ? `${currentOrg.plan} plan`
                  : "Free plan"
              }</p>
            </div>
            <ChevronDown size={12} className="text-sidebar-foreground/40 shrink-0" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-all duration-150 group relative",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon
                  size={16}
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
                  )}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover border border-border rounded-md text-xs font-medium text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}

        {/* Dashboards section */}
        {!collapsed && (
          <div className="pt-4">
            <button
              onClick={() => setDashboardsExpanded(!dashboardsExpanded)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider hover:text-sidebar-foreground/60 transition-colors"
            >
              <span>Dashboards</span>
              <ChevronDown size={12} className={cn("transition-transform", dashboardsExpanded ? "rotate-0" : "-rotate-90")} />
            </button>
            <AnimatePresence>
              {dashboardsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden space-y-0.5 mt-1"
                >
                  {dashboards.slice(0, 5).map((dashboard) => (
                    <Link key={dashboard.id} href={`/dashboard/${dashboard.id}`}>
                      <div className={cn(
                        "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-colors",
                        pathname === `/dashboard/${dashboard.id}`
                          ? "bg-sidebar-accent text-sidebar-foreground"
                          : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground/80"
                      )}>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                        <span className="truncate">{dashboard.name}</span>
                      </div>
                    </Link>
                  ))}
                  <button onClick={() =>
                    setCreateModal(
                      true
                    )
                  } className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-sidebar-foreground/40 hover:text-sidebar-foreground/70 transition-colors rounded-md hover:bg-sidebar-accent">
                    <Plus size={12} />
                    <span>New Dashboard</span>
                  </button>
                </motion.div>
              )}
              {createModal && (

                <div className="
    fixed
    inset-0
    bg-black/50
    flex
    items-center
    justify-center
    z-50
  ">

                  <div className="
      bg-background
      border
      border-border
      rounded-xl
      p-5
      w-[400px]
    ">

                    <h2 className="
        text-lg
        font-semibold
        mb-4
      ">
                      Create Dashboard
                    </h2>

                    <input
                      placeholder="Dashboard Name"
                      value={
                        dashboardName
                      }
                      onChange={(e) =>
                        setDashboardName(
                          e.target.value
                        )
                      }
                      className="
          w-full
          border
          rounded-lg
          px-3
          py-2
          mb-3
          bg-background
        "
                    />

                    <textarea
                      placeholder="Description"
                      value={
                        dashboardDescription
                      }
                      onChange={(e) =>
                        setDashboardDescription(
                          e.target.value
                        )
                      }
                      className="
          w-full
          border
          rounded-lg
          px-3
          py-2
          mb-4
          bg-background
        "
                    />

                    <div className="
        flex
        justify-end
        gap-2
      ">

                      <button
                        onClick={() =>
                          setCreateModal(
                            false
                          )
                        }
                      >
                        Cancel
                      </button>

                      <button
                        onClick={
                          handleCreateDashboard
                        }
                        className="
            bg-primary
            text-white
            px-4
            py-2
            rounded-lg
          "
                      >
                        Create
                      </button>

                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar-border border border-sidebar-border flex items-center justify-center hover:bg-sidebar-accent transition-colors z-10 shadow-sm"
      >
        {collapsed
          ? <ChevronRight size={12} className="text-sidebar-foreground/60" />
          : <ChevronLeft size={12} className="text-sidebar-foreground/60" />
        }
      </button>
    </motion.aside>
  );
}
