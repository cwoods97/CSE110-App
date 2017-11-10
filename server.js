const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const hello = require('./routes/hello');
const create_account = require('./routes/create_account')

const app = express();

app.use('/api/hello', hello);
app.use('/api/create_account', create_account);

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

const port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Server listening on port ' + port)
})