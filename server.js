const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const app = express();

<<<<<<< HEAD
// Check whether object has any members
var is_empty = (obj) => { return Object.keys(obj).length };
=======
/*  
 *  Serves static files from the 'client/build' directory
 *  Navigating to root of webserver serves 'index.html'
 *  Disable this functionality when not in production (running two separate servers)
 */
var is_production = process.argv[2]
if (is_production) {
	app.use(express.static(path.join(__dirname, 'client/build')));
}
>>>>>>> origin/master

// Initialize connection to firebase
// https://firebase.google.com/docs/admin/setup
var config = {
  apiKey: "AIzaSyDSQVw9KUjmxhlxILCousROVR6PfOFcYQg",
  authDomain: "speakeasy-25a66.firebaseapp.com",
  databaseURL: "https://speakeasy-25a66.firebaseio.com",
  projectId: "speakeasy-25a66",
  storageBucket: "speakeasy-25a66.appspot.com",
  messagingSenderId: "836790794762"
};
admin.initializeApp(config);

app.use(express.static(path.join(__dirname, 'client/build')));

// TODO Start moving routes into a 'routes' folder and use express router
// TODO Put in the actual route names (see design use cases)
app.get('/api/hello', (req, res) => {
	res.json({message: "Hello World - Express API is live"});
})

app.get('/register', (req, res) => {
	var q_name = res.query.name;
	var q_email = res.query.uid;
	var q_passwd = res.query.passwd;

	if (q_name && q_email && q_passwd) {
		// Firebase logs a user in when account is created
		// https://firebase.google.com/docs/reference/js/firebase.User
		admin.auth().createUser(
			displayName: q_name,
			email: q_email,
			password: q_password
		// TODO Implement a debug log instead of using console
		}).catch((err) => {console.log(err);})
	}
})

const port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Server listening on port ' + port)
})