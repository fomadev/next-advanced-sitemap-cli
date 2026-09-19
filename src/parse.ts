/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

const LOC_PATTERN = /<loc>\s*([^<\s][^<]*?)\s*<\/loc>/g;

/**
 * Extracts every `<loc>` URL from a sitemap or sitemap index XML payload.
 * Intentionally regex-based (no XML parser dependency) since sitemap XML is
 * a well-constrained, non-nested-attribute format for this single purpose.
 */
export function parseLocsFromXml(xml: string): string[] {
  const locs: string[] = [];
  for (const match of xml.matchAll(LOC_PATTERN)) {
    locs.push(match[1].trim());
  }
  return locs;
}

export type SitemapDocumentKind = 'urlset' | 'sitemapindex' | 'unknown';

/** Determines whether a payload is a standard sitemap or a sitemap index. */
export function detectSitemapKind(xml: string): SitemapDocumentKind {
  if (/<urlset[\s>]/.test(xml)) return 'urlset';
  if (/<sitemapindex[\s>]/.test(xml)) return 'sitemapindex';
  return 'unknown';
}
