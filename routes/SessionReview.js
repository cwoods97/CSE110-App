var express = require('express');
var router = express.Router();

router.get('/sessionData', (req, res) => {
		const sessionCode = req.locals.sessionCode;
		const ref = req.locals.admin.database().ref("feedback/" + sessionCode);

		ref.once('value').then((snapshot) => {
				res.sendStatus(200).end(snapshot);
		}).catch((error) => {
				res.sendStatus(404).end();
		};
});

module.exports = router;
