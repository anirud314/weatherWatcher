# 06 Server-Side APIs: Weather Dashboard

# Link: https://anirud314.github.io/weatherWatcher/

## ScreenShot

![myDemo](./Assets/img/WeatherApp.gif)

## Report

So This week I had alot of stuff to do, because of personal circumstances and because of the group project that we started doing. I am not using it as an excuse, I am just justifying why I made decisions that I made.

So to start of with I took the user story and broke it down based on features

GIVEN a weather dashboard with form inputs 
-> Meant have a form with a text input in the index.html

WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
-> meant that when a city is searched for there is a need to store that search in localStorage & when search occurs the result is meant to show a current value (current weather) and future val (weather forcast).

WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index 
-> meant that the current value (currentWeather) needs to show the city name the date the icon for its weather condition, the temp, the humidity, the wind speed, and the uv index.

WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
-> meant that we have to distinguish the difference between favorable moderate and severe UV values and represent it in the web app

WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
-> meant that I have to present a 5-day forcast and each should display the date and icon based on weather condition the temp, and the humidity

WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
-> meant a visible search history that I can use to also query the currentWeather and forcasts.

This is a basic gist of my mindset. Now I will go over what I did to tackle each issue

I started by trying to use the openweathermap api. I used their basic weather fetch to start off with

```
fetch( // fetch based on city name
        'https://api.openweathermap.org/data/2.5/weather?q='+ query +'&appid=d07c8b701886b8b4c094668aee47dc1a'
    )
```
This fetch uses a value that is queried by the user. I wrote my code to take a query input from either the search bar or the dropdown for popular cities. Or from the search history. I got the idea to add a popular cities tab based on talking to a couple of classmates. They said that it made it easier for them to test their searches instead of constantly typing out a city name. I decided it was a good idea to repurpose at least for testing.

This fetch returns a value that I assigned to a second fetch, the first fetch allowed me to get a longitude and latitude value that I could use on my second fetch to get all of the other values needed in order to make the current weather and forcast elements and fill them with correct data.

```
 fetch ( // fetch details including uvi data using longitude and latitude
            'https://api.openweathermap.org/data/2.5/onecall?lat='+locationLat+'&lon='+locationLong+'&units=imperial&exclude=minutely,hourly&appid=d07c8b701886b8b4c094668aee47dc1a'
        )
```

I then created a response object out of it and passed it to a function that would build the elements that can be displayed in the web page using the given data

```
var buildCWCard = function(response) { 
    addSearchHistory(response.name); 
/*BUILD ELEMENT CODE AND APPEND CODE IN SCRIPT.JS

    buildForcastCards(response.details.daily); 
```

I dont want to show the whole thing in the readme because I have comments explaining everything. Basically I did alot of .createElement and append statements to create the element for the current weather and eventually appended that whole element to a div that was in the index already by using getElementID and append. After building the current weather element I call a buildForcastCards() function and pass a specific value. By using specifiers I specified an array of daily forcasts from the response that I got from the object I created from the fetch calls (specifically the second fetch).

I then followed the same process to create elements for the 5 day weather forcast data.

```
var buildForcastCards = function(fResponse) { 
    var weatherForcastDiv = document.getElementById("current-forcast");
    weatherForcastDiv.innerHTML = '';
    for(var i = 1; i <((fResponse.length)-2); i++){ 
        /*BUILD ELEMENT CODE AND APPEND CODE IN SCRIPT.JS*/
        weatherForcastDiv.appendChild(forcastDiv);
    }
}
```
Alot of it was the same process as the buildCWCard() function except that I am using an altered for loop to iterate through the array of days forcasts that I passed into the function to create elements based on each day in the array, barring parameters used to constrain the for loop. I started i at one instead of 0 because I wanted to start forcasts on the day after the currentWeater day. and I did fResponse.length-2 to limit the iteration to 5 because we only need 5 days

I used an addSearchHistory function to add the users search to a list and store it into local storage. Tried to keep that list in order of recently searched to oldest searched. I used splice to remove and replace searches that were already made when the user searches for it again. That way there is no repeats. And I also used shift() to limit the amount of values in that array I kept that list at 6 values maximum. After all of that is done the value is pushed into the searchHistory array and then stored in local storage

I used the populateSearchHistory to make the search History visible to the user, I also made it display recently searched to oldest searched, in that order. I did this by sort of reversing a for loop

Instead of this

```
for(var i = 0; i < searchHistory.length; i++) {
```
I did this

```
for(var i = searchHistory.length - 1; i >=0; i--)
```
I start at the last value in the searchHistory using searchHistory.length - 1 to get the correct index val rather than the length val. I wrote to do this while i is greater than or equal to 0, and lastly made i iterate down.
This allows me to catch the last value pushed into the array first and keep the first value pushed into the array last. which allows me to display the elements in the order of newest to oldest search made.

lastly I have a driver function that initializes the entire code and adds eventListeners to all of the popular city options as well as the search button in the search bar. On initial launch the code will either display the value of the last search made, or everything will be empty except for the search bar.

## Troubles

I had alot of time management troubles with this project because I was balancing it with the team project as well as some personal matters. Which made me have to rush it as best as I could.

The reason I bring this up is because I aimed for functionality rather than clean style. It is currently 10:30pm on sunday may 2nd. I spent a good amount of time trying to make sure my data structures worked. I left styling it last minute and I sort of struggled with using bootstrap. Mostly because I forgot some basic concepts, but That ate alot of my time. I would rather turn it a almost complete assignment and finish it on my own time rather than not turn it in to perfect it. I did take that I need a lot more practice with bootstrap.

Another thing that I was trying was using different methods to do things in my code. Specifically using jquery. Now I did successfully do it once in the code to empty out and initialize my app. However I wanted to use it when creating elements for the current weather and forcast and failed miserably. Instead of wasting more time than I already did I just switched to using vanilla js for those parts, but it did frustrate me that I couldnt do what I wanted to do. There are other instances of this that I commented in my code.

## My takeaways

I wanted to say that for this project I was able to better understand how to use server side api's a bit better. I also look forward to playing with them more. I am using this experience for my project as well, and sort of spent this whole week focusing on that rather than this challenge. I was able to use this weeks project as well to help me practice for this challenge and more importantly for my group project. I do also notice that I need to practice styling even with bootstrap, and using jquery. I tend to neglect that and focus more on functionality rather than the look of the app which I should learn to fix.

## Instructions

Developers are often tasked with retrieving data from another application's API and using it in the context of their own. Third-party APIs allow developers to access their data and functionality by making requests with specific parameters to a URL. Your challenge is to build a weather dashboard that will run in the browser and feature dynamically updated HTML and CSS.

Use the [OpenWeather API](https://openweathermap.org/api) to retrieve weather data for cities. The documentation includes a section called "How to start" that will provide basic setup and usage instructions. Use `localStorage` to store any persistent data.

## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```

The following image demonstrates the application functionality:

![weather dashboard demo](./Assets/img/06-server-side-apis-homework-demo.png)

## Review

You are required to submit the following for review:

* The URL of the deployed application.

* The URL of the GitHub repository. Give the repository a unique name and include a README describing the project.

- - -
© 2021 Trilogy Education Services, LLC, a 2U, Inc. brand. Confidential and Proprietary. All Rights Reserved.
