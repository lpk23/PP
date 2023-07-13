document.addEventListener("DOMContentLoaded", function () {
    var myHeaders = new Headers();
    myHeaders.append("authorization", localStorage.getItem('token'));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("/api/employer", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse the response as JSON
            } else {
                window.location.href="/";
            }
        })
        .then(data => {
            // Populate the table with the response data
            populateTable(data);
        })
        .catch(error => console.log('error', error));

});

function populateTable(data) {
    var table = document.querySelector('.J_table');

    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    data.forEach(item => {
        var row = table.insertRow();

        var link = document.createElement('a');
        link.href = '/employer/'+item.id; // Replace 'your_link_url' with the actual URL you want to use

        var cell1 = row.insertCell();
        var cell2 = row.insertCell();
        var cell3 = row.insertCell();
        var cell4 = row.insertCell();

        link.textContent = item.name;
        cell1.appendChild(link);

        cell2.textContent = item.okved;
        cell3.textContent = item.inn;
        cell4.textContent = item.regionname;
    });
}



