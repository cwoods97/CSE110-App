var express = require('express');
var router = express.Router();

// TODO Start moving routes into a 'routes' folder and use express router
// TODO Put in the actual route names (see design use cases)

router.post('/create_account', (req, res) => {
	
	var name = req.body.displayName;
	var email = req.body.email;
	var uid = req.body.uid;
	console.log("hey");
	console.log(name);
	console.log(uid);
	res.type('application/json');
	res.json({please: 'work'});
	var admin = req.app.get('admin');
	admin.database().ref("users").child(uid).set({
			hostedSessions: '',
			joinedSessions: '',
			experience: '0'
	});
	
})

module.exports = router;
