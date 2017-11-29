var express = require('express');
var router = express.Router();

<<<<<<< HEAD
const NON_UNIQUE_DNAME = "Display name is not unique.";

=======
const log = (message) => { console.log("[Account.js] " + message); }
const NON_UNIQUE_DNAME = "Display name is not unique.";

router.post('/createAccount', (req, res) => {
	const uid = req.locals.uid;
	const admin = req.locals.admin;

	admin.database().ref("users").child(uid).set({
		hostedSessions: '',
		joinedSessions: '',
		experience: '0'
	}).then(() => {
		log("Registered backend user with the following uid: " + uid);
		res.status(200).end();
	}).catch((error) => {
		log(error);
		res.status(500).json(error);
	});
})

>>>>>>> 360073948a7b01e6bb44a3c3088f17159d51c8a1
// TODO Add a permanent exception in server.js to allow verification requests to pass thru w/o authentication
router.post('/verify', (req, res) => {
	var admin = req.locals.admin;
	var displayName = req.locals.displayName;

<<<<<<< HEAD
	console.log("Verifying display name " + displayName + " is unique");

=======
>>>>>>> 360073948a7b01e6bb44a3c3088f17159d51c8a1
	var verifyDisplayNames = new Promise((resolve, reject) => {
		function checkDisplayNames(nextPageToken) {
			admin.auth().listUsers(1000, nextPageToken)
			.then((listUsersResult) => {
<<<<<<< HEAD
				listUsersResult.users.forEach((userRecord) => {
					// The provided display name is not unique
					if (userRecord.toJSON().displayName === displayName) {
						reject(NON_UNIQUE_DNAME);
					}
				})
				// Iterate through next set of users
				if (listUsersResult.pageToken) {
					checkDisplayNames(listUsersResult.pageToken)
=======
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
>>>>>>> 360073948a7b01e6bb44a3c3088f17159d51c8a1
				} else {
					resolve();
				}
			}).catch((error) => {
				reject(error);
			});
		}

<<<<<<< HEAD
		checkDisplayNames(undefined)
=======
		log("Verifying display name " + displayName + " is unique.");
		checkDisplayNames(undefined);
>>>>>>> 360073948a7b01e6bb44a3c3088f17159d51c8a1
	});

	verifyDisplayNames
	.then(() => {
<<<<<<< HEAD
		console.log("Verified that display name", displayName, "is unique.");
		res.sendStatus(200).end( { isUnique: true } );
	}).catch((error) => {
		console.log("Received error", error);
		if (error === NON_UNIQUE_DNAME) {
			console.log(NON_UNIQUE_DNAME, displayName);
			res.sendStatus(200).end( { isUnique: false } );
		} else {
			console.log("Error occurred while iterating through firebase users.");
			console.log(error);
			res.sendStatus(404).end(error);
=======
		log(displayName + " is unique.");
		res.status(200).json( { isUnique: true } );
	}).catch((error) => {
		if (error === NON_UNIQUE_DNAME) {
			log(NON_UNIQUE_DNAME);
			res.status(200).json( { isUnique: false } );
		} else {
			log(error);
			res.status(500).json(error);
>>>>>>> 360073948a7b01e6bb44a3c3088f17159d51c8a1
		}
	})
})

<<<<<<< HEAD
router.post('/create_account', (req, res) => {
		const uid = req.locals.uid;
		const admin = req.locals.admin;

		console.log("Registering backend user under the following uid:", uid);

		admin.database().ref("users").child(uid).set({
				hostedSessions: '',
				joinedSessions: '',
				experience: '0'
		});

		res.sendStatus(200).end();
})

=======
>>>>>>> 360073948a7b01e6bb44a3c3088f17159d51c8a1
module.exports = router;
