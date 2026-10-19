(function () {
  const URL_MANIFEST = "https://raw.githubusercontent.com/Nakenzo/Soul-Essence/main/manifest.json?nc=";
  const URL_RELEASE_API = "https://api.github.com/repos/Nakenzo/Soul-Essence/releases/latest";
  const URL_APK = "https://github.com/Nakenzo/Soul-Essence/releases/latest/download/Soul-Essence.apk";
  const URL_EXE = "https://github.com/Nakenzo/Soul-Essence/releases/latest/download/Soul-Essence-Setup.exe";

  function ambilVersiLokal() {
    const versi = typeof VERSI_GAME !== "undefined" ? VERSI_GAME : "0.1.0";
    const build = typeof BUILD_GAME !== "undefined" ? BUILD_GAME : (typeof BUILD !== "undefined" ? BUILD : 64);
    return { versi, build };
  }

  function parseVersi(str) {
    return String(str || "").replace(/^[^\d]*/, "").split(".").map(Number);
  }

  function apakahAdaUpdate(lokal, remote) {
    if (!remote) return false;
    if (typeof remote.build === "number" && remote.build > lokal.build) {
      return true;
    }
    if (remote.version) {
      const vL = parseVersi(lokal.versi);
      const vR = parseVersi(remote.version);
      for (let i = 0; i < Math.max(vL.length, vR.length); i++) {
        const l = vL[i] || 0;
        const r = vR[i] || 0;
        if (r > l) return true;
        if (r < l) return false;
      }
    }
    return false;
  }

  function tutupLoading() {
    const layar = document.getElementById("layarLoadingUpdate");
    if (!layar) return;
    layar.classList.add("fade-out");
    setTimeout(() => {
      layar.style.display = "none";
      if (typeof statusGame !== "undefined" && statusGame === "title") {
        const lj = document.getElementById("layarJudul");
        if (lj) lj.classList.remove("hidden");
      }
    }, 350);
  }

  function bukaModalUpdate(info) {
    const modal = document.getElementById("modalUpdate");
    if (!modal) return;

    const badge = document.getElementById("modalUpdateBadgeVersi");
    if (badge) {
      badge.textContent = "Versi " + (info.version || ("Build " + info.build));
    }

    const catatan = document.getElementById("modalUpdateCatatan");
    if (catatan) {
      if (info.catatan) {
        catatan.textContent = info.catatan;
        catatan.hidden = false;
      } else {
        catatan.textContent = "Tersedia pembaruan terbaru untuk game Soul Essence.";
      }
    }

    const btnBatal = document.getElementById("tombolBatalUpdate");
    if (btnBatal) {
      btnBatal.onclick = () => {
        modal.classList.add("hidden");
        tutupLoading();
      };
    }

    const btnAksi = document.getElementById("tombolAksiUpdate");
    if (btnAksi) {
      btnAksi.onclick = (e) => {
        if (e && e.preventDefault) e.preventDefault();

        const isAndroidApp = !!(window.AndroidNative || (typeof IS_APK !== "undefined" && IS_APK) || (typeof window !== "undefined" && window.Capacitor));
        const isPcApp = typeof IS_PC !== "undefined" ? IS_PC : (typeof window !== "undefined" && !!(window.__TAURI__ || window.__TAURI_INTERNALS__));
        const tujuan = isAndroidApp ? URL_APK : (isPcApp ? URL_EXE : URL_APK);

        btnAksi.disabled = true;
        btnAksi.textContent = "Menyiapkan Unduhan...";

        const pesanEl = document.getElementById("modalUpdatePesan");

        if (window.AndroidNative && typeof window.AndroidNative.unduhDanPasangApk === "function") {
          if (pesanEl) {
            pesanEl.textContent = "Mengunduh pembaruan APK langsung... Mohon jangan tutup aplikasi.";
          }

          window.onProgressUpdateApk = (persen) => {
            btnAksi.textContent = "Mengunduh " + persen + "%";
            if (pesanEl) {
              pesanEl.textContent = "Mengunduh berkas APK (" + persen + "%)... Jendela instalasi akan terbuka otomatis setelah selesai.";
            }
          };

          window.onProgressUpdateMb = (mb) => {
            btnAksi.textContent = "Mengunduh " + mb + " MB";
            if (pesanEl) {
              pesanEl.textContent = "Mengunduh berkas APK (" + mb + " MB)... Jendela instalasi akan terbuka otomatis setelah selesai.";
            }
          };

          window.onMintaIzinInstall = () => {
            btnAksi.disabled = false;
            btnAksi.textContent = "Pasang Pembaruan";
            if (pesanEl) {
              pesanEl.innerHTML = "Aktifkan izin 'Instal aplikasi tidak dikenal' untuk Soul Essence di layar Pengaturan Android yang baru terbuka, lalu tekan tombol ini lagi.";
            }
          };

          window.onGagalUpdateApk = (err) => {
            btnAksi.disabled = false;
            btnAksi.textContent = "Coba Lagi";
            if (pesanEl) {
              pesanEl.innerHTML = "Unduhan otomatis gagal (" + (err || "koneksi terputus") + "). Silakan unduh manual:<br><a href=\"" + tujuan + "\" target=\"_blank\" style=\"color:#38bdf8;text-decoration:underline;word-break:break-all;\">" + tujuan + "</a>";
            }
          };

          try {
            window.AndroidNative.unduhDanPasangApk(tujuan);
            return;
          } catch (err) {}
        }

        if (isPcApp && window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function") {
          btnAksi.textContent = "Membuka Unduhan PC...";
          if (pesanEl) {
            pesanEl.textContent = "Membuka tautan unduhan Soul-Essence-Setup.exe di browser...";
          }
          window.__TAURI__.core.invoke("buka_url", { url: tujuan }).catch(() => {
            window.__TAURI__.core.invoke("buka_url", { url: "https://github.com/Nakenzo/Soul-Essence/releases/latest" });
          });
          setTimeout(() => {
            btnAksi.disabled = false;
            btnAksi.textContent = "Unduh Ulang";
            if (pesanEl) {
              pesanEl.innerHTML = "Jika unduhan tidak mulai otomatis, silakan unduh manual:<br><a href=\"" + tujuan + "\" target=\"_blank\" style=\"color:#38bdf8;text-decoration:underline;word-break:break-all;\">" + tujuan + "</a>";
            }
          }, 3000);
          return;
        }

        if (window.AndroidNative && typeof window.AndroidNative.bukaUrl === "function") {
          try {
            window.AndroidNative.bukaUrl(tujuan);
          } catch (err) {}
        }

        try {
          const a = document.createElement("a");
          a.href = tujuan;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            if (a.parentNode) a.parentNode.removeChild(a);
          }, 1000);
        } catch (err) {}

        try {
          window.open(tujuan, "_system");
        } catch (err) {}

        try {
          window.open(tujuan, "_blank");
        } catch (err) {}

        setTimeout(() => {
          btnAksi.disabled = false;
          btnAksi.textContent = "Perbarui Sekarang";
          if (pesanEl) {
            pesanEl.innerHTML = "Jika unduhan tidak mulai otomatis, silakan unduh manual melalui tautan rilis berikut:<br><a href=\"" + tujuan + "\" target=\"_blank\" style=\"color:#38bdf8;text-decoration:underline;word-break:break-all;\">" + tujuan + "</a>";
          }
        }, 2500);
      };
    }

    modal.classList.remove("hidden");
  }

  async function periksaKeServer(timeoutMs) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs || 6500);

    try {
      const res = await fetch(URL_MANIFEST + Date.now(), {
        signal: controller.signal,
        cache: "no-store"
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error("Gagal mengambil manifest");
      const remote = await res.json();
      return remote;
    } catch (err) {
      clearTimeout(timeoutId);
      return null;
    }
  }

  async function ambilCatatanRilis() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);
    try {
      const res = await fetch(URL_RELEASE_API, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) return "";
      const json = await res.json();
      return json.body || "";
    } catch (err) {
      clearTimeout(timeoutId);
      return "";
    }
  }

  async function inisialisasiUpdater() {
    const lokal = ambilVersiLokal();
    const teksVersi = document.getElementById("updateVersiTeks");
    if (teksVersi) {
      teksVersi.textContent = "v" + lokal.versi + " (Build " + lokal.build + ")";
    }

    const teksStatus = document.getElementById("updateStatusTeks");
    if (teksStatus) {
      teksStatus.textContent = "Memeriksa pembaruan...";
    }

    const remote = await periksaKeServer();

    if (!remote) {
      if (teksStatus) {
        teksStatus.textContent = "Mode Offline \u2022 Menyiapkan Game...";
      }
      setTimeout(tutupLoading, 300);
      return;
    }

    const adaUpdate = apakahAdaUpdate(lokal, remote);

    if (adaUpdate) {
      if (teksStatus) {
        teksStatus.textContent = "Pembaruan Ditemukan!";
      }
      const catatan = await ambilCatatanRilis();
      bukaModalUpdate({
        version: remote.version || "Terbaru",
        build: remote.build,
        catatan: catatan
      });
    } else {
      if (teksStatus) {
        teksStatus.textContent = "\u2713 Versi kamu sudah yang terbaru!";
        teksStatus.classList.add("sukses");
      }
      setTimeout(tutupLoading, 550);
    }
  }

  window.cekPembaruanManual = async function () {
    const lokal = ambilVersiLokal();
    const remote = await periksaKeServer(10000);
    if (!remote) {
      alert("Tidak dapat terhubung ke server pembaruan. Periksa koneksi internet.");
      return;
    }
    if (apakahAdaUpdate(lokal, remote)) {
      const catatan = await ambilCatatanRilis();
      bukaModalUpdate({
        version: remote.version || "Terbaru",
        build: remote.build,
        catatan: catatan
      });
    } else {
      alert("Game kamu sudah versi terbaru (v" + lokal.versi + " Build " + lokal.build + ").");
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inisialisasiUpdater);
  } else {
    inisialisasiUpdater();
  }
})();
