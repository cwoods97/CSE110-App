/*
This file contains code regarding reviewing sessions.
*/
var express = require('express');
var router = express.Router();

// Gets the feedbacks of the sessions
router.post('/sessionData', (req, res) => {
	const sessionID = req.body.sessionID;
	const admin = req.locals.admin;
	const ref = admin.database().ref("feedback/" + sessionID);

	// Gets the list of feedback of the associated session
	ref.once('value').then((snapshot) => {
		let data = snapshot.val();
		if (!data) { return res.status(200).json({}); }

		let predefinedFeedback = [];
		let customFeedback = [];
		let promises = [];

		// Gets the predefined/custom feedbacks
		Object.keys(data).forEach((key) => {
			promises.push(admin.auth().getUser(data[key].uid).then((userRecord) => {
				data[key].uid = userRecord.displayName;
				if (data[key].type === 0) {
					//data[key].forEach()
					predefinedFeedback.push(data[key]);
				} else if (data[key].type === 1) {
					customFeedback.push(data[key]);
				}
			}));
		})
		
		// Sorts the feedbacks by timestamp
		Promise.all(promises).then(() => {
			predefinedFeedback = predefinedFeedback.sort((a,b)=> a.timestamp > b.timestamp)
			customFeedback = customFeedback.sort((a,b)=> a.timestamp > b.timestamp)
			res.status(200).json({
				'predefinedFeedback' : predefinedFeedback,
				'customFeedback' : customFeedback
			});
		});
	}).catch((error) => {
		res.sendStatus(404).end();
	});
});

module.exports = router;
