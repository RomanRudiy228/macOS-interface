import { promises as fs } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

type FinderSortBy = "name" | "size" | "modifiedAt" | "type";
type FinderSortOrder = "asc" | "desc";
type FinderSource = "server" | "user";

type FinderEntry = {
  name: string;
  relativePath: string;
  isDirectory: boolean;
  size: number;
  modifiedAt: string;
  type: string;
};

const FINDER_ROOT = path.resolve(process.cwd(), "server-files", "finder-demo");
const FINDER_STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_FINDER_STORAGE_BUCKET ?? "finder-files";
const USER_STORAGE_ROOT = "users";

const USER_SEED_FILES: Array<{
  path: string;
  content: string;
  contentType: string;
}> = [
  {
    path: "Documents/welcome.txt",
    content:
      "Welcome to your personal Finder storage.\nFiles here are isolated by user id.",
    contentType: "text/plain; charset=utf-8",
  },
  {
    path: "Documents/todo.md",
    content:
      "- Connect Supabase bucket\n- Upload your own files\n- Open previews in Finder",
    contentType: "text/markdown; charset=utf-8",
  },
  {
    path: "Projects/profile.json",
    content: JSON.stringify(
      {
        app: "macOS Finder Demo",
        source: "Supabase Storage",
      },
      null,
      2
    ),
    contentType: "application/json; charset=utf-8",
  },
  {
    path: "Applications/installed-apps.txt",
    content: "Finder\nPhotos\nNotes\nCalendar",
    contentType: "text/plain; charset=utf-8",
  },
  {
    path: "Downloads/readme.txt",
    content: "Drop your temporary downloads here.",
    contentType: "text/plain; charset=utf-8",
  },
  {
    path: "Desktop/quick-note.md",
    content:
      "# Desktop\n\nThis folder can store shortcuts, notes, and screenshots.",
    contentType: "text/markdown; charset=utf-8",
  },
];

function toUnixPath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

function sanitizeRelativePath(rawPath: string | null): string {
  if (!rawPath) return "";
  const normalized = path.normalize(rawPath).replace(/^([/\\])+/, "");
  return normalized === "." ? "" : normalized;
}

function hasTraversalSegments(relativePath: string): boolean {
  return relativePath.split(/[\\/]+/).some((segment) => segment === "..");
}

function parseSource(rawSource: string | null): FinderSource {
  return rawSource === "user" ? "user" : "server";
}

function resolveInsideRoot(relativePath: string): string | null {
  const resolved = path.resolve(FINDER_ROOT, relativePath);
  if (resolved === FINDER_ROOT) return resolved;
  if (!resolved.startsWith(`${FINDER_ROOT}${path.sep}`)) return null;
  return resolved;
}

function getUserRoot(userId: string): string {
  return `${USER_STORAGE_ROOT}/${userId}`;
}

function buildUserStoragePath(userId: string, relativePath: string): string {
  const root = getUserRoot(userId);
  return relativePath ? `${root}/${toUnixPath(relativePath)}` : root;
}

function parseSortBy(rawSortBy: string | null): FinderSortBy {
  if (rawSortBy === "size") return "size";
  if (rawSortBy === "modifiedAt") return "modifiedAt";
  if (rawSortBy === "type") return "type";
  return "name";
}

function parseSortOrder(rawSortOrder: string | null): FinderSortOrder {
  return rawSortOrder === "desc" ? "desc" : "asc";
}

function compareValues(
  left: FinderEntry,
  right: FinderEntry,
  sortBy: FinderSortBy
): number {
  if (sortBy === "size") return left.size - right.size;
  if (sortBy === "modifiedAt") {
    return (
      new Date(left.modifiedAt).getTime() - new Date(right.modifiedAt).getTime()
    );
  }
  if (sortBy === "type") return left.type.localeCompare(right.type);
  return left.name.localeCompare(right.name, undefined, { numeric: true });
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const source = parseSource(request.nextUrl.searchParams.get("source"));
  const sortBy = parseSortBy(request.nextUrl.searchParams.get("sortBy"));
  const sortOrder = parseSortOrder(
    request.nextUrl.searchParams.get("sortOrder")
  );
  const requestedPath = sanitizeRelativePath(
    request.nextUrl.searchParams.get("path")
  );
  if (hasTraversalSegments(requestedPath)) {
    return NextResponse.json({ error: "Invalid path." }, { status: 400 });
  }

  if (source === "user") {
    return getUserFiles(requestedPath, sortBy, sortOrder);
  }

  return getServerFiles(requestedPath, sortBy, sortOrder);
}

async function getServerFiles(
  requestedPath: string,
  sortBy: FinderSortBy,
  sortOrder: FinderSortOrder
) {
  const absolutePath = resolveInsideRoot(requestedPath);

  if (!absolutePath) {
    return NextResponse.json({ error: "Invalid path." }, { status: 400 });
  }

  try {
    const stat = await fs.stat(absolutePath);
    if (!stat.isDirectory()) {
      return NextResponse.json(
        { error: "Requested path is not a directory." },
        { status: 400 }
      );
    }

    const dirents = await fs.readdir(absolutePath, { withFileTypes: true });
    const entries = await Promise.all(
      dirents.map(async (dirent): Promise<FinderEntry> => {
        const itemPath = path.join(absolutePath, dirent.name);
        const itemStat = await fs.stat(itemPath);
        const relativePath = toUnixPath(path.relative(FINDER_ROOT, itemPath));
        const extension = path.extname(dirent.name).replace(".", "");

        return {
          name: dirent.name,
          relativePath,
          isDirectory: dirent.isDirectory(),
          size: dirent.isDirectory() ? 0 : itemStat.size,
          modifiedAt: itemStat.mtime.toISOString(),
          type: dirent.isDirectory() ? "folder" : extension || "file",
        };
      })
    );

    entries.sort((left, right) => {
      if (left.isDirectory !== right.isDirectory) {
        return left.isDirectory ? -1 : 1;
      }

      const compared = compareValues(left, right, sortBy);
      return sortOrder === "asc" ? compared : -compared;
    });

    const currentPath = toUnixPath(path.relative(FINDER_ROOT, absolutePath));
    const parentPath =
      currentPath === ""
        ? null
        : toUnixPath(path.dirname(currentPath)).replace(".", "");

    return NextResponse.json({
      currentPath,
      parentPath: parentPath === "" ? "" : parentPath,
      entries,
      source: "server",
    });
  } catch {
    return NextResponse.json(
      { error: "Could not read directory from server." },
      { status: 500 }
    );
  }
}

async function getUserFiles(
  requestedPath: string,
  sortBy: FinderSortBy,
  sortOrder: FinderSortOrder
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const root = buildUserStoragePath(user.id, "");
  const storagePath = buildUserStoragePath(user.id, requestedPath);

  if (requestedPath === "") {
    await ensureUserSeedFiles(supabase, user.id);
  }

  let { data, error } = await supabase.storage
    .from(FINDER_STORAGE_BUCKET)
    .list(storagePath, {
      limit: 200,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

  if (!error && requestedPath === "" && (!data || data.length === 0)) {
    await ensureUserSeedFiles(supabase, user.id);
    const secondAttempt = await supabase.storage
      .from(FINDER_STORAGE_BUCKET)
      .list(storagePath, {
        limit: 200,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });
    data = secondAttempt.data ?? [];
    error = secondAttempt.error;
  }

  if (error) {
    return NextResponse.json(
      { error: `Could not read user directory: ${error.message}` },
      { status: 500 }
    );
  }

  const entries: FinderEntry[] = (data ?? []).map((item) => {
    const isDirectory = item.id === null;
    const extension = path.extname(item.name).replace(".", "");
    const metadata =
      item.metadata && typeof item.metadata === "object" ? item.metadata : null;
    const size =
      !isDirectory &&
      metadata &&
      "size" in metadata &&
      typeof metadata.size === "number"
        ? metadata.size
        : 0;
    const relativePath = requestedPath
      ? `${requestedPath}/${item.name}`
      : item.name;

    return {
      name: item.name,
      relativePath: toUnixPath(relativePath),
      isDirectory,
      size,
      modifiedAt:
        item.updated_at ?? item.created_at ?? new Date(0).toISOString(),
      type: isDirectory ? "folder" : extension || "file",
    };
  });

  entries.sort((left, right) => {
    if (left.isDirectory !== right.isDirectory) {
      return left.isDirectory ? -1 : 1;
    }

    const compared = compareValues(left, right, sortBy);
    return sortOrder === "asc" ? compared : -compared;
  });

  const parentPath =
    requestedPath === ""
      ? null
      : toUnixPath(path.dirname(requestedPath)).replace(".", "");

  return NextResponse.json({
    currentPath: requestedPath,
    parentPath: parentPath === "" ? "" : parentPath,
    entries,
    source: "user",
    rootPath: root,
  });
}

async function ensureUserSeedFiles(
  supabase: ReturnType<typeof createClient>,
  userId: string
) {
  await Promise.all(
    USER_SEED_FILES.map((file) =>
      supabase.storage
        .from(FINDER_STORAGE_BUCKET)
        .upload(
          `${getUserRoot(userId)}/${file.path}`,
          new Blob([file.content], { type: file.contentType }),
          {
            contentType: file.contentType,
            upsert: false,
          }
        )
        .catch(() => null)
    )
  );
}
