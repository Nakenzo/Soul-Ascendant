const BUILD = 122;
const CACHE_FALLBACK = "soul-ascendant-v" + BUILD;
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./inventory.js",
  "./settings.css",
  "./updater.css",
  "./updater.js",
  "./boot.js",
  "./manifest.json",
  "./core.js",
  "./save.js",
  "./settings.js",
  "./akun-konfig.js",
  "./akun.js",
  "./akun-ui.js",
  "./settings-ui.js",
  "./hud.js",
  "./audio.js",
  "./config.js",
  "./karakter.js",
  "./artefak.js",
  "./bosses.js",
  "./maps.js",
  "./texture.js",
  "./menu.js",
  "./input.js",
  "./ikon-sentuh.js",
  "./levels.js",
  "./upgrades.js",
  "./skills.js",
  "./entities.js",
  "./vfx.js",
  "./draw.js",
  "./ambience.js",
  "./main.js",
  "./admin-konfig.js",
  "./admin-akun.js",
  "./test-wave-select.js",
  "./admin-artefak.js",
  "./admin-debug.js",
  "./assets/fonts/ZenDots.woff2",
  "./assets/characters/kenzro.png",
  "./assets/characters/rin.png",
  "./assets/characters/voiz.png",
  "./assets/weapons/panah.png",
  "./assets/weapons/pedang.png",
  "./assets/weapons/tongkat.png",
  "./assets/maps/padang.png",
  "./assets/enemies/musuh.png",
  "./assets/enemies/cepet.png",
  "./assets/enemies/tank.png",
  "./assets/items/bara_magma.png",
  "./assets/items/batu_petir.png",
  "./assets/items/darah_serigala.png",
  "./assets/items/elixir_daya.png",
  "./assets/items/elixir_ketahanan.png",
  "./assets/items/elixir_raja_slime.png",
  "./assets/items/embun_vital.png",
  "./assets/items/esensi_badai.png",
  "./assets/items/gel_merah.png",
  "./assets/items/gel_pendingin.png",
  "./assets/items/gelatin_raja_slime.png",
  "./assets/items/inti_bos_slime.png",
  "./assets/items/kristal_es_abadi.png",
  "./assets/items/lendir_besi.png",
  "./assets/items/mahkota_raja_slime.png",
  "./assets/items/medali_pahlawan.png",
  "./assets/items/nektar_kuno.png",
  "./assets/items/pecahan_jiwa.png",
  "./assets/items/ramuan_hp_kecil.png",
  "./assets/items/ramuan_spora.png",
  "./assets/items/serat_kayu_purba.png",
  "./assets/items/serat_kuno.png",
  "./assets/items/spora_hijau.png",
  "./assets/items/taring_serigala_bayangan.png",
  "./assets/items/tetesan_kelincahan.png",
  "./assets/sfx/gameover.mp3",
  "./assets/sfx/menang.mp3",
  "./assets/music/lobby.mp3",
  "./assets/music/game.mp3",
  "./assets/ui/logo-kamu.png",
  "./assets/ui/logo-aura.png",
  "./assets/ui/logo-soul-ascendant.svg",
  "./assets/ui/icon-192.png",
  "./assets/ui/icon-512.png",
  "./assets/ui/icon.png",
  "./assets/ui/element-angin.svg",
  "./assets/ui/element-api.svg",
  "./assets/ui/element-es.svg",
  "./assets/ui/element-fisik.svg",
  "./assets/ui/element-nature.svg",
  "./assets/ui/element-nihil.svg",
  "./assets/ui/element-petir.svg",
  "./assets/ui/element-tanah.svg",
  "./assets/ui/class-attacker.svg",
  "./assets/ui/class-mage.svg",
  "./assets/ui/class-ranger.svg",
  "./assets/ui/class-breaker.svg",
  "./assets/ui/class-assassin.svg",
  "./assets/ui/class-catalyst.svg",
  "./assets/ui/test-badge.svg"
];

// Nama cache aktif, diisi saat install.
let CACHE_NAME = CACHE_FALLBACK;
// Kalau manifest.json gagal dibaca, jangan hapus cache apa pun (lebih aman
// daripada mengosongkan cache lalu pemain kehilangan aset offline).
let AMAN_UNTUK_HAPUS = false;

function namaCacheDari(manifest) {
  const b = manifest && manifest.build;
  return "soul-ascendant-v" + (Number.isFinite(b) ? b : BUILD);
}

self.addEventListener("install", (e) => {
  if (self.location.hostname === "localhost" || self.location.protocol === "tauri:" || self.location.protocol === "capacitor:") {
    self.skipWaiting();
    return;
  }
  e.waitUntil(
    // cache: "reload" = paksa ambil dari jaringan, jangan dari cache browser.
    fetch("./manifest.json", { cache: "reload" })
      .then((r) => (r && r.ok ? r.json() : null))
      .then((manifest) => {
        CACHE_NAME = namaCacheDari(manifest);
        AMAN_UNTUK_HAPUS = true;
        return caches.open(CACHE_NAME);
      })
      .catch(() => caches.open(CACHE_NAME))
      .then((cache) => {
        // Cache per-item, jadi satu file 404 tidak menggagalkan seluruh batch.
        return Promise.all(
          ASSETS_TO_CACHE.map((u) =>
            fetch(u, { cache: "reload" })
              .then((r) => {
                if (r && r.ok) return cache.put(u, r);
                console.warn("Precache gagal (offline?): " + u);
              })
              .catch(() => console.warn("Precache gagal: " + u))
          )
        );
      })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  if (self.location.hostname === "localhost" || self.location.protocol === "tauri:" || self.location.protocol === "capacitor:") {
    e.waitUntil(
      caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .then(() => self.registration.unregister())
    );
    return;
  }
  e.waitUntil(
    caches.keys().then((keys) => {
      if (!AMAN_UNTUK_HAPUS) return;
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (self.location.hostname === "localhost" || self.location.protocol === "tauri:" || self.location.protocol === "capacitor:") {
    return;
  }
  // URL ber-query (?nc= manifest / ?v= CSS) = penanda cache-buster dari
  // index.html. Selalu ambil dari jaringan (jangan dibaca/ditulis cache),
  // supaya versi baru CSS selalu segar walau cache-first ini menyimpan
  // file lama tanpa query.
  try {
    const q = new URL(e.request.url).searchParams;
    if (q.has("nc") || q.has("v")) {
      e.respondWith(fetch(e.request));
      return;
    }
  } catch (err) {}
  // NAVIGASI (buka/refresh halaman HTML): network-first. Kalau online, index.html
  // terbaru selalu dipakai (jadi perubahan CSS/JS langsung kelihatan setelah
  // sekali refresh, tidak menunggu service worker berganti). Kalau offline,
  // baru pakai salinan di cache.
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((r) => {
          if (r && r.ok) {
            const salinan = r.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, salinan));
          }
          return r;
        })
        .catch(() => caches.open(CACHE_NAME).then((cache) => cache.match(e.request)))
    );
    return;
  }
  // Aset lain: cache-first.
  // Hanya boleh baca dari cache versi ini, supaya tidak pernah warehouse
  // file basi dari cache lama yang belum terhapus.
  e.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(e.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(e.request)
          .then((networkResponse) => {
            if (
              !networkResponse ||
              networkResponse.status !== 200 ||
              networkResponse.type !== "basic"
            ) {
              return networkResponse;
            }
            cache.put(e.request, networkResponse.clone());
            return networkResponse;
          })
          .catch(() => new Response("Offline", { status: 503 }));
      })
    )
  );
});
