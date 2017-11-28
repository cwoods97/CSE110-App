const express = require('express');
const router = express.Router();

router.post('/endSession', (req, res) => {
	
	const uid = req.locals.uid;
	const admin = req.locals.admin;
	var sessionRef = admin.database().ref('sessions');
	var userPath = 'users/'+req.locals.uid;
	var userRef = admin.database().ref(userPath);
	
    var token = req.locals.token;
  	var sessionID = res.query.sessionID;
  	var audioLink = res.query.audioLink;
  	var timestamp = res.query.timestamp;

  	//query the database for session with sessionID
  	//set the session's active field to false
  	//add the timestamp to the session's list of end timestamps
  	//add the audioLink to the session's audio link field
  	//add the sessionName to session's name field
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(result));
})

module.exports = router;
