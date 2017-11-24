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

										res.json({key: child.key});
								}
								else {
										console.log("Session no longer active");
								}
						});
				}
				else{
						console.log("Session does not exist");
						//res.status(404).json({error: 'Session not found'});
				}
		});

});

module.exports = router;
