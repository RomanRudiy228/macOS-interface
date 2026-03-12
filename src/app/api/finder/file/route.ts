import { promises as fs } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

const FINDER_ROOT = path.resolve(process.cwd(), "server-files", "finder-demo");
const FINDER_STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_FINDER_STORAGE_BUCKET ?? "finder-files";
const USER_STORAGE_ROOT = "users";
type FinderSource = "server" | "user";

const MIME_BY_EXTENSION: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".ts": "text/plain; charset=utf-8",
};

function parseSource(rawSource: string | null): FinderSource {
  return rawSource === "user" ? "user" : "server";
}

function sanitizeRelativePath(rawPath: string | null): string {
  if (!rawPath) return "";
  const normalized = path.normalize(rawPath).replace(/^([/\\])+/, "");
  return normalized === "." ? "" : normalized;
}

function hasTraversalSegments(relativePath: string): boolean {
  return relativePath.split(/[\\/]+/).some((segment) => segment === "..");
}

function resolveInsideRoot(relativePath: string): string | null {
  const resolved = path.resolve(FINDER_ROOT, relativePath);
  if (resolved === FINDER_ROOT) return null;
  if (!resolved.startsWith(`${FINDER_ROOT}${path.sep}`)) return null;
  return resolved;
}

function buildUserStoragePath(userId: string, relativePath: string): string {
  const root = `${USER_STORAGE_ROOT}/${userId}`;
  return relativePath ? `${root}/${relativePath.replace(/\\/g, "/")}` : root;
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const source = parseSource(request.nextUrl.searchParams.get("source"));
  const requestedPath = sanitizeRelativePath(
    request.nextUrl.searchParams.get("path")
  );
  if (hasTraversalSegments(requestedPath)) {
    return NextResponse.json({ error: "Invalid path." }, { status: 400 });
  }

  if (source === "user") {
    return getUserFile(requestedPath);
  }

  return getServerFile(requestedPath);
}

async function getServerFile(requestedPath: string) {
  const absolutePath = resolveInsideRoot(requestedPath);
  if (!absolutePath) {
    return NextResponse.json({ error: "Invalid path." }, { status: 400 });
  }

  try {
    const stat = await fs.stat(absolutePath);
    if (!stat.isFile()) {
      return NextResponse.json(
        { error: "Requested path is not a file." },
        { status: 400 }
      );
    }

    const content = await fs.readFile(absolutePath);
    const extension = path.extname(absolutePath).toLowerCase();
    const contentType =
      MIME_BY_EXTENSION[extension] ?? "application/octet-stream";

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not read file from server." },
      { status: 500 }
    );
  }
}

async function getUserFile(requestedPath: string) {
  if (!requestedPath) {
    return NextResponse.json({ error: "File path is required." }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const storagePath = buildUserStoragePath(user.id, requestedPath);
  const { data, error } = await supabase.storage
    .from(FINDER_STORAGE_BUCKET)
    .download(storagePath);

  if (error || !data) {
    return NextResponse.json(
      { error: "Could not read file from user storage." },
      { status: 404 }
    );
  }

  const extension = path.extname(requestedPath).toLowerCase();
  const contentType = data.type || MIME_BY_EXTENSION[extension] || "application/octet-stream";
  const bytes = await data.arrayBuffer();

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    },
  });
}
