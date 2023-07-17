document.addEventListener("DOMContentLoaded", function () {
    const kladrmodal = document.getElementById('kladrModal');
    const kbootstrapModal = new bootstrap.Modal(kladrmodal);
    const districtInput = document.getElementById('district');
    districtInput.addEventListener('input', handleDistrictInput);

    const cityInput = document.getElementById('city');
    cityInput.addEventListener('input', handleCityInput);

    const settlementInput = document.getElementById('settlement');
    settlementInput.addEventListener('input', handleSettlementInput);

    const streetInput = document.getElementById('street');
    streetInput.addEventListener('input', handleStreetInput);
    var region_id;
    var city_id;
    var street_id;

    function handleDistrictInput() {
        const districtValue = districtInput.value;
        if (districtValue.trim() !== '') {
            const params = {
                contentType: 'region',
                limit: '5',
                query: districtValue
            };
            const kladrURL = buildURL('/api/kladr', params);
            fetchData(kladrURL)
                .then(response => {
                    populateDropdown(response, 'district');
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    function handleCityInput() {
        const cityValue = cityInput.value;
        if (cityValue.trim() !== '') {
            const params = {
                contentType: 'city',
                ParentType: 'region',
                ParentId: region_id,
                limit: '5',
                query: cityValue
            };
            const kladrURL = buildURL('/api/kladr', params);
            fetchData(kladrURL)
                .then(response => {
                    populateDropdown(response, 'city');
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    function handleSettlementInput() {
        const settlementValue = settlementInput.value;
        if (settlementValue.trim() !== '') {
            const params = {
                contentType: 'settlement',
                ParentType: 'region',
                ParentId: region_id,
                limit: '5',
                query: settlementValue
            };
            const kladrURL = buildURL('/api/kladr', params);
            fetchData(kladrURL)
                .then(response => {
                    populateDropdown(response, 'settlement');
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    function handleStreetInput() {
        const streetValue = streetInput.value;
        if (streetValue.trim() !== '') {
            const params = {
                contentType: 'street',
                ParentType: 'city',
                ParentId: city_id,
                limit: '5',
                query: streetValue
            };
            const kladrURL = buildURL('/api/kladr', params);
            fetchData(kladrURL)
                .then(response => {
                    populateDropdown(response, 'street');
                    populateDropdown(response, 'street');
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    function buildURL(baseURL, params) {
        baseURL = document.location.protocol + '//' + document.location.host + baseURL
        const url = new URL(baseURL);

        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });

        return url.toString();
    }

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

    function populateDropdown(data, inputType) {
        const dropdownMenu = document.getElementById(`${inputType}Dropdown`);
        dropdownMenu.innerHTML = '';

        if (data.length > 0) {
            data.forEach(item => {
                const option = document.createElement('a');
                option.classList.add('dropdown-item');
                option.innerText = item.name + ' ' + item.typeShort;
                option.addEventListener('click', () => {
                    if (inputType === 'district') {
                        districtInput.value = item.name + ' ' + item.typeShort;
                        region_id = item.id;
                        document.getElementById('city').removeAttribute('disabled');
                        document.getElementById('settlement').removeAttribute('disabled');
                    } else if (inputType === 'city') {
                        cityInput.value = item.name + ' ' + item.typeShort;
                        city_id = item.id;
                        document.getElementById('street').removeAttribute('disabled');
                        document.getElementById('settlement').setAttribute('disabled', true);
                    } else if (inputType === 'settlement') {
                        settlementInput.value = item.name + ' ' + item.typeShort;
                        document.getElementById('street').removeAttribute('disabled');
                        document.getElementById('city').setAttribute('disabled', true);
                    } else if (inputType === 'street') {
                        street_id = item.id
                        streetInput.value = item.name + ' ' + item.typeShort;
                        document.getElementById('house').removeAttribute('disabled');
                    } else if (inputType === 'house') {
                        buildingInput.value = item.name + ' ' + item.typeShort;
                    }
                    dropdownMenu.classList.remove('show');
                });
                dropdownMenu.appendChild(option);
            });
            dropdownMenu.classList.add('show');
            dropdownMenu.style.overflowY = 'auto';
            dropdownMenu.style.maxHeight = '200px';
        } else {
            const message = document.createElement('a');
            message.classList.add('dropdown-item');
            message.innerText = `${inputType === 'district' ? 'Регион' : inputType} не найден`;
            dropdownMenu.appendChild(message);
            dropdownMenu.classList.remove('show');
        }
    }

    const kladrButton = document.getElementById('kladrButton');
    kladrButton.addEventListener('click', () => {
        kbootstrapModal.show();
    });

    const kladrSubmitButton = document.getElementById('kladrSubmitButton');
    kladrSubmitButton.addEventListener('click', () => {
        const district = document.getElementById('district').value;
        const city = document.getElementById('city').value;
        const settlement = document.getElementById('settlement').value;
        const street = document.getElementById('street').value;
        const building = document.getElementById('house').value;

        const address = settlement === '' ? `${district}, ${city}, ${street}, ${building}` : `${district}, ${settlement}, ${street}, ${building}`;

        kbootstrapModal.hide();
        document.getElementById('address').value = address;
    });
});
