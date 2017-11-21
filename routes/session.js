var express = require('express');
var router = express.Router();

router.post('/join', (req, res) => {
		var user = req.locals.uid;
		var session = req.accessCode; //assuming this is how it's stored

		//get database reference
		var db = req.locals.admin.database();
		var ref = db.ref("sessions"); //assuming sessions are stored here

		//find session in database
		ref.orderByKey().equalTo(session);
		//add user to list of participants
		updateString = "/participants/" + user;
		ref.update({updateString: true});

		ref = db.ref("user"); //assuming users are stored here

		//find user in database
		ref.orderByKey().equalTo(user);
		//add session to joinedSessions - update
		updateString = '/joinedSessions/' + session;
		ref.update({updateString: session});

});

module.exports = router;
