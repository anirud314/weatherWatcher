var searchHistory = localStorage.getItem('searchHistory')? JSON.parse(localStorage.getItem('searchHistory')):[];
//var apiKey = d07c8b701886b8b4c094668aee47dc1a; // Tried to seperate API key --- FAILED
var gcwQuery = function(query) { // Function to use api for openweathermap to find the weather based on the city
    console.log(query);
    fetch( // fetch based on city name
        'https://api.openweathermap.org/data/2.5/weather?q='+ query +'&appid=d07c8b701886b8b4c094668aee47dc1a'
    )
    .then(function(wResponse){
        return wResponse.json();
    })
    .then(function(wResponse) {
        //console.log(wResponse);
        //console.log(wResponse.name);
        //console.log(wResponse.coord.lat, wResponse.coord.lon);
        var locationName = wResponse.name; // name of location
        var locationLat = wResponse.coord.lat; // assign found latitude coordinate to variable
        var locationLong = wResponse.coord.lon; // assign found longitude coordinate to variable
        fetch ( // fetch details including uvi data using longitude and latitude
            'https://api.openweathermap.org/data/2.5/onecall?lat='+locationLat+'&lon='+locationLong+'&units=imperial&exclude=minutely,hourly&appid=d07c8b701886b8b4c094668aee47dc1a'
        )
        .then(function(wDetailsResponse) {
            return wDetailsResponse.json();
        })
        .then(function(wDetailsResponse){ 
            var responseObj = {name:locationName, details: wDetailsResponse} // create an object that has the location name we found from first api fetch and the details about the weather we fetched from the second api cal
            //console.log(responseObj);
            buildCWCard(responseObj); // call the function buildCWCArd using responseObj
            return responseObj;
        });
        
    });

}

var gcwCity = function(target) { // search function that passes the value in the previous searches list and the popular searches list 
    target.preventDefault();
    var searchQuery = target.srcElement.innerText;
    gcwQuery(searchQuery);
}

var gcwSearch = function(target) { // search function that passes the value in the search bar
    target.preventDefault(); 
    var searchQuery = target.srcElement.previousElementSibling.value;
    gcwQuery(searchQuery);
}

var buildCWCard = function(response) { // function builds the current weather card and displays weather
    //console.log(response);
    //console.log("Name",response[0]);
    //console.log("Name",response.name);
    //console.log("Details",response[1]);
    //console.log("Details",response.details);
    addSearchHistory(response.name); // adds search to the searchHistory array and into local storage using the addSearchHistory function by passing the location name value in the response object
    /*Build Current weather card*/
    var currWeatherDiv = document.getElementById("current-weather"); // target and assign div with id current weather to a variable
    currWeatherDiv.innerHTML = ''; // set the div's inner html to be empty
    var currentDate = new Date(response.details.current.dt*1000); // store date value in current date. Had to *1000 to get correct val from unix
    currentDate = currentDate.toLocaleDateString(); // used tolocaledatestring to convert value to numerial date (1/1/11)
    var titleEl = document.createElement("h2"); // create title element
    titleEl.innerHTML = response.name+ " "+currentDate+ " <img src = ./Assets/img/"+response.details.current.weather[0].icon+"@2x.png >"; // title elements innerHTML has city name, current date and image for weather based on an icon
    currWeatherDiv.appendChild(titleEl); 
    var tempEl = document.createElement("p"); // create a p element to hold the temperature
    tempEl.innerHTML = "Temperature: "+ response.details.current.temp + "°F";
    currWeatherDiv.appendChild(tempEl);
    var humEl = document.createElement("p"); // create a p element to hold the humidity
    humEl.innerHTML = "Humidity: "+ response.details.current.humidity + "%";
    currWeatherDiv.appendChild(humEl);
    var windSpEl = document.createElement("p"); // create a p element to hold the wind speed
    windSpEl.innerHTML = "Wind Speed: "+ response.details.current.wind_speed +" MPH";
    currWeatherDiv.appendChild(windSpEl);
    var uvEl = document.createElement("p"); // create a p element to hold the uvi
    uvEl.innerHTML = "UV Index: "+ response.details.current.uvi;
    /*switch (response.details.current.uvi) { // Switch case attempt ----- FAILED
        case (response.details.current.uvi < 3):
            uvEl.className = 'bg-success';
            break;
        case (response.details.current.uvi < 6):
            uvEl.className = ' bg-warning';
            break;
        case (response.details.current.uvi < 11):
            uvEl.className = ' bg-danger';
            break;
    }*/
    // if statement to style the uvEl
    if (response.details.current.uvi < 3) { // if uvi is less than three
        uvEl.className = 'bg-success text-white'; // style with bootstrap to be highlighted green
    }
    else if (response.details.current.uvi < 6) { // if uvi is less than 6
        uvEl.className = ' bg-warning text-dark'; // style with bootstrap to be highlighted yellow
    }
    else if (response.details.current.uvi < 11) { // if uvi is less than 11
        uvEl.className = ' bg-danger text-white'; // style with bootstrap to be highlighted red
    }
    else {
        uvEl.className = ' bg-secondary text-white'; // otherwise highlight grey
    }
    currWeatherDiv.appendChild(uvEl);

    buildForcastCards(response.details.daily); // calls function to build forcast cards by passing in the response.details.daily array which holds 7 days worth of forcasts.
}

var buildForcastCards = function(fResponse) { // Builds forcast cards with 5 forcasts each
    //console.log(fResponse);
    var weatherForcastDiv = document.getElementById("current-forcast");
    weatherForcastDiv.innerHTML = '';
    for(var i = 1; i <((fResponse.length)-2); i++){ // in order to get next 5 days I had to start at index i and go all the way to 2 before the max length of the array(fResponse.length - 2) 
        var forcastDiv = document.createElement("div"); // Create a div element called forcast
        forcastDiv.className = "card m-2"; // assign a class card to make a card using bootstrap | used m-2 to create margin
        //Date
        var fDate = document.createElement("h4"); // create a h4 element
        var forcastDate = new Date(fResponse[i].dt*1000); // store date value in forcast date. Had to *1000 to get correct val from unix
        forcastDate = forcastDate.toLocaleDateString(); // used .toLocaleDateString to just get the date
        fDate.innerHTML = forcastDate; // assign fDates innerHTML to be forcast Date
        forcastDiv.appendChild(fDate); // append fDate to forcastDiv
        //weatherIcon
        var fIcon = document.createElement("img"); // create and set icon image based on data from the fResponse
        fIcon.setAttribute('src','./Assets/img/'+fResponse[i].weather[0].icon + '@2x.png');
        forcastDiv.appendChild(fIcon);
        //temp
        var fTemp = document.createElement("p"); // creates an element for the forcast temperature
        fTemp.innerHTML = "Temp: "+ fResponse[i].temp.day + "°F";
        forcastDiv.appendChild(fTemp);
        //Humidity
        var fHumi = document.createElement("p"); // creates an element for the forcast humidity
        fHumi.innerHTML = "Humidity: "+ fResponse[i].humidity + "%";;
        forcastDiv.appendChild(fHumi);

        weatherForcastDiv.appendChild(forcastDiv);
    }
}

var addSearchHistory = function(searchParam) { // adds search to local storage
    console.log(searchParam);
    for(var i = 0; i < searchHistory.length; i++) { // for each item in the searchHistory array
        if (searchHistory[i] === searchParam) { // if the searchParam is the same as the value in searchHistory[i]
            //console.log("delete "+searchHistory[i] + "\nbecause " + searchHistory[i]+" === "+ searchParam);
            searchHistory.splice(i, 1);// splice/remove that value
            populateSearchHistory(); // reload searchHistory into webpage
        }
    }
    if (searchHistory.length > 5) { // Limit the amount in search history to 6
        //console.log("List is too long")
        searchHistory.shift(); // shifts out the oldest value in the array
        populateSearchHistory(); // reload searchHistory into webpage
    }
    searchHistory.push(searchParam); // push searchParam value into searchHistory array
    populateSearchHistory(); // reload searchHistory into webpage
    //console.log(searchHistory);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory)); // set value in searchHistory array in local storage
}

var populateSearchHistory = function() {
    var searchHistoryList = document.getElementById("search-history-list"); // get element in html to show the list in
    //console.log(searchHistory);
    searchHistoryList.innerHTML = ''; // resets innerHtml to empty every time its run
    for(var i = searchHistory.length - 1; i >=0; i--){ // Had to do this to iterate and order the saved search list a bit more cleanly
        //console.log(searchHistory[i]);
        //var cityName = searchHistory[i].toString(); // Tried to use jquery for this----- failed miserably
        /*var searchEl = $("<li>")
            .text(cityName);
            searchHistoryList.append(searchEl);*/
        var searchEl = document.createElement("li"); // create a list item for a search element based off of previous search
        searchEl.innerText = searchHistory[i];
        searchEl.addEventListener('click', gcwCity); // add event listener that calls gcwCity function
        searchHistoryList.appendChild(searchEl);
    }
        
}

var init = function() { // driver function
    var cities = document.querySelectorAll('.city') // queries all cities in the dropdown
    Array.from(cities).forEach(function(element){ // creates an array from the cities elements and for each element
        element.addEventListener('click', gcwCity); // add an event listener that calls gcwCity function on click
    })

    var searchBar = document.getElementById("search-button"); // gets search bar's button using its id
    searchBar.addEventListener('click', gcwSearch); // add event listener that calls gcwSearch function on click

    if(searchHistory.length) { // if searchHistory has a length value
        populateSearchHistory(); // populate the search History section
        gcwQuery(searchHistory[searchHistory.length-1]); // call gcwQuery using the most recent query
    }
    else {
        $('#search-history-list').empty(); // otherwise empty everything except the search bar
        $('#current-weather').empty();
        $('#current-forcast').empty();
    }
}

init();