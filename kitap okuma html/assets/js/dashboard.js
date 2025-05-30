/**
 * BookDash - Dashboard Script
 * --------------------------
 * Bu script, dashboard sayfasının işlevlerini yönetir.
 */

// Mock veri - gerçek uygulamada API'den gelir
const dummyBooks = [
  {
    id: 1,
    title: "Suç ve Ceza",
    author: "Dostoyevski",
    startDate: "2023-01-05",
    endDate: "2023-01-17",
    genre: "Roman",
    days: 12,
    notes:
      "Klasik bir başyapıt. Karakterlerin psikolojik derinliği etkileyici.",
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    startDate: "2023-02-10",
    endDate: "2023-02-19",
    genre: "Distopya",
    days: 9,
    notes:
      "Distopik bir gelecek tasviri, günümüzde hala geçerliliğini koruyor.",
  },
  {
    id: 3,
    title: "Sefiller",
    author: "Victor Hugo",
    startDate: "2023-03-01",
    endDate: "2023-03-16",
    genre: "Klasik",
    days: 15,
    notes:
      "Uzun ama değerli bir kitap. İnsan doğasının farklı yönlerini ele alıyor.",
  },
  {
    id: 4,
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    startDate: "2023-03-20",
    endDate: "2023-03-27",
    genre: "Bilimkurgu",
    days: 7,
    notes: "Kitapların yakıldığı bir dünya düzeninin eleştirisi.",
  },
  {
    id: 5,
    title: "Hayvan Çiftliği",
    author: "George Orwell",
    startDate: "2023-04-02",
    endDate: "2023-04-08",
    genre: "Roman",
    days: 6,
    notes: "Totaliter rejimler hakkında çok iyi bir alegori.",
  },
  {
    id: 6,
    title: "Don Kişot",
    author: "Cervantes",
    startDate: "2023-04-15",
    endDate: "2023-05-01",
    genre: "Klasik",
    days: 16,
    notes: "İlk modern roman olarak kabul edilir. Hala çok etkileyici.",
  },
  {
    id: 7,
    title: "Dune",
    author: "Frank Herbert",
    startDate: "2023-05-10",
    endDate: "2023-05-20",
    genre: "Bilimkurgu",
    days: 10,
    notes: "Bilimkurgu türünün en önemli eserlerinden biri.",
  },
  {
    id: 8,
    title: "Siyah İnci",
    author: "Anna Sewell",
    startDate: "2023-05-24",
    endDate: "2023-05-28",
    genre: "Roman",
    days: 4,
    notes: "Hayvanlara karşı davranışlarımızı sorgulatan bir klasik.",
  },
  {
    id: 9,
    title: "Martin Eden",
    author: "Jack London",
    startDate: "2023-05-30",
    endDate: "2023-06-05",
    genre: "Roman",
    days: 6,
    notes: "Yazarın en kişisel romanlarından biri.",
  },
  {
    id: 10,
    title: "Altıncı Koğuş",
    author: "Anton Çehov",
    startDate: "2023-06-10",
    endDate: "2023-06-14",
    genre: "Klasik",
    days: 4,
    notes: "Kısa ama çok etkileyici bir hikaye.",
  },
];

document.addEventListener("DOMContentLoaded", function () {
  // Kullanıcı oturum kontrolü
  checkUserSession();

  // Kullanıcı adını doldur
  updateUserInfo();

  // Dashboard widget'larını doldur
  updateDashboardStats();

  // Son eklenen kitapları tabloya ekle
  populateLatestBooks();

  // Grafikleri oluştur
  initializeCharts();

  // Form olaylarını dinle
  setupEventListeners();
});

/**
 * Kullanıcı oturumunu kontrol eder
 */
function checkUserSession() {
  try {
    // Merkezi redirectIfNoSession fonksiyonunu kullan (session-helper.js'de)
    if (typeof redirectIfNoSession === "function") {
      // Ana dizinde olduğumuzu belirt (index.html şeklinde yönlendirme için)
      return redirectIfNoSession(false);
    } else {
      // Eski yöntem (yedek olarak)
      const user = JSON.parse(sessionStorage.getItem("bookdashUser"));
      if (!user || !user.isLoggedIn) {
        console.log("Oturum bulunamadı, giriş sayfasına yönlendiriliyor");

        // URL'yi kontrol et, zaten login sayfasındaysa döngüye girme
        const currentPath = window.location.pathname.toLowerCase();
        if (!currentPath.includes("index.html") && !currentPath.endsWith("/")) {
          sessionStorage.removeItem("bookdashUser");

          // Yönlendirme öncesi kısa bir gecikme ekle
          setTimeout(function () {
            window.location.replace("index.html");
          }, 100);
        }
        return false;
      }
      return true;
    }
  } catch (e) {
    console.error("Oturum kontrolü sırasında hata:", e);
    return false;
  }
}

/**
 * Kullanıcı bilgilerini günceller
 */
function updateUserInfo() {
  try {
    const user = JSON.parse(sessionStorage.getItem("bookdashUser"));
    if (user && user.isLoggedIn) {
      const userFullNameElement = document.getElementById("userFullName");
      if (userFullNameElement) {
        userFullNameElement.textContent = user.name || "İsimsiz Kullanıcı";
      } else {
        console.warn("userFullName elementi bulunamadı");
      }

      // Varsa profil resmi güncelle
      const userProfileImgElement = document.querySelector(".user-panel img");
      if (userProfileImgElement && user.profileImage) {
        userProfileImgElement.src = user.profileImage;
      }
    } else {
      console.warn("Geçerli kullanıcı bilgisi bulunamadı");
    }
  } catch (e) {
    console.error("Kullanıcı bilgileri güncellenirken hata oluştu:", e);
  }
}

/**
 * Dashboard istatistik widget'larını günceller
 */
function updateDashboardStats() {
  // Gerçek uygulamada API'den gelecek veriler
  document.getElementById("totalBooks").textContent = dummyBooks.length;

  // Ortalama okuma günü hesapla
  const totalDays = dummyBooks.reduce((sum, book) => sum + book.days, 0);
  const averageDays = Math.round(totalDays / dummyBooks.length);
  document.getElementById("averageReadingDays").textContent = averageDays;

  // Bu ayki kitap sayısı (Mayıs 2025 olarak varsayalım)
  const currentDate = new Date();
  const currentYear = 2025; // Context bilgisinden
  const currentMonth = 5; // Mayıs ayı

  const booksThisMonth = dummyBooks.filter((book) => {
    const endDate = new Date(book.endDate);
    return (
      endDate.getMonth() + 1 === currentMonth &&
      endDate.getFullYear() === currentYear
    );
  });

  document.getElementById("currentMonth").textContent = booksThisMonth.length;

  // En çok okunan tür
  const genreCounts = {};
  dummyBooks.forEach((book) => {
    if (genreCounts[book.genre]) {
      genreCounts[book.genre]++;
    } else {
      genreCounts[book.genre] = 1;
    }
  });

  let favoriteGenre = "";
  let maxCount = 0;

  for (const genre in genreCounts) {
    if (genreCounts[genre] > maxCount) {
      maxCount = genreCounts[genre];
      favoriteGenre = genre;
    }
  }

  document.getElementById("favoriteGenre").textContent = favoriteGenre;
}

/**
 * Son eklenen kitapları tabloya ekler
 */
function populateLatestBooks() {
  const tableBody = document.querySelector("#latestBooksTable tbody");
  if (!tableBody) return;

  // Tabloyu temizle
  tableBody.innerHTML = "";

  // Son 5 kitabı alın (son eklenenler olarak varsayın)
  const latestBooks = [...dummyBooks].reverse().slice(0, 5);

  // Tabloya ekle
  latestBooks.forEach((book) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${formatDate(book.endDate)}</td>
      <td>${book.days} gün</td>
      <td>${book.genre}</td>
    `;
    tableBody.appendChild(row);
  });
}

/**
 * Grafikleri başlatır
 */
function initializeCharts() {
  initMonthlyReadingChart();
  initGenreDistributionChart();
}

/**
 * Aylık okuma grafiğini oluşturur
 */
function initMonthlyReadingChart() {
  const chartDom = document.getElementById("monthlyReadingChart");
  if (!chartDom) return;

  const myChart = echarts.init(chartDom);

  // Aylık kitap sayılarını hesapla (2023 yılı için)
  const monthlyData = Array(12).fill(0);

  dummyBooks.forEach((book) => {
    const endDate = new Date(book.endDate);
    const month = endDate.getMonth(); // 0-11
    monthlyData[month]++;
  });

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        const monthNames = [
          "Ocak",
          "Şubat",
          "Mart",
          "Nisan",
          "Mayıs",
          "Haziran",
          "Temmuz",
          "Ağustos",
          "Eylül",
          "Ekim",
          "Kasım",
          "Aralık",
        ];
        return `${monthNames[params[0].dataIndex]}: ${params[0].value} kitap`;
      },
    },
    xAxis: {
      type: "category",
      data: [
        "Oca",
        "Şub",
        "Mar",
        "Nis",
        "May",
        "Haz",
        "Tem",
        "Ağu",
        "Eyl",
        "Eki",
        "Kas",
        "Ara",
      ],
      axisLine: {
        lineStyle: {
          color: "#6c757d",
        },
      },
      axisLabel: {
        color: "#6c757d",
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#6c757d",
        },
      },
      axisLabel: {
        color: "#6c757d",
        formatter: "{value} kitap",
      },
      splitLine: {
        lineStyle: {
          color: "#ddd",
        },
      },
    },
    series: [
      {
        data: monthlyData,
        type: "bar",
        name: "Kitap Sayısı",
        itemStyle: {
          color: "#0D6EFD",
        },
      },
    ],
  };

  myChart.setOption(option);

  // Pencere yeniden boyutlandırıldığında grafiği güncelle
  window.addEventListener("resize", function () {
    myChart.resize();
  });
}

/**
 * Tür dağılımı pasta grafiği
 */
function initGenreDistributionChart() {
  const chartDom = document.getElementById("genreDistributionChart");
  if (!chartDom) return;

  const myChart = echarts.init(chartDom);

  // Tür dağılımını hesapla
  const genreCounts = {};
  dummyBooks.forEach((book) => {
    if (genreCounts[book.genre]) {
      genreCounts[book.genre]++;
    } else {
      genreCounts[book.genre] = 1;
    }
  });

  const data = Object.keys(genreCounts).map((genre) => ({
    value: genreCounts[genre],
    name: genre,
  }));

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} kitap ({d}%)",
    },
    legend: {
      orient: "vertical",
      right: 10,
      top: "center",
      textStyle: {
        color: "#6c757d",
      },
    },
    series: [
      {
        name: "Tür Dağılımı",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "18",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: data,
      },
    ],
    color: [
      "#0D6EFD",
      "#28A745",
      "#DC3545",
      "#FFC107",
      "#17A2B8",
      "#6610F2",
      "#FD7E14",
      "#20C997",
    ],
  };

  myChart.setOption(option);

  // Pencere yeniden boyutlandırıldığında grafiği güncelle
  window.addEventListener("resize", function () {
    myChart.resize();
  });
}

/**
 * Event listener'ları ayarlar
 */
function setupEventListeners() {
  // Çıkış butonu
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
  // Gezinme bağlantılarını ayarla
  const navigateLinks = document.querySelectorAll(".navigate-link");
  navigateLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Önce mevcut oturum kontrolünü yap
      if (!isValidSession()) {
        e.preventDefault();
        window.location.replace("index.html");
        return;
      }
      // Oturum geçerli, aktiviteyi güncelle
      updateSessionActivity();
    });
  });

  // Kitap arama
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", filterTableBySearch);
  }

  // Kitap ekleme formu
  const addBookForm = document.getElementById("addBookForm");
  if (addBookForm) {
    addBookForm.addEventListener("submit", handleAddBook);
  }
}

/**
 * Oturumu kapatır
 */
function handleLogout() {
  Swal.fire({
    title: "Çıkış yapmak istediğinize emin misiniz?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Evet, çıkış yap",
    cancelButtonText: "İptal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Session storage'dan kullanıcı bilgilerini temizle
      sessionStorage.removeItem("bookdashUser");

      // Login sayfasına yönlendir
      window.location.href = "index.html";
    }
  });
}

/**
 * Hızlı kitap ekleme
 * @param {Event} e - Form submit olayı
 */
function handleQuickAddBook(e) {
  e.preventDefault();

  const title = document.getElementById("bookTitle").value;
  const author = document.getElementById("bookAuthor").value;
  const genre = document.getElementById("bookGenre").value;
  const days = parseInt(document.getElementById("readingDays").value);

  if (!title || !author || !genre || isNaN(days)) {
    showNotification("error", "Hata", "Lütfen tüm alanları doldurun.");
    return;
  }

  // Bugünün tarihini al
  const today = new Date();

  // Bitiş tarihini hesapla (okuma süresi kadar gün öncesi)
  const startDate = new Date();
  startDate.setDate(today.getDate() - days);

  // Yeni kitap objesi oluştur
  const newBook = {
    id: dummyBooks.length + 1,
    title: title,
    author: author,
    startDate: formatDateForInput(startDate),
    endDate: formatDateForInput(today),
    genre: genre,
    days: days,
    notes: "",
  };

  // Kitap listesine ekle
  dummyBooks.push(newBook);

  // Formu temizle
  document.getElementById("quickAddBookForm").reset();

  // İstatistikleri ve tabloyu güncelle
  updateDashboardStats();
  populateLatestBooks();

  // Başarılı bildirim göster
  showNotification("success", "Başarılı", "Kitap başarıyla eklendi.");
}

/**
 * Modal üzerinden kitap kaydetme
 */
function handleSaveBook() {
  const title = document.getElementById("modalBookTitle").value;
  const author = document.getElementById("modalBookAuthor").value;
  const startDate = document.getElementById("modalStartDate").value;
  const endDate = document.getElementById("modalEndDate").value;
  const genre = document.getElementById("modalBookGenre").value;
  const notes = document.getElementById("modalNotes").value;

  if (!title || !author || !startDate || !endDate || !genre) {
    showNotification("error", "Hata", "Lütfen zorunlu alanları doldurun.");
    return;
  }

  // Tarihlerin doğruluğunu kontrol et
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    showNotification(
      "error",
      "Hata",
      "Başlangıç tarihi, bitiş tarihinden sonra olamaz."
    );
    return;
  }

  // Okuma süresini gün cinsinden hesapla
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  // Yeni kitap objesi oluştur
  const newBook = {
    id: dummyBooks.length + 1,
    title: title,
    author: author,
    startDate: startDate,
    endDate: endDate,
    genre: genre,
    days: days,
    notes: notes,
  };

  // Kitap listesine ekle
  dummyBooks.push(newBook);

  // Modalı kapat
  $("#addBookModal").modal("hide");

  // Formu temizle
  document.getElementById("addBookForm").reset();

  // İstatistikleri ve tabloyu güncelle
  updateDashboardStats();
  populateLatestBooks();

  // Grafikleri güncelle
  initializeCharts();

  // Başarılı bildirim göster
  showNotification("success", "Başarılı", "Kitap başarıyla eklendi.");
}

/**
 * Bildirim gösterme fonksiyonu
 * @param {string} type - Bildirim tipi (success, error, warning, info)
 * @param {string} title - Bildirim başlığı
 * @param {string} text - Bildirim metni
 */
function showNotification(type, title, text) {
  Swal.fire({
    icon: type,
    title: title,
    text: text,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
}

/**
 * Tarih formatını 'DD.MM.YYYY' şeklinde düzenler
 * @param {string} dateString - ISO formatında tarih (YYYY-MM-DD)
 * @returns {string} - Formatlanmış tarih
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${date.getFullYear()}`;
}

/**
 * Tarihi input alanı için YYYY-MM-DD formatına çevirir
 * @param {Date} date - Tarih objesi
 * @returns {string} - YYYY-MM-DD formatında tarih
 */
function formatDateForInput(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}
