#!/usr/bin/env node
/**
 * Patches @orderly.network/hooks to fix ERR_REQUIRE_ESM on Vercel.
 *
 * The hooks CJS bundle does `require('ramda/es/pathOr')`, but ramda/es is
 * an ES Module directory ("type": "module").  Vercel's serverless runtime
 * loads the file directly from node_modules (instead of the Vite SSR
 * bundle), so the require() of ESM fails at runtime.
 *
 * Fix: rewrite `require('ramda/es/…')` → `require('ramda/src/…')` which is
 * the CJS equivalent that ramda ships.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetFile = path.resolve(
  __dirname,
  '../node_modules/@orderly.network/hooks/dist/index.js',
);

if (!fs.existsSync(targetFile)) {
  console.log('[patch-ramda-esm] hooks/dist/index.js not found – skipping.');
  process.exit(0);
}

let content = fs.readFileSync(targetFile, 'utf8');
const original = content;

// require('ramda/es/…') → require('ramda/src/…')
content = content.replace(
  /require\(\s*['"]ramda\/es\//g,
  "require('ramda/src/",
);

if (content !== original) {
  fs.writeFileSync(targetFile, content, 'utf8');
  console.log('[patch-ramda-esm] ✅ Patched ramda/es → ramda/src in hooks/dist/index.js');
} else {
  console.log('[patch-ramda-esm] No changes needed (already patched).');
}
