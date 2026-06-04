"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, FileBarChart2, Download, Play, Trash2, Calendar } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/shared/Button";
import { Modal, ModalFooter } from "@/components/shared/Modal";
import { Input, Select } from "@/components/shared/Input";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Report, ReportDownload } from "@/types";
import { formatDate, formatBytes, formatRelativeTime } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  dashboardService
}
  from "@/services/dashboard.service";
import { reportService } from "@/services/report.service";

export default function ReportsPage() {
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] =
    useState({

      dashboard: "",

      frequency:
        "DAILY",

      recipient_email:
        "",
    });
  const [submitting, setSubmitting] = useState(false);

  const {
    data: reports = [],
    isLoading,
    refetch,
  } = useQuery({

    queryKey: [
      "reports"
    ],

    queryFn:
      async () => {

        return (
          await reportService
            .getReports()
        );
      },
  });
  const {
    data: dashboards = [],
  } = useQuery({
    queryKey: [
      "dashboards-list"
    ],
    queryFn:
      dashboardService
        .getDashboards,
  });
  const {
    data:
    downloads = [],
  } = useQuery({

    queryKey: [
      "report-downloads"
    ],

    queryFn:
      async () => {

        return (
          await reportService
            .getDownloadHistory()
        );
      },
  });
  const handleCreate =
    async () => {

      if (
        !form.dashboard
      ) {

        toast.error(
          "Please select a dashboard"
        );

        return;
      }

      setSubmitting(
        true
      );

      try {

        const payload = {
          dashboard:
            parseInt(
              form.dashboard,
              10
            ),

          frequency:
            form.frequency,

          recipient_email:
            form.recipient_email,
        };

        console.log(
          "payload",
          payload
        );

        await reportService
          .createReport(
            payload
          );

        toast.success(
          "Report scheduled successfully"
        );

        setCreateModal(
          false
        );

        refetch();

      } catch (
      error
      ) {

        console.error(
          error
        );

        toast.error(
          "Failed to create report"
        );

      } finally {

        setSubmitting(
          false
        );
      }
    };

  const downloadColumns: Column<ReportDownload>[] = [
    {
      key: "report_name",
      header: "Report",
      render: (val) => (
        <div className="flex items-center gap-2">
          <FileBarChart2 size={13} className="text-muted-foreground shrink-0" />
          <span className="font-medium text-foreground text-sm">{String(val)}</span>
        </div>
      ),
    },
    {
      key: "generated_at",
      header: "Generated",
      sortable: true,
      render: (val) => <span className="text-xs text-muted-foreground">{formatRelativeTime(String(val))}</span>,
    },
    {
      key: "format",
      header: "Format",
      render: (val) => (
        <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-muted text-muted-foreground uppercase border border-border">
          {String(val)}
        </span>
      ),
    },
    {
      key: "size",
      header: "Size",
      render: (val) => <span className="text-xs text-muted-foreground">{formatBytes(Number(val))}</span>,
    },
    {
      key: "download_url",
      header: "",
      render: (_, row: ReportDownload) => (
        <a
          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${row.download_url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
        >
          <Download size={11} />
          Download
        </a>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl font-bold text-foreground">Reports</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Schedule automated reports delivered to your inbox
            </p>
          </motion.div>
          <Button size="sm" leftIcon={<Plus size={13} />} onClick={() => setCreateModal(true)}>
            Create Report
          </Button>
        </div>

        {/* Report Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-3">
                <div className="skeleton h-4 w-36 rounded" />
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-3 w-24 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {reports.map((report: Report, i: number) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileBarChart2 size={14} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{report.name}</h3>
                      <p className="text-xs text-muted-foreground">{report.dashboard_name}</p>
                    </div>
                  </div>
                  <StatusBadge status={report.status} />
                </div>

                {report.description && (
                  <p className="text-xs text-muted-foreground mb-3">{report.description}</p>
                )}

                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={11} />
                    <span className="capitalize">{report.frequency}</span>
                    {report.next_run && (
                      <span className="ml-1">· Next: {formatDate(report.next_run, "MMM d")}</span>
                    )}
                  </div>
                  <div>📧 {report.recipient_email}</div>
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-muted border border-border uppercase">
                      {report.format}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                    onClick={async () => {
                      await reportService
                        .runReport(
                          report.id
                        );
                      toast.success("Report started");
                      setTimeout(() => {

                        refetch();

                      }, 2000);
                    }}
                  >
                    <Play size={11} /> Run now
                  </button>
                  <button
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto"
                    onClick={async () => {
                      await reportService
                        .deleteReport(
                          report.id
                        );
                      toast.success("Deleted");
                      refetch();
                    }}
                  >
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Download History */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Download History</h2>
          <DataTable
            data={downloads as unknown as Record<string, unknown>[]}
            columns={downloadColumns as unknown as Column<Record<string, unknown>>[]}
            rowKey={(row) => String(row.id)}
            emptyState={
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">No downloads yet</p>
              </div>
            }
          />
        </div>
      </div>

      {/* Create Report Modal */}
      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Create Report"
        description="Schedule automated report delivery" size="lg">
        <div className="space-y-4">

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Dashboard
            </label>

            <select
              value={
                form.dashboard
              }
              onChange={(e) => {
                setForm(
                  (prev) => ({
                    ...prev,
                    dashboard:
                      e.target.value,
                  })
                );
              }}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
            >
              <option value="">
                Select Dashboard
              </option>

              {dashboards.map(
                (d: any) => (
                  <option
                    key={d.id}
                    value={d.id}
                  >
                    {d.name}
                  </option>
                )
              )}
            </select>
          </div>

          <Select
            label="Frequency"
            value={form.frequency}
            onChange={(e) =>
              setForm({
                ...form,
                frequency:
                  e.target.value
              })
            }
            options={[
              {
                value:
                  "DAILY",

                label:
                  "Daily",
              },
              {
                value:
                  "WEEKLY",

                label:
                  "Weekly",
              },
              {
                value:
                  "MONTHLY",

                label:
                  "Monthly",
              },
            ]}
          />

          <Input
            label="Recipient Email"
            type="email"
            placeholder="reports@company.com"
            value={
              form.recipient_email
            }
            onChange={(e) =>
              setForm({
                ...form,
                recipient_email:
                  e.target.value
              })
            }
          />

        </div>
        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setCreateModal(false)}>Cancel</Button>
          <Button size="sm" loading={submitting} onClick={handleCreate}>Schedule Report</Button>
        </ModalFooter>
      </Modal>
    </AppLayout>
  );
}
