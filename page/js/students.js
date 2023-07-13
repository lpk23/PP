document.addEventListener("DOMContentLoaded", function () {
    var myHeaders = new Headers();
    myHeaders.append("authorization", localStorage.getItem('token'));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("api/graduate", requestOptions)
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
    var table = document.querySelector('.S_table');

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
        var cell5 = row.insertCell();
        var cell6 = row.insertCell();
        var cell7 = row.insertCell();
        var cell8 = row.insertCell();
        var cell9 = row.insertCell();
        var cell10 = row.insertCell();
        var cell11 = row.insertCell();

        link.textContent = item.fullName;
        cell1.appendChild(link);
        var dateOfBirth = new Date(item.dateOfBirth);
        cell2.textContent = dateOfBirth.toLocaleDateString('ru');
        cell3.textContent = item.gender;
        cell4.textContent = item.citizenship;
        cell5.textContent = item.phone;
        cell6.textContent = item.email;
        cell7.textContent = item.snils;
        cell8.textContent = item.training_direction.code + ' ' + item.training_direction.name + ' ('+item.profile+')';
        cell9.textContent = 0;
        cell10.textContent = item.graduationYear;
        cell11.textContent = item.educationForm;
    });
}



