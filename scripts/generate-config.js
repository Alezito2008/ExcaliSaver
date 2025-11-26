#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import 'dotenv/config'

const __dirname = import.meta.dirname;
const url = process.env.EXCALISAVER_URL;

if (!url) {
  console.error('ERROR: EXCALISAVER_URL is not set in environment. Create a .env file with EXCALISAVER_URL.');
  process.exit(1);
}

const outDir = path.join(__dirname, '..', 'extension', 'assets', 'panel');
const outFile = path.join(outDir, 'config.js');

const content = `const EXCALISAVER_URL = ${JSON.stringify(url)};\n`;

try {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, content, { encoding: 'utf8' });
  console.log(`Wrote config to ${outFile}`);
} catch (e) {
  console.error('Failed to write config:', e.message);
  process.exit(2);
}
