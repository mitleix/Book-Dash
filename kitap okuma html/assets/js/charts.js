/**
 * BookDash - Charts Script
 * -----------------------
 * Bu script, grafik sayfasının işlevlerini yönetir.
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

// ECharts grafik nesneleri
let monthlyChart, genreChart, durationChart, userTypeChart, yearComparisonChart;

document.addEventListener("DOMContentLoaded", function () {
  // Kullanıcı oturum kontrolü
  checkUserSession();

  // Kullanıcı adını doldur
  updateUserInfo();

  // Tüm grafikleri başlat
  initializeAllCharts();

  // Event listener'ları ayarla
  setupEventListeners();

  // Pencere boyutu değiştiğinde grafikleri yeniden boyutlandır
  window.addEventListener("resize", resizeAllCharts);

  // Sayfa kapanmadan önce oturum bilgilerini güncelle
  window.addEventListener("beforeunload", function () {
    try {
      const user = JSON.parse(sessionStorage.getItem("bookdashUser"));
      if (user && user.isLoggedIn) {
        user.lastActivity = new Date().toISOString();
        sessionStorage.setItem("bookdashUser", JSON.stringify(user));
      }
    } catch (e) {
      console.error("Oturum bilgileri güncellenirken hata oluştu:", e);
    }
  });
});

/**
 * Kullanıcı oturumunu kontrol eder
 */
function checkUserSession() {
  try {
    // Merkezi redirectIfNoSession fonksiyonunu kullan (session-helper.js'de)
    if (typeof redirectIfNoSession === "function") {
      // Pages klasöründe olduğumuzu belirt (../index.html şeklinde yönlendirme için)
      return redirectIfNoSession(true);
    } else {
      // Eski yöntem (yedek olarak)
      const user = JSON.parse(sessionStorage.getItem("bookdashUser"));
      if (!user || !user.isLoggedIn) {
        console.log("Oturum bulunamadı, giriş sayfasına yönlendiriliyor");
        sessionStorage.removeItem("bookdashUser");

        // URL'yi kontrol et, zaten login sayfasındaysa döngüye girme
        const currentPath = window.location.pathname.toLowerCase();
        if (!currentPath.includes("index.html") && !currentPath.endsWith("/")) {
          window.location.href = "../index.html"; // replace yerine href kullan
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
 * Tüm grafikleri başlatır
 */
function initializeAllCharts() {
  initMonthlyReadingChart();
  initGenreDistributionChart();
  initReadingDurationChart();
  initUserTypeReadingChart();
  initYearComparisonChart();

  // Grafik sonuçlarıyla ilgili metinleri güncelle
  updateChartStats();
}

/**
 * Aylık okunan kitap sayısı grafiği
 */
function initMonthlyReadingChart() {
  const chartDom = document.getElementById("monthlyReadingChart");
  if (!chartDom) return;

  monthlyChart = echarts.init(chartDom);

  // Aylık kitap sayılarını hesapla (2025 yılı için)
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
        return `${monthNames[params[0].dataIndex]} 2025: ${
          params[0].value
        } kitap`;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
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
          color: "rgba(108, 117, 125, 0.2)",
        },
      },
    },
    series: [
      {
        name: "Kitap Sayısı",
        type: "bar",
        data: monthlyData,
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#0D6EFD", // Start color
              },
              {
                offset: 1,
                color: "#17a2b8", // End color
              },
            ],
          },
        },
        emphasis: {
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#0a58ca", // Darker start
                },
                {
                  offset: 1,
                  color: "#138496", // Darker end
                },
              ],
            },
          },
        },
      },
    ],
  };

  monthlyChart.setOption(option);
}

/**
 * Kitap türlerine göre dağılım grafiği
 */
function initGenreDistributionChart() {
  const chartDom = document.getElementById("genreDistributionChart");
  if (!chartDom) return;

  genreChart = echarts.init(chartDom);

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
        radius: ["45%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "16",
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
      "#28a745",
      "#0D6EFD",
      "#dc3545",
      "#ffc107",
      "#17a2b8",
      "#6f42c1",
      "#fd7e14",
      "#20c997",
    ],
  };

  genreChart.setOption(option);
}

/**
 * Okuma süresi trendleri grafiği
 */
function initReadingDurationChart() {
  const chartDom = document.getElementById("readingDurationChart");
  if (!chartDom) return;

  durationChart = echarts.init(chartDom);

  // Kitapları tarih sırasına göre sırala
  const sortedBooks = [...dummyBooks].sort(
    (a, b) => new Date(a.endDate) - new Date(b.endDate)
  );

  // Son 10 kitap için okuma süresi verilerini al
  const recentBooks = sortedBooks.slice(-10);

  const titles = recentBooks.map((book) => book.title);
  const durations = recentBooks.map((book) => book.days);

  // Tüm kitaplar için ortalama süreyi hesapla
  const avgDuration = Math.round(
    dummyBooks.reduce((sum, book) => sum + book.days, 0) / dummyBooks.length
  );

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
      formatter: function (params) {
        return (
          `${params[0].name}: <b>${params[0].value}</b> gün<br>` +
          `${params[1] ? `Ortalama: <b>${params[1].value}</b> gün` : ""}`
        );
      },
    },
    legend: {
      data: ["Okuma Süresi", "Ortalama Süre"],
      textStyle: {
        color: "#6c757d",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: titles,
      axisLine: {
        lineStyle: {
          color: "#6c757d",
        },
      },
      axisLabel: {
        color: "#6c757d",
        rotate: 45,
        interval: 0,
      },
    },
    yAxis: {
      type: "value",
      name: "Gün",
      nameTextStyle: {
        color: "#6c757d",
      },
      axisLine: {
        lineStyle: {
          color: "#6c757d",
        },
      },
      axisLabel: {
        color: "#6c757d",
      },
      splitLine: {
        lineStyle: {
          color: "rgba(108, 117, 125, 0.2)",
        },
      },
    },
    series: [
      {
        name: "Okuma Süresi",
        type: "line",
        stack: "Total",
        areaStyle: {
          opacity: 0.3,
        },
        emphasis: {
          focus: "series",
        },
        data: durations,
        itemStyle: {
          color: "#0D6EFD",
        },
        lineStyle: {
          width: 3,
        },
        symbol: "circle",
        symbolSize: 8,
        showSymbol: true,
      },
      {
        name: "Ortalama Süre",
        type: "line",
        lineStyle: {
          type: "dashed",
          width: 2,
          color: "#dc3545",
        },
        symbol: "none",
        data: new Array(titles.length).fill(avgDuration),
      },
    ],
  };

  durationChart.setOption(option);
}

/**
 * Kullanıcı tipine göre ortalama okuma süresi grafiği
 */
function initUserTypeReadingChart() {
  const chartDom = document.getElementById("userTypeReadingChart");
  if (!chartDom) return;

  userTypeChart = echarts.init(chartDom);

  // Demo verisi - gerçek bir API'da farklı kullanıcı tiplerinden veri toplanacaktır
  const userData = [
    { userType: "Öğrenci", avgDays: 10, count: 120 },
    { userType: "Öğretmen", avgDays: 7, count: 80 },
    { userType: "Bireysel", avgDays: 12, count: 150 },
  ];

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        const data = userData.find((d) => d.userType === params[0].name);
        return (
          `${params[0].name}<br>` +
          `Ortalama Okuma Süresi: <b>${params[0].value}</b> gün<br>` +
          `Örnek Kullanıcı Sayısı: ${data.count}`
        );
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: userData.map((d) => d.userType),
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
      name: "Ortalama Gün",
      nameTextStyle: {
        color: "#6c757d",
      },
      axisLine: {
        lineStyle: {
          color: "#6c757d",
        },
      },
      axisLabel: {
        color: "#6c757d",
      },
      splitLine: {
        lineStyle: {
          color: "rgba(108, 117, 125, 0.2)",
        },
      },
    },
    series: [
      {
        name: "Ortalama Okuma Süresi",
        type: "bar",
        data: userData.map((d) => d.avgDays),
        itemStyle: {
          color: function (params) {
            const colors = ["#ffc107", "#28a745", "#17a2b8"];
            return colors[params.dataIndex % colors.length];
          },
          borderRadius: [5, 5, 0, 0],
        },
        barWidth: "50%",
        label: {
          show: true,
          position: "top",
          formatter: "{c} gün",
          fontWeight: "bold",
          fontSize: 14,
        },
      },
    ],
  };

  userTypeChart.setOption(option);
}

/**
 * Son 12 ay okuma karşılaştırması grafiği
 */
function initYearComparisonChart() {
  const chartDom = document.getElementById("yearComparisonChart");
  if (!chartDom) return;

  yearComparisonChart = echarts.init(chartDom);

  // Demo verisi - 2024 ve 2025 yılı için aylık kitap sayıları
  // Gerçek bir API'da, bu veri kullanıcının geçmiş yıllardaki verisi olacaktır
  const monthlyData2024 = [2, 1, 3, 2, 1, 4, 2, 3, 2, 1, 3, 2]; // 2024
  const monthlyData2025 = [3, 2, 2, 3, 3, 0, 0, 0, 0, 0, 0, 0]; // 2025 (Mayıs'a kadar, sonrası 0)

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

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        let tooltip = `${monthNames[params[0].dataIndex]}<br>`;
        params.forEach((param) => {
          const color = param.color;
          const value = param.value;
          const seriesName = param.seriesName;
          tooltip += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span> ${seriesName}: <b>${value}</b> kitap<br>`;
        });
        return tooltip;
      },
    },
    legend: {
      data: ["2024", "2025"],
      textStyle: {
        color: "#6c757d",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: monthNames,
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
      name: "Kitap Sayısı",
      nameTextStyle: {
        color: "#6c757d",
      },
      axisLine: {
        lineStyle: {
          color: "#6c757d",
        },
      },
      axisLabel: {
        color: "#6c757d",
      },
      splitLine: {
        lineStyle: {
          color: "rgba(108, 117, 125, 0.2)",
        },
      },
    },
    series: [
      {
        name: "2024",
        type: "line",
        data: monthlyData2024,
        symbolSize: 8,
        symbol: "circle",
        smooth: true,
        lineStyle: {
          width: 3,
        },
        itemStyle: {
          color: "#6c757d",
        },
      },
      {
        name: "2025",
        type: "line",
        data: monthlyData2025,
        symbolSize: 8,
        symbol: "circle",
        smooth: true,
        lineStyle: {
          width: 3,
        },
        itemStyle: {
          color: "#dc3545",
        },
      },
    ],
  };

  yearComparisonChart.setOption(option);
}

/**
 * Grafik sonuçlarına göre istatistikleri güncelle
 */
function updateChartStats() {
  // Tüm yıl için toplam kitap sayısı
  document.getElementById("totalYearlyBooks").textContent = dummyBooks.length;

  // En çok okunan türü bul
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

  // Ortalama okuma süresi
  const totalDays = dummyBooks.reduce((sum, book) => sum + book.days, 0);
  const averageDays = Math.round(totalDays / dummyBooks.length);
  document.getElementById("averageReadingDuration").textContent =
    averageDays + " gün";

  // En hızlı okuyan grup (demo veri)  document.getElementById("fastestGroup").textContent = "Öğretmenler";

  // Aylık istatistikler (demo veri)
  document.getElementById("currentMonthBooks").textContent = "3";
  document.getElementById("lastMonthBooks").textContent = "4";
  document.getElementById("changeInMonthly").textContent = "-25%";
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
        window.location.replace("../index.html");
        return;
      }
      // Oturum geçerli, aktiviteyi güncelle
      updateSessionActivity();
    });
  });
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
      window.location.href = "../index.html";
    }
  });
}

/**
 * Tüm grafikleri yeniden boyutlandırır
 */
function resizeAllCharts() {
  if (monthlyChart) monthlyChart.resize();
  if (genreChart) genreChart.resize();
  if (durationChart) durationChart.resize();
  if (userTypeChart) userTypeChart.resize();
  if (yearComparisonChart) yearComparisonChart.resize();
}
