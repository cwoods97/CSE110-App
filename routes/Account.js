var express = require('express');
var router = express.Router();

const log = (message) => { console.log("[Account.js] " + message); }
const NON_UNIQUE_DNAME = "Display name is not unique.";

router.post('/createAccount', (req, res) => {
	const uid = req.locals.uid;
	const admin = req.locals.admin;
	
	admin.database().ref("users").child(uid).set({
		hostedSessions: '',
		joinedSessions: '',
		experience: '0',
	}).then(() => {
		log("Registered backend user with the following uid: " + uid);
		res.status(200).end();
	}).catch((error) => {
		log(error);
		res.status(500).json(error);
	});
})

// TODO Add a permanent exception in server.js to allow verification requests to pass thru w/o authentication
router.post('/verify', (req, res) => {
	var admin = req.locals.admin;
	var displayName = req.locals.displayName;

	var verifyDisplayNames = new Promise((resolve, reject) => {
		function checkDisplayNames(nextPageToken) {
			admin.auth().listUsers(1000, nextPageToken)
			.then((listUsersResult) => {
				var isUnique = true;
				listUsersResult.users.forEach((userRecord) => {
					// The provided display name is not unique
					if (userRecord.toJSON().displayName === displayName) {
						isUnique = false;
					}
				})
				if (!isUnique) {
					log(displayName + " is already registered under a user account with Firebase.");
					return reject(NON_UNIQUE_DNAME);
				}
				// Continue checking through next batch of users
				if (listUsersResult.pageToken) {
					checkDisplayNames(listUsersResult.pageToken);
				} else {
					resolve();
				}
			}).catch((error) => {
				reject(error);
			});
		}
		log("Verifying display name " + displayName + " is unique.");
		checkDisplayNames(undefined);
	});

	verifyDisplayNames
	.then(() => {
		log(displayName + " is unique.");
		res.status(200).json( { isUnique: true } );
	}).catch((error) => {
		if (error === NON_UNIQUE_DNAME) {
			log(NON_UNIQUE_DNAME);
			res.status(200).json( { isUnique: false } );
		} else {
			log(error);
			res.status(500).json(error);
		}
	})
})

router.post('/getPresentedSessions', (req, res) => {
	const uid = req.locals.uid;
	const admin = req.locals.admin;

	var sessionArray = [];
	admin.database().ref("users").child(uid).child("hostedSessions").once('value', (snapshot) => {
		var promises = [];
		snapshot.forEach(function(childSnapshot) {
			var presenterID = childSnapshot.child("uid").val();
			promises.push(admin.auth().getUser(uid).then(function(userRecord){
				//console.log(admin);
				//console.log(Boolean(admin.storage().bucket().child(childSnapshot.key)));
				//console.log(admin.storage().bucket().child(childSnapshot.key));
				sessionArray.push({
					title: childSnapshot.child("title").val(),
					displayName: userRecord.displayName
				});
			}));
		});
		Promise.all(promises).then(() => {
			res.json(sessionArray);
		});
	});
})

router.post('/getJoinedSessions', (req, res) => {
	const uid = req.locals.uid;
	const admin = req.locals.admin;

	var sessionArray = [];
	admin.database().ref("users").child(uid).child("joinedSessions").once('value', (snapshot) => {
		var promises = [];
		snapshot.forEach(function(childSnapshot) {
			var presenterID = childSnapshot.child("uid").val();
			promises.push(admin.auth().getUser(uid).then(function(userRecord){
				sessionArray.push({
					title: childSnapshot.child("title").val(),
					displayName: userRecord.displayName
				});
			}));
		});
		Promise.all(promises).then(() => {
			res.json(sessionArray);
		});
	});
})


module.exports = router;
