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
    const exportButton = document.getElementById("exportStudent");
    exportButton.addEventListener('click', () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem('token'));
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({"id":[studentId]}),
            redirect: "follow",
        };

        fetch("/api/export", requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Ошибка при экспорте");
                }
                return response.blob();
            })
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "Data.pdf";
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            })
            .catch(error => console.log("Error:", error));
    });
    fetch(apiUrl, requestOptions)
        .then(handleResponse)
        .then(fillFormData)
        .catch(handleError);

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
