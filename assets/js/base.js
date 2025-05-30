/**
 * BookDash - Base Script
 * ----------------------
 * Bu script, tüm sayfalarda ortak olan temel işlevleri yönetir.
 */

/**
 * Tema kontrolü ve olay dinleyicileri
 */
document.addEventListener("DOMContentLoaded", function () {
  // Temayı kontrol et ve uygula
  checkAndApplyTheme();

  // Temayı tarayıcı tercihleriyle senkronize et
  syncThemeWithBrowser();
});

/**
 * Kayıtlı temayı kontrol eder ve uygular
 */
function checkAndApplyTheme() {
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
 * Temayı tarayıcı tercihleriyle senkronize eder
 */
function syncThemeWithBrowser() {
  if (window.matchMedia && !localStorage.getItem("bookdashTheme")) {
    // Tarayıcı koyu tema tercihini kontrol et
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (prefersDark) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("bookdashTheme", "dark");
    }

    // Tarayıcı tema tercihi değişikliğini dinle
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("bookdashTheme")) {
          if (e.matches) {
            document.documentElement.setAttribute("data-theme", "dark");
          } else {
            document.documentElement.removeAttribute("data-theme");
          }
        }
      });
  }
}
