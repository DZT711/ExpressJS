const N = parseInt(process.env.N || '500', 10);
const C = parseInt(process.env.C || '50', 10);
const BASE = process.env.URL || 'http://localhost:3000';
const SHOW_BODY = process.env.SHOW_BODY !== '0'; // set SHOW_BODY=0 to hide bodies
const VERIFY = process.env.VERIFY !== '0';       // set VERIFY=0 to skip body checks

const routes = [
  { method: 'GET',    path: '/',      expectBody: /Welcome to Express/, expectStatus: 200 },
  { method: 'POST',   path: '/',      expectBody: 'POST',   expectStatus: 200 },
  { method: 'PUT',    path: '/',      expectBody: 'PUT',    expectStatus: 200 },
  { method: 'DELETE', path: '/',      expectBody: 'DELETE', expectStatus: 200 },
  { method: 'GET',    path: '/users', expectBody: 'respond with a resource', expectStatus: 200 },
  { method: 'POST',   path: '/users', expectBody: 'POST',   expectStatus: 200 },
  { method: 'PUT',    path: '/users', expectBody: 'PUT',    expectStatus: 200 },
  { method: 'DELETE', path: '/users', expectBody: 'DELETE', expectStatus: 200 },
];

const counts = {};      // per-route stats
const bodiesSeen = {};  // first body seen per "METHOD path [status]"
for (const r of routes) counts[`${r.method} ${r.path}`] = { ok: 0, fail: 0, lats: [] };

const failures = [];
let done = 0, pending = 0;
const t0 = Date.now();

function shortBody(text, max = 120) {
  const oneLine = text.replace(/\s+/g, ' ').trim();
  return oneLine.length > max ? oneLine.slice(0, max) + `…(+${oneLine.length - max} chars)` : oneLine;
}

function bodyMatches(expect, actual) {
  if (expect instanceof RegExp) return expect.test(actual);
  return actual.trim() === expect || actual.includes(expect);
}

async function runOne(idx) {
  const route = routes[idx % routes.length];
  const key = `${route.method} ${route.path}`;
  const s = Date.now();
  try {
    const res = await fetch(BASE + route.path, { method: route.method });
    const body = await res.text();
    const lat = Date.now() - s;
    counts[key].lats.push(lat);

    const bodyKey = `${key} [${res.status}]`;
    if (!(bodyKey in bodiesSeen)) bodiesSeen[bodyKey] = shortBody(body);

    let problem = null;
    if (res.status !== route.expectStatus) problem = `status ${res.status} != expected ${route.expectStatus}`;
    else if (VERIFY && !bodyMatches(route.expectBody, body))
      problem = `body mismatch (expected ${route.expectBody}, got "${shortBody(body, 80)}")`;

    if (problem) {
      counts[key].fail++;
      if (failures.length < 20) failures.push(`FAIL ${key} -> ${problem}`);
    } else counts[key].ok++;
  } catch (e) {
    counts[key].fail++;
    if (failures.length < 20) failures.push(`ERR ${key}: ${e.message}`);
  } finally {
    done++;
    if (done % 100 === 0 || done === N) console.log(`progress: ${done}/${N}`);
  }
}

const workers = Array.from({ length: C }, async () => {
  while (true) {
    if (done + pending >= N) break;
    const idx = done + pending;
    pending++;
    try { await runOne(idx); } finally { pending--; }
  }
});
await Promise.all(workers);

const tot = (Date.now() - t0) / 1000;
const allLats = Object.values(counts).flatMap(c => c.lats).sort((a, b) => a - b);
const pct = (p) => allLats.length ? allLats[Math.min(allLats.length - 1, Math.floor(allLats.length * p))] : 0;
const totOk = Object.values(counts).reduce((a, c) => a + c.ok, 0);
const totFail = Object.values(counts).reduce((a, c) => a + c.fail, 0);

console.log('\n================ SUMMARY ================');
console.log(`target: ${BASE} | requests: ${N} | concurrency: ${C} | time: ${tot.toFixed(2)}s | rps: ${(N / tot).toFixed(1)}`);
console.log(`passed: ${totOk} | failed: ${totFail}`);
console.log(`latency overall: min ${allLats[0]}ms | avg ${(allLats.reduce((a, b) => a + b, 0) / Math.max(1, allLats.length)).toFixed(1)}ms | p50 ${pct(0.5)}ms | p95 ${pct(0.95)}ms | max ${allLats[allLats.length - 1]}ms`);

console.log('\n============= PER-ROUTE TABLE =============');
console.log('METHOD PATH    |  ok fail | avg-ms p95-ms | response body (first seen)');
console.log('---------------|----------|---------------|--------------------------------');
for (const r of routes) {
  const key = `${r.method} ${r.path}`;
  const c = counts[key];
  const l = [...c.lats].sort((a, b) => a - b);
  const avg = l.length ? (l.reduce((a, b) => a + b, 0) / l.length).toFixed(1) : '-';
  const p95 = l.length ? l[Math.floor(l.length * 0.95)] : '-';
  const bodies = Object.entries(bodiesSeen).filter(([k]) => k === `${key} [200]` || k.startsWith(`${key} [`)).map(([k, b]) => `${k}: "${b}"`).join(' | ') || '(no response)';
  console.log(`${key.padEnd(14)} | ${String(c.ok).padStart(4)} ${String(c.fail).padStart(4)} | ${String(avg).padStart(6)} ${String(p95).padStart(6)} | ${SHOW_BODY ? bodies : '(hidden, SHOW_BODY=0)'}`);
}

if (failures.length) {
  console.log('\n============= FAILURES (first 20) ===========');
  failures.forEach(f => console.log(f));
  if (totFail > failures.length) console.log(`… +${totFail - failures.length} more`);
} else {
  console.log('\nAll response bodies matched expectations ✔');
}

