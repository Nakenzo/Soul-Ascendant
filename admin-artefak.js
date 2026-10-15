// PANEL DEBUG ARTEFAK (alat admin / testing).
// Dipakai buat tes cepat tanpa harus mengalahkan bos berulang-ulang.
(function () {
  "use strict";

  function siap() {
    if (typeof ARTEFAK_SET === "undefined" || typeof artefakId !== "function") {
      setTimeout(siap, 100);
      return;
    }
    if (!document.getElementById("debugArtefakLog")) buatPanel();
  }

  function segarkanTampilan() {
    hitungDimiliki();
    if (typeof buatPilihanUpgrade === "function") {
      try { buatPilihanUpgrade(); } catch (e) { }
    }
    if (typeof sfxKlik === "function") { try { sfxKlik(); } catch (e) { } }
  }

  function stabilkan() {
    if (!progres.artefakMilik) progres.artefakMilik = {};
    if (!progres.artefakBintang) progres.artefakBintang = {};
    if (!progres.artefakSubstat) progres.artefakSubstat = {};
    if (!progres.artefakPakai) progres.artefakPakai = {};
  }

  function beriSemua(level) {
    stabilkan();
    const lv = Math.max(1, Math.min(level, ARTEFAK_LEVEL_MAX));
    let jumlah = 0;
    for (let s = 0; s < ARTEFAK_SET.length; s++) {
      for (let i = 0; i < ARTEFAK_SLOT.length; i++) {
        const id = artefakId(ARTEFAK_SET[s].kunci, ARTEFAK_SLOT[i].kunci);
        progres.artefakMilik[id] = lv;
        if (!progres.artefakBintang[id]) progres.artefakBintang[id] = 5;
        if (!progres.artefakSubstat[id]) progres.artefakSubstat[id] = acakSubstat(5);
        jumlah++;
      }
    }
    saveTulis();
    catat(`BERI ${jumlah} artefak LV${lv} 5★`);
    segarkanTampilan();
  }

  function pasangOtomatis() {
    stabilkan();
    // pasang set pertama penuh di semua slot, biar tier 4 langsung kepakai
    const set = ARTEFAK_SET[0];
    for (let i = 0; i < ARTEFAK_SLOT.length; i++) {
      const slot = ARTEFAK_SLOT[i].kunci;
      const id = artefakId(set.kunci, slot);
      if (progres.artefakMilik[id] > 0) pasangArtefak("kenzro", slot, id);
    }
    catat(`PASANG ${set.nama} lengkap ke kenzro`);
    segarkanTampilan();
  }

  function resetSemua() {
    stabilkan();
    progres.artefakMilik = {};
    progres.artefakBintang = {};
    progres.artefakSubstat = {};
    progres.artefakPakai = {};
    saveTulis();
    artefakBaruTerakhir = null;
    catat("RESET semua artefak");
    segarkanTampilan();
  }

  function koin(banyak) {
    progres.koinSaldo = (progres.koinSaldo || 0) + banyak;
    saveTulis();
    catat("KOIN +" + banyak);
    segarkanTampilan();
  }

  function catat(pesan) {
    const el = document.getElementById("debugArtefakLog");
    if (el) el.title = pesan;
    if (typeof console !== "undefined" && console.log) console.log("[debug artefak] " + pesan);
  }

  function tombol(teks, aksi) {
    return adminTombol(teks, aksi);
  }

  function buatPanel() {
    if (typeof adminSisip !== "function" || typeof adminTombol !== "function") {
      setTimeout(buatPanel, 150);
      return;
    }
    if (document.getElementById("debugArtefakLog")) return;

    const pisah = document.createElement("span");
    pisah.className = "adm-pisah";
    adminSisip(pisah);

    adminSisip(tombol("SKILL VENDER", () => {
      if (!progres.skillPakai) progres.skillPakai = {};
      progres.skillPakai["rin"] = 3;
      saveTulis();
      catat("SKILL VENDER -> slot 3 (inferno)");
      segarkanTampilan();
    }));

    adminSisip(tombol("ARTEFAK LV1", () => beriSemua(1)));
    adminSisip(tombol("ARTEFAK LV5", () => beriSemua(5)));
    adminSisip(tombol("ARTEFAK MAX", () => beriSemua(ARTEFAK_LEVEL_MAX)));
    adminSisip(tombol("PASANG SET", pasangOtomatis));
    adminSisip(tombol("KOIN +500K", () => koin(500000)));
    adminSisip(tombol("RESET ARTEFAK", resetSemua));

    const log = document.createElement("span");
    log.id = "debugArtefakLog";
    log.className = "adm-info";
    adminSisip(log);

    hitungDimiliki();
  }

  function hitungDimiliki() {
    const el = document.getElementById("debugArtefakLog");
    if (!el) return;
    const total = ARTEFAK_SET.length * ARTEFAK_SLOT.length;
    let punya = 0;
    for (const set of ARTEFAK_SET) {
      for (const slot of ARTEFAK_SLOT) {
        if (artefakLevel(artefakId(set.kunci, slot.kunci)) > 0) punya++;
      }
    }
    el.textContent = "DIMILIKI " + punya + "/" + total;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", siap);
  } else {
    siap();
  }
})();
