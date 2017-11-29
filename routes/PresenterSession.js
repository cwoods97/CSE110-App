const express = require('express');
const router = express.Router();

router.post('/endSession', (req, res) => {
	
	const uid = req.locals.uid;
	const admin = req.locals.admin;
	var sessionRef = admin.database().ref('sessions');
	var userPath = 'users/'+uid;
	var userRef = admin.database().ref(userPath);
	
    var accessCode = req.body.accessCode;
	
  	//query the database for session with accessCode
	sessionRef.orderByChild("accessCode").equalTo(accessCode).once('value', function(snapshot) {
		
		//should be only one loop, but this is the only way I know how to code
		snapshot.forEach(function(childSnapshot) {
			var thisSession = sessionRef.child(childSnapshot.key) //gets the session
			thisSession.child("accessCode").set('');
			console.log("ended session with accessCode: ", accessCode);
		});
	});
})

module.exports = router;
