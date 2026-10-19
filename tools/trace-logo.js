const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('assets/ui/logo-kamu.png');
let pos = 8;
const idats = [];
let width = 0;
let height = 0;

while (pos < buf.length) {
  const len = buf.readUInt32BE(pos);
  const type = buf.toString('ascii', pos + 4, pos + 8);
  if (type === 'IHDR') {
    width = buf.readUInt32BE(pos + 8);
    height = buf.readUInt32BE(pos + 12);
  } else if (type === 'IDAT') {
    idats.push(buf.slice(pos + 8, pos + 8 + len));
  }
  pos += 12 + len;
}

const decompressed = zlib.inflateSync(Buffer.concat(idats));
const raw = Buffer.alloc(width * height * 4);
const stride = 1 + width * 4;

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

for (let y = 0; y < height; y++) {
  const filter = decompressed[y * stride];
  const scanline = decompressed.slice(y * stride + 1, (y + 1) * stride);
  const rawLine = raw.slice(y * width * 4, (y + 1) * width * 4);
  for (let x = 0; x < width * 4; x++) {
    const rawVal = scanline[x];
    const a = x >= 4 ? rawLine[x - 4] : 0;
    const b = y > 0 ? raw[(y - 1) * width * 4 + x] : 0;
    const c = (y > 0 && x >= 4) ? raw[(y - 1) * width * 4 + x - 4] : 0;
    let val = 0;
    if (filter === 0) val = rawVal;
    else if (filter === 1) val = (rawVal + a) & 0xff;
    else if (filter === 2) val = (rawVal + b) & 0xff;
    else if (filter === 3) val = (rawVal + Math.floor((a + b) / 2)) & 0xff;
    else if (filter === 4) val = (rawVal + paeth(a, b, c)) & 0xff;
    rawLine[x] = val;
  }
}

function traceMask(fn, scale) {
  const W = Math.floor(width / scale);
  const H = Math.floor(height / scale);
  const grid = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * scale * width + x * scale) * 4;
      grid[y * W + x] = fn(raw[idx], raw[idx + 1], raw[idx + 2], raw[idx + 3]) ? 1 : 0;
    }
  }

  const adj = new Map();
  function addEdge(x1, y1, x2, y2) {
    const k1 = x1 + ',' + y1;
    if (!adj.has(k1)) adj.set(k1, []);
    adj.get(k1).push([x2, y2]);
  }

  for (let y = 0; y <= H; y++) {
    for (let x = 0; x <= W; x++) {
      const up = (y > 0 && x < W) ? grid[(y - 1) * W + x] : 0;
      const down = (y < H && x < W) ? grid[y * W + x] : 0;
      const left = (x > 0 && y < H) ? grid[y * W + x - 1] : 0;
      const right = (x < W && y < H) ? grid[y * W + x] : 0;

      if (down && !up) addEdge(x, y, x + 1, y);
      else if (!down && up) addEdge(x + 1, y, x, y);

      if (right && !left) addEdge(x, y + 1, x, y);
      else if (!right && left) addEdge(x, y, x, y + 1);
    }
  }

  const visitedEdges = new Set();
  const paths = [];

  for (const [startNode, neighbors] of adj.entries()) {
    for (const nextNode of neighbors) {
      const edgeKey = startNode + '->' + nextNode[0] + ',' + nextNode[1];
      if (visitedEdges.has(edgeKey)) continue;

      const loop = [];
      let cur = startNode.split(',').map(Number);
      loop.push(cur);

      let target = nextNode;
      while (target) {
        const ek = cur[0] + ',' + cur[1] + '->' + target[0] + ',' + target[1];
        visitedEdges.add(ek);
        cur = target;
        loop.push(cur);

        if (cur[0] === loop[0][0] && cur[1] === loop[0][1]) break;

        const cand = adj.get(cur[0] + ',' + cur[1]) || [];
        target = null;
        for (const c of cand) {
          const k = cur[0] + ',' + cur[1] + '->' + c[0] + ',' + c[1];
          if (!visitedEdges.has(k)) {
            target = c;
            break;
          }
        }
      }

      if (loop.length > 2) {
        const simplified = [loop[0]];
        for (let i = 1; i < loop.length - 1; i++) {
          const prev = simplified[simplified.length - 1];
          const curr = loop[i];
          const nxt = loop[i + 1];
          const dx1 = curr[0] - prev[0];
          const dy1 = curr[1] - prev[1];
          const dx2 = nxt[0] - curr[0];
          const dy2 = nxt[1] - curr[1];
          if ((dx1 === 0 && dx2 === 0) || (dy1 === 0 && dy2 === 0)) continue;
          simplified.push(curr);
        }
        if (simplified.length >= 3) paths.push(simplified);
      }
    }
  }

  let d = '';
  for (const p of paths) {
    d += 'M' + p[0][0] + ' ' + p[0][1];
    for (let i = 1; i < p.length; i++) {
      d += 'L' + p[i][0] + ' ' + p[i][1];
    }
    d += 'Z';
  }

  return { W, H, paths, d };
}

const sil = traceMask((r, g, b, a) => a > 30, 2);
const greenBody = traceMask((r, g, b, a) => a > 30 && (g > 35 && (g > r * 0.9 || g > b * 0.9)), 2);
const brightLime = traceMask((r, g, b, a) => a > 30 && g > 185 && r > 110, 2);
const whiteCores = traceMask((r, g, b, a) => a > 30 && r > 210 && g > 235 && b > 180, 2);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sil.W} ${sil.H}" width="${sil.W}" height="${sil.H}">
  <defs>
    <linearGradient id="soulEmeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#daf38d"/>
      <stop offset="28%" stop-color="#98dc42"/>
      <stop offset="65%" stop-color="#3eb84e"/>
      <stop offset="100%" stop-color="#15642a"/>
    </linearGradient>
    <filter id="soulAuraGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <g id="logoAuraGroup" class="logo-aura-layer" opacity="0.55" filter="url(#soulAuraGlow)">
    <path d="${sil.d}" fill="#4ade80"/>
  </g>

  <g id="logoOutlineGroup" class="logo-outline-layer">
    <path d="${sil.d}" fill="#01100e"/>
  </g>

  <g id="logoBodyGroup" class="logo-body-layer">
    <path d="${greenBody.d}" fill="url(#soulEmeraldGrad)" fill-rule="evenodd"/>
  </g>

  <g id="logoHighlightGroup" class="logo-highlight-layer" opacity="0.92">
    <path d="${brightLime.d}" fill="#d4f686" fill-rule="evenodd"/>
  </g>

  <g id="logoSparklesGroup" class="logo-sparkles-layer">
    <path d="${whiteCores.d}" fill="#ffffff" fill-rule="evenodd"/>
  </g>
</svg>`;

fs.writeFileSync('lobby/assets/logo-soul-essence.svg', svg);
fs.writeFileSync('assets/ui/logo-soul-essence.svg', svg);
console.log('Done! Generated vector sprite SVG. Length:', svg.length);
