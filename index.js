// Buat ID unik
let userId = localStorage.getItem('userId');
if (!userId) {
  userId = 'UID-' + Math.random().toString(36).substring(2, 12);
  localStorage.setItem('userId', userId);
}

// Pastikan userId sudah tersedia sebelum log kunjungan
setTimeout(() => {
  kirimLog('Z'); // Z = kode khusus untuk kunjungan awal
}, 300);


// Mapping kategori ke huruf
const kategoriKode = {
  gerinda: 'A',
  dinamo: 'B',
  alat: 'C',
  lain: 'D'
};

// Tampilkan kategori aktif
function tampilKategori(id) {
  document.querySelectorAll('.kategori').forEach(k => k.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  const klikSound = document.getElementById('klikAudio');
  if (klikSound) {
    klikSound.currentTime = 0;
    klikSound.play();
  }

  const kode = kategoriKode[id];
  if (kode) kirimLog(kode);
}

// Ambil data dan tampilkan produk
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    Object.keys(data).forEach(kategori => {
      const target = document.querySelector(`#${kategori} ol`);
      if (!target) return;

      // Reset nomor lokal per kategori
      data[kategori].forEach((produk, i) => {
        const item = document.createElement('li');
        const wrapper = document.createElement('div');
        wrapper.className = 'produk-wrapper';

        // Link
        const link = document.createElement('a');
        link.href = produk.url;
        link.target = '_blank';
        link.className = 'judul-produk';
        link.textContent = produk.judul;

        // Log klik link
        link.addEventListener('click', () => {
          const kode = kategoriKode[kategori];
          kirimLog(kode, i + 1);
        });

        
        // Tentukan gambar berdasarkan array atau otomatis dari folder
let gambarList = [];

if (Array.isArray(produk.gambar) && produk.gambar.length > 0) {
  gambarList = produk.gambar.map(nama => `images/${kategori}/${nama}`);
} else {
  const nomor = i + 1;
  const namaGambar = `${kategori}${nomor}.png`;
  gambarList = [`images/${kategori}/${namaGambar}`];
}

        const img = document.createElement('img');
img.className = 'thumb-produk';
img.src = gambarList[0];
img.alt = produk.judul;

// Tangani error gambar gagal dimuat
img.onerror = () => {
  img.onerror = null;
  img.src = 'gbS.png';
  gambarList = ['gbS.png'];
};

img.addEventListener('click', () => bukaPopup(gambarList));


        

        wrapper.appendChild(link);
        wrapper.appendChild(img);
        item.appendChild(wrapper);
        target.appendChild(item);
      });
    });
  });

// Fungsi log klik ke Google Sheet
function kirimLog(kodeKategori, nomor = null) {
  const url = `https://script.google.com/macros/s/AKfycbyr2e58IffNgMv1KtMlbg3mMqKL7d7dhved7pWSZg7m-e0Wx1f2B0Ymx-SBbZGnW2c1/exec?id=${userId}&cat=${kodeKategori}${nomor ? `&item=${nomor}` : ''}`;
  fetch(url).catch(console.error);
}

// Pointer telunjuk
const pointer = document.getElementById('pointer');
const kategoriLinks = document.querySelectorAll('nav a');
let currentIndex = 0;
function gerakkanPointer() {
  const target = kategoriLinks[currentIndex];
  const rect = target.getBoundingClientRect();
  pointer.style.left = `${rect.left + window.scrollX}px`;
  pointer.style.top = `${rect.top + window.scrollY - 30}px`;
  currentIndex = (currentIndex + 1) % kategoriLinks.length;
}
setInterval(gerakkanPointer, 1500);
gerakkanPointer();

// Audio promo
function putarPromo() {
  const audio = document.getElementById('promoAudio');
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

// Ambil jumlah pengunjung saja (tanpa mencatat kunjungan baru)
fetch('https://script.google.com/macros/s/AKfycbyr2e58IffNgMv1KtMlbg3mMqKL7d7dhved7pWSZg7m-e0Wx1f2B0Ymx-SBbZGnW2c1/exec?stat=1')
  .then(res => res.json())
  .then(data => {
    document.getElementById('pageviews').textContent = data.jumlah?.toLocaleString('id-ID') || 'Tercatat!';
  })
  .catch(() => {
    document.getElementById('pageviews').textContent = 'Gagal memuat';
  });

// === Popup Gambar ===
// === Popup Gambar ===
const popup = document.createElement('div');
popup.id = 'popupGambar';
popup.innerHTML = `
  <div class="navigasi-gambar">
    <span id="prevGambar">←</span>
    <span id="nextGambar">→</span>
  </div>
  <button class="tutup-popup" onclick="tutupPopup()">← Kembali</button>
  <img id="gambarPopup" src="" alt="Gambar Produk">
`;
document.body.appendChild(popup);

let semuaGambar = [];
let indeksGambar = 0;

function bukaPopup(gambarList) {
  semuaGambar = gambarList;
  indeksGambar = 0;
  tampilkanGambar();
  popup.style.display = 'flex';
  
  // Tambahkan logika klik luar gambar
  popup.addEventListener('click', function(e) {
    if (e.target === popup) tutupPopup();
  });
}

function tampilkanGambar() {
  const gambarEl = document.getElementById('gambarPopup');
  if (gambarEl && semuaGambar.length > 0) {
    gambarEl.src = semuaGambar[indeksGambar];
  }
}

function tutupPopup() {
  popup.style.display = 'none';
}

document.getElementById('prevGambar').onclick = () => {
  indeksGambar = (indeksGambar - 1 + semuaGambar.length) % semuaGambar.length;
  tampilkanGambar();
};

document.getElementById('nextGambar').onclick = () => {
  indeksGambar = (indeksGambar + 1) % semuaGambar.length;
  tampilkanGambar();
};