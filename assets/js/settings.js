/**
 * BookDash - Settings Script
 * -------------------------
 * Bu script, kullanıcı ayarları sayfasının işlevlerini yönetir.
 */

document.addEventListener("DOMContentLoaded", function () {
  // Oturum kontrolü
  checkSession();

  // Çıkış butonunu dinle
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

  // Profil bilgilerini form alanlarına yerleştir
  populateProfileData();

  // Profil formunu dinle
  const profileForm = document.getElementById("profileUpdateForm");
  if (profileForm) {
    profileForm.addEventListener("submit", handleProfileUpdate);
  }

  // Parola formunu dinle
  const passwordForm = document.getElementById("passwordUpdateForm");
  if (passwordForm) {
    passwordForm.addEventListener("submit", handlePasswordUpdate);
  }
  // Profil fotoğrafı değiştirme
  const profileImageUpload = document.getElementById("profileImageUpload");
  const changePhotoBtn = document.getElementById("changePhotoBtn");

  if (changePhotoBtn && profileImageUpload) {
    changePhotoBtn.addEventListener("click", function () {
      profileImageUpload.click();
    });

    profileImageUpload.addEventListener("change", handleProfileImageChange);
  }

  // BS Custom File Input'u etkinleştir
  if (typeof bsCustomFileInput !== "undefined") {
    bsCustomFileInput.init();
  }

  // Tercihler formunu dinle - Tema değiştirme
  const preferenceForm = document.getElementById("preferencesForm");
  const themeRadios = document.querySelectorAll('input[name="theme"]');

  // Kayıtlı tema bilgisini al
  const savedTheme = localStorage.getItem("bookdashTheme") || "light";

  // Kayıtlı tema seçeneğini işaretle
  themeRadios.forEach((radio) => {
    if (radio.value === savedTheme) {
      radio.checked = true;
    }

    // Tema değişikliği için olay dinleyici ekle
    radio.addEventListener("change", handleThemeChange);
  });

  // Sayfa yüklendiğinde kayıtlı temayı uygula
  applyTheme(savedTheme);
});

/**
 * Aktif oturumu kontrol eder ve yoksa yönlendirir
 */
function checkSession() {
  try {
    // Merkezi redirectIfNoSession fonksiyonunu kullan (session-helper.js'de)
    let sessionValid = false;

    if (typeof redirectIfNoSession === "function") {
      // Pages klasöründe olduğumuzu belirt (../index.html şeklinde yönlendirme için)
      sessionValid = redirectIfNoSession(true);
    } else {
      // Eski yöntem (yedek olarak)
      const user = JSON.parse(sessionStorage.getItem("bookdashUser"));
      if (!user || !user.isLoggedIn) {
        console.log("Oturum bulunamadı, giriş sayfasına yönlendiriliyor");

        // URL'yi kontrol et, zaten login sayfasındaysa döngüye girme
        const currentPath = window.location.pathname.toLowerCase();
        if (!currentPath.includes("index.html") && !currentPath.endsWith("/")) {
          sessionStorage.removeItem("bookdashUser");
          window.location.href = "../index.html"; // replace yerine href kullan
        }
        return false;
      }
      sessionValid = true;
    }

    // Oturum geçerliyse kullanıcı bilgilerini göster
    if (sessionValid) {
      // Kullanıcı bilgilerini göster
      const user = JSON.parse(sessionStorage.getItem("bookdashUser"));
      if (user && user.name) {
        // Kullanıcı adını sidebar'a yerleştir
        const userNameElement = document.querySelector(".user-panel .info a");
        if (userNameElement) {
          userNameElement.textContent = user.name;
        }
      }
    }

    return sessionValid;
  } catch (e) {
    console.error("Oturum kontrolü sırasında hata:", e);
    return false;
  }
}

/**
 * Profil bilgilerini formda gösterir
 */
function populateProfileData() {
  const user = JSON.parse(sessionStorage.getItem("bookdashUser"));
  if (!user) return;

  // Form alanlarını doldur
  const fields = {
    fullNameInput: user.name || "",
    emailInput: user.email || "",
    userTypeDisplay: getUserTypeText(user.userType) || "",
    bioInput: user.bio || "",
    phoneInput: user.phone || "",
    addressInput: user.address || "",
    websiteInput: user.website || "",
    facebookInput: user.social?.facebook || "",
    twitterInput: user.social?.twitter || "",
    instagramInput: user.social?.instagram || "",
  };

  // Her alan için kontrol et ve değeri ata
  Object.keys(fields).forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.value = fields[id];
      } else {
        element.textContent = fields[id];
      }
    }
  });

  // Profil resmi
  updateProfileImage(user.profileImage);
}

/**
 * Kullanıcı tipini okunabilir metne çevirir
 */
function getUserTypeText(userType) {
  const types = {
    student: "Öğrenci",
    teacher: "Öğretmen",
    individual: "Bireysel",
  };

  return types[userType] || "Bilinmiyor";
}

/**
 * Profil güncelleme işlemini yönetir
 */
function handleProfileUpdate(e) {
  e.preventDefault();

  // Form değerlerini al
  const fullName = document.getElementById("fullNameInput").value;
  const email = document.getElementById("emailInput").value;
  const bio = document.getElementById("bioInput").value;
  const phone = document.getElementById("phoneInput").value;
  const address = document.getElementById("addressInput").value;
  const website = document.getElementById("websiteInput").value;
  const facebook = document.getElementById("facebookInput").value;
  const twitter = document.getElementById("twitterInput").value;
  const instagram = document.getElementById("instagramInput").value;

  // Basit validasyon
  if (!fullName || !email) {
    showNotification("error", "Hata", "Ad ve e-posta alanları zorunludur.");
    return;
  }

  // Mevcut kullanıcı bilgilerini al
  const user = JSON.parse(sessionStorage.getItem("bookdashUser"));
  if (!user) return;
  // Kullanıcı bilgilerini güncelle
  user.name = fullName;
  user.email = email;
  user.bio = bio;
  user.phone = phone;
  user.address = address;
  user.website = website;
  user.social = {
    facebook: facebook,
    twitter: twitter,
    instagram: instagram,
  };

  // Session storage'a kaydet
  sessionStorage.setItem("bookdashUser", JSON.stringify(user));

  // LocalStorage'daki kullanıcı bilgilerini de güncelle
  updateLocalStorageUser(user);

  // Başarılı bildirim göster
  showNotification("success", "Başarılı", "Profil bilgileriniz güncellendi.");

  // Sidebar'daki kullanıcı adını güncelle
  const userNameElement = document.querySelector(".user-panel .info a");
  if (userNameElement) {
    userNameElement.textContent = fullName;
  }
}

/**
 * Şifre güncelleme işlemini yönetir
 */
function handlePasswordUpdate(e) {
  e.preventDefault();

  // Form değerlerini al
  const currentPassword = document.getElementById("currentPasswordInput").value;
  const newPassword = document.getElementById("newPasswordInput").value;
  const confirmPassword = document.getElementById("confirmPasswordInput").value;

  // Basit validasyon
  if (!currentPassword || !newPassword || !confirmPassword) {
    showNotification("error", "Hata", "Lütfen tüm şifre alanlarını doldurun.");
    return;
  }

  if (newPassword !== confirmPassword) {
    showNotification("error", "Hata", "Yeni şifreler eşleşmiyor.");
    return;
  }

  if (newPassword.length < 6) {
    showNotification("error", "Hata", "Şifre en az 6 karakter olmalıdır.");
    return;
  }

  // Demo amaçlı mevcut şifre kontrolü
  if (currentPassword !== "123456") {
    showNotification("error", "Hata", "Mevcut şifre yanlış.");
    return;
  }
  // Kullanıcının şifresini güncelle
  const user = JSON.parse(sessionStorage.getItem("bookdashUser"));
  if (user) {
    // Şifreyi güncelle
    user.password = newPassword;

    // Session storage'a kaydet
    sessionStorage.setItem("bookdashUser", JSON.stringify(user));

    // LocalStorage'daki kullanıcı bilgilerini de güncelle
    updateLocalStorageUser(user);
  }

  // Başarılı bildirim göster
  showNotification(
    "success",
    "Başarılı",
    "Şifreniz güncellendi. Bir sonraki girişinizde yeni şifrenizi kullanabilirsiniz."
  );

  // Formu temizle
  document.getElementById("passwordUpdateForm").reset();
}

/**
 * Profil fotoğrafı değiştirme işlemini yönetir
 */
function handleProfileImageChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Sadece görüntü dosyalarını kabul et
  if (!file.type.startsWith("image/")) {
    showNotification("error", "Hata", "Lütfen bir görüntü dosyası seçin.");
    return;
  }

  // FileReader kullanarak dosyayı oku
  const reader = new FileReader();
  reader.onload = function (event) {
    // Base64 formatında resim verisi
    const imageData = event.target.result;

    // Profil resmini güncelle
    updateProfileImage(imageData);

    // Kullanıcı nesnesine kaydet
    const user = JSON.parse(sessionStorage.getItem("bookdashUser"));
    if (user) {
      user.profileImage = imageData;
      sessionStorage.setItem("bookdashUser", JSON.stringify(user));

      // LocalStorage'daki kullanıcı bilgilerini de güncelle
      updateLocalStorageUser(user);

      // Sidebar'daki profil resmini de güncelle
      const sidebarImage = document.querySelector(".user-panel .image img");
      if (sidebarImage) {
        sidebarImage.src = imageData;
      }

      showNotification(
        "success",
        "Başarılı",
        "Profil fotoğrafınız güncellendi."
      );
    }
  };

  reader.readAsDataURL(file);
}

/**
 * Profil resmini günceller
 */
function updateProfileImage(imageData) {
  const profileImage = document.getElementById("profileImage");
  if (!profileImage) return;

  // Eğer resim verisi varsa kullan, yoksa varsayılan resmi göster
  if (imageData) {
    profileImage.src = imageData;
  } else {
    // Kullanıcı tipine göre varsayılan avatar
    const user = JSON.parse(sessionStorage.getItem("bookdashUser"));
    const userType = user?.userType || "individual";

    profileImage.src = getDefaultProfileImage(userType);
  }
}

/**
 * Kullanıcı tipine göre varsayılan profil resmi URL'si döndürür
 */
function getDefaultProfileImage(userType) {
  switch (userType) {
    case "student":
      return "https://cdn-icons-png.flaticon.com/512/3135/3135755.png";
    case "teacher":
      return "https://cdn-icons-png.flaticon.com/512/3135/3135789.png";
    default:
      return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
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
      // clearSession fonksiyonunu kullan (session-helper.js içinde tanımlı)
      if (typeof clearSession === "function") {
        clearSession();
      } else {
        sessionStorage.removeItem("bookdashUser");
      }

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
 * Tema değişikliğini yönetir
 */
function handleThemeChange(e) {
  const selectedTheme = e.target.value;
  applyTheme(selectedTheme);
  localStorage.setItem("bookdashTheme", selectedTheme);
}

/**
 * Temayı uygular
 */
function applyTheme(theme) {
  const body = document.body;
  body.classList.remove("light-theme", "dark-theme");
  body.classList.add(`${theme}-theme`);
}

/**
 * Tema değişikliği için olay işleyici
 * @param {Event} e - Olay nesnesi
 */
function handleThemeChange(e) {
  const selectedTheme = e.target.value;

  // Temayı uygula
  applyTheme(selectedTheme);

  // Tema tercihini localStorage'a kaydet
  localStorage.setItem("bookdashTheme", selectedTheme);

  // Kullanıcıya bildirim göster
  showNotification(
    "success",
    "Tema Değiştirildi",
    selectedTheme === "dark" ? "Koyu tema uygulandı." : "Açık tema uygulandı."
  );
}

/**
 * Temayı uygular
 * @param {string} theme - Tema adı ('light' veya 'dark')
 */
function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }

  // Kullanıcı tercihlerini güncelle (oturum içinde)
  updateUserPreferences({ theme: theme });
}

/**
 * Kullanıcı tercihlerini günceller
 * @param {Object} preferences - Güncellenecek tercihler
 */
function updateUserPreferences(preferences) {
  try {
    const user = JSON.parse(sessionStorage.getItem("bookdashUser"));
    if (user) {
      // Kullanıcı tercihlerini oluştur veya güncelle
      user.preferences = user.preferences || {};

      // Gelen tercihleri birleştir
      Object.assign(user.preferences, preferences);

      // Güncellenmiş kullanıcı bilgisini sessionStorage'a kaydet
      sessionStorage.setItem("bookdashUser", JSON.stringify(user));

      // LocalStorage'daki kullanıcı bilgilerini de güncelle
      updateLocalStorageUser(user);

      console.log("Kullanıcı tercihleri güncellendi:", preferences);
    }
  } catch (e) {
    console.error("Kullanıcı tercihleri güncellenirken hata:", e);
  }
}
