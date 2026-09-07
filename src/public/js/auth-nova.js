// auth-nova.js — login sahifasi uchun

$(function () {
  $("#loginForm").on("submit", function (e) {
    e.preventDefault();
    $("#formError").hide();

    const payload = {
      memberNick: $("#memberNick").val().trim(),
      memberPassword: $("#memberPassword").val(),
    };

    axios
      .post("/api/login", payload)
      .then(function () {
        window.location.href = "/";
      })
      .catch(function (err) {
        const message =
          (err.response && err.response.data && err.response.data.message) ||
          "Kirishda xatolik yuz berdi.";
        showError("#formError", message);
      });
  });
});
