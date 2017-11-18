var express = require('express');
var router = express.Router();
/*var admin = require("firebase-admin");
var serviceAccount = require("../firebase_sac.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://speakeasy-25a66.firebaseio.com"
});*/
//var admin = express.get('admin');
//var db = admin.database();
//var usersRef = db.ref("users2");

// TODO Start moving routes into a 'routes' folder and use express router
// TODO Put in the actual route names (see design use cases)

router.use('/create_account', (req, res, next) => {
	
	var q_name = req.body.displayName;
	var q_email = req.body.email;
	
	console.log("hey");
	console.log(q_name);
	console.log(q_email);
	res.type('application/json');
	res.json({please: 'work'});
		/*admin.database().ref("users").child('hey').set({
				name: 'hi',
	    			password: 'hey',
	   			username: 'hey'
		});*/
	
})

module.exports = router;
