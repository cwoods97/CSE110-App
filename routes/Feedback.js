var express = require('express');
var router = express.Router();

/* Called when a user sends feedback (either predefined or customized) from
the "Join.js" page */
router.post('/predefined_feedback', (req, res) => {

	/* Record the time in seconds that the request was received */
	const timestamp = Date.now() / 1000;

	/* Get information from req */
	const uid = req.locals.uid;
	const admin = req.locals.admin;
	const sessionID = req.body.sessionId;
	const message = req.body.feedback;
	const type = req.body.type;

	/* Query the database for a session with the received id */
	const sessionRef = admin.database().ref('sessions').orderByKey().equalTo(sessionID);
	sessionRef.once('value').then(function (snapshot) {
		/* Should only execute once because session ids are unique */
		snapshot.forEach(function(child) {
			const value = child.val();

			/* Only accept feedback if the session is active */
			if(value.isActive){

				/* Get the timestamp for the feedback by comparing the start 
				time of the session to the time the feedback was received */
				const startTime = value.startTime;
				const relTime = timestamp - startTime;

				/* Create a new feedback object with the same key as session */
				const ref = admin.database().ref('feedback').child(sessionID).push();
				/* Set fields of the new feedback object */
				ref.set({
					uid: uid,
					timestamp: relTime,
					type: type,
					message: message,
					starred: false
				});

				res.json({message: message});
			} else {
				/* Session either hasn't been started yet or has been stopped */
				res.json({error: "Session not active"});
			}
			res.end();
		});
	});
});

module.exports = router;
