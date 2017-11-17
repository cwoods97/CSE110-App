var express = require('express');
var router = express.Router();
var firebase = require('firebase');

router.post('/reset_password', (req, res) => {

	res.json({message: "'reset password api' responding"});

	var email = req.email; //assume this is how it's stored

	firebase.auth().sendPasswordResetEmail(email)
	.then(function() {
		//password reset email sent
	})
	.catch(function(error) {
		//relay error to frontend
	});
}

router.post('/change_password', (req, res) => {

	firebase.auth().confirmPasswordReset(req.code, req.newPassword)

});
