document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.getElementById("addButton");
    const prevButton = document.querySelector(".btn-slider-prev");
    const nextButton = document.querySelector(".btn-slider-next");
    const searchButton = document.getElementById("searchBtn");

    searchButton.addEventListener("click", function () {
        const searchInput = document.querySelector(".form-control").value;
        const searchType = document.querySelector('input[name="searchtype"]:checked').id;
        searchData(searchInput, searchType);
    });

    addButton.addEventListener("click", function () {
        const employerName = document.getElementById("employerName").value;
        const okved = document.getElementById("okved").value;
        const inn = document.getElementById("inn-add").value;
        const region = document.getElementById("region-add").value;

        const payload = {
            name: employerName,
            okved: okved,
            inn: inn,
            regionname: region,
        };

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify(payload),
        };

        fetch("/api/employer", requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Ошибка при создании работодателя");
                }
            })
            .then((data) => {
                const addModal = document.getElementById("employerModal");
                const bootstrapModal = new bootstrap.Modal(addModal);
                bootstrapModal.hide();

                fetchData();
            })
            .catch((error) => console.log("Ошибка:", error));
    });

    prevButton.addEventListener("click", function () {
        const offset = prevButton.getAttribute("data-offset");
        if (offset) {
            fetchData(offset);
        }
    });

    nextButton.addEventListener("click", function () {
        const offset = nextButton.getAttribute("data-offset");
        if (offset) {
            fetchData(offset);
        }
    });

    document.getElementById("deleteConfirmButton").addEventListener("click", function () {
        const recordId = document.getElementById("deleteModalLabel").getAttribute("data-record-id");
        deleteRecord(recordId);
    });

    fetchData();

    function fetchData(offset = null) {
        const myHeaders = new Headers();
        myHeaders.append("authorization", localStorage.getItem("token"));

        let url = "/api/employer";
        if (offset) {
            url += "?offset=" + offset;
        }

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
                    throw new Error("Ошибка при получении данных");
                }
            })
            .then((data) => {
                populateTable(data.employers);
                updatePaginationButtons(data.prev, data.next);
            })
            .catch((error) => console.log("Ошибка:", error));
    }

    function populateTable(data) {
        const table = document.querySelector(".J_table");
        const tbody = table.querySelector("tbody");
        tbody.innerHTML = "";

        data.forEach((item) => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = item.name;
            row.appendChild(nameCell);

            const okvedCell = document.createElement("td");
            okvedCell.textContent = item.okved;
            row.appendChild(okvedCell);

            const innCell = document.createElement("td");
            innCell.textContent = item.inn;
            row.appendChild(innCell);

            const regionCell = document.createElement("td");
            regionCell.textContent = item.regionname;
            row.appendChild(regionCell);

            const actionsCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "btn btn-primary btn-sm";
            editButton.setAttribute("data-bs-toggle", "modal");
            editButton.setAttribute("data-bs-target", "#editModal");
            editButton.textContent = "Редактировать";
            editButton.setAttribute("data-record-id", item.id);
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "btn btn-danger btn-sm";
            deleteButton.setAttribute("data-bs-toggle", "modal");
            deleteButton.setAttribute("data-bs-target", "#deleteModal");
            deleteButton.textContent = "Удалить";
            deleteButton.setAttribute("data-record-id", item.id);
            actionsCell.appendChild(deleteButton);

            row.appendChild(actionsCell);
            tbody.appendChild(row);

            editButton.addEventListener("click", function () {
                const recordId = this.getAttribute("data-record-id");
                fillEditForm(recordId);
            });

            deleteButton.addEventListener("click", function () {
                const recordId = this.getAttribute("data-record-id");
                document.getElementById("deleteModalLabel").setAttribute("data-record-id", recordId);
            });
        });
    }

    function fillEditForm(employerId) {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: localStorage.getItem("token"),
            },
        };

        fetch("/api/employer/" + employerId, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Ошибка при получении информации о работодателе");
                }
            })
            .then((data) => {
                const editModalLabel = document.getElementById("editModalLabel");
                editModalLabel.setAttribute("data-record-id", employerId);
                editModalLabel.textContent = "Редактировать работодателя #" + employerId;
                document.getElementById("editEmployerName").value = data.name;
                document.getElementById("editOkved").value = data.okved;
                document.getElementById("editInn").value = data.inn;
                document.getElementById("editRegion").value = data.regionname;

                const editModal = document.getElementById("editModal");
                const bootstrapModal = new bootstrap.Modal(editModal);
                bootstrapModal.show();
            })
            .catch((error) => console.log("Ошибка:", error));
    }

    function deleteRecord(employerId) {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: localStorage.getItem("token"),
            },
        };

        fetch("/api/employer/" + employerId, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Ошибка при удалении записи работодателя");
                }
            })
            .then((data) => {
                const deleteModal = document.getElementById("deleteModal");
                const bootstrapModal = bootstrap.Modal.getInstance(deleteModal);
                bootstrapModal.hide();
                fetchData(addButton.getAttribute("data-offset"));
            })
            .catch((error) => console.log("Ошибка:", error));
    }



    function searchData(searchInput, searchType) {

        const myHeaders = new Headers();
        myHeaders.append("authorization", localStorage.getItem("token"));

        const url = "/api/employer/search?value=" + encodeURIComponent(searchInput) + "&attribute=" + searchType;

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
                    throw new Error("Ошибка при выполнении поиска");
                }
            })
            .then((data) => {
                populateTable(data);
                updatePaginationButtons(data.prev, data.next);
            })
            .catch((error) => console.log("Ошибка:", error));
    }

    function updatePaginationButtons(prevOffset, nextOffset) {
        if (prevOffset !== null && prevOffset >= 0) {
            prevButton.setAttribute("data-offset", prevOffset);
            prevButton.removeAttribute("disabled");
        } else {
            prevButton.removeAttribute("data-offset");
            prevButton.setAttribute("disabled", true);
        }

        if (nextOffset !== null && nextOffset > 0) {
            nextButton.setAttribute("data-offset", nextOffset);
            nextButton.removeAttribute("disabled");
        } else {
            nextButton.removeAttribute("data-offset");
            nextButton.setAttribute("disabled", true);
        }
    }
});
