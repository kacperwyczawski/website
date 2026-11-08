// scripts/build-precomputed-v2.ts
import { writeFileSync } from "fs";
import { deflateSync } from "zlib";

const baseMeta = {
  cols: 200,
  fps: 15,
  ground: "#09090b",
  palette: [
    "#18181b",
    "#232326",
    "#303033",
    "#414143",
    "#555556",
    "#6b6a69",
    "#83817d",
    "#9c9993",
    "#b6b2aa",
    "#cfcac1",
    "#e6e1d8",
    "#f7f4ee",
    "#0c1120",
    "#131a2e",
    "#1b2540",
    "#262f4a",
    "#dfe9ff",
    "#0a2259",
    "#0f2f72",
    "#15408c",
    "#1d53a6",
    "#2a69bf",
    "#4386d3",
    "#6eaeea",
    "#a8d3f6",
    "#e8f0fa",
    "#c2d0e3",
    "#8b9fbc",
    "#2f4a26",
    "#3b5a2c",
    "#5b7238",
    "#7a9150",
    "#77783f",
    "#8f8550",
    "#a8955e",
    "#6b5634",
    "#b9774a",
    "#8a4838",
  ],
};

const SUN = (() => {
  const v = [0.94, 0.14, -0.3];
  const l = Math.hypot(...v);
  return v.map((c) => c / l);
})();

function hash(x: number, y: number) {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function noise(x: number, y: number, period: number) {
  const xi = Math.floor(x),
    yi = Math.floor(y);
  const fx = x - xi,
    fy = y - yi;
  const u = fx * fx * (3 - 2 * fx),
    v = fy * fy * (3 - 2 * fy);
  let x0 = xi,
    x1 = xi + 1;
  if (period) {
    x0 = ((xi % period) + period) % period;
    x1 = (x0 + 1) % period;
  }
  const a = hash(x0, yi),
    b = hash(x1, yi),
    c = hash(x0, yi + 1),
    d = hash(x1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number, octaves: number, period: number) {
  let s = 0,
    n = 0,
    amp = 0.5,
    f = 1;
  for (let i = 0; i < octaves; i++) {
    s += amp * noise(x * f, y * f, period * f);
    n += amp;
    amp *= 0.5;
    f *= 2;
  }
  return s / n;
}

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number) => {
  const k = clamp((v - a) / (b - a));
  return k * k * (3 - 2 * k);
};
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const hex = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16) / 255);

const bowl = (q: number, r: number) => r * ((q < 1 ? -0.36 * (1 - q * q) : 0) + 0.14 * Math.exp(-(((q - 1) / 0.25) ** 2)));

function craters(X: number, Z: number, cell: number, salt: number, r0: number, r1: number, p: number) {
  const ci = Math.floor(X / cell),
    cj = Math.floor(Z / cell);
  let h = 0;
  for (let j = cj - 1; j <= cj + 1; j++) {
    for (let i = ci - 1; i <= ci + 1; i++) {
      if (hash(i + salt, j - salt) > p) continue;
      const cx = (i + hash(i, j + salt * 3)) * cell,
        cz = (j + hash(i + salt * 5, j)) * cell;
      const e = hash(j + salt, i - salt * 7);
      const r = cell * (r0 + (r1 - r0) * e * e);
      const dx = X - cx,
        dz = Z - cz,
        d2 = dx * dx + dz * dz;
      if (d2 > 4 * r * r) continue;
      h += bowl(Math.sqrt(d2) / r, r) * 0.95;
    }
  }
  return h;
}

const ROCKS = [
  [30, 50, 2.4],
  [62, 63, 1.8],
  [12, 70, 1.3],
  [-4, 45, 1.2],
  [90, 55, 1.6],
  [46, 90, 1.4],
];

function height(X: number, Z: number) {
  let h = 6 * fbm(X * 0.006 + 50, Z * 0.006 + 50, 3, 0) + 0.6 * fbm(X * 0.04, Z * 0.04, 2, 0);
  if (Z > 150) {
    const lift = smooth(150, 300, Z);
    const m = 1 - Math.abs(2 * fbm(X * 0.006 + 7, Z * 0.006, 4, 0) - 1);
    h += lift * (28 * Math.exp(-(((X + 260) / 230) ** 2)) + 45 * (m * m - 0.35));
    const ridge = Math.exp(-(((Z - 205) / 20) ** 2)) * Math.exp(-(((X + 140) / 130) ** 2));
    h += ridge * 22 * (0.35 + fbm(X * 0.018 + 3, Z * 0.01, 3, 0));
  }
  if (Z > 90) h += craters(X, Z, 110, 11, 0.14, 0.34, 0.55) * smooth(90, 150, Z);
  if (Z < 300) h += craters(X, Z, 34, 23, 0.12, 0.36, 0.85);
  if (Z < 170) h += craters(X, Z, 10, 37, 0.12, 0.34, 0.85) * smooth(170, 110, Z);
  {
    const dx = X + 24,
      dz = Z - 58;
    const q = Math.sqrt(dx * dx + dz * dz) / 16;
    if (q < 2) h += bowl(q, 16);
  }
  if (Z < 90) {
    const c = 5,
      ci = Math.floor(X / c),
      cj = Math.floor(Z / c);
    if (hash(ci + 91, cj) < 0.14) {
      const bx = (ci + 0.2 + 0.6 * hash(ci, cj + 92)) * c,
        bz = (cj + 0.2 + 0.6 * hash(ci + 93, cj)) * c;
      const br = 0.3 + 0.5 * hash(ci + 94, cj + 95) ** 2;
      const d2 = ((X - bx) ** 2 + (Z - bz) ** 2) / (br * br);
      if (d2 < 4) h += br * 0.9 * Math.exp(-d2 * 1.4);
    }
    for (const [bx, bz, br] of ROCKS) {
      const d2 = ((X - bx) ** 2 + (Z - bz) ** 2) / (br * br);
      if (d2 < 1) h += br * (0.85 + 0.3 * noise(X * 1.3, Z * 1.3, 0)) * Math.sqrt(1 - d2);
    }
  }
  return h;
}

// 1. Earth Textures
console.log("Generating Earth textures...");
const TW = 192,
  TH = 96;
const tr = new Float32Array(TW * TH),
  tg = new Float32Array(TW * TH),
  tb = new Float32Array(TW * TH),
  sea = new Float32Array(TW * TH);
const cloud = new Float32Array(TW * TH);
const storms = [
  [0.9, 0.8, 1],
  [3.1, -0.85, -1],
  [4.6, 0.62, 1],
  [1.9, 0.25, 1],
  [5.6, -0.55, -1],
];
const elev = new Float32Array(TW * TH);
for (let j = 0; j < TH; j++) {
  const v = (j + 0.5) / TH,
    lat = (0.5 - v) * Math.PI,
    al = Math.abs(lat);
  for (let i = 0; i < TW; i++) {
    const u = i / TW,
      lon = u * Math.PI * 2,
      t = j * TW + i;
    const wx = fbm(u * 6, v * 3 + 9, 3, 6);
    elev[t] = fbm(u * 8 + 1.6 * wx, v * 4, 5, 8) - 0.04 * smooth(1.2, 1.5, al);
    let cx = u * 14,
      cy = v * 7;
    for (const [slon, slat, spin] of storms) {
      let dl = lon - slon;
      dl -= Math.round(dl / (Math.PI * 2)) * Math.PI * 2;
      const lx = dl * Math.cos(lat),
        ly = lat - slat;
      const dd = Math.hypot(lx, ly);
      const a = spin * 5 * Math.exp(-dd / 0.2);
      if (a * spin > 0.02) {
        const ca = Math.cos(a),
          sa = Math.sin(a);
        cx += ((lx * ca - ly * sa - lx) / (Math.PI * 2)) * 14;
        cy -= ((lx * sa + ly * ca - ly) / Math.PI) * 7;
      }
    }
    const q = fbm(cx * 0.5 + 3, cy * 1.2, 3, 7);
    const n0 = fbm(cx + 1.6 * q, cy * 1.3 + 0.5 * q, 5, 14);
    const n = 0.4 * n0 + 0.6 * (1 - Math.abs(2 * fbm(cx * 1.5 + 2.2 * q, cy * 1.6 + 9, 4, 21) - 1));
    const belt =
      0.05 * Math.exp(-((lat / 0.12) ** 2)) - 0.07 * Math.exp(-(((al - 0.42) / 0.16) ** 2)) + 0.05 * Math.exp(-(((al - 0.95) / 0.25) ** 2));
    cloud[t] = n + belt;
  }
}
const quantile = (A: Float32Array, p: number) => {
  const s = Float32Array.from(A).sort();
  return s[Math.floor(p * (s.length - 1))];
};
const shore = quantile(elev, 0.7),
  c0 = quantile(cloud, 0.6),
  c1 = quantile(cloud, 0.86);
for (let j = 0; j < TH; j++) {
  const v = (j + 0.5) / TH,
    lat = (0.5 - v) * Math.PI,
    al = Math.abs(lat);
  for (let i = 0; i < TW; i++) {
    const u = i / TW,
      t = j * TW + i,
      e = elev[t];
    const land = smooth(shore - 0.004, shore + 0.006, e);
    const ice = smooth(1.22, 1.32, al + 0.12 * fbm(u * 12, v * 6, 2, 12));
    const grain = fbm(u * 36 + 2, v * 18, 3, 36) - 0.5;
    const arid = clamp(
      Math.exp(-(((al - 0.4) / 0.22) ** 2)) * (0.1 + 1.2 * fbm(u * 10 + 4, v * 5, 3, 10)) + (e - shore - 0.04) * 4 + 0.8 * grain,
    );
    const relief = 1 + 1.2 * grain - 2.5 * Math.max(0, e - shore - 0.08);
    let r = mix(0.13, 0.4, arid) * relief,
      g = mix(0.25, 0.34, arid) * relief,
      b = mix(0.08, 0.19, arid) * relief;
    const shelf = smooth(shore - 0.06, shore, e);
    const or = mix(0.025, 0.07, shelf),
      og = mix(0.11, 0.3, shelf),
      ob = mix(0.38, 0.62, shelf);
    r = mix(or, r, land);
    g = mix(og, g, land);
    b = mix(ob, b, land);
    r = mix(r, 0.92, ice);
    g = mix(g, 0.95, ice);
    b = mix(b, 0.99, ice);
    ((tr[t] = r), (tg[t] = g), (tb[t] = b), (sea[t] = (1 - land) * (1 - ice)));
    cloud[t] = smooth(c0, c1, cloud[t]);
  }
}

const u8Textures = new Uint8Array(TW * TH * 5);
for (let i = 0; i < TW * TH; i++) {
  u8Textures[i] = Math.round(clamp(tr[i]) * 255);
  u8Textures[TW * TH + i] = Math.round(clamp(tg[i]) * 255);
  u8Textures[TW * TH * 2 + i] = Math.round(clamp(tb[i]) * 255);
  u8Textures[TW * TH * 3 + i] = Math.round(clamp(sea[i]) * 255);
  u8Textures[TW * TH * 4 + i] = Math.round(clamp(cloud[i]) * 255);
}
const rawTexturesB64 = Buffer.from(u8Textures).toString("base64");

// 2. Generate Base Moon Terrain aligned to desktop baseline (H = 122, extraSky = 10)
console.log("Generating base Moon terrain aligned to desktop baseline (H=122, extraSky=10)...");
const BASE_EXTRA_SKY = 10;
const H_BASE = 122;
const W = 200;
const N_BASE = W * H_BASE;
const EYE = 42 + BASE_EXTRA_SKY;
const F = 112;
const CAM_H = 20;
const RM = 1500;
const ZMAX = 520;

const ground = new Uint8Array(N_BASE);
const baseTop = new Int16Array(W).fill(H_BASE);
const gx = new Float32Array(N_BASE),
  gz = new Float32Array(N_BASE),
  gy = new Float32Array(N_BASE);
const camY = height(0, 7) + CAM_H;

for (let c = 0; c < W; c++) {
  const dir = (c + 0.5 - W / 2) / F;
  let topR = H_BASE,
    Z = 26,
    prevY = 0,
    prevZ = 0,
    prevF = 1e9;
  while (Z < ZMAX && topR > 0) {
    const X = dir * Z;
    const hy = height(X, Z);
    const Y = hy - (Z * Z) / (2 * RM);
    const yf = EYE - (F * (Y - camY)) / Z;
    let r0 = Math.max(0, Math.ceil(yf - 0.5));
    for (let r = r0; r < topR; r++) {
      const a = prevF > yf + 1e-6 ? clamp((prevF - (r + 0.5)) / (prevF - yf)) : 1;
      const k = r * W + c;
      ground[k] = 1;
      gz[k] = prevZ ? mix(prevZ, Z, a) : Z;
      gx[k] = dir * gz[k];
      gy[k] = prevZ ? mix(prevY, hy, a) : hy;
    }
    if (r0 < topR) topR = r0;
    ((prevF = yf), (prevY = hy), (prevZ = Z));
    Z += 0.03 + Z * 0.012;
  }
  baseTop[c] = topR;
}

const P = baseMeta.palette.map(hex);
const COVER = [0, 0.3, 0.6, 1];
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16 - 0.47);
const lut = new Uint8Array(32768).fill(255);
const nearest = (r: number, g: number, b: number) => {
  const k = (Math.min(31, (r * 31.99) | 0) << 10) | (Math.min(31, (g * 31.99) | 0) << 5) | Math.min(31, (b * 31.99) | 0);
  if (lut[k] !== 255) return lut[k];
  let best = 0,
    bd = 1e9;
  for (let i = 0; i < P.length; i++) {
    const dr = P[i][0] - r,
      dg = P[i][1] - g,
      db = P[i][2] - b;
    const d = 0.3 * dr * dr + 0.5 * dg * dg + 0.2 * db * db;
    if (d < bd) ((bd = d), (best = i));
  }
  return (lut[k] = best);
};

const basePacked = new Uint8Array(N_BASE);
for (let r = 0; r < H_BASE; r++) {
  for (let x = 0; x < W; x++) {
    const k = r * W + x;
    if (!ground[k]) continue;
    const fromBottom = H_BASE - 1 - r;
    let bottomFade = 1;
    if (fromBottom < 10) {
      const cut = 2 + 5 * noise(x * 0.08, 43, 0) + 2.5 * hash(x * 5 + 3, 79);
      if (fromBottom < cut) {
        ground[k] = 0;
        continue;
      }
      const edgeDist = fromBottom - cut;
      if (edgeDist < 2.5 && hash(x * 17 + 1, r * 23 + 7) > edgeDist / 2.5) {
        ground[k] = 0;
        continue;
      }
      bottomFade = Math.min(1, Math.max(0.15, edgeDist / 3.5));
    }
    const X = gx[k],
      Z = gz[k],
      Y = gy[k];
    const e = 0.1 + Z * 0.004;
    const hx = (height(X + e, Z) - height(X - e, Z)) / (2 * e);
    const hz = (height(X, Z + e) - height(X, Z - e)) / (2 * e);
    const nl = Math.hypot(hx, 1, hz);
    const lam = (-hx * SUN[0] + SUN[1] - hz * SUN[2]) / nl;
    const vx = -X,
      vy = camY - Y,
      vz = -Z,
      vl = Math.hypot(vx, vy, vz);
    const mu = Math.max(0.02, (-hx * vx + vy - hz * vz) / (nl * vl));
    let lit = 0;
    if (lam > 0) {
      lit = 1;
      let s = 0.1 + Z * 0.003;
      while (s < 120) {
        const px = X + SUN[0] * s,
          pz = Z + SUN[2] * s,
          py = Y + SUN[1] * s;
        const d = py - height(px, pz);
        if (d < 0) {
          lit = 0;
          break;
        }
        lit = Math.min(lit, (d * 30) / s);
        s += 0.05 + s * 0.2;
      }
      lit = smooth(0, 1, lit);
    }
    const albedo =
      0.5 +
      0.9 * fbm(X * 0.025 + 3, Z * 0.025, 3, 0) +
      0.3 * (fbm(X * 0.35, Z * 0.35, 2, 0) - 0.5) -
      0.22 * smooth(0.46, 0.64, fbm(X * 0.0035, Z * 0.0035 + 20, 3, 0));
    const ls = lam > 0 ? ((0.2 * lam) / (lam + mu) + 2.6 * lam) * lit : 0;
    const vig = 1 - 0.3 * smooth(95 + BASE_EXTRA_SKY, 114 + BASE_EXTRA_SKY, r) * smooth(30, 100, Math.abs(x - 100));
    let b = Math.pow((1 - Math.exp(-ls * 1.5)) * albedo, 1.0) * vig * bottomFade;
    const crest = r - baseTop[x];
    if (crest < 2 && lit > 0.2) b = Math.max(b, (crest ? 0.55 : 0.85) * albedo * bottomFade);
    const fill = lit > 0.02 || b > 0.03 ? 0.008 + 0.007 * clamp(-hz / nl + 0.5) : 0;
    const cr = b * 1.0 + fill * 0.75 * bottomFade;
    const cg = b * 0.95 + fill * 0.85 * bottomFade;
    const cb = b * 0.86 + fill * 1.2 * bottomFade;
    const scap = 0.42 + 0.62 * b;

    const peak = Math.max(cr, cg, cb, 1e-4);
    const level = clamp(Math.pow(peak, 0.85) * 0.95);
    const step = Math.max(0, Math.min(3, Math.round(level * 3 + BAYER[(r & 3) * 4 + (x & 3)])));
    const want = step ? Math.min(1, (level + 0.06) / COVER[step]) : 0;
    const s = Math.min(scap, 0.3 + 0.7 * want) / peak;
    const col = nearest(clamp(cr * s), clamp(cg * s), clamp(cb * s));
    basePacked[k] = (col << 2) | step;
  }
}

// Find min row of ground in base
let minGroundRow = H_BASE;
for (let c = 0; c < W; c++) {
  minGroundRow = Math.min(minGroundRow, baseTop[c]);
}
console.log("Min ground row at extraSky=10:", minGroundRow); // row ~49

// Ground data from minGroundRow to H_BASE
const groundData = basePacked.slice(minGroundRow * W);
const groundDataB64 = Buffer.from(groundData).toString("base64");

// Output clean earthrise-data.ts
const ts = `// Auto-generated precomputed assets for Earthrise
// Generated by scripts/build-precomputed.ts

export const BASE_W = ${W};
export const BASE_H = ${H_BASE};
export const BASE_EXTRA_SKY = ${BASE_EXTRA_SKY};
export const MIN_GROUND_ROW = ${minGroundRow};

// Base top per column (200 bytes): top row of ground when extraSky = 10
export const BASE_TOP: number[] = ${JSON.stringify(Array.from(baseTop))};

// Ground colors and densities from row ${minGroundRow} to ${H_BASE} (${groundData.length} bytes)
export const GROUND_DATA_B64 = "${groundDataB64}";

// Earth textures (192 x 96 x 5 bytes: tr, tg, tb, sea, cloud)
export const EARTH_TEX_B64 = "${rawTexturesB64}";
`;

writeFileSync("./src/components/earthrise-data.ts", ts);
console.log("Done writing src/components/earthrise-data.ts!");
