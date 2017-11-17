const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const app = express();

// Express routers
const hello = require('./routes/hello.js');
const account = require('./routes/account.js')
const session = require('./routes/session.js')

// Initialize a connection to Firebase
var serviceAccount = require("./firebase_sac.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://speakeasy-25a66.firebaseio.com"
});

/*
The following method is executed before all other routing logic.
All requests to the API require authentication.
The token provided with the HTTP request will be verified with Firebase.

Precondition: The request must populate a 'token' key in the header (as assigned by Firebase).
Postcondition: The decoded token will be stored in 'req.decodedToken'
*/
app.use(function(req, res, next) {
  var idToken = req.get('token');

  if (idToken) {
    admin.auth().verifyIdToken(idToken)
      .then(function(decodedToken) {
        req.decodedToken = decodedToken;
        next();
      })
      .catch(function(error) {
        console.log(error);
        res.status(404).end();
      })
  }
});

app.use('/api/hello', hello);
app.use('/api/account', account);
app.use('/api/session', session);

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
