const fs = require('node:fs');
const assert = require('node:assert/strict');
const file = 'clean-google-search.user.js';
const before = fs.readFileSync(file, 'utf8');
const end = '// ==/UserScript==';
const body = before.slice(before.indexOf(end) + end.length);
const domains = [...new Set(fs.readFileSync('tests/google-domains.txt', 'utf8').trim().split(/\s+/).map(s => s.replace(/^\./, '')))];
assert(domains.length > 100);
assert(domains.every(d => /^google\.[a-z.]+$/.test(d)));
const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#16324f"/><circle cx="27" cy="27" r="15" fill="none" stroke="#ffffff" stroke-width="5"/><path d="M38 38L51 51" stroke="#5eead4" stroke-width="6" stroke-linecap="round"/><path d="M20 21h14M20 27h11M20 33h8" stroke="#5eead4" stroke-width="3" stroke-linecap="round"/></svg>';
fs.mkdirSync('assets', { recursive: true });
fs.writeFileSync('assets/google-sade-arama.svg', svg);
const metadata = [
  '// ==UserScript==',
  '// @name         Google Pure Search',
  '// @name:tr      Google Pure Search — Sade Arama',
  '// @namespace    http://tampermonkey.net/',
  '// @version      1.0.0',
  "// @description  Hides AI features in Google Search and restores available original titles and snippets of automatically translated results.",
"// @description:tr Google aramasında AI alanlarını gizler; otomatik çevrilen başlık ve özetlerin mevcut orijinallerini gösterir.",
  '// @icon         data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64'),
  "// @include      /^https?:\\/\\/(?:www[.])?google[.](?:com|cat|[a-z]{2}|(?:com|co)[.][a-z]{2})\\/search(?:[?#].*)?$/",
  '// @run-at       document-start',
  '// @noframes',
  '// @grant        none',
  end
].join(String.fromCharCode(10));
fs.writeFileSync(file, metadata + body);
const after = fs.readFileSync(file, 'utf8');
assert.equal(after.slice(after.indexOf(end) + end.length), body);
for (const d of ['google.com', 'google.com.tr', 'google.co.uk', 'google.de', 'google.co.jp']) assert(domains.includes(d));
console.log(JSON.stringify({domains: domains.length, name:'Google Sade Arama', version:'1.0.0', runtimeUnchanged:true, embeddedIcon:true}));
