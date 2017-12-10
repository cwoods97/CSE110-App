/*
This function contains the methods regarding sessions.
*/
var express = require('express');
var router = express.Router();

// Allows the user to join the session by adding it to the list of audience
router.post('/join', (req, res) => {

		const user = req.locals.uid;
		const session = parseInt(req.body.accessCode);

		const db = req.locals.admin.database();

		//finds the session associated with the accessCode
		const ref = db.ref("sessions").orderByChild("accessCode").equalTo(session);
		ref.once('value').then(function (snapshot) {
				if(snapshot.val()){
						snapshot.forEach(function(child) {
								//Updates the list of participants and the audienceCount
								const value = child.val();
								if(value){
										const sessionRef = db.ref("sessions").child(child.key);
										audienceCount = parseInt(value.audienceCount);
										audienceCount++;
										json = {};
										json[user] = true;
										sessionRef.child('participants').update(json);
										sessionRef.child('audienceCount').set(audienceCount.toString());

										const userRef = db.ref("users").child(user);
										json = {};
										json[child.key] = true;
										userRef.child('joinedSessions').update(json);

										res.json({
												session: {
														id: child.key,
														code: session,
														audienceCount: audienceCount
												}
										});

								}
						});
				}
				else{
						res.status(404).json({error: 'Session not found'});
				}
		});

});

// Allows the user to leave the session by subtracting from the audience count
router.post('/leave', (req, res) => {

		const db = req.locals.admin.database();
		const sessionId = req.body.session;

		const ref = db.ref("sessions").orderByKey().equalTo(sessionId);
		ref.once('value').then(function (snapshot) {
				snapshot.forEach(function(child) {
						const value = child.val();
						let audienceCount = parseInt(value.audienceCount);
						audienceCount--;
						const sessionRef = db.ref("sessions").child(child.key);
						sessionRef.child('audienceCount').set(audienceCount.toString());

						res.json({message: "left session " + child.key});
				});
		});

});

// Updates the title
router.post('/title', (req, res) => {

		const session = req.body.code;
		const title = req.body.title;

		const db = req.locals.admin.database();

		const ref = db.ref("sessions").child(session);
		//puts title in the database
		ref.child('title').set(title);

		res.json({title: title});
});

module.exports = router;
