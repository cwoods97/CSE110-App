var express = require('express');
var router = express.Router();

router.post('/predefined_feedback', (req, res) => {

	const timestamp = Date.now() / 1000;

	const uid = req.locals.uid;
	const admin = req.locals.admin;
	const sessionID = req.body.sessionId;
	const message = req.body.feedback;
	const type = req.body.type;

	const sessionRef = admin.database().ref('sessions').orderByKey().equalTo(sessionID);
	sessionRef.once('value').then(function (snapshot) {
			snapshot.forEach(function(child) {
					const value = child.val();
					if(value.isActive){
							const startTime = value.startTime;
							const relTime = timestamp - startTime;
							const ref = admin.database().ref('feedback').child(sessionID).push();
							ref.set({
									uid: uid,
									timestamp: relTime,
									type: type,
									message: message,
									starred: false
							});

							res.json({message: message});
					} else {
							res.json({error: "Session not active"});
					}
					res.end();
			});
	});

})

module.exports = router;
