#!/usr/bin/python3

import sqlite3
import requests
import json
from time import sleep
from threading import Thread

class DBHelper:
	@staticmethod
	def get_connection():
		conn = sqlite3.connect('wis_database.db',timeout=30)
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
	
	@staticmethod	
	def join_weather_station(self,session):
		conn = DBHelper.get_connection()
		cur = conn.cursor()
		try:
			cur.execute("UPDATE weather_stations SET isWorking=1 WHERE weatherStationID=(SELECT weatherStationID FROM weather_stations WHERE location=?)",[session['location']])
			conn.commit()
		except:
			pass
		conn.close()
	
	@staticmethod
	def detach_weather_station(self,session):
		conn = DBHelper.get_connection()
		cur = conn.cursor()
		try:
			cur.execute("UPDATE weather_stations SET isWorking=0 WHERE weatherStationID=(SELECT weatherStationID FROM weather_stations WHERE location=?)",[session['location']])
			conn.commit()
		except:
			pass
		conn.close()
		
	@staticmethod
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
