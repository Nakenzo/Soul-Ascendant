const SAVE_KUNCI = "soul-ascendant-progress";
const SAVE_KUNCI_BAK = "soul-ascendant-progress-bak";
// Cadangan: 3 slot manual + riwayat otomatis berputar.
const SAVE_KUNCI_SLOT = "soul-ascendant-slot-";
const SAVE_KUNCI_OTO = "soul-ascendant-auto";


const SLOT_CADANGAN_MAKS = 3;
const CADANGAN_AUTOMATIS_MAKS = 5;
const CADANGAN_JEDA_MS = 10 * 60 * 1000;
const KODE_SAVE_MAKS = 200000;
const SAVE_SALT = 0x9e3779b9;
const SAVE_SALT2 = 0x85ebca6b;
const SAVE_VERSI = 3;

const KARAKTER_LEVEL_MAX = 40;
const KOIN_MAKS = 999999999;

const maksIdArtefak = typeof ARTEFAK_ID_PANJANG_MAX === "number"
  ? ARTEFAK_ID_PANJANG_MAX
  : 40;
const maksLevelArtefak = typeof ARTEFAK_LEVEL_MAX === "number"
  ? ARTEFAK_LEVEL_MAX
  : 20;
const maksSlotSkill = typeof SKILL_SLOT_TOTAL === "number"
  ? SKILL_SLOT_TOTAL
  : 5;

function kunciAman(k) {
  return typeof k === "string" && k.length > 0 &&
    k !== "__proto__" && k !== "constructor" && k !== "prototype";
}

function _xorChr(k, c) {
  return (k * 31 + c) >>> 0;
}

function saveEnkode(obj) {
  const json = JSON.stringify(obj);
  let k = SAVE_SALT, bs = "";
  for (let i = 0; i < json.length; i++) {
    const c = json.charCodeAt(i);
    bs += String.fromCharCode(c ^ (k & 0xff));
    k = _xorChr(k, c);
  }
  try { return btoa(bs); } catch (err) { return ""; }
}

function saveDekode(str) {
  try {
    const bs = atob(str);
    let k = SAVE_SALT, json = "";
    for (let i = 0; i < bs.length; i++) {
      const c = bs.charCodeAt(i) ^ (k & 0xff);
      json += String.fromCharCode(c);
      k = _xorChr(k, c);
    }
    return JSON.parse(json);
  } catch (err) { return null; }
}

function saveChecksum(obj) {
  const json = JSON.stringify(obj);
  let h = 0x811c9dc5;
  for (let i = 0; i < json.length; i++) {
    h ^= json.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  h ^= SAVE_SALT2;
  h = (h * 0x01000193) >>> 0;
  return h.toString(36) + "|" + json.length.toString(36);
}

function progresBaru() {
  return {
    v: SAVE_VERSI,
    selesai: [],
    bosKalah: [],
    koinTertinggi: 0,
    koinSaldo: 0,
    levelKarakter: {},
    ascensionKarakter: {},
    treePoin: {},
    skillPakai: {},
    artefakMilik: {},
    artefakBintang: {},
    artefakPakai: {},
    artefakSubstat: {},
    inventaris: {},
    t: Date.now()
  };
}

// Sumber save mentah, urut dari paling dipercaya:
//   primary -> backup -> riwayat otomatis (terbaru lebih dulu).
// Slot manual TIDAK ikut dipakai di sini: itu pemulihan yang harus diminta
// pemain secara sengaja, bukan diam-diam dimuat saat game dibuka.
function saveAmbilMentah() {
  const calon = [{ kunci: SAVE_KUNCI }, { kunci: SAVE_KUNCI_BAK }];
  const oto = saveBacaOtomatis();
  for (let i = 0; i < oto.length; i++) calon.push({ teks: oto[i].teks });

  for (const c of calon) {
    try {
      const raw = c.teks !== undefined ? c.teks : localStorage.getItem(c.kunci);
      if (!raw || typeof raw !== "string") continue;
      const box = saveDekode(raw);
      if (!box || typeof box !== "object") continue;
      if (box.sig !== saveChecksum(box.d)) continue;
      const d = box.d;
      if (d && (d.v === SAVE_VERSI || d.v === 1 || d.v === 2)) return d;
    } catch (err) { continue; }
  }
  return null;
}

var _savePerluSimpanPulih = false;

function pulihkanAscensionDariRiwayat(n, mentah) {
  if (!n || typeof n !== "object") return false;
  let berubah = false;
  const mentahAsc = (mentah && mentah.ascensionKarakter && typeof mentah.ascensionKarakter === "object") ? mentah.ascensionKarakter : {};
  const mentahLv = (mentah && mentah.levelKarakter && typeof mentah.levelKarakter === "object") ? mentah.levelKarakter : {};

  const oto = saveBacaOtomatis();
  for (let i = 0; i < oto.length; i++) {
    try {
      const box = saveDekode(oto[i].teks);
      if (!box || typeof box !== "object" || !box.d || box.sig !== saveChecksum(box.d)) continue;
      const d = box.d;
      const dAsc = (d.ascensionKarakter && typeof d.ascensionKarakter === "object") ? d.ascensionKarakter : {};
      const dLv = (d.levelKarakter && typeof d.levelKarakter === "object") ? d.levelKarakter : {};
      const kandidat = {};
      for (const k in dAsc) { if (kunciAman(k)) kandidat[k] = true; }
      for (const k in dLv) { if (kunciAman(k)) kandidat[k] = true; }
      for (const k in kandidat) {
        if ((mentahAsc[k] || 0) >= 1) continue;
        if ((mentahLv[k] || 0) < 20 && !(n.ascensionKarakter[k] >= 1)) continue;
        const ascSnap = Number.isInteger(dAsc[k]) && dAsc[k] > 0 ? Math.min(dAsc[k], 5) : 0;
        const lvSnap = Number.isInteger(dLv[k]) && dLv[k] > 0 ? Math.min(dLv[k], KARAKTER_LEVEL_MAX) : 0;
        if (ascSnap >= 1 || lvSnap > 20) {
          const ascBaru = Math.max(n.ascensionKarakter[k] || 0, ascSnap || 1);
          if (ascBaru !== (n.ascensionKarakter[k] || 0)) {
            n.ascensionKarakter[k] = ascBaru;
            berubah = true;
          }
          if (lvSnap > (n.levelKarakter[k] || 0)) {
            n.levelKarakter[k] = Math.min(KARAKTER_LEVEL_MAX, lvSnap);
            berubah = true;
          }
        }
      }
    } catch (err) {}
  }

  for (const k in n.ascensionKarakter) {
    if ((n.ascensionKarakter[k] || 0) > (mentahAsc[k] || 0)) berubah = true;
  }
  for (const k in n.levelKarakter) {
    if ((n.levelKarakter[k] || 0) > (mentahLv[k] || 0)) berubah = true;
  }
  if (berubah && mentah) {
    n.t = Date.now();
  }
  return berubah;
}

function bacaProgres() {
  const mentah = saveAmbilMentah();
  const bersih = bersihkanProgres(mentah);
  if (mentah && pulihkanAscensionDariRiwayat(bersih, mentah)) {
    _savePerluSimpanPulih = true;
  }
  return bersih;
}

// Sanitasi dipakai bersama oleh pembacaan save dan import kode:
// data aneh dibuang, angka dibatasi, field yang tidak dikenal tidak diteruskan.
function bersihkanProgres(terbaik) {
  if (!terbaik || typeof terbaik !== "object") terbaik = {};

  const n = progresBaru();
  n.t = Number.isFinite(terbaik.t) && terbaik.t > 0 ? Math.floor(terbaik.t) : Date.now();
  n.selesai = Array.isArray(terbaik.selesai)
    ? terbaik.selesai.filter((x) => Number.isInteger(x) && x >= 0 && x <= 200)
    : [];

  // Daftar kunci bos yang sudah pernah dikalahkan (mis. "raja-slime").
  // Save lama tidak punya field ini -> dianggap belum ada yang dikalahkan.
  n.bosKalah = [];
  if (Array.isArray(terbaik.bosKalah)) {
    for (const b of terbaik.bosKalah) {
      const kunci = String(b);
      if (kunciAman(kunci) && kunci.length <= 40 && n.bosKalah.indexOf(kunci) === -1) {
        n.bosKalah.push(kunci);
      }
      if (n.bosKalah.length >= 50) break;
    }
  }

  const koin = Number.isFinite(terbaik.koinTertinggi)
    ? terbaik.koinTertinggi
    : terbaik.skorTertinggi;
  n.koinTertinggi = Number.isFinite(koin)
    ? Math.min(KOIN_MAKS, Math.max(0, Math.floor(koin)))
    : 0;

  n.koinSaldo = Number.isFinite(terbaik.koinSaldo)
    ? Math.min(KOIN_MAKS, Math.max(0, Math.floor(terbaik.koinSaldo)))
    : 0;

  const NODE_WAJIB_ASCENSION = {
    vampiric: true,
    ultimate_cd: true,
    executioner: true,
    aegis: true
  };

  n.treePoin = {};
  const poinTreePerKar = {};
  const buktiAscensionTree = {};
  if (terbaik.treePoin && typeof terbaik.treePoin === "object") {
    for (const k in terbaik.treePoin) {
      if (!kunciAman(k)) continue;
      const isi = terbaik.treePoin[k];
      if (!isi || typeof isi !== "object") continue;
      const bersih = {};
      let totalPoin = 0;
      for (const nid in isi) {
        if (!kunciAman(nid)) continue;
        const val = isi[nid];
        if (Number.isInteger(val) && val > 0) {
          const rank = Math.min(val, 5);
          bersih[nid] = rank;
          totalPoin += rank;
          if (NODE_WAJIB_ASCENSION[nid]) buktiAscensionTree[k] = true;
        } else if (typeof val === "boolean" && val) {
          bersih[nid] = true;
        }
      }
      n.treePoin[k] = bersih;
      poinTreePerKar[k] = totalPoin;
      if (totalPoin > 20) buktiAscensionTree[k] = true;
    }
  }

  n.ascensionKarakter = {};
  if (terbaik.ascensionKarakter && typeof terbaik.ascensionKarakter === "object") {
    for (const k in terbaik.ascensionKarakter) {
      if (!kunciAman(k)) continue;
      const asc = terbaik.ascensionKarakter[k];
      if (Number.isInteger(asc) && asc > 0) {
        n.ascensionKarakter[k] = Math.min(asc, 5);
      }
    }
  }
  if (terbaik.levelKarakter && typeof terbaik.levelKarakter === "object") {
    for (const k in terbaik.levelKarakter) {
      if (!kunciAman(k)) continue;
      const lvMentah = terbaik.levelKarakter[k];
      if (Number.isInteger(lvMentah) && lvMentah > 20 && !(n.ascensionKarakter[k] >= 1)) {
        n.ascensionKarakter[k] = 1;
      }
    }
  }
  for (const k in buktiAscensionTree) {
    if (buktiAscensionTree[k] && !(n.ascensionKarakter[k] >= 1)) {
      n.ascensionKarakter[k] = 1;
    }
  }

  n.levelKarakter = {};
  const semuaKunciKar = {};
  if (terbaik.levelKarakter && typeof terbaik.levelKarakter === "object") {
    for (const k in terbaik.levelKarakter) {
      if (kunciAman(k)) semuaKunciKar[k] = true;
    }
  }
  for (const k in poinTreePerKar) {
    if (poinTreePerKar[k] > 0) semuaKunciKar[k] = true;
  }
  for (const k in n.ascensionKarakter) {
    if (n.ascensionKarakter[k] >= 1) semuaKunciKar[k] = true;
  }
  for (const k in semuaKunciKar) {
    const lvSimpan = (terbaik.levelKarakter && Number.isInteger(terbaik.levelKarakter[k]) && terbaik.levelKarakter[k] >= 0)
      ? terbaik.levelKarakter[k]
      : 0;
    const minDariTree = poinTreePerKar[k] || 0;
    const minDariAsc = (n.ascensionKarakter[k] || 0) >= 1 ? 20 : 0;
    const batasMax = (n.ascensionKarakter[k] || 0) >= 1 ? 40 : 20;
    const lvPulih = Math.max(lvSimpan, minDariTree, minDariAsc);
    n.levelKarakter[k] = Math.min(lvPulih, batasMax);
  }
  n.skillPakai = {};
  if (terbaik.skillPakai && typeof terbaik.skillPakai === "object") {
    for (const k in terbaik.skillPakai) {
      const sl = terbaik.skillPakai[k];
      if (Number.isInteger(sl) && sl >= 2 && sl <= maksSlotSkill) n.skillPakai[k] = sl;
    }
  }
  n.artefakMilik = {};
  if (terbaik.artefakMilik && typeof terbaik.artefakMilik === "object") {
    for (const k in terbaik.artefakMilik) {
      const lv = terbaik.artefakMilik[k];
      if (kunciAman(k) && k.length <= maksIdArtefak && Number.isInteger(lv) && lv > 0) {
        n.artefakMilik[k] = Math.min(lv, maksLevelArtefak);
      }
    }
  }

  // rarity piece: 1-5 bintang. Piece dari save lama tanpa field ini
  // dianggap 3 bintang (lihat artefakBintang() di artefak.js).
  n.artefakBintang = {};
  if (terbaik.artefakBintang && typeof terbaik.artefakBintang === "object") {
    for (const k in terbaik.artefakBintang) {
      const b = terbaik.artefakBintang[k];
      if (kunciAman(k) && k.length <= maksIdArtefak && Number.isInteger(b) && b >= 1 && b <= 5) {
        n.artefakBintang[k] = b;
      }
    }
  }

  n.artefakPakai = {};
  if (terbaik.artefakPakai && typeof terbaik.artefakPakai === "object") {
    for (const kar in terbaik.artefakPakai) {
      if (!kunciAman(kar) || kar.length > maksIdArtefak) continue;
      const isi = terbaik.artefakPakai[kar];
      if (!isi || typeof isi !== "object") continue;
      const bersih = {};
      for (const slot in isi) {
        if (!kunciAman(slot)) continue;
        const id = isi[slot];
        if (typeof id === "string" && id.length <= maksIdArtefak) bersih[slot] = id;
        else bersih[slot] = null;
      }
      n.artefakPakai[kar] = bersih;
    }
  }

  // substat: { artefakId: { hp: 0.03, ... } }. Buang stat yang tidak dikenal
  // atau angkanya aneh, dan batasi maksimal ARTEFAK_SUBSTAT_MAKS per artefak.
  //
  // CATATAN: save.js dimuat SEBELUM config.js dan artefak.js, jadi fungsi ini
  // jalan lebih dulu. Karena itu daftar stat dipakai literal + fallback,
  // bukan langsung baca ARTEFAK_STAT_DAERAH (kalau begitu = ReferenceError).
  const statSubstat = typeof ARTEFAK_STAT_DAERAH !== "undefined"
    ? ARTEFAK_STAT_DAERAH
    : ["hp", "damage", "kecepatan"];
  const maksSubstat = typeof ARTEFAK_SUBSTAT_MAKS !== "undefined"
    ? ARTEFAK_SUBSTAT_MAKS
    : 3;
  n.artefakSubstat = {};
  if (terbaik.artefakSubstat && typeof terbaik.artefakSubstat === "object") {
    for (const k in terbaik.artefakSubstat) {
      if (!kunciAman(k) || k.length > maksIdArtefak) continue;
      const isi = terbaik.artefakSubstat[k];
      if (!isi || typeof isi !== "object") continue;
      const bersih = {};
      let jumlah = 0;
      for (let i = 0; i < statSubstat.length && jumlah < maksSubstat; i++) {
        const nama = statSubstat[i];
        const v = isi[nama];
        if (Number.isFinite(v) && v !== 0 && Math.abs(v) <= 1) {
          bersih[nama] = v;
          jumlah++;
        }
      }
      if (jumlah > 0) n.artefakSubstat[k] = bersih;
    }
  }

  n.inventaris = {};
  if (terbaik.inventaris && typeof terbaik.inventaris === "object") {
    for (const itemId in terbaik.inventaris) {
      if (!kunciAman(itemId) || itemId.length > 50) continue;
      const jlh = terbaik.inventaris[itemId];
      if (Number.isInteger(jlh) && jlh > 0) {
        n.inventaris[itemId] = Math.min(jlh, 999999);
      }
    }
  }

  return n;
}

function saveSnapshot() {
  if (progres) progres.t = Date.now();
  const d = {
    v: SAVE_VERSI,
    selesai: progres.selesai,
    bosKalah: progres.bosKalah,
    koinTertinggi: progres.koinTertinggi,
    koinSaldo: progres.koinSaldo,
    levelKarakter: progres.levelKarakter,
    ascensionKarakter: progres.ascensionKarakter || {},
    treePoin: progres.treePoin,
    skillPakai: progres.skillPakai,
    artefakMilik: progres.artefakMilik,
    artefakBintang: progres.artefakBintang,
    artefakPakai: progres.artefakPakai,
    artefakSubstat: progres.artefakSubstat,
    inventaris: progres.inventaris || {},
    t: (progres && progres.t) || Date.now()
  };
  return { d: d, sig: saveChecksum(d) };
}

function saveTulis() {
  if (progres) progres.t = Date.now();
  const teks = saveEnkode(saveSnapshot());
  if (!teks) return;
  try {
    localStorage.setItem(SAVE_KUNCI, teks);
    localStorage.setItem(SAVE_KUNCI_BAK, teks);
  } catch (err) {  }
  saveRotasiOtomatis(teks);
  // Kalau akun aktif, beri tahu lapisan sinkron (selalu lokal dulu).
  if (typeof akunJadwalUnggah === "function") {
    try {
      akunJadwalUnggah();
    } catch (err) {  }
  }
}

// Dipanggil lapisan akun setelah menarik save dari server. Progress lokal yang
// lama sudah masuk riwayat otomatis, jadi aman ditimpa.
function saveGantiProgres(baru) {
  if (!baru || typeof baru !== "object") return false;
  const bersih = bersihkanProgres(baru);
  if (!bersih) return false;
  progres = bersih;
  progres.t = Date.now();
  saveTulis();
  if (typeof setelahProgresBerubah === "function") {
    try {
      setelahProgresBerubah();
    } catch (err) {  }
  }
  return true;
}

// --------------------------------------------------------------- cadangan

// Kode save: string yang bisa disalin / ditempel pemain di mana saja.
function saveKode() {
  return saveEnkode(saveSnapshot());
}

function saveKodeValid(teks) {
  if (typeof teks !== "string") return null;
  let bersih = teks.trim().replace(/\s+/g, "");
  if (!bersih || bersih.length > KODE_SAVE_MAKS) return null;
  const box = saveDekode(bersih);
  if (!box || typeof box !== "object") return null;
  const d = box.d;
  if (!d || typeof d !== "object") return null;
  if (d.v !== SAVE_VERSI && d.v !== 1 && d.v !== 2) return null;
  if (box.sig !== saveChecksum(d)) return null;
  return d;
}

// Pulihkan dari kode. Cadangan otomatis dulu, supaya progres sekarang
// tidak hilang kalau ternyata kode yang diimpor lebih tua.
function savePulihkanKode(teks) {
  const d = saveKodeValid(teks);
  if (!d) return { ok: false, pesan: "Kode save tidak valid." };

  // Snapshot lama masuk riwayat otomatis dulu, supaya tidak hilang
  // kalau ternyata kode yang diimpor ternyata lebih tua.
  saveRotasiOtomatis(saveKode());

  const baru = bersihkanProgres(d);
  baru.t = Date.now();
  const box = { d: baru, sig: saveChecksum(baru) };
  const teksBaru = saveEnkode(box);
  if (!teksBaru) return { ok: false, pesan: "Gagal membuat save." };

  progres = baru;
  try {
    localStorage.setItem(SAVE_KUNCI, teksBaru);
    localStorage.setItem(SAVE_KUNCI_BAK, teksBaru);
  } catch (err) {
    return { ok: false, pesan: "Penyimpanan penuh, gagal menyimpan." };
  }
  return { ok: true, pesan: "Progres berhasil dipulihkan." };
}

function saveBacaOtomatis() {
  try {
    const raw = localStorage.getItem(SAVE_KUNCI_OTO);
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x) => x && typeof x.teks === "string" && Number.isFinite(x.t))
      .slice(0, CADANGAN_AUTOMATIS_MAKS)
      .map((x) => ({
        t: x.t,
        teks: x.teks,
        ringkas: (x.ringkas && typeof x.ringkas === "object") ? x.ringkas : null
      }));
  } catch (err) { return []; }
}

function saveTulisOtomatis(arr) {
  try {
    localStorage.setItem(SAVE_KUNCI_OTO, JSON.stringify(arr.slice(0, CADANGAN_AUTOMATIS_MAKS)));
  } catch (err) {  }
}

// Rotasi: paling banyak 5 snapshot, satu every 10 menit. Dipakai sebagai
// jaring pengaman kalau save utama rusak atau terhapus.
function saveRotasiOtomatis(teks) {
  if (!teks) return;
  const arr = saveBacaOtomatis();
  const sekarang = Date.now();
  const terbaru = arr.length ? arr[0].t : 0;
  if (terbaru && sekarang - terbaru < CADANGAN_JEDA_MS) return;
  if (terbaru && sekarang < terbaru) return; // jam device mundur
  // Ringkasan singkat biar UI tidak perlu decode tiap entry.
  const ringkas = {
    saldo: progres.koinSaldo,
    level: Array.isArray(progres.selesai) ? progres.selesai.length : 0,
    kar: Object.keys(progres.levelKarakter || {}).length
  };
  arr.unshift({ t: sekarang, teks: teks, ringkas: ringkas });
  saveTulisOtomatis(arr);
}

function slotKunci(i) {
  return SAVE_KUNCI_SLOT + i;
}

function saveSlotBaca(i) {
  if (!Number.isInteger(i) || i < 1 || i > SLOT_CADANGAN_MAKS) return null;
  try {
    const arr = JSON.parse(localStorage.getItem(slotKunci(i)));
    if (!Array.isArray(arr) || arr.length < 1) return null;
    const data = arr[0];
    if (!data || typeof data.teks !== "string" || !Number.isFinite(data.t)) return null;
    return data;
  } catch (err) { return null; }
}

function saveSlotTulis(i, teks) {
  if (!Number.isInteger(i) || i < 1 || i > SLOT_CADANGAN_MAKS) return false;
  try {
    localStorage.setItem(slotKunci(i), JSON.stringify([{ t: Date.now(), teks: teks }]));
    return true;
  } catch (err) { return false; }
}

function saveSlotHapus(i) {
  if (!Number.isInteger(i) || i < 1 || i > SLOT_CADANGAN_MAKS) return false;
  try {
    localStorage.removeItem(slotKunci(i));
    return true;
  } catch (err) { return false; }
}

function saveSlotSimpan(i) {
  const kode = saveKode();
  if (!kode) return { ok: false, pesan: "Gagal membuat kode save." };
  if (!saveSlotTulis(i, kode)) return { ok: false, pesan: "Penyimpanan penuh." };
  return { ok: true, pesan: "Cadangan disimpan di slot " + i + "." };
}

function saveSlotPulihkan(i) {
  const slot = saveSlotBaca(i);
  if (!slot) return { ok: false, pesan: "Slot " + i + " kosong." };
  return savePulihkanKode(slot.teks);
}

// Daftar untuk UI: isi manual + riwayat otomatis, terbaru dulu.
function saveCadanganDaftar() {
  const manual = [];
  for (let i = 1; i <= SLOT_CADANGAN_MAKS; i++) {
    const s = saveSlotBaca(i);
    manual.push({ slot: i, waktu: s ? s.t : 0, ada: !!s });
  }
  return { manual: manual, otomatis: saveBacaOtomatis() };
}

let progres;
try {
  progres = bacaProgres();
  if (_savePerluSimpanPulih && progres) {
    _savePerluSimpanPulih = false;
    const teksPulih = saveEnkode(saveSnapshot());
    if (teksPulih) {
      try {
        localStorage.setItem(SAVE_KUNCI, teksPulih);
        localStorage.setItem(SAVE_KUNCI_BAK, teksPulih);
      } catch (e) {}
    }
  }
} catch (err) {
  console.warn("SAVE: gagal baca progres, pakai default.", err);
  progres = progresBaru();
}

function apakahAkunAdminSave() {
  try {
    if (typeof apakahAkunAdmin === "function" && apakahAkunAdmin()) return true;
    if (typeof window !== "undefined" && window.ADMIN_BUKA) return true;
    if (typeof ADMIN_BUKA !== "undefined" && ADMIN_BUKA) return true;
    if (typeof akunInfo === "function") {
      const info = akunInfo();
      const mau = (typeof ADMIN_KONFIG !== "undefined" && ADMIN_KONFIG.username) || "admin";
      if (info && info.masuk && info.nama && String(info.nama).trim().toLowerCase() === String(mau).trim().toLowerCase()) {
        return true;
      }
    }
  } catch (e) {}
  return false;
}

function apakahLevelTerbuka(idx) {
  if (apakahAkunAdminSave()) return true;
  if (!Number.isInteger(idx) || idx < 0) return false;
  if (idx === 0) return true;
  return progres.selesai.includes(idx - 1);
}

function tandaiLevelSelesai(idx, koin) {
  if (!Number.isInteger(idx) || idx < 0) return;
  if (!progres.selesai.includes(idx)) progres.selesai.push(idx);
  // Bos di akhir level itu otomatis tercatat: bos hanya bisa dibunuh di
  // wave bos level tersebut (lihat DAFTAR_LEVEL).
  const lvlDef = (typeof DAFTAR_LEVEL !== "undefined" && DAFTAR_LEVEL[idx]) ? DAFTAR_LEVEL[idx] : null;
  if (lvlDef && typeof lvlDef.bos === "string" && lvlDef.bos && progres.bosKalah.indexOf(lvlDef.bos) === -1) {
    progres.bosKalah.push(lvlDef.bos);
  }
  if (koin > 0) progres.koinTertinggi = Math.max(progres.koinTertinggi, Math.floor(koin));
  saveTulis();
}

function catatBosKalah(bos) {
  if (!kunciAman(String(bos))) return false;
  if (progres.bosKalah.indexOf(bos) !== -1) return false;
  progres.bosKalah.push(bos);
  saveTulis();
  return true;
}

function bosSudahKalah(bos) {
  return !!bos && progres.bosKalah.indexOf(bos) !== -1;
}

// Syarat buka karakter diambil dari field "terkunci" di config.js, contoh:
//   terkunci: { level: 3, bos: "raja-slime" }
// artinya: tuntaskan level ke-3 DAN kalahkan bos "raja-slime".
function syaratKarakter(kar) {
  if (apakahAkunAdminSave()) {
    return { terbuka: true, syarat: "Akses Akun Admin" };
  }
  const s = kar && kar.terkunci;
  if (!s) return { terbuka: true, syarat: "" };

  const bagian = [];
  let terbuka = true;
  let levelSudah = false;

  if (Number.isInteger(s.level) && s.level > 0) {
    const idx = s.level - 1;
    const sudah = progres.selesai.indexOf(idx) !== -1;
    if (!sudah) terbuka = false;
    levelSudah = sudah;
    const lvlDef = (typeof DAFTAR_LEVEL !== "undefined" && DAFTAR_LEVEL[idx]) ? DAFTAR_LEVEL[idx] : null;
    const namaLvl = (lvlDef && lvlDef.nama) ? lvlDef.nama : ("Level " + s.level);
    bagian.push((sudah ? "Selesai " : "Tuntaskan ") + namaLvl);
  }

  if (typeof s.bos === "string" && s.bos) {
    // Bos dianggap sudah kalah juga kalau level yang mewadahnya sudah tuntas,
    // karena bos cuma bisa mati di wave bos level itu. Ini menjaga player
    // lama (save-nya belum punya catatan bosKalah) tetap bisa memakai karakter.
    const sudah = bosSudahKalah(s.bos) || levelSudah;
    if (!sudah) terbuka = false;
    const def = (typeof BOSS_DEF !== "undefined" && BOSS_DEF[s.bos]) ? BOSS_DEF[s.bos] : null;
    const namaBos = (def && def.nama) ? def.nama : s.bos;
    bagian.push((sudah ? "Kalah: " : "Kalahkan ") + namaBos);
  }

  return { terbuka: terbuka, syarat: bagian.join("  ·  ") };
}

function karakterTerbuka(kunci) {
  if (apakahAkunAdminSave()) return true;
  if (typeof KARAKTER === "undefined") return true;
  const kar = KARAKTER.filter(function (k) { return k && k.kunci === kunci; })[0];
  return syaratKarakter(kar).terbuka;
}

function catatKoinTertinggi(koin) {
  if (Number.isFinite(koin) && koin > progres.koinTertinggi) {
    progres.koinTertinggi = Math.min(KOIN_MAKS, Math.floor(koin));
    saveTulis();
  }
}

function tambahKoinSaldo(koin) {
  if (Number.isFinite(koin) && koin > 0) {
    progres.koinSaldo = Math.min(KOIN_MAKS, progres.koinSaldo + Math.floor(koin));
    saveTulis();
  }
}

function ascensionKarakter(kunci) {
  if (!progres || !progres.ascensionKarakter || typeof progres.ascensionKarakter !== "object") return 0;
  const a = progres.ascensionKarakter[kunci];
  return Number.isInteger(a) && a > 0 ? a : 0;
}

function maxLevelKarakter(kunci) {
  return ascensionKarakter(kunci) >= 1 ? 40 : 20;
}

function biayaNaikLevelKarakter(levelSekarang, kunci) {
  const max = kunci ? maxLevelKarakter(kunci) : 40;
  if (levelSekarang >= max) return Infinity;
  return 1000 * (levelSekarang + 1);
}

function levelKarakter(kunci) {
  if (!progres || !progres.levelKarakter) return 0;
  const lv = progres.levelKarakter[kunci];
  const max = maxLevelKarakter(kunci);
  return Number.isInteger(lv) ? Math.min(Math.max(lv, 0), max) : 0;
}

function bonusStatKarakter(kunci) {
  const lv = levelKarakter(kunci);
  const b = {
    hp: 0,
    damage: 0,
    basicDmg: 0,
    kecepatan: 0,
    crit: 0.10,
    critDmg: 0.70,
    soulMagnet: 0,
    jiwa: 1.0,
    armor: 0,
    aoe: 0,
    attackSpeed: 0,
    skill1Dmg: 0,
    skill1Cd: 0,
    skill2Dmg: 0,
    skill2Cd: 0,
    skill3Dmg: 0,
    skill3Cd: 0
  };

  if (typeof hitungBonusTree === "function") {
    const tb = hitungBonusTree(kunci);
    if (tb) {
      if (Number.isFinite(tb.hp)) b.hp += tb.hp;
      if (Number.isFinite(tb.damage)) b.damage += tb.damage;
      if (Number.isFinite(tb.basicDmg)) b.basicDmg += tb.basicDmg;
      if (Number.isFinite(tb.kecepatan)) b.kecepatan += tb.kecepatan;
      if (Number.isFinite(tb.crit)) b.crit += tb.crit;
      if (Number.isFinite(tb.critDmg)) b.critDmg += tb.critDmg;
      if (Number.isFinite(tb.soulMagnet)) b.soulMagnet += tb.soulMagnet;
      if (Number.isFinite(tb.jiwa)) b.jiwa += tb.jiwa;
      if (Number.isFinite(tb.armor)) b.armor += tb.armor;
      if (Number.isFinite(tb.aoe)) b.aoe += tb.aoe;
      if (Number.isFinite(tb.attackSpeed)) b.attackSpeed += tb.attackSpeed;
      if (Number.isFinite(tb.skill1Dmg)) b.skill1Dmg += tb.skill1Dmg;
      if (Number.isFinite(tb.skill1Cd)) b.skill1Cd += tb.skill1Cd;
      if (Number.isFinite(tb.skill2Dmg)) b.skill2Dmg += tb.skill2Dmg;
      if (Number.isFinite(tb.skill2Cd)) b.skill2Cd += tb.skill2Cd;
      if (Number.isFinite(tb.skill3Dmg)) b.skill3Dmg += tb.skill3Dmg;
      if (Number.isFinite(tb.skill3Cd)) b.skill3Cd += tb.skill3Cd;
      if (tb.bukaSkill2) b.bukaSkill2 = true;
      if (tb.bukaSkill3) b.bukaSkill3 = true;
      if (Number.isFinite(tb.elementSurge)) b.elementSurge = (b.elementSurge || 0) + tb.elementSurge;
      if (Number.isFinite(tb.elementGaugeBonus)) b.elementGaugeBonus = (b.elementGaugeBonus || 0) + tb.elementGaugeBonus;
      if (Number.isFinite(tb.vampiricChance)) b.vampiricChance = (b.vampiricChance || 0) + tb.vampiricChance;
      if (Number.isFinite(tb.vampiricHeal)) b.vampiricHeal = (b.vampiricHeal || 0) + tb.vampiricHeal;
      if (Number.isFinite(tb.ultimateCd)) b.ultimateCd = (b.ultimateCd || 0) + tb.ultimateCd;
      if (Number.isFinite(tb.ultimateDmg)) b.ultimateDmg = (b.ultimateDmg || 0) + tb.ultimateDmg;
      if (Number.isFinite(tb.executionerDmg)) b.executionerDmg = (b.executionerDmg || 0) + tb.executionerDmg;
      if (Number.isFinite(tb.aegisCd)) b.aegisCd = (b.aegisCd || 0) + tb.aegisCd;
    }
  }

  if (typeof bonusArtefak === "function") {
    const a = bonusArtefak(kunci);
    if (Number.isFinite(a.hp)) b.hp += a.hp;
    if (Number.isFinite(a.damage)) b.damage += a.damage;
    if (Number.isFinite(a.kecepatan)) b.kecepatan += a.kecepatan;
  }
  if (typeof bonusSetArtefak === "function") {
    const s = bonusSetArtefak(kunci);
    if (Number.isFinite(s.hp)) b.hp += s.hp;
    if (Number.isFinite(s.damage)) b.damage += s.damage;
    if (Number.isFinite(s.kecepatan)) b.kecepatan += s.kecepatan;
  }

  let em = 0;
  if (typeof atributElement === "function") em = atributElement(kunci);

  return {
    hp: 1 + b.hp,
    damage: 1 + b.damage,
    basicDmg: b.basicDmg,
    kecepatan: 1 + b.kecepatan,
    crit: b.crit,
    critDmg: b.critDmg,
    soulMagnet: b.soulMagnet,
    jiwa: b.jiwa,
    armor: b.armor,
    aoe: b.aoe,
    attackSpeed: b.attackSpeed,
    skill1Dmg: b.skill1Dmg,
    skill1Cd: b.skill1Cd,
    skill2Dmg: b.skill2Dmg,
    skill2Cd: b.skill2Cd,
    bukaSkill2: !!b.bukaSkill2,
    skill3Dmg: b.skill3Dmg,
    skill3Cd: b.skill3Cd,
    bukaSkill3: !!b.bukaSkill3,
    elementSurge: b.elementSurge || 0,
    elementGaugeBonus: b.elementGaugeBonus || 0,
    vampiricChance: b.vampiricChance || 0,
    vampiricHeal: b.vampiricHeal || 0,
    ultimateCd: b.ultimateCd || 0,
    ultimateDmg: b.ultimateDmg || 0,
    executionerDmg: b.executionerDmg || 0,
    aegisCd: b.aegisCd || 0,
    atributElement: em,
    lv: lv
  };
}

function naikkanLevelKarakter(kunci) {
  if (!progres) return false;
  if (!progres.levelKarakter || typeof progres.levelKarakter !== "object") {
    progres.levelKarakter = {};
  }
  const lv = levelKarakter(kunci);
  const max = maxLevelKarakter(kunci);
  if (lv >= max) return false;
  const biaya = biayaNaikLevelKarakter(lv, kunci);
  if (progres.koinSaldo < biaya) return false;
  progres.koinSaldo -= biaya;
  progres.levelKarakter[kunci] = lv + 1;
  progres.t = Date.now();
  saveTulis();
  return true;
}
