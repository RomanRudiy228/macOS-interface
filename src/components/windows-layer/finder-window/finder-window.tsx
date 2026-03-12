"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  AppWindowMac,
  CircleArrowDown,
  FileText,
  Files,
  Folder,
  FolderOpen,
  History,
  List,
  Loader2,
  LayoutGrid,
  RectangleHorizontal,
  Search,
  X,
  Plus,
  Columns3,
  Share,
  Tag,
  Ellipsis,
  RotateCcw,
  Pencil,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type FinderSortBy = "name" | "size" | "modifiedAt" | "type";
type FinderSortOrder = "asc" | "desc";
type FinderViewMode = "list" | "icons";
type FinderSource = "user";

type FinderEntry = {
  name: string;
  relativePath: string;
  isDirectory: boolean;
  size: number;
  modifiedAt: string;
  type: string;
};

type FinderApiResponse = {
  currentPath: string;
  parentPath: string | null;
  entries: FinderEntry[];
};

const IMAGE_TYPES = new Set([
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "svg",
  "bmp",
  "ico",
]);

type SidebarItem = {
  label: string;
  path: string;
  Icon: LucideIcon;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function isImageEntry(entry: FinderEntry): boolean {
  return !entry.isDirectory && IMAGE_TYPES.has(entry.type.toLowerCase());
}

function getFilePreviewSrc(relativePath: string, source: FinderSource): string {
  const params = new URLSearchParams({ path: relativePath, source });
  return `/api/finder/file?${params.toString()}`;
}

function isPreviewableTextContentType(contentType: string): boolean {
  return (
    contentType.startsWith("text/") ||
    contentType.includes("json") ||
    contentType.includes("javascript") ||
    contentType.includes("typescript") ||
    contentType.includes("xml")
  );
}

function isCsvContentType(contentType: string): boolean {
  return (
    contentType.includes("text/csv") || contentType.includes("application/csv")
  );
}

function parseCsvRows(content: string): string[][] {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(",").map((cell) => cell.trim()));
}

const FinderFolderGlyph: React.FC<{ size?: number }> = ({ size = 56 }) => {
  const tabHeight = Math.round(size * 0.2);
  const bodyHeight = Math.round(size * 0.72);

  return (
    <span
      className="relative block"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className="absolute left-[12%] top-[7%] rounded-t-md"
        style={{
          width: size * 0.45,
          height: tabHeight,
          background:
            "linear-gradient(180deg, rgba(170,228,255,1) 0%, rgba(119,197,255,1) 100%)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.45) inset",
        }}
      />
      <span
        className="absolute bottom-[8%] left-0 right-0 rounded-[12px]"
        style={{
          height: bodyHeight,
          background:
            "linear-gradient(180deg, rgba(149,219,255,1) 0%, rgba(77,166,252,1) 58%, rgba(45,130,241,1) 100%)",
          boxShadow:
            "0 9px 14px rgba(8, 64, 128, 0.35), 0 1px 0 rgba(255,255,255,0.45) inset",
        }}
      />
    </span>
  );
};

export const FinderWindow: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const source: FinderSource = "user";
  const [viewMode, setViewMode] = useState<FinderViewMode>("icons");
  const [sortBy] = useState<FinderSortBy>("name");
  const [sortOrder] = useState<FinderSortOrder>("asc");
  const [currentPath, setCurrentPath] = useState("");
  const [parentPath, setParentPath] = useState<string | null>(null);
  const [entries, setEntries] = useState<FinderEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openedFile, setOpenedFile] = useState<FinderEntry | null>(null);
  const [openedFileContentType, setOpenedFileContentType] = useState("");
  const [openedFileText, setOpenedFileText] = useState<string | null>(null);
  const [isOpeningFile, setIsOpeningFile] = useState(false);
  const [openFileError, setOpenFileError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([""]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const navigateToPath = (nextPath: string, fromHistory = false) => {
    setSelectedPath(null);
    setOpenedFile(null);
    setCurrentPath(nextPath);

    if (fromHistory) return;

    const base = history.slice(0, historyIndex + 1);
    if (base[base.length - 1] === nextPath) return;
    const nextHistory = [...base, nextPath];
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      sortBy,
      sortOrder,
      source,
    });
    if (currentPath) {
      params.set("path", currentPath);
    }

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/finder/files?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = (await response.json()) as FinderApiResponse;
        setCurrentPath(payload.currentPath);
        setParentPath(payload.parentPath);
        setEntries(payload.entries);
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load directory.";
        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => controller.abort();
  }, [currentPath, sortBy, sortOrder, source]);

  const breadcrumbSegments = useMemo(
    () => currentPath.split("/").filter(Boolean),
    [currentPath]
  );
  const currentFolderName =
    breadcrumbSegments[breadcrumbSegments.length - 1] ?? "My files";

  const filteredEntries = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return entries;
    return entries.filter((entry) => entry.name.toLowerCase().includes(query));
  }, [entries, searchTerm]);

  const sidebarItems: SidebarItem[] = [
    { label: "Recents", path: "", Icon: History },
    { label: "Applications", path: "Applications", Icon: AppWindowMac },
    { label: "Downloads", path: "Downloads", Icon: CircleArrowDown },
    { label: "Desktop", path: "Desktop", Icon: RectangleHorizontal },
    { label: "Projects", path: "Projects", Icon: FolderOpen },
    { label: "Documents", path: "Documents", Icon: Files },
  ];

  const openEntry = (entry: FinderEntry) => {
    if (!entry.isDirectory) return;
    navigateToPath(entry.relativePath);
  };

  const openFile = async (entry: FinderEntry) => {
    setOpenedFile(entry);
    setOpenedFileText(null);
    setOpenedFileContentType("");
    setOpenFileError(null);
    setIsOpeningFile(true);

    try {
      const response = await fetch(
        getFilePreviewSrc(entry.relativePath, source)
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = (
        response.headers.get("content-type") || ""
      ).toLowerCase();
      setOpenedFileContentType(contentType);

      if (isPreviewableTextContentType(contentType)) {
        const content = await response.text();
        const maxChars = 20000;
        setOpenedFileText(
          content.length > maxChars
            ? `${content.slice(0, maxChars)}\n\n... file preview truncated ...`
            : content
        );
      }
    } catch (fileError) {
      const message =
        fileError instanceof Error ? fileError.message : "Failed to open file.";
      setOpenFileError(message);
    } finally {
      setIsOpeningFile(false);
    }
  };

  const activateEntry = (entry: FinderEntry) => {
    if (entry.isDirectory) {
      openEntry(entry);
      return;
    }

    if (isImageEntry(entry)) {
      setSelectedPath(entry.relativePath);
      return;
    }

    void openFile(entry);
  };

  const openedFileCsvRows = useMemo(() => {
    if (!openedFileText || !isCsvContentType(openedFileContentType)) return [];
    return parseCsvRows(openedFileText);
  }, [openedFileText, openedFileContentType]);

  const openedFilePrettyText = useMemo(() => {
    if (!openedFileText) return null;
    if (openedFileContentType.includes("json")) {
      try {
        return JSON.stringify(JSON.parse(openedFileText), null, 2);
      } catch {
        return openedFileText;
      }
    }
    return openedFileText;
  }, [openedFileText, openedFileContentType]);

  useEffect(() => {
    if (!openedFile) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenedFile(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openedFile]);

  const selectedCount = selectedPath ? 1 : 0;
  const isDark = resolvedTheme === "dark";
  const selectedEntry =
    entries.find((entry) => entry.relativePath === selectedPath) ?? null;
  const previewImageEntry =
    selectedEntry && isImageEntry(selectedEntry) ? selectedEntry : null;
  const previewStripEntries = filteredEntries.filter(isImageEntry).slice(0, 8);

  return (
    <section
      className={`relative flex h-full min-h-0 flex-col overflow-hidden ${
        isDark ? "bg-[#17191d] text-[#e7ebf3]" : "bg-[#f4f4f5] text-[#202124]"
      }`}
    >
      <header
        className={`border-b px-3 py-2 ${
          isDark
            ? "border-white/10 bg-[linear-gradient(180deg,rgba(55,58,64,0.98),rgba(35,38,43,0.98))]"
            : "border-black/10 bg-[linear-gradient(180deg,#f7f7f8,#ececed)]"
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`inline-flex h-7 overflow-hidden rounded-md border ${
              isDark
                ? "border-white/15 bg-white/5"
                : "border-black/10 bg-white/60"
            }`}
          >
            <button
              type="button"
              onClick={() => {
                if (!canGoBack) return;
                const nextIndex = historyIndex - 1;
                setHistoryIndex(nextIndex);
                navigateToPath(history[nextIndex] ?? "", true);
              }}
              disabled={!canGoBack}
              className={`inline-flex h-7 w-7 items-center justify-center transition-colors disabled:opacity-30 ${
                isDark
                  ? "text-[#d9dee7] hover:bg-white/10"
                  : "text-[#6a6d75] hover:bg-black/5"
              }`}
              aria-label="Back"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => {
                if (!canGoForward) return;
                const nextIndex = historyIndex + 1;
                setHistoryIndex(nextIndex);
                navigateToPath(history[nextIndex] ?? "", true);
              }}
              disabled={!canGoForward}
              className={`inline-flex h-7 w-7 items-center justify-center border-l transition-colors disabled:opacity-30 ${
                isDark
                  ? "border-white/10 text-[#d9dee7] hover:bg-white/10"
                  : "border-black/10 text-[#6a6d75] hover:bg-black/5"
              }`}
              aria-label="Forward"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (parentPath !== null) navigateToPath(parentPath);
            }}
            disabled={parentPath === null}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md border disabled:opacity-35 ${
              isDark
                ? "border-white/15 bg-white/5 text-[#d9dee7] hover:bg-white/10"
                : "border-black/10 bg-white/60 text-[#6a6d75] hover:bg-black/5"
            }`}
            aria-label="Up"
          >
            <ArrowUp size={13} />
          </button>

          <div
            className={`min-w-0 flex-1 text-center text-[14px] font-semibold ${
              isDark ? "text-[#f0f5ff]" : "text-[#494c52]"
            }`}
          >
            <span className="truncate">{currentFolderName}</span>
          </div>

          <div
            className={`inline-flex overflow-hidden rounded-md border ${
              isDark
                ? "border-white/15 bg-white/5"
                : "border-black/10 bg-white/60"
            }`}
          >
            <button
              type="button"
              onClick={() => setViewMode("icons")}
              aria-label="Icon view"
              className={`inline-flex h-7 w-7 items-center justify-center ${
                viewMode === "icons"
                  ? isDark
                    ? "bg-white/20 text-white"
                    : "bg-black/10 text-[#202124]"
                  : isDark
                    ? "text-[#d9dee7] hover:bg-white/10"
                    : "text-[#6a6d75] hover:bg-black/5"
              }`}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="List view"
              className={`inline-flex h-7 w-7 items-center justify-center border-l ${
                isDark ? "border-white/10" : "border-black/10"
              } ${
                viewMode === "list"
                  ? isDark
                    ? "bg-white/20 text-white"
                    : "bg-black/10 text-[#202124]"
                  : isDark
                    ? "text-[#d9dee7] hover:bg-white/10"
                    : "text-[#6a6d75] hover:bg-black/5"
              }`}
            >
              <List size={14} />
            </button>
            <button
              type="button"
              disabled
              aria-label="Column view"
              className={`inline-flex h-7 w-7 items-center justify-center border-l ${
                isDark
                  ? "border-white/10 text-[#d9dee7]/40"
                  : "border-black/10 text-[#6a6d75]/40"
              }`}
            >
              <Columns3 size={14} />
            </button>
          </div>

          <label className="relative hidden sm:block">
            <Search
              size={13}
              className={`pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 ${
                isDark ? "text-[#96a0b2]" : "text-[#7d8087]"
              }`}
            />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search"
              className={`h-7 w-32 rounded-md border py-1 pl-6 pr-2 text-[12px] outline-none ${
                isDark
                  ? "border-white/15 bg-white/10 text-[#e8edf8] placeholder:text-[#96a0b2] focus:border-[hsl(var(--primary))]"
                  : "border-black/10 bg-white/80 text-[#25262a] placeholder:text-[#8f939b] focus:border-[hsl(var(--primary))]"
              }`}
            />
          </label>

          <button
            type="button"
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md border ${
              isDark
                ? "border-white/15 bg-white/5 text-[#d9dee7] hover:bg-white/10"
                : "border-black/10 bg-white/60 text-[#6a6d75] hover:bg-black/5"
            }`}
            aria-label="Create"
          >
            <Plus size={14} />
          </button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[210px_1fr]">
        <aside
          className={`border-r px-3 py-3 ${
            isDark
              ? "border-white/10 bg-[linear-gradient(180deg,rgba(41,44,50,0.95),rgba(30,33,39,0.95))]"
              : "border-black/10 bg-[linear-gradient(180deg,#f3f3f4,#e9e9eb)]"
          }`}
        >
          <p
            className={`mb-2 text-[12px] font-medium ${
              isDark ? "text-[#a7b0be]" : "text-[#8d9198]"
            }`}
          >
            Favorites
          </p>
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const isCurrent =
                currentPath === item.path ||
                (item.path === "" && currentPath === "");
              const Icon = item.Icon;

              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => {
                      navigateToPath(item.path);
                    }}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] ${
                      isCurrent
                        ? isDark
                          ? "bg-white/10 text-white"
                          : "bg-[hsl(var(--primary)/0.18)] text-[#202124]"
                        : isDark
                          ? "text-[#d0d8e6] hover:bg-white/5"
                          : "text-[#34363b] hover:bg-black/5"
                    }`}
                  >
                    <Icon
                      size={14}
                      className={
                        isDark
                          ? "text-[hsl(var(--primary))]"
                          : "text-[hsl(var(--primary))]"
                      }
                    />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div
          className={`relative min-h-0 flex-1 overflow-auto ${
            isDark
              ? "bg-[linear-gradient(180deg,#20242b,#181b21)]"
              : "bg-[#f6f6f7]"
          }`}
        >
          {isLoading && (
            <div
              className={`absolute inset-0 z-10 flex items-center justify-center ${
                isDark ? "bg-[#0f1520]/70" : "bg-white/70"
              }`}
            >
              <Loader2
                size={20}
                className={`animate-spin ${isDark ? "text-[#b5c0d1]" : "text-[#6e7279]"}`}
              />
            </div>
          )}

          {error && !isLoading && (
            <p
              className={`m-4 rounded-md border p-3 text-sm ${
                isDark
                  ? "border-red-400/40 bg-red-500/10 text-red-100"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              Failed to read directory: {error}
            </p>
          )}

          {!error && !isLoading && filteredEntries.length === 0 && (
            <p
              className={`m-4 rounded-md border p-3 text-sm ${
                isDark
                  ? "border-white/10 bg-white/5 text-[#c0cadb]"
                  : "border-black/10 bg-white text-[#666a72]"
              }`}
            >
              This folder is empty.
            </p>
          )}

          {!error && !isLoading && previewImageEntry && (
            <div
              className={`grid min-h-full grid-cols-[1fr_190px] ${
                isDark ? "text-[#e7ebf3]" : "text-[#202124]"
              }`}
            >
              <div className="flex min-h-0 flex-col">
                <div className="flex h-10 items-center justify-between px-4">
                  <div
                    className={`text-[13px] font-medium ${
                      isDark ? "text-[#d7dce6]" : "text-[#7a7e86]"
                    }`}
                  >
                    {currentFolderName}
                  </div>
                  <div className="flex items-center gap-1">
                    {[LayoutGrid, List, Columns3].map((IconButton, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-md border ${
                          isDark
                            ? "border-white/10 bg-white/5 text-[#cfd5e0]"
                            : "border-black/10 bg-white text-[#666a72]"
                        }`}
                        aria-label="Preview toolbar action"
                      >
                        <IconButton size={14} />
                      </button>
                    ))}
                    {[Share, Tag, Ellipsis].map((IconButton, index) => (
                      <button
                        key={`action-${index}`}
                        type="button"
                        className={`ml-1 inline-flex h-7 w-7 items-center justify-center rounded-md border ${
                          isDark
                            ? "border-white/10 bg-white/5 text-[#cfd5e0]"
                            : "border-black/10 bg-white text-[#666a72]"
                        }`}
                        aria-label="Preview action"
                      >
                        <IconButton size={14} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-1 items-center justify-center px-8 py-6">
                  <img
                    src={getFilePreviewSrc(
                      previewImageEntry.relativePath,
                      source
                    )}
                    alt={previewImageEntry.name}
                    className="max-h-[360px] max-w-full rounded-md object-contain shadow-[0_10px_25px_rgba(0,0,0,0.22)]"
                  />
                </div>

                <div
                  className={`grid grid-cols-[repeat(auto-fit,minmax(44px,60px))] gap-2 border-t px-4 py-3 ${
                    isDark
                      ? "border-white/10 bg-black/10"
                      : "border-black/10 bg-[#efeff0]"
                  }`}
                >
                  {previewStripEntries.map((entry) => {
                    const active = selectedPath === entry.relativePath;
                    return (
                      <button
                        key={entry.relativePath}
                        type="button"
                        onClick={() => setSelectedPath(entry.relativePath)}
                        className={`overflow-hidden rounded-md border ${
                          active
                            ? "border-[hsl(var(--primary))] ring-2 ring-[hsl(var(--primary)/0.35)]"
                            : isDark
                              ? "border-white/10"
                              : "border-black/10"
                        }`}
                      >
                        <img
                          src={getFilePreviewSrc(entry.relativePath, source)}
                          alt={entry.name}
                          className="h-8 w-full object-cover sm:h-10"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <aside
                className={`border-l px-3 py-4 ${
                  isDark
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-black/10 bg-[#f1f1f2]"
                }`}
              >
                <div className="mb-4 flex items-start gap-3">
                  <img
                    src={getFilePreviewSrc(
                      previewImageEntry.relativePath,
                      source
                    )}
                    alt={previewImageEntry.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">
                      {previewImageEntry.name}
                    </p>
                    <p
                      className={`text-[12px] ${
                        isDark ? "text-[#aab3c2]" : "text-[#7a7e86]"
                      }`}
                    >
                      JPEG image - {formatFileSize(previewImageEntry.size)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-[12px]">
                  <div>
                    <p
                      className={`mb-1 font-medium ${
                        isDark ? "text-[#dce2ed]" : "text-[#4c4f56]"
                      }`}
                    >
                      Information
                    </p>
                    <div
                      className={`space-y-1 ${
                        isDark ? "text-[#aab3c2]" : "text-[#7a7e86]"
                      }`}
                    >
                      <p>Created {formatDate(previewImageEntry.modifiedAt)}</p>
                      <p>Modified {formatDate(previewImageEntry.modifiedAt)}</p>
                      <p>Kind JPEG image</p>
                      <p>Dimensions 4032 x 3024</p>
                      <p>Resolution 72 x 72</p>
                    </div>
                  </div>

                  <div>
                    <p
                      className={`mb-1 font-medium ${
                        isDark ? "text-[#dce2ed]" : "text-[#4c4f56]"
                      }`}
                    >
                      Tags
                    </p>
                    <div
                      className={`rounded-md border px-2 py-2 ${
                        isDark
                          ? "border-white/10 bg-black/10 text-[#7d8696]"
                          : "border-black/10 bg-white text-[#9a9ea5]"
                      }`}
                    >
                      Add Tags...
                    </div>
                  </div>
                </div>

                <div
                  className={`mt-6 flex items-center justify-between border-t pt-4 text-[11px] ${
                    isDark
                      ? "border-white/10 text-[#aab3c2]"
                      : "border-black/10 text-[#7a7e86]"
                  }`}
                >
                  <button
                    type="button"
                    className="flex flex-col items-center gap-1"
                  >
                    <RotateCcw size={14} />
                    Rotate Left
                  </button>
                  <button
                    type="button"
                    className="flex flex-col items-center gap-1"
                  >
                    <Pencil size={14} />
                    Markup
                  </button>
                  <button
                    type="button"
                    className="flex flex-col items-center gap-1"
                  >
                    <Ellipsis size={14} />
                    More...
                  </button>
                </div>
              </aside>
            </div>
          )}

          {!error &&
            !isLoading &&
            !previewImageEntry &&
            viewMode === "list" &&
            filteredEntries.length > 0 && (
              <div className="text-[13px]">
                <div
                  className={`sticky top-0 z-[2] grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_90px_90px] border-b px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide backdrop-blur ${
                    isDark
                      ? "border-white/10 bg-black/20 text-[#9aa5b8]"
                      : "border-black/10 bg-white/70 text-[#7c8087]"
                  }`}
                >
                  <span>Name</span>
                  <span>Date Modified</span>
                  <span className="text-right">Size</span>
                  <span className="text-right">Kind</span>
                </div>
                <ul>
                  {filteredEntries.map((entry) => {
                    const isSelected = selectedPath === entry.relativePath;
                    return (
                      <li key={entry.relativePath}>
                        <button
                          type="button"
                          onClick={() => setSelectedPath(entry.relativePath)}
                          onDoubleClick={() => activateEntry(entry)}
                          className={`grid w-full grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_90px_90px] items-center gap-2 border-b px-3 py-1.5 text-left ${
                            isSelected
                              ? isDark
                                ? "bg-[hsl(var(--primary)/0.35)] border-white/5"
                                : "bg-[hsl(var(--primary)/0.16)] border-black/10"
                              : isDark
                                ? "border-white/5 hover:bg-white/5"
                                : "border-black/5 hover:bg-black/[0.03]"
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            {entry.isDirectory ? (
                              <Folder
                                size={15}
                                className="shrink-0 text-[hsl(var(--primary))]"
                              />
                            ) : isImageEntry(entry) ? (
                              <img
                                src={getFilePreviewSrc(
                                  entry.relativePath,
                                  source
                                )}
                                alt={entry.name}
                                loading="lazy"
                                className="h-[18px] w-[18px] shrink-0 rounded-[4px] object-cover ring-1 ring-black/35"
                              />
                            ) : (
                              <FileText
                                size={15}
                                className={`shrink-0 ${
                                  isDark ? "text-[#a5afc1]" : "text-[#8a8f97]"
                                }`}
                              />
                            )}
                            <span
                              className={`truncate ${
                                isDark ? "text-[#e3ebf7]" : "text-[#2f3238]"
                              }`}
                            >
                              {entry.name}
                            </span>
                          </span>
                          <span
                            className={`truncate ${
                              isDark ? "text-[#c0cadb]" : "text-[#6c7078]"
                            }`}
                          >
                            {formatDate(entry.modifiedAt)}
                          </span>
                          <span
                            className={`text-right ${
                              isDark ? "text-[#c0cadb]" : "text-[#6c7078]"
                            }`}
                          >
                            {entry.isDirectory
                              ? "-"
                              : formatFileSize(entry.size)}
                          </span>
                          <span
                            className={`text-right ${
                              isDark ? "text-[#c0cadb]" : "text-[#6c7078]"
                            }`}
                          >
                            {entry.isDirectory ? "Folder" : entry.type}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

          {!error &&
            !isLoading &&
            !previewImageEntry &&
            viewMode === "icons" &&
            filteredEntries.length > 0 && (
              <ul className="grid auto-rows-max grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-x-6 gap-y-4 p-6">
                {filteredEntries.map((entry) => {
                  const isSelected = selectedPath === entry.relativePath;

                  return (
                    <li key={entry.relativePath} className="justify-self-start">
                      <button
                        type="button"
                        onClick={() => setSelectedPath(entry.relativePath)}
                        onDoubleClick={() => activateEntry(entry)}
                        className={`flex w-[116px] flex-col items-center rounded-lg px-2 py-2 ${
                          isSelected
                            ? isDark
                              ? "bg-white/10"
                              : "bg-[hsl(var(--primary)/0.14)]"
                            : isDark
                              ? "hover:bg-white/5"
                              : "hover:bg-black/[0.03]"
                        }`}
                      >
                        {entry.isDirectory ? (
                          <FinderFolderGlyph />
                        ) : isImageEntry(entry) ? (
                          <img
                            src={getFilePreviewSrc(entry.relativePath, source)}
                            alt={entry.name}
                            loading="lazy"
                            className="h-[54px] w-[54px] rounded-md object-cover ring-1 ring-black/35"
                          />
                        ) : (
                          <FileText
                            size={48}
                            className={
                              isDark ? "text-[#b1bbcc]" : "text-[#9a9ea5]"
                            }
                          />
                        )}

                        <span
                          className={`mt-1 max-w-full truncate rounded px-1.5 py-[1px] text-[13px] ${
                            isSelected
                              ? "bg-[hsl(var(--primary))] text-white"
                              : isDark
                                ? "text-[#edf3ff]"
                                : "text-[#34363b]"
                          }`}
                        >
                          {entry.name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
        </div>
      </div>

      <footer
        className={`flex h-9 items-center border-t px-3 text-[12px] ${
          isDark
            ? "border-white/10 bg-[#1c1f24] text-[#aeb8ca]"
            : "border-black/10 bg-[#ececee] text-[#737780]"
        }`}
      >
        <p className="flex-1 text-center">
          {selectedCount} of {filteredEntries.length} selected, 42.05 GB
          available
        </p>
        <input
          type="range"
          min={0}
          max={100}
          value={50}
          onChange={() => undefined}
          className="h-1 w-28 accent-[hsl(var(--primary))]"
          aria-label="Icon size"
        />
      </footer>

      {openedFile && (
        <div
          className={`absolute inset-0 z-30 flex items-start justify-center p-4 pt-8 backdrop-blur-[2px] ${
            isDark ? "bg-black/35" : "bg-black/20"
          }`}
          onClick={() => setOpenedFile(null)}
        >
          <div
            className={`relative flex h-[min(72%,420px)] w-[min(92%,560px)] flex-col overflow-hidden rounded-xl border shadow-[0_18px_40px_rgba(0,0,0,0.28)] ${
              isDark
                ? "border-white/15 bg-[#1a202b]"
                : "border-black/10 bg-[#fbfbfc]"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className={`flex items-center justify-between border-b px-3 py-2 ${
                isDark
                  ? "border-white/10 bg-[#232a36]"
                  : "border-black/10 bg-[#f1f1f3]"
              }`}
            >
              <div className="min-w-0">
                <p
                  className={`truncate text-[13px] font-semibold ${
                    isDark ? "text-[#edf3ff]" : "text-[#2c2f35]"
                  }`}
                >
                  {openedFile.name}
                </p>
                <p
                  className={`truncate text-[11px] ${
                    isDark ? "text-[#a3aec0]" : "text-[#7a7e86]"
                  }`}
                >
                  {openedFile.relativePath}
                  {openedFileContentType
                    ? `  -  ${openedFileContentType.split(";")[0]}`
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={getFilePreviewSrc(openedFile.relativePath, source)}
                  target="_blank"
                  rel="noreferrer"
                  className={`rounded-md border px-2 py-1 text-[12px] font-medium ${
                    isDark
                      ? "border-white/15 bg-white/10 text-[#e4ebf8]"
                      : "border-black/10 bg-white text-[#454850]"
                  }`}
                >
                  Open Raw
                </a>
                <button
                  type="button"
                  onClick={() => setOpenedFile(null)}
                  aria-label="Close preview"
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-md border ${
                    isDark
                      ? "border-white/15 bg-white/10 text-[#e4ebf8] hover:bg-white/15"
                      : "border-black/10 bg-white text-[#454850] hover:bg-black/[0.03]"
                  }`}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-3">
              {isOpeningFile && (
                <div className="flex h-full items-center justify-center">
                  <Loader2
                    size={20}
                    className={`animate-spin ${
                      isDark ? "text-[#b5c0d1]" : "text-[#7a7e86]"
                    }`}
                  />
                </div>
              )}

              {!isOpeningFile && openFileError && (
                <p
                  className={`rounded-md border p-3 text-sm ${
                    isDark
                      ? "border-red-400/40 bg-red-500/10 text-red-100"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  Failed to open file: {openFileError}
                </p>
              )}

              {!isOpeningFile && !openFileError && isImageEntry(openedFile) && (
                <div className="flex h-full items-center justify-center">
                  <img
                    src={getFilePreviewSrc(openedFile.relativePath, source)}
                    alt={openedFile.name}
                    className="max-h-[340px] max-w-full rounded-lg object-contain ring-1 ring-black/30"
                  />
                </div>
              )}

              {!isOpeningFile &&
                !openFileError &&
                !isImageEntry(openedFile) &&
                openedFileText !== null &&
                isCsvContentType(openedFileContentType) &&
                openedFileCsvRows.length > 0 && (
                  <div
                    className={`overflow-auto rounded-md border ${
                      isDark ? "border-white/10" : "border-black/10"
                    }`}
                  >
                    <table className="min-w-full border-collapse text-left text-[12px]">
                      <thead
                        className={
                          isDark
                            ? "bg-[#2a3240] text-[#d3dced]"
                            : "bg-[#f1f1f3] text-[#4d5057]"
                        }
                      >
                        <tr>
                          {openedFileCsvRows[0].map((cell, index) => (
                            <th
                              key={`${cell}-${index}`}
                              className={`border-b border-r px-2 py-1.5 font-semibold last:border-r-0 ${
                                isDark ? "border-white/10" : "border-black/10"
                              }`}
                            >
                              {cell || `Column ${index + 1}`}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {openedFileCsvRows.slice(1).map((row, rowIndex) => (
                          <tr
                            key={`row-${rowIndex}`}
                            className={
                              isDark
                                ? "odd:bg-[#151b25] even:bg-[#1c2430]"
                                : "odd:bg-white even:bg-[#f7f7f8]"
                            }
                          >
                            {row.map((cell, cellIndex) => (
                              <td
                                key={`${rowIndex}-${cellIndex}`}
                                className={`border-r border-t px-2 py-1.5 last:border-r-0 ${
                                  isDark
                                    ? "border-white/10 text-[#e4ebf8]"
                                    : "border-black/10 text-[#31343a]"
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              {!isOpeningFile &&
                !openFileError &&
                !isImageEntry(openedFile) &&
                openedFileText !== null &&
                (!isCsvContentType(openedFileContentType) ||
                  openedFileCsvRows.length === 0) && (
                  <pre
                    className={`max-h-full overflow-auto whitespace-pre-wrap break-words rounded-md border p-3 font-mono text-[12px] ${
                      isDark
                        ? "border-white/10 bg-[#111722] text-[#e6edf9]"
                        : "border-black/10 bg-white text-[#2f3238]"
                    }`}
                  >
                    {openedFilePrettyText}
                  </pre>
                )}

              {!isOpeningFile &&
                !openFileError &&
                !isImageEntry(openedFile) &&
                openedFileText === null && (
                  <p
                    className={`rounded-md border p-3 text-sm ${
                      isDark
                        ? "border-white/10 bg-white/5 text-[#c0cadb]"
                        : "border-black/10 bg-[#f7f7f8] text-[#666a72]"
                    }`}
                  >
                    Preview is not available for this file type.
                  </p>
                )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
