/* This file contains methods regarding setting up a session. */
var express = require('express');
var router = express.Router();

/* Creates sessions with the given presenter (given by uid) */
router.post('/createSession', (req, res) => {
	
	/* Gets the timestamp */
	const date = new Date();
	const month = date.getMonth() + 1;
	let day = date.getDate();
	if(day < 10) day = "0" + day;
	const year = date.getFullYear();
	let hour = date.getHours();
	if(hour < 10) hour = "0" + hour;
	let minute = date.getMinutes();
	if(minute < 10) minute = "0" + minute;
	let seconds = date.getSeconds();
	if(seconds < 10) seconds = "0" + seconds;
	const creationTime = month + "-" + day + "-" + year + " " + hour + ":" + minute + ":" + seconds;

	/* Gets info about user and database from req */
	const uid = req.locals.uid;
	const admin = req.locals.admin;

	/* Get the session and user object from the database */
	var sessionRef = admin.database().ref('sessions');
	var userRef = admin.database().ref("users").child(uid);

	/* Set up variables used in generating a random access code */
	var accessCode = 0;
	var uniqueAccessCode = false;
	var max = 999999;
	var min = 100001;

	/* Query database for session with accessCode. If not found, 
	uniqueAccessCode = true */
	sessionRef.orderByChild("accessCode").once('value', function(snapshot) {

		/* Generate 6-digit random integers until a unique one is found */
		while(!uniqueAccessCode) {
			accessCode = Math.floor(Math.random()*(max - min))+min;
			uniqueAccessCode = true;
			snapshot.forEach(function(childSnapshot) {
				if(accessCode === childSnapshot.child("accessCode").val()){
					uniqueAccessCode = false;
				}
			});
		}

		/* Create database object with default values and uid */
		var newSessionRef = sessionRef.push();
		var sessionID = newSessionRef.key;
		newSessionRef.set({
			presenter: uid,
			accessCode: accessCode,
			isActive: false,
			audienceCount: '0',
			title: "untitled",
			hasAudio: false,
			creationTime: creationTime
		});

		/* Add session id to user's list of 'hostedSessions' */
		let json = {};
		json[sessionID] = true;
		userRef.child('hostedSessions').update(json);

		/* Return the session id and access code */
		res.json({
			sessionID: sessionID,
			accessCode: accessCode
		});
	});
})

module.exports = router;
