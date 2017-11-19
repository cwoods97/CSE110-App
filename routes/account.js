var express = require('express');
var router = express.Router();

// TODO Start moving routes into a 'routes' folder and use express router
// TODO Put in the actual route names (see design use cases)

router.post('/create_account', (req, res) => {

	var uid = req.body.uid;
	console.log("Registering backend user under the following uid:", uid);
	
	res.type('application/json');
	res.json({please: 'work'});
	var admin = req.app.get('admin');
	admin.database().ref("users").child(userData.uid).set({
		hostedSessions: '',
		joinedSessions: '',
		experience: '0'
	});	
})

module.exports = router;