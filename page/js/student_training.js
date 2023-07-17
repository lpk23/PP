document.addEventListener("DOMContentLoaded", function () {
const directionCodeInput = document.getElementById('directionCode');
const directionNameInput = document.getElementById('directionName');
const directionDropdown = document.getElementById('directionDropdown');

directionCodeInput.addEventListener('click', handleDirectionCodeInput);

// Обработчик события ввода значения в поле "Код направления"
function handleDirectionCodeInput() {
    const directionCodeValue = directionCodeInput.value;
    directionNameInput.removeAttribute('disabled');
    directionCodeInput.removeAttribute('data-record-id');
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem('token'));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("/api/training", requestOptions)
        .then(response => response.json())
        .then(result => {
            populateDirectionCodeDropdown(result);
            console.log(result);
            directionDropdown.style.display = 'block';
        })
        .catch(error => {
            // Обработка ошибок
            console.error('error', error);
        });
}


document.addEventListener('click', function(event) {
    const isClickInsideInput = directionCodeInput.contains(event.target);
    const isClickInsideDropdown = directionDropdown.contains(event.target);

    if (!isClickInsideInput && !isClickInsideDropdown) {
        directionDropdown.style.display = 'none';
    }
    // Функция для получения данных из API

});
    function fetchData(url) {
        const myHeaders = new Headers();
        myHeaders.append("authorization", localStorage.getItem("token"));
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
        return fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Обработка данных здесь
                return data;
            })
            .catch(error => console.log('Ошибка:', error));
    }
    function populateDirectionCodeDropdown(data) {
        const dropdownMenu = document.getElementById('directionCodeDropdown');
        dropdownMenu.innerHTML = '';

        if (data.length > 0) {
            data.forEach(item => {
                const option = document.createElement('li');
                option.classList.add('dropdown-item');
                option.innerText = `${item.code} - ${item.name}`;
                option.addEventListener('click', () => {
                    directionCodeInput.value = item.code;
                    directionCodeInput.setAttribute('data-record-id',item.id);
                    directionNameInput.value = item.name;
                    directionNameInput.setAttribute('disabled','True')
                    dropdownMenu.classList.remove('show'); // Скрываем выпадающий список при выборе элемента
                });
                dropdownMenu.appendChild(option);
            });
            dropdownMenu.classList.add('show'); // Показываем выпадающий список
            dropdownMenu.style.overflowY = 'auto'; // Добавляем вертикальную прокрутку
            dropdownMenu.style.maxHeight = '200px'; // Устанавливаем максимальную высоту списка
        } else {
            const message = document.createElement('li');
            message.classList.add('dropdown-item');
            message.innerText = 'Нет данных';
            dropdownMenu.appendChild(message);
            dropdownMenu.classList.remove('show'); // Скрываем выпадающий список, так как нет элементов для отображения
        }
    }
});