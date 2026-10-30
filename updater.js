(function () {
  function ambilVersiLokal() {
    const versi = typeof VERSI_GAME !== "undefined" ? VERSI_GAME : "0.1.0";
    let build = typeof BUILD_GAME !== "undefined"
      ? BUILD_GAME
      : (typeof BUILD_TERKINI === "number" ? BUILD_TERKINI : (typeof BUILD !== "undefined" ? BUILD : 118));
    const p = window.SA_PATCHER || window.SE_PATCHER;
    if (p && typeof p.ambilBuildAktif === "function") {
      build = p.ambilBuildAktif();
    }
    return { versi, build };
  }

  let sedangMenutup = false;
  let siapDitekan = false;
  let callbackSelesai = null;

  function aktifkanTransisiLogo() {
    if (sedangMenutup) return;
    sedangMenutup = true;
    siapDitekan = false;
    const layar = document.getElementById("layarLoadingUpdate");
    if (!layar) {
      if (typeof callbackSelesai === "function") callbackSelesai();
      return;
    }
    const bar = document.getElementById("updateProgressBar");
    if (bar) bar.style.width = "100%";
    const kepala = document.getElementById("updateProgressKepala");
    if (kepala) kepala.style.left = "100%";

    const promptTeks = document.getElementById("updatePromptTeks");
    if (promptTeks) {
      promptTeks.textContent = "MEMASUKI DUNIA...";
    }

    layar.classList.add("loading-selesai");
    setTimeout(function () {
      layar.classList.add("fade-out");
      setTimeout(function () {
        layar.style.display = "none";
        if (typeof statusGame !== "undefined" && statusGame === "title") {
          const lj = document.getElementById("layarJudul");
          if (lj) lj.classList.remove("hidden");
        }
        if (typeof callbackSelesai === "function") callbackSelesai();
      }, 450);
    }, 850);
  }

  function siapkanTekanLayar(cb) {
    callbackSelesai = cb;
    const layar = document.getElementById("layarLoadingUpdate");
    if (!layar) {
      if (typeof cb === "function") cb();
      return;
    }
    const bar = document.getElementById("updateProgressBar");
    if (bar) bar.style.width = "100%";
    const kepala = document.getElementById("updateProgressKepala");
    if (kepala) kepala.style.left = "100%";

    const statusTeks = document.getElementById("updateStatusTeks");
    if (statusTeks) statusTeks.style.display = "none";
    const promptTeks = document.getElementById("updatePromptTeks");
    if (promptTeks) promptTeks.style.display = "block";

    layar.classList.add("siap-tekan");
    siapDitekan = true;

    setTimeout(function () {
      if (!sedangMenutup) aktifkanTransisiLogo();
    }, 6000);
  }

  function pasangInteraksiLayar() {
    const layar = document.getElementById("layarLoadingUpdate");
    if (!layar) return;
    function tanganiSentuhan(e) {
      if (sedangMenutup) return;
      aktifkanTransisiLogo();
    }
    layar.addEventListener("click", tanganiSentuhan);
    layar.addEventListener("touchstart", function (e) {
      if (sedangMenutup) return;
      try { e.preventDefault(); } catch (err) {}
      aktifkanTransisiLogo();
    }, { passive: false });

    setTimeout(function () {
      const adaBar = document.getElementById("updateProgressBar");
      if (!adaBar && !sedangMenutup) {
        aktifkanTransisiLogo();
      }
    }, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", pasangInteraksiLayar);
  } else {
    pasangInteraksiLayar();
  }

  window.tutupLoadingUpdate = siapkanTekanLayar;
  window.aktifkanTransisiLogo = aktifkanTransisiLogo;

  window.cekPembaruanManual = function () {
    const p = window.SA_PATCHER || window.SE_PATCHER;
    if (p && typeof p.cekUpdateManual === "function") {
      p.cekUpdateManual(true);
    } else {
      alert("Sistem pembaruan sedang bersiap.");
    }
  };
})();
