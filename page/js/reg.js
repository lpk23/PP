document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("signupbtn").addEventListener("click", function (event) {
        event.preventDefault(); // Отменить стандартное поведение кнопки

        // Получение значений полей ввода
        var email = document.getElementById("email").value;
        var name = document.getElementById("name").value;
        var password = document.getElementById("password").value;

        // Создание объекта запроса
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/register", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        // Отправка данных на сервер
        xhr.send(JSON.stringify({name:name, email: email, password: password }));

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
