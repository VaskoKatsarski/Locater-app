var searchInput = 'search_input';
var resultsContainer = document.getElementById('results-container');
var clearButton = document.getElementById('clear-button');
var hideInfoButton = document.getElementById('hide-info-button');
var exploreNearbyButton = document.getElementById('explore-nearby-button');
var toggleAddressComponentsButton = document.getElementById('toggle-address-components');
var selectedInfoContainer = document.getElementById('selected-info-container');
var addressComponentsVisible = true; 
var showShortName = true; 



$(document).ready(function () {
    var autocomplete;
autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), {
    types: ['geocode'],
});

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var near_place = autocomplete.getPlace();
        resultsContainer.innerHTML = ''; 

        if (near_place && near_place.address_components) {
            
            displaySelectedPlaceInfo(near_place);
            updateAddressComponentsVisibility(); 
        }
    });
	

   
    document.getElementById(searchInput).addEventListener('input', function () {
        resultsContainer.innerHTML = ''; 
        selectedInfoContainer.innerHTML = ''; 

        
        var predictions = autocomplete.getPlacePredictions({ input: this.value });

       
        predictions.forEach(function (prediction) {
            resultsContainer.innerHTML += '<p>' + prediction.description + '</p>';
        });

 
    });
    clearButton.addEventListener('click', function () {
        document.getElementById(searchInput).value = ''; 
        resultsContainer.innerHTML = ''; 
        selectedInfoContainer.innerHTML = ''; 
        map.setCenter({ lat: 0, lng: 0 });
        map.setZoom(2);

       
    });
	toggleAddressComponentsButton.addEventListener('click', function () {
    showShortName = !showShortName;
    addressComponentsVisible = !addressComponentsVisible;
    updateAddressComponentsVisibility();
});

    
    hideInfoButton.addEventListener('click', function () {
        selectedInfoContainer.innerHTML = '';
        hideWeatherInfo();
        resultsContainer.innerHTML = ''; 
    });

   
    exploreNearbyButton.addEventListener('click', function () {
        var near_place = autocomplete.getPlace();

        if (near_place && near_place.geometry) {
            exploreNearbyPlaces(near_place.geometry.location);
        } else {
            alert('Please select a location first.');
        }
    });
	
    $("#get-weather-button").click(function () {
    console.log('Weather button clicked!');
    var place = autocomplete.getPlace();

    if (place && place.geometry) {
        console.log('Place selected:', place);
        getWeatherInfo(place.geometry.location.lat(), place.geometry.location.lng());
        showWeatherCard(); 
    } else {
        console.log('No place selected');
        alert('Please select a location first.');
    }
});
});

function showWeatherCard() {
    var weatherContainer = document.getElementById('weather-container');
    weatherContainer.style.display = 'block';

    var weatherCardHeader = document.getElementById('weather-card-header');
    weatherCardHeader.style.display = 'block';

    var weatherInfoContainer = document.getElementById('weather-info-container');
    weatherInfoContainer.style.display = 'block';
}
function closeWeatherCard() {
    var weatherContainer = document.getElementById('weather-container');
    weatherContainer.style.display = 'none';
}

function updateAddressComponentsVisibility() {
    var near_place = autocomplete.getPlace();

    resultsContainer.innerHTML = '';
    selectedInfoContainer.innerHTML = '';

   
    if (near_place && near_place.address_components && addressComponentsVisible) {
        near_place.address_components.forEach(function (component) {
            resultsContainer.innerHTML += '<p>' + getFormattedAddressComponent(component) + '</p>';
        });
        displaySelectedPlaceInfo(near_place);
        selectedInfoContainer.style.display = 'block';
    } else {
        selectedInfoContainer.style.display = 'none';
    }
}
function hideWeatherInfo() {
    var weatherInfoContainer = document.getElementById('weather-info-container');
    weatherInfoContainer.innerHTML = ''; 
}

function getFormattedAddressComponent(component) {
    return showShortName ? component.short_name : component.long_name;
}
function getCountryInfoByCode(countryCode) {
    return fetch(`https://restcountries.com/v2/alpha/${countryCode}`)
        .then(response => response.json())
        .then(data => data)
        .catch(error => {
            console.error('Error fetching country information:', error);
            return null;
        });
}
function displaySelectedPlaceInfo(place) {
selectedInfoContainer.innerHTML = '';

    selectedInfoContainer.innerHTML += '<h5>Selected Place Information:</h5>';
    selectedInfoContainer.innerHTML += '<p><strong>Name:</strong> ' + place.name + '</p>';

    
    if (place.formatted_address && place.address_components && place.address_components.length > 0) {
        const countryCode = place.address_components[place.address_components.length - 1].short_name;
        getCountryInfoByCode(countryCode).then(countryInfo => {
            if (countryInfo && countryInfo.flags) {
                selectedInfoContainer.innerHTML += `<p><strong>Address:</strong> ${place.formatted_address} <img src="${countryInfo.flags.svg}" alt="Country Flag" class="country-flag"></p>`;
            } else {
                selectedInfoContainer.innerHTML += '<p><strong>Address:</strong> ' + place.formatted_address + '</p>';
            }
        });
    } else {
        selectedInfoContainer.innerHTML += '<p><strong>Address:</strong> ' + place.formatted_address + '</p>';
    }
    if (place.international_phone_number) {
        selectedInfoContainer.innerHTML += '<p><strong>Phone Number:</strong> ' + place.international_phone_number + '</p>';
    }

    if (place.website) {
        selectedInfoContainer.innerHTML += '<p><strong>Website:</strong> <a href="' + place.website + '" target="_blank">' + place.website + '</a></p>';
    }
    if (place.types && place.types.length > 0) {
        selectedInfoContainer.innerHTML += '<p><strong>Place Types:</strong> ' + place.types.join(', ') + '</p>';
    }
    if (place.opening_hours && place.opening_hours.weekday_text) {
        selectedInfoContainer.innerHTML += '<p><strong>Opening Hours:</strong></p>';
        selectedInfoContainer.innerHTML += '<ul>';
        place.opening_hours.weekday_text.forEach(function (openingHour) {
            selectedInfoContainer.innerHTML += '<li>' + openingHour + '</li>';
        });
        selectedInfoContainer.innerHTML += '</ul>';
    }
    if (place.rating) {
        selectedInfoContainer.innerHTML += '<p><strong>Rating:</strong> ' + place.rating + '</p>';
    }
    if (place.price_level) {
        selectedInfoContainer.innerHTML += '<p><strong>Price Level:</strong> ' + place.price_level + '</p>';
    }
    if (place.reviews && place.reviews.length > 0) {
        selectedInfoContainer.innerHTML += '<p><strong>User Reviews:</strong></p>';
        selectedInfoContainer.innerHTML += '<ul>';
        place.reviews.forEach(function (review) {
            selectedInfoContainer.innerHTML += '<li>';
            selectedInfoContainer.innerHTML += '<p><strong>Author:</strong> ' + review.author_name + '</p>';
            selectedInfoContainer.innerHTML += '<p><strong>Rating:</strong> ' + review.rating + '</p>';
            selectedInfoContainer.innerHTML += '<p><strong>Comment:</strong> ' + review.text + '</p>';
            selectedInfoContainer.innerHTML += '</li>';
        });
        selectedInfoContainer.innerHTML += '</ul>';
    }
    if (place.price_level) {
        selectedInfoContainer.innerHTML += '<p><strong>Price Level:</strong> ' + Array(place.price_level + 1).join('$') + '</p>';
    }
    if (place.business_status) {
        selectedInfoContainer.innerHTML += '<p><strong>Business Status:</strong> ' + place.business_status + '</p>';
    }
	if (place.url) {
        selectedInfoContainer.innerHTML += '<p><strong>Google Maps URL:</strong> <a href="' + place.url + '" target="_blank">View on Google Maps</a></p>';
    }
	if (place.photos && place.photos.length > 0) {
        var photoUrl = place.photos[0].getUrl({ maxWidth: 300, maxHeight: 200 });
        selectedInfoContainer.innerHTML += '<img src="' + photoUrl + '" alt="Place Photo" class="img-fluid mt-2">';
    }
}
function exploreNearbyPlaces(location) {
    var request = {
        location: location,
        radius: 500, 
        types: ['restaurant', 'cafe', 'park', 'point_of_interest']
    };

    var service = new google.maps.places.PlacesService(document.createElement('div'));

    service.nearbySearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            resultsContainer.innerHTML = '<h5>Nearby Places:</h5>';
            results.forEach(function (place) {
                resultsContainer.innerHTML += '<p>' + place.name + ' - ' + place.vicinity + '</p>';
            });
        } else {
            alert('Failed to fetch nearby places. Please try again later.');
        }
    });
}
function getWeatherInfo(latitude, longitude) {
    var weatherApiEndpoint = 'https://api.openweathermap.org/data/2.5/weather';
    var apiKey = '4e6d3808c3c4e716c4110a657c0770ca';

   $.ajax({
        url: weatherApiEndpoint,
        method: 'GET',
        data: {
            lat: latitude,
            lon: longitude,
            appid: apiKey,
            units: 'metric',
        },
        success: function (response) {
            console.log('Weather API response:', response);

            var temperature = response.main.temp;
            var description = response.weather[0].description;
            var icon = response.weather[0].icon;
            var humidity = response.main.humidity;
            var windSpeed = response.wind.speed;
            var weatherInfo = `<h1> ${temperature} °C</h1>`;
            weatherInfo += `<img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon"> <p> ${description} </p>`;
            weatherInfo += `<p>Humidity: ${humidity}%</p>`;
            weatherInfo += `<p>Wind Speed: ${windSpeed} m/s</p>`;

            $("#weather-info-container").html(weatherInfo);
            showWeatherCard(); 
        },
        error: function (error) {
            console.error('Error fetching weather information:', error);
            hideWeatherInfo(); 
        },
    });
}

 function googleTranslateElementInit() {
            new google.translate.TranslateElement({
                pageLanguage: 'en',  
                includedLanguages: 'bg,es,fr,de,it,ja,ko,ru,zh-CN,el',  
            }, 'google_translate_element');
        }

