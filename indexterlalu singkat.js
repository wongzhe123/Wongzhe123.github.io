// Simpan semua produk dari semua kategori
let semuaProdukSemuaKategori = {};
let kategoriAktif = '';

// Buat ID unik untuk user
let userId = localStorage.getItem('userId');
if (!userId) {
  userId = 'UID-' + Math.random().toString(36).substring(2, 12);
  localStorage.setItem('userId', userId);
}

// Log kunjungan awal
setTimeout(() => kirimLog('Z'), 300);

// Mapping kategori ke kode huruf
const kategoriKode = {
  gerinda: 'A',
  dinamo: 'B',
  alat: 'C',
  lain: 'D'
};

// Tampilkan kategori aktif
function tampilKategori(id) {
  document.querySelectorAll('.kategori').forEach(k => k.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  kategoriAktif = id;
  localStorage.setItem('kategoriAktif', id);
  const klikSound = document.getElementById('klikAudio');
  if (klikSound) {
    klikSound.currentTime = 0;
    klikSound.play();
  }
  const kode = kategoriKode[id];
  if (kode) kirimLog(kode);
}

// Fungsi kirim log ke Google Sheets
function kirimLog(kodeKategori, nomor = null) {
  const url = `https://script.google.com/macros/s/AKfycbyr2e58IffNgMv1KtMlbg3mMqKL7d7dhved7pWSZg7m-e0Wx1f2B0Ymx-SBbZGnW2c1/exec?id=${userId}&cat=${kodeKategori}${nomor ? `&item=${nomor}` : ''}`;
  fetch(url).catch(console.error);
}

// Gerakkan pointer telunjuk
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
    audio.play().catch(err => console.warn('Gagal putar audio:', err.message));
  }
}

// Jumlah pengunjung
fetch('https://script.google.com/macros/s/AKfycbyr2e58IffNgMv1KtMlbg3mMqKL7d7dhved7pWSZg7m-e0Wx1f2B0Ymx-SBbZGnW2c1/exec?stat=1')
  .then(res => res.json())
  .then(data => {
    document.getElementById('pageviews').textContent = data.jumlah?.toLocaleString('id-ID') || 'Tercatat!';
  })
  .catch(() => {
    document.getElementById('pageviews').textContent = 'Gagal memuat';
  });

// === POPUP ===
const popup = document.createElement('div');
popup.id = 'popupGambar';
popup.innerHTML = `
  <div class="popup-toolbar">
    <button id="popupBack">← Kembali</button>
    <button id="popupShare">📤 Bagikan</button>
  </div>
  <div class="popup-content">
    <img id="gambarPopup" src="" alt="Gambar Produk">
    <div class="popup-arrows-horizontal">
      <button class="arrow-horiz arrow-left">❮</button>
      <button class="arrow-horiz arrow-right">❯</button>
    </div>
    <div id="popupInfo"></div>
    <div class="popup-footer">
      <button id="popupBuy">🛒 Cek Harga</button>
    </div>
  </div>
  <button class="arrow-vert arrow-up">▲</button>
  <button class="arrow-vert arrow-down">▼</button>
`;
document.body.appendChild(popup);

// Navigasi popup
let semuaProduk = [], semuaGambar = [], indeksGambar = 0, indeksProduk = 0;
let currentJudul = '', currentUrl = '', currentNomor = '';

function bukaPopup(i) {
  semuaProduk = semuaProdukSemuaKategori[kategoriAktif] || [];
  if (!semuaProduk[i]) return;
  indeksProduk = i;
  const produk = semuaProduk[i];
  semuaGambar = Array.isArray(produk.gambar) && produk.gambar.length > 0 ?
    produk.gambar.map(nama => `images/${kategoriAktif}/${nama}`) :
    [`images/${kategoriAktif}/${kategoriAktif}${i + 1}.png`];
  indeksGambar = 0;
  currentJudul = produk.judul;
  currentUrl = produk.url;
  currentNomor = i + 1;

  const gambarPopup = document.getElementById('gambarPopup');
  gambarPopup.onerror = () => gambarPopup.src = 'gbS.png';
  gambarPopup.src = semuaGambar[0];

  document.querySelector('.arrow-left').style.display = semuaGambar.length > 1 ? 'block' : 'none';
  document.querySelector('.arrow-right').style.display = semuaGambar.length > 1 ? 'block' : 'none';
  document.getElementById('popupInfo').textContent = `${currentNomor}. ${currentJudul}`;
  popup.style.display = 'flex';
}

document.getElementById('popupBack').onclick = () => popup.style.display = 'none';
document.getElementById('popupBuy').onclick = () => window.open(currentUrl, '_blank');
document.getElementById('popupShare').onclick = () => {
  const url = `${location.origin}/#${kategoriAktif}-${currentNomor}`;
  const pesan = `🔍Cek Rekomendasi Alat Alat Wongzhe123!\n\n🛍️ ${currentJudul}\n🔗 ${url}\n\n✅ Bisa langsung checkout via TikTok Shop!`;
  window.open(`https://wa.me/?text=${encodeURIComponent(pesan)}`, '_blank');
};

popup.querySelector('.arrow-up').onclick = e => { e.stopPropagation(); if (indeksProduk > 0) bukaPopup(indeksProduk - 1); };
popup.querySelector('.arrow-down').onclick = e => { e.stopPropagation(); if (indeksProduk < semuaProduk.length - 1) bukaPopup(indeksProduk + 1); };
popup.querySelector('.arrow-left').onclick = e => { e.stopPropagation(); if (indeksGambar > 0) document.getElementById('gambarPopup').src = semuaGambar[--indeksGambar]; };
popup.querySelector('.arrow-right').onclick = e => { e.stopPropagation(); if (indeksGambar < semuaGambar.length - 1) document.getElementById('gambarPopup').src = semuaGambar[++indeksGambar]; };
popup.addEventListener('click', e => { if (e.target === popup) popup.style.display = 'none'; });
popup.addEventListener('wheel', navigasiProdukDenganScroll, { passive: false });
function navigasiProdukDenganScroll(e) {
  e.preventDefault();
  if (e.deltaY > 0 && indeksProduk < semuaProduk.length - 1) bukaPopup(indeksProduk + 1);
  if (e.deltaY < 0 && indeksProduk > 0) bukaPopup(indeksProduk - 1);
}

let touchStartY = 0;
popup.addEventListener('touchstart', e => touchStartY = e.touches[0].clientY);
popup.addEventListener('touchend', e => {
  const deltaY = e.changedTouches[0].clientY - touchStartY;
  if (deltaY < -30 && indeksProduk < semuaProduk.length - 1) bukaPopup(indeksProduk + 1);
  if (deltaY > 30 && indeksProduk > 0) bukaPopup(indeksProduk - 1);
});

// Hash handling on load
window.addEventListener('load', () => {
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      Object.entries(data).forEach(([kategori, produkList]) => {
        semuaProdukSemuaKategori[kategori] = produkList;
        const target = document.querySelector(`#${kategori} ol`);
        if (!target) return;

        produkList.forEach((produk, i) => {
          const item = document.createElement('li');
          const wrapper = document.createElement('div');
          wrapper.className = 'produk-wrapper';

          const link = document.createElement('a');
          link.href = produk.url;
          link.target = '_blank';
          link.className = 'judul-produk';
          link.textContent = produk.judul;
          link.onclick = () => kirimLog(kategoriKode[kategori], i + 1);

          let gambarList = Array.isArray(produk.gambar) && produk.gambar.length > 0 ?
            produk.gambar.map(nama => `images/${kategori}/${nama}`) :
            [`images/${kategori}/${kategori}${i + 1}.png`];

          const img = document.createElement('img');
          img.loading = 'lazy';
          img.className = 'thumb-produk';
          img.src = gambarList[0];
          img.alt = produk.judul;
          img.onerror = () => img.src = 'gbS.png';
          img.onclick = () => bukaPopup(i);

          wrapper.appendChild(link);
          wrapper.appendChild(img);
          item.appendChild(wrapper);
          target.appendChild(item);
        });
      });

      const hash = location.hash.slice(1);
      if (hash.includes('-')) {
        const [kategori, nomorStr] = hash.split('-');
        const nomor = parseInt(nomorStr);
        if (kategori in semuaProdukSemuaKategori && nomor > 0) {
          tampilKategori(kategori);
          setTimeout(() => bukaPopup(nomor - 1), 300);
          return;
        }
      }
      tampilKategori(localStorage.getItem('kategoriAktif') || 'gerinda');
    });
});

// Install prompt
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installLink = document.getElementById('installLink');
  if (installLink) {
    installLink.style.display = 'inline-block';
    installLink.addEventListener('click', () => {
      alert("Klik OK untuk install aplikasi super ringan.");
      deferredPrompt.prompt();
    });
  }
});
