function fadeOutElement(ele,wait,duration){
	ele.style.opacity=1;
	var frames=(duration*30);			
    function f(){
    	setInterval(function(){
    		if(ele.style.opacity<=0) {return;};
    		ele.style.opacity-=(1/frames);}
    	,((duration*1000)/frames));
    }
    setTimeout(f,wait*1000);
}

function fadeInElement(ele,wait,duration){
	ele.style.opacity=0;
	var frames=(duration*30);			
    function f(){
    	setInterval(function(){
    		if(ele.style.opacity>=1) {return;};
    		ele.style.opacity+=(1/frames);console.log(ele.style.opacity);}
    	,((duration*1000)/frames));
    }
    setTimeout(f,wait*1000);
}

function updateWeatherDisplay(){
	xhr2 = new XMLHttpRequest();
	xhr2.open('GET','/api/getLastWeatherData',true)
	xhr2.onload = function(){
		var weather_icon = document.getElementById('weather_icon');
		var weather_thumbnail = document.getElementById('weather_thumbnail');
		var last_updated = document.getElementById('last_updated');
		var location = document.getElementById('location');
		var country = document.getElementById('country');
		var temperature = document.getElementById('temperature');
		var wind_speed = document.getElementById('wind_speed');
		var wind_direction = document.getElementById('wind_direction');
		var pressure = document.getElementById('pressure');
		var precipitation = document.getElementById('precipitation');
		var cloud = document.getElementById('cloud');
		var humidity = document.getElementById('humidity');
		var condition = document.getElementById('condition');

		if(this.responseText=='{}'){
			weather_thumbnail.src = "/static/images/no_data.jpg";
			last_updated.innerText = "Last updated: No data";
			location.innerText = "No data";
			country.innerText = "No data";
			temperature.innerText = "No data";
			wind_speed.innerText = "No data";
			wind_direction.innerText = "No data";
			pressure.innerText = "No data";
			precipitation.innerText = "No data";
			cloud.innerText = "No data";
			humidity.innerText = "No data";
			condition.innerText = "No data";
		}else{
			var weather = JSON.parse(this.responseText);
			weather_icon.src = weather.condition_icon;			
			last_updated.innerText = "Last updated: " + timeConverter(weather.last_updated_unixtime);
			location.innerText = weather.city;
			country.innerText = weather.country;
			temperature.innerText = weather.temperature + " °C";
			wind_speed.innerText = weather.windspeed + " kmph";
			wind_direction.innerText = weather.winddir;
			pressure.innerText = weather.pressure + " mBar";
			precipitation.innerText = weather.precipitation + " mm";
			cloud.innerText = weather.cloud + " %";
			humidity.innerText = weather.humidity + " %";
			condition.innerText = weather.condition_text;

			if(weather.condition_text=="Sunny"){				
				weather_thumbnail.src = "/static/images/sunny_day.jpg";				
			}else if(weather.condition_text=="Clear"){
				weather_thumbnail.src = "/static/images/.jpg";				
			}else if(weather.condition_text=="Partly cloudy"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/cloudy_sky.jpg";
				}else{
					weather_thumbnail.src = "/static/images/cloudy_night.jpg";
				}
			}else if(weather.condition_text=="Cloudy"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/cloudy_sky.jpg";
				}else{
					weather_thumbnail.src = "/static/images/cloudy_night.jpg";
				}
			}else if(weather.condition_text=="Overcast"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Mist"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/misty_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/misty_night.jpg";
				}
			}else if(weather.condition_text=="Thundery outbreaks possible"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Patchy rain possible"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Patchy snow possible"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Patchy sleet possible"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Patchy freezing drizzle possible"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Blowing snow"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Blizzard"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Fog"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/misty_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/misty_night.jpg";
				}
			}else if(weather.condition_text=="Freezing fog"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/misty_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/misty_night.jpg";
				}
			}else if(weather.condition_text=="Patchy light drizzle"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Light drizzle"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Freezing drizzle"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Heavy freezing drizzle"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Patchy light rain"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Light rain"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Moderate rain at times"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Moderate rain"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Heavy rain at times"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Heavy rain"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Light freezing rain"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Moderate or heavy freezing rain"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Light sleet"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Moderate or heavy sleet"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Patchy light snow"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Light snow"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Patchy moderate snow"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Moderate snow"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Patchy heavy snow"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Heavy snow"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Ice pellets"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Light rain shower"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Moderate or heavy rain shower"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Torrential rain shower"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Light sleet showers"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Moderate or heavy sleet showers"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Light snow showers"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Moderate or heavy snow showers"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Light showers of ice pellets"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Moderate or heavy showers of ice pellets"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Patchy light rain with thunder"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Moderate or heavy rain with thunder"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Patchy light snow with thunder"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Moderate or heavy snow with thunder"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}
			
		}
		
	}
	xhr2.send();
}

function keepUpdatingInstrumentOperatorUi(){
	updateInstrumentOperatorUi();
	setInterval(updateInstrumentOperatorUi,10000);
}

function updateInstrumentOperatorUi(){
	var button = document.getElementById('weatherStationButton');
	var status = document.getElementById('weather_station_status');
	button.style.opacity=1;
	var xhr = new XMLHttpRequest();
	xhr.open('GET','/api/getWeatherStation',true);
	xhr.onload = function(){
		var weather_station_status = JSON.parse(this.responseText);
		if(weather_station_status['isWorking']==1){			
			button.innerText="Shutdown";			
			button.href="/api/stopWeatherDataCollection";
			status.innerText="Running ✓";
			status.className="text-success";
		}else if(weather_station_status['isWorking']==0){
			button.innerText="Turn On";
			button.href="/api/startWeatherDataCollection";
			status.innerText="Not running ✕";
			status.className="text-danger";
		}else if(weather_station_status['isWorking']==-1){
			button.innerText="Fault Detected";
			button.href="#";
			status.innerText="Fault Detected !";
			status.className="text-warning";
		}
	}
	updateWeatherDisplay();
	xhr.send();	
}

function updateNewLocationWeatherDisplay(){
	xhr2 = new XMLHttpRequest();
	xhr2.open('POST','/api/getLastWeatherData',true);
	xhr2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr2.onload = function(){
		var weather_icon = document.getElementById('weather_icon_1');
		var weather_thumbnail = document.getElementById('weather_thumbnail_1');
		var last_updated = document.getElementById('last_updated_1');
		var location = document.getElementById('location_1');
		var country = document.getElementById('country_1');
		var temperature = document.getElementById('temperature_1');
		var wind_speed = document.getElementById('wind_speed_1');
		var wind_direction = document.getElementById('wind_direction_1');
		var pressure = document.getElementById('pressure_1');
		var precipitation = document.getElementById('precipitation_1');
		var cloud = document.getElementById('cloud_1');
		var humidity = document.getElementById('humidity_1');
		var condition = document.getElementById('condition_1');

		if(this.responseText=='{}'){
			weather_thumbnail.src = "/static/images/no_data.jpg";
			weather_icon.src = "#"; weather_icon.alt="";
			last_updated.innerText = "Last updated: No data";
			location.innerText = "No data";
			country.innerText = "No data";
			temperature.innerText = "No data";
			wind_speed.innerText = "No data";
			wind_direction.innerText = "No data";
			pressure.innerText = "No data";
			precipitation.innerText = "No data";
			cloud.innerText = "No data";
			humidity.innerText = "No data";
			condition.innerText = "No data";
		}else{
			var weather = JSON.parse(this.responseText);
			weather_icon.src = weather.condition_icon;			
			last_updated.innerText = "Last updated: " + timeConverter(weather.last_updated_unixtime);
			location.innerText = weather.city;
			country.innerText = weather.country;
			temperature.innerText = weather.temperature + " °C";
			wind_speed.innerText = weather.windspeed + " kmph";
			wind_direction.innerText = weather.winddir;
			pressure.innerText = weather.pressure + " mBar";
			precipitation.innerText = weather.precipitation + " mm";
			cloud.innerText = weather.cloud + " %";
			humidity.innerText = weather.humidity + " %";
			condition.innerText = weather.condition_text;

			if(weather.condition_text=="Sunny"){				
				weather_thumbnail.src = "/static/images/sunny_day.jpg";				
			}else if(weather.condition_text=="Clear"){
				weather_thumbnail.src = "/static/images/.jpg";				
			}else if(weather.condition_text=="Partly cloudy"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/cloudy_sky.jpg";
				}else{
					weather_thumbnail.src = "/static/images/cloudy_night.jpg";
				}
			}else if(weather.condition_text=="Cloudy"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/cloudy_sky.jpg";
				}else{
					weather_thumbnail.src = "/static/images/cloudy_night.jpg";
				}
			}else if(weather.condition_text=="Overcast"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Mist"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/misty_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/misty_night.jpg";
				}
			}else if(weather.condition_text=="Thundery outbreaks possible"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Patchy rain possible"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Patchy snow possible"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Patchy sleet possible"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Patchy freezing drizzle possible"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Blowing snow"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Blizzard"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Fog"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/misty_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/misty_night.jpg";
				}
			}else if(weather.condition_text=="Freezing fog"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/misty_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/misty_night.jpg";
				}
			}else if(weather.condition_text=="Patchy light drizzle"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Light drizzle"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Freezing drizzle"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Heavy freezing drizzle"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Patchy light rain"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Light rain"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Moderate rain at times"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Moderate rain"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Heavy rain at times"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Heavy rain"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Light freezing rain"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Moderate or heavy freezing rain"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Light sleet"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Moderate or heavy sleet"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Patchy light snow"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Light snow"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Patchy moderate snow"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Moderate snow"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Patchy heavy snow"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Heavy snow"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Ice pellets"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Light rain shower"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Moderate or heavy rain shower"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Torrential rain shower"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Light sleet showers"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/rainy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/rainy_night.jpg";
				}
			}else if(weather.condition_text=="Moderate or heavy sleet showers"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Light snow showers"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Moderate or heavy snow showers"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Light showers of ice pellets"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Moderate or heavy showers of ice pellets"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Patchy light rain with thunder"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Moderate or heavy rain with thunder"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/overcast_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/overcast_night.jpg";
				}
			}else if(weather.condition_text=="Patchy light snow with thunder"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}else if(weather.condition_text=="Moderate or heavy snow with thunder"){
				if(weather.isDay==1){
					weather_thumbnail.src = "/static/images/snowy_day.jpg";
				}else{
					weather_thumbnail.src = "/static/images/snowy_night.jpg";
				}
			}
			
		}
		
	}

	var xhr3 = new XMLHttpRequest();
	xhr3.open('GET','/api/getNewLocation',true);
	xhr3.onload = function(){
		var new_location=this.responseText;
		xhr2.send("new_location="+new_location);
	}
	xhr3.send();	
}

function updateUserUi(){	
	updateWeatherDisplay();
	updateNewLocationWeatherDisplay();
}

function keepUpdatingUserUi(){
	updateUserUi();
	setInterval(updateUserUi,10000);
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = String(a.getHours());
  var min = String(a.getMinutes());
  var sec = String(a.getSeconds());
  if(sec.length==1){
  	sec="0"+sec;
  }
  if(min.length==1){
  	min="0"+min;
  }
  if(hour.length==1){
  	hour="0"+hour;
  }
  var time = date + ' ' + month + ' ' + year + ', ' + hour + ':' + min + ':' + sec ;
  return time;
}

function search_location(){
	var button=document.getElementById('search_location_button');
	button.disabled='true';
	button.innerText="Searching...";
	var selected_location=document.getElementById('supported_locations_list')['value'];
	var xhr=new XMLHttpRequest();
	xhr.open('POST','/api/setNewLocation',false);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send('new_location='+selected_location);
	updateUserUi();
	button.innerText="Search";
	button.removeAttribute('disabled');
}

function delete_station(weatherStationID){	
	var xhr=new XMLHttpRequest();
	xhr.open("POST","/api/deleteWeatherStation",true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.onload=function(){
		document.location.reload();
	};
	xhr.send("weatherStationID="+weatherStationID);
}

function add_station(weatherStationID,location){
	var button=document.getElementById('submit_new_station_button');
	button.disabled='true';
	button.innerText="Adding...";
	var xhr=new XMLHttpRequest();
	xhr.open("POST","/api/addWeatherStation",true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.onload=function(){
		document.location.reload();
	};
	xhr.send("weatherStationID="+weatherStationID+"&location="+location);
}

function add_priv_user(fullname,email,password,user_role,location){
	var button=document.getElementById('submit_new_priv_user_button');
	button.disabled='true';
	button.innerText="Adding...";
	var xhr=new XMLHttpRequest();
	xhr.open("POST","/api/addPrivUser",true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.onload=function(){
		document.location.reload();
	};
	xhr.send("fullname="+fullname+"&email="+email+"&password="+password+"&user_role="+user_role+"&location="+location);
}

function delete_priv_user(email){
	var button=document.getElementById('delete_priv_user_button');
	button.disabled='true';
	button.innerText="Deleting...";
	var xhr=new XMLHttpRequest();
	xhr.open("POST","/api/deletePrivUser",true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.onload=function(){
		location.reload();
	};
	xhr.send("email="+email);
}

function updateAdminUi(){	
	// FOR FAULTY
	var fault_table=document.getElementById('fault_table_body');
	var ccc=document.createElement('tbody');
	var xhr=new XMLHttpRequest();
	xhr.open('GET','/api/getFaultyStations',true);
	xhr.onload=function(){
		var fault_stations=JSON.parse(this.responseText);
		var ids=Object.keys(fault_stations);
		var ls=Object.values(fault_stations);		

		for(i=0;i<ids.length;i++){
			var id=ids[i];			
			var l=ls[i];

			var tr=document.createElement('tr');

			var td_weatherStationID=document.createElement('td');
			var td_location=document.createElement('td');


			var weatherStationID = document.createTextNode(id);	
			var location = document.createTextNode(l);	

			td_weatherStationID.appendChild(weatherStationID);
			td_location.appendChild(location);

			tr.appendChild(td_weatherStationID);
			tr.appendChild(td_location);			

			ccc.appendChild(tr);
		}

		fault_table.parentNode.replaceChild(ccc,fault_table);
		ccc.id="fault_table_body";
	};

	// FOR WORKING
	var working_table=document.getElementById('working_table_body');
	var bbb=document.createElement('tbody');
	var xhr2=new XMLHttpRequest();
	xhr2.open('GET','/api/getWorkingStations',true);
	xhr2.onload=function(){
		var working_stations=JSON.parse(this.responseText);
		var ids=Object.keys(working_stations);
		var ls=Object.values(working_stations);		

		for(i=0;i<ids.length;i++){
			var id=ids[i];			
			var l=ls[i];

			var tr=document.createElement('tr');

			var td_weatherStationID=document.createElement('td');
			var td_location=document.createElement('td');


			var weatherStationID = document.createTextNode(id);	
			var location = document.createTextNode(l);	

			td_weatherStationID.appendChild(weatherStationID);
			td_location.appendChild(location);

			tr.appendChild(td_weatherStationID);
			tr.appendChild(td_location);			

			bbb.appendChild(tr);

		}

		working_table.parentNode.replaceChild(bbb,working_table);
		bbb.id="working_table_body";
	};

	// FOR NOT WORKING
	var not_working_table=document.getElementById('not_working_table_body');
	var aaa=document.createElement('tbody');
	var xhr3=new XMLHttpRequest();
	xhr3.open('GET','/api/getNotWorkingStations',true);
	xhr3.onload=function(){
		var not_working_stations=JSON.parse(this.responseText);
		var ids=Object.keys(not_working_stations);
		var ls=Object.values(not_working_stations);		

		for(i=0;i<ids.length;i++){
			var id=ids[i];			
			var l=ls[i];

			var tr=document.createElement('tr');

			var td_weatherStationID=document.createElement('td');
			var td_location=document.createElement('td');


			var weatherStationID = document.createTextNode(id);	
			var location = document.createTextNode(l);	

			td_weatherStationID.appendChild(weatherStationID);
			td_location.appendChild(location);

			tr.appendChild(td_weatherStationID);
			tr.appendChild(td_location);			

			aaa.appendChild(tr);
		}

		not_working_table.parentNode.replaceChild(aaa,not_working_table);
		aaa.id="not_working_table_body";
	};

	xhr.send();
	xhr2.send();
	xhr3.send();
}

function keepUpdatingAdminUi(){
	updateAdminUi();
	setInterval(updateAdminUi,10000);
}

function turn_on_collector(){	
	var xhr=new XMLHttpRequest();
	xhr.open('GET',"/api/startCollector",true);
	xhr.onload=function(){
		document.location="/dashboard";
	};
	xhr.send();
}

function turn_off_collector(){
	var xhr=new XMLHttpRequest();
	xhr.open('GET',"/api/stopCollector",true);
	xhr.onload=function(){
		document.location="/dashboard";
	};
	xhr.send();
}