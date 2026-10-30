const ITEM_RARITY = {
  1: { nama: "Common", warna: "#94a3b8", border: "rgba(148, 163, 184, 0.4)" },
  2: { nama: "Uncommon", warna: "#4ade80", border: "rgba(74, 222, 128, 0.5)" },
  3: { nama: "Rare", warna: "#38bdf8", border: "rgba(56, 189, 248, 0.6)" },
  4: { nama: "Epic", warna: "#c084fc", border: "rgba(192, 132, 252, 0.7)" },
  5: { nama: "Legendary", warna: "#fbbf24", border: "rgba(251, 191, 36, 0.85)" }
};

const DATABASE_ITEM = {
  pecahan_jiwa: {
    id: "pecahan_jiwa",
    nama: "Pecahan Jiwa",
    kategori: "material",
    rarity: 1,
    deskripsi: "Serpihan esensi jiwa monster yang bercahaya biru redup. Merupakan material dasar yang dibutuhkan untuk berbagai ritual dan penguatan jiwa karakter.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M12 2L4 9v6l8 7 8-7V9l-8-7z"/>'
        + '<path d="M12 7l-4 4 4 4 4-4-4-4z" fill="' + warna + '" fill-opacity="0.3"/>'
        + '</svg>';
    }
  },
  kristal_es_abadi: {
    id: "kristal_es_abadi",
    nama: "Kristal Es Abadi",
    kategori: "material",
    rarity: 3,
    deskripsi: "Kristal es murni yang terbentuk dari pembekuan ribuan tahun di puncak Tundra. Suhu dinginnya tidak pernah pudar dan menyimpan daya tahan elemen es.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"/>'
        + '<circle cx="12" cy="12" r="3" fill="' + warna + '" fill-opacity="0.4"/>'
        + '</svg>';
    }
  },
  bara_magma: {
    id: "bara_magma",
    nama: "Bara Magma",
    kategori: "material",
    rarity: 3,
    deskripsi: "Inti batu pijar yang diambil dari kedalaman kawah berapi. Panasnya membara terus-menerus dan memancarkan energi murni elemen api.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M12 2c-4 4-7 8-7 12a7 7 0 0 0 14 0c0-4-3-8-7-12z" fill="' + warna + '" fill-opacity="0.25"/>'
        + '<path d="M12 9c-2 2-3.5 4-3.5 6a3.5 3.5 0 0 0 7 0c0-2-1.5-4-3.5-6z" fill="' + warna + '" fill-opacity="0.6"/>'
        + '</svg>';
    }
  },
  esensi_badai: {
    id: "esensi_badai",
    nama: "Esensi Badai",
    kategori: "material",
    rarity: 3,
    deskripsi: "Pusaran angin badai yang terperangkap dalam botol kaca magis. Ringan dan menghasilkan hembusan angin kencang ketika tutupnya dibuka sedikit.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>'
        + '</svg>';
    }
  },
  batu_petir: {
    id: "batu_petir",
    nama: "Batu Petir",
    kategori: "material",
    rarity: 3,
    deskripsi: "Logam langka yang tersambar petir berulang kali di dataran tinggi. Terus mendesis dengan percikan energi listrik yang kuat.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="' + warna + '" fill-opacity="0.35"/>'
        + '</svg>';
    }
  },
  gelatin_raja_slime: {
    id: "gelatin_raja_slime",
    nama: "Gelatin Raja Slime",
    kategori: "material",
    rarity: 3,
    deskripsi: "Lendir murni yang sangat kenyal dan padat dari sang Raja Slime. Bahan alkimia tingkat lanjut yang tahan terhadap suhu ekstrem.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M12 3c-4.5 4-7.5 8-7.5 12.5a7.5 7.5 0 0 0 15 0C19.5 11 16.5 7 12 3z" fill="' + warna + '" fill-opacity="0.35"/>'
        + '<path d="M9 13a3 3 0 0 0 6 0"/>'
        + '</svg>';
    }
  },
  inti_bos_slime: {
    id: "inti_bos_slime",
    nama: "Inti Raja Slime",
    kategori: "spesial",
    rarity: 4,
    deskripsi: "Permata kenyal dan berkilau yang menjadi pusat kesadaran Raja Slime. Memiliki daya elastisitas magis yang sangat pekat.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<ellipse cx="12" cy="14" rx="9" ry="7" fill="' + warna + '" fill-opacity="0.3"/>'
        + '<circle cx="9" cy="13" r="1.5" fill="#ffffff"/>'
        + '<circle cx="15" cy="13" r="1.5" fill="#ffffff"/>'
        + '<path d="M12 2l2 4-4 2 2-6z"/>'
        + '</svg>';
    }
  },
  mahkota_raja_slime: {
    id: "mahkota_raja_slime",
    nama: "Mahkota Kristal Slime",
    kategori: "spesial",
    rarity: 5,
    deskripsi: "Mahkota kristal es lendir yang merekah indah, lambang kedaulatan Raja Slime. Menjadi bukti penaklukan penguasa rawa dan syarat ascension bergengsi.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M3 18h18l-2-10-4 4-3-7-3 7-4-4-2 10z" fill="' + warna + '" fill-opacity="0.35"/>'
        + '<circle cx="5" cy="8" r="1.5" fill="' + warna + '"/>'
        + '<circle cx="12" cy="5" r="1.5" fill="' + warna + '"/>'
        + '<circle cx="19" cy="8" r="1.5" fill="' + warna + '"/>'
        + '<line x1="3" y1="18" x2="21" y2="18"/>'
        + '</svg>';
    }
  },
  taring_serigala_bayangan: {
    id: "taring_serigala_bayangan",
    nama: "Taring Bayangan",
    kategori: "material",
    rarity: 2,
    deskripsi: "Taring runcing dari monster serigala bayangan yang berburu di kegelapan. Sangat tajam dan dingin saat disentuh.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M7 3c3 6 4 11 5 18 1-7 2-12 5-18-4 2-8 3-10 0z" fill="' + warna + '" fill-opacity="0.35"/>'
        + '</svg>';
    }
  },
  serat_kuno: {
    id: "serat_kuno",
    nama: "Serat Kuno",
    kategori: "material",
    rarity: 2,
    deskripsi: "Jalinan benang mistis yang ditemukan di reruntuhan kuil kuno. Tidak bisa terbakar atau terpotong oleh bilah senjata biasa.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M4 19c4-6 8-12 16-14M4 5c6 4 11 8 16 14M2 12c7-2 13-2 20 0"/>'
        + '</svg>';
    }
  },
  ramuan_hp_kecil: {
    id: "ramuan_hp_kecil",
    nama: "Ramuan Pemulih",
    kategori: "konsumsi",
    rarity: 1,
    efek: "Memulihkan 50 HP saat pertempuran.",
    deskripsi: "Cairan herbal merah muda yang diseduh dari tanaman obat liar. Menutup luka ringan seketika setelah diminum.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M10 2h4M11 2v4a3 3 0 0 1-2 2.83A6 6 0 1 0 15 8.83 3 3 0 0 1 13 6V2"/>'
        + '<path d="M8 15a4 4 0 0 0 8 0" stroke-width="1.2" fill="' + warna + '" fill-opacity="0.4"/>'
        + '</svg>';
    }
  },
  elixir_daya: {
    id: "elixir_daya",
    nama: "Elixir Daya Tempur",
    kategori: "konsumsi",
    rarity: 3,
    efek: "Meningkatkan ATK sebesar 10% untuk run berikutnya.",
    deskripsi: "Ramuan pekat bertenaga tinggi yang menyulut aliran adrenalin petualang sebelum memasuki area berbahaya.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M9 3h6M10 3v3l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 15l-5-9V3"/>'
        + '<path d="M8 14h8" stroke-width="1.2"/>'
        + '</svg>';
    }
  },
  medali_pahlawan: {
    id: "medali_pahlawan",
    nama: "Medali Kehormatan",
    kategori: "spesial",
    rarity: 5,
    deskripsi: "Lencana emas kuno yang dianugerahkan kepada pejuang yang berhasil menahan gelombang bos tanpa gentar. Memancarkan aura kehormatan tertinggi.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<circle cx="12" cy="14" r="7" fill="' + warna + '" fill-opacity="0.3"/>'
        + '<path d="M8 2l4 5 4-5M8 2h8"/>'
        + '<polygon points="12,11 13.5,14 17,14 14,16 15,19 12,17 9,19 10,16 7,14 10.5,14" fill="' + warna + '"/>'
        + '</svg>';
    }
  },
  gel_merah: {
    id: "gel_merah",
    nama: "Pecahan Gel Merah",
    kategori: "material",
    rarity: 1,
    deskripsi: "Tetesan lendir kenyal berwarna merah dari Slime biasa. Bahan dasar yang fleksibel untuk berbagai keperluan alkimia.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M12 3c-4 5-6 8-6 12a6 6 0 0 0 12 0c0-4-2-7-6-12z" fill="' + warna + '" fill-opacity="0.35"/>'
        + '<circle cx="9" cy="12" r="1.5" fill="#ffffff"/>'
        + '</svg>';
    }
  },
  embun_vital: {
    id: "embun_vital",
    nama: "Tetesan Embun Vital",
    kategori: "konsumsi",
    rarity: 2,
    efek: "Memulihkan 30 HP seketika.",
    deskripsi: "Embun segar berkilau yang diekstraksi dari inti slime merah. Meredakan luka ringan secara cepat.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<rect x="9" y="3" width="6" height="3" rx="1" fill="' + warna + '" fill-opacity="0.5"/>'
        + '<circle cx="12" cy="14" r="7" fill="' + warna + '" fill-opacity="0.3"/>'
        + '<circle cx="10" cy="12" r="2" fill="#ffffff"/>'
        + '</svg>';
    }
  },
  gel_pendingin: {
    id: "gel_pendingin",
    nama: "Gel Pendingin",
    kategori: "material",
    rarity: 1,
    deskripsi: "Lendir biru dingin yang dipanen dari Slime Cepat. Mampu menjaga kestabilan suhu campuran bahan ramuan.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M12 2v20M4 12h16M6 6l12 12M6 18L18 6" stroke-width="1.6"/>'
        + '<circle cx="12" cy="12" r="4" fill="' + warna + '" fill-opacity="0.4"/>'
        + '</svg>';
    }
  },
  tetesan_kelincahan: {
    id: "tetesan_kelincahan",
    nama: "Tetesan Kelincahan",
    kategori: "konsumsi",
    rarity: 2,
    efek: "Meningkatkan Kecepatan Gerak +15%.",
    deskripsi: "Cairan biru ringan beraroma angin segar yang melipatgandakan kelincahan langkah pemakainya.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<rect x="9" y="2" width="6" height="4" rx="1"/>'
        + '<path d="M7 6h10l-2 14H9L7 6z" fill="' + warna + '" fill-opacity="0.35"/>'
        + '<path d="M10 11l4 2-4 2" stroke-width="1.5"/>'
        + '</svg>';
    }
  },
  lendir_besi: {
    id: "lendir_besi",
    nama: "Lendir Besi Padat",
    kategori: "material",
    rarity: 2,
    deskripsi: "Lendir berat berwarna ungu pekat dari Slime Tank. Memiliki kerapatan massa tinggi dan sangat liat.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<rect x="5" y="6" width="14" height="12" rx="3" fill="' + warna + '" fill-opacity="0.35"/>'
        + '<line x1="5" y1="12" x2="19" y2="12"/>'
        + '<circle cx="12" cy="12" r="2" fill="' + warna + '"/>'
        + '</svg>';
    }
  },
  elixir_ketahanan: {
    id: "elixir_ketahanan",
    nama: "Elixir Ketahanan",
    kategori: "konsumsi",
    rarity: 3,
    efek: "Memberikan perisai pelindung yang menyerap 50 damage.",
    deskripsi: "Ramuan ungu kental yang mengeraskan permukaan kulit seperti lempengan besi saat diminum.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" fill="' + warna + '" fill-opacity="0.35"/>'
        + '</svg>';
    }
  },
  spora_hijau: {
    id: "spora_hijau",
    nama: "Spora Hijau Liar",
    kategori: "material",
    rarity: 1,
    deskripsi: "Serbuk spora halus berpendar hijau yang dipanen dari Jamur Hutan. Menyimpan energi kehidupan alami tumbuhan.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M4 12a8 8 0 0 1 16 0H4z" fill="' + warna + '" fill-opacity="0.35"/>'
        + '<rect x="10" y="12" width="4" height="7" rx="1"/>'
        + '<circle cx="8" cy="8" r="1.2" fill="#ffffff"/>'
        + '<circle cx="15" cy="9" r="1.2" fill="#ffffff"/>'
        + '</svg>';
    }
  },
  ramuan_spora: {
    id: "ramuan_spora",
    nama: "Ramuan Spora Herbal",
    kategori: "konsumsi",
    rarity: 2,
    efek: "Memulihkan 45 HP secara bertahap.",
    deskripsi: "Seduhan spora hutan yang memberikan regenerasi vitalitas tubuh secara perlahan namun pasti.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<rect x="9" y="3" width="6" height="3" fill="#854d0e"/>'
        + '<circle cx="12" cy="14" r="7" fill="' + warna + '" fill-opacity="0.35"/>'
        + '<path d="M12 11v6M9 14h6" stroke-width="1.5"/>'
        + '</svg>';
    }
  },
  darah_serigala: {
    id: "darah_serigala",
    nama: "Darah Serigala Pengamuk",
    kategori: "konsumsi",
    rarity: 3,
    efek: "Meningkatkan ATK sebesar 20%.",
    deskripsi: "Esensi keberanian serigala liar yang membakar semangat tempur petualang untuk menghempaskan musuh.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M12 2l3 5-3 5-3-5 3-5z" fill="' + warna + '" fill-opacity="0.4"/>'
        + '<path d="M7 11c0 5 5 11 5 11s5-6 5-11a5 5 0 0 0-10 0z" fill="' + warna + '" fill-opacity="0.3"/>'
        + '</svg>';
    }
  },
  serat_kayu_purba: {
    id: "serat_kayu_purba",
    nama: "Serat Kayu Purba",
    kategori: "material",
    rarity: 2,
    deskripsi: "Jalinan serat akar kuno dari Monster Semak. Sangat kokoh dan menjadi bahan pelindung alami.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M6 21l3-18 6 18M9 12h6" stroke-width="1.8"/>'
        + '<circle cx="15" cy="6" r="2" fill="' + warna + '" fill-opacity="0.4"/>'
        + '</svg>';
    }
  },
  nektar_kuno: {
    id: "nektar_kuno",
    nama: "Nektar Daun Kuno",
    kategori: "konsumsi",
    rarity: 3,
    efek: "Memulihkan 60 HP dan kesegaran tubuh.",
    deskripsi: "Tetesan nektar manis dari dedaunan kuno yang memulihkan kesegaran fisik secara instan.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M12 3a9 9 0 0 0-9 9c0 5 4 9 9 9s9-4 9-9a9 9 0 0 0-9-9z" fill="' + warna + '" fill-opacity="0.25"/>'
        + '<path d="M12 7c-2 3-3 5-3 7a3 3 0 0 0 6 0c0-2-1-4-3-7z" fill="' + warna + '"/>'
        + '</svg>';
    }
  },
  elixir_raja_slime: {
    id: "elixir_raja_slime",
    nama: "Elixir Raja Slime",
    kategori: "konsumsi",
    rarity: 4,
    efek: "Memulihkan 100% HP seketika.",
    deskripsi: "Ramuan keagungan sang penguasa slime yang memulihkan seluruh kesehatan petualang dalam sekejap.",
    ikon: function(warna) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="' + warna + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        + '<rect x="8" y="2" width="8" height="4" rx="2" fill="#ffd23f"/>'
        + '<circle cx="12" cy="14" r="8" fill="' + warna + '" fill-opacity="0.4"/>'
        + '<path d="M12 8l2 4-2 2-2-4 2-2z" fill="#ffd23f"/>'
        + '</svg>';
    }
  }
};

let kategoriInvAktif = "semua";
let itemInvTerpilihId = null;

function ambilSemuaItemInventaris() {
  if (typeof progres !== "object" || !progres) return {};
  if (!progres.inventaris || typeof progres.inventaris !== "object") {
    progres.inventaris = {};
  }
  if (Object.keys(progres.inventaris).length === 0) {
    inisialisasiStarterInventaris();
  }
  return progres.inventaris;
}

function inisialisasiStarterInventaris() {
  if (typeof progres !== "object" || !progres) return;
  if (!progres.inventaris || typeof progres.inventaris !== "object") {
    progres.inventaris = {};
  }
  progres.inventaris.pecahan_jiwa = 6;
  progres.inventaris.kristal_es_abadi = 2;
  progres.inventaris.bara_magma = 2;
  progres.inventaris.ramuan_hp_kecil = 3;
  if (typeof saveTulis === "function") {
    saveTulis();
  }
}

function tambahItemInventaris(id, jumlah) {
  if (!DATABASE_ITEM[id] || !Number.isInteger(jumlah) || jumlah <= 0) return 0;
  if (typeof progres !== "object" || !progres) return 0;
  if (!progres.inventaris || typeof progres.inventaris !== "object") {
    progres.inventaris = {};
  }
  const cur = progres.inventaris[id] || 0;
  progres.inventaris[id] = Math.min(999999, cur + jumlah);
  if (typeof saveTulis === "function") {
    saveTulis();
  }
  const modalInv = document.getElementById("layarInventory");
  if (modalInv && !modalInv.classList.contains("hidden")) {
    segarkanTampilanInventory();
  }
  return progres.inventaris[id];
}

function kurangiItemInventaris(id, jumlah) {
  if (!DATABASE_ITEM[id] || !Number.isInteger(jumlah) || jumlah <= 0) return false;
  if (typeof progres !== "object" || !progres || !progres.inventaris || !progres.inventaris[id]) return false;
  if (progres.inventaris[id] < jumlah) return false;
  progres.inventaris[id] -= jumlah;
  if (progres.inventaris[id] <= 0) {
    delete progres.inventaris[id];
  }
  if (typeof saveTulis === "function") {
    saveTulis();
  }
  const modalInv = document.getElementById("layarInventory");
  if (modalInv && !modalInv.classList.contains("hidden")) {
    segarkanTampilanInventory();
  }
  return true;
}

function hitungJumlahItemInventaris(id) {
  if (typeof progres !== "object" || !progres || !progres.inventaris) return 0;
  return progres.inventaris[id] || 0;
}

function bukaInventory() {
  const layar = document.getElementById("layarInventory");
  if (!layar) return;
  if (typeof sfxKlik === "function") sfxKlik();
  if (typeof sembunyiSemua === "function") {
    try { sembunyiSemua(); } catch (err) {}
  }
  layar.classList.remove("hidden");
  segarkanTampilanInventory();
}

function tutupInventory() {
  const layar = document.getElementById("layarInventory");
  if (!layar) return;
  if (typeof sfxKlik === "function") sfxKlik();
  layar.classList.add("hidden");
  if (typeof tampilkanJudul === "function") {
    try { tampilkanJudul(); } catch (err) {}
  }
}

function gantiKategoriInventory(kat) {
  kategoriInvAktif = kat;
  const btns = document.querySelectorAll(".inv-tab-btn");
  for (let i = 0; i < btns.length; i++) {
    btns[i].classList.toggle("aktif", btns[i].getAttribute("data-kategori") === kat);
  }
  if (typeof sfxKlik === "function") sfxKlik();
  renderGridInventory();
}

const DATA_URI_IKON_ITEM = {
  "bara_magma": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACrklEQVR42u3dr24UURTA4TUIEhSBqiYEs08ACaIJEodBwENgCIZnQFYiEKi+Au/AIyCqUVhoYLE7J6Fn7947s3Nnvl9y1Kab9p5PTPZPZ7ORJEmSJEmaaX9/ftztz83lxWCcEAACQABomcWFnxrA728Pd/tjQwAIAAGgdfbg7p3d/jgRAASAANBpDvDX+7PdbdP693396uVggAAAAAAAAACAww7ww7u3g6k9wLjw+GZSKYhs4XGuvnweDBAAAAAAAACsFUC28HhgtSCyi8A48flLF94aROuLVgAAAAAAAADoZeHZZAcYH88W/vzZ08HULnz1F4UAAAAAAAAAMBKADERcaO0AAQAAAAAAAADzWHic1gsHAAAAAAAAAACOW/jYAEoX+PX8vOmsHgQAAAAAAAAA/OeFl9YLjwso/cBH7YwNIJvZgQAAAAAAAACAA998mRpA/CJILD6efXFk6ovCeH4AAAAAAAAA0CuAUhDZgZcCyECUXgS2BpCdFwAAAAAAAAAsBUAGonQBY7/wk032AZLa8wEAAAAAAACAUwFovfBsAbUf6Pi+3VZN6cLHHgAAAAAAAADoFcCf6xeDaX1A2ULjTZ5KH5964QAAAAAAAADQK4Dsoi6b7eNHRZMttPbn4+PZ863+lT8AAAAAAAC8+XPkQksXVgtgbiAAAAAAAAAAoBcArRc89kXf3EEAAAAAAAAAwFwBTL3wH2/u3TpjA8hAxBe+akEAAAAAAAAAQC//J3Dqhd9cXgxmapClIOJkzwcAAAAAAAAAvd4/YOkLr53sRpab3gIAAAAAAACAAwFkC186gMXfKRQAAAAAAIDVACgFsfSFx79/8QsHAAAAAAAAgCNBfHpyv6tZ3UUdAAAAAAAAAIwEovexUQAEgACQJEmSJEmSJEmSJEk6Uf8Amoxma6jcBaEAAAAASUVORK5CYII=",
  "batu_petir": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACUklEQVR42u3dIU4DQRSA4UqQCGw9GolC9QQ9BFdBc4MeAYNHgsUDiqBqIaHF0hFMpjOzO7P7/clTpE2z7wuZbJt2sZAkSVJ2p2fLfc64ggAIAAGgPhf+eX+SNUAAAAAAAAAAwDQWvvt6PBgLBwAAAAAAAAALt3AAAABAAGi8hcYm9UZOCMDCAQAAAAAAAGCYhcVmtb5JGoc+AAAAAAAAABhn4Xebh0End+GX1+uDAQAAAAAAAAAAjlv408tb1Sm98NgAAQAAAAAAwFwBxG7M1F547qEvdeG1QYSvDwAAAAAAAAAc+uoc+nJn9odEAAAAAAAAugXw87ra/53eFr7b3hadsPDvYx8SAQAAAAAAAGAoELEbPbUBlD60hROW++bQ5P4jAAAAAAAAMBsAMRC5C2/tQ6FhtRcOAAAAAAAAAK0CSD30tTatLxwAAAAAAAAAWgEw9MKXF1cH8/6xLToAAAAAAAAAAEAZALUXFj5/7kxt4akf2AEAAAAAAACAWgBam9jCY49vDUD1hQMAAAAAAADAREDkAhgaRHh9R184AAAAAAAAAHQK4Pv5/N/Jff7ZfQoYAAAAAAAAABoFkLrg0kAAAAAAAAAAYKoAYiBaX3jpQ2T4RZOpILr/plAAAAAAAAAAqASg9o2coV8fAAAAAAAAAEwVQO6NodihqveZ3C+EAAAAAAAAMFsAuYfC1g51pRc8ux+PBgAAAAAAYLYAYiDGfvPIggEAAAAAAACgDyCpY8EAAAAAAAAAANQx4woCIAAEgCRJkiRJkiRJkiRJUif9AniIvbU3ZgUsAAAAAElFTkSuQmCC",
  "darah_serigala": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACK0lEQVR42u3cMVICMRSAYRoarkDPeBA8EHexsfYSngFrOxtPYGultu424U2ySUi+f+a1O8D7ikwQdztJkqQJetjvf/+PTwQAASAANMfCP06nxQABAAAAAAAAAHMsPDVAAAAAAAAAAMAcC4+CAAQAAAAAAAAA+lj408tr0wECAAAAAAAAAAAAAAAAABAAqgdgPW/vn5uOiyEAAAAAAAAAqLPQ3AU/Hg5Zk3p+6lAIDAAAAAAAALMCqH1oy114FETpi6ThgAAAAAAAADANgNoXM60BlAZx9182AQAAAAAAMA2A1gtfNxqA7kEAAAAAAAAAwEYAUs+vDSAFYus/WgUAAAAAAACAUQBEvyxqvfDooTD1/gAAAAAAAADgXgCUXnj0+eu+L5euJvf9dg8CAAAAAAAAAG4EUHrhz8fjYnL/EeT6edHJPRTmggAAAAAAAACAXgBEX1DuxU904V/n82J6AxAFAQAAAAAAAAC9fDdQ+5CZWvjP9bqY0gBKL7z25w0AAAAAAAAAvRQFEL0YygWw9aFv+gAAAAAAANCNIKIXQ7kALBwAAAAAAAAA+jwUlgYQ/TGojQEgAASA2oBIXQxFATj0AQAAAAAAAMAYh8IUAIc+AAAAAAAAABgDRPTHoA59AAAAAAAAADDmxVAUgIUDAAAAAAAAwJggLBwAAAAAAAAA5gDgogcAAAAAAAAAgLBwAAAAAAAAAJgXhE8EAAEgACRJkiRJkiRJkgbsD6xrSm90Yz3GAAAAAElFTkSuQmCC",
  "elixir_daya": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAB70lEQVR42u3dMTJDQRzH8TTGZMbQ4ApO4AQKB9A4QG5AkTPQuoErKNyBVk+r0soMSZ1XvA2772Wz/8935teJwn6KnecNk4kkSVKDnR3uLfvmJwSAABAAavPAv29OewcEAAAAAAAAAMQ48N+vu7UBAQAAAAAAAABtAugeeAoAEAAAAAAAAADQ5qUPCAAAAAAAAABoA8DD4/NWBwQAAAAAAAAAAAAAAAAAIAC0PRCz2/tB58ABAAAAAAAAAAAAAAAAAAEgAASAABAAAkAACAABoPEBvLx9FJ0DBwAAAAAAAIDdOPCL4/2iAwIAAAAAAAAA6jzwbqUBAAEAAAAAAAAAAAAAAAAAAAAAAHEOHAgAAAAAAAAAqBPAz/tlVQMAAAAAAAAAAIY58NQ/dPjrPq8Pis6lEAAAAAAAAAD+d+CtAQACAAAAAAAAADYDMD8/WlvqwU/361PL/Xzu9wMAAAAAAACAKAByL31PV9OmFu5SCAAAAAAAAAAjPfhZvJ70LlXq8x4MAQAAAAAAAECdv+ypDUA4EAAAAAAAAIQBkPvHmscGkLuhAewcCAAAAAAAAADYEEDplzpLAyn9kmjzl0IAAAAAAAA8Fyh0KYy+cE8CDQADwMK8H2D9a/6NIAPAALAwACRJkiRJkiRJkiRJ0uitAJfm2a9qoY5HAAAAAElFTkSuQmCC",
  "elixir_ketahanan": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAB/UlEQVR42u3csU3DUBCA4XSUlOxAS8kATJAN0tCzBSVsQMMI7ECdAaACKjoQQgq1TyLBxs/2e/f90nWRUHxfcQpKVitJkiRJkqRKOj453c05NgCAABAAmmfhm6vrzjxun4pO/HtAAAAAAAAAAMAyAEw9AAAAAAAAAADAPB/0LA0AEAAAAAAAAAAwzsIv1pdVDxAAAAAAAAAA8LejrnUA6UEAAAAAAACQBkBrC3UkAgAAAAAAAMA4C7+9e0g1zYMAAAAAAAAAgF8AxAfy+fXdmdYBxPcLAAAAAAAAALUCKH30nR9tqpp0RyEAAAAAAAAAzAQgBgAAAAAAAAAAtAHgdbvbO7FDr596AAAAAAAAAACAYQDu1x97J3bo9XFuzt5GHUcgAAAAAAAAAAAAAAAAAAAAAAAMB9EagOa+PAoAAAAAAEBaAKWPwmwAfDsYAAAAAAAAAMoAGHvhAAAAAAAAAADAMADPL++diQ8sPuC+R97SAMT3CwAAAAAAAABZAfQ9Cv8Lwj9/AAAAAAAAACAnCAsHAAAAAAAAgJwgLBwAAAAAAAAAcoKwcAAAAAAAAADICWLsH3CwcAAAAAAAAACYBkTpH6Xqu2ALBwAAAAAAAIA6j0ZHHQAAAAAAAAAAYeEAAAAAAAAAkOeDJAsHAAAAAAAAAEmSJEmSJEmS1GA/OPOiEAw1C50AAAAASUVORK5CYII=",
  "elixir_raja_slime": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACi0lEQVR42u3dP0rFMBwH8A4iji4igsfwCKLH8AbewfXdwBN4AAfxCuIgeAE3wUXBTfDPajO8kCZtk/bzhd/0nrFNPkNI2ryuExEREakwx0eHv/+rdHtjt28EARAABAAZ1oFfjwe9Su3gWHthSrcPBAAAAAAAAACUARDr4NS/H7t9AAAAAAAAAABgHAC1FwAAAAAAAAAAAAAAAAAAgAAgAAgAAoAAINsBPGx2FlVAAAAAAAAAAMAwEGHtXpz16vL1rlfh56Urdn0GHAAAAAAAgKUAmPuGawfQev8CAAAAAAAAwNCFmbfbvV7l3kD4/bD92ip2f7H+CNubfWEJAAAAAAAAAAYCSO2w1A6qHUDu9QMAAAAAAADAUgGUBvL9cj5qTQ0UAAAAAAAAAFoBULqDUgd47M2f2P8vDRwAAAAAAAAAWgWQ+8BD2MFhwgHav78atVJBpG6GAQAAAAAAAECrAHJBhB148/nUqzDh57VVKojqXjYFAAAAAABgtQCmnhTGJn0nz9ezVu4ksfqFHwAAAAAAAACYaHMotpDSGoCwUheKAAAAAAAAAKAVAKUf8Iht7qQOWO5hz7kAYpPC0i+fAgAAAAAAAECtAKaucEDfT0+3Vvj91g6gAAAAAAAAAIC5QKQCGfsHGnIBjH19pQ/VAgAAAAAAAIBWgMQ2S1pfCErdDOqWFgAAAAAAAFYLIBVI6uZQLpDcAc59KLRbewAAAAAAAABg4KSwtjLpAwAAAAAAAIB1gDDgAAAAAAAAAFAHiNhhz6kLObkHQxpBAAQAAUDKAAgfovz52Mxa1b+4AQAAAAAAAAALBeDlTQAAAAAAAABYJ4jayggBIAAIACIiIiIiIiIiIiIiIhXkD0/TzGoqSFveAAAAAElFTkSuQmCC",
  "embun_vital": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAABx0lEQVR42u3asW0CQRBAURJ6wLk7oAAacA304CLcAR3QBD0gIuQCsCxESECGBMRsADrt3d7c3vvSNHDzgtHCZCJJkiRJklRJX9OPe874ggAIAAGgYS7873TOGiAAAAAAAAAAAAAAAAAAAAGguAtfrTedDhAAAAAAAAAAAAAAAAAAgABQXBDb30Oj8QcRAAAAAAAAAKhz4fPZ59M0BeGLAyAABICGASBd+LsBAAAAAAAAAADqPPqaAgACAAAAAAAAAOpcOBAAAAAAAAAAMI6HnrZBAAAAAAAAAAAA/Rx9aaUBAAEAAAAAAAAA/Rx9pQE4CgEAAAAAAABgHEefoxAAAAAAAAAAYh59t90+1AAAAAAAAAAAAGUAXL9/suayWGaNhyEAAAAAAAAAKPPwk7vwtgGk42EIAAAAAAAAAGICuP8fXw4AAAAAAAAAABADQNcLbxsEAAAAAAAAAAAQFEAaAAAAAAAAAABQJYiuj0ALBwAAAAAAAIAyINIF9P1jkIUDAAAAAAAAQD9HYVMQ/vABAAAAAAAAAOMAYeEAAAAAAAAAME4QbY+FAwAAAAAAAEBMEF2PLw6AABAAkiRJkiRJkiRJkiRJQXsAs/cZ0hsE/a8AAAAASUVORK5CYII=",
  "esensi_badai": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACKElEQVR42u3dIU4DURCA4VoECrgCDsUJsAgcFsUROAQJtgbdhDPUcQCQ5QAQRIMCQwiQgN4KZpftvL5tvz8Zxyak84nNpn07GkmSJEmSJA20rb39n8zxCQMgAASA6lz49vgydYAAAAAAAAAAgGEAOHuZ9RoAAAAAAAAAAGAYD3pK3wQCAQAAAAAAAABlFj6eTKseIAAAAAAAAACgDICn+etKBwAAAAAAAAAAcBMIAAAAAAAAAACUA1Hb2BAAAkAAqMzCD49OVzpAAAAAAAAAAEDOwrsuZOfkOHX6ArFhAASAAFC7hR/Mbgc9QAAAAAAAAABAu4V/fH43ZvEm7Pr9uTFRi3+fPV1vGjcOBAAAAAAAAAD8E0DXicp+cBSBAAAAAAAAAIB1BRAt/O7hsTG705uiExVdDwQAAAAAAAAALAdA9IH1Pfy560RF1y/+/+cXV40BAAAAAAAAAADaAcie7AdHAAAAAAAAAADAcgB0/ZJmVN8vgQIAAAAAAAAAADkA7r/e/pyo6Ppo3AQCAAAAAAAAwHo+CMoeAAAAAAAAAAAg51Cn7C+RAgAAAAAAAAAAdQKIDpToe+CDH4sCAAAAAAAAwDBBrHqcEAIAAAAAAAAA7V4IsewFdP0xZ/YLJgAAAAAAAADA+wPKgMg+KNLCAQAAAAAAAKAMCC+OBAAAAAAAAIDNADGeTKseCwcAAAAAAACAMiBqGxsCQAAIAEmSJEmSJEmSpAr6BT66VWzUh4yKAAAAAElFTkSuQmCC",
  "gel_merah": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAABxUlEQVR42u3dsW3CUBCAYWpmoGYSMhBDMURWYIbskDYFAmpegfVyz+bO/n7pKqJI+L7Ceg5kt5MkSZIkSZIkSZIkSZIkSZIkSZIkSZvua79/RMYVBEAACADVXPjP8RiaKAjAAAAAAAAAACAHgLbRANqf/z4c3g4gAAAAAAAAAFDzJnBq4b+n09vpBWLDAAgAAaDPAIguHAgAAAAAAAAA+AyI6LQLmQoIAAAAAAAAAKgJpnfhowEAAQAAAAAAAADbXDgAAAAAAAAAALDMwqMHPX/nc9cAAQAAAAAAAAA5APQuoHfho0EAAAAAAAAAAADLABi98CiIKQBAAAAAAAAAsFUAvQc/7QW+X68vkw2Am0IAAAAAAAAAqHnwAwAAAAAAAAAA1ACQ7WHQ3ADK/4MNAAAAAAAANgMgevCzNIi5Fx79supyD5sAAAAAAAAA4J9vYO4Pdy79YdHehbWv3y6Xl0kPAgAAAAAAAABWCiC68F4Ao38/AAAAAAAAADgXyLHw0der/MMhAAAAAAAAVgNg9BusNtGFlP+LIAAAAAAAAABYKYjVLQQAAAAAAAAAkoDIPjYGgAAQAJIkSZIkSZIkSZIkSUl7ArfuhaT4E6VFAAAAAElFTkSuQmCC",
  "gel_pendingin": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAABo0lEQVR42u3dsW0CMRSA4VNoqLJKWlZgFIagyyIpsgQSdQbIAlRItFQpklxacsUZ4xw5+32/9Gokv69wc6brJEmSJEmSJEmSJEmSJEmSJEmSJEmSZtz2/bO/HCcCgAAQAIqx8GFAAAAAAAAAAIBLoAAQAAJA92t3/Oovx4kAIAAEgOQSKgAEgACI2/Jp3Y+NEwJAAAgAtbnww/l7dFJAAAIAAAAAAACAOhZ+70oBAQUAAAAAAAAA01zyahsgAAAAAAAAACDGwoEAAAAAAAAAgOsAPDy//ZrSA17tP4rmv0E0DwQAAAAAAIAwAFILL13Y1PP4epp0FpuX0akeBAAAAAAAAGEApBaeC2BY7QtvHgQAAAAAAAAA/BGA1i59AAAAAAAAAAAAALcAmD0IAAAAAAAAALgSwNxAAAAAAAAAAAAAMUCkft/CAQAAAAAAAGAeIFobAAAAAAAAAIgCAIg8AOG/FgYAAAAAACDMm0KpBxNKD7z08efcS1vugj0iBQAAAAAAgLeFbwMy9YH6QwkAAAAAAAAAkCRJkiRJkiRJkiRJlfQDt+PEdPHu6LYAAAAASUVORK5CYII=",
  "gelatin_raja_slime": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAABuklEQVR42u3dv00DMRiH4WsYgQzAAGzAAhmCWVKxCC0bUNNnAERLSUmDBPW5wHH853z280pfm1Pye4ooTZZFkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiTpym7uD789n4UAEAACQHUGjnX8OFW9u7fHfw8QAAAAAAAAALhu8NvTw+pSqw0gFUT4foAAAAAAAABgVgB7HxwIAAAAAAAAADA4EAAAAAAAAABw+eDhBzDa4OG9fp9XNzwIAAAAAAAAALgQwN4Hzv0SCAAAAAAAAACzAnj/+Vxd74M+fb2sLndwAAAAAAAAAJgVQOy2HjwsBBAeAAAAAAAAAABQBkBrELGBUw8AAAAAAAAAACgDoPXVHhwAAAAAAAAAZgFQGkTtQWLPKz04AAAAAAAAAIwK4PB8zLqtAeQOmnoAAAAAAAAAsFcAuYOngig9QOxLa+3nAQAAAAAAAECvAFoPHl7tAXq77kAAAAAAAAAAAAAAAAAAAAAA4HeBhiAMDgAAAAAAAABzgIj9OXPrQUo/f/h/DAEAAAAAAGAaADEQqVf79bd+/jJ6AAAAAAAATAtAkiRJkiRJkiQ17Q8xokJOtAqsSQAAAABJRU5ErkJggg==",
  "inti_bos_slime": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACTElEQVR42u3dsU3DUBCA4XRsQAMVK4AYggmo6NiDAokBGIeGhj4DIFokekQTAW1iQV6O987Eft8vXRcpUe5DsuxgLxaSJEmSJEkz7ejg/Gt9fCMACAABoD4WfvFyszFAAAAAAAAAAEAfC39evW4MEAAAAAAAAAAwzQWXFl47pfcDBgAAAAAAAADGWfDh9VloTp6uqib6foAAAAAAAAAAwN8Wnr3Q7IkCAQAAAAAAAAALz1n45fFd1QABAAAAAAAAAPu58NIC70/fQpMNpDsQAAAAAAAAAPALgLEXXDutgQAAAAAAAADAXADULnw4wwWUerxdbcz78nPrDF8/nFogtQeJkwMBAAAAAAAAAI0O+loDKL2+FkT3B4UAAAAAAAB0AyB74dEFRQEAAQAAAAAAAADzAFA68QMAAAAAAAAAAADwU60vFgEAAAAAAAAAAAAAAAAAAAAAAABOBO0KIHozawAAAAAAAAAYa+HZAFqDqAXQ+p9JWz/QAgAAAAAAAACyFh79gNk3gMgG4C8eAAAAAAAAAHYD8PCx3DolIK1vAlUCkH0TqeiC9+7iDwAAAAAAAN0CiJ4Iag1k328UWXtQN/kfgAAAAAAAANANgLkDyT6R093NogEAAAAAAOgGQPRHo8OJfqG1D4aMTu3FLw+NAgAAAAAAwLOEPTza08MBAAAAAADoCcB/g8geCwcAAAAAAACAnItJpS+4NZjo+5U+vw0DIAAEgHKA1IKJLtSCAQAAAAAAAGAeYCwUAAAAAAAAACRJkiRJkiRJ0gz6BkBO34xbk+0UAAAAAElFTkSuQmCC",
  "kristal_es_abadi": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACJklEQVR42u3cv03DQBTA4QgaKlahZQVGYQg6FqFgCSRqBmCBVEi0qSggpo2vyOPI2bk/3096fez3FSc7yWYjSZIkSZIkSZLUcFc3d9OxcYcAEAACQHX08P49Hc6pC799/ZrNxePbbIAAAAAAAAAAgDoWnhaBiBaelgI4N4jtbj8dDgAAAAAAAAA4E/ztEJgu7OXjZza5ABwSAQAAAAAAAKDOokNfaQBAAAAAAAAAAEAbC18aQGkQQAEAAAAAANArgNI3qHUA0fV0BwIAAAAAAIBhAKQXEN2w6IJbBxB9/sv7p6PTHAgAAAAAAACGARAtPP2CR+4NbQ1A9HkBAAAAAAAAoFcA6cKjyb3BtQOIFg4AAAAAAAAAAPwPRG0ASi+8ORAAAAAAAAAMAyD3wU9tAKI/jQIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvg5YF0RuA7hYOAAAAAAAAAAAAAAAAAAAAAAAVA0inNIB0YQAAAAAAAAAwCoC1fyzaO4Du/igSAAAAAAAAAAAAAAAAAAAAgKEA5D4YKv0lzGhKAxjuwQ8AAAAAAADDAoj+LDn3UDgagNz7BwAAAAAAAAC1LPz6+dOsONX9OthSADAAmG4B5C489+WMyZvVQQAAAAAAAADAQoe+7W4/1DR3SAQAAAAAAGBYAKe+/PHwpuxCz/6yCAAAAAAAgGEBLA3GNP6tYAAAAAAAAACQJEmSJEmSJEk19AugcBkwknIKGQAAAABJRU5ErkJggg==",
  "lendir_besi": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAB5klEQVR42u3bsVHDMBiG4TQcC7AAFCzBAEyQDWg4dmAKNkiTEdiBO7oMABV0dJShthpZlixL6HnvvgHI/xQ+4ux2kiRJkiRJkiRJkiRJkiRJkiRJlbq6uD3nzCcIgAAQAOrz4C+H16Td7x8nAwgAAAAAAAAA+jh4eMDPr5+k5YKJAXIxAASAAFAbD33hUsHEAAABAAAAAAAAAHUe+nIB5D70xXZ3+TAZEAAAAAAAAAAw7+DhBxj7wFsHAAQAAAAAAAAALAPwfPM+WfiBH/e/SSt9cCAAAAAAAAAAoMzBn66Pk4UAwqUCiK00gPDvGR4EAAAAAAAAwwCIHTz20Je63IfE2MKD5g4AAAAAAAAARgWQ+tBXeq0B+HcgAAAAAAAAGAZA6YN/n86TrQ2i9IGHAwEAAAAAAAAACwHUPvjaAIb78ggAAAAAAAAAZgLY+uCpAMKDvZ0+ig4AAAAAAAAAegGQ+sLH1l/+lAYw/A9LAAAAAAAAAKDSS58AAAAAAAAAAEAfAFp/6Mv9MmhtAM3/kAQAAAAAAAAAAFh00O5fGgUAAAAAAACAmQAMAAPAALA+AeS+AGIAGAAGgI0BwOoOAAAAAAAAALb6R5Btu81fCDEADAAbBoAkSZIkSZIkSZIkSZIkSWqyP4g5kquFVtUVAAAAAElFTkSuQmCC",
  "mahkota_raja_slime": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACXElEQVR42u3dMUprQRiG4SBqKTYigsuwcBOuQ2zcgYWgjQsQXEC2oFhYC2IX96DWNiqCtpkfdBjPGXJy5nnhq24uN/o/RUguOplIkiQ10PTt63t+viMACAABoDYOHgMCAAAAAAAAAMbZ7s729/wcHAAAAAAAAADaOPjhy0ey9eunZPHxvoMACAABoHECiAEAAAAAAAAAAG0C8KIQAAAAAAAAAJbjoKUHrw0AGAAAAAAAAACoc/DN29Nk8c/7BpADEbd2eZQMCAAAAAAAAACoAyAHojaAePC92VUyAAAAAAAAAGgFQNcvuPTgcbmDdwUQlwPQ94vCwYMCAAAAAACgGQDxCW1MX5N1/TCldQDx8Stn98kWDgIAAAAAAAAAfgFwMvtKVvofOloDkDv4/t17MgAAAAAAAABYFgC5F4lxx883f27RAHIHzwHIHRwAAAAAAAAAxgogB2LsAHIHBwAAAAAAAIBWAMSNDUDpwQEAAAAAAABgqABqgygFUAqiFEDphz9dAQz+4AAAAAAAAADQE4B4wKEBiAcvBVAKAgAAAAAAAAAAqAMg90ukAAAAAAAAAACA/wHIHdC6bfAfBjkSAAaANQvg83Gr6uKLsNr/3tCeDwAAAAAAAAAsK4D4Rkdc7u/HN35KHx/LvbHU9/Pp+vUDAAAAAAAAQKsASlf6Q6dKD1o6AAAAAAAAAAAAAAAAAAAAAAAYE4CHi1WrOAAAAAAAAAAAAAAAAAAAAAAAGBKA84MNqzgAAAAAAAAAWJafF2D9bjL0HAkAhwLAmgUgSZIkSZIkSZIkSZIW3g8hBwBqqE6D0AAAAABJRU5ErkJggg==",
  "medali_pahlawan": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACKElEQVR42u3du00DQRQFUAsRQAHOHFuiD3dAV+7DFUBCTIYogQpIIAUhQ0C0g9B6mO8y50o3WksWvBM8je3d1UpERESkQa7WZ58jFwAAAAAAAABGHfjzzcWkx9f9v2749w4HAgAAAAAAAAB+ATBaAQAAAAAAAMC5wHeftttJPw6HScPrc009qLnbbKL6sttNGl53EggAAAAAAAAAp4HIDSD2/VMBGDgAAAAAAAAALGMptPQBAAAAAAAAwBhLoaUPAAAAAAAAAMZYCgEAAAAAAAAAAAD+AsDBDwAAAAAAAAAsE0RuAAYOAAAAAAAAAH0CeH9cJ9XSBwAAAAAAAADLBJEbgIEDAAAAAAAAQB8DD3t7fVm0bv4MAAAAAAAAAG0GHg4kTOkbO8YCMUEABAABQOoM/GF/nrWpQIAAAAAAAAAAgDYDDz/cOb7dTxs81Cl8PRAAAAAAAAAA0AZA6sBTAaSCAAAAAAAAAAAA2gw8NUAAAAAAAAAAQB8AfixxM01N7PsBAAAAAAAAAABlAMT+uLP0EhgWAAAAAAAAAAAAAAAAAAAAAAAAaAcg9xdCAAAAAAAAAACAOgBiQcwNNBbA3HU/FAEAAAAAAACAPkHkXgINHAAAAAAAAAD6AFD64Cj3jSUBAAAAAAAAAIA6IGrXwAEAAAAAAACgDojaQDwwAgAAAAAAAAD6AOHBkQAAAAAAAAAgpwBJrf8wAAKAACAiIiIiIiIisrB8AbMJkva8T88eAAAAAElFTkSuQmCC",
  "nektar_kuno": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACL0lEQVR42u3dMU7DQBBA0TQgcQA4AKLmBtRItPRcgzYVBWehpKfiEDSIG0CPILRkJbKa7Bjb6/el6SACzxNy7JCsVpIkSZIkSZIkSZIkSZ319Xa5+T2OCAACQABoGQsvAwIAAAAAAAAAnAQKAAEgALScDs5PNkOOIwyAABAAvRyQ3hZ2vL4YdGYHBAAAAAAAgMUAiB6Q7F9gagv77xkdCAAAAAAAAAD8cYCvXtdbE/0Fhl7o6fPNpCcbCAAAAAAAAABM5aQwe6a+0LGBjP4XAQAAAAAAgG4BDA0i+wA+Xh/tnM+ns6apPX705717f9g5oy8cAAAAAAAAAJJAZC+4XND3x/3W1Cq/vjZRMLUFR08CAQAAAAAAAGAuLyIdG0D21BZaTu0ksftXEQMAAAAAAABA0klh9MJO9oJbLxxFAbzcHu6cxT0rAAAAAAAAAIA9b/ZkLzh6syh60gcAAAAAAAAAcwHw3xeGWi/MZE/5jzOtF37KN7IsBwAAAAAAAAB6vTcQfUFFdGoLa/3+1pO+2gdadP+sAAAAAAAAgG4BDL3gqS08CqB2EggAAAAAAAAAvdwbyL5Q1Lrw2uNlv6FDdzeDAAAAAAAAAGBPAFEgc1t49Hh19yFUAAAAAAAALAZANojagqJvzBhduE8KBQAAAAAAAIBhQIz9ZtUWDAAAAAAAAADzANL6wZcWDAAAAAAAAADLAOMIASAABIAkSZIkSZIkSZIkSZIkSZIkSdLM+gHJFjthUgItnQAAAABJRU5ErkJggg==",
  "pecahan_jiwa": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACNklEQVR42u3czUnEYBCA4UVBPVmCLejRFizBEizCmxbiwSYEzxZgD4IdeFDW62ZYd/jIj8nkeWFOikjmET6SrJuNJEmS0q5fv7a744oAIAAEgGp2//693R1XBAABIAAkSZK03E4urraHxhUCQAAIANVceHy4c3z31BkgAAAAAAAAAKDmwuPDnggACAAAAAAAAACoufBWAEAAAAAAAAAAwDIWDgAAAAAAAAAAOPTtm+xhEBAAAAAAAAAAUGPhfQ99Y4PwYVQAAAAAAAAAmOeNn2xObx8741AIAAAAAAAAAPvL/vFivIDxgmcA4rx8/Byc+PPPLm86ky0cAAAAAAAAAAD4n0Nf68LjguNkC7ZwAAAAAAAAABhn4a2HvtaFx+L3jw0AGAAAAAAAAACYBkDW2ADi148e3jqzehAAAAAAAACsBkDfhWcvaLQCaF14BiBbeDblQQAAAAAAAADAHwD6TnYo7HvoGxpAfGm1PAgAAAAAAADKAmi9MTI1gKEX3nrjp/whEAAAAAAAgNUAiL/w+fNnZ6YGERfW96XPoV8AAQAAAAAAAIClAsgWnk1246QagOz6lfuLBwAAAAAAoAyA1oXHGy9TAxh64av/MCgAAAAAAAAADHToG/qFkbkf+gAAAAAAAABgrSDGBuDQBwAAAAAAAADzADH0w5LWQ6CFAwAAAAAAAEBNYGN/mNMVB0AACAAtA0C2UAsGAAAAAAAAgJogXBEABIAAkCRJkiRJkiRJkiRJWmm/9AUDu9q0nx4AAAAASUVORK5CYII=",
  "ramuan_hp_kecil": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAB60lEQVR42u3dvVECQRiAYSIzrEDJrcFAQtoxogIaYOxAc1M7MCA2MKQGQoafgGwHvTlud2/v9nlnvgb4nmBn74DJRJIkSZIkaaC9TB9OKccnDIAAEAAqc+G/y7tOs57f/ztAAAAAAAAAAAAAAAAAAAACQAAIAAEgAJR34eE0LbDreFgEAAAAAAAAAP0sfPOzLXqAAAAAAAAAAAAAAAAAAAAEgPJdBL29fyUdF0EAAAAAAAAAUCaI3ABsAAABIAAEgAAQAAJA+Rbu4Q8AAAAAAAAAjHPBbRc+e3pOOm1BAAIAAAAAAAAAtx3qwlIvODcQAAAAAAAAAADgMoePz1ENAAAAAAAAAABw26Fv/7qKOtvHRdZpOiRWBwIAAAAAAAAAKgEQDgAAAAAAAADUAqDtCx1dARx331EnNYDRgwAAAAAAAACAPwCEFyWpAYQLyQ2guoshAAAAAAAAAOgJQNsFAQAAAAAAAAAA47wI6vsQ6CIIAAAAAACAWr872ASi6wsfQ3sY5I0gAAAAAAAAALh+MeSLIQAAAAAAAADgUDhEABYOAAAAAAAAAHEeFpUOwA9FAgAAAAAAAEAcELGB5F6whQMAAAAAAABAP4dGfxwJAAAAAAAAAHUeGlOPDQAgAASAJEmSJEmSJElSgZ0B2/WxyKISfHEAAAAASUVORK5CYII=",
  "ramuan_spora": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACU0lEQVR42u3dr0oEURwF4C0KFrfIRoPNoM1uE7Zu9zU0mnwA8Q22Gg2C2W61iG9gNIlW56Jer/fPzOx+B04TFjxf+LEz6GQiIiIiIsWzcTj7+Fq/EQAEAAFA2vzCc5v7eXsPp50CAQAAAAAAAAB1Bn8628zq1fF2p6kDxwoAAAAAAAAAANQBEA6YW4MDAAAAAAAAAAD/OQIBAAAAAAAAAIA6g18v75q29MMkAUAAEABknAAsAoAAIADIeoAAAAAAAAAAAADGMfh0fzerQAAAAAAAAADAMAcPkzv4/Pmi01QgQAAAAAAAAABAGwCxgS5fbzrNBQIAAAAAAAAAAIwDQO0CAAAAAAAAAADDAOFhEAAAAAAAAACs5uDnR9NBFwgAAAAAAAAAqAMg949B1y4AAAAAAAAAANDmi56dxUGv9UURAAAAAAAAAJQZPHyJc+wFAgAAAAAAAAD+duSFCY+u2XLeaeo/cUpt+HmxOhIBAAAAAAAAoAyA2D91qg0g1tvF1q+NgQAAAAAAAACAVQWQ+nAnTGyA2kBiA6ceiWt3FAIAAAAAAADADwDCIykVQC6Q2MD3b4+d1v6iCAAAAAAAAAAcgWUAxAbOPSIdgQAAAAAAAABQBkTqCx+xgcOff3856TT3iMwF4GkgAAAAAAAAAHzf1IFbvxQaA+KlUAAAAAAAAAAo87Ao9ehqXW8BAwAAAAAAAECbI7HvwR15AAAAAAAAADAMEH3X4AAAAAAAAADQBkSspQeN1UIACAACgIwTjEEBAAAAAAAAQERERERERERWLJ9I76pRQzKGFgAAAABJRU5ErkJggg==",
  "serat_kayu_purba": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACO0lEQVR42u3dIU7EUBQF0AkkoAgKBIaEPSCRmFkEgk2AHMU+CJYdoPFYDFtAIkG3CdN589vf1/bc5Kkhgek9zfy0f8pqJSIiIiIiIiIiIiIiMqFcnhz8lszQv19DAAgAAoAChjngV+93RRP9+9o//3x/vHXGBgoAAAAAAAAAQxV+/rIOTekbjgJ4+/loTBRAtPD2PF6fFk06EAAAAAAAAADwD4Cn79fGlAKpvQgcu3AAAAAAAAAAmMsiMDuIbIV3ARgdBAAAAAAAAADseSEoCqJvANkLv704DE11EAAAAAAAAAAwEQBzKxwAAAAAAAAAxgIwNRBzKxwAAAAAAAAAsgCIflGkFET2DRyLKxwAAAAAAAAABgKSrfDPh6PQLL5wAAAAAAAAANgTyNnmZuuUFl67UIUDAAAAAAAAwG43b9qFr782jWm/nu3CjcIBAAAAAAAAoJ8NG32DUDgAAAAAAAAA5Cy8q8BSEEMX7IwHAAAAAADAZ36dDRtREKU3e/yXMAAAAAAAACzy6hQe3cARBaFwAAAAAAAAAMi5yCu9kBMF4YwHAAAAAADAZ/40C4+CAAAAAAAAAIClAlj6Q5ec8QAAAAAAAACwG4C+C+7aoGEDBwAAAAAAAADUATC1BysqHAAAAAAAAAByAKj9QAaFAwAAAAAAAEAOAG7eAAAAAAAAAMAyAFjUAQAAAAAAAMA8QXSNwgEAAAAAAABgmUAUDgAAAAAAAABA7DKOGAACgAAgIiIiIiIiIiK95g/1NHU0AsJpPwAAAABJRU5ErkJggg==",
  "serat_kuno": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAB/0lEQVR42u3dMU4CQRSA4S2ltvAC1CZ2xtYjcAQT70FrvIYnkJ7SxNIT2JlYaWcCAet9UdlxB8LMfH/ySgnL+woyi9B1kiRJkiRJkiRJkiRJmTs7vdrWPDYMgAAQAPp54YvZpDer5bToidcDBAAAAAAAAAAMAxBn83F3VLPr+QIAAAAAAAAAAHkAlD4AAAAAAAAAAMD/bgbd3H725vVtO2ri48W5vnxOGjeDAAAAAAAAAGA/IC7O51knFUwqgNyvR3w+AAAAAAAAANAKgPgm7WGxTpr497lB7RtAc28qAQAAAAAAAKDQg6DcB2ERdPUgAAAAAAAAAKCSg6BdC57ff/05AAAAAAAAAOBNYBkHQakLTv3CiepBAAAAAAAAAEAhB0FjF5z6egAAAAAAAABAKwDeH09GTWzs48U59D+GVA8CAAAAAAAAAHwodNDr8/Sy6Q0AAAAAAAAA1Aqgtg+FNr9wAAAAAAAAAPjlglv7gojmFg4AAAAAAAAAjR4ENb9wAAAAAAAAAGjkIMjCAQAAAAAAAMBBUNfiF0ECAAAAAAAAgIMgASAABICFJ/xw5FgAfjgSAAAAAAAAAI5j4YvZpDer5bToidcDBAAAAAAAAAAMA1DbAAAAAAAAAAAAAAAAAAAAAACAht8MKn1sGAABIAAkSZIkSZIkSZIkSZIO1DfUdVdtmSEVDQAAAABJRU5ErkJggg==",
  "spora_hijau": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAB4klEQVR42u3dIU4DQRSA4TWQcAB6AA7ADbhAExSea2CrEFwDi8Sh8SQoEoIEicS0WWx3RIdtZ2Znme9PnmvTTd+XZrPbpl0nSZIkSZIkSZI045Yfq357vCMACAABIEmSpOnqg26/HwZT2/G+r7/67XGSCQAAAAAAAAD7FS68dgDhwgEAAAAAAAAAAEmSpHQdnS/6kuMdB0AACACluVBy6IJPVxdFBxAAAAAAAAAAKHNSF1vI2fN10RkLxEYBEAACQPstPPUCY9UOovYvxAAAAAAAAABALQvPDcBJIgAAAAAAAADkWfjTz8vOKX0hCAAAAAAAAAAAaANA7MepAAAAAAAAAABAnRd+cgNI/SVTAAAAAAAAALDweYwfmgAAAAAAAADA3wD891ncL5PO7EAAAAAAAADQLIAYiNzzdnM8mM3n3agJnx97vbELDW9mNfeJAAAAAAAAQDMASgOrHcDYCW8+AQEAAAAAAAAA0wDIvfDmLxwBAAAAAAAAwExOAmPzeHUymPXr5c4JH+8PLQAAAAAAAACgDgBjjyc1gE4ACAABIAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAoyAOnamPx0YBEAACQJIkSZIkSZIkSZIkKVG/if6Zdw5f544AAAAASUVORK5CYII=",
  "taring_serigala_bayangan": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAB00lEQVR42u3boXECQRiGYQwTSQWIpAUkddABDhudBiKTDjCUkCpSBIpB4SIvNrfm+JPd27vN8878KjOY7xE3B1ksJEmSJEmSJEmSGm61XHc1zwIACAABoDqDbx/2VS8K4m1z7X6eRQEQAAJAeQAcHk9FLzcIASAABIDKADjtvkIHBAAAAAAAAABMo3Sg0g+FUTClXxwBAAAAAAAAgH73UBi90i+KgAAAAAAAAACAPIO/Hz96d77celf7ByMAAAAAAAAAAMA4ANJSELWBGBwAAAAAAAAAyjz0RQGkl36+wQEAAAAAAACgTQDp50UvHXz//No7AAAAAAAAAABgGi9+cgMwOAAAAAAAAAC08eIHAAAAAAAAAADw0HfP4OnfAQAAAAAAAAAAAAAAAAAABIAMLgAEgAAw+LQH92UPAAAAAAAAAIwzeO1/7IgO/vL02TsLAyAABIDmObiHPgAAAAAAAAD4nw95BgcAAAAAAACAPABqDx4d2OAAAAAAAAAAkGfwKAADAwAAAAAAAECbgxsYAAAAAAAAANoYfOgfOXL/AMPAAAAAAAAAADDO4H/9MmZoQAMDAAAAAAAAwDxAGBAAAAAAAAAAJEmSJEmSJEmSJEmSRukbLSDcRIMwIxAAAAAASUVORK5CYII=",
  "tetesan_kelincahan": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACJ0lEQVR42u3bMUoEMRSA4W0F8Qj2FvaCF7D3PN7CG4g3sBDBE1iKvTaCrZWFutYbkPiImWSS74dXLbhL3lfMzo6bjSRJkiRJ0iDtH59tS8YJAiAABIDWufCb872iAQIAAAAAAAAAAAAAAAAAEABaz42e/wYABAAAAAAAAAD0sfCHp5emAwQAAAAAAAAAAAAAAAAAIABmWkDr97+8um06S59Hc3AAAAAAAABMAyB9w+f3751pfQDpQg6PTqvO0gDSv3/3+rUz1c8fAAAAAAAAAH4BkFb7AYoogLTeAOTOK1147rwBAAAAAAAAoNV9gVylQNYGoHTBzRcOAAAAAAAAAH8EkJu06I2lHIDcgaavRycHILfg0s8HAAAAAAAAAL187y+d0ovGdCEn9x87k5a+fnD9FpocgOhFXSnI5ncCAQAAAAAAGAZA7YWXAukNQO2LzsVBAAAAAAAAMC2AKIiLx8+iiYLoHUB00s8TnebfAgAAAAAAABgWQPQBh+hCo2B6BxBdYPSirrtfAwEAAAAAAJgGQOsbR6NdBHb/BBAAAAAAAAAAdPJj0WwAhnsqGAAAAAAAgGGvCZae3h4KrT3dfwsAAAAAAABgGgCtwfUGYCMABIAAEAACQAAIAAEgAASAABAAAkAACABVB5AbAAAAAAAAAABgDABLDwAAAAAAAAAAMAcICwcAAAAAAACAdYDwz5kAAAAAAAAAIEmSJEmSJEmSJEmSJukHJ9wWLwluV/oAAAAASUVORK5CYII="
};

function ambilPathIkonItem(itemId) {
  if (itemId && DATA_URI_IKON_ITEM[itemId]) {
    return DATA_URI_IKON_ITEM[itemId];
  }
  return "assets/items/" + itemId + ".png?b=120";
}

function tanganiGagalMuatIkonItem(imgEl, fallbackLokal) {
  if (!imgEl) return;
  if (fallbackLokal && !imgEl.getAttribute("data-lokal-dicoba")) {
    imgEl.setAttribute("data-lokal-dicoba", "1");
    imgEl.src = fallbackLokal;
    return;
  }
  imgEl.style.display = "none";
  if (imgEl.nextElementSibling) {
    imgEl.nextElementSibling.style.display = "flex";
  }
}

function ambilHtmlIkonItem(item, warna) {
  if (!item) return "";
  if (item.kategori === "artefak" && item.id) {
    const imgSrc = "assets/artefak/" + item.id + ".png";
    const fallbackSvg = typeof item.ikon === "function" ? item.ikon(warna) : "";
    return '<img src="' + imgSrc + '" class="pixel-item-img pixel-artefak-img" alt="' + (item.nama || "") + '" onerror="this.style.display=\'none\';if(this.nextElementSibling)this.nextElementSibling.style.display=\'flex\';">'
      + '<span class="pixel-item-fallback" style="display:none;width:100%;height:100%;">' + fallbackSvg + '</span>';
  }
  const lokalSrc = "assets/items/" + item.id + ".png?b=120";
  const imgSrc = ambilPathIkonItem(item.id);
  const fallbackSvg = typeof item.ikon === "function" ? item.ikon(warna) : "";
  const onErr = imgSrc !== lokalSrc
    ? 'if(typeof tanganiGagalMuatIkonItem===\'function\'){tanganiGagalMuatIkonItem(this,\'' + lokalSrc + '\');}else{this.style.display=\'none\';if(this.nextElementSibling)this.nextElementSibling.style.display=\'flex\';}'
    : 'this.style.display=\'none\';if(this.nextElementSibling)this.nextElementSibling.style.display=\'flex\';';
  return '<img src="' + imgSrc + '" class="pixel-item-img" alt="' + (item.nama || "") + '" onerror="' + onErr + '">'
    + '<span class="pixel-item-fallback" style="display:none;width:100%;height:100%;">' + fallbackSvg + '</span>';
}

function segarkanTampilanInventory() {
  renderGridInventory();
}

function renderGridInventory() {
  const grid = document.getElementById("invGridDaftar");
  const pesanKosong = document.getElementById("invGridKosong");
  const badgeKapasitas = document.getElementById("invKapasitas");
  if (!grid) return;

  grid.innerHTML = "";
  const dataInv = ambilSemuaItemInventaris();
  const daftarDihitung = [];

  for (const id in dataInv) {
    const itemDef = DATABASE_ITEM[id];
    const qty = dataInv[id];
    if (itemDef && qty > 0) {
      if (kategoriInvAktif === "semua" || itemDef.kategori === kategoriInvAktif) {
        daftarDihitung.push({ def: itemDef, jumlah: qty, tipe: "item" });
      }
    }
  }

  let totalArtefakMilik = 0;
  if (typeof progres === "object" && progres && progres.artefakMilik) {
    for (const artId in progres.artefakMilik) {
      const lv = progres.artefakMilik[artId];
      if (lv > 0 && typeof artefakCari === "function") {
        totalArtefakMilik++;
        if (kategoriInvAktif === "semua" || kategoriInvAktif === "artefak") {
          const cari = artefakCari(artId);
          if (cari) {
            const b = typeof artefakBintang === "function" ? artefakBintang(artId) : 3;
            const bDef = (typeof ARTEFAK_BINTANG !== "undefined" && ARTEFAK_BINTANG[b - 1])
              ? ARTEFAK_BINTANG[b - 1]
              : { nama: b + " Bintang", warna: "#38bdf8", border: "rgba(56,189,248,0.6)" };
            const slotDef = (typeof ARTEFAK_SLOT !== "undefined")
              ? ARTEFAK_SLOT.find(s => s.kunci === cari.slot)
              : null;
            const slotNama = slotDef ? slotDef.nama : cari.slot;

            daftarDihitung.push({
              tipe: "artefak",
              jumlah: 1,
              def: {
                id: artId,
                nama: cari.set.nama + " (" + slotNama.toUpperCase() + ")",
                kategori: "artefak",
                rarity: b,
                warna: bDef.warna,
                border: bDef.border,
                ikon: function(warna) {
                  if (typeof ikonSetArtefak === "function") {
                    return ikonSetArtefak(cari.set);
                  }
                  if (typeof ikonSlotArtefak === "function") {
                    return ikonSlotArtefak(cari.slot, warna);
                  }
                  return '<svg viewBox="0 0 24 24" fill="none" stroke="' + (warna || "#38bdf8") + '" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>';
                },
                artData: {
                  cari: cari,
                  level: lv,
                  cap: typeof artefakCapLevel === "function" ? artefakCapLevel(artId) : 20,
                  bintang: b,
                  slotNama: slotNama
                }
              }
            });
          }
        }
      }
    }
  }

  if (badgeKapasitas) {
    let totalJenis = Object.keys(dataInv).filter(k => dataInv[k] > 0).length + totalArtefakMilik;
    badgeKapasitas.textContent = totalJenis + " JENIS ITEM";
  }

  if (daftarDihitung.length === 0) {
    if (pesanKosong) pesanKosong.classList.remove("hidden");
    pilihItemDetailInventory(null);
    return;
  }

  if (pesanKosong) pesanKosong.classList.add("hidden");

  daftarDihitung.sort(function(a, b) {
    if (b.def.rarity !== a.def.rarity) return b.def.rarity - a.def.rarity;
    return a.def.nama.localeCompare(b.def.nama);
  });

  let ditemukanPilihan = false;

  for (let i = 0; i < daftarDihitung.length; i++) {
    const data = daftarDihitung[i];
    const item = data.def;
    const qty = data.jumlah;
    const isArtefak = data.tipe === "artefak";
    const rarity = isArtefak
      ? { warna: item.warna, border: item.border, nama: item.artData.bintang + " Bintang" }
      : (ITEM_RARITY[item.rarity] || ITEM_RARITY[1]);

    const slot = document.createElement("button");
    slot.className = "inv-item-slot r-" + item.rarity + (isArtefak ? " slot-artefak" : "");
    slot.type = "button";
    slot.setAttribute("data-id", item.id);
    slot.style.setProperty("--warna-item", rarity.warna);
    slot.style.setProperty("--border-item", rarity.border);

    const iconWadah = document.createElement("div");
    iconWadah.className = "inv-item-icon";
    iconWadah.innerHTML = ambilHtmlIkonItem(item, rarity.warna);
    slot.appendChild(iconWadah);

    const badgeQty = document.createElement("span");
    badgeQty.className = "inv-item-qty";
    if (isArtefak) {
      badgeQty.textContent = "Lv." + item.artData.level;
      badgeQty.style.color = rarity.warna;
      badgeQty.style.borderColor = rarity.border;
    } else {
      badgeQty.textContent = qty > 999 ? "999+" : qty;
    }
    slot.appendChild(badgeQty);

    const garisRarity = document.createElement("div");
    garisRarity.className = "inv-item-rarity-bar";
    garisRarity.style.background = rarity.warna;
    garisRarity.style.boxShadow = "0 0 6px " + rarity.warna;
    slot.appendChild(garisRarity);

    slot.onclick = function() {
      if (typeof sfxKlik === "function") sfxKlik();
      pilihItemDetailInventory(item, qty);
    };

    if (item.id === itemInvTerpilihId) {
      slot.classList.add("terpilih");
      ditemukanPilihan = true;
    }

    grid.appendChild(slot);
  }

  if (!ditemukanPilihan && daftarDihitung.length > 0) {
    pilihItemDetailInventory(daftarDihitung[0].def, daftarDihitung[0].jumlah);
  }
}

function pilihItemDetailInventory(item, jumlah) {
  const panel = document.getElementById("invPanelDetail");
  if (!panel) return;

  const iconWadah = document.getElementById("invDetailIconWadah");
  const elNama = document.getElementById("invDetailNama");
  const elRarity = document.getElementById("invDetailRarity");
  const elKategori = document.getElementById("invDetailKategori");
  const elJumlah = document.getElementById("invDetailJumlah");
  const elDeskripsi = document.getElementById("invDetailDeskripsi");
  const elAksiWadah = document.getElementById("invDetailAksiWadah");

  const semuaSlot = document.querySelectorAll(".inv-item-slot");
  for (let i = 0; i < semuaSlot.length; i++) {
    semuaSlot[i].classList.toggle("terpilih", item && semuaSlot[i].getAttribute("data-id") === item.id);
  }

  if (!item) {
    itemInvTerpilihId = null;
    if (elNama) elNama.textContent = "Pilih Item";
    if (elRarity) elRarity.textContent = "-";
    if (elKategori) elKategori.textContent = "Tipe: -";
    if (elJumlah) elJumlah.textContent = "Dimiliki: 0";
    if (elDeskripsi) elDeskripsi.textContent = "Pilih salah satu item di inventaris untuk melihat rincian dan kegunaannya.";
    if (iconWadah) iconWadah.innerHTML = '<div class="inv-detail-kosong-ikon">&#128065;</div>';
    if (elAksiWadah) elAksiWadah.innerHTML = "";
    return;
  }

  itemInvTerpilihId = item.id;

  if (item.artData) {
    const art = item.artData;
    if (iconWadah) {
      iconWadah.innerHTML = ambilHtmlIkonItem(item, item.warna);
      iconWadah.style.borderColor = item.warna;
      iconWadah.style.boxShadow = "0 0 16px " + item.border;
    }
    if (elNama) {
      elNama.textContent = item.nama;
      elNama.style.color = item.warna;
    }
    if (elRarity) {
      let bintangTeks = "";
      for (let s = 0; s < art.bintang; s++) bintangTeks += "★";
      elRarity.textContent = bintangTeks + " (" + art.bintang + " BINTANG)";
      elRarity.style.color = item.warna;
      elRarity.style.borderColor = item.border;
      elRarity.style.background = item.border;
    }
    if (elKategori) {
      elKategori.textContent = "TIPE: ARTEFAK (" + art.slotNama.toUpperCase() + ")";
    }
    if (elJumlah) {
      elJumlah.textContent = "LEVEL: Lv. " + art.level + " / " + art.cap;
    }
    if (elDeskripsi) {
      let teks = "STATUS ARTEFAK:\n";
      teks += "• Level: Lv. " + art.level + " (Maks. Lv. " + art.cap + ")\n";
      if (typeof artefakStatUtama === "function") {
        const utama = artefakStatUtama(art.cari.set, art.cari.slot);
        for (const st in utama) {
          teks += "• Stat Utama: +" + Math.round(utama[st] * 100) + "% " + st.toUpperCase() + "\n";
        }
      }
      if (typeof artefakSubstat === "function") {
        const sub = artefakSubstat(item.id);
        if (sub && Object.keys(sub).length > 0) {
          teks += "\nSUBSTAT TAMBAHAN:\n";
          for (const st in sub) {
            teks += "• +" + Math.round(sub[st] * 100) + "% " + st.toUpperCase() + "\n";
          }
        }
      }
      if (art.cari.set) {
        teks += "\nBONUS SET (" + art.cari.set.nama + "):\n";
        if (art.cari.set.bonus2) teks += "• (2-Set): " + art.cari.set.bonus2 + "\n";
        if (art.cari.set.bonus4) teks += "• (4-Set): " + art.cari.set.bonus4 + "\n";
      }
      elDeskripsi.textContent = teks;
    }
    if (elAksiWadah) {
      elAksiWadah.innerHTML = "";
      const btnKeArtefak = document.createElement("button");
      btnKeArtefak.className = "inv-btn-pakai";
      btnKeArtefak.type = "button";
      btnKeArtefak.style.background = "#0284c7";
      btnKeArtefak.style.borderColor = "#38bdf8";
      btnKeArtefak.textContent = "KELOLA DI MENU KARAKTER";
      btnKeArtefak.onclick = function() {
        if (typeof sfxKlik === "function") sfxKlik();
        tutupInventory();
        if (typeof tampilkanKarakter === "function") tampilkanKarakter();
        if (typeof gantiTabKarakter === "function") gantiTabKarakter("artefak");
      };
      elAksiWadah.appendChild(btnKeArtefak);
    }
    return;
  }

  const rarity = ITEM_RARITY[item.rarity] || ITEM_RARITY[1];
  const jml = jumlah !== undefined ? jumlah : hitungJumlahItemInventaris(item.id);

  if (iconWadah) {
    iconWadah.innerHTML = ambilHtmlIkonItem(item, rarity.warna);
    iconWadah.style.borderColor = rarity.warna;
    iconWadah.style.boxShadow = "0 0 16px " + rarity.border;
  }

  if (elNama) {
    elNama.textContent = item.nama;
    elNama.style.color = rarity.warna;
  }

  if (elRarity) {
    elRarity.textContent = rarity.nama.toUpperCase();
    elRarity.style.color = rarity.warna;
    elRarity.style.borderColor = rarity.border;
    elRarity.style.background = rarity.border;
  }

  if (elKategori) {
    elKategori.textContent = "TIPE: " + item.kategori.toUpperCase();
  }

  if (elJumlah) {
    elJumlah.textContent = "DIMILIKI: " + jml;
  }

  if (elDeskripsi) {
    let teks = item.deskripsi;
    if (item.efek) {
      teks += "\n\n[EFEK]: " + item.efek;
    }
    elDeskripsi.textContent = teks;
  }

  if (elAksiWadah) {
    elAksiWadah.innerHTML = "";
    if (item.kategori === "konsumsi") {
      const btnPakai = document.createElement("button");
      btnPakai.className = "inv-btn-pakai";
      btnPakai.type = "button";
      btnPakai.textContent = "GUNAKAN";
      btnPakai.onclick = function() {
        gunakanItemKonsumsi(item.id);
      };
      elAksiWadah.appendChild(btnPakai);
    }
  }
}

function gunakanItemKonsumsi(itemId) {
  if (typeof sfxKlik === "function") sfxKlik();
  const sukses = kurangiItemInventaris(itemId, 1);
  if (!sukses) return;

  if (itemId === "ramuan_hp_kecil") {
    if (typeof player !== "undefined" && player && player.hp !== undefined) {
      player.hp = Math.min(player.maxHp || 100, player.hp + 50);
      if (typeof spawnFloatingText === "function") {
        spawnFloatingText(player.x, player.y - 20, "+50 HP", "#4ade80");
      }
    }
    if (typeof feedbackText === "function") {
      feedbackText("Menggunakan Ramuan Pemulih (+50 HP)!");
    }
  } else if (itemId === "embun_vital") {
    if (typeof player !== "undefined" && player && player.hp !== undefined) {
      player.hp = Math.min(player.maxHp || 100, player.hp + 30);
      if (typeof spawnFloatingText === "function") {
        spawnFloatingText(player.x, player.y - 20, "+30 HP", "#4ade80");
      }
    }
    if (typeof feedbackText === "function") {
      feedbackText("Menggunakan Tetesan Embun Vital (+30 HP)!");
    }
  } else if (itemId === "tetesan_kelincahan") {
    if (typeof player !== "undefined" && player && player.speed !== undefined) {
      player.speed = Math.round(player.speed * 1.15);
      if (typeof spawnFloatingText === "function") {
        spawnFloatingText(player.x, player.y - 20, "+15% SPEED", "#38bdf8");
      }
    }
    if (typeof feedbackText === "function") {
      feedbackText("Menggunakan Tetesan Kelincahan (+15% SPD)!");
    }
  } else if (itemId === "elixir_ketahanan") {
    if (typeof player !== "undefined" && player) {
      player.invuln = (player.invuln || 0) + 3;
      if (typeof spawnFloatingText === "function") {
        spawnFloatingText(player.x, player.y - 20, "KEBAL 3s", "#c084fc");
      }
    }
    if (typeof feedbackText === "function") {
      feedbackText("Menggunakan Elixir Ketahanan (Kebal 3 Detik)!");
    }
  } else if (itemId === "ramuan_spora") {
    if (typeof player !== "undefined" && player && player.hp !== undefined) {
      player.hp = Math.min(player.maxHp || 100, player.hp + 45);
      if (typeof spawnFloatingText === "function") {
        spawnFloatingText(player.x, player.y - 20, "+45 HP", "#4ade80");
      }
    }
    if (typeof feedbackText === "function") {
      feedbackText("Menggunakan Ramuan Spora Herbal (+45 HP)!");
    }
  } else if (itemId === "darah_serigala") {
    if (typeof player !== "undefined" && player) {
      if (player.mult) player.mult.damage = (player.mult.damage || 1) * 1.2;
      if (typeof spawnFloatingText === "function") {
        spawnFloatingText(player.x, player.y - 20, "+20% ATK", "#ef4444");
      }
    }
    if (typeof feedbackText === "function") {
      feedbackText("Menggunakan Darah Serigala Liar (+20% ATK)!");
    }
  } else if (itemId === "nektar_kuno") {
    if (typeof player !== "undefined" && player && player.hp !== undefined) {
      player.hp = Math.min(player.maxHp || 100, player.hp + 60);
      if (typeof spawnFloatingText === "function") {
        spawnFloatingText(player.x, player.y - 20, "+60 HP", "#4ade80");
      }
    }
    if (typeof feedbackText === "function") {
      feedbackText("Menggunakan Nektar Daun Kuno (+60 HP)!");
    }
  } else if (itemId === "elixir_raja_slime") {
    if (typeof player !== "undefined" && player && player.hp !== undefined) {
      player.hp = player.maxHp || 100;
      player.invuln = (player.invuln || 0) + 3;
      if (typeof spawnFloatingText === "function") {
        spawnFloatingText(player.x, player.y - 20, "HP PENUH!", "#fbbf24");
      }
    }
    if (typeof feedbackText === "function") {
      feedbackText("Menggunakan Elixir Raja Slime (HP Pulih Penuh)!");
    }
  } else if (itemId === "elixir_daya") {
    if (typeof feedbackText === "function") {
      feedbackText("Menggunakan Elixir Daya Tempur (+10% ATK)!");
    }
  }

  const sisa = hitungJumlahItemInventaris(itemId);
  pilihItemDetailInventory(sisa > 0 ? DATABASE_ITEM[itemId] : null);
}

let lootRunItem = {};

function resetLootRun() {
  lootRunItem = {};
}

function tambahLootRun(itemId, jumlah) {
  if (!itemId || !DATABASE_ITEM[itemId]) return;
  const j = Number.isInteger(jumlah) && jumlah > 0 ? jumlah : 1;
  lootRunItem[itemId] = (lootRunItem[itemId] || 0) + j;
  tambahItemInventaris(itemId, j);
}

function ambilLootRun() {
  return lootRunItem;
}

function renderLootHasilBox(containerEl, jumlahKoin) {
  if (!containerEl) return;
  containerEl.innerHTML = "";

  const wadah = document.createElement("div");
  wadah.className = "loot-baris-box";

  const boxKoin = document.createElement("div");
  boxKoin.className = "loot-box loot-box-koin";
  boxKoin.innerHTML = '<div class="loot-box-ikon">'
    + '<svg viewBox="0 0 24 24" width="38" height="38">'
    + '<circle cx="12" cy="12" r="9" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>'
    + '<circle cx="12" cy="12" r="6" fill="#eab308" stroke="#ca8a04" stroke-width="1"/>'
    + '<text x="12" y="16" text-anchor="middle" font-size="11" font-weight="900" fill="#713f12" font-family="sans-serif">K</text>'
    + '</svg>'
    + '</div>'
    + '<div class="loot-box-nilai">+' + (jumlahKoin || 0) + '</div>'
    + '<div class="loot-box-nama">KOIN</div>';
  wadah.appendChild(boxKoin);

  for (const id in lootRunItem) {
    const qty = lootRunItem[id];
    const def = DATABASE_ITEM[id];
    if (def && qty > 0) {
      const rarity = ITEM_RARITY[def.rarity] || ITEM_RARITY[1];
      const box = document.createElement("div");
      box.className = "loot-box r-" + def.rarity;
      box.style.setProperty("--border-loot", rarity.border);
      box.style.setProperty("--warna-loot", rarity.warna);

      box.innerHTML = '<div class="loot-box-ikon">'
        + ambilHtmlIkonItem(def, rarity.warna)
        + '</div>'
        + '<div class="loot-box-nilai">x' + qty + '</div>'
        + '<div class="loot-box-nama">' + def.nama + '</div>';

      wadah.appendChild(box);
    }
  }

  containerEl.appendChild(wadah);
}

const CACHE_SPRITE_ITEM = {};

function ambilSpriteItemCanvas(itemId) {
  if (CACHE_SPRITE_ITEM[itemId]) return CACHE_SPRITE_ITEM[itemId];
  const lokalSrc = "assets/items/" + itemId + ".png?b=120";
  const awalSrc = ambilPathIkonItem(itemId);
  const img = new Image();
  let sudahCobaLokal = awalSrc === lokalSrc;
  img.onerror = function() {
    if (!sudahCobaLokal) {
      sudahCobaLokal = true;
      this.removeAttribute("crossorigin");
      this.src = lokalSrc;
      return;
    }
    const def = (typeof DATABASE_ITEM !== "undefined" && DATABASE_ITEM) ? DATABASE_ITEM[itemId] : null;
    if (def && typeof def.ikon === "function") {
      const rarity = (typeof ITEM_RARITY !== "undefined" && ITEM_RARITY[def.rarity]) ? ITEM_RARITY[def.rarity] : { warna: "#ffd23f" };
      this.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(def.ikon(rarity.warna));
    }
  };
  img.src = awalSrc;
  CACHE_SPRITE_ITEM[itemId] = img;
  return img;
}

function pasangInventoryUI() {
  const btnInv = document.getElementById("tombolInventory");
  if (btnInv) btnInv.onclick = bukaInventory;

  const btnTutup = document.getElementById("tutupInventory");
  if (btnTutup) btnTutup.onclick = tutupInventory;

  const tabBtns = document.querySelectorAll(".inv-tab-btn");
  for (let i = 0; i < tabBtns.length; i++) {
    tabBtns[i].onclick = function() {
      const kat = this.getAttribute("data-kategori") || "semua";
      gantiKategoriInventory(kat);
    };
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", pasangInventoryUI);
  } else {
    pasangInventoryUI();
  }
}

if (typeof window !== "undefined") {
  window.bukaInventory = bukaInventory;
  window.tutupInventory = tutupInventory;
  window.ambilPathIkonItem = ambilPathIkonItem;
  window.tanganiGagalMuatIkonItem = tanganiGagalMuatIkonItem;
}

