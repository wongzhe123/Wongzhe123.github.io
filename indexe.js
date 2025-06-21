// Buat ID unik dan simpan di localStorage
let userId = localStorage.getItem('userId');
if (!userId) {
  userId = 'UID-' + Math.random().toString(36).substring(2, 12);
  localStorage.setItem('userId', userId);
}

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
  
  // Mainkan suara klik
  const klikSound = document.getElementById('klikAudio');
  if (klikSound) {
    klikSound.currentTime = 0;
    klikSound.play();
  }
  
  // Kirim log kategori
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
          const link = document.createElement('a');
          link.href = produk.url;
          link.target = "_blank";
          link.textContent = `${i + 1}. ${produk.judul}`;
          
          // Tambahkan pencatatan klik produk
          link.addEventListener('click', () => {
            const kode = kategoriKode[kategori];
            kirimLog(kode, i + 1);
          });
          
          item.appendChild(link);
          target.appendChild(item);
        });
      }
    });
  });

// Fungsi untuk mencatat ke Google Sheet
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

// Hitung kunjungan dari Google Apps Script
fetch('https://script.google.com/macros/s/AKfycby4Hr3YlYJC_AKI1NmoD3W94svCORIECkG0SxCfL9PX6DAWNBN-QdyPY1vSHD_bJhTD/exec')
  .then(res => res.json())
  .then(data => {
    document.getElementById('pageviews').textContent =
      data.jumlah ? data.jumlah.toLocaleString('id-ID') : 'Tercatat!';
  })
  .catch(() => {
    document.getElementById('pageviews').textContent = 'Gagal memuat';
  });