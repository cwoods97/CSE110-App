const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const app = express();
var router = express.Router();

router.get('/endSession', (req, res) => {
        //token should have been verified, and this should be the decodedToken
        var token = res.query.token;
	var sessionID = res.query.sessionID;
	var sessionName = res.query.sessionName;
	var audioLink = res.query.audioLink;
	var timestamp = res.query.timestamp;

        if (!token) {
                //error, there should not be a null token
        }
	
	//query the database for session with sessionID
	//set the session's active field to false
	//add the timestamp to the session's list of end timestamps
	//add the audioLink to the session's audio link field
	//add the sessionName to session's name field

        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(result));
})

