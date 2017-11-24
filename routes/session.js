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
								if(value.isActive){
										const sessionRef = db.ref("sessions").child(child.key);
										audienceCount = parseInt(value.audienceCount);
										audienceCount++;
										let json = {};
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
								else {
										res.status(400).json({error: "Session no longer active"});
								}
						});
				}
				else{
						res.status(404).json({error: 'Session not found'});
				}
		});

});

router.post('/leave', (req, res) => {
		
		const session = req.body.session;
		const db = req.locals.admin.database();

		const ref = db.ref("sessions").child(session).once('value')
		.then(function (snapshot) {
				snapshot.forEach(function(child) {
						const value = child.val();
						audienceCount = parseInt(value.audienceCount);
						audienceCount--;
						ref.child('audienceCount').set(audienceCount.toString());
				});
		});
		
});

module.exports = router;
