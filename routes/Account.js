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

router.post('/updateDisplayName', (req, res) => {
		const uid = req.locals.uid;
		const admin = req.locals.admin;
		const display = req.body.displayName;

		const ref = admin.database().ref("users").child(uid);
		ref.child('displayName').set(display);

		res.json({success: true})
});

router.post('/getPresentedSessions', (req, res) => {
	const uid = req.locals.uid;
	const admin = req.locals.admin;

	var sessions = [];
	admin.database().ref("users").child(uid).child("hostedSessions").once('value').then((presentedSessions) => {
		var promises = [];

		presentedSessions = presentedSessions.val();
		if (!presentedSessions) { return res.json([]) }

		presentedSessions = Object.keys(presentedSessions);

		presentedSessions.forEach((sessionID) => {
			promises.push(
				new Promise((resolve, reject) => {
					admin.database().ref("sessions/" + sessionID).once('value').then((sessionData) => {
						admin.auth().getUser(uid).then((userRecord) => {
							sessions.push({
								title: (sessionData.val().title ? sessionData.val().title : "UNTITLED"),
								displayName: userRecord.displayName,
								creationTime: sessionData.val().creationTime,
								id: sessionID
							})
							resolve();
						}).catch((error) => console.log(error))
					}).catch((error) => console.log(error));
				})
			);
		});

		Promise.all(promises).then(() => {
			sessions = sessions.sort((session1,session2)=> {
				
				var a = session2.creationTime;
				var b = session1.creationTime;
				//a>b is true a<b is false
				if(!a) {
					return false;
				}
				if(!b) {
					return true;
				}
				var s1 = a.split("-");
				var month1 = Number(s1[0]);
				var date1 = Number(s1[1]);
				var s2 = s1[2].split(" ");
				var year1 = Number(s2[0]);
				var s3 = s2[1].split(":");
				var hours1 = Number(s3[0]);
				var minutes1 = Number(s3[1]);
				var seconds1 = Number(s3[2]);
				
				s1 = b.split("-");
				var month2 = Number(s1[0]);
				var date2 = Number(s1[1]);
				s2 = s1[2].split(" ");
				var year2 = Number(s2[0]);
				s3 = s2[1].split(":");
				var hours2 = Number(s3[0]);
				var minutes2 = Number(s3[1]);
				var seconds2 = Number(s3[2]);
				
				if(year1 > year2) {
					return true;
				}
				else if(year1 < year2) {
					return false;
				}
				
				if(month1 > month2) {
					return true;
				}
				else if(month1 < month2) {
					return false;
				}
				
				if(date1 > date2) {
					return true;
				}
				else if(date1 < date2) {
					return false;
				}
				
				if(hours1 > hours2) {
					return true;
				}
				else if(hours1 < hours2) {
					return false;
				}
				
				if(minutes1 > minutes2) {
					return true;
				}
				else if(minutes1 < minutes2) {
					return false;
				}
				
				return seconds1 > seconds2;
				
			})
			res.json(sessions);
		});
	}).catch((error) => console.log(error));
})

router.post('/getJoinedSessions', (req, res) => {
	const uid = req.locals.uid;
	const admin = req.locals.admin;

	var sessions = [];
	admin.database().ref("users").child(uid).child("joinedSessions").once('value').then((joinedSessions) => {
		var promises = [];

		joinedSessions = joinedSessions.val();
		if (!joinedSessions) { return res.json([]) }

		joinedSessions = Object.keys(joinedSessions);

		joinedSessions.forEach((sessionID) => {
			promises.push(
				new Promise((resolve, reject) => {
					admin.database().ref("sessions/" + sessionID).once('value').then((sessionData) => {
						admin.auth().getUser(sessionData.val().presenter).then((userRecord) => {
							sessions.push({
								title: (sessionData.val().title ? sessionData.val().title : "UNTITLED"),
								displayName: userRecord.displayName,
								creationTime: sessionData.val().creationTime,
								id: sessionID
							});
							resolve();
						}).catch((error) => console.log(error))
					}).catch((error) => console.log(error));
				})
			);
		});

		Promise.all(promises).then(() => {
			sessions = sessions.sort((session1,session2)=> {
				
				var a = session2.creationTime;
				var b = session1.creationTime;
				//a>b is true a<b is false
				if(!a) {
					return false;
				}
				if(!b) {
					return true;
				}
				var s1 = a.split("-");
				var month1 = Number(s1[0]);
				var date1 = Number(s1[1]);
				var s2 = s1[2].split(" ");
				var year1 = Number(s2[0]);
				var s3 = s2[1].split(":");
				var hours1 = Number(s3[0]);
				var minutes1 = Number(s3[1]);
				var seconds1 = Number(s3[2]);
				
				s1 = b.split("-");
				var month2 = Number(s1[0]);
				var date2 = Number(s1[1]);
				s2 = s1[2].split(" ");
				var year2 = Number(s2[0]);
				s3 = s2[1].split(":");
				var hours2 = Number(s3[0]);
				var minutes2 = Number(s3[1]);
				var seconds2 = Number(s3[2]);
				
				if(year1 > year2) {
					return true;
				}
				else if(year1 < year2) {
					return false;
				}
				
				if(month1 > month2) {
					return true;
				}
				else if(month1 < month2) {
					return false;
				}
				
				if(date1 > date2) {
					return true;
				}
				else if(date1 < date2) {
					return false;
				}
				
				if(hours1 > hours2) {
					return true;
				}
				else if(hours1 < hours2) {
					return false;
				}
				
				if(minutes1 > minutes2) {
					return true;
				}
				else if(minutes1 < minutes2) {
					return false;
				}
				
				return seconds1 > seconds2;
				
			})
			res.json(sessions);
		});
	}).catch((error) => console.log(error));
})


module.exports = router;
