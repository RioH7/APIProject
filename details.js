const url = 'https://restcountries.com/v3.1/';
const regionUrl = `https://restcountries.com/v3.1/region/`;
const nameUrl = `https://restcountries.com/v3.1/name/`;
const alphaUrl = `https://restcountries.com/v3.1/alpha/`
const queryFields = `?fields=flags,name,nativeName,population,region,subregion,capital,tld,currencies,languages,borders`;

const showDetails = country => {
    document.getElementById('image').src = country.flags['png'];
    document.querySelector('.country-name').innerHTML = country.name['common'];
    document.querySelector('.native-name').innerHTML = `<b>Native Name:</b> ${country.name['official']}`;
    document.querySelector('.population').innerHTML = `<b>Population:</b> ${country.population.toLocaleString('en-GB')}`;
    document.querySelector('.region').innerHTML = `<b>Region:</b> ${country.region}`;
    document.querySelector('.sub-region').innerHTML = `<b>Sub Region:</b> ${country.subregion}`;
    document.querySelector('.capital').innerHTML = `<b>Capital:</b> ${country.capital}`;
    document.querySelector('.top-domain').innerHTML = `<b>Top Level Domain:</b> ${country.tld[0]}`;
    document.querySelector('.currencies').innerHTML = `<b>Currencies:</b> ${Object.values(country.currencies)[0].name}`;
    document.querySelector('.languages').innerHTML = `<b>Languages:</b> ${Object.values(country.languages).join(', ')}`;    
    showBorders(country.borders);
}

const getDetails = async() => {
    const urlToFetch = `${nameUrl}${sessionStorage.getItem("countryName").toLowerCase()}${queryFields}`;
    try {
        const response = await fetch(urlToFetch);
        if(response.ok) {
            const jsonResponse = await response.json();
            //Repair a bug with United States response being in reverse order
            if(sessionStorage.getItem("countryName") === "United States") {
                showDetails(jsonResponse[jsonResponse.length - 1]);
            } else {
                //Default call for all but United States
                showDetails(jsonResponse[0]);
            }
        }
    } catch(error) {
        console.log(error);
    }
}

const showBorders = async(borders) => {
    //Show maximum of 3 borders
    borderQuery = borders.slice(0, 3).join(',').toLowerCase();
    document.querySelector('div>b').innerHTML = 'Border Countries:';
        try {
            const response = await fetch(`${alphaUrl}?codes=${borderQuery}
            `);
            if(response.ok) {
                const jsonResponse = await response.json();
                console.log(jsonResponse);
                for(let i = 0; i < jsonResponse.length; i++) {
                    document.getElementById(`border${i}`).innerHTML = jsonResponse[i].name['common'];
                }
            }
        } catch(error) {
            console.log(error);
        }
}

const getByName = async(anchorName) => {
    const urlToFetch = `${nameUrl}${anchorName.toLowerCase()}${queryFields}`;
    try {
        const response = await fetch(urlToFetch);
        if(response.ok) {
            const jsonResponse = await response.json();
            showDetails(jsonResponse[0]);
        }
    } catch(error) {
        console.log(error);
    }
}

//Allows border countries to navigate the site also
document.addEventListener("click", e => {
    if(e.target.matches('.borders-container>a')) {
        getByName(`${e.target.textContent}`);
    }
});

getDetails();

