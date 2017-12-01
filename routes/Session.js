var express = require('express');
var router = express.Router();

router.post('/join', (req, res) => {

		const user = req.locals.uid;
		const session = parseInt(req.body.accessCode);

		const db = req.locals.admin.database();

		const ref = db.ref("sessions").orderByChild("accessCode").equalTo(session);
		ref.once('value').then(function (snapshot) {
				if(snapshot.val()){
						snapshot.forEach(function(child) {
								const value = child.val();
								if(value){
										const sessionRef = db.ref("sessions").child(child.key);
										audienceCount = parseInt(value.audienceCount);
										audienceCount++;
										let json = {};
										json[user] = true;
										sessionRef.child('participants').update(json);
										sessionRef.child('audienceCount').set(audienceCount.toString());

										const userRef = db.ref("users").child(user);
										json = {};
										console.log("User ID updating", user);
										console.log("Child.key when joining session", child.key);
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

router.post('/leave', (req, res) => {

		const db = req.locals.admin.database();
		const code = parseInt(req.body.code);

		const ref = db.ref("sessions").orderByChild("accessCode").equalTo(code);
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

router.post('/title', (req, res) => {

		const session = req.body.code;
		const title = req.body.title;

		const db = req.locals.admin.database();

		const ref = db.ref("sessions").child(session);
		ref.child('title').set(title);

		res.json({title: title});
});

module.exports = router;
