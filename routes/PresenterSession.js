const express = require('express');
const router = express.Router();

router.post('/endSession', (req, res) => {

	const uid = req.locals.uid;
	const admin = req.locals.admin;
	var sessionRef = admin.database().ref('sessions');
	var userPath = 'users/'+uid;
	var userRef = admin.database().ref(userPath);

    var accessCode = req.body.accessCode;

  	//query the database for session with accessCode
	sessionRef.orderByChild("accessCode").equalTo(accessCode).once('value', function(snapshot) {

		//should be only one loop, but this is the only way I know how to code
		snapshot.forEach(function(childSnapshot) {
			var thisSession = sessionRef.child(childSnapshot.key) //gets the session
			thisSession.child("accessCode").set('');
			console.log("ended session with accessCode: ", accessCode);
		});
	});
})

router.post('/toggleActive', (req, res) => {

	const uid = req.locals.uid;
	const admin = req.locals.admin;
	var sessionRef = admin.database().ref('sessions');
	var userPath = 'users/'+uid;
	var userRef = admin.database().ref(userPath);

    var accessCode = req.body.accessCode;

  	//query the database for session with accessCode
	sessionRef.orderByChild("accessCode").equalTo(accessCode).once('value', function(snapshot) {
		//should be only one loop, but this is the only way I know how to code
		snapshot.forEach(function(childSnapshot) {
			var thisSession = sessionRef.child(childSnapshot.key); //gets the session
			var active = childSnapshot.child("isActive").val();
			thisSession.child("isActive").set(!Boolean(active));
		});
	});

	res.sendStatus(200);
})

router.post('/addStartTime', (req, res) => {

		const admin = req.locals.admin;
		const session = req.body.sessionCode;
		const timestamp = req.body.time;
		const audio = req.body.audio;

		ref = admin.database().ref("sessions").child(session);
		ref.child('startTime').set(timestamp);
		ref.child('hasAudio').set(audio);

		res.json({success: true});

});

module.exports = router;
