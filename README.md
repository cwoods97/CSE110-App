# CSE110-App

# About Us:

SpeakEasy is a web application developed by eleven UCSD students with the goal of helping speakers improve their public speaking skills and the process of receiving feedback. SpeakEasy empowers speakers with the ability to easily review speeches they have given in the past to identify elements they can improve. Audience members can actively engage with the speaker with quick and easy predefined feedback, such as indicating that they are speaking too fast or slow, which the speaker can view effortlessly. This contrasts with the current traditional and disruptive way of interrupting the speaker to tell them a trivial piece of information. All of this is available to the audience at the tap of a simple button. <br />
Developed with a growth mindset, we believe that there is always room for improvement. SpeakEasy can be used in a range of environments, from small lectures to presentations with hundreds of people. Our application is easy to use with a simple goal to provide a positive experience for all users.

# Requirements:

Computer with internet connection <br />
Google Chrome

# How To Install and Run:

Clone the git repository https://github.com/cwoods97/CSE110-App.git <br />
Navigate to the root directory of the repo and run ‘npm install’. <br />
Run ‘npm start’ in the root directory. <br />
Navigate into the client/ directory and run ‘npm install’. <br />
Run ‘npm start’ in the client/ directory. <br />
Navigate to localhost:3001 in your browser. (note it may take awhile to compile and start) <br />
Login with a test account’s credentials below.

# Test Account Credentials:
Email: test2@test.edu, Password: test123 <br />
Email: teamSMHTest@gmail.com, Password: test123456

# Google Account Credentials:

Email: teamSMHTest@gmail.com, Password: test123456

# Restart Application (in case it crashes):

Refresh your browser. <br />
If you are logged in, you will be redirected to the main page of the app with the options to create or join a session. <br />
If you are not logged in, you will be redirected to the login page.

# Known Bugs:

Audio Playbar Bug: <br />
  On a review session page of a session with audio recording, when the user clicks the triangular play button, the audio starts playing back. However, the user won’t be able to change the current position on the timeline. This bug is due to the recorder not successfully storing the metadata of the recording. We are working to fix this bug.
  
Recording Indication Bar Bug: <br />
  When a user creates a session, starts an audio recording, makes noise to make the recording indication bar move, stops the session while the indication bar is still moving which freezes the bar as is, ends the session, then creates a new session, the recording indication bar stays frozen from the previous session. This bug is related to resetting the bar’s state and re-rendering. We are working to fix this bug.


# Features In-Progress:

Reviewing Predefined Feedback without Audio: <br />
  On a review session page of a session without an audio recording, the user cannot review the predefined feedback. The user can review the customized feedback.
