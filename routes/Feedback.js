var express = require('express');
var router = express.Router();

router.post('/send_feedback', (req, res) => {

	// TODO: link w/ feedback object in database
	// fill w/ database schema -
	// uid, timestamp, type, message, starred

	console.log("received feedback is: " + req.body.feedback);
    var message = req.body.feedback;
    // res.writeHead(200, {'Content-Type': 'application/json'});
    res.json({message: message});
    // res.end(JSON.stringify(feedback));
})

router.post('/predefined_feedback', (req, res) => {

	const uid = req.locals.uid;
	const admin = req.locals.admin;
	const sessionID = req.body.sessionId;
	const message = req.body.feedback;
	const type = req.body.type;
	const timestamp = req.body.timestamp;

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
