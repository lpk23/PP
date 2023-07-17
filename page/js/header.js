document.addEventListener("DOMContentLoaded", function () {

  const logoutLink = document.getElementById("logout-link");
  logoutLink.addEventListener("click", function () {
    localStorage.removeItem("token");
  });
  const token = localStorage.getItem("token");
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `${token}`);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  fetch("api/account", requestOptions)
      .then(response => {
        if (response.ok) {
          return response.text();
        } else if (response.status === 401) {
          window.location.href = "/auth";
        } else {
          throw new Error('Ошибка при выполнении запроса');
        }
      })
      .then(result => {
        console.log(result);
      })
      .catch(error => console.log('error', error));

});
