const express = require('express');
const path = require('path');
const app = express();


// Initialize a connection to Firebase
var admin = require('firebase-admin');
var serviceAccount = require("./firebase_sac.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://speakeasy-25a66.firebaseio.com"
});
var db = admin.database();
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


app.use(function(req, res, next) {
	
	console.log("got here");
  var idToken = req.body.token;
  console.log(idToken);

  if (idToken) {
    admin.auth().verifyIdToken(idToken)
      .then(function(decodedToken) {
        req.body.decodedToken = decodedToken;
        next();
      })
      .catch(function(error) {
        console.log(error);
        res.status(404).end();
      })
  }
  
  next();
});


// Serves static files from the 'client/build' directory - Navigating to root of webserver serves, by default, the built 'index.html'
var is_production = process.argv[2]
if (is_production) {
	app.use(express.static(path.join(__dirname, 'client/build')));
}


const port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Server listening on port ' + port)
})

module.exports.admin = admin;

// Express routers
const hello = require('./routes/hello');
const account = require('./routes/account.js')

app.use('/api/hello', hello);
app.use('/api/account', account);

