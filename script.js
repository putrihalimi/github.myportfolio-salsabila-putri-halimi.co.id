// Tambahkan di baris paling atas script
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('admin') === 'true') {
    localStorage.setItem('is_owner', 'true');
    console.log("Mode Admin Aktif: Aktivitas Anda tidak akan dilacak.");
}

// --- Fungsi Waktu & Lokasi ---
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  // Kamu bisa mengganti 'Bogor, Indonesia' secara manual atau dinamis
  const location = "Bogor, Indonesia";
  const formattedDate = now.toLocaleDateString("id-ID", options);

  document.getElementById("date-time").textContent = `${location} | ${formattedDate}`;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// Tambahkan fungsi ini di script.js
function loadWeather() {
  const tempDisplay = document.getElementById('weather-temp');
  const iconDisplay = document.getElementById('weather-icon');

  // Koordinat Bogor (Sesuai lokasi Anda)
  const lat = -6.5944;
  const lon = 106.7892;

  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
    .then(res => res.json())
    .then(data => {
      const temp = Math.round(data.current_weather.temperature);
      tempDisplay.innerText = `${temp}°C Bogor`;
      
      // Logika sederhana ganti ikon berdasarkan suhu
      if (temp > 30) iconDisplay.innerText = "☀️";
      else if (temp < 25) iconDisplay.innerText = "🌧️";
      else iconDisplay.innerText = "⛅";
    })
    .catch(err => {
      tempDisplay.innerText = "Cuaca tidak tersedia";
    });
}

// Panggil fungsi saat halaman dimuat
loadWeather();

// --- Fungsi Dark Mode ---
const toggleBtn = document.getElementById("dark-mode-toggle");
const body = document.body;
const icon = toggleBtn.querySelector(".mode-icon");

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  // Ganti ikon saat klik
  if (body.classList.contains("dark-mode")) {
    icon.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    icon.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
});

// Cek preferensi user saat reload
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  icon.textContent = "☀️";
}

const searchInput = document.getElementById('project-search');
const cards = document.querySelectorAll('.portfolio-grid .card');
const categoryButtons = document.querySelectorAll('.category-btn');
let activeCategory = 'all';

// Semua proyek yang sudah ada masuk kategori Data Analyst.
function getCardCategory(card) {
  return 'data-analyst';
}

// Menentukan kategori setiap kartu proyek.
cards.forEach((card) => {
  // Jika kartu memiliki kategori khusus, gunakan kategori tersebut.
  // Jika tidak, otomatis masuk Data Analyst.
  card.dataset.category = card.dataset.category || getCardCategory(card);
});

// Menampilkan proyek berdasarkan kategori yang dipilih.
function applyPortfolioFilters() {
  const searchTerm = searchInput?.value.trim().toLowerCase() || '';

  cards.forEach((card) => {
    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const tech = card.querySelector('.tech')?.textContent.toLowerCase() || '';
    const category = card.dataset.category;

    const matchesCategory =
      activeCategory === 'all' || category === activeCategory;

    const matchesSearch =
      !searchTerm || title.includes(searchTerm) || tech.includes(searchTerm);

    card.style.display = matchesCategory && matchesSearch ? 'flex' : 'none';
  });
}

// Mengaktifkan tombol kategori.
categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.category;

    categoryButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    applyPortfolioFilters();
  });
});

// Kolom pencarian hanya dipakai jika tersedia di HTML.
if (searchInput) {
  searchInput.addEventListener('input', applyPortfolioFilters);
}

// Menampilkan semua proyek saat halaman dibuka.
applyPortfolioFilters();

// Tombol Review & Download CV.
const downloadBtn = document.getElementById('download-cv');

if (downloadBtn) {
  downloadBtn.addEventListener('click', function() {
    if (localStorage.getItem('is_owner') !== 'true') {
      gtag('event', 'generate_lead', {
        event_category: 'Engagement',
        event_label: 'Download CV PDF',
        file_name: 'File_CV_Salsabila.pdf',
        value: 1.0
      });

      console.log('Insight: Seseorang baru saja mendownload CV Anda!');
    }
  });
}

// Jalankan saat halaman dibuka
loadVisits();

// --- Jumlah Views ---
function loadVisits() {
  const visitsDisplay = document.getElementById('visits');
  if (!visitsDisplay) return;

  fetch('https://api.counterapi.dev/v1/salsabila-ph-portfolio/views/up')
    .then(res => res.json())
    .then(data => {
      visitsDisplay.innerText = data.count || "0";
    })
    .catch(() => {
      visitsDisplay.innerText = "-";
    });
}
loadVisits();

// --- CV Viewer ---

const cvOptions = document.querySelectorAll(".cv-option");
const cvFrame = document.getElementById("cv-frame");

cvOptions.forEach((option) => {
  option.addEventListener("click", function () {

    const cvUrl = this.getAttribute("data-cv");

    // Ganti CV di viewer
    if (cvFrame && cvUrl) {
      cvFrame.src = cvUrl;
    }

    // Update tombol aktif
    cvOptions.forEach((item) => {
      item.classList.remove("active");
    });

    this.classList.add("active");
  });
});