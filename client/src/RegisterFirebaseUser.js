import firebase from 'firebase';

/*
Available functions:
    createAccount(displayName, email, password)
    login(email, password)
    getIdToken()
		getDisplayName()
*/
const log = (message) => { console.log("[RegisterFirebaseUser.js] " + message); }

/*
Description: Generates a user account in Firebase, upon which a parallel
user account is established in the backend database. The two accounts are to
be linked logically by the firebase-generated user id.
Preconditions: Provide a display name, email address, and password to be associated with the user's account.
Postconditions: The user shall be registered on Firebase and on the backend database.
On Success: Returned promise resolves as true.
*/
export function createAccount(displayName, email, password) {
    return new Promise((resolve, reject) => {
        if (displayName && email && password) {
            log("Creating parallel Firebase and backend user accounts for " + displayName + ".");

            fetch('/api/account/verify', {
                method: 'post',
                body: JSON.stringify({
                    displayName: displayName
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
                if (data.isUnique) {
                    firebase.auth().createUserWithEmailAndPassword(email, password)
                        .then(user => {
                            user.updateProfile({
                                displayName: displayName
                            }).then(() => {
                                log("Firebase user successfully created.");
                            }).catch(error => {
                                reject('auth/invalid-name');
                            });

                            // Create backend account upon successful firebase registration
                            user.getIdToken()
                                .then((token) => {
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
                                            log("Backend user successfully created.");
                                            resolve();
                                        } else {
                                            reject({ code: 'auth/backend-error' });
                                        }
                                    // Backend API returned an error
                                    }).catch(error => { reject(error); })
                                // Unable to retrieve user login session
                                }).catch(error => { reject(error); });
                        // Unable to create user in Firebase
                        }).catch(error => { reject(error); });
                } else {
                    reject({ code: 'auth/name-already-in-use'});
                }
            // Network failure in communicating with backend
            }).catch((error) => { reject(error); })
        }
    })
}

/*
Description: Creates a login session using Firebase's authentication service.
Preconditions:
    1. Provide the email address and password of the user to be logged in.
    2. User must not be logged in already.
Postconditions: The user shall be logged in to Firebase.
On Success: Returned promise resolves as true.
*/
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

export function logout() {
	firebase.auth().signOut();
}

/*
Description: Creates a login session using Firebase's authentication service.
Precondition: User must be logged in.
Postconditions: The user shall be logged in to Firebase.
On Success: Returned promise resolves to authentication token.
*/
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

export function getDisplayName() {
		return new Promise((resolve, reject) => {
				const user = firebase.auth().currentUser;
				if(user != null){
						const name = user.displayName;
						resolve(name);
				}
				reject("User is not logged in.");
		});
}

export function getPresentedSessions() {
	return new Promise((resolve, reject) => {
        firebase.auth().currentUser.getIdToken()
            .then(token => {
                fetch('/api/account/getPresentedSessions', {
				method: 'post',
				body: JSON.stringify({
					token: token
				}),
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			})
			.then(response => response.json())
			.then(response => {
				console.log(response);
				resolve(response);
			})
			.catch(error => {
				console.log(error);
				return reject(error);
			});
        }).catch(error => { reject(error); })
    })
}

export function getJoinedSessions() {
	return new Promise((resolve, reject) => {
        firebase.auth().currentUser.getIdToken()
            .then(token => {
                fetch('/api/account/getJoinedSessions', {
				method: 'post',
				body: JSON.stringify({
					token: token
				}),
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			})
			.then(response => response.json())
			.then(response => {
				console.log(response);
				resolve(response);
			})
			.catch(error => {
				console.log(error);
				return reject(error);
			});
        }).catch(error => { reject(error); })
    })
}