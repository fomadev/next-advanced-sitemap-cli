/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { validateSitemapHealth, type HealthCheckResult } from 'next-advanced-sitemap';
import { parseLocsFromXml, detectSitemapKind, SitemapDocumentKind } from './parse.js';

export { parseLocsFromXml, detectSitemapKind, type SitemapDocumentKind };

export interface SitemapCheckReport {
  url: string;
  kind: SitemapDocumentKind;
  byteSize: number;
  totalUrls: number;
  brokenLinks: HealthCheckResult[];
  durationMs: number;
}

export interface CheckSitemapOptions {
  /** Perform a HEAD sweep of every discovered URL. Default: true. */
  checkLinks?: boolean;
  concurrency?: number;
  timeoutMs?: number;
  /** File-size warning threshold in bytes. Default: 50MB (sitemaps.org limit). */
  maxBytes?: number;
}

/**
 * Fetches a live sitemap (or sitemap index) URL and runs the same checks the
 * CLI exposes: schema detection, size against the sitemaps.org 50MB limit,
 * and (optionally) a broken-link sweep via `validateSitemapHealth`.
 */
export async function checkSitemap(url: string, options: CheckSitemapOptions = {}): Promise<SitemapCheckReport> {
  const start = Date.now();
  const response = await fetch(url);
  const xml = await response.text();

  const kind = detectSitemapKind(xml);
  const locs = parseLocsFromXml(xml);
  const byteSize = new TextEncoder().encode(xml).length;

  const checkLinks = options.checkLinks ?? true;
  const brokenLinks = checkLinks
    ? (
        await validateSitemapHealth(
          locs.map((loc) => ({ url: loc })),
          { concurrency: options.concurrency, timeoutMs: options.timeoutMs }
        )
      ).filter((result) => !result.ok)
    : [];

  return {
    url,
    kind,
    byteSize,
    totalUrls: locs.length,
    brokenLinks,
    durationMs: Date.now() - start,
  };
}
