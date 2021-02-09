#!/usr/bin/python3

from flask import Flask, escape, redirect, url_for, abort, session, render_template, request, flash
from hashlib import sha512
from AuxClasses import DBHelper,WeatherDataCollectorThread
from threading import Thread
import json

app = Flask(__name__)
app.secret_key = "8a7s87%#$%$df78SDSJr45354fd4SK#$)(%$"
weatherCollectorThread = WeatherDataCollectorThread()

@app.route('/')
def index():
	if 'email' not in session:
		return render_template('index.html',page_title="Index")
	else:
		return redirect(url_for('dashboard'))

@app.route('/login',methods=['GET','POST'])
def login():
	if 'email' in session:
		return redirect(url_for('dashboard'))

	if request.method == 'GET':
		return render_template('login.html',page_title="Login")
	elif request.method == 'POST':
		email = request.form['email']
		password = sha512(request.form['password'].encode()).hexdigest()
		result = DBHelper.check_creds(email,password)
		if result:
			session['email'] = result['email']
			session['fullname'] = result['fullname']
			session['location'] = result['location']
			session['user_role'] = result['user_role']
			session['new_location'] = ""
			return redirect(url_for('dashboard'))
		else:
			flash("Invalid email/password!")
			return redirect(url_for('login'))


@app.route('/register',methods=['GET','POST'])
def register():
	if request.method == 'GET':
		supported_locations = DBHelper.get_supported_locations()
		return render_template('register.html',page_title="Register",supported_locations=supported_locations)
	elif request.method == 'POST':
		email = request.form['email']
		fullname = request.form['fullname']
		password = sha512(request.form['password'].encode()).hexdigest()
		location = request.form['location']		
		if DBHelper.user_exists(email):
			flash("Email address already in use!")
		else:
			DBHelper.register_user(email,password,fullname,location)
			flash("Successfully registered with {}".format(email))		
		return redirect(url_for('register'))

@app.route('/dashboard')
def dashboard():
	if 'email' not in session:
		return redirect(url_for('login'))
	flash("Welcome, {}".format(session['fullname'].split(" ")[0]))		
	if session['user_role'] == 'operator':
		weatherStation = DBHelper.get_weather_station(session['location'])
		return render_template('dashboard.html',page_title="Dashboard",isAdmin=False,isInstrumentOperator=True,weatherStation=weatherStation)
	elif session['user_role'] == 'admin':
		return render_template('dashboard.html',page_title="Dashboard",isAdmin=True,isInstrumentOperator=False,running_status=weatherCollectorThread.get_status())
	else:
		return render_template('dashboard.html',page_title="Dashboard",isAdmin=False,isInstrumentOperator=False,supported_locations=DBHelper.get_supported_locations(),new_location=session['new_location'])
	

@app.route('/logout')
def logout():
	session.pop('email',None)
	session.pop('fullname',None)
	session.pop('user_role',None)
	session.pop('location',None)
	session.pop('new_location',None)
	return redirect(url_for('index'))

@app.route('/api/startWeatherDataCollection')
def startWeatherDataCollection():
	if 'email' not in session:
		return abort(403)
	else:
		if session['user_role'] != 'operator':
			return abort(403)
		else:
			weatherCollectorThread.join_weather_station(session)
			return redirect(url_for('dashboard'))

@app.route('/api/stopWeatherDataCollection')
def stopWeatherDataCollection():
	if 'email' not in session:
		return abort(403)
	else:
		if session['user_role'] != 'operator':
			return abort(403)
		else:
			weatherCollectorThread.detach_weather_station(session)
			return redirect(url_for('dashboard'))

@app.route('/api/getLastWeatherData',methods=['POST','GET'])
def getLastWeatherData():
	if 'email' not in session:
		return abort(403)
	else:
		if request.method == 'GET':
			json_response = json.dumps(dict(DBHelper.get_last_weather_data(session['location'])))
		elif request.method == 'POST':
			json_response = json.dumps(dict(DBHelper.get_last_weather_data(request.form['new_location'])))		
		return json_response

@app.route('/api/getWeatherStation')
def getWeatherStation():
	if 'email' not in session:
		return abort(403)
	else:
		json_response = json.dumps(dict(DBHelper.get_weather_station(session['location'])))
		if json_response is not None:
			return json_response
		else:
			return "{}"

@app.route('/api/setNewLocation',methods=['POST'])
def setNewLocation():
	if 'email' not in session:
		return abort(403)
	else:
		session['new_location'] = request.form['new_location']
		return "Successfully changed!"

@app.route('/api/getNewLocation')
def getNewLocation():
	if 'email' not in session:
		return abort(403)
	else:
		if session['new_location'] is not None:
			return session['new_location']
		else:
			return "{}"

@app.route('/api/deleteWeatherStation',methods=['POST'])
def deleteWeatherStation():
	if session['user_role'] != 'admin':
		return abort(403)
	weatherStationID = request.form['weatherStationID']
	DBHelper.delete_weather_station(weatherStationID)
	return "Entry deleted!"

@app.route('/api/addWeatherStation',methods=['POST'])
def addWeatherStation():
	if session['user_role'] != 'admin':
		return abort(403)
	weatherStationID = request.form['weatherStationID']
	location = request.form['location']
	DBHelper.add_weather_station(weatherStationID,location)
	return "Entry added!"

@app.route('/manage/weatherStations')
def manageWeatherStations():
	if 'email' not in session:
		return redirect(url_for('login'))
	if session['user_role'] != 'admin':
		return abort(403)
	all_weather_stations = DBHelper.get_weather_stations()
	return render_template('manage_weather_stations.html',page_title="Manage Weather Stations",all_weather_stations=all_weather_stations)

@app.route('/api/addPrivUser',methods=['POST'])
def addPrivUser():
	if session['user_role'] != 'admin':
		return abort(403)
	fullname = request.form['fullname']
	email = request.form['email']
	password = sha512(request.form['password'].encode()).hexdigest()
	user_role = request.form['user_role']
	location = request.form['location']	
	DBHelper.add_priv_user(fullname,email,password,user_role,location)
	return "Entry added!"

@app.route('/api/deletePrivUser',methods=['POST'])
def deletePrivUser():
	if session['user_role'] != 'admin':
		return abort(403)
	email = request.form['email']	
	DBHelper.delete_priv_user(email)
	return "Entry deleted!"

@app.route('/manage/privUsers')
def managePrivUsers():
	if session['user_role'] != 'admin':
		return abort(403)
	all_priv_users = DBHelper.get_priv_users()
	supported_locations = DBHelper.get_supported_locations()
	return render_template('manage_users.html',page_title="Manage Weather Stations",all_priv_users=all_priv_users,supported_locations=supported_locations)

@app.route('/api/getFaultyStations')
def getFaultyStations():
	if session['user_role'] != 'admin':
		return abort(403)
	faulty_stations_json = DBHelper.get_faulty_stations()
	return faulty_stations_json

@app.route('/api/getWorkingStations')
def getWorkingStations():
	if session['user_role'] != 'admin':
		return abort(403)
	working_stations_json = DBHelper.get_working_stations()
	return working_stations_json

@app.route('/api/getNotWorkingStations')
def getNotWorkingStations():
	if session['user_role'] != 'admin':
		return abort(403)
	not_working_stations_json = DBHelper.get_not_working_stations()
	return not_working_stations_json


@app.route('/about')
def about():
	return render_template('about.html',page_title="About")

@app.route('/api/startCollector')
def startCollector():
	if 'email' not in session:
		return abort(403)
	if session['user_role'] != 'admin':
		return abort(403)
	weatherCollectorThread.start()
	return "Success"

@app.route('/api/stopCollector')
def stopCollector():
	if 'email' not in session:
		return abort(403)
	if session['user_role'] != 'admin':
		return abort(403)
	weatherCollectorThread.stop()
	return "Success"

# DRIVER CODE
if __name__ == '__main__':
	app.run(debug=True)