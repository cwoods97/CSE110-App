var express = require('express');
var router = express.Router();

router.get('/sessionData', (req, res) => {
		const sessionCode = req.locals.sessionCode;
		const ref = req.locals.admin.database().ref("feedback/" + sessionCode);

		ref.once('value').then((snapshot) => {
				res.sendStatus(200).end(snapshot);
		}).catch((error) => {
				res.sendStatus(404).end();
		});
});

router.get('/getSessionFeedback', (req, res) => {
	const admin = req.locals.admin;
	var sessionRef = admin.database().ref('sessions');
	var accessCode = req.body.accessCode;
	
	var feedbackRef = admin.database().ref('feedback');
	var feedbackArray = []; //timestamp, uid, type, message
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
});

module.exports = router;
