document.addEventListener("DOMContentLoaded", function () {
    var email = '';
    var token='';
    document.getElementById("resetButton").addEventListener("click", function (event) {
        event.preventDefault(); // Отменить стандартное поведение кнопки
        // Получение значений полей ввода
        email = document.getElementById("email").value;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/forgot-password", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        // Отправка данных на сервер
        xhr.send(JSON.stringify({email: email}));
        // Обработка ответа от сервера
        xhr.onload = function () {
            const response = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                showNotification("Успешно")
                document.getElementById("step2").hidden=false;
                document.getElementById("step1").hidden=true;
            } else if (xhr.status === 401) {
                showNotification(response.error);
            } else {
                showNotification(response.error);
            }
        };

        // Обработка ошибок
        xhr.onerror = function () {
            console.log("Ошибка при выполнении запроса");
            // Выполнить действия при ошибке
        };

        // Обработка ответа от сервера

    });
    document.getElementById("resetcodeButton").addEventListener("click", function (event) {
        event.preventDefault(); // Отменить стандартное поведение кнопки
        // Получение значений полей ввода
        var code = document.getElementById("code").value;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/verify-reset-code", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        // Отправка данных на сервер
        xhr.send(JSON.stringify({email: email,resetCode:code}));
        // Обработка ответа от сервера
        xhr.onload = function () {
            const response = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                showNotification("Успешно")
                token=response.token
                document.getElementById("step3").hidden=false;
                document.getElementById("step2").hidden=true;
            } else if (xhr.status === 401) {
                showNotification(response.error);
            } else {
                showNotification(response.error);
            }
        };

        // Обработка ошибок
        xhr.onerror = function () {
            console.log("Ошибка при выполнении запроса");
            // Выполнить действия при ошибке
        };

        // Обработка ответа от сервера

    });
    document.getElementById("resetpasswordButton").addEventListener("click", function (event) {
        event.preventDefault(); // Отменить стандартное поведение кнопки
        // Получение значений полей ввода
        var password = document.getElementById("password").value;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/reset-password", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        // Отправка данных на сервер
        xhr.send(JSON.stringify({token: token,newPassword:password}));
        // Обработка ответа от сервера
        xhr.onload = function () {
            const response = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                showNotification("Успешно")
                window.location.href = "auth";
            } else if (xhr.status === 401) {
                showNotification(response.error);
            } else {
                showNotification(response.error);
            }
        };

        // Обработка ошибок
        xhr.onerror = function () {
            console.log("Ошибка при выполнении запроса");
            // Выполнить действия при ошибке
        };

        // Обработка ответа от сервера

    });
    var notificationBar = document.getElementById("notificationBar");
    var notificationMessage = document.getElementById("notificationMessage");

    function showNotification(message) {
        notificationMessage.textContent = message;
        notificationBar.style.display = "block";
        // Добавляем класс с анимацией
        notificationBar.classList.add('shake');
        setTimeout(function() {
            notificationBar.style.display = "none";
        }, 3000);
    }

    // Пример использования
    // showNotification("Привет! Это плашка с сообщением.");
    notificationBar.style.display = "none";
});