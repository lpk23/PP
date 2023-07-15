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

    // Обработчик события изменения выбранного статуса занятости
    const employmentStatusSelect = document.getElementById('employmentStatus');
    employmentStatusSelect.addEventListener('change', handleEmploymentStatusChange);

// Функция для обработки изменения выбранного статуса занятости
    function handleEmploymentStatusChange() {
        const employmentFieldsDiv = document.getElementById('employmentFields');
        employmentFieldsDiv.innerHTML = ''; // Очищаем предыдущие поля

        const selectedStatus = employmentStatusSelect.value;

        if (selectedStatus === 'employed') {
            // Добавить поля для трудовой деятельности
            employmentFieldsDiv.innerHTML = `
      <div class="form-group">
        <label for="workBook">Наличие трудовой книжки</label>
        <input id="workBook" class="form-control" type="checkbox">
      </div>
      <div class="form-group">
        <label for="workPlace">Место работы (полное название организации, ОКВЭД, ИНН, регион регистрации)</label>
        <input id="workPlace" class="form-control" type="text" placeholder="Например: ООО 'Рога и копыта', 123456789, 0123456789, Москва">
      </div>
      <div class="form-group">
        <label for="position">Должность</label>
        <input id="position" class="form-control" type="text" placeholder="Должность">
      </div>
    `;
        } else if (selectedStatus === 'selfEmployed') {
            // Добавить поле для рода деятельности
            employmentFieldsDiv.innerHTML = `
      <div class="form-group">
        <label for="activityType">Род деятельности</label>
        <input id="activityType" class="form-control" type="text" placeholder="Род деятельности">
      </div>
    `;
        } else if (selectedStatus === 'unemployed') {
            // Добавить поле для даты постановки на учет
            employmentFieldsDiv.innerHTML = `
      <div class="form-group">
        <label for="registrationDate">Дата постановки на учет</label>
        <input id="registrationDate" class="form-control" type="date">
      </div>
    `;
        } else if (selectedStatus === 'militaryService') {
            // Добавить поля для службы в ВС
            employmentFieldsDiv.innerHTML = `
      <div class="form-group">
        <label for="militaryLocation">Где служит</label>
        <input id="militaryLocation" class="form-control" type="text" placeholder="Где служит">
      </div>
      <div class="form-group">
        <label for="militaryPosition">Звание и должность</label>
        <input id="militaryPosition" class="form-control" type="text" placeholder="Звание и должность">
      </div>
    `;
        }
    }

// Обработчик события нажатия кнопки "Сохранить"
    const saveRecordButton = document.getElementById('saveRecordButton');
    saveRecordButton.addEventListener('click', handleSaveRecord);

// Функция для обработки изменения выбранного статуса занятости
    function handleEmploymentStatusChange() {
        const employmentFieldsDiv = document.getElementById('employmentFields');
        employmentFieldsDiv.innerHTML = ''; // Очищаем предыдущие поля

        const selectedStatus = employmentStatusSelect.value;

        if (selectedStatus === 'employed') {
            // Добавить поля для работы
            employmentFieldsDiv.innerHTML = `
      <div class="form-group">
        <label for="workBook">Наличие трудовой книжки</label>
        <input id="workBook" class="form-control" type="checkbox">
      </div>
      <div class="form-group">
        <label for="workPlace">Место работы</label>
        <input id="workPlace" class="form-control" type="text" placeholder="Полное название организации">
      </div>
      <div class="form-group">
        <label for="okved">ОКВЭД</label>
        <input id="okved" class="form-control" type="text" placeholder="ОКВЭД">
      </div>
      <div class="form-group">
        <label for="inn">ИНН</label>
        <input id="inn" class="form-control" type="text" placeholder="ИНН">
      </div>
      <div class="form-group">
        <label for="region">Регион регистрации</label>
        <input id="region" class="form-control" type="text" placeholder="Регион">
      </div>
      <div class="form-group">
        <label for="position">Должность</label>
        <input id="position" class="form-control" type="text" placeholder="Должность">
      </div>
      <div class="form-group">
        <label for="employmentDate">Дата трудоустройства</label>
        <input id="employmentDate" class="form-control" type="date">
      </div>
    `;
        } else if (selectedStatus === 'selfEmployed') {
            // Добавить поле для рода деятельности
            employmentFieldsDiv.innerHTML = `
      <div class="form-group">
        <label for="activityType">Род деятельности</label>
        <input id="activityType" class="form-control" type="text" placeholder="Род деятельности">
      </div>
      <div class="form-group">
        <label for="employmentDate">Дата самозанятости</label>
        <input id="employmentDate" class="form-control" type="date">
      </div>
    `;
        } else if (selectedStatus === 'unemployed') {
            // Добавить поле для даты постановки на учет
            employmentFieldsDiv.innerHTML = `
      <div class="form-group">
        <label for="registrationDate">Дата постановки на учет</label>
        <input id="registrationDate" class="form-control" type="date">
      </div>
    `;
        } else if (selectedStatus === 'militaryService') {
            // Добавить поля для службы в ВС
            employmentFieldsDiv.innerHTML = `
      <div class="form-group">
        <label for="militaryLocation">Место службы</label>
        <input id="militaryLocation" class="form-control" type="text" placeholder="Место службы">
      </div>
      <div class="form-group">
        <label for="militaryPosition">Звание и должность</label>
        <input id="militaryPosition" class="form-control" type="text" placeholder="Звание и должность">
      </div>
      <div class="form-group">
        <label for="employmentDate">Дата поступления на службу</label>
        <input id="employmentDate" class="form-control" type="date">
      </div>
    `;
        }
    }


// Функция для обработки нажатия кнопки "Сохранить"
    function handleSaveRecord() {
        // Получение значений полей в зависимости от выбранного статуса занятости
        const selectedStatus = employmentStatusSelect.value;
        let employmentData = {};

        if (selectedStatus === 'employed') {
            const workBookCheckbox = document.getElementById('workBook');
            const workPlaceInput = document.getElementById('workPlace');
            const okvedInput = document.getElementById('okved');
            const innInput = document.getElementById('inn');
            const regionInput = document.getElementById('region');
            const positionInput = document.getElementById('position');
            const employmentDateInput = document.getElementById('employmentDate');

            employmentData = {
                status: 'Трудоустройство',
                workBook: workBookCheckbox.checked,
                workPlace: workPlaceInput.value,
                okved: okvedInput.value,
                inn: innInput.value,
                region: regionInput.value,
                position: positionInput.value,
                date: employmentDateInput.value
            };
        } else if (selectedStatus === 'selfEmployed') {
            const activityTypeInput = document.getElementById('activityType');
            const employmentDateInput = document.getElementById('employmentDate');

            employmentData = {
                status: 'Самозанятый',
                activityType: activityTypeInput.value,
                date: employmentDateInput.value
            };
        } else if (selectedStatus === 'unemployed') {
            const registrationDateInput = document.getElementById('registrationDate');

            employmentData = {
                status: 'Безработный',
                date: registrationDateInput.value
            };
        } else if (selectedStatus === 'militaryService') {
            const militaryLocationInput = document.getElementById('militaryLocation');
            const militaryPositionInput = document.getElementById('militaryPosition');
            const employmentDateInput = document.getElementById('employmentDate');

            employmentData = {
                status: 'Служба в ВС',
                militaryLocation: militaryLocationInput.value,
                militaryPosition: militaryPositionInput.value,
                date: employmentDateInput.value
            };
        }

        // Сохранение данных во временный массив
        employmentHistory.push(employmentData);

        // Очистка полей формы
        clearForm();

        // Обновление таблицы
        updateTable();
    }

// Функция для очистки полей формы
    function clearForm() {
        const employmentFieldsDiv = document.getElementById('employmentFields');
        employmentFieldsDiv.innerHTML = '';
    }

// Функция для обновления таблицы
    function updateTable() {
        const employmentHistoryTable = document.getElementById('employmentHistory');

        // Очистка таблицы
        employmentHistoryTable.innerHTML = `
    <thead>
      <tr>
        <th scope="col">Дата смены статуса</th>
        <th scope="col">Статус</th>
        <th scope="col">Действия</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

        const employmentHistoryBody = employmentHistoryTable.querySelector('tbody');

        // Добавление записей в таблицу
        employmentHistory.forEach((employment, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
      <td>${convertDateFormat(employment.date)}</td>
      <td>${getEmploymentStatusText(employment)}</td>
      <td>
        <button class="btn btn-primary btn-edit" data-index="${index}">Редактировать</button>
        <button class="btn btn-danger btn-delete" data-index="${index}">Удалить</button>
      </td>
    `;
            employmentHistoryBody.appendChild(row);
        });
    }

// Функция для получения текстового представления статуса занятости
    function getEmploymentStatusText(employment) {
        if (employment.status === 'Трудоустройство') {
            return `Трудоустройство в ${employment.workPlace}, должность - ${employment.position}`;
        } else if (employment.status === 'Самозанятый') {
            return `Самозанятый, род деятельности - ${employment.activityType}`;
        } else if (employment.status === 'Безработный') {
            return `Безработный, поставлен на учет`;
        } else if (employment.status === 'Служба в ВС') {
            return `Служба в ВС, ${employment.militaryLocation}, должность - ${employment.militaryPosition}`;
        }
    }

    function convertDateFormat(dateString) {
        const parts = dateString.split('-');
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];

        return `${day}.${month}.${year}`;
    }
// Массив для хранения истории занятости
    const employmentHistory = [];


});