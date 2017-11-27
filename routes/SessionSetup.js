var express = require('express');
var router = express.Router();

router.post('/createSession', (req, res) => {
	const uid = req.locals.uid;
	const admin = req.locals.admin;
	var sessionRef = admin.database().ref('sessions');
	var userRef = admin.database().ref("users").child(uid);
	var accessCode = 0;
	var uniqueAccessCode = false;
	var max = 999999;
	var min = 100001;

	//query database for active session with accessCode. If not found, uniqueAccessCode = true
	sessionRef.orderByChild("accessCode").once('value', function(snapshot) {
		
		while(!uniqueAccessCode) {
			accessCode = Math.floor(Math.random()*(max - min))+min;
			uniqueAccessCode = true;
			snapshot.forEach(function(childSnapshot) {
				if(accessCode === childSnapshot.child("accessCode").val()){
					uniqueAccessCode = false;
				}
			});			
		}
		
		console.log("Creating session with access code:", accessCode);
		
		//create database object with default values and uid
		var newSessionRef = sessionRef.push();
		newSessionRef.set({
			presenter: uid,
			accessCode: accessCode,
			isActive: true,
			audienceCount: '0'
		});
		
		//add the session ID to the list of presented sessions in the user object
		let json = {};
		json[newSessionRef.key] = true;
		userRef.child('hostedSessions').update(json);
		res.json({accessCode: accessCode});
	});
})

module.exports = router;
