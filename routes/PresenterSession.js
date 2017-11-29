const express = require('express');
const router = express.Router();

router.post('/endSession', (req, res) => {
	
	const uid = req.locals.uid;
	const admin = req.locals.admin;
	var sessionRef = admin.database().ref('sessions');
	var userPath = 'users/'+uid;
	var userRef = admin.database().ref(userPath);
	
    var accessCode = res.body.accessCode;
	var title = res.body.title;
	
  	//query the database for session with accessCode
	sessionRef.orderByChild("accessCode").equalTo(accessCode).once('value', function(snapshot) {
		
		//should be only one loop, but this is the only way I know how to code
		snapshot.forEach(function(childSnapshot) {
			var thisSession = sessionRef.child(childsnapshot.key) //gets the session
			thisSession.set({
				accessCode: '',
				isActive: false,
				title: title,
			});
		});
	}
})

module.exports = router;
