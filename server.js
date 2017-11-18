const express = require('express');
const app = express();


// Initialize a connection to Firebase
var admin = require('firebase-admin');
var serviceAccount = require("./firebase_sac.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://speakeasy-25a66.firebaseio.com"
});
app.set('admin', admin);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// parse json
var bodyParser = require('body-parser')
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
/*
The following method is executed before all other routing logic.
All requests to the API require authentication.
The token provided with the HTTP request will be verified with Firebase.

Precondition: The request must populate a 'token' key in the header (as assigned by Firebase).
Postcondition: The decoded token will be stored in 'req.decodedToken'
*/
	  console.log("1");


app.use(function(req, res, next) {
		  console.log(req.originalUrl);

  var idToken = req.body.token;
  if (typeof idToken === 'string') {
	  console.log("3");
    admin.auth().verifyIdToken(idToken)
      .then(function(decodedToken) {
        req.body.uid = decodedToken.uid;
			  console.log("4");
		next();
      })
      .catch(function(error) {
        console.log(error);
        res.status(404).end();
		next();
      })
  }
  else {
	  next();
  }
});
	  console.log("5");

// Serves static files from the 'client/build' directory - Navigating to root of webserver serves, by default, the built 'index.html'
const path = require('path');
var is_production = process.argv[2]
if (is_production) {
	app.use(express.static(path.join(__dirname, 'client/build')));
}
	  console.log("6");


const port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Server listening on port ' + port)
})
	  console.log("7");

// Express routers
const hello = require('./routes/hello');
const account = require('./routes/account.js')
	  console.log("8");
app.use('/api/account', account);
app.use('/api/hello', hello);
	  console.log("9");

