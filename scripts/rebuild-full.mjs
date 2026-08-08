#!/usr/bin/env node
// rebuild-full.mjs — объединяет все шарды в полный снапшот full-<today>.json,
// удаляет старые снапшоты (оставляет 2 последних).
import fs from 'fs';
import path from 'path';

const SHARDS_DIR = 'shards';
const today = new Date().toISOString().slice(0, 10);

const seen = new Map(); // qhash -> record
if (fs.existsSync(SHARDS_DIR)) {
  for (const f of fs.readdirSync(SHARDS_DIR)) {
    if (!f.endsWith('.json')) continue;
    const arr = JSON.parse(fs.readFileSync(path.join(SHARDS_DIR, f), 'utf8'));
    for (const r of arr) {
      const h = r.q.toLowerCase().replace(/\s+/g, ' ').trim();
      if (!seen.has(h)) seen.set(h, r);
    }
  }
}
const all = [...seen.values()];
fs.writeFileSync(`full-${today}.json`, JSON.stringify(all));

const fulls = fs.readdirSync('.').filter(f => /^full-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
while (fulls.length > 2) {
  fs.unlinkSync(fulls.shift());
}
console.log(`full-${today}.json: ${all.length} records`);
