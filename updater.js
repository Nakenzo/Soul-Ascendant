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
      btnAksi.onclick = () => {
        const isApk = typeof IS_APK !== "undefined" ? IS_APK : false;
        const isPc = typeof IS_PC !== "undefined" ? IS_PC : false;
        const tujuan = isApk ? URL_APK : (isPc ? URL_EXE : URL_APK);

        if (isApk && window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
          window.open(tujuan, "_system");
        } else {
          window.location.href = tujuan;
        }
      };
    }

    modal.classList.remove("hidden");
  }

  async function periksaKeServer() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2600);

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
    const remote = await periksaKeServer();
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
