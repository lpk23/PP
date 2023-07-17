document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginButton").addEventListener("click", function (event) {
        event.preventDefault();
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/login", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({ email: email, password: password }));
        xhr.onload = function () {
            const response = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                showNotification("Успешно")
                localStorage.setItem('token',response.token);
                window.location.href = "/";
            } else if (xhr.status === 401) {
                showNotification(response.error);
            } else {
                showNotification(response.error);
            }
        };

        xhr.onerror = function () {
            console.log("Ошибка при выполнении запроса");
        };
    });

    var notificationBar = document.getElementById("notificationBar");
    var notificationMessage = document.getElementById("notificationMessage");

    function showNotification(message) {
        notificationMessage.textContent = message;
        notificationBar.style.display = "block";
        notificationBar.classList.add('shake');
        setTimeout(function() {
            notificationBar.style.display = "none";
        }, 3000);
    }

    notificationBar.style.display = "none";
});
