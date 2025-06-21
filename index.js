// Fungsi ganti kategori aktif

function tampilKategori(id) {
  const semuaKategori = document.querySelectorAll('.kategori');
  semuaKategori.forEach(k => k.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  
  // Mainkan suara klik
  const klikSound = document.getElementById('klikAudio');
  if (klikSound) {
    klikSound.currentTime = 0; // mulai dari awal
    klikSound.play();
  }
}


// Ambil data dari data.json dan render ke halaman
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    Object.keys(data).forEach(kategori => {
      const target = document.querySelector(`#${kategori} ol`);
      if (target) {
        data[kategori].forEach((produk) => {
          const item = document.createElement('li');
          const link = document.createElement('a');
          link.href = produk.url;
          link.target = "_blank";
          link.textContent = produk.judul; // Jangan pakai nomor manual
          item.appendChild(link);
          target.appendChild(item);
        });
      }
    });
  });

// Animasi pointer loncat-loncat antar kategori
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


//suara promo
function putarPromo() {
  const audio = document.getElementById('promoAudio');
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

// Kirim kunjungan ke Google Apps Script
fetch('https://script.google.com/macros/s/AKfycbwGED-IaC1em48ctm-2BbQ7HdTjUmF78iyhjzdEQNB2qv6Su2Jiir4967cJS65I-Y8MIA/exec')
  .then(res => res.json())
  .then(data => {
    document.getElementById('pageviews').textContent =
      data.jumlah.toLocaleString('id-ID');
  })
  .catch(() => {
    document.getElementById('pageviews').textContent = 'Gagal memuat';
  });