// KERANGKA KARAKTER
//
// Menambah karakter baru = tambah 1 objek di array KARAKTER (config.js).
// Slot skill, syarat level, tampilan menu, dan save ikut benar sendiri
// karena semuanya diturunkan dari levelKarakter().
//
// Kalau nama/level skill karakter itu mau beda dari bawaan, tulis
// opsional "skill" di config.js:
//
//   skill: [
//     { nama: "BASE ATTACK" },              // slot 1, selalu terbuka
//     { nama: "NAMA JURUS" },               // slot 2, selalu terbuka
//     { nama: "NAMA SKILL 3", level: 10 },  // slot 3
//     { nama: "NAMA SKILL 4", level: 15 },  // slot 4
//     { nama: "NAMA SKILL 5", level: 20 }   // slot 5
//   ]
//
// Slot yang tidak ditulis memakai nama & level bawaan.
// Slot 1 = serangan biasa (bukan jurus, tidak bisa dipilih).
// Slot 2-5 = jurus, hanya 1 yang bisa terpasang di Q/K.

const SKILL_SLOT_TOTAL = 5;
const SKILL_SLOT_JURUS_PERTAMA = 2;
const SKILL_LEVEL_JEDA = 5;
const SKILL_AWAL_PAKAI = 2;

function skillLevelBuka(slot) {
  if (slot <= SKILL_SLOT_JURUS_PERTAMA) return 0;
  return SKILL_LEVEL_JEDA * (slot - 1);
}

function skillNamaBawaan(kar, slot) {
  if (slot === 1) return "BASE ATTACK";
  if (slot === 2) {
    if (kar && kar.kunci === "voiz") return "UMBRA";
    return kar && kar.tipe === "dekat" ? "HEATWAVE" : "FROSTBITE";
  }
  if (slot === 3) {
    if (kar && kar.kunci === "voiz") return "PRISM";
    return kar && kar.tipe === "dekat" ? "INFERNO" : "FROZFALL";
  }
  if (slot === 4) {
    if (kar && kar.kunci === "voiz") return "HEX";
    return kar && kar.tipe === "dekat" ? "IGNITE" : "ICE AGE";
  }
  return "SKILL " + slot;
}

function karTemukan(kunci) {
  for (let i = 0; i < KARAKTER.length; i++) {
    if (KARAKTER[i].kunci === kunci) return KARAKTER[i];
  }
  return null;
}

function daftarSkill(kunci) {
  const kar = karTemukan(kunci);
  if (!kar) return [];
  const tulis = Array.isArray(kar.skill) ? kar.skill : [];
  const hasil = [];
  for (let slot = 1; slot <= SKILL_SLOT_TOTAL; slot++) {
    const def = tulis[slot - 1] || {};
    const lv = Number.isInteger(def.level) ? def.level : skillLevelBuka(slot);
    const nama = typeof def.nama === "string" && def.nama.trim() ? def.nama.trim() : skillNamaBawaan(kar, slot);
    hasil.push({
      slot: slot,
      kunci: kunci,
      nama: nama,
      level: Math.max(0, lv),
      bisaPakai: slot >= SKILL_SLOT_JURUS_PERTAMA
    });
  }
  return hasil;
}

function skillPakai(kunci) {
  const simpan = progres.skillPakai ? progres.skillPakai[kunci] : SKILL_AWAL_PAKAI;
  const sah = daftarSkill(kunci).filter(function (s) {
    return s.slot === simpan && s.bisaPakai && (typeof apakahSkillTerbuka === "function" ? apakahSkillTerbuka(kunci, s.slot) : true);
  });
  return sah.length ? sah[0].slot : SKILL_AWAL_PAKAI;
}

const TREE_NODES = [
  {
    id: "skill1",
    labelSlot: "SKILL 1",
    nama: function (kar) {
      if (!kar) return "Skill 1";
      if (kar.kunci === "voiz") return "Umbra";
      return kar.tipe === "dekat" ? "Heatwave" : "Frostbite";
    },
    ikon: "⚡",
    max: 3,
    tier: 1,
    syarat: null,
    syaratPoinTotal: 0,
    singkat: function (kar, r) {
      const nm = (kar && kar.kunci === "voiz") ? "UMBRA" : (kar && kar.tipe === "dekat" ? "HEATWAVE" : "FROSTBITE");
      return "SKILL 1 (BAWAAN): +" + (15 * Math.max(1, r)) + "% " + nm;
    },
    deskripsi: function (kar, r) {
      return "+15% Damage & -0.5s CD Skill 1 (Bawaan)";
    },
    bonus: function (r) { return { skill1Dmg: 0.15 * r, skill1Cd: 0.5 * r }; }
  },
  {
    id: "skill2",
    labelSlot: "SKILL 2",
    nama: function (kar) {
      if (!kar) return "Skill 2";
      if (kar.kunci === "voiz") return "Prism";
      return kar.tipe === "dekat" ? "Inferno" : "Frozfall";
    },
    ikon: "🔥",
    max: 2,
    tier: 1,
    syarat: null,
    syaratPoinTotal: 10,
    singkat: function (kar, r) {
      const nm = (kar && kar.kunci === "voiz") ? "PRISM" : (kar && kar.tipe === "dekat" ? "INFERNO" : "FROZFALL");
      return r === 0 ? "BUKA SKILL 2 (" + nm + ")" : "+20% " + nm;
    },
    deskripsi: function (kar, r) {
      return r === 0 ? "Buka Skill 2 (Butuh 10 Poin Tree)" : "+20% Damage & -1s CD Skill 2";
    },
    bonus: function (r) { return { bukaSkill2: r > 0, skill2Dmg: 0.20 * r, skill2Cd: 1.0 * r }; }
  },
  {
    id: "skill3",
    labelSlot: "SKILL 3",
    nama: function (kar) {
      if (!kar) return "Skill 3";
      if (kar.kunci === "voiz") return "Hex";
      return kar.tipe === "dekat" ? "Ignite" : "Ice Age";
    },
    ikon: "🌀",
    max: 2,
    tier: 1,
    syarat: null,
    syaratPoinTotal: 20,
    singkat: function (kar, r) {
      const nm = (kar && kar.kunci === "voiz") ? "HEX" : (kar && kar.tipe === "dekat" ? "IGNITE" : "ICE AGE");
      return r === 0 ? "BUKA SKILL 3 (" + nm + ")" : "+20% " + nm;
    },
    deskripsi: function (kar, r) {
      return r === 0 ? "Buka Skill 3 (Butuh 20 Poin Tree)" : "+20% Damage & -1s CD Skill 3";
    },
    bonus: function (r) { return { bukaSkill3: r > 0, skill3Dmg: 0.20 * r, skill3Cd: 1.0 * r }; }
  },
  {
    id: "hp",
    nama: "Vitalitas",
    ikon: "❤️",
    max: 3,
    tier: 2,
    syarat: "skill1",
    singkat: "+6% HP",
    deskripsi: function () { return "+6% Max HP"; },
    bonus: function (r) { return { hp: 0.06 * r }; }
  },
  {
    id: "atk",
    nama: "Kekuatan",
    ikon: "🗡️",
    max: 3,
    tier: 2,
    syarat: "skill1",
    singkat: "+6% ATK",
    deskripsi: function () { return "+6% ATK Damage"; },
    bonus: function (r) { return { damage: 0.06 * r }; }
  },
  {
    id: "spd",
    nama: "Kelincahan",
    ikon: "💨",
    max: 3,
    tier: 2,
    syarat: "skill1",
    singkat: "+4% SPD",
    deskripsi: function () { return "+4% Kecepatan"; },
    bonus: function (r) { return { kecepatan: 0.04 * r }; }
  },
  {
    id: "sm",
    nama: "Soul Magnet",
    ikon: "🧲",
    max: 2,
    tier: 3,
    syarat: "hp",
    singkat: "+25% MAGNET",
    deskripsi: function () { return "+25% Radius Magnet Jiwa"; },
    bonus: function (r) { return { soulMagnet: 0.25 * r, jiwa: 0.15 * r }; }
  },
  {
    id: "def",
    nama: "Pertahanan",
    ikon: "🛡️",
    max: 2,
    tier: 3,
    syarat: "hp",
    singkat: "+5% DEF",
    deskripsi: function () { return "+5% Armor Reduksi Damage"; },
    bonus: function (r) { return { armor: 0.05 * r }; }
  },
  {
    id: "crit",
    nama: "Presisi Kritis",
    ikon: "🎯",
    max: 2,
    tier: 3,
    syarat: "atk",
    singkat: "+3% CRIT",
    deskripsi: function () { return "+3% Crit Rate & +15% Crit DMG"; },
    bonus: function (r) { return { crit: 0.03 * r, critDmg: 0.15 * r }; }
  },
  {
    id: "aoe",
    nama: "Area Serang",
    ikon: "💥",
    max: 2,
    tier: 3,
    syarat: "atk",
    singkat: "+10% AOE",
    deskripsi: function () { return "+10% Area Jangkauan Serang"; },
    bonus: function (r) { return { aoe: 0.10 * r }; }
  },
  {
    id: "atkspd",
    nama: "Kecepatan Serang",
    ikon: "⚡",
    max: 2,
    tier: 3,
    syarat: "spd",
    singkat: "+6% ATK SPD",
    deskripsi: function () { return "+6% Kecepatan Serang"; },
    bonus: function (r) { return { attackSpeed: 0.06 * r }; }
  },
  {
    id: "mvn",
    nama: "Kecepatan Lari",
    ikon: "👟",
    max: 2,
    tier: 3,
    syarat: "spd",
    singkat: "+5% MOVE SPD",
    deskripsi: function () { return "+5% Kecepatan Gerak"; },
    bonus: function (r) { return { kecepatan: 0.05 * r }; }
  }
];

function ambilIkonTreeNodeSvg(id, kar) {
  if (id === "serang") {
    if (kar && kar.kunci === "kenzro") {
      return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gKzAtk" x1="6" y1="38" x2="38" y2="6" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#0284c7"/><stop offset="60%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#ffffff"/></linearGradient></defs><line x1="8" y1="36" x2="34" y2="10" stroke="url(#gKzAtk)" stroke-width="3.2" stroke-linecap="round"/><polygon points="36,8 24,12 32,20" fill="#ffffff" stroke="#38bdf8" stroke-width="1"/><path d="M7 37 L13 33 M7 37 L11 41" stroke="#7dd3fc" stroke-width="2.4" stroke-linecap="round"/><circle cx="36" cy="8" r="2.2" fill="#ffffff"/><circle cx="21" cy="23" r="1.6" fill="#bae6fd"/></svg>';
    }
    if (kar && kar.kunci === "voiz") {
      return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gVzAtk" x1="6" y1="38" x2="38" y2="6" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#581c87"/><stop offset="50%" stop-color="#a855f7"/><stop offset="100%" stop-color="#f5d0fe"/></linearGradient></defs><path d="M10 34 C16 16 28 8 38 6 C30 20 20 30 10 34 Z" fill="url(#gVzAtk)"/><circle cx="28" cy="16" r="4" fill="#9333ea" stroke="#e879f9" stroke-width="1.5"/><circle cx="28" cy="16" r="1.8" fill="#ffffff"/><line x1="8" y1="36" x2="20" y2="24" stroke="#c084fc" stroke-width="2.5" stroke-linecap="round"/></svg>';
    }
    return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gAtk" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#ff7b54"/><stop offset="50%" stop-color="#ffd23f"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient></defs><path d="M32 5 L39 12 L22 29 L18 31 L13 26 L15 22 Z" fill="url(#gAtk)"/><path d="M32 5 L39 12 L26 25 L23 21 Z" fill="#ffffff" opacity="0.45"/><line x1="34" y1="8" x2="18" y2="24" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/><path d="M10 23 L21 34 L17 37 L7 27 Z" fill="#ffd23f" stroke="#b45309" stroke-width="1.2"/><circle cx="14" cy="30" r="1.8" fill="#ef4444"/><line x1="13" y1="33" x2="6" y2="40" stroke="#f1f5f9" stroke-width="3" stroke-linecap="round"/><circle cx="5" cy="40" r="3" fill="#ffd23f" stroke="#ca8a04" stroke-width="1"/></svg>';
  }
  if (id === "skill1") {
    if (kar && kar.kunci === "kenzro") {
      return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gKzBow" x1="6" y1="6" x2="38" y2="38" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#38bdf8"/><stop offset="50%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0369a1"/></linearGradient><linearGradient id="gKzArrow" x1="10" y1="34" x2="34" y2="10" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#7dd3fc"/></linearGradient></defs><path d="M10 8 C30 8 38 18 36 34" fill="none" stroke="url(#gKzBow)" stroke-width="3.2" stroke-linecap="round"/><line x1="10" y1="8" x2="36" y2="34" stroke="#e0f2fe" stroke-width="1.2" stroke-dasharray="3 2" opacity="0.8"/><line x1="8" y1="36" x2="34" y2="10" stroke="url(#gKzArrow)" stroke-width="2.5" stroke-linecap="round"/><polygon points="34,10 26,10 34,18" fill="#ffffff" stroke="#38bdf8" stroke-width="1"/><path d="M8 36 L12 33 M8 36 L11 40" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round"/><circle cx="34" cy="10" r="2.2" fill="#ffffff"/><circle cx="22" cy="22" r="1.5" fill="#bae6fd"/></svg>';
    }
    if (kar && kar.kunci === "voiz") {
      return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gVzStaf" x1="0" y1="44" x2="44" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#581c87"/><stop offset="50%" stop-color="#9333ea"/><stop offset="100%" stop-color="#e879f9"/></linearGradient></defs><line x1="10" y1="36" x2="26" y2="16" stroke="#d8b4fe" stroke-width="2.8" stroke-linecap="round"/><circle cx="28" cy="14" r="6" fill="url(#gVzStaf)" stroke="#f5d0fe" stroke-width="1.5"/><circle cx="28" cy="14" r="2.5" fill="#ffffff"/><line x1="28" y1="14" x2="42" y2="4" stroke="#f472b6" stroke-width="2.8" stroke-linecap="round"/><ellipse cx="28" cy="14" rx="8" ry="3" stroke="#c084fc" stroke-width="1.4" transform="rotate(-35 28 14)"/><circle cx="42" cy="4" r="1.8" fill="#ffffff"/></svg>';
    }
    return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gVdSwd" x1="8" y1="36" x2="36" y2="8" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#ffd23f"/><stop offset="50%" stop-color="#f97316"/><stop offset="100%" stop-color="#ef4444"/></linearGradient></defs><path d="M12 32 L34 10 L37 13 L15 35 Z" fill="#ffffff"/><path d="M34 10 L37 13 L36 6 Z" fill="#facc15"/><path d="M8 28 L16 36 L13 39 L5 31 Z" fill="#b45309"/><path d="M6 38 C16 18 28 8 40 6 C32 18 22 28 6 38 Z" fill="url(#gVdSwd)" opacity="0.85"/><circle cx="36" cy="8" r="2" fill="#ffffff"/><circle cx="28" cy="14" r="1.5" fill="#fef08a"/></svg>';
  }
  if (id === "skill2") {
    if (kar && kar.kunci === "kenzro") {
      return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gKzFall" x1="22" y1="4" x2="22" y2="40" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#ffffff"/><stop offset="50%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/></linearGradient></defs><line x1="22" y1="6" x2="22" y2="32" stroke="url(#gKzFall)" stroke-width="2.5" stroke-linecap="round"/><polygon points="22,38 18,29 26,29" fill="#ffffff" stroke="#0284c7" stroke-width="1"/><path d="M22 6 L19 10 M22 6 L25 10" stroke="#7dd3fc" stroke-width="1.8" stroke-linecap="round"/><line x1="12" y1="10" x2="12" y2="28" stroke="url(#gKzFall)" stroke-width="2" stroke-linecap="round"/><polygon points="12,34 9,26 15,26" fill="#7dd3fc"/><path d="M12 10 L9 13 M12 10 L15 13" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round"/><line x1="32" y1="10" x2="32" y2="28" stroke="url(#gKzFall)" stroke-width="2" stroke-linecap="round"/><polygon points="32,34 29,26 35,26" fill="#7dd3fc"/><path d="M32 10 L29 13 M32 10 L35 13" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round"/><circle cx="22" cy="40" r="2" fill="#ffffff"/><circle cx="16" cy="38" r="1.3" fill="#bae6fd"/><circle cx="28" cy="38" r="1.3" fill="#bae6fd"/></svg>';
    }
    if (kar && kar.kunci === "voiz") {
      return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><line x1="22" y1="40" x2="22" y2="28" stroke="#d8b4fe" stroke-width="2.6" stroke-linecap="round"/><circle cx="22" cy="28" r="3" fill="#9333ea"/><polygon points="22,6 36,26 8,26" stroke="#e879f9" stroke-width="2" fill="rgba(192, 132, 252, 0.25)"/><line x1="6" y1="16" x2="16" y2="18" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/><line x1="28" y1="16" x2="40" y2="10" stroke="#f43f5e" stroke-width="2" stroke-linecap="round"/><line x1="30" y1="19" x2="42" y2="19" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/><line x1="28" y1="22" x2="40" y2="28" stroke="#a855f7" stroke-width="2" stroke-linecap="round"/><circle cx="22" cy="18" r="2" fill="#ffffff"/></svg>';
    }
    return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gVdInf" x1="22" y1="40" x2="22" y2="4" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#7f1d1d"/><stop offset="35%" stop-color="#ea580c"/><stop offset="75%" stop-color="#facc15"/><stop offset="100%" stop-color="#ffffff"/></linearGradient></defs><path d="M12 40 C8 26 15 16 22 4 C29 16 36 26 32 40 Z" fill="url(#gVdInf)" stroke="#fb923c" stroke-width="1.2"/><path d="M17 40 C15 30 18 22 22 12 C26 22 29 30 27 40 Z" fill="#ffffff" opacity="0.85"/><line x1="22" y1="8" x2="22" y2="34" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/><line x1="17" y1="14" x2="27" y2="14" stroke="#ffd23f" stroke-width="2" stroke-linecap="round"/><circle cx="22" cy="4" r="2" fill="#ffffff"/><circle cx="12" cy="18" r="1.8" fill="#f97316"/><circle cx="32" cy="18" r="1.8" fill="#f97316"/></svg>';
  }
  if (id === "skill3") {
    if (kar && kar.kunci === "kenzro") {
      return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gKzBliz" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#e0f2fe"/><stop offset="50%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0369a1"/></linearGradient></defs><circle cx="22" cy="22" r="16" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.75"/><circle cx="22" cy="22" r="9" fill="rgba(56, 189, 248, 0.18)" stroke="#7dd3fc" stroke-width="2"/><line x1="12" y1="8" x2="30" y2="8" stroke="url(#gKzBliz)" stroke-width="2" stroke-linecap="round"/><polygon points="33,8 27,5 27,11" fill="#ffffff"/><line x1="36" y1="14" x2="36" y2="32" stroke="url(#gKzBliz)" stroke-width="2" stroke-linecap="round"/><polygon points="36,35 39,29 33,29" fill="#ffffff"/><line x1="32" y1="36" x2="14" y2="36" stroke="url(#gKzBliz)" stroke-width="2" stroke-linecap="round"/><polygon points="11,36 17,39 17,33" fill="#ffffff"/><line x1="8" y1="30" x2="8" y2="12" stroke="url(#gKzBliz)" stroke-width="2" stroke-linecap="round"/><polygon points="8,9 5,15 11,15" fill="#ffffff"/><circle cx="22" cy="22" r="2.5" fill="#ffffff"/></svg>';
    }
    if (kar && kar.kunci === "voiz") {
      return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><radialGradient id="gVzEcl" cx="50%" cy="50%" r="50%"><stop offset="60%" stop-color="#020617"/><stop offset="85%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#c084fc"/></radialGradient></defs><line x1="12" y1="40" x2="18" y2="28" stroke="#d8b4fe" stroke-width="2.6" stroke-linecap="round"/><circle cx="24" cy="18" r="14" fill="url(#gVzEcl)" stroke="#e9d5ff" stroke-width="1.5"/><circle cx="22" cy="16" r="10.5" fill="#020617"/><path d="M30 11 C34 15 34 22 30 26" stroke="#f472b6" stroke-width="2" stroke-linecap="round" fill="none"/><circle cx="32" cy="10" r="1.5" fill="#ffffff"/><circle cx="16" cy="26" r="1.2" fill="#c084fc"/></svg>';
    }
    return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gVdErup" x1="22" y1="44" x2="22" y2="2" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#7f1d1d"/><stop offset="40%" stop-color="#c2410c"/><stop offset="80%" stop-color="#f97316"/><stop offset="100%" stop-color="#fef08a"/></linearGradient></defs><polygon points="6,40 16,24 28,24 38,40" fill="#451a03" stroke="#b45309" stroke-width="1.5"/><line x1="10" y1="12" x2="34" y2="36" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/><line x1="34" y1="12" x2="10" y2="36" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/><line x1="11" y1="17" x2="16" y2="12" stroke="#facc15" stroke-width="1.8"/><line x1="33" y1="17" x2="28" y2="12" stroke="#facc15" stroke-width="1.8"/><path d="M22 22 C20 12 14 6 10 3 M22 22 C22 10 22 5 22 2 M22 22 C24 12 30 6 34 3" stroke="url(#gVdErup)" stroke-width="2.5" stroke-linecap="round"/><circle cx="10" cy="3" r="2.2" fill="#facc15"/><circle cx="22" cy="2" r="2.5" fill="#fef08a"/><circle cx="34" cy="3" r="2.2" fill="#facc15"/></svg>';
  }
  if (id === "hp") {
    return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gHp" x1="22" y1="4" x2="22" y2="40" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#22c55e"/><stop offset="50%" stop-color="#16a34a"/><stop offset="100%" stop-color="#14532d"/></linearGradient><linearGradient id="gHati" x1="22" y1="14" x2="22" y2="30" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#f43f5e"/><stop offset="100%" stop-color="#be123c"/></linearGradient></defs><path d="M22 5 L37 10 C37 24 29 35 22 39 C15 35 7 24 7 10 Z" fill="url(#gHp)" stroke="#86efac" stroke-width="2"/><path d="M22 8 L33 12 C33 22 27 31 22 35 C17 31 11 22 11 12 Z" fill="#0f172a" opacity="0.35"/><path d="M22 16 C20 12 14 13 14 18 C14 23 22 29 22 29 C22 29 30 23 30 18 C30 13 24 12 22 16 Z" fill="url(#gHati)" stroke="#fecdd3" stroke-width="1.2"/><circle cx="18" cy="17" r="1.5" fill="#ffffff" opacity="0.8"/></svg>';
  }
  if (id === "atk") {
    return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gAtk" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#ff7b54"/><stop offset="50%" stop-color="#ffd23f"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient></defs><path d="M32 5 L39 12 L22 29 L18 31 L13 26 L15 22 Z" fill="url(#gAtk)"/><path d="M32 5 L39 12 L26 25 L23 21 Z" fill="#ffffff" opacity="0.45"/><line x1="34" y1="8" x2="18" y2="24" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/><path d="M10 23 L21 34 L17 37 L7 27 Z" fill="#ffd23f" stroke="#b45309" stroke-width="1.2"/><circle cx="14" cy="30" r="1.8" fill="#ef4444"/><line x1="13" y1="33" x2="6" y2="40" stroke="#f1f5f9" stroke-width="3" stroke-linecap="round"/><circle cx="5" cy="40" r="3" fill="#ffd23f" stroke="#ca8a04" stroke-width="1"/></svg>';
  }
  if (id === "spd") {
    return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gSpd" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/></linearGradient></defs><path d="M8 22 C16 14 30 13 38 8 C33 16 26 21 18 24 Z" fill="#7dd3fc" opacity="0.9"/><path d="M6 28 C14 23 27 21 35 16 C30 23 22 27 14 29 Z" fill="url(#gSpd)"/><path d="M7 34 C13 30 22 28 30 24 C26 29 19 32 12 34 Z" fill="#0369a1"/><path d="M25 18 L16 30 L23 30 L13 40 L30 27 L22 27 Z" fill="#facc15" stroke="#fef08a" stroke-width="1"/><circle cx="36" cy="9" r="1.5" fill="#ffffff"/></svg>';
  }
  if (id === "sm") {
    return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gSmMag" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#6366f1"/></linearGradient></defs><path d="M12 9 C12 5 32 5 32 9 L32 23 C32 28 27 33 22 33 C17 33 12 28 12 23 Z" fill="none" stroke="url(#gSmMag)" stroke-width="5" stroke-linecap="round"/><rect x="8.5" y="7" width="7" height="5" fill="#ef4444" rx="1.5"/><rect x="28.5" y="7" width="7" height="5" fill="#3b82f6" rx="1.5"/><circle cx="22" cy="22" r="3.5" fill="#4ade80" stroke="#86efac" stroke-width="1.2"/><path d="M22 14 L22 17 M22 27 L22 30 M15 22 L18 22 M26 22 L29 22" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round"/><circle cx="16" cy="35" r="1.5" fill="#a7f3d0"/><circle cx="28" cy="35" r="1.5" fill="#a7f3d0"/></svg>';
  }
  if (id === "def") {
    return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gDefShield" x1="22" y1="4" x2="22" y2="40" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#64748b"/><stop offset="50%" stop-color="#475569"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs><polygon points="22,4 37,9 37,24 22,39 7,24 7,9" fill="url(#gDefShield)" stroke="#94a3b8" stroke-width="2"/><polygon points="22,9 33,13 33,23 22,34 11,23 11,13" fill="#0f172a" opacity="0.6"/><path d="M22 14 L29 20 L22 26 L15 20 Z" fill="#38bdf8" stroke="#7dd3fc" stroke-width="1.2"/><circle cx="22" cy="20" r="2.5" fill="#ffffff"/><line x1="22" y1="26" x2="22" y2="32" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/></svg>';
  }
  if (id === "crit") {
    return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gCrit" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#fb7185"/><stop offset="100%" stop-color="#e11d48"/></linearGradient></defs><circle cx="22" cy="22" r="16" stroke="#fb7185" stroke-width="1.8" stroke-dasharray="4 3" opacity="0.8"/><circle cx="22" cy="22" r="9" stroke="url(#gCrit)" stroke-width="2.2" fill="rgba(225, 29, 72, 0.15)"/><line x1="22" y1="4" x2="22" y2="13" stroke="#f43f5e" stroke-width="2" stroke-linecap="round"/><line x1="22" y1="31" x2="22" y2="40" stroke="#f43f5e" stroke-width="2" stroke-linecap="round"/><line x1="4" y1="22" x2="13" y2="22" stroke="#f43f5e" stroke-width="2" stroke-linecap="round"/><line x1="31" y1="22" x2="40" y2="22" stroke="#f43f5e" stroke-width="2" stroke-linecap="round"/><circle cx="22" cy="22" r="3" fill="#ffffff" stroke="#e11d48" stroke-width="1.5"/></svg>';
  }
  if (id === "aoe") {
    return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gAoe" x1="22" y1="6" x2="22" y2="38" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#fb923c"/><stop offset="100%" stop-color="#ea580c"/></linearGradient></defs><circle cx="22" cy="22" r="16" stroke="#fdba74" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.7"/><circle cx="22" cy="22" r="11" stroke="url(#gAoe)" stroke-width="2" fill="rgba(234, 88, 12, 0.2)"/><circle cx="22" cy="22" r="5" fill="#facc15" stroke="#fef08a" stroke-width="1"/><path d="M22 6 L19 10 L25 10 Z" fill="#ea580c"/><path d="M22 38 L19 34 L25 34 Z" fill="#ea580c"/><path d="M6 22 L10 19 L10 25 Z" fill="#ea580c"/><path d="M38 22 L34 19 L34 25 Z" fill="#ea580c"/></svg>';
  }
  if (id === "atkspd") {
    return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gAtkSpd" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#fef08a"/><stop offset="50%" stop-color="#eab308"/><stop offset="100%" stop-color="#ca8a04"/></linearGradient></defs><path d="M20 4 L11 22 L19 22 L13 40 L31 18 L22 18 Z" fill="url(#gAtkSpd)" stroke="#ffffff" stroke-width="1.2"/><path d="M28 8 L35 15 L26 24" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.85"/><path d="M9 28 L14 33" stroke="#fde047" stroke-width="2" stroke-linecap="round"/></svg>';
  }
  if (id === "mvn") {
    return '<svg viewBox="0 0 44 44" class="tree-svg-ikon"><defs><linearGradient id="gMvn" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#2563eb"/></linearGradient></defs><path d="M8 20 C14 16 26 15 34 11 C30 18 24 23 16 26 Z" fill="#7dd3fc"/><path d="M12 24 L22 24 C27 24 33 26 36 29 L38 33 L10 33 L10 26 Z" fill="url(#gMvn)" stroke="#93c5fd" stroke-width="1.4"/><circle cx="16" cy="27" r="1.5" fill="#ffffff"/><line x1="6" y1="37" x2="38" y2="37" stroke="#facc15" stroke-width="2.5" stroke-linecap="round"/><line x1="12" y1="41" x2="32" y2="41" stroke="#fde047" stroke-width="1.5" stroke-linecap="round"/></svg>';
  }
  return "";
}

function ambilTreeNodes(kunci) {
  const kar = karTemukan(kunci);
  return TREE_NODES.map(function (n) {
    const nama = typeof n.nama === "function" ? n.nama(kar) : n.nama;
    let ikon = n.ikon;
    if (n.id === "skill3" && kar) {
      ikon = kar.element === "Es" ? "❄️" : (kar.element === "Nihil" ? "🌑" : "🌋");
    }
    if (n.id === "skill2" && kar) {
      ikon = kar.element === "Es" ? "🌨️" : (kar.element === "Nihil" ? "🔮" : "🔥");
    }
    if (n.id === "skill1" && kar) {
      ikon = kar.element === "Nihil" ? "🌌" : (kar.element === "Es" ? "🏹" : "⚔️");
    }
    return {
      id: n.id,
      nama: nama,
      ikon: ikon,
      svg: ambilIkonTreeNodeSvg(n.id, kar),
      max: n.max,
      tier: n.tier,
      syarat: n.syarat,
      syaratPoinTotal: n.syaratPoinTotal || 0,
      labelSlot: n.labelSlot || "",
      singkat: n.singkat,
      deskripsi: n.deskripsi,
      bonus: n.bonus
    };
  });
}

function treePoinKarakter(kunci) {
  if (!progres || !progres.treePoin || typeof progres.treePoin !== "object") return {};
  const tp = progres.treePoin[kunci];
  return tp && typeof tp === "object" ? tp : {};
}

function totalPoinKarakter(kunci) {
  return typeof levelKarakter === "function" ? levelKarakter(kunci) : 0;
}

function poinTerpakaiKarakter(kunci) {
  const tp = treePoinKarakter(kunci);
  let total = 0;
  for (const k in tp) {
    if (Number.isInteger(tp[k]) && tp[k] > 0) total += tp[k];
  }
  return total;
}

function sisaPoinKarakter(kunci) {
  return Math.max(0, totalPoinKarakter(kunci) - poinTerpakaiKarakter(kunci));
}

function nodeSyaratTerpenuhi(kunci, node) {
  if (node && node.syaratPoinTotal) {
    const terpakai = poinTerpakaiKarakter(kunci);
    if (terpakai < node.syaratPoinTotal) return false;
  }
  if (!node || !node.syarat) return true;
  if (node.syarat === "skill1") return true;
  const tp = treePoinKarakter(kunci);
  if (Array.isArray(node.syarat)) {
    return node.syarat.some(function (s) { return (tp[s] || 0) >= 1; });
  }
  return (tp[node.syarat] || 0) >= 1;
}

function apakahSkillSiapBuka(kunci, nodeId) {
  if (nodeId !== "skill2" && nodeId !== "skill3") return false;
  const tp = treePoinKarakter(kunci);
  const terpakai = poinTerpakaiKarakter(kunci);
  if (nodeId === "skill2") {
    if (tp.buka_skill2 || (tp.skill2 && tp.skill2 > 0)) return false;
    return terpakai >= 10;
  }
  if (nodeId === "skill3") {
    if (tp.buka_skill3 || (tp.skill3 && tp.skill3 > 0)) return false;
    return terpakai >= 20;
  }
  return false;
}

function apakahSkillSudahBuka(kunci, nodeId) {
  if (nodeId === "skill1") return true;
  const tp = treePoinKarakter(kunci);
  if (nodeId === "skill2") {
    return !!(tp.buka_skill2 || (tp.skill2 && tp.skill2 > 0));
  }
  if (nodeId === "skill3") {
    return !!(tp.buka_skill3 || (tp.skill3 && tp.skill3 > 0));
  }
  return true;
}

function bukaKunciSkillTree(kunci, nodeId) {
  if (!apakahSkillSiapBuka(kunci, nodeId)) return false;
  if (!progres.treePoin) progres.treePoin = {};
  if (!progres.treePoin[kunci]) progres.treePoin[kunci] = {};
  if (nodeId === "skill2") {
    progres.treePoin[kunci].buka_skill2 = true;
  } else if (nodeId === "skill3") {
    progres.treePoin[kunci].buka_skill3 = true;
  }
  saveTulis();
  return true;
}

function bisaAlokasiTree(kunci, nodeId) {
  if (sisaPoinKarakter(kunci) <= 0) return false;
  const nodes = ambilTreeNodes(kunci);
  const node = nodes.find(function (n) { return n.id === nodeId; });
  if (!node) return false;
  const cur = (treePoinKarakter(kunci)[nodeId] || 0);
  if (cur >= node.max) return false;
  if (nodeId === "skill2" || nodeId === "skill3") {
    if (!apakahSkillSudahBuka(kunci, nodeId)) return false;
  }
  return nodeSyaratTerpenuhi(kunci, node);
}

function alokasikanTreePoin(kunci, nodeId) {
  if (!bisaAlokasiTree(kunci, nodeId)) return false;
  if (!progres.treePoin) progres.treePoin = {};
  if (!progres.treePoin[kunci]) progres.treePoin[kunci] = {};
  if (nodeId === "skill2") {
    progres.treePoin[kunci].buka_skill2 = true;
  }
  if (nodeId === "skill3") {
    progres.treePoin[kunci].buka_skill3 = true;
  }
  progres.treePoin[kunci][nodeId] = (progres.treePoin[kunci][nodeId] || 0) + 1;
  saveTulis();
  return true;
}

function resetTreePoin(kunci) {
  if (!progres || !progres.treePoin) return false;
  progres.treePoin[kunci] = {};
  saveTulis();
  return true;
}

function hitungBonusTree(kunci) {
  const nodes = ambilTreeNodes(kunci);
  const tp = treePoinKarakter(kunci);
  const total = {
    hp: 0,
    damage: 0,
    basicDmg: 0,
    kecepatan: 0,
    crit: 0,
    critDmg: 0,
    soulMagnet: 0,
    jiwa: 0,
    armor: 0,
    aoe: 0,
    attackSpeed: 0,
    skill1Dmg: 0,
    skill1Cd: 0,
    skill2Dmg: 0,
    skill2Cd: 0,
    bukaSkill2: !!tp.buka_skill2,
    skill3Dmg: 0,
    skill3Cd: 0,
    bukaSkill3: !!tp.buka_skill3
  };
  nodes.forEach(function (n) {
    const r = tp[n.id] || 0;
    if (r > 0) {
      const b = n.bonus(r);
      for (const k in b) {
        if (k === "bukaSkill2" || k === "bukaSkill3") {
          if (b[k]) total[k] = true;
        } else if (Number.isFinite(b[k])) {
          total[k] = (total[k] || 0) + b[k];
        }
      }
    }
  });
  return total;
}

function apakahSkillTerbuka(kunci, slot) {
  if (slot <= 2) return true;
  const tp = treePoinKarakter(kunci);
  if (slot === 3) {
    return !!(tp.buka_skill2 || (tp.skill2 && tp.skill2 >= 1)) || (typeof levelKarakter === "function" && levelKarakter(kunci) >= 10);
  }
  if (slot === 4) {
    return !!(tp.buka_skill3 || (tp.skill3 && tp.skill3 >= 1)) || (typeof levelKarakter === "function" && levelKarakter(kunci) >= 15);
  }
  return false;
}


