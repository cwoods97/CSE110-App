export function sendPredefinedFeedback(token, comment, type) {
   //todo for organization
   return new Promise((resolve, reject) => {
                fetch('api/feedback/predefined_feedback', {
                        method: 'post',
                        body: JSON.stringify({
                            token: token,
                            feedback: comment,
                            type: type
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }).then(response => response.json())
                    .then(response => {
                        //this should return the session access code
                        console.log(response);

                    }).catch(error => {
                        console.log(error);
                        return reject(error);
                    });
                })
    
}