(function () {
  const URL_MANIFEST = "https://raw.githubusercontent.com/Nakenzo/Soul-Essence/main/manifest.json?nc=";
  const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/Nakenzo/Soul-Essence/main/";
  const DB_NAME = "SoulEssencePatchDB";
  const DB_VERSION = 1;
  const STORE_NAME = "patches";

  const DAFTAR_SKRIP = [
    "core.js",
    "save.js",
    "settings.js",
    "akun-konfig.js",
    "akun.js",
    "akun-ui.js",
    "audio.js",
    "settings-ui.js",
    "hud.js",
    "config.js",
    "karakter.js",
    "artefak.js",
    "bosses.js",
    "maps.js",
    "texture.js",
    "inventory.js",
    "menu.js",
    "input.js",
    "ikon-sentuh.js",
    "levels.js",
    "upgrades.js",
    "skills.js",
    "entities.js",
    "draw.js",
    "ambience.js",
    "updater.js",
    "main.js",
    "admin-konfig.js",
    "admin-akun.js"
  ];

  const BUILD_SEKARANG = 79;

  function ambilBuildBawaan() {
    if (typeof BUILD_TERKINI === "number" && BUILD_TERKINI > 0) return BUILD_TERKINI;
    if (typeof BUILD_GAME !== "undefined") return BUILD_GAME;
    if (typeof BUILD !== "undefined") return BUILD;
    return BUILD_SEKARANG;
  }

  function ambilBuildAktif() {
    try {
      const tersimpan = localStorage.getItem("se_patch_build");
      if (tersimpan) {
        const n = parseInt(tersimpan, 10);
        if (Number.isFinite(n) && n >= ambilBuildBawaan()) return n;
      }
    } catch (e) {}
    return ambilBuildBawaan();
  }

  function bukaDB() {
    return new Promise((resolve) => {
      if (!window.indexedDB) return resolve(null);
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = function (e) {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: "path" });
          }
        };
        req.onsuccess = function (e) {
          resolve(e.target.result);
        };
        req.onerror = function () {
          resolve(null);
        };
      } catch (err) {
        resolve(null);
      }
    });
  }

  function ambilSemuaPatch(db) {
    return new Promise((resolve) => {
      if (!db) return resolve({});
      try {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = function () {
          const peta = {};
          const rows = req.result || [];
          for (let i = 0; i < rows.length; i++) {
            if (rows[i] && rows[i].path) {
              peta[rows[i].path] = rows[i].content;
            }
          }
          resolve(peta);
        };
        req.onerror = function () {
          resolve({});
        };
      } catch (err) {
        resolve({});
      }
    });
  }

  function simpanPatch(db, path, content, build) {
    return new Promise((resolve) => {
      if (!db) return resolve(false);
      try {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.put({ path, content, build, diperbarui: Date.now() });
        req.onsuccess = function () { resolve(true); };
        req.onerror = function () { resolve(false); };
      } catch (err) {
        resolve(false);
      }
    });
  }

  function hapusSemuaPatch(db) {
    return new Promise((resolve) => {
      try {
        localStorage.removeItem("se_patch_build");
      } catch (e) {}
      if (!db) return resolve(true);
      try {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.clear();
        req.onsuccess = function () { resolve(true); };
        req.onerror = function () { resolve(false); };
      } catch (err) {
        resolve(false);
      }
    });
  }

  function perbaruiStatusUI(teks, persen) {
    const el = document.getElementById("updateStatusTeks");
    if (!el) return;
    if (typeof persen === "number" && persen >= 0) {
      el.textContent = teks + " (" + persen + "%)";
    } else {
      el.textContent = teks;
    }
  }

  async function periksaManifestRemote(timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs || 2500);
    try {
      try {
        const resSha = await fetch("https://api.github.com/repos/Nakenzo/Soul-Essence/commits/main", {
          signal: controller.signal
        });
        if (resSha.ok) {
          const dSha = await resSha.json();
          if (dSha && dSha.sha) {
            const rawShaUrl = GITHUB_RAW_BASE.replace("/main/", "/" + dSha.sha + "/") + "manifest.json";
            const resM = await fetch(rawShaUrl, { signal: controller.signal, cache: "no-store" });
            if (resM.ok) {
              const data = await resM.json();
              data._sha = dSha.sha;
              clearTimeout(timer);
              return data;
            }
          }
        }
      } catch (eApi) {}

      const res = await fetch(URL_MANIFEST + Date.now(), {
        signal: controller.signal,
        cache: "no-store"
      });
      clearTimeout(timer);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      clearTimeout(timer);
      return null;
    }
  }

  async function unduhBerkasTeks(path, build, sha) {
    try {
      const base = sha ? GITHUB_RAW_BASE.replace("/main/", "/" + sha + "/") : GITHUB_RAW_BASE;
      const url = base + path + "?nc=" + build + "_" + Date.now();
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return null;
      return await res.text();
    } catch (e) {
      return null;
    }
  }

  async function lakukanPatching(db, remote) {
    const buildBaru = Number(remote.build);
    const sha = remote && remote._sha ? remote._sha : "";
    let berkasTarget = Array.isArray(remote.patch_files) && remote.patch_files.length > 0
      ? remote.patch_files
      : DAFTAR_SKRIP.concat(["style.css", "settings.css"]);

    perbaruiStatusUI("Mengunduh patch Build " + buildBaru + "...", 0);

    let berhasil = 0;
    const petaBaru = {};

    for (let i = 0; i < berkasTarget.length; i++) {
      const nama = berkasTarget[i];
      const persen = Math.round(((i + 1) / berkasTarget.length) * 100);
      perbaruiStatusUI("Mengunduh " + nama, persen);

      const konten = await unduhBerkasTeks(nama, buildBaru, sha);
      if (konten !== null) {
        petaBaru[nama] = konten;
        if (db) await simpanPatch(db, nama, konten, buildBaru);
        berhasil++;
      }
    }

    if (berhasil > 0) {
      try {
        localStorage.setItem("se_patch_build", String(buildBaru));
      } catch (e) {}
      perbaruiStatusUI("Pembaruan Build " + buildBaru + " berhasil dipasang!", 100);
    }
    return petaBaru;
  }

  function terapkanPatchCSS(petaPatch) {
    if (petaPatch["style.css"]) {
      let st = document.getElementById("se-patch-style");
      if (!st) {
        st = document.createElement("style");
        st.id = "se-patch-style";
        document.head.appendChild(st);
      }
      st.textContent = petaPatch["style.css"];
    }
    if (petaPatch["settings.css"]) {
      let st = document.getElementById("se-patch-settings");
      if (!st) {
        st = document.createElement("style");
        st.id = "se-patch-settings";
        document.head.appendChild(st);
      }
      st.textContent = petaPatch["settings.css"];
    }
  }

  function muatSkripBerurutan(daftar, indeks, petaPatch, selesai) {
    if (indeks >= daftar.length) {
      if (typeof selesai === "function") selesai();
      return;
    }
    const nama = daftar[indeks];
    const kodePatch = petaPatch && petaPatch[nama];

    const s = document.createElement("script");
    if (kodePatch) {
      s.textContent = kodePatch + "\n//# sourceURL=" + nama;
      document.body.appendChild(s);
      muatSkripBerurutan(daftar, indeks + 1, petaPatch, selesai);
    } else {
      s.src = nama;
      s.onload = function () {
        muatSkripBerurutan(daftar, indeks + 1, petaPatch, selesai);
      };
      s.onerror = function () {
        console.warn("Gagal memuat skrip: " + nama);
        muatSkripBerurutan(daftar, indeks + 1, petaPatch, selesai);
      };
      document.body.appendChild(s);
    }
  }

  function bersihkanPatchLama(db) {
    return new Promise((resolve) => {
      if (!db) return resolve();
      try {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (err) {
        resolve();
      }
    });
  }

  async function mulaiBootstrapper() {
    const buildBawaan = ambilBuildBawaan();
    let tersimpanBuild = 0;
    try {
      tersimpanBuild = parseInt(localStorage.getItem("se_patch_build") || "0", 10);
    } catch (e) {}

    const db = await bukaDB();
    if (db && tersimpanBuild < buildBawaan) {
      await bersihkanPatchLama(db);
      try {
        localStorage.setItem("se_patch_build", String(buildBawaan));
      } catch (e) {}
    }

    const buildAktif = ambilBuildAktif();
    const teksVersi = document.getElementById("updateVersiTeks");
    if (teksVersi) {
      teksVersi.textContent = "Build " + buildAktif;
    }

    perbaruiStatusUI("Memeriksa pembaruan...");

    let petaPatch = await ambilSemuaPatch(db);

    const remote = await periksaManifestRemote(2500);

    if (remote && typeof remote.build === "number" && remote.build > buildAktif) {
      const petaTerbaru = await lakukanPatching(db, remote);
      for (const k in petaTerbaru) {
        petaPatch[k] = petaTerbaru[k];
      }
      if (teksVersi) {
        teksVersi.textContent = "Build " + remote.build;
      }
    } else {
      perbaruiStatusUI("Menyiapkan game...");
    }

    terapkanPatchCSS(petaPatch);

    muatSkripBerurutan(DAFTAR_SKRIP, 0, petaPatch, function () {
      perbaruiStatusUI("Game siap!");
    });
  }

  window.SE_PATCHER = {
    ambilBuildAktif: ambilBuildAktif,
    cekUpdateManual: async function (notifJikaSama) {
      const buildAktif = ambilBuildAktif();
      const db = await bukaDB();
      perbaruiStatusUI("Memeriksa pembaruan...");

      const remote = await periksaManifestRemote(6000);
      if (!remote) {
        alert("Tidak dapat terhubung ke server pembaruan. Periksa koneksi internet.");
        return;
      }

      if (typeof remote.build === "number" && remote.build > buildAktif) {
        const konfirm = confirm("Ditemukan pembaruan Build " + remote.build + "!\n\nUnduh dan terapkan pembaruan langsung sekarang?");
        if (!konfirm) return;

        const overlay = document.getElementById("layarLoadingUpdate");
        if (overlay) {
          overlay.style.display = "flex";
          overlay.classList.remove("fade-out");
        }

        await lakukanPatching(db, remote);
        alert("Pembaruan Build " + remote.build + " berhasil diterapkan!\nGame akan dimuat ulang.");
        window.location.reload();
      } else {
        if (notifJikaSama) {
          alert("Game kamu sudah versi terbaru (Build " + buildAktif + ").");
        }
      }
    },
    resetKeBawaan: async function () {
      const konfirm = confirm("Apakah kamu yakin ingin menghapus semua patch dan kembali ke versi awal bawaan aplikasi?");
      if (!konfirm) return;
      const db = await bukaDB();
      await hapusSemuaPatch(db);
      alert("Patch telah dihapus. Game akan dimuat ulang.");
      window.location.reload();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mulaiBootstrapper);
  } else {
    mulaiBootstrapper();
  }
})();
