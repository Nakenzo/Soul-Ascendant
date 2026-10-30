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

const BUILD_IKON_ITEM_UNIK = 119;

function ambilPathIkonItem(itemId) {
  const lokal = "assets/items/" + itemId + ".png";
  if (
    typeof IS_APK !== "undefined" &&
    (IS_APK || IS_PC) &&
    typeof window !== "undefined" &&
    window.SA_PATCHER &&
    typeof window.SA_PATCHER.ambilBuildBawaan === "function" &&
    window.SA_PATCHER.ambilBuildBawaan() < BUILD_IKON_ITEM_UNIK &&
    (typeof navigator === "undefined" || navigator.onLine !== false)
  ) {
    return "https://raw.githubusercontent.com/Nakenzo/Soul-Ascendant/main/" + lokal;
  }
  return lokal;
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
  const lokalSrc = "assets/items/" + item.id + ".png";
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
  const lokalSrc = "assets/items/" + itemId + ".png";
  const awalSrc = ambilPathIkonItem(itemId);
  const img = new Image();
  if (awalSrc !== lokalSrc) {
    img.crossOrigin = "anonymous";
  }
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

