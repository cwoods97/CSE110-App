const admin = require('firebase-admin');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')

// Initialize a connection to Firebase
var serviceAccount = require("./FirebaseSac.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://speakeasy-25a66.firebaseio.com"
});


const app = express();
app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	next();
});

/*
The following method is executed before all other routing logic.
All requests to the API require authentication.
The token provided with the HTTP request will be verified with Firebase.

Precondition: The request must populate a 'token' key in the header (as assigned by Firebase).
Postcondition: The decoded token will be stored in 'req.decodedToken'
*/
app.use(function(req, res, next) {
  	console.log("Authenticating request for", req.originalUrl);

  	var idToken = req.body.token;
  	if (typeof idToken === 'string') {
        admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.locals = {
  					   'admin': admin,
               'uid': decodedToken.uid
            };
            next();
  			}).catch(error => {
    				res.send("Firebase could not verify the provided token." +
    				          + "\n" + error.message );
    				res.sendStatus(404).end();
  			})
  	// TODO This code is for debugging puroses ONLY and should be disabled in production.
  	} else {
    		req.locals = { 'admin': admin };
    		console.log("Token not provided. Overriding default behavior for development purposes.");
    		next();
  	}
});

// Serves static files from the 'client/build' directory
// Navigating to root of webserver serves, by default, the built 'index.html'
// Disabled by default - Activate functionality by running 'node server.js 1'
var is_production = process.argv[2]
if (Boolean(parseInt(is_production))) {
  	console.log('Serving files');
  	app.use(express.static(path.join(__dirname, 'client/build')));
}

const port = process.env.PORT || 3000;
app.listen(port, function() {
	 console.log('Server listening on port ' + port)
})

// Express routers
const hello = require('./routes/hello');
const account = require('./routes/account');
const session = require('./routes/Session');

app.use('/api/account', account);
app.use('/api/hello', hello);
app.use('/api/session', session);
