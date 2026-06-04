"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Upload, Download, Zap, Filter } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/shared/Button";
import { Modal, ModalFooter } from "@/components/shared/Modal";
import { Input, Select } from "@/components/shared/Input";
import { AnalyticsEvent } from "@/types";
import { formatDateTime, truncate } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import toast from "react-hot-toast";
import { eventService } from "@/services/event.service";

const SOURCES = ["web", "mobile", "api", "sdk", "webhook"];
const PAGE_SIZE = 10;

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ event_name: "", source: "web", event_data: "{}" });
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const {
    data,
    isLoading,
    refetch
  } = useQuery({

    queryKey: [
      "events",
      debouncedSearch,
      sourceFilter,
      page,
    ],

    queryFn:
      async () => {

        return eventService
          .getEvents({

            page,

            search:
              debouncedSearch,

            source:
              sourceFilter,
          });
      },
  });

  const columns: Column<AnalyticsEvent>[] = [
    {
      key: "event_name",
      header: "Event Name",
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0">
            <Zap size={11} className="text-primary" />
          </div>
          <span className="font-medium text-foreground">{String(val)}</span>
        </div>
      ),
    },
    {
      key: "source",
      header: "Source",
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground capitalize border border-border">
          {String(val)}
        </span>
      ),
    },
    {
      key: "timestamp",
      header: "Timestamp",
      sortable: true,
      render: (val) => (
        <span className="text-muted-foreground text-xs font-mono">
          {formatDateTime(String(val))}
        </span>
      ),
    },
    {
      key: "event_data",
      header: "Event Data",
      render: (val) => (
        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded max-w-xs block truncate">
          {truncate(JSON.stringify(val), 60)}
        </span>
      ),
    },
    {
      key: "user_id",
      header: "User ID",
      render: (val) => (
        <span className="text-xs text-muted-foreground">{val ? String(val) : "—"}</span>
      ),
    },
  ];

  const handleAddEvent =
    async () => {

      console.log(
        "starting"
      );

      setSubmitting(
        true
      );

      try {

        let parsedData =
          {};

        try {

          parsedData =
            JSON.parse(
              newEvent
                .event_data
            );

        } catch {

          toast.error(
            "Invalid JSON format"
          );

          setSubmitting(
            false
          );

          return;
        }

        console.log(
          "payload",
          {
            event_name:
              newEvent
                .event_name,

            source:
              newEvent
                .source,

            event_data:
              parsedData,
          }
        );

        await eventService
          .createEvent({

            event_name:
              newEvent
                .event_name,

            source:
              newEvent
                .source,

            event_data:
              parsedData,
          });

        toast.success(
          "Event created successfully"
        );

        setAddModal(
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
          "Failed to create event"
        );

      } finally {

        setSubmitting(
          false
        );
      }
    };

  const handleFileDrop =
    async (
      e: React.DragEvent
    ) => {

      e.preventDefault();

      setDragOver(
        false
      );

      const file =
        e.dataTransfer
          .files[0];

      if (
        !file ||
        !file.name.endsWith(
          ".csv"
        )
      ) {

        toast.error(
          "Please upload a CSV file"
        );

        return;
      }

      try {

        toast.loading(
          "Uploading CSV...",
          {
            id:
              "csv-upload"
          }
        );

        await eventService
          .uploadCSV(
            file
          );

        toast.success(
          "Events imported successfully",
          {
            id:
              "csv-upload"
          }
        );

        refetch();

        setUploadModal(
          false
        );

      } catch {

        toast.error(
          "CSV upload failed",
          {
            id:
              "csv-upload"
          }
        );
      }
    };

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl font-bold text-foreground">Events</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track and manage all incoming analytics events
            </p>
          </motion.div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leftIcon={<Download size={13} />}
              onClick={() => toast.success("Exporting CSV...")}>
              Export
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Upload size={13} />}
              onClick={() => setUploadModal(true)}>
              Upload CSV
            </Button>
            <Button size="sm" leftIcon={<Plus size={13} />}
              onClick={() => setAddModal(true)}>
              Add Event
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <select
              value={sourceFilter}
              onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
              className="w-full h-8 pl-8 pr-3 text-xs bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Sources</option>
              {SOURCES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          {(search || sourceFilter) && (
            <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setSourceFilter(""); setPage(1); }}>
              Clear filters
            </Button>
          )}
        </div>

        {/* Table */}
        <DataTable
          data={(data?.results || []) as unknown as Record<string, unknown>[]}
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          loading={isLoading}
          searchable
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          rowKey={(row) => String(row.id)}
          pagination={data ? {
            page,
            totalPages: data.total_pages,
            totalCount: data.count,
            pageSize: PAGE_SIZE,
            onPageChange: setPage,
          } : undefined}
          emptyState={
            <div className="text-center py-8">
              <Zap size={28} className="text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium text-foreground">No events found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          }
        />
      </div>

      {/* Add Event Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Event"
        description="Manually create a new analytics event">
        <div className="space-y-4">
          <Input
            label="Event Name"
            placeholder="e.g. page_view"
            value={newEvent.event_name}
            onChange={(e) => setNewEvent({ ...newEvent, event_name: e.target.value })}
            required
          />
          <Select
            label="Source"
            value={newEvent.source}
            onChange={(e) => setNewEvent({ ...newEvent, source: e.target.value })}
            options={SOURCES.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Event Data (JSON)</label>
            <textarea
              value={newEvent.event_data}
              onChange={(e) => setNewEvent({ ...newEvent, event_data: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 text-sm font-mono bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder='{"key": "value"}'
            />
          </div>
        </div>
        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setAddModal(false)}>Cancel</Button>
          <Button size="sm" loading={submitting} onClick={handleAddEvent}>Create Event</Button>
        </ModalFooter>
      </Modal>

      {/* Upload CSV Modal */}
      <Modal open={uploadModal} onClose={() => setUploadModal(false)} title="Upload CSV"
        description="Import events in bulk via CSV file">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleFileDrop}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          onClick={() => {

            const input =
              document.createElement(
                "input"
              );

            input.type =
              "file";

            input.accept =
              ".csv";

            input.onchange =
              async (e) => {

                const file =
                  (
                    e.target as
                    HTMLInputElement
                  ).files?.[0];

                if (!file)
                  return;

                try {

                  toast.loading(
                    "Uploading CSV...",
                    {
                      id:
                        "csv-upload"
                    }
                  );

                  await eventService
                    .uploadCSV(
                      file
                    );

                  toast.success(
                    "Events imported successfully",
                    {
                      id:
                        "csv-upload"
                    }
                  );

                  refetch();

                  setUploadModal(
                    false
                  );

                } catch {

                  toast.error(
                    "CSV upload failed",
                    {
                      id:
                        "csv-upload"
                    }
                  );
                }
              };

            input.click();
          }}
        >
          <Upload size={28} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">Drop your CSV here</p>
          <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
          <p className="text-xs text-muted-foreground mt-3 bg-muted px-3 py-1.5 rounded-lg inline-block">
            Required columns: event_name, source, timestamp, event_data
          </p>
        </div>
        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setUploadModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </AppLayout >
  );
}
