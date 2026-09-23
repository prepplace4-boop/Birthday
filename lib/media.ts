/**
 * Centralized media URL resolution.
 *
 * All Birthday Journey images/videos live as static files under /public
 * (e.g. /public/day-1/photo.jpg -> served at /day-1/photo.jpg).
 *
 * This file is the ONLY place that should turn a folder + filename (or a
 * legacy/admin-stored path) into a browser-usable URL, so every caller
 * behaves consistently in dev and in production.
 *
 * Explicitly NOT supported here (see task spec): Supabase Storage,
 * getPublicUrl(), createSignedUrl(), or any bucket URL generation.
 */

/**
 * Normalizes an already-known media path into a safe, root-relative URL.
 *
 * - Absolute http(s) URL            -> preserved unchanged
 * - Root-relative path ("/images/x")-> preserved unchanged
 * - Relative path ("images/x")      -> becomes "/images/x"
 * - Legacy "/public/images/x"       -> becomes "/images/x"
 * - Legacy "public/images/x"        -> becomes "/images/x"
 */
export function resolveMediaUrl(path: string): string {
  if (!path) return path;

  // Absolute URL (http/https) - leave untouched.
  if (/^https?:\/\//i.test(path)) return path;

  // Normalize any backslashes from Windows-authored paths.
  let normalized = path.replace(/\\/g, "/");

  // Strip a leading "public/" or "/public/" segment (legacy authoring path).
  // The "public" directory is never part of the deployed URL.
  normalized = normalized.replace(/^\/?public\//i, "/");

  // Ensure root-relative.
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  return normalized;
}

/**
 * Builds a media URL for a file that lives directly under a top-level
 * /public folder, percent-encoding each path segment individually so
 * spaces, parentheses, and unicode characters (em dashes, etc.) in
 * filenames survive as a valid URL.
 *
 * buildMediaUrl("day-1", "Memory Card 01 — The Beginning (1).jpg")
 *   -> "/day-1/Memory%20Card%2001%20%E2%80%94%20The%20Beginning%20(1).jpg"
 */
export function buildMediaUrl(folder: string, fileName: string): string {
  const safeFolder = folder
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const safeFile = encodeURIComponent(fileName);
  return resolveMediaUrl(`/${safeFolder}/${safeFile}`);
}
