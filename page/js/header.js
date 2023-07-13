document.addEventListener("DOMContentLoaded", function () {

  const logoutLink = document.getElementById("logout-link");
  logoutLink.addEventListener("click", function () {
    localStorage.removeItem("token");
  });
});
