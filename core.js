const W = 1707;
const H = 960;

const WORLD_W = 2560;
const WORLD_H = 1920;
const canvas = document.getElementById("game");
let ctx = canvas.getContext("2d", { alpha: false });

let kam = { x: 0, y: 0 };

function hitungKamera() {
  const px = player ? player.x : WORLD_W / 2;
  const py = player ? player.y : WORLD_H / 2;
  const cx = WORLD_W > W ? Math.max(0, Math.min(WORLD_W - W, px - W / 2)) : Math.max(0, (W - WORLD_W) / 2);
  const cy = WORLD_H > H ? Math.max(0, Math.min(WORLD_H - H, py - H / 2)) : Math.max(0, (H - WORLD_H) / 2);
  kam.x = cx;
  kam.y = cy;
}

let karakter = null;
let statusGame = "title";

const MAKS_SKUAD = 3;
const SWITCH_CD_DETIK = 3.0;
const KUNCI_SIMPAN_SKUAD = "soul-ascendant-skuad";
let timSkuad = [];
let timAnggota = [];
let timAktifIdx = 0;
let timOffFieldSlots = [-1, -1];
let switchCd = 0;
let _autoSwitchBaruTerjadi = false;

var PLATFORM = (() => {
  if (typeof window !== "undefined") {
    if (window.AndroidNative || window.Capacitor) return "apk";
    if (window.__TAURI__ || window.__TAURI_INTERNALS__) return "pc";
  }
  return "web";
})();

var IS_APK = PLATFORM === "apk";
var IS_PC = PLATFORM === "pc";
var IS_WEB = PLATFORM === "web";

const VERSI_GAME = "0.1.0";
const BUILD_GAME = 126;
const EDISI_GAME = IS_APK ? "Android APK" : (IS_PC ? "PC Windows" : "Web Edition");

function saatPlatform(opsi) {
  if (!opsi) return;
  if (IS_APK && typeof opsi.apk === "function") return opsi.apk();
  if (IS_PC && typeof opsi.pc === "function") return opsi.pc();
  if (IS_WEB && typeof opsi.web === "function") return opsi.web();
  if (typeof opsi.default === "function") return opsi.default();
}

let deviceTerpilih = (() => {
  if (typeof window !== "undefined") {
    if (IS_APK) return "mobile";
    if (IS_PC) return "desktop";
    try {
      const s = localStorage.getItem("soul-ascendant-device");
      if (s === "mobile" || s === "desktop") return s;
    } catch (err) {}
    const isMobileUA = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = (("ontouchstart" in window) || (navigator.maxTouchPoints > 0)) && window.innerWidth <= 1024;
    return (isMobileUA || isTouch) ? "mobile" : "desktop";
  }
  return "desktop";
})();
let player, bullets, enemies, particles, rings, slashes, damages, souls;
let fires, freezes;
let kipasLedak = [];
let panahEs = [];
let boltNihil = [];
let nullLasers = [];
let blackholes = [];
let voidOrbs = [];
let prismPulsa = [];
let iceAges = [];
let hexLasers = [];
let flashes, hurtVig;
let deathPixels = [];
let animasiReaksi = [];
let koin, gameOver, lastTime, spawnTimer, shake;
let errorBanner = null;
let errorBannerUmur = 0;

let animMati = null;
let zoomKamera = 1;

function aturFilterMati(g) {
  const cvs = document.getElementById("game");
  if (!cvs || !cvs.style) return;
  if (!(g > 0.01)) {
    cvs.style.filter = "";
    return;
  }
  const gg = Math.min(1, g);
  cvs.style.filter =
    "grayscale(" + gg.toFixed(3) +
    ") blur(" + (gg * 2.5).toFixed(2) + "px)" +
    " brightness(" + (1 - gg * 0.25).toFixed(3) + ")";
}

const SOUL_MAX = 50;
const DROP_SOUL = { biasa: 3, cepet: 2, tank: 5, jamur: 4, serigala: 3, semak: 6, bos: 40 };

const ULT_CHARGE = 0.8;

const API_ULTI_LIFE = 8;

const BEKU_ZONE_LIFE = 6;

const DASH_CD = 2;
const DASH_WAKTU = 0.18;

const DASH_SPEED = 1240;
const DASH_INVULN = 0.3;

const P_RADIUS = 14;

let enemyShots = [];
let hazards = [];
let dropItems = [];

function warnaSwitchKarakter(kar) {
  if (!kar) return "#38bdf8";
  const el = String(kar.element || "").toLowerCase();
  if (el === "api") return "#fb923c";
  if (el === "nihil") return "#c084fc";
  if (el === "es") return "#38bdf8";
  return kar.warnaDash || "#4ade80";
}

function warnaSwitchRgba(hex, alpha) {
  let h = String(hex || "#38bdf8").replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return "rgba(56, 189, 248, " + alpha + ")";
  const n = parseInt(h, 16);
  return "rgba(" + ((n >> 16) & 255) + ", " + ((n >> 8) & 255) + ", " + (n & 255) + ", " + alpha + ")";
}

function apakahKarakterTerbukaSkuad(kar) {
  if (!kar) return false;
  if (typeof syaratKarakter === "function") {
    const cek = syaratKarakter(kar);
    return !!(cek && cek.terbuka);
  }
  return true;
}

function muatSkuadTersimpan() {
  if (typeof KARAKTER === "undefined" || !Array.isArray(KARAKTER)) return [];
  let mentah = null;
  try {
    const raw = localStorage.getItem(KUNCI_SIMPAN_SKUAD);
    if (raw) mentah = JSON.parse(raw);
  } catch (err) {}
  const daftarSimpan = Array.isArray(mentah)
    ? mentah
    : (mentah && Array.isArray(mentah.skuad) ? mentah.skuad : null);
  const terbukaLama = (mentah && Array.isArray(mentah.terbuka))
    ? mentah.terbuka
    : (Array.isArray(mentah) ? mentah.slice() : null);
  const hasil = [];
  const sudah = {};
  if (Array.isArray(daftarSimpan)) {
    for (let i = 0; i < daftarSimpan.length && hasil.length < MAKS_SKUAD; i++) {
      const k = String(daftarSimpan[i] || "");
      if (!k || sudah[k]) continue;
      const def = KARAKTER.find((c) => c.kunci === k);
      if (def && apakahKarakterTerbukaSkuad(def)) {
        hasil.push(k);
        sudah[k] = true;
      }
    }
  }
  if (!hasil.length) {
    for (let i = 0; i < KARAKTER.length && hasil.length < MAKS_SKUAD; i++) {
      const def = KARAKTER[i];
      if (def && apakahKarakterTerbukaSkuad(def)) {
        hasil.push(def.kunci);
        sudah[def.kunci] = true;
      }
    }
  } else if (hasil.length < MAKS_SKUAD && Array.isArray(terbukaLama)) {
    for (let i = 0; i < KARAKTER.length && hasil.length < MAKS_SKUAD; i++) {
      const def = KARAKTER[i];
      if (!def || sudah[def.kunci]) continue;
      if (apakahKarakterTerbukaSkuad(def) && terbukaLama.indexOf(def.kunci) === -1) {
        hasil.push(def.kunci);
        sudah[def.kunci] = true;
      }
    }
  }
  return hasil;
}

function simpanSkuadPilihan() {
  try {
    const terbukaKini = (typeof KARAKTER !== "undefined" && Array.isArray(KARAKTER))
      ? KARAKTER.filter((c) => c && apakahKarakterTerbukaSkuad(c)).map((c) => c.kunci)
      : [];
    localStorage.setItem(KUNCI_SIMPAN_SKUAD, JSON.stringify({
      skuad: Array.isArray(timSkuad) ? timSkuad : [],
      terbuka: terbukaKini
    }));
  } catch (err) {}
}

function susunTimAwalRun() {
  const daftar = [];
  const sudah = {};
  if (typeof KARAKTER !== "undefined" && Array.isArray(KARAKTER)) {
    if (Array.isArray(timSkuad) && timSkuad.length) {
      for (let i = 0; i < timSkuad.length && daftar.length < MAKS_SKUAD; i++) {
        const k = String(timSkuad[i] || "");
        if (!k || sudah[k]) continue;
        const def = KARAKTER.find((c) => c.kunci === k);
        if (def && apakahKarakterTerbukaSkuad(def)) {
          daftar.push(def);
          sudah[k] = true;
        }
      }
    }
    if (!daftar.length && karakter && karakter.kunci) {
      daftar.push(karakter);
      sudah[karakter.kunci] = true;
      const simpanan = muatSkuadTersimpan();
      for (let i = 0; i < simpanan.length && daftar.length < MAKS_SKUAD; i++) {
        const k = simpanan[i];
        if (sudah[k]) continue;
        const def = KARAKTER.find((c) => c.kunci === k);
        if (def && apakahKarakterTerbukaSkuad(def)) {
          daftar.push(def);
          sudah[k] = true;
        }
      }
    }
    if (!daftar.length) {
      for (let i = 0; i < KARAKTER.length && daftar.length < MAKS_SKUAD; i++) {
        const def = KARAKTER[i];
        if (def && apakahKarakterTerbukaSkuad(def)) {
          daftar.push(def);
          sudah[def.kunci] = true;
        }
      }
    }
    if (!daftar.length && KARAKTER[0]) {
      daftar.push(KARAKTER[0]);
    }
  } else if (karakter) {
    daftar.push(karakter);
  }
  return daftar;
}

function bangunAnggotaTim(kar, slotAwal) {
  const bon = kar && typeof bonusStatKarakter === "function"
    ? bonusStatKarakter(kar.kunci)
    : { hp: 1, damage: 1, kecepatan: 1 };
  const stHP = kar ? Math.round(kar.hp * bon.hp) : 100;
  const stDMG = kar ? Math.round(kar.damage * bon.damage) : 25;
  const stSPD = kar ? Math.round(kar.kecepatan * bon.kecepatan) : 180;
  const aoeBonus = bon.aoe || 0;
  const dashAwal = (kar && kar.tipe === "jarak") ? 2 : 1;
  return {
    slotAwal: slotAwal,
    kar: kar,
    kunci: kar ? kar.kunci : "",
    bon: bon,
    base: {
      speed: stSPD,
      damage: stDMG,
      attackRate: Math.max(0.08, (kar ? kar.attackRate : 0.18) * (1 - (bon.attackSpeed || 0))),
      reach: Math.round((kar ? kar.reach : 180) * (1 + aoeBonus)),
      halfArc: (kar ? kar.halfArc : 1.2) * (1 + aoeBonus * 0.4),
      swingDuration: kar ? kar.swingDuration : 0.2,
      buffDurasi: kar ? kar.buffDurasi : 5,
      bekuDurasi: kar ? kar.bekuDurasi : 1,
      burnDurasi: 3,
      specialMax: kar ? kar.specialCd : 3,
      maxHp: stHP,
      bulletSpeed: 840,
      dashMax: dashAwal,
      crit: bon.crit !== undefined ? bon.crit : 0.10,
      critDmg: bon.critDmg !== undefined ? bon.critDmg : 0.70,
      armor: bon.armor || 0,
      jiwa: bon.jiwa || 1
    },
    hp: stHP,
    maxHp: stHP,
    hpADiterapkan: 0,
    dashDiterapkan: 0,
    switchCd: 0,
    skillCds: { 2: 0, 3: 0, 4: 0 },
    specialCd: 0,
    specialBuff: 0,
    igniteBuff: 0,
    infusiElemen: null,
    infusiDurasi: 0,
    comboStep: 0,
    comboTimer: 0,
    ultBuff: false,
    ultArrows: 0,
    ultCd: 0,
    aegisT: 0,
    dashStacks: dashAwal,
    dashTimers: [],
    mati: false
  };
}

function infoPasifAktifKarakter(sumber, kar) {
  if (!sumber) return null;
  const k = kar || sumber.kar || (typeof karakter !== "undefined" ? karakter : null);
  if ((sumber.igniteBuff || 0) > 0.05 && (!k || k.kunci === "rin" || k.tipe === "dekat")) {
    const s = sumber.igniteBuff;
    return {
      nama: "IGNITE",
      sisa: s,
      maks: 15,
      warna: "#ff7a00",
      singkat: "IGNITE " + Math.ceil(s) + "s"
    };
  }
  if ((sumber.specialBuff || 0) > 0.05 && (!k || k.kunci === "kenzro")) {
    const s = sumber.specialBuff;
    const m = (sumber.buffDurasi || (sumber.base && sumber.base.buffDurasi) || (k && k.buffDurasi) || 5);
    return {
      nama: "FROSTBITE",
      sisa: s,
      maks: m,
      warna: "#38bdf8",
      singkat: "FROST " + Math.ceil(s) + "s"
    };
  }
  if (sumber.ultBuff && (sumber.ultArrows || 0) > 0) {
    return {
      nama: "ULT PANAH",
      sisa: sumber.ultArrows,
      maks: 3,
      panah: true,
      warna: "#7dd3fc",
      singkat: "ULT x" + sumber.ultArrows
    };
  }
  if (sumber.infusiElemen && (sumber.infusiDurasi || 0) > 0.05) {
    const s = sumber.infusiDurasi;
    const nm = String(sumber.infusiElemen).toUpperCase();
    return {
      nama: nm,
      sisa: s,
      maks: Math.max(5, s),
      warna: typeof warnaElemenDamage === "function" ? warnaElemenDamage(sumber.infusiElemen) : "#fde047",
      singkat: nm + " " + Math.ceil(s) + "s"
    };
  }
  return null;
}

function simpanPlayerKeAnggotaAktif() {
  const m = timAnggota[timAktifIdx];
  if (!m || !player) return;
  m.hp = Math.max(0, player.hp);
  m.maxHp = player.maxHp || m.maxHp;
  m.hpADiterapkan = (player.mult && player.mult.hpA) || 0;
  m.dashDiterapkan = (player.mult && player.mult.dash) || 0;
  m.skillCds = {
    2: (player.skillCds && player.skillCds[2]) || 0,
    3: (player.skillCds && player.skillCds[3]) || 0,
    4: (player.skillCds && player.skillCds[4]) || 0
  };
  m.specialCd = player.specialCd || 0;
  m.specialBuff = player.specialBuff || 0;
  m.igniteBuff = player.igniteBuff || 0;
  m.infusiElemen = player.infusiElemen || null;
  m.infusiDurasi = player.infusiDurasi || 0;
  m.comboStep = player.comboStep || 0;
  m.comboTimer = player.comboTimer || 0;
  m.ultBuff = !!player.ultBuff;
  m.ultArrows = player.ultArrows || 0;
  m.ultCd = player.ultCd || 0;
  m.aegisT = player.aegisT || 0;
  m.dashStacks = player.dashStacks !== undefined ? player.dashStacks : m.dashStacks;
  m.dashTimers = Array.isArray(player.dashTimers) ? player.dashTimers.slice() : [];
}

function terapkanAnggotaKePlayer(anggota) {
  if (!anggota || !player) return;
  karakter = anggota.kar;
  const bon = anggota.bon || {};
  player.base = Object.assign({}, anggota.base);
  player.crit = player.base.crit;
  player.critDmg = player.base.critDmg;
  player.armor = player.base.armor;
  player.skill1DmgBonus = bon.skill1Dmg || 0;
  player.skill2DmgBonus = bon.skill2Dmg || 0;
  player.skill3DmgBonus = bon.skill3Dmg || 0;
  player.basicDmgBonus = bon.basicDmg || 0;
  player.soulMagnet = bon.soulMagnet || 0;
  player.jiwaKali = bon.jiwa || 1;
  player.elementSurge = bon.elementSurge || 0;
  player.elementGaugeBonus = bon.elementGaugeBonus || 0;
  player.vampiricChance = bon.vampiricChance || 0;
  player.vampiricHeal = bon.vampiricHeal || 0;
  player.ultimateCdBonus = bon.ultimateCd || 0;
  player.ultimateDmgBonus = bon.ultimateDmg || 0;
  player.executionerDmg = bon.executionerDmg || 0;
  player.aegisCd = bon.aegisCd || 0;
  player.aegisT = anggota.aegisT || 0;
  player.skillCds = {
    2: (anggota.skillCds && anggota.skillCds[2]) || 0,
    3: (anggota.skillCds && anggota.skillCds[3]) || 0,
    4: (anggota.skillCds && anggota.skillCds[4]) || 0
  };
  player.specialCd = anggota.specialCd || 0;
  player.specialBuff = anggota.specialBuff || 0;
  player.igniteBuff = anggota.igniteBuff || 0;
  player.infusiElemen = anggota.infusiElemen || null;
  player.infusiDurasi = anggota.infusiDurasi || 0;
  player.ultBuff = !!anggota.ultBuff;
  player.ultArrows = anggota.ultArrows || 0;
  player.ultCd = anggota.ultCd || 0;
  player.dashTimers = Array.isArray(anggota.dashTimers) ? anggota.dashTimers.slice() : [];
  player.attackCd = Math.min(player.attackCd || 0, 0.08);
  player.attackAnimT = 0;
  player.swing = 0;
  player.comboStep = anggota.comboStep || 0;
  player.comboTimer = anggota.comboTimer || 0;
  player.dashT = 0;

  const multHpA = (player.mult && player.mult.hpA) || 0;
  const deltaHpA = Math.max(0, multHpA - (anggota.hpADiterapkan || 0));
  const multDash = (player.mult && player.mult.dash) || 0;
  const deltaDash = Math.max(0, multDash - (anggota.dashDiterapkan || 0));
  const simpanDash = (anggota.dashStacks !== undefined ? anggota.dashStacks : anggota.base.dashMax) + deltaDash;

  if (typeof hitungStatKartu === "function") hitungStatKartu();
  else {
    player.speed = player.base.speed;
    player.damage = player.base.damage;
    player.attackRate = player.base.attackRate;
    player.reach = player.base.reach;
    player.halfArc = player.base.halfArc;
    player.swingDuration = player.base.swingDuration;
    player.bulletSpeed = player.base.bulletSpeed;
    player.buffDurasi = player.base.buffDurasi;
    player.bekuDurasi = player.base.bekuDurasi;
    player.burnDurasi = player.base.burnDurasi;
    player.specialMax = player.base.specialMax;
    player.maxHp = Math.round(player.base.maxHp + multHpA);
    player.dashMax = player.base.dashMax + multDash;
  }

  player.dashStacks = Math.max(0, Math.min(player.dashMax, simpanDash));
  anggota.dashDiterapkan = multDash;
  anggota.hpADiterapkan = multHpA;
  anggota.maxHp = player.maxHp;

  if (anggota.mati) {
    player.hp = 0;
  } else {
    const hpTarget = anggota.hp + deltaHpA;
    player.hp = Math.max(1, Math.min(player.maxHp, hpTarget));
  }
  anggota.hp = player.hp;

  try { if (typeof perbaruiIkonSkillSentuh === "function") perbaruiIkonSkillSentuh(karakter); } catch (err) {}
  try { if (typeof pasangIkonSentuh === "function") pasangIkonSentuh(); } catch (err) {}
  try { if (typeof perbaruiCdSkillSentuh === "function") perbaruiCdSkillSentuh(); } catch (err) {}
}

function cariSlotHidupBerikutnya() {
  for (let b = 0; b < 2; b++) {
    const idx = timOffFieldSlots[b];
    if (idx >= 0 && timAnggota[idx] && !timAnggota[idx].mati && timAnggota[idx].hp > 0) {
      return b;
    }
  }
  for (let i = 0; i < timAnggota.length; i++) {
    if (i !== timAktifIdx && timAnggota[i] && !timAnggota[i].mati && timAnggota[i].hp > 0) {
      const pos = timOffFieldSlots.indexOf(i);
      if (pos >= 0) return pos;
      timOffFieldSlots[0] = i;
      return 0;
    }
  }
  return -1;
}

function switchKeTombol(slotBtn, opsi) {
  const opt = opsi || {};
  if (slotBtn !== 0 && slotBtn !== 1) return false;
  if (!player || !Array.isArray(timAnggota) || timAnggota.length < 2) return false;
  const targetIdx = timOffFieldSlots[slotBtn];
  if (targetIdx === undefined || targetIdx < 0 || targetIdx === timAktifIdx) return false;
  const target = timAnggota[targetIdx];
  if (!target || target.mati || target.hp <= 0) return false;

  if (!opt.paksaMati) {
    if (statusGame !== "main" || gameOver || animMati) return false;
    if ((target.switchCd || 0) > 0) return false;
  }

  const prevIdx = timAktifIdx;
  const prev = timAnggota[prevIdx];
  if (!opt.paksaMati) {
    simpanPlayerKeAnggotaAktif();
  }
  if (prev && !prev.mati) {
    prev.switchCd = SWITCH_CD_DETIK;
  }
  target.switchCd = 0;

  if (Array.isArray(nullLasers) && nullLasers.length > 0) {
    nullLasers.length = 0;
  }

  timAktifIdx = targetIdx;
  timOffFieldSlots[slotBtn] = prevIdx;

  terapkanAnggotaKePlayer(target);
  switchCd = 0;
  if (opt.paksaMati) _autoSwitchBaruTerjadi = true;
  player.invuln = Math.max(player.invuln || 0, opt.paksaMati ? 1.2 : 0.25);

  const wMasuk = warnaSwitchKarakter(karakter);
  if (Array.isArray(rings)) {
    rings.push({ x: player.x, y: player.y, r: 16, maxR: 135, life: 0.32, t: 0, warna: wMasuk });
  }
  if (typeof spawnParticles === "function") {
    spawnParticles(player.x, player.y, wMasuk, 20);
  }
  if (typeof addFlash === "function") {
    addFlash(warnaSwitchRgba(wMasuk, 0.22), 0.45, 0.22);
  }
  if (typeof sfxDash === "function") sfxDash();
  else if (typeof sfxKlik === "function") sfxKlik();

  if (typeof segarkanPanelSwitchTim === "function") {
    segarkanPanelSwitchTim(true);
  }
  return true;
}

function gantiKarakterTim(targetIdx, opsi) {
  const pos = timOffFieldSlots.indexOf(targetIdx);
  if (pos >= 0) return switchKeTombol(pos, opsi);
  return false;
}

function tickTimSkuad(dt) {
  if (!(dt > 0)) return;
  if (switchCd > 0) {
    switchCd = Math.max(0, switchCd - dt);
  }
  if (!_autoSwitchBaruTerjadi && player && timAnggota[timAktifIdx]) {
    simpanPlayerKeAnggotaAktif();
  }
  _autoSwitchBaruTerjadi = false;

  const multHpA = (player && player.mult && player.mult.hpA) || 0;
  const multDash = (player && player.mult && player.mult.dash) || 0;
  const regenAktif = (player && player.regen) || 0;
  for (let i = 0; i < timAnggota.length; i++) {
    if (i === timAktifIdx) continue;
    const m = timAnggota[i];
    if (!m || m.mati || m.hp <= 0) continue;

    if (m.switchCd > 0) {
      m.switchCd = Math.max(0, m.switchCd - dt);
    }

    m.maxHp = Math.round(m.base.maxHp + multHpA);
    if (multHpA > (m.hpADiterapkan || 0)) {
      const dHp = multHpA - (m.hpADiterapkan || 0);
      m.hp = Math.min(m.maxHp, m.hp + dHp);
      m.hpADiterapkan = multHpA;
    } else if (m.hp > m.maxHp) {
      m.hp = m.maxHp;
    }

    if (m.skillCds) {
      for (const s in m.skillCds) {
        if (m.skillCds[s] > 0) m.skillCds[s] = Math.max(0, m.skillCds[s] - dt);
      }
      if (m.skillCds[2] !== undefined) m.specialCd = m.skillCds[2];
    } else if (m.specialCd > 0) {
      m.specialCd = Math.max(0, m.specialCd - dt);
    }
    if (m.specialBuff > 0) m.specialBuff = Math.max(0, m.specialBuff - dt);
    if (m.igniteBuff > 0) m.igniteBuff = Math.max(0, m.igniteBuff - dt);
    if (m.infusiDurasi > 0) {
      m.infusiDurasi = Math.max(0, m.infusiDurasi - dt);
      if (m.infusiDurasi <= 0) m.infusiElemen = null;
    }
    if (m.comboTimer > 0) {
      m.comboTimer = Math.max(0, m.comboTimer - dt);
      if (m.comboTimer <= 0) m.comboStep = 0;
    }
    if (m.ultCd > 0) m.ultCd = Math.max(0, m.ultCd - dt);
    if (m.aegisT > 0) m.aegisT = Math.max(0, m.aegisT - dt);

    const maksDash = m.base.dashMax + multDash;
    if (multDash > (m.dashDiterapkan || 0)) {
      m.dashStacks = Math.min(maksDash, m.dashStacks + (multDash - (m.dashDiterapkan || 0)));
      m.dashDiterapkan = multDash;
    }
    if (Array.isArray(m.dashTimers)) {
      for (let d = m.dashTimers.length - 1; d >= 0; d--) {
        m.dashTimers[d] -= dt;
        if (m.dashTimers[d] <= 0) {
          m.dashTimers.splice(d, 1);
          m.dashStacks = Math.min(maksDash, m.dashStacks + 1);
        }
      }
    }
    if (regenAktif > 0 && m.hp < m.maxHp) {
      m.hp = Math.min(m.maxHp, m.hp + regenAktif * 0.5 * dt);
    }
  }
  if (typeof perbaruiHudSwitchTim === "function") {
    perbaruiHudSwitchTim();
  }
}

function resetArena({ koinBaru }) {
  if (typeof bersihkanSemuaInput === "function") bersihkanSemuaInput();

  const hanyaResetJudul = statusGame === "title" && !karakter;
  const daftarTim = hanyaResetJudul ? [] : susunTimAwalRun();
  timAnggota = daftarTim.map((k, idx) => bangunAnggotaTim(k, idx));
  timAktifIdx = 0;
  timOffFieldSlots = [
    timAnggota[1] ? 1 : -1,
    timAnggota[2] ? 2 : -1
  ];
  switchCd = 0;
  _autoSwitchBaruTerjadi = false;
  if (!hanyaResetJudul && timAnggota[0] && timAnggota[0].kar) {
    karakter = timAnggota[0].kar;
  }

  const anggotaAwal = timAnggota[0] || bangunAnggotaTim(karakter, 0);
  const stHP = anggotaAwal.maxHp;
  const stSPD = anggotaAwal.base.speed;
  player = {
    x: WORLD_W / 2,
    y: WORLD_H / 2,
    r: P_RADIUS,
    hp: stHP,
    maxHp: stHP,
    speed: stSPD,
    attackCd: 0,
    specialCd: 0,
    skillCds: { 2: 0, 3: 0, 4: 0 },
    specialMax: karakter ? karakter.specialCd : 3,
    specialBuff: 0,
    igniteBuff: 0,
    infusiElemen: null,
    infusiDurasi: 0,
    comboStep: 0,
    comboTimer: 0,
    swingDir: 1,
    swingMaxDuration: 0.28,
    currentHalfArc: 1.05,

    ultBuff: false,
    ultArrows: 0,
    ultCd: 0,

    dashMax: karakter && karakter.tipe === "jarak" ? 2 : 1,
    dashStacks: karakter && karakter.tipe === "jarak" ? 2 : 1,
    dashTimers: [],
    dashCd: 0,
    dashT: 0,
    dashAngle: 0,
    invuln: 0,
    hitFlash: 0,
    attackAnimT: 0,
    dir: -1,
    dirY: 1,
    domVertikal: false
  };

  player.kartu = {};
  if (typeof perbaruiNotaKartu === "function") perbaruiNotaKartu();
  player.mult = {
    speed: 1,
    damage: 1,
    atk: 1,
    reach: 1,
    halfA: 1,
    bSpeed: 1,
    special: 1,
    status: 1,
    hpA: 0,
    regen: 0,
    jiwa: 1,
    dash: 0,
    crit: 0,
    armor: 0,
    koin: 1
  };
  terapkanAnggotaKePlayer(anggotaAwal);
  pilihanKartu = null;
  bullets = [];
  enemies = [];
  enemyShots = [];
  hazards = [];
  particles = [];
  rings = [];
  slashes = [];
  kipasLedak = [];
  panahEs = [];
  boltNihil = [];
  nullLasers = [];
  blackholes = [];
  voidOrbs = [];
  prismPulsa = [];
  iceAges = [];
  hexLasers = [];
  fires = [];
  freezes = [];
  damages = [];
  souls = [];
  dropItems = [];
  flashes = [];
  hurtVig = 0;
  deathPixels = [];
  animasiReaksi = [];
  soul = 0;
  bossIntro = null;
  if (typeof bosKematian !== "undefined") bosKematian = null;

  level = typeof levelPilihan === "number" ? waveMulaiLevel() : 0;
  levelSpawn = 0;
  tampilkanBannerLevel(level);
  if (koinBaru) {
    koin = 0;
    if (typeof resetLootRun === "function") resetLootRun();
  }
  gameOver = false;
  spawnTimer = 0;
  shake = 0;

  animMati = null;
  zoomKamera = 1;
  if (typeof aturFilterMati === "function") aturFilterMati(0);
  lastTime = performance.now();

  if (typeof ambBuat === "function") ambBuat();
  if (typeof segarkanPanelSwitchTim === "function") segarkanPanelSwitchTim(true);
}

let bgPartikels = [];

function buatBgPartikel() {
  bgPartikels = [];

  for (let i = 0; i < 55; i++) {
    const es = Math.random() < 0.45;
    bgPartikels.push({
      jenis: "titik",
      x: Math.random() * W,
      y: Math.random() * H,
      size: 2 + Math.random() * 2,
      speed: 16 + Math.random() * 28,
      alpha: 0.15 + Math.random() * 0.45,
      warna: es ? "es" : "emas",
      fase: Math.random() * Math.PI * 2
    });
  }

  for (let i = 0; i < 7; i++) {
    bgPartikels.push({
      jenis: "orb",
      x: Math.random() * W,
      y: Math.random() * H,
      size: 5 + Math.random() * 7,
      speed: 6 + Math.random() * 10,
      alpha: 0.2 + Math.random() * 0.25,
      warna: Math.random() < 0.5 ? "es" : "emas",
      fase: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 14
    });
  }
}

function updateBgPartikel(dt) {
  const t = performance.now() / 1000;
  for (const p of bgPartikels) {
    p.y -= p.speed * dt;
    if (p.jenis === "orb") {

      p.x += Math.sin(t * 0.7 + p.fase) * p.drift * dt;
      p.alpha = (0.2 + 0.12 * Math.sin(t * 1.4 + p.fase)) *
        (p.warna === "es" ? 1 : 0.9);
    }
    if (p.y < -12) {
      p.y = H + 12;
      p.x = Math.random() * W;
    }
    if (p.x < -20) p.x = W + 10;
    if (p.x > W + 20) p.x = -10;
  }
}

function dist(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

function segDist(sx, sy, ex, ey, px, py) {
  const dx = ex - sx, dy = ey - sy;
  const l2 = dx * dx + dy * dy;
  let t = l2 === 0 ? 0 : ((px - sx) * dx + (py - sy) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  const cx = sx + t * dx, cy = sy + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function spawnParticles(x, y, color, n) {
  if (typeof vfx !== "undefined" && vfx.siap) {
    vfx.spawn("spark", x, y, { warna: color, jumlah: n, speed: 220, size: 14 });
    return;
  }
  for (let i = 0; i < n; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 80 + Math.random() * 240;
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.4 + Math.random() * 0.3,
      t: 0,
      size: 4 + Math.random() * 6,
      color: color
    });
  }
}

function elemenInfusiSenjata() {
  if (typeof player === "undefined" || !player) return null;
  if ((player.igniteBuff || 0) > 0 && typeof karakter !== "undefined" && karakter && (karakter.kunci === "rin" || karakter.tipe === "dekat")) return "api";
  if ((player.specialBuff || 0) > 0 && typeof karakter !== "undefined" && karakter && karakter.kunci === "kenzro") return "es";
  if (player.infusiElemen) return String(player.infusiElemen).toLowerCase();
  return null;
}

function warnaElemenDamage(elemen) {
  const el = String(elemen || "fisik").toLowerCase().trim();
  switch (el) {
    case "fisik":
      return "#ffffff";
    case "api":
    case "bara":
      return "#ff7a00";
    case "es":
      return "#38bdf8";
    case "nihil":
    case "void":
      return "#c084fc";
    case "angin":
      return "#2dd4bf";
    case "petir":
    case "listrik":
    case "gemuruh":
      return "#facc15";
    case "nature":
      return "#4ade80";
    case "tanah":
      return "#f59e0b";
    default:
      return "#ffffff";
  }
}

function spawnDamage(x, y, teks, warna) {
  let w = warna || "#ffffff";
  if (typeof w === "string" && !w.startsWith("#") && !w.startsWith("rgb")) {
    w = warnaElemenDamage(w);
  }
  damages.push({
    x: x,
    y: y,
    teks: String(teks),
    warna: w,
    t: 0,
    life: 0.8
  });
}

function spawnAnimasiReaksi(jenis, x, y, skala) {
  animasiReaksi.push({
    jenis: String(jenis || "vortex").toLowerCase(),
    x: x,
    y: y,
    t: 0,
    life: 0.55,
    skala: skala || 1.2
  });
}

function addFlash(warna, alpha, dur) {
  flashes.push({ warna: warna, alpha: alpha, t: 0, life: dur });
}

const _pixelCache = new Map();
function sampePixelDariSprite(img, skala) {
  try {
    if (!img || !img.complete || img.naturalWidth === 0) return [];
    const cacheKey = img.src + "|" + skala.toFixed(1);
    if (_pixelCache.has(cacheKey)) return _pixelCache.get(cacheKey);
    const nw = img.naturalWidth || img.width;
    const nh = img.naturalHeight || img.height;
    if (nw === 0 || nh === 0) return [];
    const tc = document.createElement("canvas");
    tc.width = nw;
    tc.height = nh;
    const tx = tc.getContext("2d");
    if (!tx) return [];
    tx.drawImage(img, 0, 0, nw, nh);
    const data = tx.getImageData(0, 0, nw, nh).data;
    const pixels = [];
    const step = Math.max(1, Math.floor(4 / skala));
    for (let y = 0; y < nh; y += step) {
      for (let x = 0; x < nw; x += step) {
        const i = (y * nw + x) * 4;
        if (data[i + 3] > 80) {
          pixels.push({
            ox: (x - nw / 2) * skala,
            oy: (y - nh / 2) * skala,
            r: data[i], g: data[i + 1], b: data[i + 2]
          });
        }
      }
    }
    if (_pixelCache.size > 200) _pixelCache.clear();
    _pixelCache.set(cacheKey, pixels);
    return pixels;
  } catch (_) {
    return [];
  }
}

function buatDeathPixels(x, y, img, skala) {
  try {
    if (deathPixels.length > 500) return;
    const pixels = sampePixelDariSprite(img, skala);
    const maxPx = Math.min(80, 500 - deathPixels.length);
    if (maxPx <= 0) return;
    const picked = pixels.length > maxPx
      ? pixels.filter((_, i) => i % Math.ceil(pixels.length / maxPx) === 0)
      : pixels;
    for (const px of picked) {
      const ang = Math.atan2(px.oy, px.ox) + (Math.random() - 0.5) * 1.2;
      const sp = 60 + Math.random() * 220;
      deathPixels.push({
        x: x + px.ox,
        y: y + px.oy,
        vx: Math.cos(ang) * sp + (Math.random() - 0.5) * 80,
        vy: Math.sin(ang) * sp - 40 - Math.random() * 100,
        r: px.r, g: px.g, b: px.b,
        size: Math.max(1.5, 2.5 * skala),
        t: 0,
        life: 0.5 + Math.random() * 0.6,
        grav: 120 + Math.random() * 80
      });
    }
  } catch (_) {}
}
