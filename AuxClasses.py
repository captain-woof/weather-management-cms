#!/usr/bin/python3

import sqlite3
import requests
import json
from time import sleep
from threading import Thread

class DBHelper:
	@staticmethod
	def get_connection():
		conn = sqlite3.connect('wis_database.db')
		return conn

	@staticmethod
	def user_exists(email):
		conn = DBHelper.get_connection()
		conn.row_factory = sqlite3.Row
		res = conn.cursor().execute("SELECT * FROM users WHERE email=?",[email])
		result = res.fetchone()
		conn.close()
		if result:
			return True
		else:
			return False

	@staticmethod
	def register_user(email,password,fullname,location):
		conn = DBHelper.get_connection()
		cur = conn.cursor()
		try:
			cur.execute("INSERT INTO users(email,password,fullname,user_role,location) VALUES (?,?,?,?,?,)",[email,password,fullname,'user',location])
			conn.commit()
		except:
			pass
		conn.close()

	@staticmethod
	def check_creds(email,password):
		conn = DBHelper.get_connection()
		conn.row_factory = sqlite3.Row
		cursor = conn.cursor()
		cursor.execute("SELECT * FROM users WHERE email=? AND password=?",[email,password])
		result = cursor.fetchone()
		conn.close()
		return result

	@staticmethod
	def get_weather_stations():
		conn = DBHelper.get_connection()
		conn.row_factory = sqlite3.Row
		cur = conn.cursor()
		res = cur.execute("SELECT * FROM weather_stations").fetchall()
		conn.close()
		return res

	@staticmethod
	def get_weather_station(location):
		conn = DBHelper.get_connection()
		conn.row_factory = sqlite3.Row
		cur = conn.cursor()
		res = cur.execute("SELECT * FROM weather_stations WHERE location=?",[location]).fetchone()
		conn.close()
		if res is not None:
			return res
		else:
			return {}

	@staticmethod
	def delete_weather_station(weatherStationID):
		conn = DBHelper.get_connection()
		conn.row_factory = sqlite3.Row
		cur = conn.cursor()
		try:
			cur.execute("DELETE FROM weather_stations WHERE weatherStationID=?",[weatherStationID])
			conn.commit()
		except:
			pass
		conn.close()

	@staticmethod
	def add_weather_station(weatherStationID,location):
		conn = DBHelper.get_connection()
		conn.row_factory = sqlite3.Row
		cur = conn.cursor()
		try:
			cur.execute("INSERT INTO weather_stations(weatherStationID,location,isWorking) VALUES (?,?,0)",[weatherStationID,location])
			conn.commit()
		except:
			pass
		conn.close()
			
	@staticmethod
	def get_supported_locations():
		conn = DBHelper.get_connection()
		conn.row_factory = sqlite3.Row
		cur = conn.cursor()
		res = cur.execute("SELECT location FROM weather_stations").fetchall()
		conn.close()
		return res

	@staticmethod
	def get_last_weather_data(location):
		conn = DBHelper.get_connection()
		conn.row_factory = sqlite3.Row
		cur = conn.cursor()
		res = cur.execute("SELECT * FROM weather_data WHERE city=? AND last_updated_unixtime=(SELECT MAX(last_updated_unixtime) FROM weather_data WHERE city=?)",[location,location]).fetchone()
		conn.close()
		if res is not None:
			return res
		else:
			return {}

	@staticmethod
	def get_priv_users():
		conn = DBHelper.get_connection()
		conn.row_factory = sqlite3.Row
		cur = conn.cursor()
		res = cur.execute("SELECT * FROM users WHERE user_role!='user'").fetchall()
		conn.close()
		return res

	@staticmethod
	def add_priv_user(fullname,email,password,user_role,location):
		conn = DBHelper.get_connection()
		conn.row_factory = sqlite3.Row
		cur = conn.cursor()
		try:
			cur.execute("INSERT INTO users(fullname,email,password,user_role,location) VALUES (?,?,?,?,?)",[fullname,email,password,user_role,location])
			conn.commit()
		except:
			pass
		conn.close()

	@staticmethod
	def delete_priv_user(email):
		conn = DBHelper.get_connection()
		conn.row_factory = sqlite3.Row
		cur = conn.cursor()
		try:
			cur.execute("DELETE FROM users WHERE email=?",[email])
			conn.commit()
		except:
			pass
		conn.close()

	@staticmethod
	def get_faulty_stations():
		conn = DBHelper.get_connection()
		conn.row_factory = sqlite3.Row
		cur = conn.cursor()
		r = dict(cur.execute("SELECT weatherStationID,location FROM weather_stations WHERE isWorking=-1").fetchall())
		conn.close()
		res = json.dumps(r) if r is not None else "{}"
		return res

	@staticmethod
	def get_working_stations():
		conn = DBHelper.get_connection()
		conn.row_factory = sqlite3.Row
		cur = conn.cursor()
		r = dict(cur.execute("SELECT weatherStationID,location FROM weather_stations WHERE isWorking=1").fetchall())
		conn.close()
		res = json.dumps(r) if r is not None else "{}"
		return res

	@staticmethod
	def get_not_working_stations():
		conn = DBHelper.get_connection()
		conn.row_factory = sqlite3.Row
		cur = conn.cursor()
		r = dict(cur.execute("SELECT weatherStationID,location FROM weather_stations WHERE isWorking=0").fetchall())
		conn.close()
		res = json.dumps(r) if r is not None else "{}"
		return res


class WeatherDataCollectorThread:
	def __init__(self):		
		self.weatherApiKey = "9b2cdf8b2dbf4efd9d5104838210602"
		self.baseURL = "http://api.weatherapi.com/v1/current.json"
		self.isThreadRunning = False

	def storeWeatherData(self,weather):
		conn = DBHelper.get_connection()
		cur = conn.cursor()

		# Check for already existing data
		res = cur.execute("SELECT last_updated_unixtime FROM weather_data WHERE last_updated_unixtime=? AND city=?",[weather['last_updated_unixtime'],weather['city']]).fetchone()
		if res is not None:
			return

		try:
			cur.execute("INSERT INTO weather_data(city,country,now_unixtime,last_updated_unixtime,temperature,isDay,condition_text,condition_icon,windspeed,winddir,pressure,precipitation,cloud,humidity) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[weather['city'],weather['country'],weather['now_unixtime'],weather['last_updated_unixtime'],weather['temperature'],weather['isDay'],weather['condition_text'],weather['condition_icon'],weather['windspeed'],weather['winddir'],weather['pressure'],weather['precipitation'],weather['cloud'],weather['humidity']])
			conn.commit()
		except:
			pass
		conn.close()

	def collectWeatherData(self):
		while self.isThreadRunning:
			print("-"*24 + "\n\t[+] Collecting mass data")
			self.weatherStations = DBHelper.get_weather_stations()			
			for each_station in self.weatherStations:
				if each_station['isWorking'] != 1:
					continue
				print("\t[+] Sending request -> {}".format(each_station['location']))
				params = {'q':each_station['location'],'key':self.weatherApiKey}
				resp = requests.get(url=self.baseURL,params=params)
				print("\t[+] Response received -> {}".format(each_station['location']))
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
				self.storeWeatherData(weather)
				print("\t[+] Data stored -> {}\n\t".format(each_station['location']) + '-'*24)
			sleep(60)		

	def start(self):
		self.thread = Thread(target=self.collectWeatherData)
		self.thread.daemon = True
		self.isThreadRunning = True
		self.thread.start()		

	def join_weather_station(self,session):
		conn = DBHelper.get_connection()
		cur = conn.cursor()
		try:
			cur.execute("UPDATE weather_stations SET isWorking=1 WHERE weatherStationID=(SELECT weatherStationID FROM weather_stations WHERE location=?)",[session['location']])
			conn.commit()
		except:
			pass
		conn.close()

	def detach_weather_station(self,session):
		conn = DBHelper.get_connection()
		cur = conn.cursor()
		try:
			cur.execute("UPDATE weather_stations SET isWorking=0 WHERE weatherStationID=(SELECT weatherStationID FROM weather_stations WHERE location=?)",[session['location']])
			conn.commit()
		except:
			pass
		conn.close()

	def stop(self):
		self.isThreadRunning = False