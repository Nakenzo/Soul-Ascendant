(function () {
  const ENDPOINTS_VERSION = [
    "https://raw.githubusercontent.com/Nakenzo/Soul-Ascendant/main/version.json?nc=",
    "https://nakenzo.github.io/Soul-Ascendant/version.json?nc=",
    "https://cdn.jsdelivr.net/gh/Nakenzo/Soul-Ascendant@main/version.json?nc="
  ];
  const ENDPOINTS_MANIFEST = [
    "https://raw.githubusercontent.com/Nakenzo/Soul-Ascendant/main/manifest.json?nc=",
    "https://nakenzo.github.io/Soul-Ascendant/manifest.json?nc="
  ];
  const BASES_CDN = [
    "https://raw.githubusercontent.com/Nakenzo/Soul-Ascendant/main/",
    "https://nakenzo.github.io/Soul-Ascendant/",
    "https://cdn.jsdelivr.net/gh/Nakenzo/Soul-Ascendant@main/"
  ];
  const DB_NAME = "SoulAscendantPatchDB";
  const DB_VERSION = 2;
  const STORE_ACTIVE = "active_patches";
  const STORE_STAGING = "staging_patches";

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
    "vfx.js",
    "draw.js",
    "ambience.js",
    "updater.js",
    "main.js",
    "admin-konfig.js",
    "admin-akun.js"
  ];

  const BUILD_SEKARANG = 93;
  let petaPatchAktif = {};

  let bootErrorCount = 0;
  try {
    bootErrorCount = parseInt(sessionStorage.getItem("sa_boot_err_count") || "0", 10);
  } catch (e) {}

  function tanganiBootCrash() {
    try {
      sessionStorage.setItem("sa_boot_err_count", String(bootErrorCount + 1));
      if (bootErrorCount >= 2) {
        sessionStorage.removeItem("sa_boot_err_count");
        localStorage.removeItem("sa_patch_build");
        if (window.indexedDB) {
          indexedDB.deleteDatabase(DB_NAME);
        }
        window.location.reload();
      }
    } catch (e) {}
  }

  const crashWatchdog = function (e) {
    tanganiBootCrash();
  };
  window.addEventListener("error", crashWatchdog);
  setTimeout(function () {
    window.removeEventListener("error", crashWatchdog);
    try {
      sessionStorage.removeItem("sa_boot_err_count");
    } catch (e) {}
  }, 5000);

  function ambilBuildBawaan() {
    if (typeof BUILD_TERKINI === "number" && BUILD_TERKINI > 0) return BUILD_TERKINI;
    if (typeof BUILD_GAME !== "undefined") return BUILD_GAME;
    if (typeof BUILD !== "undefined") return BUILD;
    return BUILD_SEKARANG;
  }

  function ambilBuildAktif() {
    try {
      const tersimpan = localStorage.getItem("sa_patch_build");
      if (tersimpan) {
        const n = parseInt(tersimpan, 10);
        if (Number.isFinite(n) && n >= ambilBuildBawaan()) return n;
      }
    } catch (e) {}
    return ambilBuildBawaan();
  }

  function ambilTimestampBawaan() {
    return 1740000000000;
  }

  function ambilTimestampAktif() {
    try {
      const tersimpan = localStorage.getItem("sa_patch_timestamp");
      if (tersimpan) {
        const n = parseInt(tersimpan, 10);
        if (Number.isFinite(n) && n > 0) return n;
      }
    } catch (e) {}
    return ambilTimestampBawaan();
  }

  function bukaDB() {
    return new Promise((resolve) => {
      if (!window.indexedDB) return resolve(null);
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = function (e) {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_ACTIVE)) {
            db.createObjectStore(STORE_ACTIVE, { keyPath: "path" });
          }
          if (!db.objectStoreNames.contains(STORE_STAGING)) {
            db.createObjectStore(STORE_STAGING, { keyPath: "path" });
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
        const tx = db.transaction(STORE_ACTIVE, "readonly");
        const store = tx.objectStore(STORE_ACTIVE);
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

  function simpanStaging(db, path, content, build) {
    return new Promise((resolve) => {
      if (!db) return resolve(false);
      try {
        const tx = db.transaction(STORE_STAGING, "readwrite");
        const store = tx.objectStore(STORE_STAGING);
        const req = store.put({ path, content, build, waktu: Date.now() });
        req.onsuccess = function () { resolve(true); };
        req.onerror = function () { resolve(false); };
      } catch (err) {
        resolve(false);
      }
    });
  }

  function bersihkanStaging(db) {
    return new Promise((resolve) => {
      if (!db) return resolve(true);
      try {
        const tx = db.transaction(STORE_STAGING, "readwrite");
        const store = tx.objectStore(STORE_STAGING);
        const req = store.clear();
        req.onsuccess = function () { resolve(true); };
        req.onerror = function () { resolve(false); };
      } catch (err) {
        resolve(false);
      }
    });
  }

  function komitAtomicStaging(db, buildBaru) {
    return new Promise((resolve) => {
      if (!db) return resolve(false);
      try {
        const tx = db.transaction([STORE_STAGING, STORE_ACTIVE], "readwrite");
        const stagingStore = tx.objectStore(STORE_STAGING);
        const activeStore = tx.objectStore(STORE_ACTIVE);

        const reqAll = stagingStore.getAll();
        reqAll.onsuccess = function () {
          const items = reqAll.result || [];
          if (items.length === 0) return resolve(false);

          activeStore.clear();
          for (let i = 0; i < items.length; i++) {
            activeStore.put(items[i]);
          }
          stagingStore.clear();
        };

        tx.oncomplete = function () {
          try {
            localStorage.setItem("sa_patch_build", String(buildBaru));
          } catch (e) {}
          resolve(true);
        };
        tx.onerror = function () {
          resolve(false);
        };
      } catch (err) {
        resolve(false);
      }
    });
  }

  function hapusSemuaPatch(db) {
    return new Promise((resolve) => {
      try {
        localStorage.removeItem("sa_patch_build");
      } catch (e) {}
      if (!db) return resolve(true);
      try {
        const tx = db.transaction([STORE_ACTIVE, STORE_STAGING], "readwrite");
        tx.objectStore(STORE_ACTIVE).clear();
        tx.objectStore(STORE_STAGING).clear();
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (err) {
        resolve(false);
      }
    });
  }

  function perbaruiStatusUI(teks, persen) {
    const el = document.getElementById("updateStatusTeks");
    if (el) {
      if (typeof persen === "number" && persen >= 0) {
        el.textContent = teks + " (" + persen + "%)";
      } else {
        el.textContent = teks;
      }
    }
    if (typeof persen === "number" && persen >= 0) {
      const p = Math.max(0, Math.min(100, persen));
      const bar = document.getElementById("updateProgressBar");
      if (bar) bar.style.width = p + "%";
      const kepala = document.getElementById("updateProgressKepala");
      if (kepala) kepala.style.left = p + "%";
    }
  }

  async function periksaRemoteUpdate(timeoutMs) {
    const batasWaktu = timeoutMs || 8000;
    for (let i = 0; i < ENDPOINTS_VERSION.length; i++) {
      const url = ENDPOINTS_VERSION[i] + Date.now();
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), batasWaktu);
      try {
        const res = await fetch(url, {
          signal: controller.signal
        });
        clearTimeout(timer);
        if (res.ok) {
          const data = await res.json();
          if (data && (data.build || data.timestamp)) return data;
        }
      } catch (err) {
        clearTimeout(timer);
      }
    }
    for (let i = 0; i < ENDPOINTS_MANIFEST.length; i++) {
      const url = ENDPOINTS_MANIFEST[i] + Date.now();
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), batasWaktu);
      try {
        const res = await fetch(url, {
          signal: controller.signal
        });
        clearTimeout(timer);
        if (res.ok) {
          const data = await res.json();
          if (data && (data.build || data.timestamp)) return data;
        }
      } catch (err) {
        clearTimeout(timer);
      }
    }
    return null;
  }

  async function unduhBerkasTeks(path, build, sha) {
    for (let i = 0; i < BASES_CDN.length; i++) {
      let base = BASES_CDN[i];
      if (sha && base.includes("/main/")) {
        base = base.replace("/main/", "/" + sha + "/");
      }
      const url = base + path + "?nc=" + build + "_" + Date.now();
      try {
        const res = await fetch(url);
        if (res.ok) {
          const text = await res.text();
          if (text && text.length > 0) return text;
        }
      } catch (e) {}
    }
    return null;
  }

  async function lakukanPatchingAtomic(db, remote) {
    const buildBaru = Number(remote.build);
    const sha = remote && remote._sha ? remote._sha : "";
    let berkasTarget = Array.isArray(remote.patch_files) && remote.patch_files.length > 0
      ? remote.patch_files
      : DAFTAR_SKRIP.concat(["style.css", "settings.css"]);

    perbaruiStatusUI("Mengunduh pembaruan...", 0);
    await bersihkanStaging(db);

    let gagal = false;
    for (let i = 0; i < berkasTarget.length; i++) {
      const nama = berkasTarget[i];
      const persen = Math.round(((i + 1) / berkasTarget.length) * 100);
      perbaruiStatusUI("Mengunduh " + nama, persen);

      const konten = await unduhBerkasTeks(nama, buildBaru, sha);
      if (konten === null) {
        gagal = true;
        break;
      }
      if (db) {
        const ok = await simpanStaging(db, nama, konten, buildBaru);
        if (!ok) {
          gagal = true;
          break;
        }
      }
    }

    if (gagal) {
      perbaruiStatusUI("Koneksi terganggu. Menggunakan versi stabil.", -1);
      await bersihkanStaging(db);
      return false;
    }

    const komitOk = await komitAtomicStaging(db, buildBaru);
    if (!komitOk) {
      await bersihkanStaging(db);
      return false;
    }

    try {
      if (remote.timestamp) {
        localStorage.setItem("sa_patch_timestamp", String(remote.timestamp));
      }
      if (remote.build) {
        localStorage.setItem("sa_patch_build", String(remote.build));
      }
    } catch (e) {}

    perbaruiStatusUI("Pembaruan siap! Memuat ulang...", 100);
    setTimeout(function () {
      window.location.reload();
    }, 400);
    return true;
  }

  function tampilkanModalUpdate(remote, db) {
    const modal = document.getElementById("modalUpdate");
    if (!modal) return;
    const badge = document.getElementById("modalUpdateBadgeVersi");
    if (badge) {
      badge.textContent = "Pembaruan Tersedia";
    }
    const pesan = document.getElementById("modalUpdatePesan");
    if (pesan) {
      pesan.textContent = remote.pesan || "Versi baru Soul Ascendant telah tersedia dari developer. Pilih untuk memperbarui sekarang atau nanti saja.";
    }
    const catatan = document.getElementById("modalUpdateCatatan");
    if (catatan) {
      if (remote.catatan) {
        catatan.textContent = remote.catatan;
        catatan.hidden = false;
      } else {
        catatan.hidden = true;
      }
    }

    const btnBatal = document.getElementById("tombolBatalUpdate");
    const btnUnduh = document.getElementById("tombolAksiUpdate");

    const tutupModal = () => {
      modal.classList.add("hidden");
    };

    if (btnBatal) {
      btnBatal.onclick = () => {
        try {
          sessionStorage.setItem("sa_update_ditunda", "1");
        } catch (e) {}
        tutupModal();
      };
    }

    if (btnUnduh) {
      btnUnduh.onclick = async () => {
        tutupModal();
        const overlay = document.getElementById("layarLoadingUpdate");
        if (overlay) {
          overlay.style.display = "flex";
          overlay.classList.remove("fade-out");
        }
        perbaruiStatusUI("Menyiapkan unduhan pembaruan...", 0);
        const berhasil = await lakukanPatchingAtomic(db, remote);
        if (!berhasil) {
          alert("Gagal mengunduh pembaruan secara lengkap. Versi stabil saat ini tetap aktif.");
          if (overlay) overlay.classList.add("fade-out");
        }
      };
    }

    modal.classList.remove("hidden");
  }

  function terapkanPatchCSS(petaPatch) {
    if (petaPatch["style.css"]) {
      let st = document.getElementById("sa-patch-style");
      if (!st) {
        st = document.createElement("style");
        st.id = "sa-patch-style";
        document.head.appendChild(st);
      }
      st.textContent = petaPatch["style.css"];
    }
    if (petaPatch["settings.css"]) {
      let st = document.getElementById("sa-patch-settings");
      if (!st) {
        st = document.createElement("style");
        st.id = "sa-patch-settings";
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
    const pMuat = Math.min(96, Math.round(35 + ((indeks + 1) / daftar.length) * 60));
    perbaruiStatusUI("Memuat aset game...", pMuat);

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

  async function mulaiBootstrapper() {
    const buildBawaan = ambilBuildBawaan();
    let tersimpanBuild = 0;
    try {
      tersimpanBuild = parseInt(localStorage.getItem("sa_patch_build") || "0", 10);
    } catch (e) {}

    const db = await bukaDB();
    if (db && tersimpanBuild < buildBawaan) {
      await hapusSemuaPatch(db);
      try {
        localStorage.setItem("sa_patch_build", String(buildBawaan));
      } catch (e) {}
    }

    const buildAktif = ambilBuildAktif();
    const teksVersi = document.getElementById("updateVersiTeks");
    if (teksVersi) {
      teksVersi.textContent = "v0.1.0";
    }

    perbaruiStatusUI("Memeriksa pembaruan online...", 15);

    try {
      const remote = await periksaRemoteUpdate(3500);
      if (remote) {
        const tsAktif = ambilTimestampAktif();
        const bAktif = ambilBuildAktif();
        const adaUpdateTS = remote.timestamp && remote.timestamp > tsAktif;
        const adaUpdateBuild = typeof remote.build === "number" && remote.build > bAktif;
        if (adaUpdateTS || adaUpdateBuild) {
          perbaruiStatusUI("Mengunduh patch otomatis...", 25);
          await lakukanPatchingAtomic(db, remote);
          return;
        }
      }
    } catch (errCheck) {}

    perbaruiStatusUI("Menyiapkan game...", 80);

    const waktuMulaiBoot = Date.now();
    let petaPatch = await ambilSemuaPatch(db);
    terapkanPatchCSS(petaPatch);
    petaPatchAktif = petaPatch;

    function selesaikanLoadingScreen() {
      perbaruiStatusUI("Game siap!", 100);
      if (typeof window.tutupLoadingUpdate === "function") {
        window.tutupLoadingUpdate();
      } else {
        const layar = document.getElementById("layarLoadingUpdate");
        if (layar) {
          layar.classList.add("loading-selesai");
          setTimeout(function () {
            layar.classList.add("fade-out");
            setTimeout(function () {
              layar.style.display = "none";
              const lj = document.getElementById("layarJudul");
              if (lj) lj.classList.remove("hidden");
            }, 450);
          }, 850);
        }
      }
    }

    muatSkripBerurutan(DAFTAR_SKRIP, 0, petaPatch, function () {
      const durasiBerjalan = Date.now() - waktuMulaiBoot;
      const sisaTunggu = Math.max(0, 1600 - durasiBerjalan);
      setTimeout(function () {
        selesaikanLoadingScreen();
      }, sisaTunggu);
    });
  }

  window.SA_PATCHER = window.SE_PATCHER = {
    ambilBuildAktif: ambilBuildAktif,
    ambilTimestampAktif: ambilTimestampAktif,
    ambilPatch: function (nama) {
      return (petaPatchAktif && petaPatchAktif[nama]) || null;
    },
    cekUpdateManual: async function (notifJikaSama) {
      try {
        sessionStorage.removeItem("sa_update_ditunda");
      } catch (e) {}
      const db = await bukaDB();
      const remote = await periksaRemoteUpdate(10000);
      if (!remote) {
        alert("Tidak dapat terhubung ke server pembaruan. Periksa koneksi internet.");
        return;
      }

      const tsAktif = ambilTimestampAktif();
      const bAktif = ambilBuildAktif();
      const adaUpdateTS = remote.timestamp && remote.timestamp > tsAktif;
      const adaUpdateBuild = typeof remote.build === "number" && remote.build > bAktif;

      if (adaUpdateTS || adaUpdateBuild) {
        tampilkanModalUpdate(remote, db);
      } else {
        if (notifJikaSama) {
          alert("Game kamu sudah versi terbaru.");
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
