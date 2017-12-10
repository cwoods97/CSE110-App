//called from "Main.js"
export function createBackendSession(idToken) {

    return new Promise((resolve, reject) => {

        if (idToken) {
			//Posts a request to backend to create a session
            fetch('/api/sessionSetup/createSession', {
				method: 'post',
				body: JSON.stringify({
					token: idToken,
				}),
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			}).then(response => response.json())
			.then(response => {
				// this should return the session ID and access code
				resolve(response);

			}).catch(error => {
				console.log(error);
				return reject(error);
			});
        }
    })
}

//called from "Main.js"
export function joinBackendSession(idToken, code) {
		return new Promise((resolve, reject) => {
				if(idToken) {
						//posts a request to the backend to join the session 
						//specified by the input access code
						fetch('/api/session/join', {
								method: 'post',
								body: JSON.stringify({
										token: idToken,
										accessCode: code
								}),
								headers: {
										'Content-Type': 'application/json',
										'Accept': 'application/json'
								}
						})
						.then(response => response.json())
						.then(response => {
								//response.error is returned if the session could not 
								//be found
								if(response.error) return reject(response.error);
								//otherwise response contains session metadata
								resolve(response.session);
						})
						.catch(error => {
								console.log(error);
								return reject(error);
						});
				}
		});
}

//called from "Join.js"
export function leaveBackendSession(idToken, sessionID) {
		return new Promise((resolve, reject) => {
				if(idToken) {
						//posts a request to the backend to leave the session 
						//specified by the session id
						fetch('/api/session/leave', {
								method: 'post',
								body: JSON.stringify({
										token: idToken,
										session: sessionID
								}),
								headers: {
										'Content-Type': 'application/json',
										'Accept': 'application/json'
								}
						})
						.then(response => response.json())
						.then(response => {
								//contains details of the session id
								resolve(response.message);
						})
						.catch(error => {
								console.log(error);
								return reject(error);
						});
				}
		});
}

//called from "CreateSession.js"
export function updateTitle(idToken, session, newTitle) {
		return new Promise((resolve, reject) => {
				if(idToken) {
						//posts a request to the backend to update the title of the
						//session specified by the session id in the database
						fetch('/api/session/title', {
								method: 'post',
								body: JSON.stringify({
										token: idToken,
										code: session,
										title: newTitle
								}),
								headers: {
										'Content-Type': 'application/json',
										'Accept': 'application/json'
								}
						})
						.then(response => response.json())
						.then(response => {
								//contains the received title
								resolve(response.title);
						})
						.catch(error => {
								console.log(error);
								return reject(error);
						});
				}
		});

}

//called from "CreateSession.js"
export function endSession(idToken, code) {
	return new Promise((resolve, reject) => {
		if(idToken) {
			//posts a request to the backend to end the session specified by 
			//the access code
			fetch('/api/PresenterSession/endSession', {
				method: 'post',
				body: JSON.stringify({
						token: idToken,
						accessCode: code,
				}),
				headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
				}
			})
			.catch(error => {
					console.log(error);
					return reject(error);
			});
		}
	});
}

//called from "CreateSession.js"
export function toggleActive(idToken, code) {

	return new Promise((resolve, reject) => {
		if(idToken) {
			//posts a request to the backend to flip the 'isActive' field of the 
			//session specified by its access code from true to false or vice versa
			fetch('/api/PresenterSession/toggleActive', {
				method: 'post',
				body: JSON.stringify({
					token: idToken,
					accessCode: code
				}),
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			})
			.then(response => { resolve() })
			.catch(error => {
				return reject(error);
			});
		}
	});
}

//called from "CreateSession.js"
export function setStartTime(idToken, sessionId, type){
		return new Promise((resolve, reject) => {
			//posts a request to the backend to set the 'startTime' and 'hasAudio'
			//fields of the session specififed by its id
			fetch('/api/PresenterSession/addStartTime', {
					method: 'post',
					body: JSON.stringify({
							token: idToken,
							sessionCode: sessionId,
							audio: type
					}),
					headers: {
							'Content-Type': 'application/json',
							'Accept': 'application/json'
					}
				})
				.then(response => response.json())
				.then(response => {
						//contains true if the response was successful
						resolve(response.success);
				})
				.catch((error) => {
						return reject(error);
				});
		});
}
