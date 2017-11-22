var express = require('express');
var router = express.Router();

router.post('/createSession', (req, res) => {
	var admin = req.app.get('admin');
	var sessionRef = admin.database().ref('sessions');
	var userPath = 'users/'+req.body.uid;
	var userRef = admin.database().ref(userPath);
	var uid = token.uid;
	var accessCode = 0;
	var uniqueAccessCode = false;
	var max = 500000;
	var min = 100000;
	while(!uniqueAccessCode) {
		accessCode = Math.floor(Math.random()*(max - min))+min;
		//query database for active session with accessCode. If not found, uniqueAccessCode = true
		sessionRef.orderByChild('access code').equalTo(accessCode).on("child_added", function(snapshot) {
			if(snapshot.val === null) {
				uniqueAccessCode = true;
			}
		});
	}
	//create database object with default values and uid
	var newSessionRef = sessionRef.push();
	newSessionRef.set({
		presenter: req.body.uid,
		accessCode: accessCode,
		isActive: false,
		audienceCount: '0'
	});
	//add the session ID to the list of presented sessions in the user object
	userRef.child('hostedSessions').child(newSessionRef.key);
	
	res.json({accessCode: accessCode});
	
})

module.exports = router;

