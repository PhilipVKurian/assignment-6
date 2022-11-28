                  //Wait till document is ready
$(document).ready(function() {   
    var day = dayjs().format('DD');
    var hour = dayjs().format('HH');
    //displays the weather recieving the city as a parameter (string)
    var DisplayWeather = function(n){
        var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+n+"&units=metric&appid=ee1d180c5b424d260ddb1d1ce6058778";
        fetch(apiUrl).then(function(response){
            if (response.ok){
                response.json().then(function(data){
                    $('#today').children('h2').text(data.name);
                    $('#icon-today').children('img').attr("src", "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png");
                    $('.card-footer').children('li').eq(0).text("Temperature: "+data.main.temp + " C");
                    $('.card-footer').children('li').eq(1).text("Humidity: "+data.main.humidity + " %");
                    $('.card-footer').children('li').eq(2).text("Wind: "+data.wind.speed + " MPH");
                })
            }
        })    
        //fetch and display the 5 day forecast for the current time    
        var fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+n+"&units=metric&appid=ee1d180c5b424d260ddb1d1ce6058778";
        fetch(fiveDayUrl).then(function(response){
            if (response.ok){
                response.json().then(function(data){
                    for(var i = 0; i < data.list.length; i++){
                        var arrayTime = parseInt(data.list[i].dt_txt.slice(11,13));
                        let currentHour = parseInt(hour);
                        var arrayDate =  dayjs(data.list[i].dt_txt.slice(0,10));
                        var currentDate = dayjs();
                        var hourDifference = arrayTime-currentHour;
                        var dateDifference = arrayDate.diff(currentDate , 'day');
                        var dayNumber = 0;
                        if(dateDifference == 0 && [0,1,-1,-23].includes(hourDifference)){
                            dayNumber = 1;
                            populateCards(dayNumber, data, i);
                        }else if(dateDifference == 1 &&  [0,1,-1,-23].includes(hourDifference)){
                            dayNumber = 2;
                            populateCards(dayNumber, data, i);
                        }else if(dateDifference == 2 &&  [0,1,-1,-23].includes(hourDifference)){
                            dayNumber = 3;
                            populateCards(dayNumber, data, i);
                        }else if(dateDifference == 3  &&  [0,1,-1,-23].includes(hourDifference)){
                            dayNumber = 4;
                            populateCards(dayNumber, data, i);
                        }else if(dateDifference == 4  &&  [0,1,-1,-23].includes(hourDifference)){
                            dayNumber = 5;
                            populateCards(dayNumber, data, i);
                        }
                    }
                })
            }
        })
        //when called will populate the html elements with data extracted from the api
        function populateCards (d, data, i){
            $('#day-'+ d).find('img').attr("src", "https://openweathermap.org/img/wn/"+data.list[i].weather[0].icon+"@2x.png");
            $('#day-'+ d).find('.title').text(data.list[i].dt_txt);
            $('#day-'+ d).find('.card-footer').children('li').eq(0).text("Temperature: "+data.list[i].main.temp + " C");
            $('#day-'+ d).find('.card-footer').children('li').eq(1).text("Humidity: "+data.list[i].main.humidity + " %");
            $('#day-'+ d).find('.card-footer').children('li').eq(2).text("Wind: "+data.list[i].wind.speed + " MPH");

        }
    }
    //On page load will check if any cities are in local storage and if not will hide html elements, if objects are present buttons will be created with their values
    if(localStorage.length == 0 )
       $('section').css("visibility", "hidden");
    else{        
        for(var i = 0; i < localStorage.length; i++){

            if( localStorage.getItem(i) != null){
                var buttonNew = document.createElement("button");
                buttonNew.className = "button is-link created";
                buttonNew.innerHTML = localStorage[i];
                buttonNew.value = localStorage[i];
                $("#stored-cities").append(buttonNew);                
            }
        }
        DisplayWeather(localStorage.getItem(localStorage.length-1));
    }  

    //click handler for the search button
    $('#search-button').click( function(){
        $('section').css("visibility", "visible");
        var cityName = $(this).siblings('#city-name').val();

        if (cityName == ""){
            alert("please enter a valid city name");
            return;
        }
        else{
            localStorage.setItem(localStorage.length, cityName);
            var buttonNew = document.createElement("button");
            buttonNew.className = "button is-link created";
            buttonNew.innerHTML = cityName;
            buttonNew.value = cityName;
            $("#stored-cities").append(buttonNew);
            DisplayWeather(cityName);                  
        } 
        location.reload();        
    });
    //click handler for the created buttons of saved cities
    $(".created").click(function(){
        var cityName = $(this).val();
        DisplayWeather(cityName);  
    })
})