document.addEventListener("DOMContentLoaded", function () {
    const prevButton = document.querySelector(".btn-slider-prev");
    const nextButton = document.querySelector(".btn-slider-next");
    const searchInput = document.getElementById("searchInput");
    prevButton.addEventListener("click", function () {
        const offset = prevButton.getAttribute("data-offset");
        if (offset) {
            fetchData(offset);
        }
    });
    searchInput.addEventListener("input", function () {
        const value = searchInput.value.trim();
        const selectedType = document.querySelector('input[name="searchtype"]:checked');
        if (value !== "") {
            searchData(value, selectedType.id);
        } else {
            fetchData();
        }
    });

    nextButton.addEventListener("click", function () {
        const offset = nextButton.getAttribute("data-offset");
        if (offset) {
            fetchData(offset);
        }
    });

    fetchData();

    function fetchData(offset = null) {
        const myHeaders = new Headers();
        myHeaders.append("authorization", localStorage.getItem("token"));

        let url = "/api/graduate";
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
                    window.location.href = "/";
                }
            })
            .then((data) => {
                populateTable(data.graduates);
                updatePaginationButtons(data.prev, data.next);
            })
            .catch((error) => console.log("Ошибка:", error));
    }

    function populateTable(data) {
        var table = document.querySelector('.S_table');

        while (table.rows.length > 1) {
            table.deleteRow(1);
        }

        data.forEach(item => {
            var row = table.insertRow();

            var link = document.createElement('a');
            link.href = '/student/' + item.id; // Replace 'your_link_url' with the actual URL you want to use

            var cell1 = row.insertCell();
            var cell2 = row.insertCell();
            var cell3 = row.insertCell();
            var cell4 = row.insertCell();
            var cell5 = row.insertCell();
            var cell6 = row.insertCell();

            link.textContent = item.fullName;
            cell1.appendChild(link);
            cell2.textContent = item.gender;
            cell3.textContent = item.phone;
            cell4.textContent = item.snils;
            cell5.textContent = item.training_direction.code + '\n' + item.training_direction.name + '\n (' + item.profile + ')';
            cell6.textContent = item.graduationYear_end;
        });
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
                    throw new Error("Ошибка при выполнении поиска");
                }
            })
            .then((data) => {
                populateTable(data);
                updatePaginationButtons(data.prev, data.next);
            })
            .catch((error) => console.log("Ошибка:", error));
    }
});
