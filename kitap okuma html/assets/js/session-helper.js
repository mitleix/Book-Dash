/**
 * BookDash - Session Helper Script
 * -------------------------------
 * Bu script, oturum yönetimi yardımcı işlevlerini içerir.
 */

// Sayfa yüklendiğinde kayıtlı temayı uygula
document.addEventListener("DOMContentLoaded", function () {
  applyStoredTheme();
});

/**
 * Kayıtlı temayı uygular
 */
function applyStoredTheme() {
  try {
    const savedTheme = localStorage.getItem("bookdashTheme");
    if (savedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  } catch (e) {
    console.error("Tema uygulanırken hata oluştu:", e);
  }
}

/**
 * Oturum bilgilerini temizler
 */
function clearSession() {
  try {
    sessionStorage.removeItem("bookdashUser");
    console.log("Oturum bilgileri temizlendi");
  } catch (e) {
    console.error("Oturum bilgileri temizlenirken hata oluştu:", e);
  }
}

/**
 * Oturum anahtarının geçerliliğini kontrol eder
 * @returns {boolean} Oturum anahtarı geçerli mi
 */
function isValidSession() {
  try {
    // isValidSession'un çağrılma sayısını göster (döngüleri tespit etmek için)
    isValidSession.callCount = (isValidSession.callCount || 0) + 1;
    console.log(`isValidSession çağrı sayısı: ${isValidSession.callCount}`);

    // Çağrı sayısı 10'u geçerse, döngü olabilir
    if (isValidSession.callCount > 10) {
      console.warn("Muhtemel döngü tespit edildi, 5 saniye bekleniyor");
      // 5 saniye sonra sayacı sıfırla
      setTimeout(() => {
        isValidSession.callCount = 0;
      }, 5000);
      // Eğer çok fazla çağrı olduysa son birkaç çağrıda true döndürerek döngüyü kır
      if (isValidSession.callCount > 15) {
        console.warn("Döngü kırılıyor - geçici olarak true döndürülüyor");
        return true;
      }
    }

    const userStr = sessionStorage.getItem("bookdashUser");
    if (!userStr) {
      console.log("Oturum bulunamadı: bookdashUser verisi yok");
      return false;
    }

    try {
      const user = JSON.parse(userStr);

      // Kullanıcı bilgilerini detaylı incele
      console.log(
        "Kullanıcı:",
        user ? user.name : "bilinmiyor",
        "Email:",
        user ? user.email : "yok",
        "Giriş durumu:",
        user ? user.isLoggedIn : false
      );

      if (!user) {
        console.log("Oturum geçersiz: Kullanıcı verisi boş");
        return false;
      }

      if (!user.isLoggedIn) {
        console.log("Oturum geçersiz: Kullanıcı giriş durumu false");
        return false;
      }

      // İsteğe bağlı: Oturum süresini kontrol et
      if (user.lastActivity) {
        const lastActivityTime = new Date(user.lastActivity).getTime();
        const currentTime = new Date().getTime();
        const sessionTimeout = 24 * 60 * 60 * 1000; // 24 saat

        const hoursPassed = (currentTime - lastActivityTime) / (60 * 60 * 1000);
        console.log(
          "Son aktiviteden bu yana geçen saat:",
          hoursPassed.toFixed(2)
        );

        if (currentTime - lastActivityTime > sessionTimeout) {
          console.log("Oturum süresi doldu");
          clearSession();
          return false;
        }
      }

      console.log("✅ Geçerli oturum bulundu");
      return true;
    } catch (parseError) {
      console.error(
        "Kullanıcı verisi JSON olarak ayrıştırılamadı:",
        parseError
      );
      console.log("Orijinal veri:", userStr);
      return false;
    }
  } catch (e) {
    console.error("Oturum kontrolü sırasında hata oluştu:", e);
    return false;
  }
}

/**
 * Oturum bilgilerini günceller
 */
function updateSessionActivity() {
  try {
    const user = JSON.parse(sessionStorage.getItem("bookdashUser"));
    if (user && user.isLoggedIn) {
      user.lastActivity = new Date().toISOString();
      sessionStorage.setItem("bookdashUser", JSON.stringify(user));
      console.log("Oturum etkinliği güncellendi");
    }
  } catch (e) {
    console.error("Oturum etkinliği güncellenirken hata oluştu:", e);
  }
}

/**
 * Oturum geçerli değilse login sayfasına yönlendirir
 * @param {boolean} inPagesFolder - Sayfanın pages klasöründe olup olmadığı
 * @returns {boolean} Oturum geçerli mi?
 */
function redirectIfNoSession(inPagesFolder) {
  // Redirect döngüsünü önlemek için static değişken
  if (redirectIfNoSession.isRedirecting) {
    console.log("Yönlendirme zaten devam ediyor, döngüyü engelliyoruz");
    return false;
  }

  // Oturumu kontrol edelim
  const isValid = isValidSession();
  console.log(
    "Oturum durumu kontrol ediliyor:",
    isValid ? "Geçerli" : "Geçersiz"
  );

  if (!isValid) {
    // Geçerli sayfa yolunu al
    const currentPath = window.location.pathname.toLowerCase();

    // Zaten login sayfasındaysa yönlendirme yapma (döngüyü önle)
    if (currentPath.includes("index.html") || currentPath.endsWith("/")) {
      console.log("Zaten login sayfasındasınız, yönlendirme yapılmıyor.");
      return false;
    }

    // Oturumu temizle
    clearSession();

    console.log(
      "Geçerli oturum bulunamadı, login sayfasına yönlendiriliyorsunuz."
    );

    // Yönlendirme kilidi aktif et
    redirectIfNoSession.isRedirecting = true;

    // Pages klasöründe mi yoksa ana dizinde mi olduğuna göre yönlendirme yap
    const loginPage = inPagesFolder ? "../index.html" : "index.html";

    // Yönlendirme işlemi
    setTimeout(function () {
      // Yönlendirmeyi sadece bir kez gerçekleştir
      window.location.replace(loginPage); // href yerine replace kullanarak tarayıcı geçmişini engelle

      // Kilidi belirli bir süre sonra kaldır (sayfanın yüklenmesi için süre tanı)
      setTimeout(function () {
        redirectIfNoSession.isRedirecting = false;
      }, 2000);
    }, 100);

    return false;
  }

  // Oturum geçerli, aktiviteyi güncelle
  updateSessionActivity();
  return true;
}

// Statik değer ataması (redirect döngüsünü önlemek için)
redirectIfNoSession.isRedirecting = false;

/**
 * LocalStorage'daki kullanıcı bilgilerini günceller
 * @param {Object} updatedUser - Güncellenmiş kullanıcı bilgileri
 */
function updateLocalStorageUser(updatedUser) {
  try {
    // LocalStorage'dan kayıtlı kullanıcıları al
    const users = JSON.parse(localStorage.getItem("bookdashUsers")) || [];

    // Kullanıcı e-posta adresiyle eşleşen kayıtlı kullanıcıyı bul
    const index = users.findIndex((user) => user.email === updatedUser.email);

    if (index !== -1) {
      // Mevcut kullanıcı bilgilerini koru ama güncellenen alanları uygula
      const existingUser = users[index];

      // Güncellenen alanları kopyala
      users[index] = {
        ...existingUser,
        name: updatedUser.name || existingUser.name,
        password: updatedUser.password || existingUser.password,
        bio: updatedUser.bio || existingUser.bio,
        phone: updatedUser.phone || existingUser.phone,
        address: updatedUser.address || existingUser.address,
        website: updatedUser.website || existingUser.website,
        social: updatedUser.social || existingUser.social,
        profileImage: updatedUser.profileImage || existingUser.profileImage,
        preferences: updatedUser.preferences || existingUser.preferences,
      };

      console.log(
        "Kullanıcı bilgileri localStorage'da güncellendi:",
        updatedUser.email
      );
    } else {
      console.warn(
        "Güncellenecek kullanıcı localStorage'da bulunamadı:",
        updatedUser.email
      );
    }

    // Güncellenmiş kullanıcılar listesini localStorage'a kaydet
    localStorage.setItem("bookdashUsers", JSON.stringify(users));
  } catch (e) {
    console.error("LocalStorage kullanıcı güncellemesi sırasında hata:", e);
  }
}
