# TDTradeApp_Public

This project is being used for building my skillset with the MERN stack. I am using TD Ameritrade since I have an existing account and investing is an interest of mine.

This is a work in progress where the opportunity to do development is generally limited to less than 2 hours a day. The private version of this project was started on Oct 11, 2019.

Currently Built:
	* Integration with TD Ameritrade to retrieve JWT token and refresh token
	* Store token in Mongo DB
	* Store Token on start up
	* 2 services exposed
		1) TD Ameritrade redirect url for retreiving initial access token
		2) endpoint for forcing token refresh

Next Steps:
	* Automate Token refresh
	* Add proper logging for debugging
		- Been using console.log
	* Build functionality to stream prices throughout the data
		-Store to db
	* Host on AWS
	* Build React/React-Native front end
	* Add automated testing
