var express = require('express');
var router = express.Router();

//called when a user clicks "Join a Session" on "Main.js" page
router.post('/join', (req, res) => {

		//get the user id and session access code from req
		const user = req.locals.uid;
		const session = parseInt(req.body.accessCode);

		//connect to the database
		const db = req.locals.admin.database();

		//query the database for a session with the received access code
		const ref = db.ref("sessions").orderByChild("accessCode").equalTo(session);
		ref.once('value').then(function (snapshot) {
				//check if a session was found
				if(snapshot.val()){
						//should only execute once because access codes are unique
						snapshot.forEach(function(child) {
								//get the session object
								const value = child.val();
								if(value){
										//get a reference to the session object in the database
										const sessionRef = db.ref("sessions").child(child.key);

										//increment the session's audience count
										audienceCount = parseInt(value.audienceCount);
										audienceCount++;

										//add the user's id to the session's list of participants
										json = {};
										json[user] = true;

										//update the session object
										sessionRef.child('participants').update(json);
										sessionRef.child('audienceCount').set(audienceCount.toString());

										//get a reference to the user object in the database
										const userRef = db.ref("users").child(user);

										//add the session id to the user's list of joined sessions
										json = {};
										json[child.key] = true;
										userRef.child('joinedSessions').update(json);

										//respond with session metadata
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
				//no session has the received access code, so send back an error
				else{
						res.status(404).json({error: 'Session not found'});
				}
		});

});

//called when a user clicks "Leave Session" on "Join.js" page
router.post('/leave', (req, res) => {

		//connect to the database
		const db = req.locals.admin.database();

		//get the session id from req
		const sessionId = req.body.session;

		//query the database for the session with the received id
		const ref = db.ref("sessions").orderByKey().equalTo(sessionId);
		ref.once('value').then(function (snapshot) {
				//should only execute once because the session ids are the keys
				snapshot.forEach(function(child) {
						const value = child.val();

						//decrement audience count
						let audienceCount = parseInt(value.audienceCount);
						audienceCount--;

						//get a reference to the session in the database and update
						//its audience count
						const sessionRef = db.ref("sessions").child(child.key);
						sessionRef.child('audienceCount').set(audienceCount.toString());

						//success
						res.json({message: "left session " + child.key});
				});
		});

});

//called when the user changes the title on the "CreateSession.js" page
router.post('/title', (req, res) => {

		//get the session id and new title from req
		const session = req.body.code;
		const title = req.body.title;

		//connect to the database
		const db = req.locals.admin.database();

		//get a reference to the session and set its title
		const ref = db.ref("sessions").child(session);
		ref.child('title').set(title);

		//success
		res.json({title: title});
});

module.exports = router;
