const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const app = express();

app.get('/api/create_session', (req, res) => {
        var token = res.query.token;

	//verify token
        if (token) {
		//verify it here
        }

	var accessCode = 0;
	var uniqueAccessCode = false;
	var max = 500000;
	var min = 100000;
	while(!uniqueAccessCode) {
		accessCode = Math.floor(Math.random()*(max - min))+min;
		//query database for active session with accessCode. If not found, uniqueAccessCode = true
	}
	//create database object with default values
	
 	res.writeHead(200, {'Content-Type': 'application/json'})
	res.end(JSON.stringify(result));
})

