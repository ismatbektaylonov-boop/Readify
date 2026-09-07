// main.js — barcha sahifalar uchun umumiy yordamchi funksiyalar

axios.defaults.headers.common["Content-Type"] = "application/json";

/** Statusni chiroyli belgi (tag) sifatida render qilish */
function renderStatusTag(status) {
  const labels = {
    PENDING: "Kutilmoqda",
    APPROVE: "Tasdiqlangan",
    REJECT: "Rad etilgan",
    RETURNED: "Qaytarilgan",
  };
  return `<span class="status-tag status-${status}">${labels[status] || status}</span>`;
}

/** Xatolik xabarini ko'rsatish */
function showError(selector, message) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.textContent = message;
  el.style.display = "block";
}

$(function () {
  $("#logoutBtn").on("click", function (e) {
    e.preventDefault();
    axios
      .post("/api/logout")
      .then(() => (window.location.href = "/"))
      .catch(() => (window.location.href = "/"));
  });
});
