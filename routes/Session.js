var express = require('express');
var router = express.Router();

/* Called when a user clicks "Join a Session" on "Main.js" page */
router.post('/join', (req, res) => {

	/* Get the user id and session access code from req */
	const user = req.locals.uid;
	const session = parseInt(req.body.accessCode);

	/* Connect to the database */
	const db = req.locals.admin.database();

	/* Query the database for a session with the received access code */
	const ref = db.ref("sessions").orderByChild("accessCode").equalTo(session);
	ref.once('value').then(function (snapshot) {
		/* Check if a session was found */
		if(snapshot.val()){
			/* Should only execute once because access codes are unique */
			snapshot.forEach(function(child) {
				/* Get the session object */
				const value = child.val();
				if(value){
					/* Get a reference to the session object in the database */
					const sessionRef = db.ref("sessions").child(child.key);

					/* Increment the session's audience count */
					audienceCount = parseInt(value.audienceCount);
					audienceCount++;

					/* Add the user's id to the session's participants list */
					json = {};
					json[user] = true;

					/* Update the session object */
					sessionRef.child('participants').update(json);
					sessionRef.child('audienceCount').set(audienceCount.toString());

					/* Get a reference to the user object in the database */
					const userRef = db.ref("users").child(user);

					/* Add the session id to the user's joined sessions list */
					json = {};
					json[child.key] = true;
					userRef.child('joinedSessions').update(json);

					/* Respond with session metadata */
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
		/* No session has the received access code, so send back an error */
		else{
			res.status(404).json({error: 'Session not found'});
		}
	});
});

/* Called when a user clicks "Leave Session" on "Join.js" page */
router.post('/leave', (req, res) => {

	/* Connect to the database */
	const db = req.locals.admin.database();

	/* Get the session id from req */
	const sessionId = req.body.session;

	/* Query the database for the session with the received id */
	const ref = db.ref("sessions").orderByKey().equalTo(sessionId);
	ref.once('value').then(function (snapshot) {
		/* Should only execute once because the session ids are the keys */
		snapshot.forEach(function(child) {
			const value = child.val();

			/* Decrement audience count */
			let audienceCount = parseInt(value.audienceCount);
			audienceCount--;

			/* Get a reference to the session in the database and update 
			its audience count*/
			const sessionRef = db.ref("sessions").child(child.key);
			sessionRef.child('audienceCount').set(audienceCount.toString());

			res.json({message: "left session " + child.key});
		});
	});
});

/* Called when the user changes the title on the "CreateSession.js" page */
router.post('/title', (req, res) => {

	/* Get the session id and new title from req */
	const session = req.body.code;
	const title = req.body.title;

	/* Connect to the database */
	const db = req.locals.admin.database();

	/* Get a reference to the session and set its title */
	const ref = db.ref("sessions").child(session);
	ref.child('title').set(title);

	res.json({title: title});
});

module.exports = router;
