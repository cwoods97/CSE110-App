var express = require('express');
var router = express.Router();

router.post('/createSession', (req, res) => {

		const date = new Date();
		const month = date.getMonth() + 1;
		let day = date.getDate();
		if(day < 10) day = "0" + day;
		const year = date.getFullYear();
		let hour = date.getHours();
		if(hour < 10) hour = "0" + hour;
		let minute = date.getMinutes();
		if(minute < 10) minute = "0" + minute;
		let seconds = date.getSeconds();
		if(seconds < 10) seconds = "0" + seconds;
		const creationTime = month + "-" + day + "-" + year + " " + hour + ":" + minute + ":" + seconds;

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

		console.log("Creating session with access code: ", accessCode);

		//create database object with default values and uid
		var newSessionRef = sessionRef.push();
		var sessionID = newSessionRef.key;
		newSessionRef.set({
			presenter: uid,
			accessCode: accessCode,
			isActive: false,
			audienceCount: '0',
			title: "untitled",
			hasAudio: false,
			creationTime: creationTime
		});

		let json = {};
		json[sessionID] = true;
		userRef.child('hostedSessions').update(json);

		res.json({
			sessionID: sessionID,
			accessCode: accessCode
		});
	});
})

module.exports = router;
