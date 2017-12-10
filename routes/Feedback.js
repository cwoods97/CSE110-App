/*
This file contains methods to get the predefined feedback
*/

var express = require('express');
var router = express.Router();


// called when a user sends feedback (either predefined or customized) from
// the "Join.js" page and puts the feedback in the database
router.post('/predefined_feedback', (req, res) => {

	//record the time in seconds that the request was received
	const timestamp = Date.now() / 1000;

	//get information from req
	const uid = req.locals.uid;
	const admin = req.locals.admin;
	const sessionID = req.body.sessionId;
	const message = req.body.feedback;
	const type = req.body.type;

	//query the database for a session with the received id
	const sessionRef = admin.database().ref('sessions').orderByKey().equalTo(sessionID);
	sessionRef.once('value').then(function (snapshot) {
			//Gets the corresponding sessions (loops only once)
			//should only execute once because session ids are unique
			snapshot.forEach(function(child) {
					//Puts the feedback in the list of feedbacks of this sessions
					const value = child.val();

					//only accept feedback if the session is active
					if(value.isActive){

							//get the timestamp for the feedback by comparing the start time
							//of the session to the time the feedback was received
							const startTime = value.startTime;
							const relTime = timestamp - startTime;

							//create a new feedback object with the same key as the session
							const ref = admin.database().ref('feedback').child(sessionID).push();
							//set fields of the new feedback object
							ref.set({
									uid: uid,
									timestamp: relTime,
									type: type,
									message: message,
									starred: false
							});

							res.json({message: message});
					} else {
							//session either hasn't been started yet or has been stopped
							res.json({error: "Session not active"});
					}
					res.end();
			});
	});

})

module.exports = router;
