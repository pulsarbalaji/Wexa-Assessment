"use client";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuthStore } from "@/stores/auth.store";
import { formatDate, getInitials } from "@/lib/utils";
import { Calendar, Mail, Shield, Building2 } from "lucide-react";
import { Button } from "@/components/shared/Button";
import Link from "next/link";

export default function ProfilePage() {
  const { user, currentOrg } = useAuthStore();

  const stats = [
    { label: "Dashboards created", value: "12" },
    { label: "Reports scheduled", value: "8" },
    { label: "Alerts configured", value: "5" },
    { label: "Events tracked", value: "284K" },
  ];

  return (
    <AppLayout>
      <div className="max-w-2xl space-y-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your account details and activity</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <div className="h-24 bg-gradient-to-r from-primary/20 via-violet-500/20 to-cyan-500/20" />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-8 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 border-4 border-card flex items-center justify-center text-primary text-xl font-bold shrink-0">
                {getInitials(user?.full_name || user?.username || "U")}
              </div>
              <div className="pb-1">
                <h2 className="text-base font-bold text-foreground">
                  {user?.full_name || user?.username}
                </h2>
                <p className="text-xs text-muted-foreground capitalize">{user?.role} · {currentOrg?.name}</p>
              </div>
              <div className="ml-auto pb-1">
                <Link href="/settings">
                  <Button variant="outline" size="sm">Edit profile</Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Mail size={13} className="shrink-0" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Building2 size={13} className="shrink-0" />
                <span>{currentOrg?.name}</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Shield size={13} className="shrink-0" />
                <span className="capitalize">{user?.role}</span>
              </div>
              {user?.created_at && (
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Calendar size={13} className="shrink-0" />
                  <span>Joined {formatDate(user.created_at)}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {stats.map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Plan */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">Current Plan</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-bold text-foreground capitalize">
                {currentOrg?.plan} Plan
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {currentOrg?.plan === "free" ? "5M events/month · 3 dashboards" :
                 currentOrg?.plan === "pro" ? "50M events/month · Unlimited dashboards" :
                 "Unlimited everything"}
              </p>
            </div>
            {currentOrg?.plan !== "enterprise" && (
              <Button size="sm">Upgrade plan</Button>
            )}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
