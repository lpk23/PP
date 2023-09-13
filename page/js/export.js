document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("searchInput");
    const searchDropDown = document.getElementById("searchDropDown");
    const exportTable = document.getElementById("exportTable");

    document.addEventListener("click", function (event) {
        if (!searchDropDown.contains(event.target)) {
            searchDropDown.classList.remove("show");
        }
    });

    searchInput.addEventListener("input", function () {
        const value = searchInput.value.trim();
        const selectedType = 'fullName';
        if (value !== "") {
            searchData(value, selectedType);
        } else {
            searchDropDown.classList.remove("show");
        }
    });

    function updateDropdown(data) {
        searchDropDown.innerHTML = '';
        if (data.length === 0) {
            searchDropDown.innerHTML = '<a class="dropdown-item">No results found</a>';
            return;
        }

        data.forEach(item => {
            const dropdownItem = document.createElement('a');
            dropdownItem.classList.add('dropdown-item');
            dropdownItem.href = '#';
            dropdownItem.innerText = item.fullName;
            dropdownItem.addEventListener('click', function (event) {
                event.preventDefault();
                searchInput.value = item.fullName;
                addRowToTable(item);
                searchDropDown.innerHTML = '';
                searchDropDown.classList.remove("show");
            });
            searchDropDown.appendChild(dropdownItem);
            searchDropDown.classList.add('show');
            searchDropDown.style.overflowY = 'auto';
            searchDropDown.style.maxHeight = '200px';
        });
    }

    function addRowToTable(data) {
        const newRow = exportTable.insertRow();
        newRow.id = data.id;
        newRow.innerHTML = `
      <td><input type="checkbox"></td>
      <td>${data.fullName}</td>
      <td>${data.gender}</td>
      <td>${new Date(data.dateOfBirth).toLocaleDateString()}</td>
      <td>${data.citizenship}</td>
      <td>${data.phone}</td>
      <td>${data.snils}</td>
      <td>${data.training_direction.name}</td>
      <td>${data.graduationYear_start || ""}</td>
      <td>${data.graduationYear_end || ""}</td>
      <td>${data.educationForm}</td>
    `;
    }

    function searchData(searchInput, searchType) {
        const myHeaders = new Headers();
        myHeaders.append("authorization", localStorage.getItem("token"));

        const url = "/api/search/graduate?value=" + encodeURIComponent(searchInput) + "&attribute=" + searchType;

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch(url, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Error while searching");
                }
            })
            .then((data) => {
                updateDropdown(data);
            })
            .catch((error) => console.log("Error:", error));
    }

    const exportOptionsModal = new bootstrap.Modal(document.getElementById("exportOptionsModal"));
    const sortSelect = document.getElementById("sort");

    sortSelect.addEventListener("change", function () {
        const selectedValue = sortSelect.value;
        const allInputDivs = document.querySelectorAll(".form-group");

        allInputDivs.forEach((inputDiv) => {
            inputDiv.style.display = "none";
        });

        const selectedInputDiv = document.getElementById(`${selectedValue}Input`);
        if (selectedInputDiv) {
            selectedInputDiv.style.display = "block";
        }
    });

    const exportButton = document.querySelector("#exportOptionsModal .btn-primary");
    exportButton.addEventListener("click", function () {
        const selectedValue = sortSelect.value;
        let url = "/api/search/graduate?";

        switch (selectedValue) {
            case "gender":
                const genderSelect = document.getElementById("genderSelect");
                const selectedGender = genderSelect.value;
                url += "attribute=gender&value=" + encodeURIComponent(selectedGender);
                break;
            case "Bitrth":
                const birthDateFrom = document.getElementById("birthDateFrom").value;
                const birthDateTo = document.getElementById("birthDateTo").value;
                url += "attribute=Bitrth&from=" + encodeURIComponent(birthDateFrom) + "&to=" + encodeURIComponent(birthDateTo);
                break;
            case "Citizenship":
                const citizenshipField = document.getElementById("citizenshipField").value;
                url += "attribute=citizenship&value=" + encodeURIComponent(citizenshipField);
                break;
            case "Education":
                const educationField = document.getElementById("educationField").value;
                url += "attribute=trainingDirectionId&type_s=no&value=" + encodeURIComponent(document.getElementById("educationField").getAttribute('data-record-id'));
                break;
            case "Start_date":
                const startYearField = document.getElementById("startYearField").value;
                url += "attribute=graduationYear_start&value=" + encodeURIComponent(startYearField);
                break;
            case "End_date":
                const endYearField = document.getElementById("endYearField").value;
                url += "attribute=graduationYear_end&value=" + encodeURIComponent(endYearField);
                break;
            case "Edu_form":
                const eduFormField = document.getElementById("eduFormField").value;
                url += "attribute=educationForm&value=" + encodeURIComponent(eduFormField);
                break;
            default:
                break;
        }

        const myHeaders = new Headers();
        myHeaders.append("authorization", localStorage.getItem("token"));

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch(url, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Error while searching");
                }
            })
            .then((data) => {
                for (const rowData of data) {
                    addRowToTable(rowData);
                }
            })
            .catch((error) => console.log("Error:", error));

        exportOptionsModal.hide();
    });

    const educationInput = document.getElementById("educationField");
    const educationDropDown = document.getElementById("educationDropDown");

    educationField.addEventListener("click", function () {
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
                educationDropDown.style.display = 'block';
            })
            .catch(error => {
                console.error('Error:', error);
            });
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
                return data;
            })
            .catch(error => console.log('Error:', error));
    }

    function populateDirectionCodeDropdown(data) {
        const dropdownMenu = document.getElementById('educationDropDown');
        dropdownMenu.innerHTML = '';

        if (data.length > 0) {
            data.forEach(item => {
                const option = document.createElement('li');
                option.classList.add('dropdown-item');
                option.innerText = `${item.code} - ${item.name}`;
                option.addEventListener('click', () => {
                    educationInput.value = item.name;
                    educationInput.setAttribute('data-record-id', item.id);
                    dropdownMenu.classList.remove('show');
                    dropdownMenu.style.display = 'none';
                });
                dropdownMenu.appendChild(option);
            });
            dropdownMenu.classList.add('show');
            dropdownMenu.style.overflowY = 'auto';
            dropdownMenu.style.maxHeight = '200px';
        } else {
            const message = document.createElement('li');
            message.classList.add('dropdown-item');
            message.innerText = 'No data';
            educationDropDown.appendChild(message);
            educationDropDown.classList.remove('show');
        }
    }
    function createAuthorizationHeaders() {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem('token'));
        return myHeaders;
    }

// При нажатии на кнопку "Экспорт" выполняется следующая функция
    const exportIDButton = document.getElementById("exportID");
    exportIDButton.addEventListener("click", async function () {
        try {
            // Получаем выбранные строки из таблицы
            const selectedRows = Array.from(document.querySelectorAll("#exportTable input[type=checkbox]:checked"))
                .map(checkbox => checkbox.closest("tr"));

            // Получаем идентификаторы выбранных студентов
            const selectedIds = selectedRows.map(row => parseInt(row.id));

            // Создаем PDF-документ
            const doc = new jspdf.jsPDF();

            // Асинхронно создаем PDF для каждого студента
            for (const studentId of selectedIds) {
                await generateStudentPDF(studentId, doc);
                if (doc.getNumberOfPages() > 0) {
                    doc.addPage();
                }
            }

            // Сохраняем и скачиваем объединенный PDF
            doc.save("student_info.pdf");
        } catch (error) {
            console.error("Произошла ошибка при экспорте данных:", error);
        }
    });

// Функция для создания PDF для конкретного студента
    async function generateStudentPDF(studentId, doc) {
        try {
            // Получаем данные студента с сервера
            const studentData = await fetchStudentData(studentId);
            // Создаем новый шрифт
            doc.addFont('/js/DejaVuSans.ttf', 'DejaVuSans', 'normal');

            // Устанавливаем шрифт
            doc.setFont('DejaVuSans');
            // Генерируем текстовый контент для студента
            const studentText = generateStudentText(studentData);
            doc.setFontSize(11);
            // Добавляем текстовый контент в PDF
            doc.text(studentText, 10, 10); // Здесь указываем координаты и местоположение текста
        } catch (error) {
            console.error("Произошла ошибка при получении данных студента:", error);
        }
    }

// Функция для запроса данных студента с сервера
    async function fetchStudentData(studentId) {
        const apiUrl = `/api/graduate/${studentId}`;
        const requestOptions = {
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            redirect: "follow",
        };

        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            throw new Error(`Ошибка при запросе данных студента: ${response.statusText}`);
        }

        return response.json();
    }

// Функция для генерации текстового контента студента
    function generateStudentText(data) {
        const { fullName, dateOfBirth, gender, citizenship, address, phone, email, snils, training_direction, educationForm, graduationYear_start, graduationYear_end, job_histories } = data;

        // Создаем текстовый массив для хранения информации
        const textContent = [];

        // Добавляем информацию о студенте
        textContent.push(`ФИО: ${fullName}`);
        textContent.push(`Дата рождения: ${new Date(dateOfBirth).toLocaleDateString('ru-RU')}`);
        textContent.push(`Пол: ${gender}`);
        textContent.push(`Гражданство: ${citizenship}`);
        textContent.push(`Адрес: ${address}`);
        textContent.push(`Телефон: ${phone}`);
        textContent.push(`Email: ${email}`);
        textContent.push(`СНИЛС: ${snils}`);
        textContent.push(`Форма обучения: ${educationForm}`);
        textContent.push(`Год начала обучения: ${graduationYear_start}`);
        textContent.push(`Год окончания обучения: ${graduationYear_end}`);
        textContent.push(`Направление обучения: ${training_direction.name}`);
        textContent.push(''); // Добавляем пустую строку

        // Добавляем разделитель
        textContent.push('Хронология трудоустройства:\n');

        // Преобразуем информацию о трудовой истории из данных
        for (const jobHistory of job_histories) {
            let jobHistoryString;

            if (jobHistory.jobType === 'Трудоустройство') {
                jobHistoryString = `${new Date(jobHistory.startDate).toLocaleDateString('ru-RU')} Трудоустройство в ${jobHistory.employer.name}, должность ${jobHistory.position}`;
            } else if (jobHistory.jobType === 'Безработный') {
                jobHistoryString = `${new Date(jobHistory.startDate).toLocaleDateString('ru-RU')} Безработный, поставлен на учёт`;
            } else if (jobHistory.jobType === 'Самозанятый') {
                jobHistoryString = `${new Date(jobHistory.startDate).toLocaleDateString('ru-RU')} Самозанятый, род деятельности - ${jobHistory.selfEmploymentActivity}`;
            } else if (jobHistory.jobType === 'Служба в ВС') {
                jobHistoryString = `${new Date(jobHistory.startDate).toLocaleDateString('ru-RU')} Служба в ВС РФ, в/ч ${jobHistory.militaryServiceLocation}, ${jobHistory.position}`;
            }
            // Добавляем запись о работе в текстовый массив
            textContent.push(jobHistoryString);
        }

        // Объединяем массив в одну строку с переносами строк
        return textContent.join('\n');
    }


    // exportIDButton.addEventListener("click", function () {
    //     const selectedRows = Array.from(document.querySelectorAll("#exportTable input[type=checkbox]:checked"))
    //         .map(checkbox => checkbox.closest("tr"));
    //
    //     const selectedIds = selectedRows.map(row => parseInt(row.id));
    //
    //     const requestBody = {
    //         id: selectedIds
    //     };
    //
    //     const myHeaders = new Headers();
    //     myHeaders.append("Authorization", localStorage.getItem('token'));
    //     myHeaders.append("Content-Type", "application/json");
    //
    //     const requestOptions = {
    //         method: "POST",
    //         headers: myHeaders,
    //         body: JSON.stringify(requestBody),
    //         redirect: "follow",
    //     };
    //
    //     fetch("/api/export", requestOptions)
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error("Ошибка при экспорте");
    //             }
    //             return response.blob();
    //         })
    //         .then(blob => {
    //             const url = URL.createObjectURL(blob);
    //             const link = document.createElement("a");
    //             link.href = url;
    //             link.download = "Data.pdf";
    //             link.target = "_blank";
    //             document.body.appendChild(link);
    //             link.click();
    //             document.body.removeChild(link);
    //             URL.revokeObjectURL(url);
    //         })
    //         .catch(error => console.log("Error:", error));
    // });
});
