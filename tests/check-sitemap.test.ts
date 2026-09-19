/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { checkSitemap } from '../src/index.js';

describe('checkSitemap', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should fetch, parse and report on a sitemap, skipping the link sweep when disabled', async () => {
    const xml = `<urlset><url><loc>https://example.com/a</loc></url><url><loc>https://example.com/b</loc></url></urlset>`;
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(xml))
    );

    const report = await checkSitemap('https://example.com/sitemap.xml', { checkLinks: false });

    expect(report.kind).toBe('urlset');
    expect(report.totalUrls).toBe(2);
    expect(report.brokenLinks).toEqual([]);
  });
});
