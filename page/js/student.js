document.addEventListener("DOMContentLoaded", function () {
    const editButtons = document.querySelectorAll('.btn-edit');
    const deleteButtons = document.querySelectorAll('.btn-delete');
    const kladrmodal = document.getElementById('kladrModal');
    const kbootstrapModal = new bootstrap.Modal(kladrmodal);
    // Добавляем обработчики событий для кнопок редактирования
    editButtons.forEach((button) => {
        button.addEventListener('click', handleEdit);
    });

    // Добавляем обработчики событий для кнопок удаления
    deleteButtons.forEach((button) => {
        button.addEventListener('click', handleDelete);
    });

    // Обработчик клика по кнопке редактирования
    function handleEdit() {
        // Обработка функционала редактирования здесь
    }

    // Обработчик клика по кнопке удаления
    function handleDelete() {
        // Обработка функционала удаления здесь
    }

    const directionCodeInput = document.getElementById('directionCode');
    const directionNameInput = document.getElementById('directionName');
    directionCodeInput.addEventListener('click', handleDirectionCodeInput);

    // Обработчик события ввода значения в поле "Код направления"
    function handleDirectionCodeInput() {
        const directionCodeValue = directionCodeInput.value;
        directionNameInput.removeAttribute('disabled')
        directionCodeInput.removeAttribute('data-record-id')
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
                populateDirectionCodeDropdown(result)
                console.log(result);
            })
            .catch(error => {
                // Обработка ошибок
                console.error('error', error);
            });
    }


    const districtInput = document.getElementById('district');
    districtInput.addEventListener('input', handleDistrictInput);

    const cityInput = document.getElementById('city');
    cityInput.addEventListener('input', handleCityInput);

    const settlementInput = document.getElementById('settlement');
    settlementInput.addEventListener('input', handleSettlementInput);

    const streetInput = document.getElementById('street');
    streetInput.addEventListener('input', handleStreetInput);


    var region_id;
    var city_id;
    var street_id;

    // Обработчик события ввода значения в поле "Регион"
    function handleDistrictInput() {
        const districtValue = districtInput.value;
        if (districtValue.trim() !== '') {
            const params = {
                contentType: 'region',
                limit: '5',
                query: districtValue
            };
            const kladrURL = buildURL('http://localhost:3000/api/kladr', params);
            fetchData(kladrURL)
                .then(response => {
                    // Обработка данных ответа
                    populateDropdown(response.result, 'district');
                })
                .catch(error => {
                    // Обработка ошибок
                    console.error(error);
                });
        }
    }

    // Обработчик события ввода значения в поле "Город"
    function handleCityInput() {
        const cityValue = cityInput.value;
        if (cityValue.trim() !== '') {
            const params = {
                contentType: 'city',
                ParentType: 'region',
                ParentId: region_id,
                limit: '5',
                query: cityValue
            };
            const kladrURL = buildURL('http://localhost:3000/api/kladr', params);
            fetchData(kladrURL)
                .then(response => {
                    // Обработка данных ответа
                    populateDropdown(response.result, 'city');
                })
                .catch(error => {
                    // Обработка ошибок
                    console.error(error);
                });
        }
    }

    // Обработчик события ввода значения в поле "Населённый пункт"
    function handleSettlementInput() {
        const settlementValue = settlementInput.value;
        if (settlementValue.trim() !== '') {
            const params = {
                contentType: 'settlement',
                ParentType: 'region',
                ParentId: region_id,
                limit: '5',
                query: settlementValue
            };
            const kladrURL = buildURL('http://localhost:3000/api/kladr', params);
            fetchData(kladrURL)
                .then(response => {
                    // Обработка данных ответа
                    populateDropdown(response.result, 'settlement');
                })
                .catch(error => {
                    // Обработка ошибок
                    console.error(error);
                });
        }
    }

    // Обработчик события ввода значения в поле "Улица"
    function handleStreetInput() {
        const streetValue = streetInput.value;
        if (streetValue.trim() !== '') {
            const params = {
                contentType: 'street',
                ParentType: 'city',
                ParentId: city_id,
                limit: '5',
                query: streetValue
            };
            const kladrURL = buildURL('http://localhost:3000/api/kladr', params);
            fetchData(kladrURL)
                .then(response => {
                    // Обработка данных ответа
                    populateDropdown(response.result, 'street');
                })
                .catch(error => {
                    // Обработка ошибок
                    console.error(error);
                });
        }
    }

    // Функция для создания URL с параметрами
    function buildURL(baseURL, params) {
        const url = new URL(baseURL);

        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });

        return url.toString();
    }

    // Функция для получения данных из API
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

    // Функция для заполнения выпадающего списка данными
    function populateDropdown(data, inputType) {
        const dropdownMenu = document.getElementById(`${inputType}Dropdown`);
        dropdownMenu.innerHTML = '';

        if (data.length > 0) {
            data.forEach(item => {
                const option = document.createElement('a');
                option.classList.add('dropdown-item');
                option.innerText = item.name + ' ' + item.typeShort;
                option.addEventListener('click', () => {
                    if (inputType === 'district') {
                        districtInput.value = item.name + ' ' + item.typeShort;
                        region_id = item.id;
                        document.getElementById('city').removeAttribute('disabled');
                        document.getElementById('settlement').removeAttribute('disabled');
                    } else if (inputType === 'city') {
                        cityInput.value = item.name + ' ' + item.typeShort;
                        city_id = item.id;
                        document.getElementById('street').removeAttribute('disabled');
                        document.getElementById('settlement').setAttribute('disabled',true);
                    } else if (inputType === 'settlement') {
                        settlementInput.value = item.name + ' ' + item.typeShort;
                        document.getElementById('street').removeAttribute('disabled');
                        document.getElementById('city').setAttribute('disabled',true);
                    } else if (inputType === 'street') {
                        street_id = item.id
                        streetInput.value = item.name + ' ' + item.typeShort;
                        document.getElementById('house').removeAttribute('disabled');
                    } else if (inputType === 'house') {
                        buildingInput.value = item.name + ' ' + item.typeShort;

                    }
                    dropdownMenu.classList.remove('show'); // Скрываем выпадающий список при выборе элемента
                });
                dropdownMenu.appendChild(option);
            });
            dropdownMenu.classList.add('show'); // Показываем выпадающий список
        } else {
            const message = document.createElement('a');
            message.classList.add('dropdown-item');
            message.innerText = `${inputType === 'district' ? 'Регион' : inputType} не найден`;
            dropdownMenu.appendChild(message);
            dropdownMenu.classList.remove('show'); // Скрываем выпадающий список, так как нет элементов для отображения
        }
    }

    const kladrButton = document.getElementById('kladrButton');
    kladrButton.addEventListener('click', () => {
        kbootstrapModal.show();
    });

    const kladrSubmitButton = document.getElementById('kladrSubmitButton');
    kladrSubmitButton.addEventListener('click', () => {
        const district = document.getElementById('district').value;
        const city = document.getElementById('city').value;
        const settlement = document.getElementById('settlement').value;
        const street = document.getElementById('street').value;
        const building = document.getElementById('house').value;

        const address = settlement === '' ? `${district}, ${city}, ${street}, ${building}` : `${district}, ${settlement}, ${street}, ${building}`;

        // Закрываем модальное окно
        kbootstrapModal.hide();
        document.getElementById('address').value = address;
    });


    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', () => {
        // Код для сохранения данных студента
        alert('Сохранение данных студента');
    });
});