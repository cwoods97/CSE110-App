const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const firebase = require('firebase')
const app = express();

// Check whether object has any members
var is_empty = (obj) => { return Object.keys(obj).length };

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


app.get('/api/login', (req, res) => {
	var token = res.query.token;
	admin.auth().verifyIDToken(token).then(function(decodedToken) {
		var uid
	


	if (q_email && q_passwd) {
		// Firebase logs a user in when account is created
		// https://firebase.google.com/docs/reference/js/firebase.User
		// Credits: https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signInWithEmailAndPassword
		var user = firebase.auth().signInWithEmailAndPassword(q_email, q_password).catch(function(error) {
			var errorCode = error.code;
			if(errorCode === 'auth/wrong-password') {
				alert('wrong password');
			} else { 
				alert(errorMessage);
			}
			console.log(error);
		});
		// There's a method user.getToken(true). Store it on the client's computer and send it every time you call something in the backend
	}
}

const port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Server listening on port ' + port)
})
