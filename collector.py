from AuxClasses import DBHelper
from apscheduler.schedulers.blocking import BlockingScheduler
import json
import requests

sched = BlockingScheduler()

@sched.scheduled_job('interval', minutes=1)
def timed_job():
	weatherStations = DBHelper.get_weather_stations()			
	for each_station in self.weatherStations:
		if each_station['isWorking'] != 1:
			continue
		params = {'q':each_station['location'],'key':"9b2cdf8b2dbf4efd9d5104838210602"}
		resp = requests.get(url="http://api.weatherapi.com/v1/current.json",params=params)
		weatherData = json.loads(resp.text)
		location = weatherData['location']
		current = weatherData['current']
		weather = {}
		weather['city'] = location['name']
		weather['country'] = location['country']
		weather['now_unixtime'] = location['localtime_epoch']
		weather['last_updated_unixtime'] = current['last_updated_epoch']
		weather['temperature'] = current['temp_c']
		weather['isDay'] = current['is_day']
		weather['condition_text'] = current['condition']['text']
		weather['condition_icon'] = current['condition']['icon']
		weather['windspeed'] = current['wind_kph']
		weather['winddir'] = current['wind_dir']
		weather['pressure'] = current['pressure_mb']
		weather['precipitation'] = current['precip_mm']
		weather['cloud'] = current['cloud']
		weather['humidity'] = current['humidity']
		DBHelper.storeWeatherData(weather)

sched.start()

