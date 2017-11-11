const http = require('http')
const firebase = require('firebase')

//frontend doesn't do app.get I believe, but the methods should look something like this (this is just a start)
app.get('/api/create_account', (req, res) => {
	res.json({message: "'create_account api' responding"});
	var q_name = res.query.displayName;
	var q_email = res.query.email;
	var q_passwd = res.query.passwd;

	if (q_displayName && q_email && q_passwd) {
		// Firebase logs a user in when account is created
		// https://firebase.google.com/docs/reference/js/firebase.User
                // Credits: https://firebase.google.com/docs/reference/js/firebase.auth.Auth
		var user = firebase.auth().createUserWithEmailAndPassword(q_email, q_password).catch(function(error)) {
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode === 'auth/weak-password') {
				alert('The password is too weak.');
			} else {
				alert(errorMessage);
 			}
  			console.log(error);
		});
		user.updateProfile(displayName: q_name);

		var post_data = querystring.stringify({
      			'token': user.getToken(true),
		});		

		var post_options = {
	    		host: '',//insert url here
    	  		port: '3000',//insert port here
    	  		path: '/api/register',
	      		method: 'POST',
	      		headers: {
	        	  	'Content-Length': Buffer.byteLength(post_data)
	      		}
		};

		var post_req = http.request(post_options);
		post_req.write(post_data);
		post_req.end();
	}
})
app.get('/api/login', (req, res) => {

        if (q_email && q_passwd) {
                // https://firebase.google.com/docs/reference/js/firebase.User
                // Credits: https://firebase.google.com/docs/reference/js/firebase.auth.Auth
                var user = firebase.auth().signInWithEmailAndPassword(q_email, q_password).catch(function(error) {
                        var errorCode = error.code;
                        if(errorCode === 'auth/wrong-password') {
                                alert('wrong password');
                        } else {
                                alert(errorMessage);
                        }
                        console.log(error);
                });
                // There's a method user.getToken(true). Store it on the client's computer and send it every time you call something in the backend
        }
}*
