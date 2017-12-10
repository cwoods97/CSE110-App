
//called from "Join.js"
export function sendFeedback(token, session, comment, type) {
    return new Promise((resolve, reject) => {
		//posts a request to the backend to add feedback to a session
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
			//error if session is not active
			if (response.error) return reject(response.error);
			else resolve(response.message); //contains the comment for the feedback
        }).catch(error => {
            return reject(error);
        });
    })

}
