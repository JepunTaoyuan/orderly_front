#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const nodeModulesPath = path.resolve(__dirname, '../node_modules');

function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.join(dirPath, file.name);
        if (file.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.name.endsWith('.js') || file.name.endsWith('.mjs')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('ramda/es')) {
                let patched = content.replace(/require\(['"]ramda\/es([^'"]*)['"]\)/g, "require('ramda/src$1')");
                patched = patched.replace(/from\s+['"]ramda\/es([^'"]*)['"]/g, "from 'ramda/src$1'");
                if (content !== patched) {
                    fs.writeFileSync(fullPath, patched, 'utf8');
                    console.log(`Patched ramda/es in ${fullPath}`);
                }
            }
        }
    }
}

console.log('Patching ramda/es requirements in @orderly.network packages...');
processDirectory(path.join(nodeModulesPath, '@orderly.network'));
console.log('Done patching ramda/es.');
