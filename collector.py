from AuxClasses import WeatherDataCollectorThread

if __name__ == '__main__':
	try:
		weatherCollectorThread = WeatherDataCollectorThread()		
		weatherCollectorThread.start()

	except:
		try:
			weatherCollectorThread.stop()
		except:
			pass
