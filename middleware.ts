import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for handling dynamic redirects from the restructuring engine.
 *
 * This middleware checks incoming requests against the database of internal redirects
 * and returns 301 responses for URLs that have been migrated.
 *
 * Note: For best performance, the redirect service caches lookups.
 * The cache is populated lazily on first request.
 */

// In-memory cache for Edge Runtime (since we can't use external packages directly)
const redirectCache = new Map<string, { target: string; timestamp: number } | null>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8090';

/**
 * Normalize URL for consistent matching.
 */
function normalizeUrl(url: string): string {
  if (!url) return '';

  let normalized = url.toLowerCase().trim();

  // Remove leading slash
  if (normalized.startsWith('/')) {
    normalized = normalized.substring(1);
  }

  // Remove trailing slash
  if (normalized.endsWith('/')) {
    normalized = normalized.substring(0, normalized.length - 1);
  }

  return normalized;
}

/**
 * Check if a cached entry is still valid.
 */
function isCacheValid(entry: { target: string; timestamp: number } | null | undefined): boolean {
  if (!entry) return false;
  return Date.now() - entry.timestamp < CACHE_TTL;
}

/**
 * Fetch redirect from the API.
 */
async function fetchRedirect(sourceUrl: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

    const response = await fetch(
      `${API_URL}/redirects/lookup?sourceUrl=${encodeURIComponent(sourceUrl)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data?.targetUrl || null;
  } catch (error) {
    // Don't fail hard on errors - just return null
    // This ensures the site continues to work even if the redirect service is down
    return null;
  }
}

/**
 * Look up redirect for a URL.
 */
async function lookupRedirect(urlPath: string): Promise<string | null> {
  const normalizedUrl = normalizeUrl(urlPath);

  // Check cache first
  const cached = redirectCache.get(normalizedUrl);
  if (isCacheValid(cached)) {
    return cached?.target || null;
  }

  // Fetch from API
  const target = await fetchRedirect(normalizedUrl);

  // Cache the result
  if (target) {
    redirectCache.set(normalizedUrl, { target, timestamp: Date.now() });
  } else {
    // Cache null results too to avoid repeated API calls
    redirectCache.set(normalizedUrl, null);
  }

  // Clean up old entries periodically (every 100 lookups)
  if (redirectCache.size > 1000) {
    const now = Date.now();
    for (const [key, value] of redirectCache.entries()) {
      if (!value || now - value.timestamp > CACHE_TTL) {
        redirectCache.delete(key);
      }
    }
  }

  return target;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Files with extensions (images, etc.)
  ) {
    return NextResponse.next();
  }

  // Look up redirect
  const targetUrl = await lookupRedirect(pathname);

  if (targetUrl) {
    // Build the redirect URL
    const url = request.nextUrl.clone();

    // If target is a relative path, keep it relative
    if (targetUrl.startsWith('/')) {
      url.pathname = targetUrl;
    } else if (targetUrl.startsWith('http')) {
      // Absolute URL
      return NextResponse.redirect(targetUrl, { status: 301 });
    } else {
      // Relative path without leading slash
      url.pathname = '/' + targetUrl;
    }

    // Return 301 permanent redirect
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
