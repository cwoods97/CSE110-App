var express = require('express');
var router = express.Router();

router.post('/sessionData', (req, res) => {
	const sessionID = req.body.sessionID;
	const admin = req.locals.admin;
	const ref = admin.database().ref("feedback/" + sessionID);

	ref.once('value').then((snapshot) => {
		let predefinedFeedback = [];
		let customFeedback = [];
		let promises = [];
		let data = snapshot.val();

		Object.keys(data).forEach((key) => {
			promises.push(admin.auth().getUser(data[key].uid).then((userRecord) => {
				data[key].uid = userRecord.displayName;
				if (data[key].type === 0) {
					predefinedFeedback.push(data[key]);
				} else if (data[key].type === 1) {
					customFeedback.push(data[key]);
				}
			}));
		})

		Promise.all(promises).then(() => {
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
