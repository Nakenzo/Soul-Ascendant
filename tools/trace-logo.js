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

const W = Math.floor(width / 2);
const H = Math.floor(height / 2);

function getPixel(x, y) {
  if (x < 0 || x >= W || y < 0 || y >= H) return [0, 0, 0, 0];
  const idx = ((y * 2) * width + (x * 2)) * 4;
  return [raw[idx], raw[idx + 1], raw[idx + 2], raw[idx + 3]];
}

const alphaGrid = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const p = getPixel(x, y);
    if (p[3] > 30) alphaGrid[y * W + x] = 1;
  }
}

const compMap = new Int32Array(W * H).fill(-1);
const comps = [];
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (alphaGrid[y * W + x] && compMap[y * W + x] === -1) {
      const cid = comps.length;
      let minX = x, maxX = x, minY = y, maxY = y, count = 0;
      const q = [x, y];
      compMap[y * W + x] = cid;
      let head = 0;
      while (head < q.length) {
        const cx = q[head++];
        const cy = q[head++];
        count++;
        if (cx < minX) minX = cx; if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;
        const neighbors = [[cx+1, cy], [cx-1, cy], [cx, cy+1], [cx, cy-1], [cx+1, cy+1], [cx-1, cy-1], [cx+1, cy-1], [cx-1, cy+1]];
        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
            const nidx = ny * W + nx;
            if (alphaGrid[nidx] && compMap[nidx] === -1) {
              compMap[nidx] = cid;
              q.push(nx, ny);
            }
          }
        }
      }
      comps.push({ id: cid, minX, maxX, minY, maxY, count, cx: Math.round((minX + maxX)/2), cy: Math.round((minY + maxY)/2) });
    }
  }
}

function getCategory(x, y) {
  if (x >= 316 && x <= 365 && y <= 51) return 'STAR_CROWN_A';
  if (x >= 310 && x <= 330 && y >= 144) return 'STAR_NEEDLE';
  if (x >= 285 && x <= 304 && y >= 155 && y <= 182) return 'STAR_PLUS';

  const cid = compMap[y * W + x];
  if (cid === -1) return 'NONE';

  if (cid === 1 || cid === 2 || cid === 4 || cid === 6) return 'FLAME_LEFT_TOP';
  if (cid === 33 || cid === 42) return 'FLAME_LEFT_BOTTOM';
  if (cid === 13) return 'FLAME_RIGHT_TOP';
  if (cid === 27) return 'FLAME_RIGHT_BOTTOM';
  if (cid === 32) return 'FLAME_BOTTOM_RIGHT';

  const c = comps[cid];
  if (c.minX >= 125 && c.maxX <= 165 && c.minY >= 24 && c.maxY <= 65) return 'STAR_ABOVE_O';
  if (c.minX >= 256 && c.maxX <= 281 && c.minY >= 95 && c.maxY <= 110) return 'BODY';
  if (c.maxY - c.minY <= 5 && ((c.minY >= 68 && c.maxY <= 76) || (c.minY >= 148 && c.maxY <= 156))) return 'BODY';
  if (c.count < 250) return 'SPARK_' + cid;
  return 'BODY';
}

function traceMaskFiltered(maskFn) {
  const grid = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const p = getPixel(x, y);
      if (maskFn(p[0], p[1], p[2], p[3], x, y)) {
        grid[y * W + x] = 1;
      }
    }
  }

  const hEdges = new Uint8Array((H + 1) * W);
  const vEdges = new Uint8Array(H * (W + 1));
  for (let y = 0; y <= H; y++) {
    for (let x = 0; x < W; x++) {
      const top = y > 0 ? grid[(y - 1) * W + x] : 0;
      const bot = y < H ? grid[y * W + x] : 0;
      if (top !== bot) hEdges[y * W + x] = top ? 1 : 2;
    }
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x <= W; x++) {
      const left = x > 0 ? grid[y * W + x - 1] : 0;
      const right = x < W ? grid[y * W + x] : 0;
      if (left !== right) vEdges[y * (W + 1) + x] = left ? 1 : 2;
    }
  }

  const segments = [];
  for (let y = 0; y <= H; y++) {
    for (let x = 0; x < W; x++) {
      const type = hEdges[y * W + x];
      if (type === 1) segments.push([[x + 1, y], [x, y]]);
      else if (type === 2) segments.push([[x, y], [x + 1, y]]);
    }
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x <= W; x++) {
      const type = vEdges[y * (W + 1) + x];
      if (type === 1) segments.push([[x, y], [x, y + 1]]);
      else if (type === 2) segments.push([[x, y + 1], [x, y]]);
    }
  }

  const startMap = new Map();
  for (let i = 0; i < segments.length; i++) {
    const key = segments[i][0][0] + ',' + segments[i][0][1];
    if (!startMap.has(key)) startMap.set(key, []);
    startMap.get(key).push(i);
  }

  const used = new Uint8Array(segments.length);
  const paths = [];
  for (let i = 0; i < segments.length; i++) {
    if (used[i]) continue;
    const loop = [segments[i][0]];
    let currIdx = i;
    while (currIdx !== -1 && !used[currIdx]) {
      used[currIdx] = 1;
      const endPt = segments[currIdx][1];
      loop.push(endPt);
      const nextKey = endPt[0] + ',' + endPt[1];
      const candidates = startMap.get(nextKey);
      let foundNext = -1;
      if (candidates) {
        for (const c of candidates) {
          if (!used[c]) { foundNext = c; break; }
        }
      }
      currIdx = foundNext;
    }

    if (loop.length > 2) {
      const simplified = [loop[0]];
      for (let j = 1; j < loop.length - 1; j++) {
        const prev = simplified[simplified.length - 1];
        const curr = loop[j];
        const nxt = loop[j + 1];
        const dx1 = curr[0] - prev[0], dy1 = curr[1] - prev[1];
        const dx2 = nxt[0] - curr[0], dy2 = nxt[1] - curr[1];
        if ((dx1 === 0 && dx2 === 0) || (dy1 === 0 && dy2 === 0)) continue;
        simplified.push(curr);
      }
      if (simplified.length >= 3) paths.push(simplified);
    }
  }

  let d = '';
  for (const p of paths) {
    d += 'M' + p[0][0] + ' ' + p[0][1];
    for (let j = 1; j < p.length; j++) d += 'L' + p[j][0] + ' ' + p[j][1];
    d += 'Z';
  }
  return d;
}

function traceGrid(grid) {
  const hEdges = new Uint8Array((H + 1) * W);
  const vEdges = new Uint8Array(H * (W + 1));
  for (let y = 0; y <= H; y++) {
    for (let x = 0; x < W; x++) {
      const top = y > 0 ? grid[(y - 1) * W + x] : 0;
      const bot = y < H ? grid[y * W + x] : 0;
      if (top !== bot) hEdges[y * W + x] = top ? 1 : 2;
    }
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x <= W; x++) {
      const left = x > 0 ? grid[y * W + x - 1] : 0;
      const right = x < W ? grid[y * W + x] : 0;
      if (left !== right) vEdges[y * (W + 1) + x] = left ? 1 : 2;
    }
  }

  const segments = [];
  for (let y = 0; y <= H; y++) {
    for (let x = 0; x < W; x++) {
      const type = hEdges[y * W + x];
      if (type === 1) segments.push([[x + 1, y], [x, y]]);
      else if (type === 2) segments.push([[x, y], [x + 1, y]]);
    }
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x <= W; x++) {
      const type = vEdges[y * (W + 1) + x];
      if (type === 1) segments.push([[x, y], [x, y + 1]]);
      else if (type === 2) segments.push([[x, y + 1], [x, y]]);
    }
  }

  const startMap = new Map();
  for (let i = 0; i < segments.length; i++) {
    const key = segments[i][0][0] + ',' + segments[i][0][1];
    if (!startMap.has(key)) startMap.set(key, []);
    startMap.get(key).push(i);
  }

  const used = new Uint8Array(segments.length);
  const paths = [];
  for (let i = 0; i < segments.length; i++) {
    if (used[i]) continue;
    const loop = [segments[i][0]];
    let currIdx = i;
    while (currIdx !== -1 && !used[currIdx]) {
      used[currIdx] = 1;
      const endPt = segments[currIdx][1];
      loop.push(endPt);
      const nextKey = endPt[0] + ',' + endPt[1];
      const candidates = startMap.get(nextKey);
      let foundNext = -1;
      if (candidates) {
        for (const c of candidates) {
          if (!used[c]) { foundNext = c; break; }
        }
      }
      currIdx = foundNext;
    }

    if (loop.length > 2) {
      const simplified = [loop[0]];
      for (let j = 1; j < loop.length - 1; j++) {
        const prev = simplified[simplified.length - 1];
        const curr = loop[j];
        const nxt = loop[j + 1];
        const dx1 = curr[0] - prev[0], dy1 = curr[1] - prev[1];
        const dx2 = nxt[0] - curr[0], dy2 = nxt[1] - curr[1];
        if ((dx1 === 0 && dx2 === 0) || (dy1 === 0 && dy2 === 0)) continue;
        simplified.push(curr);
      }
      if (simplified.length >= 3) paths.push(simplified);
    }
  }

  let d = '';
  for (const p of paths) {
    d += 'M' + p[0][0] + ' ' + p[0][1];
    for (let j = 1; j < p.length; j++) d += 'L' + p[j][0] + ' ' + p[j][1];
    d += 'Z';
  }
  return d;
}

function buildLayeredGroup(catFilter, id, className, cx, cy, animDuration, animDelay) {
  const isTarget = (r, g, b, a, x, y) => a > 30 && catFilter(x, y);
  const sil = traceMaskFiltered(isTarget);
  if (!sil) return '';
  const greenBody = traceMaskFiltered((r, g, b, a, x, y) => isTarget(r, g, b, a, x, y) && (g > 35 && (g > r * 0.9 || g > b * 0.9)));
  const brightLime = traceMaskFiltered((r, g, b, a, x, y) => isTarget(r, g, b, a, x, y) && g > 185 && r > 110);
  const whiteCores = traceMaskFiltered((r, g, b, a, x, y) => isTarget(r, g, b, a, x, y) && r > 210 && g > 235 && b > 180);

  let styleStr = '';
  if (cx !== undefined && cy !== undefined) {
    styleStr += `transform-origin: ${cx}px ${cy}px; `;
  }
  if (animDuration !== undefined) {
    styleStr += `animation-duration: ${animDuration}s; `;
  }
  if (animDelay !== undefined) {
    styleStr += `animation-delay: ${animDelay}s; `;
  }

  const styleAttr = styleStr ? ` style="${styleStr.trim()}"` : '';

  let res = `  <g id="${id}" class="${className}"${styleAttr}>\n`;
  if (sil) {
    res += `    <path d="${sil}" fill="url(#soulEmeraldGrad)" fill-rule="evenodd" class="layer-body"/>\n`;
  }
  if (brightLime) {
    res += `    <path d="${brightLime}" fill="#d4f686" fill-rule="evenodd" class="layer-highlight" opacity="0.95"/>\n`;
  }
  if (whiteCores) {
    res += `    <path d="${whiteCores}" fill="#ffffff" fill-rule="evenodd" class="layer-core"/>\n`;
  }
  res += `  </g>\n`;
  return res;
}

function generateFlameFrames(compIds, deformFn, numFrames = 5) {
  const compIdSet = new Set(compIds);
  const sourcePixels = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const cid = compMap[y * W + x];
      if (compIdSet.has(cid)) {
        const p = getPixel(x, y);
        sourcePixels.push({ x, y, r: p[0], g: p[1], b: p[2], a: p[3], cid });
      }
    }
  }

  const frames = [];
  for (let f = 0; f < numFrames; f++) {
    const silGrid = new Uint8Array(W * H);
    const bodyGrid = new Uint8Array(W * H);
    const limeGrid = new Uint8Array(W * H);
    const whiteGrid = new Uint8Array(W * H);

    const mappedPixels = new Map();
    for (const sp of sourcePixels) {
      const res = deformFn(sp.x, sp.y, sp.cid, f, numFrames);
      if (res.drop) continue;
      const tx = sp.x + (res.dx || 0);
      const ty = sp.y + (res.dy || 0);
      mappedPixels.set(sp.y * W + sp.x, { tx, ty, sp });
      if (tx >= 0 && tx < W && ty >= 0 && ty < H) {
        const idx = ty * W + tx;
        silGrid[idx] = 1;
        if (sp.g > 35 && (sp.g > sp.r * 0.9 || sp.g > sp.b * 0.9)) bodyGrid[idx] = 1;
        if (sp.g > 185 && sp.r > 110) limeGrid[idx] = 1;
        if (sp.r > 210 && sp.g > 235 && sp.b > 180) whiteGrid[idx] = 1;
      }
    }

    for (const sp of sourcePixels) {
      const p1 = mappedPixels.get(sp.y * W + sp.x);
      const p2 = mappedPixels.get(sp.y * W + (sp.x + 1));
      if (p1 && p2 && p1.ty === p2.ty && p2.tx > p1.tx + 1 && p2.tx <= p1.tx + 4) {
        for (let bx = p1.tx + 1; bx < p2.tx; bx++) {
          if (bx >= 0 && bx < W && p1.ty >= 0 && p1.ty < H) {
            const idx = p1.ty * W + bx;
            silGrid[idx] = 1;
            bodyGrid[idx] = 1;
            if (p1.sp.g > 185 || p2.sp.g > 185) limeGrid[idx] = 1;
            if (p1.sp.r > 210 && p2.sp.r > 210) whiteGrid[idx] = 1;
          }
        }
      }
    }

    for (const sp of sourcePixels) {
      const p1 = mappedPixels.get(sp.y * W + sp.x);
      const p2 = mappedPixels.get((sp.y + 1) * W + sp.x);
      if (p1 && p2 && p1.tx === p2.tx && p2.ty > p1.ty + 1 && p2.ty <= p1.ty + 4) {
        for (let by = p1.ty + 1; by < p2.ty; by++) {
          if (p1.tx >= 0 && p1.tx < W && by >= 0 && by < H) {
            const idx = by * W + p1.tx;
            silGrid[idx] = 1;
            bodyGrid[idx] = 1;
            if (p1.sp.g > 185 || p2.sp.g > 185) limeGrid[idx] = 1;
            if (p1.sp.r > 210 && p2.sp.r > 210) whiteGrid[idx] = 1;
          }
        }
      }
    }

    for (let pass = 0; pass < 2; pass++) {
      for (let y = 0; y < H; y++) {
        for (let x = 1; x < W - 1; x++) {
          const idx = y * W + x;
          if (!silGrid[idx]) {
            if (silGrid[idx - 1] && silGrid[idx + 1]) {
              silGrid[idx] = 1;
              bodyGrid[idx] = 1;
              if (limeGrid[idx - 1] || limeGrid[idx + 1]) limeGrid[idx] = 1;
              if (whiteGrid[idx - 1] && whiteGrid[idx + 1]) whiteGrid[idx] = 1;
            }
          }
        }
      }
      for (let y = 1; y < H - 1; y++) {
        for (let x = 0; x < W; x++) {
          const idx = y * W + x;
          if (!silGrid[idx]) {
            if (silGrid[idx - W] && silGrid[idx + W]) {
              silGrid[idx] = 1;
              bodyGrid[idx] = 1;
              if (limeGrid[idx - W] || limeGrid[idx + W]) limeGrid[idx] = 1;
              if (whiteGrid[idx - W] && whiteGrid[idx + W]) whiteGrid[idx] = 1;
            }
          }
        }
      }
    }

    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const idx = y * W + x;
        if (!silGrid[idx]) {
          const n = silGrid[idx - 1] + silGrid[idx + 1] + silGrid[idx - W] + silGrid[idx + W];
          if (n >= 3) {
            silGrid[idx] = 1;
            bodyGrid[idx] = 1;
            if ((limeGrid[idx - 1] + limeGrid[idx + 1] + limeGrid[idx - W] + limeGrid[idx + W]) >= 2) limeGrid[idx] = 1;
          }
        }
      }
    }

    const sil = traceGrid(silGrid);
    const body = traceGrid(bodyGrid);
    const lime = traceGrid(limeGrid);
    const white = traceGrid(whiteGrid);
    frames.push({ sil, body, lime, white });
  }
  return frames;
}

function buildFlameGroup(frames, id, className) {
  let res = `  <g id="${id}" class="${className}">\n`;
  frames.forEach((f, idx) => {
    res += `    <g class="fbf-frame fbf-f${idx}">\n`;
    if (f.sil) res += `      <path d="${f.sil}" fill="url(#soulEmeraldGrad)" fill-rule="evenodd" class="layer-body"/>\n`;
    if (f.lime) res += `      <path d="${f.lime}" fill="#d4f686" fill-rule="evenodd" class="layer-highlight" opacity="0.95"/>\n`;
    if (f.white) res += `      <path d="${f.white}" fill="#ffffff" fill-rule="evenodd" class="layer-core"/>\n`;
    res += `    </g>\n`;
  });
  res += `  </g>\n`;
  return res;
}

const silAll = traceMaskFiltered((r, g, b, a) => a > 30);
const bodyGroup = buildLayeredGroup((x, y) => getCategory(x, y) === 'BODY', 'logoBodyText', 'logo-body-group');

const framesLeftTop = generateFlameFrames([1, 2, 4, 6], (x, y, cid, f) => {
  if (cid === 6) {
    const offsets = [{dx:0, dy:0}, {dx:-1, dy:-3}, {dx:-2, dy:-6}, {dx:-2, dy:-9}, {dx:-1, dy:-3}];
    return offsets[f];
  }
  if (cid === 4) {
    const offsets = [{dx:0, dy:0}, {dx:-2, dy:-4}, {dx:-3, dy:-8}, {dx:-2, dy:-11}, {dx:-1, dy:-3}];
    return offsets[f];
  }
  if (cid === 2) {
    const offsets = [{dx:0, dy:0}, {dx:1, dy:-4}, {dx:2, dy:-8}, {dx:1, dy:-11}, {dx:0, dy:-2}];
    return offsets[f];
  }
  const u = Math.max(0, Math.min(1, (108 - y) / 85));
  let dx = 0, dy = 0, drop = false;
  if (f === 0) {
    dx = 0; dy = 0;
  } else if (f === 1) {
    dx = -Math.round(Math.pow(u, 1.3) * 3);
    dy = -Math.round(u * 3);
  } else if (f === 2) {
    dx = Math.round(Math.pow(u, 1.2) * 2 - u * 1);
    dy = -Math.round(u * 5);
    if (y < 28) dy -= 2;
  } else if (f === 3) {
    if (y >= 27 && y <= 29 && u > 0.88) {
      drop = true;
    } else if (y < 27) {
      dx = -Math.round(Math.pow(u, 1.4) * 4);
      dy = -Math.round(u * 5) - 3;
    } else {
      dx = -Math.round(Math.pow(u, 1.3) * 3);
      dy = -Math.round(u * 2);
    }
  } else if (f === 4) {
    if (y < 27) {
      dx = -Math.round(Math.pow(u, 1.4) * 5);
      dy = -Math.round(u * 5) - 6;
    } else {
      dx = -Math.round(u * 1);
      dy = Math.round(u * 1.5);
    }
  }
  return { dx, dy, drop };
});

const framesLeftBottom = generateFlameFrames([33, 42], (x, y, cid, f) => {
  if (cid === 42) {
    const offsets = [{dx:0, dy:0}, {dx:-1, dy:-2}, {dx:-2, dy:-4}, {dx:-1, dy:-6}, {dx:0, dy:-1}];
    return offsets[f];
  }
  const u = Math.max(0, Math.min(1, (148 - x) / 50));
  let dx = 0, dy = 0;
  if (f === 0) {
    dx = 0; dy = 0;
  } else if (f === 1) {
    dx = -Math.round(u * 1);
    dy = -Math.round(u * 3);
  } else if (f === 2) {
    dx = -Math.round(u * 2);
    dy = -Math.round(u * 5);
  } else if (f === 3) {
    dx = -Math.round(u * 3);
    dy = -Math.round(u * 2);
  } else if (f === 4) {
    dx = -Math.round(u * 1);
    dy = Math.round(u * 1.5);
  }
  return { dx, dy, drop: false };
});

const framesRightTop = generateFlameFrames([13], (x, y, cid, f) => {
  const u = Math.max(0, Math.min(1, (x - 588) / 45));
  let dx = 0, dy = 0, drop = false;
  if (f === 0) {
    dx = 0; dy = 0;
  } else if (f === 1) {
    dx = Math.round(u * 3);
    dy = -Math.round(u * 3);
  } else if (f === 2) {
    dx = Math.round(u * 5);
    dy = -Math.round(u * 5);
  } else if (f === 3) {
    if (x > 628 && u > 0.88) {
      dx = Math.round(u * 6);
      dy = -Math.round(u * 7);
    } else {
      dx = Math.round(u * 2);
      dy = -Math.round(u * 2);
    }
  } else if (f === 4) {
    dx = Math.round(u * 1);
    dy = Math.round(u * 1.5);
  }
  return { dx, dy, drop };
});

const framesRightBottom = generateFlameFrames([27], (x, y, cid, f) => {
  const u = Math.max(0, Math.min(1, (y - 96) / 65));
  let dx = 0, dy = 0, drop = false;
  if (f === 0) {
    dx = 0; dy = 0;
  } else if (f === 1) {
    dx = Math.round(u * 4);
    dy = -Math.round(u * 1);
  } else if (f === 2) {
    dx = Math.round(u * 5);
    dy = Math.round(u * 3);
  } else if (f === 3) {
    if (y > 162 && u > 0.88) {
      dx = Math.round(u * 6);
      dy = Math.round(u * 6);
    } else {
      dx = Math.round(u * 2);
      dy = Math.round(u * 2);
    }
  } else if (f === 4) {
    dx = -Math.round(u * 1);
    dy = -Math.round(u * 1);
  }
  return { dx, dy, drop };
});

const framesBottomRight = generateFlameFrames([32], (x, y, cid, f) => {
  const u = Math.max(0, Math.min(1, (x - 548) / 38));
  let dx = 0, dy = 0;
  if (f === 0) {
    dx = 0; dy = 0;
  } else if (f === 1) {
    dx = -Math.round(u * 1);
    dy = -Math.round(u * 3);
  } else if (f === 2) {
    dx = Math.round(u * 2);
    dy = -Math.round(u * 4);
  } else if (f === 3) {
    dx = Math.round(u * 3);
    dy = -Math.round(u * 2);
  } else if (f === 4) {
    dx = 0;
    dy = Math.round(u * 1.5);
  }
  return { dx, dy, drop: false };
});

const flameLeftTop = buildFlameGroup(framesLeftTop, 'flameLeftTop', 'flame-fbf-group flame-group-lt');
const flameLeftBottom = buildFlameGroup(framesLeftBottom, 'flameLeftBottom', 'flame-fbf-group flame-group-lb');
const flameRightTop = buildFlameGroup(framesRightTop, 'flameRightTop', 'flame-fbf-group flame-group-rt');
const flameRightBottom = buildFlameGroup(framesRightBottom, 'flameRightBottom', 'flame-fbf-group flame-group-rb');
const flameBottomRight = buildFlameGroup(framesBottomRight, 'flameBottomRight', 'flame-fbf-group flame-group-br');

const starCrownAGroup = buildLayeredGroup((x, y) => getCategory(x, y) === 'STAR_CROWN_A', 'starCrownA', 'orn-star orn-star-crown-a', 340, 42, 2.5, -0.7);
const starAboveOGroup = buildLayeredGroup((x, y) => getCategory(x, y) === 'STAR_ABOVE_O', 'starAboveO', 'orn-star orn-star-above-o', 142, 41, 2.3, 0);
const starPlusGroup = buildLayeredGroup((x, y) => getCategory(x, y) === 'STAR_PLUS', 'starPlus', 'orn-star orn-star-plus', 294, 164, 2.1, -1.3);
const starNeedleGroup = buildLayeredGroup((x, y) => getCategory(x, y) === 'STAR_NEEDLE', 'starNeedle', 'orn-star orn-star-needle', 319, 152, 2.4, -1.8);

const sparkComps = comps.filter(c => {
  if (c.id === 1 || c.id === 2 || c.id === 4 || c.id === 6) return false;
  if (c.id === 33 || c.id === 42 || c.id === 13 || c.id === 27 || c.id === 32) return false;
  if (c.minX >= 125 && c.maxX <= 165 && c.minY >= 24 && c.maxY <= 65) return false;
  if (c.minX >= 285 && c.maxX <= 304 && c.minY >= 155 && c.maxY <= 182) return false;
  if (c.minX >= 310 && c.maxX <= 330 && c.maxY >= 144) return false;
  if (c.minX >= 316 && c.maxX <= 365 && c.minY <= 51) return false;
  if (c.minX >= 256 && c.maxX <= 281 && c.minY >= 95 && c.maxY <= 110) return false;
  if (c.maxY - c.minY <= 5 && ((c.minY >= 68 && c.maxY <= 76) || (c.minY >= 148 && c.maxY <= 156))) return false;
  return c.count < 250;
});

let sparksSvg = '  <g id="logoSparksGroup" class="logo-sparks-cluster">\n';
sparkComps.forEach((c, idx) => {
  const dur = (1.7 + (idx % 5) * 0.22).toFixed(2);
  const del = (-(idx * 0.31) % 2.0).toFixed(2);
  const sparkGroup = buildLayeredGroup((x, y) => getCategory(x, y) === 'SPARK_' + c.id, 'spark_' + c.id, 'orn-spark', c.cx, c.cy, dur, del);
  sparksSvg += sparkGroup;
});
sparksSvg += '  </g>\n';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="soulEmeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#daf38d"/>
      <stop offset="28%" stop-color="#98dc42"/>
      <stop offset="65%" stop-color="#3eb84e"/>
      <stop offset="100%" stop-color="#15642a"/>
    </linearGradient>
  </defs>

  <style>
    .layer-body {
      fill: #3eb84e;
      fill: url(#soulEmeraldGrad);
    }

    .fbf-frame {
      opacity: 0;
      visibility: hidden;
    }

    .fbf-f0 { animation: stepFbf0 0.65s steps(1) infinite; }
    .fbf-f1 { animation: stepFbf1 0.65s steps(1) infinite; }
    .fbf-f2 { animation: stepFbf2 0.65s steps(1) infinite; }
    .fbf-f3 { animation: stepFbf3 0.65s steps(1) infinite; }
    .fbf-f4 { animation: stepFbf4 0.65s steps(1) infinite; }

    @keyframes stepFbf0 {
      0%, 19.999% { opacity: 1; visibility: visible; }
      20%, 100% { opacity: 0; visibility: hidden; }
    }
    @keyframes stepFbf1 {
      0%, 19.999% { opacity: 0; visibility: hidden; }
      20%, 39.999% { opacity: 1; visibility: visible; }
      40%, 100% { opacity: 0; visibility: hidden; }
    }
    @keyframes stepFbf2 {
      0%, 39.999% { opacity: 0; visibility: hidden; }
      40%, 59.999% { opacity: 1; visibility: visible; }
      60%, 100% { opacity: 0; visibility: hidden; }
    }
    @keyframes stepFbf3 {
      0%, 59.999% { opacity: 0; visibility: hidden; }
      60%, 79.999% { opacity: 1; visibility: visible; }
      80%, 100% { opacity: 0; visibility: hidden; }
    }
    @keyframes stepFbf4 {
      0%, 79.999% { opacity: 0; visibility: hidden; }
      80%, 99.999% { opacity: 1; visibility: visible; }
      100% { opacity: 0; visibility: hidden; }
    }

    .flame-fbf-group {
      filter: drop-shadow(0 0 3px rgba(74, 222, 128, 0.6)) drop-shadow(0 0 8px rgba(180, 255, 120, 0.35));
    }

    .flame-group-lt .fbf-frame { animation-delay: 0s; }
    .flame-group-lb .fbf-frame { animation-delay: -0.13s; }
    .flame-group-rt .fbf-frame { animation-delay: -0.26s; }
    .flame-group-rb .fbf-frame { animation-delay: -0.39s; }
    .flame-group-br .fbf-frame { animation-delay: -0.52s; }

    @keyframes pixelStarPulse {
      0%, 100% {
        transform: scale(1);
        filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.45));
      }
      28% {
        transform: scale(0.72);
        filter: drop-shadow(0 0 0px transparent);
      }
      62% {
        transform: scale(1.36);
        filter: drop-shadow(0 0 7px rgba(180, 255, 120, 0.95)) drop-shadow(0 0 14px rgba(74, 222, 128, 0.65));
      }
      82% {
        transform: scale(1.1);
        filter: drop-shadow(0 0 3px rgba(180, 255, 120, 0.5));
      }
    }

    @keyframes pixelSparkleTwinkle {
      0%, 100% {
        transform: scale(0.65);
        opacity: 0.35;
      }
      50% {
        transform: scale(1.38);
        opacity: 1;
        filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.95));
      }
    }

    .orn-star {
      animation-name: pixelStarPulse;
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      animation-iteration-count: infinite;
      will-change: transform, filter;
    }

    .orn-spark {
      animation-name: pixelSparkleTwinkle;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
      will-change: transform, opacity;
    }
  </style>

${bodyGroup}
${flameLeftTop}
${flameLeftBottom}
${flameRightTop}
${flameRightBottom}
${flameBottomRight}
${starCrownAGroup}
${starAboveOGroup}
${starPlusGroup}
${starNeedleGroup}
${sparksSvg}
</svg>`;

fs.writeFileSync('lobby/assets/logo-soul-ascendant.svg', svg);
fs.writeFileSync('assets/ui/logo-soul-ascendant.svg', svg);
console.log('Done! Generated vector sprite SVG with live dancing soul flames. Length:', svg.length);
