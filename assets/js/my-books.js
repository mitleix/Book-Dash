/**
 * BookDash - My Books Script
 * --------------------------
 * Bu script, kitaplarım sayfasının işlevlerini yönetir.
 */

// LocalStorage'den kitapları yükle veya varsayılan verileri kullan
let dummyBooks = loadBooks() || [
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
    rating: 5,
    tags: ["Klasik", "Psikolojik", "Favoriler"],
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
    rating: 4,
    tags: ["Distopya", "Politik", "Etkileyici"],
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
    rating: 5,
    tags: ["Klasik", "Uzun", "Duygusal"],
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
    rating: 4,
    tags: ["Distopya", "Bilimkurgu", "Öneri"],
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
    rating: 4,
    tags: ["Politik", "Alegorik", "Kısa"],
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
    rating: 4,
    tags: ["Klasik", "Mizah", "Favoriler"],
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
    rating: 5,
    tags: ["Bilimkurgu", "Seri", "Epik"],
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
    rating: 3,
    tags: ["Klasik", "Hayvanlar", "Duygusal"],
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
    rating: 4,
    tags: ["Yarı Otobiyografik", "Dramatik"],
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
    rating: 4,
    tags: ["Klasik", "Kısa", "Psikolojik"],
  },
];

// Tüm kitap etiketleri
let allBookTags = loadTags() || [];

let booksTable;

document.addEventListener("DOMContentLoaded", function () {
  // Kullanıcı oturum kontrolü
  checkUserSession();

  // Kullanıcı adını doldur
  updateUserInfo();

  // Tüm etiketleri doldur
  populateAllTags();

  // Etiket filtre bileşenlerini oluştur
  createTagFilterElements();

  // DataTable'ı başlat
  initializeDataTable();

  // Event listener'ları ayarla
  setupEventListeners();

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
 * Tüm kitap etiketlerini doldurur
 */
function populateAllTags() {
  // Tüm kitaplardan etiketleri topla
  const tagsSet = new Set();

  dummyBooks.forEach((book) => {
    if (book.tags && Array.isArray(book.tags)) {
      book.tags.forEach((tag) => tagsSet.add(tag));
    }
  });

  // Set'ten diziye çevir
  allBookTags = Array.from(tagsSet).sort();
}

/**
 * Etiket filtre bileşenlerini oluşturur
 */
function createTagFilterElements() {
  // Filtreleme alanı oluştur
  const filterContainer = document.querySelector(".content-header .col-12");
  if (!filterContainer) return;

  const tagFilterBox = document.createElement("div");
  tagFilterBox.className = "mb-3 p-3 bg-light rounded";
  tagFilterBox.innerHTML = `
    <h5><i class="fas fa-tags"></i> Etiket Filtreleri</h5>
    <div class="tag-filter-controls d-flex flex-wrap">
      <div id="tagFilters" class="d-flex flex-wrap"></div>
    </div>
  `;

  filterContainer.appendChild(tagFilterBox);

  // Etiketleri ekle
  const tagFiltersContainer = document.getElementById("tagFilters");
  allBookTags.forEach((tag) => {
    const tagBtn = document.createElement("button");
    tagBtn.className = "btn btn-outline-primary btn-sm m-1 tag-filter";
    tagBtn.setAttribute("data-tag", tag);
    tagBtn.innerHTML = `<i class="fas fa-tag"></i> ${tag}`;
    tagFiltersContainer.appendChild(tagBtn);
  });

  // Etiket filtrelerini temizleme butonu
  const clearBtn = document.createElement("button");
  clearBtn.className = "btn btn-outline-danger btn-sm m-1";
  clearBtn.id = "clearTagFilters";
  clearBtn.innerHTML = '<i class="fas fa-times"></i> Filtreleri Temizle';
  tagFiltersContainer.appendChild(clearBtn);

  // Etiket filtre olaylarını ekle
  document.querySelectorAll(".tag-filter").forEach((btn) => {
    btn.addEventListener("click", function () {
      this.classList.toggle("active");
      applyTagFilters();
    });
  });

  document
    .getElementById("clearTagFilters")
    .addEventListener("click", function () {
      document.querySelectorAll(".tag-filter").forEach((btn) => {
        btn.classList.remove("active");
      });
      applyTagFilters();
    });
}

/**
 * Seçili etiket filtrelerini uygular
 */
function applyTagFilters() {
  // Seçili etiketleri al
  const selectedTags = Array.from(
    document.querySelectorAll(".tag-filter.active")
  ).map((btn) => btn.getAttribute("data-tag"));

  // Filtreyi uygula
  $.fn.dataTable.ext.search.pop(); // Önceki filtreyi temizle

  if (selectedTags.length > 0) {
    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
      const bookTags = dummyBooks[dataIndex].tags;
      if (!bookTags || !Array.isArray(bookTags)) return false;

      // Seçili etiketlerden herhangi biri kitapta varsa göster
      return selectedTags.some((tag) => bookTags.includes(tag));
    });
  }

  booksTable.draw(); // Tabloyu yenile
}

/**
 * DataTable'ı başlatır
 */
function initializeDataTable() {
  booksTable = $("#booksTable").DataTable({
    responsive: true,
    data: dummyBooks,
    columns: [
      { data: "title" },
      { data: "author" },
      {
        data: "startDate",
        render: function (data) {
          return formatDate(data);
        },
      },
      {
        data: "endDate",
        render: function (data) {
          return formatDate(data);
        },
      },
      { data: "genre" },
      {
        data: "days",
        render: function (data) {
          return data + " gün";
        },
      },
      {
        data: "rating",
        render: function (data) {
          return generateRatingStars(data || 0);
        },
      },
      {
        data: "tags",
        render: function (data) {
          if (!data || !Array.isArray(data)) return "";

          return data
            .map((tag) => `<span class="badge badge-info mr-1">${tag}</span>`)
            .join(" ");
        },
      },
      {
        data: "notes",
        render: function (data) {
          // Not uzunsa kısalt
          return data.length > 50 ? data.substring(0, 50) + "..." : data;
        },
      },
      {
        data: null,
        orderable: false,
        render: function (data, type, row) {
          return `
            <div class="btn-group">
              <button type="button" class="btn btn-info btn-sm view-book" data-id="${row.id}" data-toggle="tooltip" title="Görüntüle">
                <i class="fas fa-eye"></i>
              </button>
              <button type="button" class="btn btn-primary btn-sm edit-book" data-id="${row.id}" data-toggle="tooltip" title="Düzenle">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="btn btn-danger btn-sm delete-book" data-id="${row.id}" data-toggle="tooltip" title="Sil">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
        },
      },
    ],
    order: [[3, "desc"]], // Bitiş tarihine göre sırala (en son okunanlar üstte)
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.25/i18n/Turkish.json",
    },
    stateSave: true, // Tablo durumunu kaydet
  });

  // Tooltip'leri etkinleştir
  $('[data-toggle="tooltip"]').tooltip();
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

  // Kitap kaydet butonu
  const saveBookBtn = document.getElementById("saveBookBtn");
  if (saveBookBtn) {
    saveBookBtn.addEventListener("click", handleAddBook);
  }

  // Kitap güncelleme butonu
  const updateBookBtn = document.getElementById("updateBookBtn");
  if (updateBookBtn) {
    updateBookBtn.addEventListener("click", handleUpdateBook);
  }

  // Kitap görüntüleme
  $("#booksTable").on("click", ".view-book", function () {
    const bookId = $(this).data("id");
    viewBook(bookId);
  });

  // Kitap düzenleme
  $("#booksTable").on("click", ".edit-book", function () {
    const bookId = $(this).data("id");
    editBook(bookId);
  });

  // Kitap silme
  $("#booksTable").on("click", ".delete-book", function () {
    const bookId = $(this).data("id");
    deleteBook(bookId);
  });

  // Modal kapandığında formları sıfırla
  $("#addBookModal").on("hidden.bs.modal", function () {
    document.getElementById("addBookForm").reset();
  });

  $("#editBookModal").on("hidden.bs.modal", function () {
    document.getElementById("editBookForm").reset();
  });
}

/**
 * Kitap ekleme işlemi
 */
function handleAddBook() {
  const title = document.getElementById("bookTitle").value;
  const author = document.getElementById("bookAuthor").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const genre = document.getElementById("bookGenre").value;
  const rating = document.getElementById("bookRating")
    ? document.getElementById("bookRating").value
    : 0;
  const notes = document.getElementById("notes").value;
  const tagsInput = document.getElementById("bookTags")
    ? document.getElementById("bookTags").value
    : "";

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

  // Etiketleri işle
  let tags = [];
  if (tagsInput) {
    // Virgülle ayrılmış etiketleri diziye çevir, boşlukları temizle
    tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    // Yeni etiketleri etiket listesine ekle
    tags.forEach((tag) => {
      if (!allBookTags.includes(tag)) {
        allBookTags.push(tag);
      }
    });
    allBookTags.sort(); // Alfabetik sırala
  }

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
    rating: parseInt(rating) || 0,
    tags: tags,
  };
  // Kitap listesine ekle
  dummyBooks.push(newBook);

  // Verileri localStorage'a kaydet
  saveBooks();
  saveTags();

  // Tabloyu güncelle
  booksTable.row.add(newBook).draw();

  // Modalı kapat
  $("#addBookModal").modal("hide");

  // Başarılı bildirim göster
  showNotification(
    "success",
    "Başarılı",
    "Kitap başarıyla eklendi ve kaydedildi."
  );
}

/**
 * Kitap güncelleme işlemi
 */
function handleUpdateBook() {
  const bookId = parseInt(document.getElementById("editBookId").value);
  const title = document.getElementById("editBookTitle").value;
  const author = document.getElementById("editBookAuthor").value;
  const startDate = document.getElementById("editStartDate").value;
  const endDate = document.getElementById("editEndDate").value;
  const genre = document.getElementById("editBookGenre").value;
  const rating = document.getElementById("editBookRating")
    ? document.getElementById("editBookRating").value
    : 0;
  const notes = document.getElementById("editNotes").value;
  const tagsInput = document.getElementById("editBookTags")
    ? document.getElementById("editBookTags").value
    : "";

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

  // Etiketleri işle
  let tags = [];
  if (tagsInput) {
    // Virgülle ayrılmış etiketleri diziye çevir, boşlukları temizle
    tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    // Yeni etiketleri etiket listesine ekle
    tags.forEach((tag) => {
      if (!allBookTags.includes(tag)) {
        allBookTags.push(tag);
      }
    });
    allBookTags.sort(); // Alfabetik sırala

    // Etiket filtreleme butonlarını güncelle
    updateTagFilterButtons();
  }

  // Kitabı bul ve güncelle
  const bookIndex = dummyBooks.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    dummyBooks[bookIndex] = {
      ...dummyBooks[bookIndex],
      title: title,
      author: author,
      startDate: startDate,
      endDate: endDate,
      genre: genre,
      days: days,
      notes: notes,
      rating: parseInt(rating) || 0,
      tags: tags,
    }; // Verileri localStorage'a kaydet
    saveBooks();
    saveTags();

    // Tabloyu güncelle
    booksTable.clear().rows.add(dummyBooks).draw();

    // Modalı kapat
    $("#editBookModal").modal("hide");

    // Başarılı bildirim göster
    showNotification(
      "success",
      "Başarılı",
      "Kitap başarıyla güncellendi ve kaydedildi."
    );
  } else {
    showNotification("error", "Hata", "Kitap bulunamadı!");
  }
}

/**
 * Kitap detayını görüntüler
 * @param {number} bookId - Görüntülenecek kitap ID'si
 */
function viewBook(bookId) {
  const book = dummyBooks.find((book) => book.id === bookId);
  if (!book) return;

  // Modal'a verileri doldur
  document.getElementById("viewBookTitle").textContent = book.title;
  document.getElementById("viewBookAuthor").textContent = book.author;
  document.getElementById("viewStartDate").textContent = formatDate(
    book.startDate
  );
  document.getElementById("viewEndDate").textContent = formatDate(book.endDate);
  document.getElementById("viewReadingDays").textContent = book.days;
  document.getElementById("viewBookGenre").textContent = book.genre;
  document.getElementById("viewNotes").textContent =
    book.notes || "Not eklenmemiş.";

  // Puanlama yıldızları
  const ratingContainer = document.getElementById("viewRating");
  if (ratingContainer) {
    ratingContainer.innerHTML = generateRatingStars(book.rating || 0);
  }

  // Etiketleri doldur
  const tagsContainer = document.getElementById("viewTags");
  if (tagsContainer) {
    tagsContainer.innerHTML = "";
    if (book.tags && book.tags.length > 0) {
      book.tags.forEach((tag) => {
        const tagSpan = document.createElement("span");
        tagSpan.className = "badge badge-info mr-1";
        tagSpan.textContent = tag;
        tagsContainer.appendChild(tagSpan);
      });
    } else {
      tagsContainer.textContent = "Etiket eklenmemiş.";
    }
  }

  // Modal'ı aç
  $("#viewBookModal").modal("show");
}

/**
 * Kitap düzenleme modalını açar
 * @param {number} bookId - Düzenlenecek kitap ID'si
 */
function editBook(bookId) {
  const book = dummyBooks.find((book) => book.id === bookId);
  if (!book) return;

  // Modal'a verileri doldur
  document.getElementById("editBookId").value = book.id;
  document.getElementById("editBookTitle").value = book.title;
  document.getElementById("editBookAuthor").value = book.author;
  document.getElementById("editStartDate").value = book.startDate;
  document.getElementById("editEndDate").value = book.endDate;
  document.getElementById("editBookGenre").value = book.genre;
  document.getElementById("editNotes").value = book.notes;

  // Puanlama ve etiketleri doldur
  if (document.getElementById("editBookRating")) {
    document.getElementById("editBookRating").value = book.rating || 0;
  }

  if (document.getElementById("editBookTags")) {
    document.getElementById("editBookTags").value = book.tags
      ? book.tags.join(", ")
      : "";
  }

  // Modal'ı aç
  $("#editBookModal").modal("show");
}

/**
 * Kitap silme işlemi
 * @param {number} bookId - Silinecek kitap ID'si
 */
function deleteBook(bookId) {
  Swal.fire({
    title: "Emin misiniz?",
    text: "Bu kitabı silmek istediğinize emin misiniz?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Evet, sil",
    cancelButtonText: "İptal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Kitabı listeden kaldır
      const bookIndex = dummyBooks.findIndex((book) => book.id === bookId);
      if (bookIndex !== -1) {
        dummyBooks.splice(bookIndex, 1);

        // Verileri localStorage'a kaydet
        saveBooks();

        // Tabloyu güncelle
        booksTable.clear().rows.add(dummyBooks).draw();

        // Başarılı bildirim göster
        showNotification(
          "success",
          "Başarılı",
          "Kitap başarıyla silindi ve değişiklikler kaydedildi."
        );
      }
    }
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
 * Puan yıldızlarını oluşturur
 * @param {number} rating - Puan (1-5)
 * @returns {string} - HTML formatında yıldızlar
 */
function generateRatingStars(rating) {
  let stars = "";

  // Tam yıldızlar
  for (let i = 1; i <= Math.floor(rating); i++) {
    stars += '<i class="fas fa-star text-warning"></i>';
  }

  // Yarım yıldız
  if (rating % 1 !== 0) {
    stars += '<i class="fas fa-star-half-alt text-warning"></i>';
  }

  // Boş yıldızlar
  for (let i = Math.ceil(rating); i < 5; i++) {
    stars += '<i class="far fa-star text-warning"></i>';
  }

  return stars;
}

/**
 * Etiket filtre butonlarını günceller
 */
function updateTagFilterButtons() {
  const tagFiltersContainer = document.getElementById("tagFilters");
  if (!tagFiltersContainer) return;

  // Temizleme butonu hariç tüm butonları kaldır
  const clearBtn = document.getElementById("clearTagFilters");
  tagFiltersContainer.innerHTML = "";

  // Etiketleri ekle
  allBookTags.forEach((tag) => {
    const tagBtn = document.createElement("button");
    tagBtn.className = "btn btn-outline-primary btn-sm m-1 tag-filter";
    tagBtn.setAttribute("data-tag", tag);
    tagBtn.innerHTML = `<i class="fas fa-tag"></i> ${tag}`;

    // Etiket filtreleme olayını ekle
    tagBtn.addEventListener("click", function () {
      this.classList.toggle("active");
      applyTagFilters();
    });

    tagFiltersContainer.appendChild(tagBtn);
  });

  // Temizleme butonunu yeniden ekle
  if (clearBtn) {
    tagFiltersContainer.appendChild(clearBtn);
  } else {
    const newClearBtn = document.createElement("button");
    newClearBtn.className = "btn btn-outline-danger btn-sm m-1";
    newClearBtn.id = "clearTagFilters";
    newClearBtn.innerHTML = '<i class="fas fa-times"></i> Filtreleri Temizle';

    newClearBtn.addEventListener("click", function () {
      document.querySelectorAll(".tag-filter").forEach((btn) => {
        btn.classList.remove("active");
      });
      applyTagFilters();
    });

    tagFiltersContainer.appendChild(newClearBtn);
  }
}

/**
 * Kitapları localStorage'a kaydeder
 */
function saveBooks() {
  try {
    localStorage.setItem("bookdashBooks", JSON.stringify(dummyBooks));
    console.log("Kitaplar başarıyla localStorage'a kaydedildi.");
  } catch (e) {
    console.error("Kitaplar kaydedilirken hata oluştu:", e);
    showNotification(
      "error",
      "Hata",
      "Kitaplar kaydedilirken bir hata oluştu."
    );
  }
}

/**
 * Etiketleri localStorage'a kaydeder
 */
function saveTags() {
  try {
    localStorage.setItem("bookdashTags", JSON.stringify(allBookTags));
    console.log("Etiketler başarıyla localStorage'a kaydedildi.");
  } catch (e) {
    console.error("Etiketler kaydedilirken hata oluştu:", e);
  }
}

/**
 * Kitapları localStorage'dan yükler
 * @returns {Array} Kitap listesi veya null
 */
function loadBooks() {
  try {
    const storedBooks = localStorage.getItem("bookdashBooks");
    if (storedBooks) {
      console.log("Kitaplar başarıyla localStorage'dan yüklendi.");
      return JSON.parse(storedBooks);
    }
    return null;
  } catch (e) {
    console.error("Kitaplar yüklenirken hata oluştu:", e);
    return null;
  }
}

/**
 * Etiketleri localStorage'dan yükler
 * @returns {Array} Etiket listesi veya null
 */
function loadTags() {
  try {
    const storedTags = localStorage.getItem("bookdashTags");
    if (storedTags) {
      console.log("Etiketler başarıyla localStorage'dan yüklendi.");
      return JSON.parse(storedTags);
    }
    return null;
  } catch (e) {
    console.error("Etiketler yüklenirken hata oluştu:", e);
    return null;
  }
}
