const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const app = express();

// Check whether object has any members
var is_empty = (obj) => { return Object.keys(obj).length };

// Initialize connection to firebase
// https://firebase.google.com/docs/admin/setup
var serviceAccount = require("./firebase_sac.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://speakeasy-25a66.firebaseio.com"
});

// Serves static files from the 'client/build' directory - Navigating to root of webserver serves, by default, the built 'index.html'
var is_production = process.argv[2]
if (is_production) {
	app.use(express.static(path.join(__dirname, 'client/build')));
}

// TODO Start moving routes into a 'routes' folder and use express router
// TODO Put in the actual route names (see design use cases)
app.get('/api/hello', (req, res) => {
	res.json({message: "Hello World - Express API is live"});
})

app.get('/register', (req, res) => {
	var q_name = res.query.displayName;
	var q_email = res.query.email;
	var q_passwd = res.query.passwd;

	if (q_displayName && q_email && q_passwd) {
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

const port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Server listening on port ' + port)
})