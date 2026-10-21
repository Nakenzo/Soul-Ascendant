(function () {
  function ambilVersiLokal() {
    const versi = typeof VERSI_GAME !== "undefined" ? VERSI_GAME : "0.1.0";
    let build = typeof BUILD_GAME !== "undefined" ? BUILD_GAME : (typeof BUILD !== "undefined" ? BUILD : 72);
    const p = window.SA_PATCHER || window.SE_PATCHER;
    if (p && typeof p.ambilBuildAktif === "function") {
      build = p.ambilBuildAktif();
    }
    return { versi, build };
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

  window.tutupLoadingUpdate = tutupLoading;

  window.cekPembaruanManual = function () {
    const p = window.SA_PATCHER || window.SE_PATCHER;
    if (p && typeof p.cekUpdateManual === "function") {
      p.cekUpdateManual(true);
    } else {
      alert("Sistem pembaruan sedang bersiap.");
    }
  };

  setTimeout(tutupLoading, 300);
})();
