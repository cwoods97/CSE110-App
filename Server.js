/* This file contains the main interface for communicating with backend */
const admin = require('firebase-admin');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')

const log = (message) => { console.log("[Server.js] " + message); }

/* Initialize a connection to Firebase */
var serviceAccount = require("./FirebaseSac.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://speakeasy-25a66.firebaseio.com"
});

const app = express();
app.use(bodyParser.json());         /* to support JSON-encoded bodies */
app.use(bodyParser.urlencoded({     /* to support URL-encoded bodies */
    extended: true
}));

app.use(function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	next();
});

/* The following method is executed before all other routing logic. All
requests to the API require authentication. The token provided with the HTTP
request will be verified with Firebase.
Precondition: The request must populate a 'token' key in the header (as
assigned by Firebase).
Postcondition: The decoded token will be stored in 'req.decodedToken' */
app.use(function(req, res, next) {
  	log("Authenticating request for " + req.originalUrl);

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
			res.status(404).send("Firebase could not verify the provided token." +
			                     + "\n" + error.message );
		})
  	} else {
        /* Unauthenticated requests are allowed only for the sake of verifying unique user input on account creation */
        if (req.path === "/api/account/verify" && req.body.displayName) {
            req.locals = { 'displayName': req.body.displayName, 'admin': admin };
            next();
        } else if (!req.path.startsWith("/api")) {
            next();
        } else {
            log("Authentication token not provided. Rejecting request.");
            res.sendStatus(404);
        }
  	}
});

log('Serving files');
app.use(express.static(path.join(__dirname, 'client/build')));

/* Express routers */
const account = require('./routes/Account');
const session = require('./routes/Session');
const sessionSetup = require('./routes/SessionSetup');
const feedback = require('./routes/Feedback');
const presenterSession = require('./routes/PresenterSession');
const sessionReview = require('./routes/SessionReview');

app.use('/api/account', account);
app.use('/api/session', session);
app.use('/api/feedback', feedback);
app.use('/api/presenterSession', presenterSession)
app.use('/api/sessionReview', sessionReview)
app.use('/api/sessionSetup', sessionSetup)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, function() {
	 log('Server listening on port ' + port)
})
