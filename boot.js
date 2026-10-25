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

  const BUILD_SEKARANG = 105;
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

  function ambilPlatformSaatIni() {
    if (typeof window.AndroidNative !== "undefined" || typeof window.Capacitor !== "undefined") return "apk";
    if (typeof window.__TAURI__ !== "undefined" || typeof window.__TAURI_INTERNALS__ !== "undefined") return "pc";
    const attr = document.documentElement.getAttribute("data-platform");
    if (attr === "apk" || attr === "pc" || attr === "web") return attr;
    const ua = navigator.userAgent || "";
    if (/Android/i.test(ua)) return "apk";
    return "web";
  }

  function cekPerluInstalUlang(remote) {
    if (!remote) return false;
    const platform = ambilPlatformSaatIni();
    if (platform === "web") return false;
    const buildBawaan = ambilBuildBawaan();

    if (remote.perlu_instal_ulang === true || remote.perlu_reinstal === true) {
      const targetBuild = typeof remote.min_shell_build === "number" ? remote.min_shell_build : remote.build;
      if (typeof targetBuild === "number" && buildBawaan < targetBuild) {
        return true;
      }
    }
    if (typeof remote.min_shell_build === "number" && buildBawaan < remote.min_shell_build) {
      return true;
    }
    return false;
  }

  function tampilkanModalUpdate(remote, db, butuhInstal, onBatalCallback) {
    let modal = document.getElementById("modalUpdate");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modalUpdate";
      modal.className = "modal-update-overlay";
      modal.innerHTML = `
        <div class="modal-update-kotak">
          <div class="modal-update-kepala">
            <span class="modal-update-ikon">&#128640;</span>
            <h3 class="modal-update-judul">Pembaruan Tersedia!</h3>
          </div>
          <div class="modal-update-isi">
            <div class="modal-update-badge-bar">
              <span id="modalUpdateBadgeVersi" class="modal-update-badge">Versi Baru</span>
            </div>
            <p id="modalUpdatePesan" class="modal-update-pesan"></p>
            <div id="modalUpdateCatatan" class="modal-update-catatan" hidden></div>
            <div id="modalUpdateProgressArea" class="modal-update-progress-area" style="display:none">
              <div class="modal-update-bar-rel">
                <div id="modalUpdateBarFill" class="modal-update-bar-fill"></div>
              </div>
              <span id="modalUpdateProgressTeks" class="modal-update-progress-teks">Mengunduh... 0%</span>
            </div>
          </div>
          <div class="modal-update-kaki">
            <button id="tombolBatalUpdate" type="button" class="tombol-update-batal">Nanti Saja</button>
            <button id="tombolSekunderUpdate" type="button" class="tombol-update-sekunder" style="display:none">&#9889; Lanjut Sementara</button>
            <button id="tombolAksiUpdate" type="button" class="tombol-update-unduh">&#128229; Perbarui Sekarang</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const platform = ambilPlatformSaatIni();
    const urlApk = (remote && remote.url_apk) || "https://github.com/Nakenzo/Soul-Ascendant/releases/latest/download/Soul-Ascendant.apk";
    const urlPc = (remote && remote.url_pc) || "https://github.com/Nakenzo/Soul-Ascendant/releases/latest/download/Soul-Ascendant.exe";

    let btnSekunder = document.getElementById("tombolSekunderUpdate");
    const kaki = modal.querySelector(".modal-update-kaki");
    if (!btnSekunder && kaki) {
      btnSekunder = document.createElement("button");
      btnSekunder.id = "tombolSekunderUpdate";
      btnSekunder.type = "button";
      btnSekunder.className = "tombol-update-sekunder";
      const btnAksiRef = document.getElementById("tombolAksiUpdate");
      if (btnAksiRef) kaki.insertBefore(btnSekunder, btnAksiRef);
      else kaki.appendChild(btnSekunder);
    }

    let progArea = document.getElementById("modalUpdateProgressArea");
    const isi = modal.querySelector(".modal-update-isi");
    if (!progArea && isi) {
      progArea = document.createElement("div");
      progArea.id = "modalUpdateProgressArea";
      progArea.className = "modal-update-progress-area";
      progArea.style.display = "none";
      progArea.innerHTML = `
        <div class="modal-update-bar-rel">
          <div id="modalUpdateBarFill" class="modal-update-bar-fill"></div>
        </div>
        <span id="modalUpdateProgressTeks" class="modal-update-progress-teks">Mengunduh... 0%</span>
      `;
      isi.appendChild(progArea);
    }

    const badge = document.getElementById("modalUpdateBadgeVersi");
    const judul = modal.querySelector(".modal-update-judul");
    const pesan = document.getElementById("modalUpdatePesan");
    const catatan = document.getElementById("modalUpdateCatatan");
    const btnBatal = document.getElementById("tombolBatalUpdate");
    const btnUnduh = document.getElementById("tombolAksiUpdate");

    if (butuhInstal) {
      if (badge) {
        badge.textContent = platform === "apk" ? "Instal Ulang APK Disarankan" : (platform === "pc" ? "Update Installer PC Disarankan" : "Pembaruan Aplikasi Baru");
        badge.classList.add("reinstall");
      }
      if (judul) {
        judul.textContent = platform === "apk" ? "Update Versi APK Baru" : "Pembaruan Aplikasi Baru";
      }
      if (pesan) {
        pesan.textContent = (remote && remote.pesan_instal_ulang) || (remote && remote.pesan) || "Pembaruan ini mencakup pembaruan loading screen & struktur antarmuka baru. Pasang ulang aplikasi terbaru agar tampilan baru aktif sempurna.";
      }
      if (catatan) {
        catatan.textContent = "Versi bawaan terpasang: Build " + ambilBuildBawaan() + " \u2192 Versi rilis: Build " + ((remote && remote.build) || BUILD_SEKARANG);
        catatan.hidden = false;
      }
    } else {
      if (badge) {
        badge.textContent = "Pembaruan Tersedia";
        badge.classList.remove("reinstall");
      }
      if (judul) {
        judul.textContent = "Pembaruan Tersedia!";
      }
      if (pesan) {
        pesan.textContent = (remote && remote.pesan) || "Versi baru Soul Ascendant telah tersedia dari developer. Pilih untuk memperbarui sekarang atau nanti saja.";
      }
      if (catatan) {
        if (remote && remote.catatan) {
          catatan.textContent = remote.catatan;
          catatan.hidden = false;
        } else {
          catatan.hidden = true;
        }
      }
    }

    const tutupModal = () => {
      modal.classList.add("hidden");
    };

    if (btnBatal) {
      btnBatal.onclick = () => {
        try {
          sessionStorage.setItem("sa_update_ditunda", "1");
        } catch (e) {}
        tutupModal();
        if (typeof onBatalCallback === "function") {
          onBatalCallback();
        }
      };
    }

    if (btnSekunder) {
      if (butuhInstal) {
        btnSekunder.style.display = "inline-flex";
        btnSekunder.innerHTML = "&#9889; Lanjut Sementara";
        btnSekunder.onclick = async () => {
          tutupModal();
          const overlay = document.getElementById("layarLoadingUpdate");
          if (overlay) {
            overlay.style.display = "flex";
            overlay.classList.remove("fade-out");
          }
          perbaruiStatusUI("Menerapkan patch sementara...", 0);
          const berhasil = await lakukanPatchingAtomic(db, remote);
          if (!berhasil) {
            alert("Gagal mengunduh patch sementara. Memuat versi yang ada.");
            if (typeof onBatalCallback === "function") onBatalCallback();
          }
        };
      } else {
        btnSekunder.style.display = "none";
      }
    }

    if (btnUnduh) {
      if (butuhInstal) {
        btnUnduh.classList.add("mode-reinstall");
        if (platform === "apk") {
          btnUnduh.innerHTML = "&#11015; Unduh & Pasang APK Baru";
        } else if (platform === "pc") {
          btnUnduh.innerHTML = "&#11015; Unduh Installer PC Baru";
        } else {
          btnUnduh.innerHTML = "&#11015; Unduh Rilis Baru";
        }
        btnUnduh.onclick = () => {
          if (platform === "apk") {
            if (window.AndroidNative && typeof window.AndroidNative.unduhDanPasangApk === "function") {
              if (btnSekunder) btnSekunder.style.display = "none";
              btnUnduh.style.display = "none";
              if (btnBatal) btnBatal.textContent = "Batal Unduh";
              if (progArea) {
                progArea.style.display = "flex";
                const fill = document.getElementById("modalUpdateBarFill");
                if (fill) fill.style.width = "0%";
                const teks = document.getElementById("modalUpdateProgressTeks");
                if (teks) teks.textContent = "Menghubungkan ke server APK...";
              }
              window.onProgressUpdateApk = function (p) {
                const fill = document.getElementById("modalUpdateBarFill");
                if (fill) fill.style.width = p + "%";
                const teks = document.getElementById("modalUpdateProgressTeks");
                if (teks) teks.textContent = "Mengunduh APK baru... (" + p + "%)";
              };
              window.onProgressUpdateMb = function (mb) {
                const teks = document.getElementById("modalUpdateProgressTeks");
                if (teks) teks.textContent = "Mengunduh APK baru... (" + mb + " MB)";
              };
              window.onGagalUpdateApk = function (err) {
                const teks = document.getElementById("modalUpdateProgressTeks");
                if (teks) teks.textContent = "Gagal unduh otomatis (" + err + "). Mengalihkan ke peramban...";
                setTimeout(function () {
                  window.location.href = urlApk;
                }, 1200);
              };
              window.AndroidNative.unduhDanPasangApk(urlApk);
              return;
            }
            window.location.href = urlApk;
            if (pesan) {
              pesan.textContent = "Unduhan file APK telah dimulai di peramban. Silakan buka file APK setelah unduhan selesai.";
            }
          } else if (platform === "pc") {
            try {
              if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function") {
                window.__TAURI__.core.invoke("buka_url", { url: urlPc });
              } else if (window.__TAURI_INTERNALS__ && typeof window.__TAURI_INTERNALS__.invoke === "function") {
                window.__TAURI_INTERNALS__.invoke("buka_url", { url: urlPc });
              } else {
                window.open(urlPc, "_blank");
              }
            } catch (e) {
              window.open(urlPc, "_blank");
            }
            if (pesan) {
              pesan.textContent = "Halaman rilis terbaru telah dibuka di peramban. Silakan unduh installer PC terbaru.";
            }
          } else {
            window.open(urlPc, "_blank");
          }
        };
      } else {
        btnUnduh.classList.remove("mode-reinstall");
        btnUnduh.innerHTML = "&#128229; Perbarui Sekarang";
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
    if (petaPatch["updater.css"]) {
      let st = document.getElementById("sa-patch-updater");
      if (!st) {
        st = document.createElement("style");
        st.id = "sa-patch-updater";
        document.head.appendChild(st);
      }
      st.textContent = petaPatch["updater.css"];
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

  async function lanjutkanBootGame(db) {
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

    let ditunda = false;
    try {
      ditunda = sessionStorage.getItem("sa_update_ditunda") === "1";
    } catch (e) {}

    if (!ditunda) {
      try {
        const remote = await periksaRemoteUpdate(3500);
        if (remote) {
          const tsAktif = ambilTimestampAktif();
          const bAktif = ambilBuildAktif();
          const adaUpdateTS = remote.timestamp && remote.timestamp > tsAktif;
          const adaUpdateBuild = typeof remote.build === "number" && remote.build > bAktif;
          if (adaUpdateTS || adaUpdateBuild) {
            const butuhInstal = cekPerluInstalUlang(remote);
            if (butuhInstal) {
              tampilkanModalUpdate(remote, db, true, function () {
                lanjutkanBootGame(db);
              });
              return;
            }
            perbaruiStatusUI("Mengunduh patch otomatis...", 25);
            await lakukanPatchingAtomic(db, remote);
            return;
          }
        }
      } catch (errCheck) {}
    }

    await lanjutkanBootGame(db);
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
        const butuhInstal = cekPerluInstalUlang(remote);
        tampilkanModalUpdate(remote, db, butuhInstal);
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
