"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Bell, Trash2, Pause, Play, CheckCircle2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/shared/Button";
import { Modal, ModalFooter } from "@/components/shared/Modal";
import { Input, Select } from "@/components/shared/Input";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MOCK_ALERTS } from "@/lib/mock-data";
import { Alert, AlertStatus, CreateAlertData } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import toast from "react-hot-toast";
import { alertService } from "@/services/alert.service";

const METRIC_OPTIONS = [
  { value: "event_count", label: "Event Count" },
  { value: "error_rate", label: "Error Rate (%)" },
  { value: "latency", label: "Latency (ms)" },
  { value: "revenue", label: "Revenue ($)" },
];

const CONDITION_OPTIONS = [
  { value: "greater_than", label: "Greater than" },
  { value: "less_than", label: "Less than" },
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not equals" },
];

const TIME_WINDOW_OPTIONS = [
  { value: "5", label: "5 minutes" },
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "1440", label: "24 hours" },
];

const STATUS_COLORS:
  Record<string, string> = {

  ACTIVE:
    "border-l-emerald-500",

  TRIGGERED:
    "border-l-red-500",

  RESOLVED:
    "border-l-blue-500",

  MUTED:
    "border-l-yellow-500",
};

export default function AlertsPage() {
  const qc = useQueryClient();
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] =
    useState({
      name: "",
      event_name: "",
      threshold: 0,
      time_window: 60,
      email: "",
    });

  const {
    data: alerts = [],
    isLoading,
    refetch,
  } = useQuery({

    queryKey: [
      "alerts"
    ],

    queryFn:
      async () => {

        return (
          await alertService
            .getAlerts()
        );
      },
  });

  const createMutation =
    useMutation({

      mutationFn:
        async (data) => {

          return (
            await alertService
              .createAlert(
                data
              )
          );
        },

      onSuccess: () => {

        toast.success(
          "Alert created successfully"
        );

        setCreateModal(
          false
        );

        refetch();
      },

      onError: (
        error: any
      ) => {

        toast.error(
          error.response
            ?.data
            ?.detail
          ||
          "Alert creation failed"
        );
      }
    });

  const statusCounts = {

    active:
      alerts.filter(
        (a) =>
          a.status ===
          "ACTIVE"
      ).length,

    triggered:
      alerts.filter(
        (a) =>
          a.status ===
          "TRIGGERED"
      ).length,

    resolved:
      alerts.filter(
        (a) =>
          a.status ===
          "RESOLVED"
      ).length,

    muted:
      alerts.filter(
        (a) =>
          a.status ===
          "MUTED"
      ).length,
  };

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl font-bold text-foreground">Alerts</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Monitor thresholds and get notified when things go wrong
            </p>
          </motion.div>
          <Button size="sm" leftIcon={<Plus size={13} />} onClick={() => setCreateModal(true)}>
            Create Alert
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(statusCounts).map(([status, count]) => (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-4 text-center"
            >
              <p className="text-2xl font-bold text-foreground">{count}</p>
              <StatusBadge status={status as AlertStatus} />
            </motion.div>
          ))}
        </div>

        {/* Alert Cards */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="skeleton w-9 h-9 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-48 rounded" />
                    <div className="skeleton h-3 w-64 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`bg-card border border-border border-l-4 rounded-xl p-5 ${STATUS_COLORS[alert.status]}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <Bell size={15} className="text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground text-sm">{alert.name}</h3>
                        <StatusBadge status={alert.status} />
                      </div>
                      {alert.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{alert.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                        <span>
                          Event:
                          <span className="font-medium text-foreground ml-1">
                            {alert.event_name}
                          </span>
                        </span>

                        <span>
                          Threshold:
                          <span className="font-medium text-foreground ml-1">
                            {alert.threshold}
                          </span>
                        </span>

                        <span>
                          Window:
                          {alert.time_window >= 60
                            ? `${alert.time_window / 60}h`
                            : `${alert.time_window}m`}
                        </span>

                        <span>
                          📧 {alert.email}
                        </span>
                        {alert.last_triggered && (
                          <span>Last triggered: {formatRelativeTime(alert.last_triggered)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {alert.status === "active" && (
                      <button className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10 transition-colors" title="Pause">
                        <Pause size={13} />
                      </button>
                    )}
                    {alert.status === "paused" && (
                      <button className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors" title="Resume">
                        <Play size={13} />
                      </button>
                    )}
                    {alert.status === "triggered" && (
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                        title="Resolve"
                        onClick={() => toast.success("Alert resolved")}
                      >
                        <CheckCircle2 size={13} />
                      </button>
                    )}
                    <button
                      className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete"
                      onClick={() => toast.success("Alert deleted")}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Alert Modal */}
      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Create Alert"
        description="Configure a threshold alert with email notifications" size="lg">
        <div className="space-y-4">

          <Input
            label="Alert Name"
            placeholder="Purchase Alert"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name:
                  e.target.value
              })
            }
          />

          <Input
            label="Event Name"
            placeholder="purchase"
            value={form.event_name}
            onChange={(e) =>
              setForm({
                ...form,
                event_name:
                  e.target.value
              })
            }
          />

          <Input
            label="Threshold"
            type="number"
            value={
              form.threshold
            }
            onChange={(e) =>
              setForm({
                ...form,
                threshold:
                  Number(
                    e.target.value
                  )
              })
            }
          />

          <Select
            label="Time Window"
            value={String(
              form.time_window
            )}
            onChange={(e) =>
              setForm({
                ...form,
                time_window:
                  Number(
                    e.target.value
                  )
              })
            }
            options={[
              {
                value: "5",
                label:
                  "5 Minutes"
              },
              {
                value: "10",
                label:
                  "10 Minutes"
              },
              {
                value: "30",
                label:
                  "30 Minutes"
              },
              {
                value: "60",
                label:
                  "1 Hour"
              },
            ]}
          />

          <Input
            label="Email"
            type="email"
            placeholder="admin@test.com"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email:
                  e.target.value
              })
            }
          />

        </div>
        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setCreateModal(false)}>Cancel</Button>
          <Button size="sm" loading={createMutation.isPending} onClick={() => createMutation.mutate(form)}>
            Create Alert
          </Button>
        </ModalFooter>
      </Modal>
    </AppLayout>
  );
}
