/**
 * BookDash - Register Script
 * -------------------------
 * Bu script, yeni kullanıcı kayıt işlemlerini yönetir.
 */

document.addEventListener("DOMContentLoaded", function () {
  // Form submit olayını dinle
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  // Oturum kontrolü
  checkSession();
});

/**
 * Register form gönderimini işler
 * @param {Event} e - Form submit olayı
 */
function handleRegister(e) {
  e.preventDefault();

  // Form değerlerini al
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const birthDate = document.getElementById("birthDate").value;
  const gender = document.getElementById("gender").value;
  const userType = document.getElementById("userType").value;
  const agreeTerms = document.getElementById("agreeTerms").checked;

  // Validasyon kontrolleri
  if (
    !fullName ||
    !email ||
    !password ||
    !confirmPassword ||
    !birthDate ||
    !gender ||
    !userType
  ) {
    showError("Lütfen tüm alanları doldurun.");
    return;
  }

  if (password !== confirmPassword) {
    showError("Şifreler eşleşmiyor!");
    return;
  }

  if (password.length < 6) {
    showError("Şifre en az 6 karakter olmalıdır.");
    return;
  }

  if (!agreeTerms) {
    showError("Devam etmek için şartları kabul etmelisiniz.");
    return;
  }

  // Email format kontrolü
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError("Lütfen geçerli bir e-posta adresi girin.");
    return;
  }

  // Gerçek uygulamada burada API'ye kayıt isteği gönderilir
  // Demo amaçlı, başarılı kayıt simülasyonu yapıyoruz

  // Yükleniyor animasyonu göster
  Swal.fire({
    title: "Kaydınız yapılıyor...",
    html: "Lütfen bekleyin...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  // API isteği simülasyonu
  setTimeout(() => {
    // Kullanıcı bilgilerini session storage'a kaydet
    sessionStorage.setItem(
      "bookdashUser",
      JSON.stringify({
        email: email,
        name: fullName,
        userType: userType,
        isLoggedIn: true,
      })
    );

    // Başarılı kayıt mesajı
    Swal.fire({
      icon: "success",
      title: "Kayıt Başarılı!",
      text: `Hoş geldiniz, ${fullName}!`,
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      // Dashboard'a yönlendir
      window.location.href = "dashboard.html";
    });
  }, 1500);
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
        window.location.href = "dashboard.html"; // replace yerine href kullan
      }
    }
  } catch (e) {
    console.error("Oturum kontrolü sırasında hata:", e);
  }
}
