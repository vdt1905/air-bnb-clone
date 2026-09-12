/**
 * Regenerates `src/data/listings.fallback.json` from the server's fixture.
 *
 * The client bundles a copy of the listing data so the page still renders
 * when the API is unreachable — e.g. an evaluator opens the client without
 * starting the server. To keep one source of truth the copy is GENERATED from
 * the server's own model (same normalisation the API applies), never edited
 * by hand. Runs automatically before `dev` and `build` (see package.json).
 *
 * This is a build-time tool, not a runtime import: the client bundle itself
 * never imports from `server/`.
 *
 * If the server workspace is absent (client zipped alone) the existing JSON
 * is kept and the script exits 0.
 */
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../src/data/listings.fallback.json');
const modelPath = path.resolve(here, '../../server/src/models/listingModel.js');

try {
  const { findAll } = await import(pathToFileURL(modelPath).href);
  const listings = findAll();
  const next = JSON.stringify({ generatedAt: new Date().toISOString(), listings }, null, 2) + '\n';

  // Skip the write when only the timestamp would change, so watchers stay quiet.
  let prev = null;
  try { prev = JSON.parse(await readFile(out, 'utf8')); } catch { /* first run */ }
  if (prev && JSON.stringify(prev.listings) === JSON.stringify(listings)) {
    console.log(`[sync-fallback] up to date (${listings.length} listings)`);
  } else {
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, next);
    console.log(`[sync-fallback] wrote ${path.relative(process.cwd(), out)} (${listings.length} listings)`);
  }
} catch (error) {
  if (error?.code === 'ERR_MODULE_NOT_FOUND') {
    console.warn('[sync-fallback] server workspace not found — keeping the existing fallback JSON');
  } else {
    throw error;
  }
}
