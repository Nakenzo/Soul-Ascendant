"use strict";
// Salin aset game (folder induk) ke www/ untuk dibungkus Capacitor.
// Ini BUKAN pengganti permainan — hanya menyiapkan isi aplikasi Android.
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const OUT = path.resolve(__dirname, "..", "www");

const EKSTENSI_BOLEH = new Set([
  ".html", ".css", ".js", ".json", ".ico", ".png", ".jpg", ".jpeg",
  ".gif", ".webp", ".svg", ".mp3", ".wav", ".ogg", ".m4a", ".woff2", ".woff", ".ttf"
]);

const LEWATI_AKAR = new Set([
  ".git", "mobile", "node_modules", "tools", "src-tauri", "scratch", "lobby",
  "README.md", "package.json", "package-lock.json",
  "server.js", "start-app.bat", "admin.html"
]);

function salin(asal, tujuan) {
  const nama = path.basename(asal);
  if (!fs.existsSync(asal)) return 0;
  const stats = fs.statSync(asal);
  if (stats.isDirectory()) {
    if (!fs.existsSync(tujuan)) fs.mkdirSync(tujuan, { recursive: true });
    let n = 0;
    for (const entri of fs.readdirSync(asal)) {
      n += salin(path.join(asal, entri), path.join(tujuan, entri));
    }
    return n;
  }
  const ekst = path.extname(nama).toLowerCase();
  if (!EKSTENSI_BOLEH.has(ekst)) return 0;
  if (nama.charAt(0) === ".") return 0;
  fs.copyFileSync(asal, tujuan);
  return 1;
}

if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

let total = 0;
for (const entri of fs.readdirSync(ROOT)) {
  if (LEWATI_AKAR.has(entri)) continue;
  total += salin(path.join(ROOT, entri), path.join(OUT, entri));
}

console.log("www/ siap: " + total + " aset disalin ke " + OUT);

// Verifikasi rilis: sw.js BUILD harus sama dengan manifest build, kalau tidak
// browser tidak akan update service worker dan pemain tetap dapat file lama.
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8"));
  const swSrc = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
  const m = swSrc.match(/const BUILD = (\d+)/);
  const swBuild = m ? Number(m[1]) : null;
  if (swBuild !== manifest.build) {
    console.error("GAGAL: sw.js BUILD (" + swBuild + ") != manifest.json build (" + manifest.build + ").");
    console.error("Ubah 'const BUILD' di sw.js agar sama, lalu jalankan ulang script ini.");
    process.exit(1);
  }
  const coreSrc = fs.readFileSync(path.join(ROOT, "core.js"), "utf8");
  const mc = coreSrc.match(/const BUILD_GAME = (\d+)/);
  const coreBuild = mc ? Number(mc[1]) : null;
  if (coreBuild !== manifest.build) {
    console.error("GAGAL: core.js BUILD_GAME (" + coreBuild + ") != manifest.json build (" + manifest.build + ").");
    console.error("Ubah 'const BUILD_GAME' di core.js agar sama, lalu jalankan ulang script ini.");
    process.exit(1);
  }
  const bootSrc = fs.readFileSync(path.join(ROOT, "boot.js"), "utf8");
  const mb = bootSrc.match(/const BUILD_SEKARANG = (\d+)/);
  const bootBuild = mb ? Number(mb[1]) : null;
  if (bootBuild !== manifest.build) {
    console.error("GAGAL: boot.js BUILD_SEKARANG (" + bootBuild + ") != manifest.json build (" + manifest.build + ").");
    console.error("Ubah 'const BUILD_SEKARANG' di boot.js agar sama, lalu jalankan ulang script ini.");
    process.exit(1);
  }
  const vPath = path.join(ROOT, "version.json");
  let ver = {};
  try {
    ver = JSON.parse(fs.readFileSync(vPath, "utf8"));
  } catch (e) {}
  ver.timestamp = Date.now();
  ver.build = manifest.build;
  ver.tanggal = new Date().toISOString();
  fs.writeFileSync(vPath, JSON.stringify(ver, null, 2) + "\n");
  fs.writeFileSync(path.join(OUT, "version.json"), JSON.stringify(ver, null, 2) + "\n");

  const gradlePath = path.join(ROOT, "mobile", "android", "app", "build.gradle");
  if (fs.existsSync(gradlePath)) {
    let gradleSrc = fs.readFileSync(gradlePath, "utf8");
    gradleSrc = gradleSrc.replace(/versionCode\s+\d+/, "versionCode " + manifest.build);
    gradleSrc = gradleSrc.replace(/versionName\s+"[^"]+"/, 'versionName "0.1.' + manifest.build + '"');
    fs.writeFileSync(gradlePath, gradleSrc);
  }

  console.log("Verifikasi ok: build " + manifest.build + " (manifest == sw.js == core.js == boot.js == version.json == build.gradle)");
} catch (err) {
  console.error("GAGAL verifikasi build: " + err.message);
  process.exit(1);
}