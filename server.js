const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const firebase = require('firebase')
const hello = require('./routes/hello');
const account = require('./routes/account.js')
const login = require('./routes/login')
const app = express();

app.use('/api/hello', hello);
app.use('/api/account', account);
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

/*
app.get('/api/login', (req, res) => {

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
}*/

const port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Server listening on port ' + port)
})
