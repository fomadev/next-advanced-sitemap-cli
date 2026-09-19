/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { parseLocsFromXml, detectSitemapKind } from '../src/parse.js';

const SAMPLE_URLSET = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.com/a</loc></url>
  <url><loc>https://example.com/b?x=1&amp;y=2</loc></url>
</urlset>`;

const SAMPLE_INDEX = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>https://example.com/sitemap-1.xml</loc></sitemap>
</sitemapindex>`;

describe('parseLocsFromXml', () => {
  it('should extract every <loc> URL', () => {
    expect(parseLocsFromXml(SAMPLE_URLSET)).toEqual(['https://example.com/a', 'https://example.com/b?x=1&amp;y=2']);
  });

  it('should return an empty array for a payload with no <loc> tags', () => {
    expect(parseLocsFromXml('<urlset></urlset>')).toEqual([]);
  });
});

describe('detectSitemapKind', () => {
  it('should detect a urlset document', () => {
    expect(detectSitemapKind(SAMPLE_URLSET)).toBe('urlset');
  });

  it('should detect a sitemapindex document', () => {
    expect(detectSitemapKind(SAMPLE_INDEX)).toBe('sitemapindex');
  });

  it('should return "unknown" for non-sitemap XML', () => {
    expect(detectSitemapKind('<rss></rss>')).toBe('unknown');
  });
});
