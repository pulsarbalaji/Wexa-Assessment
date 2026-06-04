"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  emptyState?: React.ReactNode;
  rowKey?: (row: T) => string;
  onRowClick?: (row: T) => void;
  actions?: React.ReactNode;
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-4 rounded" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  pagination,
  searchable = false,
  searchValue = "",
  onSearchChange,
  emptyState,
  rowKey,
  onRowClick,
  actions,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey] as any;
    const bVal = b[sortKey] as any;
    const cmp =
      aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Toolbar */}
      {(searchable || actions) && (
        <div className="flex items-center justify-between gap-3 p-4 border-b border-border">
          {searchable && (
            <div className="relative max-w-xs w-full">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          )}
          {actions && <div className="flex items-center gap-2 ml-auto">{actions}</div>}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap",
                    col.sortable && "cursor-pointer hover:text-foreground transition-colors select-none",
                    col.width
                  )}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && sortKey === String(col.key) && (
                      sortDir === "asc"
                        ? <SortAsc size={12} />
                        : <SortDesc size={12} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <SkeletonRow key={i} cols={columns.length} />
              ))
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    {emptyState || (
                      <div>
                        <p className="text-muted-foreground text-sm">No data found</p>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <motion.tr
                  key={rowKey ? rowKey(row) : idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "group transition-colors",
                    onRowClick
                      ? "cursor-pointer hover:bg-muted/50"
                      : "hover:bg-muted/30"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="px-4 py-3 text-sm text-foreground"
                    >
                      {col.render
                        ? col.render(row[String(col.key) as keyof T], row)
                        : String(row[String(col.key) as keyof T] ?? "—")}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">
            Showing{" "}
            {Math.min(
              (pagination.page - 1) * pagination.pageSize + 1,
              pagination.totalCount
            )}
            –
            {Math.min(
              pagination.page * pagination.pageSize,
              pagination.totalCount
            )}{" "}
            of {pagination.totalCount} results
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page === 1}
              className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft size={14} />
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: Math.min(5, pagination.totalPages) }).map(
              (_, i) => {
                const page =
                  Math.max(
                    1,
                    Math.min(
                      pagination.page - 2,
                      pagination.totalPages - 4
                    )
                  ) + i;
                return (
                  <button
                    key={page}
                    onClick={() => pagination.onPageChange(page)}
                    className={cn(
                      "w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-colors",
                      page === pagination.page
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {page}
                  </button>
                );
              }
            )}

            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
            <button
              onClick={() =>
                pagination.onPageChange(pagination.totalPages)
              }
              disabled={pagination.page === pagination.totalPages}
              className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
