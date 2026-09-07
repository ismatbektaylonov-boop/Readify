// signup.js — ro'yxatdan o'tish sahifasi uchun

$(function () {
  $("#signupForm").on("submit", function (e) {
    e.preventDefault();
    $("#formError").hide();

    const payload = {
      memberFullName: $("#memberFullName").val().trim(),
      memberNick: $("#memberNick").val().trim(),
      memberPhone: $("#memberPhone").val().trim(),
      memberPassword: $("#memberPassword").val(),
    };

    axios
      .post("/api/signup", payload)
      .then(function () {
        window.location.href = "/login";
      })
      .catch(function (err) {
        const message =
          (err.response && err.response.data && err.response.data.message) ||
          "Ro'yxatdan o'tishda xatolik yuz berdi.";
        showError("#formError", message);
      });
  });
});
