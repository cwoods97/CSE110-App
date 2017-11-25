var express = require('express');
var router = express.Router();

router.post('/send_feedback', (req, res) => {

	// TODO: link w/ feedback object in database
	// fill w/ database schema -
	// uid, timestamp, type, message, starred

	console.log("received feedback is: " + req.body.feedback);
    var feedback = req.body.feedback;
    // res.writeHead(200, {'Content-Type': 'application/json'});
    res.json({feedback: feedback});
    // res.end(JSON.stringify(feedback));
})

module.exports = router;