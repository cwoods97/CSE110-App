var express = require('express');
var router = express.Router();

// TODO Start moving routes into a 'routes' folder and use express router
// TODO Put in the actual route names (see design use cases)

router.get('/create_account', (req, res) => {
	res.json({message: "'create_account api' responding"});
	var q_name = res.query.displayName;
	var q_email = res.query.email;
	var q_passwd = res.query.passwd;

	if (q_name && q_email && q_passwd) {
		// Firebase logs a user in when account is created
		// https://firebase.google.com/docs/reference/js/firebase.User
		admin.auth().createUser({
			displayName: q_name,
			email: q_email,
			password: q_password
		// TODO Write to a physical debug log instead of using console (output won't be captured)
		}).catch((err) => {console.log(err);})
	}
})

module.exports = router;
