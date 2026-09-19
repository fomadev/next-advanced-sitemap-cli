/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { checkSitemap } from './index.js';

const MAX_BYTES_DEFAULT = 50 * 1024 * 1024; // 50MB, sitemaps.org limit

function printUsage(): void {
  console.log('Usage: next-advanced-sitemap-check <sitemap-url> [--no-links] [--concurrency=10] [--timeout=5000]');
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const url = args.find((arg) => !arg.startsWith('--'));

  if (!url) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const checkLinks = !args.includes('--no-links');
  const concurrencyArg = args.find((arg) => arg.startsWith('--concurrency='));
  const timeoutArg = args.find((arg) => arg.startsWith('--timeout='));

  console.log(`[next-advanced-sitemap-check] Fetching ${url} ...`);

  const report = await checkSitemap(url, {
    checkLinks,
    concurrency: concurrencyArg ? Number(concurrencyArg.split('=')[1]) : undefined,
    timeoutMs: timeoutArg ? Number(timeoutArg.split('=')[1]) : undefined,
  });

  console.log('');
  console.log(`Document type: ${report.kind}`);
  console.log(`Total URLs:    ${report.totalUrls}`);
  console.log(`File size:     ${(report.byteSize / 1024).toFixed(1)} KB`);
  console.log(`Duration:      ${report.durationMs} ms`);

  if (report.kind === 'unknown') {
    console.error('\n[FAIL] Response does not look like a valid <urlset> or <sitemapindex> document.');
    process.exitCode = 1;
    return;
  }

  if (report.byteSize > MAX_BYTES_DEFAULT) {
    console.warn(`\n[WARN] File exceeds the sitemaps.org 50MB limit (${(report.byteSize / 1024 / 1024).toFixed(1)} MB).`);
  }

  if (checkLinks) {
    if (report.brokenLinks.length === 0) {
      console.log('\n[PASS] All URLs responded successfully.');
    } else {
      console.error(`\n[FAIL] ${report.brokenLinks.length} broken URL(s) detected:`);
      for (const broken of report.brokenLinks) {
        console.error(`  - ${broken.url} -> ${broken.status ?? broken.error ?? 'unknown error'}`);
      }
      process.exitCode = 1;
    }
  }
}

main().catch((error) => {
  console.error(`[next-advanced-sitemap-check] Fatal error: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
