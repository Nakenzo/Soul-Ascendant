const tekstur = {};

function muatGambar(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let selesai = false;
    img.onload = () => {
      if (!selesai) { selesai = true; resolve(img); }
    };
    img.onerror = () => {
      if (!selesai) { selesai = true; reject(new Error("Gagal memuat: " + src)); }
    };
    img.src = src;
    setTimeout(() => {
      if (!selesai) {
        selesai = true;
        resolve(img);
      }
    }, 2500);
  });
}

function ukuranSprite(img, targetLebar) {
  const wPng = img && img.width > 0 ? img.width : 1;
  const hPng = img && img.height > 0 ? img.height : 1;
  const rasio = hPng / wPng;
  const lebar = targetLebar;
  const tinggi = Math.round(targetLebar * rasio);
  return { lebar, tinggi };
}
