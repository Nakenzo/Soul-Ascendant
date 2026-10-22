# ATURAN PENGEMBANGAN GAME BLJR

Aturan ini wajib dipatuhi di setiap sesi pengerjaan proyek Soul Ascendant (folder `bljr`):

1. **Dilarang Menulis Blok Komen (`/* ... */`) di Semua File**
   - Tidak boleh menulis blok komentar sama sekali di semua file proyek (JavaScript, CSS, HTML, dll.) agar file ringan dan game berjalan maksimal.
   - Pada file CSS (`style.css`), dilarang juga menggunakan `//` karena merusak parsing selector di browser engine murni. File CSS harus 100% bebas dari semua jenis komentar.

2. **Izin Penuh Mengedit File dan Folder**
   - Agen diizinkan mengedit, memodifikasi, dan membuat file atau folder di dalam workspace `bljr` secara langsung dan mandiri tanpa perlu menanyakan konfirmasi izin lagi kepada pengguna.

3. **Hapus Tuntas Sampai ke Akar-akarnya Saat Fitur Dibatalkan**
   - Jika pengguna meminta suatu fitur/hal baru lalu berubah pikiran dan meminta hal tersebut dihapus, agen wajib menghapusnya secara menyeluruh sampai ke akar-akarnya:
     - Hapus semua fungsi, variabel, dan event listener terkait.
     - Hapus semua selector CSS dan keyframes terkait.
     - Hapus semua elemen HTML terkait.
     - Jangan pernah meninggalkan sisa kode mati, selector yatim piatu, atau artefak yang tidak terpakai.

4. **Ketetapan Arsitektur Opsi 1 (Pure Vanilla JS & Modul Mandiri)**
   - Game tetap menggunakan Vanilla JavaScript murni tanpa framework eksternal agar file tetap ringan dan performa berjalan maksimal 60 FPS.
   - **CSS Scoped & Terisolasi**: Setiap menu baru wajib memiliki namespace/prefix class tersendiri (contoh: `.inv-*` untuk inventory) dan menggunakan kotak full-screen yang independen agar tidak saling tabrak dengan menu lain.
   - **Fokus 1 Fitur per Langkah**: Jangan mengutak-atik file gameplay loop (`entities.js`, `draw.js`, `main.js`) jika sedang mengerjakan antarmuka/menu UI, kecuali pengguna secara eksplisit memintanya.
   - **Siklus Layar Baku**: Transisi layar harus mematuhi pola baku (`sembunyiSemua()` -> buka layar -> tutup -> `tampilkanJudul()`).

5. **Dilarang Menjalankan Git Push Sebelum Persetujuan**
   - Jangan pernah melakukan `git push` ke GitHub sampai pengguna memeriksa dan menyetujuinya.

6. **Wajib Menjaga Sinkronisasi Build (manifest.json & sw.js)**
   - Agen bertanggung jawab penuh merekayasa dan memastikan nilai `build` di `manifest.json` selalu persis sama dengan `const BUILD` di `sw.js` setiap kali melakukan pembaruan rilis/fitur, agar proses verifikasi build mobile dan GitHub Actions selalu lolos otomatis tanpa membebani pengguna.

7. **Interpretasi Instruksi "Versi APK"**
   - Jika pengguna hanya menyebutkan "versi apk" atau "apk" tanpa menspesifikasikan mobile atau PC, maka instruksi tersebut berlaku untuk **keduanya (Mobile APK & PC/Tauri)**, kecuali versi web.

8. **Cari Cara Paling Maksimal/Efisien Tanpa Setengah-Setengah & Sampaikan Apa Adanya**
   - Agen wajib mencari dan mengimplementasikan solusi yang paling maksimal, efisien, dan tuntas sampai level arsitektur inti tanpa solusi tambal sulam atau setengah-setengah.
   - Sampaikan fakta teknis apa adanya secara jujur dan transparan tanpa melebih-lebihkan atau menutupi keterbatasan sistem.

9. **Berperilaku Jujur, Realistis, & Dilarang Overclaim (Hentikan Penggunaan Kata '100%')**
   - Agen dilarang berulang kali menggunakan klaim hiperbola seperti '100% aman', '100% berhasil', '100% tanpa error', atau janji palsu sejenisnya.
   - Akui kelemahan sistem secara gamblang, paparkan risiko teknis, kemungkinan kegagalan di kondisi nyata (seperti jaringan buruk atau WebView crash), dan sampaikan fakta apa adanya secara objektif tanpa janji manis.

10. **Wajib Cek Bersih Seluruh File & Kode Terkait Setiap Kali Selesai Menangani Error**
    - Setiap kali selesai memperbaiki bug atau menangani error, agen wajib langsung melakukan verifikasi dan pembersihan menyeluruh terhadap semua file dan kode yang bersangkutan sebelum menyatakan tugas selesai:
      - **Cek Sintaks & Runtime Nyata**: Jangan hanya mengandalkan cek statis pasif (`node -c`). Wajib memeriksa potensi error runtime seperti TDZ (*Temporal Dead Zone* / pemanggilan `const`/`let` sebelum deklarasi), *scope* variabel, *export/global binding*, dan *null-pointer*.
      - **Uji Siklus Eksekusi Utuh**: Uji alur dari hulu ke hilir (misalnya transisi menu -> loop in-game -> render kanvas) untuk memastikan tidak ada error tersembunyi yang tertelan blok *catch* kosong.
      - **Pembersihan Tuntas Tanpa Sisa**: Bersihkan semua kode coba-coba, fungsi duplikat/mati, file uji sementara (*scratch files*), dan pastikan seluruh modul terkait dalam kondisi rapi, bersih, dan siap dijalankan.

11. **Persetujuan Wajib untuk Aset Audio (SFX/BGM) & Tekstur Senjata**
    - Dilarang langsung memasang, mengaitkan, atau mengimplementasikan berkas suara (SFX), musik latar (BGM), maupun tekstur visual senjata ke dalam kode permainan sebelum desain atau suaranya diperiksa dan disetujui secara eksplisit oleh pengguna.
    - Agen wajib menunjukkan contoh/rancangan terlebih dahulu dan menunggu konfirmasi, karena pengguna berhak dan mungkin ingin membuat serta menyediakan aset versi rancangannya sendiri.



