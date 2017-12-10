/*
This file contains the methods for a created session for the presenter
*/
const express = require('express');
const router = express.Router();

<<<<<<< HEAD
//This function ends the session
//called when user clicks "Close Session" on "CreateSession.js" page
>>>>>>> e1356f84cc2256b0f3c39258847f0c7426271e1a
router.post('/endSession', (req, res) => {

	//get info from req
	const uid = req.locals.uid;
	const admin = req.locals.admin;
  var accessCode = req.body.accessCode;

	//get session and user objects from database
	var sessionRef = admin.database().ref('sessions');
	var userPath = 'users/'+uid;
	var userRef = admin.database().ref(userPath);

	//query the database for session with accessCode
	sessionRef.orderByChild("accessCode").equalTo(accessCode).once('value', function(snapshot) {

		//should only execute once because access codes are unique
		snapshot.forEach(function(childSnapshot) {
			//get a reference to the session from the database
			var thisSession = sessionRef.child(childSnapshot.key);
			//session no longer needs an access code because no one should be
			//able to join a session that is over
			thisSession.child("accessCode").set(''); 
			console.log("ended session with accessCode: ", accessCode);
		});
	});
})


//called when user clicks "Start" or "Stop" on "CreateSession.js" page
router.post('/toggleActive', (req, res) => {

	//get info from req
	const uid = req.locals.uid;
	const admin = req.locals.admin;
	var accessCode = req.body.accessCode;

	//get session and user object from database
	var sessionRef = admin.database().ref('sessions');
	var userPath = 'users/'+uid;
	var userRef = admin.database().ref(userPath);

  	//query the database for session with accessCode
	sessionRef.orderByChild("accessCode").equalTo(accessCode).once('value', function(snapshot) {
		//should only execute once because access codes are unique
		snapshot.forEach(function(childSnapshot) {
			var sessionID = childSnapshot.key;
			var thisSession = sessionRef.child(sessionID); //gets the session
			var active = childSnapshot.child("isActive").val();
			//switch 'isActive' to true if it was false and vice versa
			thisSession.child("isActive").set(!Boolean(active));	
		});
		
	});

	res.sendStatus(200);
})

//called when user clicks "Start" on "CreateSession.js"
//sets the current time as the start time
router.post('/addStartTime', (req, res) => {

		//get time when request was received
		const timestamp = Date.now() / 1000;

		//get info from req
		const admin = req.locals.admin;
		const session = req.body.sessionCode;
		const audio = req.body.audio;

		//find the session in the database, set its start time to when the 
		//request was received and record whether or not the user selected
		//to record their speech
		ref = admin.database().ref("sessions").child(session);
		ref.child('startTime').set(timestamp);
		ref.child('hasAudio').set(audio);

		res.json({success: true});

});

module.exports = router;
