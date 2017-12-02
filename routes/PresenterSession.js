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
	
	/* temp
	var feedbackRef = admin.database().ref('feedback');
	var feedbackArray = []; //timestamp, uid, type, message
	accessCode = 220221;
	//query the database for session with accessCode
	sessionRef.orderByChild("accessCode").equalTo(accessCode).once('value', function(snapshot) {
		//should be only one loop, but this is the only way I know how to code
		snapshot.forEach(function(childSnapshot) {
			feedbackRef.child(childSnapshot.key).once('value', function(snapshot2) { //gets the session feedbacks
				snapshot2.forEach(function(feedback) {
					feedbackArray.push({
						timestamp: feedback.child("timestamp").val(),
						uid: feedback.child("uid").val(),
						type: feedback.child("type").val(),
						message: feedback.child("message").val(),
					});
					
				});
				res.json(feedbackArray);

			});
		});
	});

	*/
	
	
  	//query the database for session with accessCode
	sessionRef.orderByChild("accessCode").equalTo(accessCode).once('value', function(snapshot) {
		//should be only one loop, but this is the only way I know how to code
		snapshot.forEach(function(childSnapshot) {
			var thisSession = sessionRef.child(childSnapshot.key); //gets the session
			var active = childSnapshot.child("isActive").val();
			thisSession.child("isActive").set(!Boolean(active));
			console.log("toggling isActive to: ", !Boolean(active));
		});
	});
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
