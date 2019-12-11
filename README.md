# TDTradeApp_Public

# Motivation

# Build Status

# Tech

# Installation

# API Reference

# Tests

This project is being used for building my skillset with the MERN stack. I am using TD Ameritrade since I have an existing account and investing is an interest of mine.

This is a work in progress where the opportunity to do development is generally limited to approximately 1 hour a day. In addition to this project I have taken online training through LinkedIn Learning. This project does not currently represent my full skill set with javascript/node.

The config and cert folders were intentionally ignored from the repository

Currently Built:
	* Integration with TD Ameritrade to retrieve JWT token and refresh token
	* Store token in Mongo DB
	* Store Token on start up
	* 2 services exposed
		1) TD Ameritrade redirect url for retrieving initial access token
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
