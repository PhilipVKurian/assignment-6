localStorage.removeItem("debug");
$(document).ready(function() {   
    var day = dayjs().format('DD');
    var hour = dayjs().format('HH');
    var DisplayWeather = function(n){
        var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+n+"&units=metric&appid=ee1d180c5b424d260ddb1d1ce6058778";
        fetch(apiUrl).then(function(response){
            if (response.ok){
                response.json().then(function(data){
                    console.log(data.weather[0].icon);
                    $('#today').children('h2').text(data.name);
                    $('#icon-today').children('img').attr("src", "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png");
                    $('.card-footer').children('li').eq(0).text("Temperature: "+data.main.temp + " C");
                    $('.card-footer').children('li').eq(1).text("Humidity: "+data.main.humidity + " %");
                    $('.card-footer').children('li').eq(2).text("Wind: "+data.wind.speed + " MPH");
                })
            }
        })        
        var fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+n+"&units=metric&appid=ee1d180c5b424d260ddb1d1ce6058778";
        fetch(fiveDayUrl).then(function(response){
            if (response.ok){
                response.json().then(function(data){

                    for(var i = 0; i < data.list.length; i++){
                        var arrayDay = parseInt(data.list[i].dt_txt.slice(8,10));
                        var arrayTime = parseInt(data.list[i].dt_txt.slice(11,13));
                        let currentDay = parseInt(day);
                        let currentHour = parseInt(hour);
                        var dayNumber = 0;
                        if(currentDay+1 == arrayDay && (arrayTime-currentHour == 0 || arrayTime-currentHour == 1 || arrayTime-currentHour == -1 || arrayTime-currentHour == -23)){
                            dayNumber = 1;
                            populateCards(dayNumber, data, i);
                        }else if(currentDay+2 == arrayDay &&  (arrayTime-currentHour == 0 || arrayTime-currentHour == 1 || arrayTime-currentHour == -1 || arrayTime-currentHour == -23)){
                            dayNumber = 2;
                            populateCards(dayNumber, data, i);
                        }else if(currentDay+3 == arrayDay &&  (arrayTime-currentHour == 0 || arrayTime-currentHour == 1 || arrayTime-currentHour == -1 || arrayTime-currentHour == -23)){
                            dayNumber = 3;
                            populateCards(dayNumber, data, i);
                        }else if(currentDay+4 == arrayDay  &&  (arrayTime-currentHour == 0 || arrayTime-currentHour == 1 || arrayTime-currentHour == -1 || arrayTime-currentHour == -23)){
                            dayNumber = 4;
                            populateCards(dayNumber, data, i);
                        }else if(currentDay+5 == arrayDay  &&  (arrayTime-currentHour == 0 || arrayTime-currentHour == 1 || arrayTime-currentHour == -1 || arrayTime-currentHour == -23)){
                            dayNumber = 5;
                            populateCards(dayNumber, data, i);
                        }
                    }
                })
            }
        })

        function populateCards (d, data, i){
            console.log(data + "data");
            $('#day-'+ d).find('img').attr("src", "https://openweathermap.org/img/wn/"+data.list[i].weather[0].icon+"@2x.png");
            $('#day-'+ d).find('.title').text(data.list[i].dt_txt);
            $('#day-'+ d).find('.card-footer').children('li').eq(0).text("Temperature: "+data.list[i].main.temp + " C");
            $('#day-'+ d).find('.card-footer').children('li').eq(1).text("Humidity: "+data.list[i].main.humidity + " %");
            $('#day-'+ d).find('.card-footer').children('li').eq(2).text("Wind: "+data.list[i].wind.speed + " MPH");

        }
    }; 
    
    if(localStorage.length == 0 )
       $('section').css("visibility", "hidden");
    else
        for(var i = 0; i < localStorage.length; i++){
            var buttonNew = document.createElement("button");
            buttonNew.className = "button is-link created";
            buttonNew.innerHTML = localStorage[i+1];
            buttonNew.value = localStorage[i+1];
            $("#stored-cities").append(buttonNew);
        }
        DisplayWeather(localStorage.getItem(1));

    $('#search-button').click( function(){
        $('section').css("visibility", "visible");
        var cityName = $(this).siblings('#city-name').val();

        if (cityName == ""){
            alert("please enter a valid city name");
            return;
        }
        else{
            localStorage.setItem(localStorage.length+1, cityName);
            var buttonNew = document.createElement("button");
            buttonNew.className = "button is-link created";
            buttonNew.innerHTML = cityName;
            $("#stored-cities").append(buttonNew);
            DisplayWeather(cityName); 
            location.reload();           
        } 
    });
    $(".created").click(function(){
        var cityName = $(this).val();
        DisplayWeather(cityName);
    })
});