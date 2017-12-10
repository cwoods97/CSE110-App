const express = require('express');
const router = express.Router();

/* Called when user clicks "Close Session" on "CreateSession.js" page */
router.post('/endSession', (req, res) => {

	/* Get info from req */
	const uid = req.locals.uid;
	const admin = req.locals.admin;
	var accessCode = req.body.accessCode;

	/* Get session and user objects from database */
	var sessionRef = admin.database().ref('sessions');
	var userPath = 'users/'+uid;
	var userRef = admin.database().ref(userPath);

	/* Query the database for session with accessCode */
	sessionRef.orderByChild("accessCode").equalTo(accessCode).once('value', function(snapshot) {

		/* Should only execute once because access codes are unique */
		snapshot.forEach(function(childSnapshot) {
			/* Get a reference to the session from the database */
			var thisSession = sessionRef.child(childSnapshot.key);
			/* Session no longer needs an access code because no one should be
			able to join a session that is over */
			thisSession.child("accessCode").set(''); 
			console.log("ended session with accessCode: ", accessCode);
		});
	});
})

/* Called when user clicks "Start" or "Stop" on "CreateSession.js" page */
router.post('/toggleActive', (req, res) => {

	/* Get info from req */
	const uid = req.locals.uid;
	const admin = req.locals.admin;
	var accessCode = req.body.accessCode;

	/* Get session and user object from database */
	var sessionRef = admin.database().ref('sessions');
	var userPath = 'users/'+uid;
	var userRef = admin.database().ref(userPath);

  	/* Query the database for session with accessCode */
	sessionRef.orderByChild("accessCode").equalTo(accessCode).once('value', function(snapshot) {
		/* Should only execute once because access codes are unique */
		snapshot.forEach(function(childSnapshot) {
			var sessionID = childSnapshot.key;
			/* Get a reference to the session from the database */
			var thisSession = sessionRef.child(sessionID);
			var active = childSnapshot.child("isActive").val();
			/* Switch 'isActive' to true if it was false and vice versa */
			thisSession.child("isActive").set(!Boolean(active));	
		});		
	});
	res.sendStatus(200);
})

/* Called when user clicks "Start" on "CreateSession.js" */
router.post('/addStartTime', (req, res) => {

	/* Get time when request was received */
	const timestamp = Date.now() / 1000;

	/* Get info from req */
	const admin = req.locals.admin;
	const session = req.body.sessionCode;
	const audio = req.body.audio;

	/* Find the session in the database, set its start time to when the 
	request was received and record whether or not the user selected
	to record their speech */
	ref = admin.database().ref("sessions").child(session);
	ref.child('startTime').set(timestamp);
	ref.child('hasAudio').set(audio);

	res.json({success: true});

});

module.exports = router;
