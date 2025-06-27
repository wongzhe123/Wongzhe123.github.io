let semuaProdukSemuaKategori = {}; // ⬅️ simpan semua data di sini
let kategoriAktif = '';

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
  
  kategoriAktif = id; // ✅ Tambahkan baris ini
  
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

      semuaProdukSemuaKategori[kategori] = data[kategori]; // ✅ benar

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
  gambarList = [`images/${kategori}/${kategori}${i + 1}.png`];
}

const img = document.createElement('img');
img.loading = 'lazy' //gmbr di muat saat mendekati layar
img.className = 'thumb-produk';
img.src = gambarList[0];
img.alt = produk.judul;



        // Tangani error gambar gagal dimuat
        img.onerror = () => {
          img.onerror = null;
          img.src = 'gbS.png';
          gambarList = ['gbS.png'];
        };

        img.addEventListener('click', () => 
        
        bukaPopup(i));

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
    audio.play().catch(err => {
      console.warn('Gagal putar audio:', err.message);
    });
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
// Buat elemen popup
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

  <!-- Panah scroll vertikal di area hitam luar -->
  <button class="arrow-vert arrow-up">▲</button>
  <button class="arrow-vert arrow-down">▼</button>
`;
document.body.appendChild(popup);


// Event listener tombol panah atas
popup.querySelector('.arrow-up').addEventListener('click', (e) => {
  e.stopPropagation(); // mencegah menutup popup saat tombol diklik
  if (indeksProduk > 0) {
    bukaPopup(indeksProduk - 1);
  }
});

// Event listener tombol panah bawah
popup.querySelector('.arrow-down').addEventListener('click', (e) => {
  e.stopPropagation(); // mencegah menutup popup saat tombol diklik
  if (indeksProduk < semuaProduk.length - 1) {
    bukaPopup(indeksProduk + 1);
  }
});


// Tombol gambar sebelumnya
popup.querySelector('.arrow-left').addEventListener('click', (e) => {
  e.stopPropagation();
  if (semuaGambar.length > 1 && indeksGambar > 0) {
    indeksGambar--;
    document.getElementById('gambarPopup').src = semuaGambar[indeksGambar];
  }
});

// Tombol gambar selanjutnya
popup.querySelector('.arrow-right').addEventListener('click', (e) => {
  e.stopPropagation();
  if (semuaGambar.length > 1 && indeksGambar < semuaGambar.length - 1) {
    indeksGambar++;
    document.getElementById('gambarPopup').src = semuaGambar[indeksGambar];
  }
});
// Setelah popup ditambahkan ke DOM, pasang event listener
function navigasiProdukDenganScroll(e) {
  e.preventDefault();
  if (e.deltaY > 0) {
    if (indeksProduk < semuaProduk.length - 1) bukaPopup(indeksProduk + 1);
  } else {
    if (indeksProduk > 0) bukaPopup(indeksProduk - 1);
  }
}

// Pasang setelah elemen pasti ada
popup.addEventListener('wheel', navigasiProdukDenganScroll, { passive: false });
popup.querySelector('.popup-content').addEventListener('wheel', navigasiProdukDenganScroll);
popup.querySelector('#gambarPopup').addEventListener('wheel', navigasiProdukDenganScroll);



let touchStartY = 0;

popup.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
});

popup.addEventListener('touchend', (e) => {
  const deltaY = e.changedTouches[0].clientY - touchStartY;
  if (deltaY < -30) {
    if (indeksProduk < semuaProduk.length - 1) bukaPopup(indeksProduk + 1);
  } else if (deltaY > 30) {
    if (indeksProduk > 0) bukaPopup(indeksProduk - 1);
  }
});

let semuaGambar = [];
let semuaProduk = [];
let indeksGambar = 0;
let indeksProduk = 0;
let currentJudul = '';
let currentUrl = '';
let currentNomor = '';

function bukaPopup(i) {
  semuaProduk = semuaProdukSemuaKategori[kategoriAktif];
  if (!semuaProduk || !semuaProduk[i]) {
    console.warn('Produk tidak ditemukan di kategori:', kategoriAktif);
    return;
  }
  
  indeksProduk = i;
  const produk = semuaProduk[indeksProduk];
  
  semuaGambar = Array.isArray(produk.gambar) && produk.gambar.length > 0 ?
    produk.gambar.map(nama => `images/${kategoriAktif}/${nama}`) :
    [`images/${kategoriAktif}/${kategoriAktif}${indeksProduk + 1}.png`];
  
  indeksGambar = 0;
  currentJudul = produk.judul;
  currentUrl = produk.url;
  currentNomor = indeksProduk + 1;
  
  const gambarPopup = document.getElementById('gambarPopup');
gambarPopup.onerror = () => {
  gambarPopup.src = 'gbS.png';
};
gambarPopup.src = semuaGambar[0];

// Sembunyikan tombol panah jika hanya satu gambar
const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');

if (semuaGambar.length > 1) {
  arrowLeft.style.display = 'block';
  arrowRight.style.display = 'block';
} else {
  arrowLeft.style.display = 'none';
  arrowRight.style.display = 'none';
}  
  
  document.getElementById('popupInfo').textContent = `${currentNomor}. ${currentJudul}`;
  document.getElementById('popupGambar').style.display = 'flex';
}

// Tombol popup
document.getElementById('popupBack').onclick = () => {
  document.getElementById('popupGambar').style.display = 'none';
};



window.addEventListener('load', () => {
  const hash = location.hash.slice(1); // hapus tanda #
  if (!hash.includes('-')) return;
  
  const [kategori, nomorStr] = hash.split('-');
  const nomor = parseInt(nomorStr);
  
  if (kategori in semuaProdukSemuaKategori && nomor > 0) {
    tampilKategori(kategori); // pastikan kategori aktif dulu
    
    setTimeout(() => {
      bukaPopup(nomor - 1); // tampilkan popup berdasarkan nomor
      kirimLog(kategoriKode[kategori], nomor);
    }, 300); // beri jeda supaya kategori tampil dulu
  }
});


document.getElementById('popupBuy').onclick = () => {
  window.open(currentUrl, '_blank');
};




document.getElementById('popupShare').onclick = () => {
  const url = `${location.origin}/#${kategoriAktif}-${currentNomor}`;
  const pesan = `🔍Cek Rekomendasi Alat Alat Wongzhe123!

🛍️ ${currentJudul}
🔗 ${url}

✅ Bisa langsung checkout via TikTok Shop!`;
  
  const waLink = `https://wa.me/?text=${encodeURIComponent(pesan)}`;
  window.open(waLink, '_blank');
};

// Tambahkan baris ini di paling akhir index.js
tampilKategori('gerinda');


// Tutup popup saat klik di luar konten
popup.addEventListener('click', (e) => {
  if (e.target === popup) {
    popup.style.display = 'none';
  }
});


// === SERVICE WORKER DAN INSTALL PWA ===
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