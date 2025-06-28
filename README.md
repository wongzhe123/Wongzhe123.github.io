# 🛠️ Aplikasi Katalog Produk Wongzhe123

**Wongzhe123** adalah katalog produk ringan berbasis web untuk menampilkan daftar alat-alat seperti gerinda, dinamo, dan perlengkapan lainnya. Cocok untuk jualan online via **TikTok Shop**, **WhatsApp**, atau toko fisik.

## 📦 Fitur Utama

- ✅ Kategori produk: Gerinda, Dinamo, Alat, dan Lainnya
- ✅ Gambar produk (bisa banyak)
- ✅ Popup detail dengan tombol:
  - 🛒 Cek Harga (buka tautan)
  - 📤 Bagikan ke WhatsApp
- ✅ Navigasi antar produk (scroll, klik panah, swipe)
- ✅ Log kunjungan otomatis ke Google Sheet
- ✅ Audio klik dan promo
- ✅ Bisa di-install sebagai aplikasi (PWA)
- ✅ Tampilan ringan dan cepat

## 🔧 Cara Pakai

1. Edit file `data.json` untuk mengisi daftar produk:
   ```json
   {
     "gerinda": [
       {
         "judul": "Gerinda Mini 3 Inchi",
         "url": "https://tokomu.com/gerinda-mini",
         "gambar": ["g1.jpg", "g2.jpg"]
       },
       ...
     ],
     "dinamo": [...],
     ...
   }