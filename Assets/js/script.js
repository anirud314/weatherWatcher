var searchHistory = localStorage.getItem('searchHistory')? JSON.parse(localStorage.getItem('searchHistory')):[];
//var searchQuery = '';
//var apiKey = d07c8b701886b8b4c094668aee47dc1a;
var gcwQuery = function(query) {
    console.log(query);
    fetch(
        'https://api.openweathermap.org/data/2.5/weather?q='+ query +'&appid=d07c8b701886b8b4c094668aee47dc1a'
    )
    .then(function(wResponse){
        return wResponse.json();
    })
    .then(function(wResponse) {
        //console.log(wResponse);
        //console.log(wResponse.name);
        //console.log(wResponse.coord.lat, wResponse.coord.lon);
        var locationName = wResponse.name;
        var locationLat = wResponse.coord.lat;
        var locationLong = wResponse.coord.lon;
        fetch (
            'https://api.openweathermap.org/data/2.5/onecall?lat='+locationLat+'&lon='+locationLong+'&units=imperial&exclude=minutely,hourly&appid=d07c8b701886b8b4c094668aee47dc1a'
        )
        .then(function(wDetailsResponse) {
            return wDetailsResponse.json();
        })
        .then(function(wDetailsResponse){
            /*var responseArr = [wResponse, wDetailsResponse];*/
            var responseObj = {name:locationName, details: wDetailsResponse}
            //console.log(responseObj);
            buildCWCard(responseObj);
            //buildCWCard(responseArr);
            //buildCWCard(wResponse, wDetailsResponse);
            return responseObj;
        });
        
    });

}

var gcwCity = function(target) {
    target.preventDefault();
    var searchQuery = target.srcElement.innerText;
    gcwQuery(searchQuery);
}

var gcwSearch = function(target) {
    target.preventDefault();
    var searchQuery = target.srcElement.previousElementSibling.value;
    gcwQuery(searchQuery);
}

var buildCWCard = function(response) {
    //console.log(response);
    //console.log("Name",response[0]);
    console.log("Name",response.name);
    //console.log("Details",response[1]);
    console.log("Details",response.details);
    addSearchHistory(response.name);
    /*Build Current weather card*/
    var currWeatherDiv = document.getElementById("current-weather");
    currWeatherDiv.innerHTML = '';
    var currentDate = new Date(response.details.current.dt*1000);
    currentDate = currentDate.toLocaleDateString();
    var titleEl = document.createElement("h2");
    titleEl.innerHTML = response.name+ " "+currentDate+" "+ "<img src = ./Assets/img/"+response.details.current.weather[0].icon+"@2x.png >";
    currWeatherDiv.appendChild(titleEl);
    var tempEl = document.createElement("p");
    tempEl.innerHTML = "Temperature: "+ response.details.current.temp;
    currWeatherDiv.appendChild(tempEl);
    var humEl = document.createElement("p");
    humEl.innerHTML = "Humidity: "+ response.details.current.humidity;
    currWeatherDiv.appendChild(humEl);
    var windSpEl = document.createElement("p");
    windSpEl.innerHTML = "Wind Speed: "+ response.details.current.wind_speed;
    currWeatherDiv.appendChild(windSpEl);
    var uvEl = document.createElement("p");
    uvEl.innerHTML = "UV Index: "+ response.details.current.uvi;
    currWeatherDiv.appendChild(uvEl);

    buildForcastCards(response.details.daily);
/*
city name, - response.name
the date, - response.details
an icon representation of weather conditions, -response.details
the temperature, -response.details
the humidity, -response.details
the wind speed, -response.details
and the UV index -response.details
*/
}

var buildForcastCards = function(fResponse) {
    console.log(fResponse);
    var weatherForcastDiv = document.getElementById("current-forcast");
    weatherForcastDiv.innerHTML = '';
    for(var i = 0; i <((fResponse.length)-2); i++){
        var forcastDiv = document.createElement("div");
        //Date
        var fDate = document.createElement("h4");
        var forcastDate = new Date(fResponse[i].dt*1000);
        forcastDate = forcastDate.toLocaleDateString();
        fDate.innerHTML = forcastDate;
        forcastDiv.appendChild(fDate);
        //weatherIcon
        var fIcon = document.createElement("img");
        fIcon.setAttribute('src','./Assets/img/'+fResponse[i].weather[0].icon + '@2x.png');
        forcastDiv.appendChild(fIcon);
        //temp
        var fTemp = document.createElement("p");
        fTemp.innerHTML = "Temp: "+ fResponse[i].temp.day;
        forcastDiv.appendChild(fTemp);
        //Humidity
        var fHumi = document.createElement("p");
        fHumi.innerHTML = "Humidity: "+ fResponse[i].humidity;
        forcastDiv.appendChild(fHumi);

        weatherForcastDiv.appendChild(forcastDiv);
    }
    /*Build Current weather card*/
}

var addSearchHistory = function(searchParam) {
    console.log(searchParam);
    for(var i = 0; i < searchHistory.length; i++) {
        if (searchHistory[i] === searchParam) {
            //console.log("delete "+searchHistory[i] + "\nbecause " + searchHistory[i]+" === "+ searchParam);
            searchHistory.splice(i, 1);
        }
    }
    if (searchHistory.length > 5) {
        //console.log("List is too long")
        searchHistory.shift();
    }
    searchHistory.push(searchParam);
    //console.log(searchHistory);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

var populateSearchHistory = function() {
    var searchHistoryList = document.getElementById("search-history-list");
    console.log(searchHistory);
    searchHistoryList.innerHTML = '';
    for(var i = searchHistory.length - 1; i >=0; i--){ // Had to do this to iterate and order the saved search list correctly
        console.log(searchHistory[i]);
        //var cityName = searchHistory[i].toString();
        /*var searchEl = $("<li>")
            .text(cityName);
            searchHistoryList.append(searchEl);*/
        var searchEl = document.createElement("li");
        searchEl.innerText = searchHistory[i];
        searchEl.addEventListener('click', gcwCity);
        searchHistoryList.appendChild(searchEl);
    }
        
}

var init = function() {
    var cities = document.querySelectorAll('.city')
    Array.from(cities).forEach(function(element){
        element.addEventListener('click', gcwCity);
    })

    var searchBar = document.getElementById("search-button");
    searchBar.addEventListener('click', gcwSearch);

    if(searchHistory.length) {
        populateSearchHistory();
        gcwQuery(searchHistory[searchHistory.length-1]);
    }
    else {
        $('#search-history-list').empty();
        $('#current-weather').empty();
        $('#current-forcast').empty();
    }
}

init();