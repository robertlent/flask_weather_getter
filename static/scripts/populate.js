let countriesStatesCities = {};
let countries = {};
let states = {};

fetch('https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates%2Bcities.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(country => {
            if (country['states'] && country['states'].length > 0) {
                countriesStatesCities[country['iso2']] = {};

                let hasCities = false;

                country['states'].forEach(state => {
                    if (state['cities'] && state['cities'].length > 0) {
                        countriesStatesCities[country['iso2']][state['name']] = [];

                        state.cities.forEach(city => {
                            countriesStatesCities[country['iso2']][state['name']].push(city['name']);
                        })

                        states[country['iso2'] + state['state_code']] = state['name']

                        hasCities = true;
                    }
                })

                if (hasCities) {
                    countries[country['iso2']] = country['name'];
                } else {
                    delete countries[country['iso2']];
                }
            }
        })

        populateSelect(document.getElementById('country'), Object.keys(countries), Object.values(countries));
    });

document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('country');
    const stateSelect = document.getElementById('state');
    const citySelect = document.getElementById('city');

    countrySelect.addEventListener('change', () => {
        const countryCode = countrySelect.value;
        stateSelect.value = '';
        citySelect.value = '';

        const stateNames = Object.keys(countriesStatesCities[countryCode]);
        const stateCodes = Object.keys(states).filter(stateCode => stateCode.startsWith(countryCode));

        populateSelect(stateSelect, stateCodes, stateNames);
        populateSelect(citySelect, '', '');
    });

    stateSelect.addEventListener('change', () => {
        const countryCode = countrySelect.value;
        const state = stateSelect.options[stateSelect.selectedIndex].textContent;
        citySelect.value = '';

        const cities = countriesStatesCities[countryCode][state];

        populateSelect(citySelect, cities, cities);
    });

    const dropdowns = Array.from(document.querySelectorAll('.form-select'));

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', () => {
            const areAllDropdownsSelected = dropdowns.every(dropdown => dropdown.selectedIndex !== 0);

            if (!areAllDropdownsSelected) {
                document.querySelector('#submit').setAttribute('disabled', 'disabled');
            } else {
                document.querySelector('#submit').removeAttribute('disabled');
            }
        });
    });

})

function populateSelect(select, values, displayText) {
    select.innerHTML = '';
    let option = document.createElement('option');

    switch (select.id) {
        case 'country':
            option.value = ''
            option.textContent = 'Select Country'
            select.appendChild(option);
            break;
        case 'state':
            option.value = ''
            option.textContent = 'Select State'
            select.appendChild(option);
            break;
        case 'city':
            option.value = ''
            option.textContent = 'Select City'
            select.appendChild(option);
            break;
        default:
            break;
    }

    if (values.length) {
        values.forEach((value, index) => {
            option = document.createElement('option');
            option.value = value;
            option.textContent = displayText[index];
            select.appendChild(option);
        })
    }
}
