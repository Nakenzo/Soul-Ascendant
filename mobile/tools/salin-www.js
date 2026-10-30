"use strict";
// Salin aset game (folder induk) ke www/ untuk dibungkus Capacitor & Tauri.
// Sekaligus memverifikasi dan menjaga sinkronisasi nomor build di seluruh file inti.
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

function wajibSamaBuild(label, berkas, regex, petunjuk, targetBuild) {
  const isi = fs.readFileSync(path.join(ROOT, berkas), "utf8");
  const m = isi.match(regex);
  const nilai = m ? Number(m[1]) : null;
  if (nilai !== targetBuild) {
    console.error("GAGAL: " + label + " (" + nilai + ") != manifest.json build (" + targetBuild + ").");
    console.error("Ubah '" + petunjuk + "' di " + berkas + " agar sama, lalu jalankan ulang script ini.");
    process.exit(1);
  }
  return isi;
}

// 1. Verifikasi & sinkronisasi metadata di ROOT sebelum penyalinan ke www/
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8"));
  if (!Number.isInteger(manifest.build) || manifest.build <= 0) {
    throw new Error("manifest.json build harus berupa bilangan bulat positif.");
  }

  wajibSamaBuild("sw.js BUILD", "sw.js", /const BUILD = (\d+)/, "const BUILD", manifest.build);
  wajibSamaBuild("core.js BUILD_GAME", "core.js", /const BUILD_GAME = (\d+)/, "const BUILD_GAME", manifest.build);
  let bootSrc = wajibSamaBuild("boot.js BUILD_SEKARANG", "boot.js", /const BUILD_SEKARANG = (\d+)/, "const BUILD_SEKARANG", manifest.build);
  wajibSamaBuild("index.html BUILD_TERKINI", "index.html", /var BUILD_TERKINI = (\d+)/, "var BUILD_TERKINI", manifest.build);

  const vPath = path.join(ROOT, "version.json");
  let ver = {};
  let vMentahLama = "";
  try {
    vMentahLama = fs.readFileSync(vPath, "utf8");
    ver = JSON.parse(vMentahLama);
  } catch (e) {}

  // Hanya perbarui timestamp jika nomor build berubah atau timestamp belum valid,
  // agar eksekusi ulang di runner CI tidak menggeser timestamp commit asli.
  if (ver.build !== manifest.build || !Number.isFinite(ver.timestamp) || ver.timestamp <= 0) {
    ver.timestamp = Date.now();
    ver.build = manifest.build;
    ver.tanggal = new Date().toISOString();
  }
  if (Array.isArray(manifest.patch_files) && manifest.patch_files.length > 0) {
    ver.patch_files = manifest.patch_files;
  }

  const vMentahBaru = JSON.stringify(ver, null, 2) + "\n";
  if (vMentahBaru !== vMentahLama) {
    fs.writeFileSync(vPath, vMentahBaru);
  }

  // Pastikan TIMESTAMP_SEKARANG di boot.js selalu sinkron dengan version.json
  if (/const TIMESTAMP_SEKARANG = \d+;/.test(bootSrc)) {
    const bootBaru = bootSrc.replace(
      /const TIMESTAMP_SEKARANG = \d+;/,
      "const TIMESTAMP_SEKARANG = " + ver.timestamp + ";"
    );
    if (bootBaru !== bootSrc) {
      fs.writeFileSync(path.join(ROOT, "boot.js"), bootBaru);
      bootSrc = bootBaru;
    }
  }

  const gradlePath = path.join(ROOT, "mobile", "android", "app", "build.gradle");
  if (fs.existsSync(gradlePath)) {
    const gradleLama = fs.readFileSync(gradlePath, "utf8");
    let gradleBaru = gradleLama.replace(/versionCode\s+\d+/, "versionCode " + manifest.build);
    gradleBaru = gradleBaru.replace(/versionName\s+"[^"]+"/, 'versionName "0.1.' + manifest.build + '"');
    if (gradleBaru !== gradleLama) {
      fs.writeFileSync(gradlePath, gradleBaru);
    }
  }

  console.log(
    "Verifikasi ok: build " + manifest.build +
    " (manifest == sw.js == core.js == boot.js == index.html == version.json == build.gradle)"
  );
} catch (err) {
  console.error("GAGAL verifikasi build: " + err.message);
  process.exit(1);
}

// 2. Salin seluruh aset yang sudah terverifikasi ke www/
if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

let total = 0;
for (const entri of fs.readdirSync(ROOT)) {
  if (LEWATI_AKAR.has(entri)) continue;
  total += salin(path.join(ROOT, entri), path.join(OUT, entri));
}

console.log("www/ siap: " + total + " aset disalin ke " + OUT);
