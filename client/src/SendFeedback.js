/* Available functions: sendFeedback(token, session, comment, type) */

/* Called from "Join.js" */
export function sendFeedback(token, session, comment, type) {
    return new Promise((resolve, reject) => {
	/* Posts a request to the backend to add feedback to a session */
    fetch('api/feedback/predefined_feedback', {
    	method: 'post',
        body: JSON.stringify({
            token: token,
			sessionId: session,
            feedback: comment,
            type: type
        }),
        headers: {
	        'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        }).then(response => response.json())
        .then(response => {
			/* Error if session is not active */
			if (response.error) return reject(response.error);
		 	/* Contains the comment for the feedback */
			else resolve(response.message);
		}).catch(error => {
            return reject(error);
        });
    })
}
