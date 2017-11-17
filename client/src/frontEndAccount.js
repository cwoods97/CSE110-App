import firebase from 'firebase';


// Making HTTP requests in React: https://github.com/github/fetch
// The frontend shall create a user account through completing two separate objectives:
//     1. Creating a user account on the Firebase database (POST Display name, Email, Password)
//     2. Providing the user id (returned by Firebase) to the backend (to create a parallel user account in the backend)

export function createAccount(displayName, email, password) {

if (displayName && email && password) {
	// *** STEP 1 ***
	// Firebase logs a user in when account is created (Consider logging user out immediately since frontend redirects user to login page upon account creation)
	// https://firebase.google.com/docs/reference/js/firebase.User
    // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#createUserWithEmailAndPassword
    var firebaseUser;
	console.log("tttttessstttt");
	firebase.auth().createUserWithEmailAndPassword(email, password)
		.then(user => {
			firebaseUser = user;

			// TODO: IF display name is also unique, we need to iterate over all users to verify it's unique
			// https://firebase.google.com/docs/reference/js/firebase.User#updateProfile
			user.updateProfile({ displayName: displayName })
				.catch(error => {
					// TODO: Write code to handle this edge case - Firebase unable to update display name
					// Either try to update again or just display an error in the front end
				});

	// *** STEP 2 ***
	var userData = new FormData();
	userData.append('uid', user.uid);
	userData.append('token', user.getIdToken());

	fetch('/api/register', {
		method: 'POST',
		body: userData,
		headers: {
			'Content-Type': 'application/json'
		}
	}).catch(error => {
		// TODO: Could not create a backend account. Try again maybe?
	})

		}).catch(error => {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log(errorMessage);
			switch (errorCode) {
				case 'auth/email-already-in-use':
					// TODO: Write code to prompt user for different email address
					break;
				case 'auth/weak-password':
					// TODO: Passwords must be at least 6 characters.
					break;
				case 'auth/invalid-email':
					// Should already be handled by frontend input validation
					break;
				case 'auth/operation-not-allowed':
					// Should not be a problem - account creation is enabled in Firebase.
					break;

			}

			return;
		});
}
}
// =============================================================================================================
// TODO: Write out code for logging in to Firebase
// There's a method user.getIdToken. Store it on the client's computer and send it every time you call something in the backend
// 


export function login(email, password) {
	if (email && password) {
    // https://firebase.google.com/docs/reference/js/firebase.User
    // Credits: https://firebase.google.com/docs/reference/js/firebase.auth.Auth
    firebase.auth().signInWithEmailAndPassword(email, password)
    	.then(user => {
    		var token = user.getIdToken();
    		// TODO: Store it on the client side - must be used for every request to backend

    	}).catch(error => {
    		// TODO: Fill out the rest of this code
		    var errorCode = error.code;
		    if(errorCode === 'auth/wrong-password') {
		            alert('wrong password');
		    } else {
		            //alert(errorMessage);
		    }
		});
}
}
