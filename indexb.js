// Buat ID unik dan simpan di localStorage
let userId = localStorage.getItem('userId');
if (!userId) {
  userId = 'UID-' + Math.random().toString(36).substring(2, 12);
  localStorage.setItem('userId', userId);
}

// Catat kunjungan awal (hanya ID) ke Google Sheet
fetch(`https://script.google.com/macros/s/AKfycby4Hr3YlYJC_AKI1NmoD3W94svCORIECkG0SxCfL9PX6DAWNBN-QdyPY1vSHD_bJhTD/exec?id=${userId}`)
  .catch(console.error);

// Mapping kategori ke huruf
const kategoriKode = {
  gerinda: 'A',
  dinamo: 'B',
  alat: 'C',
  lain: 'D'
};

// Fungsi ganti kategori aktif
function tampilKategori(id) {
  const semuaKategori = document.querySelectorAll('.kategori');
  semuaKategori.forEach(k => k.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  const klikSound = document.getElementById('klikAudio');
  if (klikSound) {
    klikSound.currentTime = 0;
    klikSound.play();
  }

  const kode = kategoriKode[id];
  if (kode) kirimLog(kode);
}

// Ambil data dari data.json dan render ke halaman
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    Object.keys(data).forEach(kategori => {
      const target = document.querySelector(`#${kategori} ol`);
      if (target) {
        data[kategori].forEach((produk, i) => {
          const item = document.createElement('li');

          const wrapper = document.createElement('div');
          wrapper.className = 'produk-wrapper';

          const link = document.createElement('a');
          link.href = produk.url;
          link.target = "_blank";
          link.textContent = `${i + 1}. ${produk.judul}`;
          link.className = 'judul-produk';

          // Tangani klik link
          link.addEventListener('click', () => {
            const kode = kategoriKode[kategori];
            kirimLog(kode, i + 1);
          });

          // Cek gambar
          let gambarArray = Array.isArray(produk.gambar) && produk.gambar.length > 0 ?
            produk.gambar :
            ['gbS.png'];

          const img = document.createElement('img');
          img.className = 'thumb-produk';
          img.src = gambarArray[0];
          img.alt = produk.judul;
          img.addEventListener('click', () => bukaPopup(gambarArray));

          wrapper.appendChild(link);
          wrapper.appendChild(img);
          item.appendChild(wrapper);
          target.appendChild(item);
        });
      }
    });
  });

// Fungsi mencatat klik ke Google Sheet
function kirimLog(kodeKategori, nomor = null) {
  const url = `https://script.google.com/macros/s/AKfycby4Hr3YlYJC_AKI1NmoD3W94svCORIECkG0SxCfL9PX6DAWNBN-QdyPY1vSHD_bJhTD/exec` +
    `?id=${userId}&cat=${kodeKategori}${nomor ? `&item=${nomor}` : ''}`;
  fetch(url).catch(console.error);
}

// Animasi pointer telunjuk
const pointer = document.getElementById('pointer');
const kategoriLinks = document.querySelectorAll('nav a');
let currentIndex = 0;

function gerakkanPointer() {
  const target = kategoriLinks[currentIndex];
  const rect = target.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  pointer.style.left = `${rect.left + scrollLeft}px`;
  pointer.style.top = `${rect.top + scrollTop - 30}px`;
  currentIndex = (currentIndex + 1) % kategoriLinks.length;
}
setInterval(gerakkanPointer, 1500);
gerakkanPointer();

// Suara promo
function putarPromo() {
  const audio = document.getElementById('promoAudio');
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

// Hitung kunjungan dari Google Sheet
fetch('https://script.google.com/macros/s/AKfycby4Hr3YlYJC_AKI1NmoD3W94svCORIECkG0SxCfL9PX6DAWNBN-QdyPY1vSHD_bJhTD/exec')
  .then(res => res.json())
  .then(data => {
    document.getElementById('pageviews').textContent =
      data.jumlah ? data.jumlah.toLocaleString('id-ID') : 'Tercatat!';
  })
  .catch(() => {
    document.getElementById('pageviews').textContent = 'Gagal memuat';
  });

// === Popup Gambar ===
const popup = document.createElement('div');
popup.id = 'popupGambar';
popup.innerHTML = `
  <div class="navigasi-gambar">
    <span id="prevGambar">←</span>
    <span id="nextGambar">→</span>
  </div>
  <span class="tutup-popup" onclick="tutupPopup()">×</span>
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

// Navigasi gambar
popup.querySelector('#prevGambar').onclick = () => {
  indeksGambar = (indeksGambar - 1 + semuaGambar.length) % semuaGambar.length;
  tampilkanGambar();
};
popup.querySelector('#nextGambar').onclick = () => {
  indeksGambar = (indeksGambar + 1) % semuaGambar.length;
  tampilkanGambar();
};