document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', handleSaveButtonClick);
    async function handleSaveButtonClick() {
        try {
            console.log(employmentHistory);
            const personalInfo = getPersonalInfo();
            const trainingInfo = await getTrainingInfo();
            console.log(personalInfo);
            console.log(trainingInfo);
            const formData = {
                personalInfo,
                trainingInfo,
                employmentHistory: employmentHistory
            };

            if (!trainingInfo.directionid) {
                const newDirectionId = await createTrainingDirection(trainingInfo.directionCode, trainingInfo.directionName);
                if (newDirectionId) {
                    const newGraduateId = await sendStudentDataToServer(personalInfo, newDirectionId, trainingInfo);
                    if (newGraduateId) {
                        await sendEmploymentHistoryToServer(employmentHistory, newGraduateId.id);
                    }
                } else {
                    console.log('Не удалось создать новое направление подготовки.');
                }
            } else {
                const newGraduateId = await sendStudentDataToServer(personalInfo, trainingInfo.directionid, trainingInfo);
                if (newGraduateId) {
                    await sendEmploymentHistoryToServer(employmentHistory, newGraduateId.id);
                }
            }

            // Вывод данных в консоль (можно заменить этот шаг на отправку данных на сервер)
            console.log(formData);
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
        }
    }

    function getPersonalInfo() {
        return {
            fullName: getValueById('fullName'),
            birthDate: getValueById('birthDate'),
            gender: getValueById('gender'),
            nationality: getValueById('nationality'),
            address: getValueById('address'),
            phone: getValueById('phone'),
            email: getValueById('email'),
            snils: getValueById('snils')
        };
    }

    async function getTrainingInfo() {
        const directionCode = getValueById('directionCode');
        const directionName = getValueById('directionName');
        const directionProfile = getValueById('directionProfile');
        const admissionYear = getValueById('admissionYear');
        const completionYear = getValueById('completionYear');
        const studyForm = getValueById('studyForm');
        const directionid = getValueById('directionCode', 'data-record-id');

        return {
            directionCode,
            directionid,
            directionName,
            directionProfile,
            admissionYear,
            completionYear,
            studyForm
        };
    }

    function getValueById(id, attribute = null) {
        const element = document.getElementById(id);
        return attribute ? element.getAttribute(attribute) : element.value;
    }

    async function createTrainingDirection(code, name) {
        const requestOptions = {
            method: 'POST',
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ code, name }),
            redirect: 'follow'
        };

        try {
            const response = await fetch("/api/training", requestOptions);
            const result = await response.json();
            return result && result.id ? result.id : null;
        } catch (error) {
            console.error('Ошибка при создании нового направления подготовки:', error);
            return null;
        }
    }

    async function sendStudentDataToServer(personalInfo, directionId, trainingInfo) {
        const { fullName, birthDate, gender, nationality, address, phone, email, snils } = personalInfo;
        const { directionProfile, admissionYear, completionYear, studyForm } = trainingInfo;

        const requestOptions = {
            method: 'POST',
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName,
                dateOfBirth: birthDate,
                gender,
                citizenship: nationality,
                address,
                phone,
                email,
                snils,
                trainingDirectionId: directionId,
                profile: directionProfile,
                educationForm: studyForm,
                graduationYear_start: admissionYear,
                graduationYear_end:completionYear
            }),
            redirect: 'follow'
        };

        try {
            const response = await fetch("/api/graduate", requestOptions);
            const result = await response.json();
            console.log(result);
            return result

        } catch (error) {
            console.error('Ошибка при отправке данных на сервер:', error);
        }
    }
    async function sendEmploymentHistoryToServer(employmentHistory, graduateId) {
        try {
            for (const entry of employmentHistory) {
                const jobHistoryData = {
                    graduateId,
                    employerId: entry.id,
                    jobType: entry.status,
                    startDate: entry.date,
                    employmentBook: entry.workBook,
                    position: entry.position,
                    selfEmploymentActivity: entry.activityType,
                    militaryServiceLocation: entry.militaryLocation,
                };
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        "Authorization": localStorage.getItem('token'),
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(jobHistoryData),
                    redirect: 'follow'
                };
                try {
                    const response = await fetch("/api/job", requestOptions);
                    const result = await response.json();
                    console.log(result);
                } catch (error) {
                    console.error('Ошибка при отправке данных на сервер:', error);
                }
            }
            console.log('История занятости успешно сохранена в базе данных.');
        } catch (error) {
            console.error('Ошибка при сохранении истории занятости:', error);
        }
    }



});
