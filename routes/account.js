var express = require('express');
var router = express.Router();

// TODO Start moving routes into a 'routes' folder and use express router
// TODO Put in the actual route names (see design use cases)

router.post('/create_account', (req, res) => {
		const uid = req.locals.uid;
		const admin = req.locals.admin;

		console.log("Registering backend user under the following uid:", uid);

		admin.database().ref("users").child(userData.uid).set({
				hostedSessions: '',
				joinedSessions: '',
				experience: '0'
		});
})

module.exports = router;
