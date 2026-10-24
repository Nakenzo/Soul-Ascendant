// Modul VFX Hibrida WebGL - Akselerasi GPU untuk Efek Partikel HD
// Berjalan mandiri tanpa library eksternal. Fallback aman jika WebGL tidak aktif.

let vfxGl = null;
let vfxProgram = null;
let vfxPosBuffer = null;
let vfxColorBuffer = null;
let vfxSizeBuffer = null;

let vfxUCamera = null;
let vfxUResolution = null;

const VFX_MAX_PARTIKEL = 2500;
const vfxPositions = new Float32Array(VFX_MAX_PARTIKEL * 2);
const vfxColors = new Float32Array(VFX_MAX_PARTIKEL * 4);
const vfxSizes = new Float32Array(VFX_MAX_PARTIKEL);

const vfxPool = [];
let vfxAktifCount = 0;

function vfxHexKeRgba(hex, alpha) {
  if (!hex || hex[0] !== "#") return [1.0, 0.8, 0.2, alpha || 1.0];
  let r = 255, g = 255, b = 255;
  if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  } else if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  return [r / 255, g / 255, b / 255, alpha != null ? alpha : 1.0];
}

const windowVfx = {
  aktif: false,
  siap: false,

  init: function () {
    const cvs = document.getElementById("gameVfx");
    if (!cvs) return false;

    try {
      vfxGl = cvs.getContext("webgl2", { alpha: true, premultipliedAlpha: false, antialias: false, depth: false }) ||
              cvs.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false, depth: false });
    } catch (e) {
      vfxGl = null;
    }

    if (!vfxGl) return false;

    const gl = vfxGl;

    const vsSource = `
      attribute vec2 a_position;
      attribute vec4 a_color;
      attribute float a_size;
      uniform vec2 u_camera;
      uniform vec2 u_resolution;
      varying vec4 v_color;

      void main() {
        vec2 worldPos = a_position - u_camera;
        vec2 zeroToOne = worldPos / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace.x, -clipSpace.y, 0.0, 1.0);
        gl_PointSize = a_size;
        v_color = a_color;
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec4 v_color;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) {
          discard;
        }
        float glow = 1.0 - (dist * 2.0);
        glow = pow(glow, 1.35);
        gl_FragColor = vec4(v_color.rgb * v_color.a * glow, v_color.a * glow);
      }
    `;

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return false;

    const prg = gl.createProgram();
    gl.attachShader(prg, vs);
    gl.attachShader(prg, fs);
    gl.linkProgram(prg);
    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) return false;

    vfxProgram = prg;
    gl.useProgram(prg);

    vfxUCamera = gl.getUniformLocation(prg, "u_camera");
    vfxUResolution = gl.getUniformLocation(prg, "u_resolution");

    vfxPosBuffer = gl.createBuffer();
    vfxColorBuffer = gl.createBuffer();
    vfxSizeBuffer = gl.createBuffer();

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    for (let i = 0; i < VFX_MAX_PARTIKEL; i++) {
      vfxPool.push({
        aktif: false,
        x: 0, y: 0,
        vx: 0, vy: 0,
        drag: 0.98,
        grav: 0,
        sizeAwal: 8,
        sizeAkhir: 0,
        r: 1, g: 1, b: 1,
        alphaAwal: 1,
        life: 1,
        t: 0
      });
    }

    this.aktif = true;
    this.siap = true;
    return true;
  },

  spawn: function (jenis, x, y, opsi) {
    if (!this.siap) return;
    opsi = opsi || {};
    const jumlah = Math.min(opsi.jumlah || 15, 200);
    const warnaBase = opsi.warna || "#ffd23f";
    const rgba = vfxHexKeRgba(warnaBase, opsi.alpha != null ? opsi.alpha : 1.0);

    for (let i = 0; i < jumlah; i++) {
      let p = null;
      for (let j = 0; j < VFX_MAX_PARTIKEL; j++) {
        if (!vfxPool[j].aktif) {
          p = vfxPool[j];
          break;
        }
      }
      if (!p) break;

      p.aktif = true;
      p.x = x + (Math.random() - 0.5) * (opsi.sebarX || 0);
      p.y = y + (Math.random() - 0.5) * (opsi.sebarY || 0);
      p.t = 0;
      p.life = (opsi.life || 0.45) * (0.7 + Math.random() * 0.6);

      const spd = (opsi.speed || 180) * (0.4 + Math.random() * 0.8);
      const rad = opsi.sudut != null
        ? opsi.sudut + (Math.random() - 0.5) * (opsi.rentangSudut || 0.5)
        : Math.random() * Math.PI * 2;

      p.vx = Math.cos(rad) * spd + (opsi.vx || 0);
      p.vy = Math.sin(rad) * spd + (opsi.vy || 0);
      p.drag = opsi.drag != null ? opsi.drag : 0.94;
      p.grav = opsi.grav || 0;

      p.sizeAwal = (opsi.size || 12) * (0.7 + Math.random() * 0.6);
      p.sizeAkhir = opsi.sizeAkhir != null ? opsi.sizeAkhir : 0;

      p.r = rgba[0];
      p.g = rgba[1];
      p.b = rgba[2];
      p.alphaAwal = rgba[3];
    }
  },

  ledakan: function (x, y, warna, jumlah) {
    this.spawn("ledakan", x, y, {
      warna: warna || "#ff6a3a",
      jumlah: jumlah || 35,
      speed: 240,
      life: 0.55,
      size: 16,
      drag: 0.92
    });
  },

  sabetan: function (x, y, sudut, warna, jumlah) {
    this.spawn("sabetan", x, y, {
      warna: warna || "#4ade80",
      jumlah: jumlah || 22,
      sudut: sudut,
      rentangSudut: 0.6,
      speed: 320,
      life: 0.35,
      size: 14,
      drag: 0.88
    });
  },

  es: function (x, y, jumlah) {
    this.spawn("es", x, y, {
      warna: "#7dd3fc",
      jumlah: jumlah || 25,
      speed: 160,
      life: 0.65,
      size: 12,
      drag: 0.95
    });
  },

  voidSparks: function (x, y, jumlah) {
    this.spawn("void", x, y, {
      warna: "#c084fc",
      jumlah: jumlah || 30,
      speed: 200,
      life: 0.5,
      size: 14,
      drag: 0.91
    });
  },

  update: function (dt) {
    if (!this.siap) return;
    vfxAktifCount = 0;

    for (let i = 0; i < VFX_MAX_PARTIKEL; i++) {
      const p = vfxPool[i];
      if (!p.aktif) continue;

      p.t += dt;
      if (p.t >= p.life) {
        p.aktif = false;
        continue;
      }

      p.vx *= Math.pow(p.drag, dt * 60);
      p.vy *= Math.pow(p.drag, dt * 60);
      p.vy += p.grav * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      const progress = p.t / p.life;
      const alpha = p.alphaAwal * (1.0 - progress);
      const size = p.sizeAwal + (p.sizeAkhir - p.sizeAwal) * progress;

      const idx2 = vfxAktifCount * 2;
      const idx4 = vfxAktifCount * 4;

      vfxPositions[idx2] = p.x;
      vfxPositions[idx2 + 1] = p.y;

      vfxColors[idx4] = p.r;
      vfxColors[idx4 + 1] = p.g;
      vfxColors[idx4 + 2] = p.b;
      vfxColors[idx4 + 3] = alpha;

      vfxSizes[vfxAktifCount] = size;

      vfxAktifCount++;
    }
  },

  render: function () {
    if (!this.siap || !vfxGl) return;
    const gl = vfxGl;

    gl.viewport(0, 0, 1707, 960);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (vfxAktifCount === 0 || (typeof statusGame !== "undefined" && statusGame !== "main" && statusGame !== "pause" && statusGame !== "upgrade")) {
      return;
    }

    gl.useProgram(vfxProgram);

    const kx = (typeof kam !== "undefined" && kam && !isNaN(kam.x)) ? kam.x : 0;
    const ky = (typeof kam !== "undefined" && kam && !isNaN(kam.y)) ? kam.y : 0;
    gl.uniform2f(vfxUCamera, kx, ky);
    gl.uniform2f(vfxUResolution, 1707.0, 960.0);

    const aPos = gl.getAttribLocation(vfxProgram, "a_position");
    gl.bindBuffer(gl.ARRAY_BUFFER, vfxPosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vfxPositions.subarray(0, vfxAktifCount * 2), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const aColor = gl.getAttribLocation(vfxProgram, "a_color");
    gl.bindBuffer(gl.ARRAY_BUFFER, vfxColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vfxColors.subarray(0, vfxAktifCount * 4), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(aColor);
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);

    const aSize = gl.getAttribLocation(vfxProgram, "a_size");
    gl.bindBuffer(gl.ARRAY_BUFFER, vfxSizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vfxSizes.subarray(0, vfxAktifCount), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(aSize);
    gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, vfxAktifCount);
  },

  bersihkan: function () {
    for (let i = 0; i < VFX_MAX_PARTIKEL; i++) {
      vfxPool[i].aktif = false;
    }
    vfxAktifCount = 0;
    if (vfxGl) {
      vfxGl.clear(vfxGl.COLOR_BUFFER_BIT);
    }
  }
};

window.vfx = windowVfx;
