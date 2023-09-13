let per1;
let per2;
let studentId;
document.addEventListener("DOMContentLoaded", function () {
    const url = new URL(window.location.href);
    studentId = getStudentIdFromUrl(url);
    const apiUrl = `/api/graduate/${studentId}`;
    const requestOptions = {
        method: 'GET',
        headers: createAuthorizationHeaders(),
        redirect: 'follow'
    };
    fetch(apiUrl, requestOptions)
        .then(handleResponse)
        .then(fillFormData)
        .catch(handleError);
    const exportButton = document.getElementById("exportStudent");
    exportButton.addEventListener('click', () => {
        const apiUrl = "/api/graduate/" + studentId;
        const requestOptions = {
            method: 'GET',
            headers: createAuthorizationHeaders(),
            redirect: 'follow'
        };

        fetch(apiUrl, requestOptions)
            .then(response => response.json())
            .then(data => {
                const jobHistoryList = data.job_histories.map(job => {
                    let jobHistoryHtml;
                    if (job.jobType === 'Трудоустройство') {
                        jobHistoryHtml = `
                        <li>${new Date(job.startDate).toLocaleDateString('ru-RU')} Трудоустройство в ${job.employer.name}, должность ${job.position}</li>
                    `;
                    } else if (job.jobType === 'Безработный') {
                        jobHistoryHtml = `
                        <li>${new Date(job.startDate).toLocaleDateString('ru-RU')} Безработный, поставлен на учёт</li>
                    `;
                    } else if (job.jobType === 'Самозанятый') {
                        jobHistoryHtml = `
                        <li>${new Date(job.startDate).toLocaleDateString('ru-RU')} Самозанятый, род деятельности - ${job.selfEmploymentActivity}</li>
                    `;
                    } else if (job.jobType === 'Служба в ВС') {
                        jobHistoryHtml = `
                        <li>${new Date(job.startDate).toLocaleDateString('ru-RU')} Служба в ВС РФ, в/ч ${job.militaryServiceLocation}, ${job.position}</li>
                    `;
                    }
                    return jobHistoryHtml;
                }).join('');

                const htmlTemplate = `
                <!DOCTYPE html>
                <html lang="ru">
                <head>
                    <meta charset="UTF-8">
                    <style>
                                body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            user-select: auto;
        }
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        .logo {
            width: 150px;
            height: 100px;
            margin-right: 20px;
        }
        .logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .title {
            color: #333;
            font-size: 24px;
            font-weight: bold;
        }
        .info-item {
            margin-bottom: 10px;
        }
        .info-item strong {
            font-weight: bold;
        }
        .job-history {
            margin-top: 20px;
            margin-bottom: 30px;
        }
        .job-history-item {
            margin-bottom: 10px;
            padding-left: 20px;
            border-left: 2px solid #999;
        }
        h1 {
            color: #333;
        }
        p {
            color: #666;
        }
        ul {
            color: #999;
        }
                    </style>
                    <title>Сведения о студенте</title>
                    <!-- Включите необходимые библиотеки -->
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
                    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
                </head>
                <body>
    <div class="header">
        <div class="logo">
            <img src="https://vivt.ru/images/Logo_vivt_2023.svg" alt="Logo">
        </div>
        <div class="title">Сведения о студенте</div>
    </div>
    <div class="info-item">
        <strong>ФИО:</strong> ${data.fullName}
    </div>
    <div class="info-item">
        <strong>Дата рождения:</strong> ${new Date(data.dateOfBirth).toLocaleDateString('ru-RU')}
    </div>
    <div class="info-item">
        <strong>Пол:</strong> ${data.gender}
    </div>
    <div class="info-item">
        <strong>Гражданство:</strong> ${data.citizenship}
    </div>
    <div class="info-item">
        <strong>Адрес:</strong> ${data.address}
    </div>
    <div class="info-item">
        <strong>Телефон:</strong> ${data.phone}
    </div>
    <div class="info-item">
        <strong>Email:</strong> ${data.email}
    </div>
    <div class="info-item">
        <strong>СНИЛС:</strong> ${data.snils}
    </div>
    <div class="info-item">
        <strong>Направления подготовки:</strong> ${data.training_direction.code + ' ' + data.training_direction.name}
    </div>
    <div class="info-item">
        <strong>Форма обучения:</strong> ${data.educationForm}
    </div>
    <div class="info-item">
        <strong>Год поступления:</strong> ${data.graduationYear_start}
    </div>
    <div class="info-item">
        <strong>Год выпуска:</strong> ${data.graduationYear_end}
    </div>

    <div class="job-history">
        <h2>Хронология трудоустройства</h2>
                    <ul class="job-history-item">
                        ${jobHistoryList}
                    </ul>

                    <script>
                        const element = document.documentElement;
                        const options = {
                            margin: 1,
                            filename: "student_info.pdf",
                            image: { type: "jpeg", quality: 0.98 },
                            html2canvas: { scale: 2 },
                            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                        };
function closeWindowAfterDownload() {
            window.setTimeout(() => {
                window.close();
            }, 2000); // Adjust the delay time if needed
        }
                        html2pdf().from(element).set(options).save()
                        closeWindowAfterDownload();
                    </script>
                </body>
                </html>
            `;

                // Создаем Blob с HTML-разметкой
                const blob = new Blob([htmlTemplate], { type: 'text/html' });

                // Создаем URL для Blob
                const url = URL.createObjectURL(blob);

                // Открываем созданный URL в новом окне для экспорта в PDF
                window.open(url, '_blank');
            })
            .catch(error => {
                console.error("Произошла ошибка при получении данных:", error);
            });
    });

    const deleteConfirmationButton = document.getElementById('confirmDeleteButton');
    deleteConfirmationButton.addEventListener('click', () => {
        var myHeaders = new Headers();
        myHeaders.append("authorization", localStorage.getItem('token'));

        var raw = "";

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("/api/graduate/"+studentId, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    });
});

function getStudentIdFromUrl(url) {
    return url.pathname.split("/").pop();
}

function createAuthorizationHeaders() {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem('token'));
    return myHeaders;
}

function handleResponse(response) {
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    return response.json();
}

function fillFormData(data) {
    fillPersonalInfo(data);
    fillEducationInfo(data);
    fillEmploymentHistory(data.job_histories);
}

function fillPersonalInfo(data) {
    document.getElementById("fullName").value = data.fullName;
    document.getElementById("birthDate").value = data.dateOfBirth.slice(0, 10);
    document.getElementById("gender").value = data.gender;
    document.getElementById("nationality").value = data.citizenship;
    document.getElementById("address").value = data.address;
    document.getElementById("phone").value = data.phone;
    document.getElementById("email").value = data.email;
    document.getElementById("snils").value = data.snils;
}

function fillEducationInfo(data) {
    document.getElementById("directionCode").value = data.training_direction.code;
    document.getElementById("directionName").value = data.training_direction.name;
    per1=`${data.training_direction.code} ${data.training_direction.name}`;
    document.getElementById("directionProfile").value = data.profile;
    document.getElementById("admissionYear").value = data.graduationYear_start;
    document.getElementById("completionYear").value = data.graduationYear_end;
    per2=data.graduationYear_end;
    document.getElementById("studyForm").value = data.educationForm;
}

function fillEmploymentHistory(jobHistories) {
    const employmentHistoryTableBody = document.getElementById("employmentHistory").getElementsByTagName('tbody')[0];

    const completionRow = employmentHistoryTableBody.insertRow();
    completionRow.innerHTML = `
        <td>${new Date(per2).toLocaleDateString()}</td>
        <td>Завершение обучения по направлению подготовки ${per1}</td>
    `;

    if (jobHistories && jobHistories.length > 0) {
        jobHistories.forEach(job => {
            const newRow = employmentHistoryTableBody.insertRow();
            newRow.innerHTML = `
                <td>${new Date(job.startDate).toLocaleDateString()}</td>
                <td>${getEmploymentDescription(job)}</td>
            `;
        });
    } else {
        const newRow = employmentHistoryTableBody.insertRow();
        newRow.innerHTML = `<td colspan="2">No employment history found.</td>`;
    }
}

function getEmploymentDescription(job) {
    if (job.jobType === "Безработный") {
        return `Безработный, поставлен на учёт`;
    } else if (job.selfEmploymentActivity) {
        return `Самозанятый, род деятельности - ${job.selfEmploymentActivity}`;
    } else if (job.militaryServiceLocation) {
        return `Служба в ВС РФ, в/ч ${job.militaryServiceLocation}, ${job.position}`;
    } else if (job.employer && job.position) {
        return `Трудоустройство в ${job.employer.name}, Должность ${job.position}, Трудовая книжка: ${job.employmentBook}`;
    } else {
        return '';
    }
}


const editButtons = document.querySelectorAll(".btn-edit");
editButtons.forEach((editButton) => {
    editButton.disabled = true;
});

function handleError(error) {
    window.location.href='/'
    console.error('Error:', error);
}
