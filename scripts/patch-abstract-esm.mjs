#!/usr/bin/env node
/**
 * This script patches @abstract-foundation packages to fix ESM import issues.
 * The packages have relative imports without .js extensions which breaks Node.js ESM resolution.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const nodeModulesPath = path.resolve(__dirname, '../node_modules');

const dirsToFix = [
  '@abstract-foundation/agw-client/dist/esm',
  '@orderly.network/wallet-connector-privy/node_modules/@abstract-foundation/agw-react/dist/esm',
  '@abstract-foundation/agw-react/dist/esm',
];

function addJsExtensions(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Match relative imports without .js extension
  // from './something' or from '../something' but not from './something.js'
  const importRegex = /from\s+['"](\.[^'"]+)(?<!\.js)['"]/g;
  
  content = content.replace(importRegex, (match, importPath) => {
    // Check if it already ends with .js
    if (importPath.endsWith('.js')) {
      return match;
    }
    modified = true;
    return `from '${importPath}.js'`;
  });

  // Also handle export from statements
  const exportRegex = /export\s+.*\s+from\s+['"](\.[^'"]+)(?<!\.js)['"]/g;
  
  content = content.replace(exportRegex, (match, importPath) => {
    if (importPath.endsWith('.js')) {
      return match;
    }
    modified = true;
    return match.replace(importPath, `${importPath}.js`);
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory not found: ${dirPath}`);
    return 0;
  }

  let patchedCount = 0;
  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    
    if (file.isDirectory()) {
      patchedCount += processDirectory(fullPath);
    } else if (file.name.endsWith('.js')) {
      if (addJsExtensions(fullPath)) {
        patchedCount++;
      }
    }
  }

  return patchedCount;
}

console.log('Patching @abstract-foundation ESM imports...');

let totalPatched = 0;
for (const dir of dirsToFix) {
  const fullPath = path.join(nodeModulesPath, dir);
  const patched = processDirectory(fullPath);
  if (patched > 0) {
    console.log(`Patched ${patched} files in ${dir}`);
    totalPatched += patched;
  }
}

if (totalPatched > 0) {
  console.log(`✅ Total patched: ${totalPatched} files`);
} else {
  console.log('No files needed patching (already patched or not found)');
}
