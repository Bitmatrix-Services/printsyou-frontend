/**
 * Redirect Service for handling database-driven redirects.
 *
 * This service fetches and caches redirect mappings from the backend API
 * to enable dynamic 301 redirects from the restructuring engine.
 */

import { LRUCache } from 'lru-cache';

export interface InternalRedirect {
  id: string;
  sourceUrl: string;
  targetUrl: string;
  redirectType: number;
  isActive: boolean;
}

// Cache for redirect lookups (15 minute TTL)
const redirectCache = new LRUCache<string, InternalRedirect | null>({
  max: 5000, // Maximum number of entries
  ttl: 15 * 60 * 1000, // 15 minutes in milliseconds
});

// Cache for all redirects (for bulk loading)
let allRedirectsCache: Map<string, InternalRedirect> | null = null;
let allRedirectsCacheTime: number = 0;
const ALL_REDIRECTS_TTL = 5 * 60 * 1000; // 5 minutes

// Backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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
 * Fetch a single redirect from the API.
 */
async function fetchRedirect(sourceUrl: string): Promise<InternalRedirect | null> {
  try {
    const response = await fetch(
      `${API_URL}/api/admin/restructuring/redirects/lookup?sourceUrl=${encodeURIComponent(sourceUrl)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Short timeout for middleware
        signal: AbortSignal.timeout(2000),
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      console.error(`Redirect lookup failed: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    // Don't fail hard on errors - just return null
    console.error('Error fetching redirect:', error);
    return null;
  }
}

/**
 * Fetch all active redirects from the API for bulk loading.
 */
async function fetchAllRedirects(): Promise<InternalRedirect[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/admin/restructuring/redirects`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Longer timeout for bulk fetch
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      console.error(`Fetch all redirects failed: ${response.status}`);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching all redirects:', error);
    return [];
  }
}

/**
 * Load all redirects into the cache for faster lookups.
 */
async function loadAllRedirects(): Promise<void> {
  const now = Date.now();

  // Check if cache is still valid
  if (allRedirectsCache && (now - allRedirectsCacheTime) < ALL_REDIRECTS_TTL) {
    return;
  }

  const redirects = await fetchAllRedirects();

  if (redirects.length > 0) {
    allRedirectsCache = new Map();

    for (const redirect of redirects) {
      const normalizedSource = normalizeUrl(redirect.sourceUrl);
      allRedirectsCache.set(normalizedSource, redirect);
      // Also populate the LRU cache
      redirectCache.set(normalizedSource, redirect);
    }

    allRedirectsCacheTime = now;
    console.log(`Loaded ${redirects.length} redirects into cache`);
  }
}

/**
 * Look up a redirect for the given URL path.
 *
 * @param urlPath The URL path to look up (with or without leading slash)
 * @returns The redirect if found, null otherwise
 */
export async function lookupRedirect(urlPath: string): Promise<InternalRedirect | null> {
  const normalizedUrl = normalizeUrl(urlPath);

  // Check LRU cache first
  if (redirectCache.has(normalizedUrl)) {
    return redirectCache.get(normalizedUrl) ?? null;
  }

  // Check bulk cache
  if (allRedirectsCache && allRedirectsCache.has(normalizedUrl)) {
    const redirect = allRedirectsCache.get(normalizedUrl)!;
    redirectCache.set(normalizedUrl, redirect);
    return redirect;
  }

  // Fetch from API
  const redirect = await fetchRedirect(normalizedUrl);

  // Cache the result (even if null to prevent repeated API calls)
  redirectCache.set(normalizedUrl, redirect);

  return redirect;
}

/**
 * Clear the redirect cache.
 * Call this when redirects are updated via admin UI.
 */
export function clearRedirectCache(): void {
  redirectCache.clear();
  allRedirectsCache = null;
  allRedirectsCacheTime = 0;
  console.log('Redirect cache cleared');
}

/**
 * Preload redirects into cache.
 * Call this during server startup for better performance.
 */
export async function preloadRedirects(): Promise<void> {
  await loadAllRedirects();
}

/**
 * Get cache statistics.
 */
export function getCacheStats() {
  return {
    lruCacheSize: redirectCache.size,
    allRedirectsCacheSize: allRedirectsCache?.size ?? 0,
    allRedirectsCacheAge: allRedirectsCacheTime > 0
      ? Date.now() - allRedirectsCacheTime
      : null,
  };
}
