/*
This file contains the methods for a created session for the presenter
*/
const express = require('express');
const router = express.Router();

//This function ends the session
router.post('/endSession', (req, res) => {

	const uid = req.locals.uid;
	const admin = req.locals.admin;
	var sessionRef = admin.database().ref('sessions');
	var userPath = 'users/'+uid;
	var userRef = admin.database().ref(userPath);

    var accessCode = req.body.accessCode;
	
  	//query the database for session with accessCode and erases the field so that the accessCode can be reused
	sessionRef.orderByChild("accessCode").equalTo(accessCode).once('value', function(snapshot) {
		//gets the session id (only one loop)
		snapshot.forEach(function(childSnapshot) {
			var thisSession = sessionRef.child(childSnapshot.key) //gets the session reference
			thisSession.child("accessCode").set('');
			console.log("ended session with accessCode: ", accessCode);
		});
	});
})

//Toggles whether the session is currently active (accepting feedback)
router.post('/toggleActive', (req, res) => {

	const uid = req.locals.uid;
	const admin = req.locals.admin;
	var sessionRef = admin.database().ref('sessions');
	var userPath = 'users/'+uid;
	var userRef = admin.database().ref(userPath);

    var accessCode = req.body.accessCode;

  	//query the database for session with accessCode and erases the field so that the accessCode can be reused
	sessionRef.orderByChild("accessCode").equalTo(accessCode).once('value', function(snapshot) {
		//gets the session id (only one loop)
		snapshot.forEach(function(childSnapshot) {
			var sessionID = childSnapshot.key;
			var thisSession = sessionRef.child(sessionID); //gets the session
			var active = childSnapshot.child("isActive").val();
			thisSession.child("isActive").set(!Boolean(active));	
		});
		
	});

	res.sendStatus(200);
})

//adds the start time to the session
router.post('/addStartTime', (req, res) => {

		const timestamp = Date.now() / 1000;

		const admin = req.locals.admin;
		const session = req.body.sessionCode;
		const audio = req.body.audio;

		//adds the start time to the database
		ref = admin.database().ref("sessions").child(session);
		ref.child('startTime').set(timestamp);
		ref.child('hasAudio').set(audio);

		res.json({success: true});

});

module.exports = router;
