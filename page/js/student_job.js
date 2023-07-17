let employmentHistory = [];
document.addEventListener("DOMContentLoaded", function () {
    // Получаем элемент выбора статуса занятости
    const employmentStatusSelect = document.getElementById('employmentStatus');
    // Добавляем обработчик события изменения выбранного статуса занятости
    employmentStatusSelect.addEventListener('change', handleEmploymentStatusChange);

    // Получаем контейнер для полей занятости
    const employmentFieldsDiv = document.getElementById('employmentFields');
    // Получаем кнопку "Сохранить"
    const saveRecordButton = document.getElementById('saveRecordButton');
    // Добавляем обработчик события нажатия кнопки "Сохранить"
    saveRecordButton.addEventListener('click', handleSaveRecord);


    // Функция для обработки изменения выбранного статуса занятости
    function handleEmploymentStatusChange() {
        const selectedStatus = employmentStatusSelect.value;
        // Очищаем контейнер для полей занятости
        employmentFieldsDiv.innerHTML = '';

        if (selectedStatus === 'employed') {
            // Добавляем поля для трудоустройства
            addEmployedFields();
        } else if (selectedStatus === 'selfEmployed') {
            // Добавляем поле для самозанятых
            addSelfEmployedFields();
        } else if (selectedStatus === 'unemployed') {
            // Добавляем поле для безработных
            addUnemployedFields();
        } else if (selectedStatus === 'militaryService') {
            // Добавляем поля для службы в ВС
            addMilitaryServiceFields();
        }
    }

    // Функция для добавления полей для трудоустройства
    function addEmployedFields() {
        employmentFieldsDiv.innerHTML = `
<div class="form-group">
    <label for="workBook">Наличие трудовой книжки</label>
    <select id="workBook" class="form-control">
        <option value="yes">Есть</option>
        <option value="no">Нет</option>
    </select>
</div>

      <div class="form-group">
    <label for="workPlace">Место работы</label>
    <input id="workPlace" class="form-control" type="text" placeholder="Полное название организации">
    <div class="dropdown-menu" id="workPlaceDropdown" aria-labelledby="workPlace"></div>
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

        const workPlaceInput = document.getElementById('workPlace');
        workPlaceInput.addEventListener('input', handleWorkPlaceInput);

        // Обработчик события ввода для поля "Место работы"
        function handleWorkPlaceInput() {
            const workPlaceValue = workPlaceInput.value.trim();
            const params = {
                value: workPlaceValue,
                attribute: 'name'
            };

            // Удаляем атрибут "disabled" у полей ОКВЭД, ИНН и региона
            document.getElementById('okved').removeAttribute('disabled');
            document.getElementById('inn').removeAttribute('disabled');
            document.getElementById('region').removeAttribute('disabled');
            document.getElementById('workPlace').removeAttribute('data-record-id');

            const apiUrl = buildURL('/api/search/employer', params);
            fetchData(apiUrl)
                .then(response => {
                    populateDropdownWork(response, 'workPlace');
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    // Функция для добавления поля для самозанятых
    function addSelfEmployedFields() {
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
    }

    // Функция для добавления поля для безработных
    function addUnemployedFields() {
        employmentFieldsDiv.innerHTML = `
            <div class="form-group">
                <label for="registrationDate">Дата постановки на учет</label>
                <input id="registrationDate" class="form-control" type="date">
            </div>
        `;
    }

    // Функция для добавления полей для службы в ВС
    function addMilitaryServiceFields() {
        employmentFieldsDiv.innerHTML = `
            <div class="form-group">
                <label for="militaryLocation">Где служит</label>
                <input id="militaryLocation" class="form-control" type="text" placeholder="Где служит">
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

    // Функция для обработки изменения выбранного статуса занятости
    function handleEmploymentStatusChangeEdit() {
        const selectedStatus = employmentStatusSelect.value;
        // Очищаем контейнер для полей занятости
        employmentFieldsDivEdit.innerHTML = '';

        if (selectedStatus === 'employed') {
            // Добавляем поля для трудоустройства
            addEmployedFieldsEdit();
        } else if (selectedStatus === 'selfEmployed') {
            // Добавляем поле для самозанятых
            addSelfEmployedFieldsEdit();
        } else if (selectedStatus === 'unemployed') {
            // Добавляем поле для безработных
            addUnemployedFieldsEdit();
        } else if (selectedStatus === 'militaryService') {
            // Добавляем поля для службы в ВС
            addMilitaryServiceFieldsEdit();
        }
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
                return data;
            })
            .catch(error => console.log('Ошибка:', error));
    }

    // Функция для заполнения выпадающего меню для места работы
    function populateDropdownWork(data, inputType) {
        const dropdownMenu = document.getElementById(`${inputType}Dropdown`);
        dropdownMenu.innerHTML = '';

        if (data.length > 0) {
            data.forEach(item => {
                const option = document.createElement('a');
                option.classList.add('dropdown-item');
                option.innerText = item.name + ' ОКВЭД: ' + item.okved + ' ИНН: ' + item.inn;
                option.addEventListener('click', () => {
                    document.getElementById('workPlace').value = item.name;
                    document.getElementById('okved').value = item.okved;
                    document.getElementById('okved').setAttribute('disabled', 'True')
                    document.getElementById('inn').value = item.inn;
                    document.getElementById('inn').setAttribute('disabled', 'True')
                    document.getElementById('region').value = item.regionname;
                    document.getElementById('region').setAttribute('disabled', 'True')
                    document.getElementById('workPlace').setAttribute('data-record-id', item.id)
                    dropdownMenu.classList.remove('show');
                });
                dropdownMenu.appendChild(option);
            });
            dropdownMenu.classList.add('show');
        } else {
            dropdownMenu.classList.remove('show');
        }
    }

    // Функция для обработки нажатия кнопки "Сохранить"
    function handleSaveRecord() {
        // Получение значений полей в зависимости от выбранного статуса занятости
        const selectedStatus = employmentStatusSelect.value;
        let employmentData = {};

        if (selectedStatus === 'employed') {
            employmentData = getEmployedData();
        } else if (selectedStatus === 'selfEmployed') {
            employmentData = getSelfEmployedData();
        } else if (selectedStatus === 'unemployed') {
            employmentData = getUnemployedData();
        } else if (selectedStatus === 'militaryService') {
            employmentData = getMilitaryServiceData();
        }

        // Сохранение данных во временный массив
        employmentHistory.push(employmentData);

        // Очистка полей формы
        clearForm();

        // Обновление таблицы
        updateTable();
    }

    // Функция для получения данных для статуса "Трудоустройство"
    function getEmployedData() {
        const workBookCheckbox = document.getElementById('workBook');
        const workPlaceInput = document.getElementById('workPlace');
        const okvedInput = document.getElementById('okved');
        const innInput = document.getElementById('inn');
        const regionInput = document.getElementById('region');
        const positionInput = document.getElementById('position');
        const employmentDateInput = document.getElementById('employmentDate');
        const jobId=document.getElementById('workPlace').getAttribute('data-record-id');
        return {
            status: 'Трудоустройство',
            workBook: workBookCheckbox.value,
            workPlace: workPlaceInput.value,
            okved: okvedInput.value,
            inn: innInput.value,
            region: regionInput.value,
            position: positionInput.value,
            date: employmentDateInput.value,
            id:jobId
        };
    }

    // Функция для получения данных для статуса "Самозанятый"
    function getSelfEmployedData() {
        const activityTypeInput = document.getElementById('activityType');
        const employmentDateInput = document.getElementById('employmentDate');

        return {
            status: 'Самозанятый',
            activityType: activityTypeInput.value,
            date: employmentDateInput.value
        };
    }

    // Функция для получения данных для статуса "Безработный"
    function getUnemployedData() {
        const registrationDateInput = document.getElementById('registrationDate');

        return {
            status: 'Безработный',
            date: registrationDateInput.value
        };
    }

    // Функция для получения данных для статуса "Служба в ВС"
    function getMilitaryServiceData() {
        const militaryLocationInput = document.getElementById('militaryLocation');
        const militaryPositionInput = document.getElementById('militaryPosition');
        const employmentDateInput = document.getElementById('employmentDate');

        return {
            status: 'Служба в ВС',
            militaryLocation: militaryLocationInput.value,
            position: militaryPositionInput.value,
            date: employmentDateInput.value
        };
    }

    // Функция для очистки полей формы
    function clearForm() {
        employmentFieldsDiv.innerHTML = '';
    }

    // Функция для обновления таблицы
    function updateTable() {
        const employmentHistoryTable = document.getElementById('employmentHistory');
        const employmentHistoryBody = employmentHistoryTable.querySelector('tbody');

        // Очищаем тело таблицы
        employmentHistoryBody.innerHTML = '';

        // Добавляем записи в таблицу
        employmentHistory.forEach((employment, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${convertDateFormat(employment.date)}</td>
                <td>${getEmploymentStatusText(employment)}</td>
                <td>
                    <button class="btn btn-danger btn-delete" data-index="${index}">Удалить</button>
                </td>
            `;
            employmentHistoryBody.appendChild(row);
            // Присвоение обработчиков событий кнопкам "Редактировать" и "Удалить"
            const editButton = row.querySelector('.btn-edit');
            const deleteButton = row.querySelector('.btn-delete');
            deleteButton.addEventListener('click', handleDeleteButtonClick);
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
            return `Служба в ВС, ${employment.militaryLocation}, должность - ${employment.position}`;
        }
    }

    // Функция для преобразования формата даты (YYYY-MM-DD в DD.MM.YYYY)
    function convertDateFormat(dateString) {
        const parts = dateString.split('-');
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
        return `${day}.${month}.${year}`;
    }

    // Временный массив для хранения истории занятости


    // Функция для построения URL для API
    function buildURL(baseURL, params) {
        baseURL = document.location.protocol + '//' + document.location.host + baseURL;
        const url = new URL(baseURL);

        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });

        return url.toString();
    }


// Обработчик события нажатия кнопки "Удалить"
    function handleDeleteButtonClick(event) {
        const index = event.target.dataset.index;

        // После подтверждения удаления, можно удалить запись из массива и обновить таблицу
        employmentHistory.splice(index, 1);
        updateTable();
    }


});
