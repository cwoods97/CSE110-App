
export function createBackendSession(idToken) {

    return new Promise((resolve, reject) => {

        if (idToken) {
			//Posts a request to backend to create a session
            fetch('/api/sessionSetup/createSession', {
				method: 'post',
				body: JSON.stringify({
					token: idToken
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

export function joinBackendSession(idToken, code) {
		return new Promise((resolve, reject) => {
				if(idToken) {
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
								if(response.error) return reject(response.error);
								resolve(response.session);
						})
						.catch(error => {
								console.log(error);
								return reject(error);
						});
				}
		});
}

export function leaveBackendSession(idToken, sessionID) {
		return new Promise((resolve, reject) => {
				if(idToken) {
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
								resolve(response.message);
						})
						.catch(error => {
								console.log(error);
								return reject(error);
						});
				}
		});
}

export function updateTitle(idToken, session, newTitle) {
		return new Promise((resolve, reject) => {
				if(idToken) {
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
								resolve(response.title);
						})
						.catch(error => {
								console.log(error);
								return reject(error);
						});
				}
		});

}

export function endSession(idToken, code) {
	return new Promise((resolve, reject) => {
		if(idToken) {
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

export function toggleActive(idToken, code) {

	return new Promise((resolve, reject) => {
		if(idToken) {
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
			.then(response => response.json())
						.then(response => {
							console.log(response);
						})
			.catch(error => {
				console.log(error);
				return reject(error);
			});
		}
	});
}

export function setStartTime(idToken, sessionId, timestamp, type){
		return new Promise((resolve, reject) => {
			fetch('/api/PresenterSession/addStartTime', {
					method: 'post',
					body: JSON.stringify({
							token: idToken,
							sessionCode: sessionId,
							time: timestamp,
							audio: type
					}),
					headers: {
							'Content-Type': 'application/json',
							'Accept': 'application/json'
					}
				})
				.then(response => response.json())
				.then(response => {
						resolve(response.success);
				})
				.catch((error) => {
						return reject(error);
				});
		});
}
