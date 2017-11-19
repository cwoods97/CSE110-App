import firebase from 'firebase';
var request = require('request');

// Making HTTP requests in React: https://github.com/github/fetch
// The frontend shall create a user account through completing two separate objectives:
//     1. Creating a user account on the Firebase database (POST Display name, Email, Password)
//     2. Providing the user id (returned by Firebase) to the backend (to create a parallel user account in the backend)

export function createAccount(displayName, email, password) {

    return new Promise((resolve, reject) => {

        if (displayName && email && password) {
            // *** STEP 1 ***
            // Firebase logs a user in when account is created (Consider logging user out immediately since frontend redirects user to login page upon account creation)
            // https://firebase.google.com/docs/reference/js/firebase.User
            // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#createUserWithEmailAndPassword
            var firebaseUser;
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(user => {
                    firebaseUser = user;

                    // TODO: IF display name is also unique, we need to iterate over all users to verify it's unique
                    // https://firebase.google.com/docs/reference/js/firebase.User#updateProfile
                    user.updateProfile({
                        displayName: displayName
                    }).catch(error => {
                        // TODO: Write code to handle this edge case - Firebase unable to update display name
                        // Either try to update again or just display an error in the front end
                    });

                    // *** STEP 2 ***
                    user.getIdToken(true).then(token => {
                        fetch('api/account/create_account', {
                            method: 'post',
                            body: JSON.stringify({
                                displayName: displayName,
                                email: email,
                                token: token
                            }),
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            }
                        }).then(response => response.json())
                            .then(response => {
                                console.log(response);
                                console.log("6");

                            }).catch(error => {
                                console.log("error");
                                console.log(error);
                                // TODO: Could not create a backend account. Try again maybe?
                            })
                    }).catch(error => {
                        return reject(error);
                    });

                }).catch(error => {
                    return reject(error);
                });
        }
    })
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
				console.log("success");
                // TODO: Store it on the client side - must be used for every request to backend

            }).catch(error => {
                // TODO: Fill out the rest of this code
                var errorCode = error.code;
                if (errorCode === 'auth/wrong-password') {
                    alert('wrong password');
                } else {
                    //alert(errorMessage);
                }
            });
    }
}