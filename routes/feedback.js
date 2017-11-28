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
	var message = req.body.feedback;
	var type = req.body.type;
	var timestamp = Date.now();

	const userRef = admin.database().ref("users").orderByKey().equalTo(uid);
	userRef.once('value').then(function (snapshot) {
		snapshot.forEach(function(child){
			var value = child.val();
			var session = value.currentSession;

			var feedbackRef = admin.database().ref('feedback').child(session).push();
			feedbackRef.set({
				uid: uid,
						timestamp: timestamp,
						type: type,
						message: message,
						starred: false
			})

		console.log("pushed feedback to database");
		})

	})

	res.json({message: message})

	// const starred = false;

	// var feedbackRef = admin.database().ref('sessions');
	// var userRef = admin.database().ref("users").child(uid);
	// var timestamp = Date.now();
	// var feedbackType = 0;


	// var newFeedbackRef = feedbackRef.push();
	// newFeedbackRef.set({
	// 	uid: uid,
	// 	timestamp: timestamp,
	// 	type: feedbackType,
	// 	message: message,
	// 	starred: starred
	// });

	// admin.database().ref("feedback").child(uid).set({
	// 	hostedSessions: '',
	// 	joinedSessions: '',
	// 	experience: '0'
	// }).then(() => {
	// 	log("Registered backend user with the following uid: " + uid);
	// 	res.status(200).end();
	// }).catch((error) => {
	// 	log(error);
	// 	res.status(500).json(error);
	// });
	
	


})

module.exports = router;