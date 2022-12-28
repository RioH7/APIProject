const baseUrl = 'https://restcountries.com/v3.1/';
const regionUrl = `https://restcountries.com/v3.1/region/`;
const nameUrl = `https://restcountries.com/v3.1/name/`;
const template = document.getElementById('template');
const countries = document.querySelector('.countries');

//clear page before showing new results
const removeCountries = () => {
    document.querySelectorAll('.box').forEach(el => {
        countries.removeChild(el);
    });
}

//Show countries to page
const displayCountries = jsonResponse => {
    jsonResponse.forEach(country => {
        let clone = template.content.cloneNode(true);
        clone.querySelector('.image').src = `${country.flags['png']}`;
        clone.querySelector('.name').innerHTML = `${country.name['common']}`;
        clone.querySelector('.population').innerHTML = `<b>Population:</b> ${country.population.toLocaleString('en-GB')}`;
        clone.querySelector('.region').innerHTML = `<b>Region:</b> ${country.region}`;
        clone.querySelector('.capital').innerHTML = `<b>Capital:</b> ${country.capital}`;
        main.appendChild(clone);
    });
}

//API Request to get all countries' data
const getCountries = async(url, params) => {
    removeCountries();
    try {
        const response = await fetch(`${url}${params}`);
        if(response.ok) {
            const jsonResponse = await response.json();
            //Show countries in order of population(largest population first)
            jsonResponse.sort((a, b) => { 
                if (a.population < b.population) {
                    return 1;
                }
                if (a.population > b.population) {
                    return -1;
                }
                return 0;
            });
            displayCountries(jsonResponse);
        }
    } catch(error) {
        console.log(error);
    }
}

//Change to details page when country is clicked
document.addEventListener("click", e => {
    if(e.target.matches('.box h2')) {
        //Used to pass which country was clicked to detail page
        sessionStorage.setItem("countryName", e.target.textContent);
        window.location = "detailPage.html";
    }
});

//Filter By Region Events
document.addEventListener("change", e => {
    if(e.target.matches('#regionFilter')) {
        if(e.target.value === "all") {
            //Default to all on default region filter input
            getCountries(baseUrl, 'all');
        } else {
            getCountries(regionUrl, `${e.target.value}`);
        }
    }
});

//Searchbar Events
document.addEventListener('input', e => {
    if (e.target.matches('#search')) {
        if (e.target.value === "") {
            //Default to all countries when no input in searchbar
            getCountries(baseUrl, 'all');
        } else {
            getCountries(nameUrl, `${e.target.value.trim().toLowerCase()}`);
        }
    }

});

getCountries(baseUrl, 'all');