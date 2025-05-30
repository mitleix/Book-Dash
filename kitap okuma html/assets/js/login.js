/**
 * BookDash - Login Script
 * -----------------------
 * Bu script, kullanıcı girişi işlemlerini yönetir.
 */

document.addEventListener("DOMContentLoaded", function () {
  // Form submit olayını dinle
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Şifremi unuttum linki
  const forgotPasswordLink = document.getElementById("forgotPassword");
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", handleForgotPassword);
  }

  // Oturum kontrolü
  checkSession();
});

/**
 * Login form gönderimini işler
 * @param {Event} e - Form submit olayı
 */
function handleLogin(e) {
  e.preventDefault();

  // Form değerlerini al
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Basit validasyon
  if (!email || !password) {
    showError("Lütfen tüm alanları doldurun.");
    return;
  }

  console.log("Giriş deneniyor:", email); // Debug

  // Önce localStorage'daki kayıtlı kullanıcıları kontrol et
  let registeredUsers = JSON.parse(localStorage.getItem("bookdashUsers")) || [];

  // Eğer localStorage'da hiç kayıtlı kullanıcı yoksa varsayılan kullanıcıları ekle
  if (registeredUsers.length === 0) {
    registeredUsers = [
      {
        email: "demo@bookdash.com",
        password: "123456",
        name: "Demo Kullanıcı",
        userType: "student",
      },
      {
        email: "teacher@bookdash.com",
        password: "123456",
        name: "Öğretmen Demo",
        userType: "teacher",
      },
      {
        email: "user@bookdash.com",
        password: "123456",
        name: "Bireysel Demo",
        userType: "individual",
      },
    ];

    // Varsayılan kullanıcıları localStorage'a kaydet
    localStorage.setItem("bookdashUsers", JSON.stringify(registeredUsers));
  }

  console.log("Kayıtlı kullanıcı sayısı:", registeredUsers.length); // Debug

  // Giriş yapan kullanıcıyı kontrol et
  const user = registeredUsers.find(
    (user) => user.email === email && user.password === password
  );

  console.log("Kullanıcı bulundu:", !!user); // Debug

  if (user) {
    // Kullanıcının mevcut tüm bilgilerini sessionStorage'a kaydet
    const sessionUser = {
      email: user.email,
      name: user.name,
      userType: user.userType,
      isLoggedIn: true,
      lastActivity: new Date().toISOString(),
      bio: user.bio || "",
      phone: user.phone || "",
      address: user.address || "",
      website: user.website || "",
      social: user.social || {},
      profileImage: user.profileImage || "",
      password: user.password || "",
      preferences: user.preferences || {},
    };

    // Session Storage'a kaydet
    sessionStorage.setItem("bookdashUser", JSON.stringify(sessionUser));
    console.log("Oturum başarıyla oluşturuldu"); // Debug

    // Başarılı giriş mesajı
    Swal.fire({
      icon: "success",
      title: "Giriş Başarılı!",
      text: `Hoş geldiniz, ${user.name}!`,
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      // Dashboard'a yönlendir
      window.location.href = "dashboard.html";
    });
  } else {
    showError("E-posta veya şifre hatalı!");
    console.log("Giriş başarısız: Kullanıcı bulunamadı"); // Debug
  }
}

/**
 * Şifremi unuttum işlemini yönetir
 * @param {Event} e - Tıklama olayı
 */
function handleForgotPassword(e) {
  e.preventDefault();

  Swal.fire({
    title: "Şifrenizi mi unuttunuz?",
    text: "E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim.",
    input: "email",
    inputPlaceholder: "E-posta adresiniz",
    showCancelButton: true,
    confirmButtonText: "Gönder",
    cancelButtonText: "İptal",
    showLoaderOnConfirm: true,
    preConfirm: (email) => {
      if (!email) {
        Swal.showValidationMessage("Lütfen e-posta adresinizi girin");
        return false;
      }
      // API isteği simülasyonu
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(email);
        }, 1000);
      });
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: "Bağlantı gönderildi!",
        text: `${result.value} adresine şifre sıfırlama bağlantısı gönderdik.`,
      });
    }
  });
}

/**
 * Hata mesajı gösterir
 * @param {string} message - Gösterilecek hata mesajı
 */
function showError(message) {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
  });
}

/**
 * Aktif oturumu kontrol eder ve varsa yönlendirir
 */
function checkSession() {
  try {
    // Session-helper.js'deki isValidSession fonksiyonunu kullan
    if (typeof isValidSession === "function" && isValidSession()) {
      // Şu anki URL'yi kontrol et - zaten dashboard'daysa bir şey yapma
      const currentPath = window.location.pathname.toLowerCase();
      if (!currentPath.includes("dashboard.html")) {
        console.log("Aktif oturum bulundu, dashboard'a yönlendiriliyor");
        window.location.href = "dashboard.html"; // replace yerine href kullanıldı
      }
    } else {
      // Geçersiz oturum bilgileri varsa temizle
      if (sessionStorage.getItem("bookdashUser")) {
        console.log("Geçersiz oturum bilgisi temizleniyor");
        if (typeof clearSession === "function") {
          clearSession();
        } else {
          sessionStorage.removeItem("bookdashUser");
        }
      }
    }
  } catch (e) {
    console.error("Oturum kontrolü sırasında hata oluştu:", e);
    // Hata durumunda session'ı temizle
    if (typeof clearSession === "function") {
      clearSession();
    } else {
      sessionStorage.removeItem("bookdashUser");
    }
  }
}
