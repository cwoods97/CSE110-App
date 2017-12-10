import firebase from 'firebase';

/* Available functions:
  createAccount(displayName, email, password)
  login(email, password)
  getIdToken()
	getDisplayName()
	setPassword(oldpassword, newpassword)
	setDisplayName(dispName) */

/* Description: Generates a user account in Firebase, upon which a parallel
user account is established in the backend database. The two accounts are to
be linked logically by the firebase-generated user id.
Preconditions: Provide a display name, email address, and password to be associated with the user's account.
Postconditions: The user shall be registered on Firebase and on the backend database.
On Success: Returned promise resolves as true. */
export function createAccount(displayName, email, password) {
    return new Promise((resolve, reject) => {
        if (displayName && email && password) {
			/* Create the user account with firebase */
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(user => {
				/* Add user's display name to their firebase profile */
                var profileUpdated = user.updateProfile({ displayName: displayName })
                .then(() => {
                }).catch(error => {
                	reject('auth/invalid-name');
                });

                /* Create backend account upon successful firebase registration */
                var backendAccountCreated = new Promise((resolve, reject) => {
                    user.getIdToken()
                    .then((token) => {
						/* Posts a request to the backend to add an entry to the "users" table in the database */
                        /* Delegates to the manager method stored at API endpoint /api/account/craeteAccount */
                        fetch('/api/account/createAccount', {
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
                        }).then((response) => {
                            if (response.status === 200) {
                                resolve();
                            } else {
                                reject({ code: 'auth/backend-error' });
                            }
                        /* Backend API returned an error */
                        }).catch(error => { reject(error); })
                    /* Unable to retrieve user login session */
                    }).catch(error => { reject(error); });
                })

                Promise.all([profileUpdated, backendAccountCreated]).then(() => {
                    resolve();
                }).catch((error) => {
                    reject(error);
                })
            /* Unable to create user in Firebase */
            }).catch(error => { reject(error); });
        }
    })
}

/* Description: Creates a login session using Firebase's authentication service.
Preconditions:
    1. Provide the email address and password of the user to be logged in.
    2. User must not be logged in already.
Postconditions: The user shall be logged in to Firebase.
On Success: Returned promise resolves as true. */
export function login(email, password) {
    return new Promise((resolve, reject) => {
        if (email && password) {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(user => {
                    user.getIdToken()
                        .then((token) => { resolve(token) })
                        .catch((error) => { reject(error) });
                }).catch(error => {
                    reject(error);
                });
        }
    })
}

/* Description: Logs a user out using Firebase's authentication service.
Precondition: the user is logged in.
Postcondition: the user is not logged in. */
export function logout() {
	firebase.auth().signOut();
}

/* Description: gets the token of the currently logged in user
Precondition: user is logged in.
On Success: return the user's idToken */
export function getIdToken() {
    return new Promise((resolve, reject) => {
        firebase.auth().currentUser.getIdToken()
            .then(token => {
                if (token) resolve(token);
                reject("User is not logged in.");
            })
            .catch(error => { reject(error); })
    })
}

/* Description: gets the display name of the currently logged in user
Precondition: user is logged in
On Success: return the user's display name */
export function getDisplayName() {
	return new Promise((resolve, reject) => {
		const user = firebase.auth().currentUser;
		if (user != null) {
			resolve(user.displayName);
		}
		reject("User is not logged in.");
	});
}

/* Description: Change the user's password
Precondition: user is logged in and has supplied their current password
Postcondition: user has a new password */
export function setPassword(oldPassword, newPassword) {
	return new Promise((resolve, reject) => {
		const user = firebase.auth().currentUser;
		/* Check that the user entered their current password */
		user.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(user.email, oldPassword)).then(function() {
			/* Update the user's password */
			user.updatePassword(newPassword).then(function() {
				resolve("Password updated");
				/* Firebase was unable to update the password */
			}).catch(function(error) {
				reject(error);
			});
			/* The user supplied the wrong password */
		}).catch(function(error) {
			reject(error);
		});
	});
}

/* Description: Change the user's display name
Precondition: User is logged in
Postcondition: User has a new display name */
export function setDisplayName(name) {
	return new Promise((resolve, reject) => {
		/* Get the current user */
		const user = firebase.auth().currentUser;
		if(user != null) {
			/* Posts a request to the backend to check the uniqueness of
			the display name */
			fetch('/api/account/verify', {
                method: 'post',
                body: JSON.stringify({
                    displayName: name
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
			}).then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 500) {
                    reject({ code: 'auth/backend-error'});
                }
            }).then((data) => {
				/* Only update the display name if it's unique */
                if (data.isUnique) {
					/* Call Firebase's updateProfile method */
					user.updateProfile({displayName: name}).then(function() {
						resolve("Display Name Updated");
					}).catch(function(error) {
						reject(error);
					});
				} else {
					reject("Display name is already in use");
				}
			});
		} else {
			reject("User is not logged in");
		}
	});
}
