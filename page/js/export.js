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

    const exportIDButton = document.getElementById("exportID");
    exportIDButton.addEventListener("click", function () {
        const selectedRows = Array.from(document.querySelectorAll("#exportTable input[type=checkbox]:checked"))
            .map(checkbox => checkbox.closest("tr"));

        const selectedIds = selectedRows.map(row => parseInt(row.id));

        const requestBody = {
            id: selectedIds
        };

        const myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem('token'));
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(requestBody),
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
});
