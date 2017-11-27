import React, { Component } from 'react';
import firebase from 'firebase';
import Users from './components/Users.js';
import DisplayUserData from './components/DisplayUserData.js';
import './styles/App.css';

import ReactDOM from 'react-dom';
import App from  "./App"

class About extends Component {

    constructor(props) {
        super(props);
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyDSQVw9KUjmxhlxILCousROVR6PfOFcYQg",
            authDomain: "speakeasy-25a66.firebaseapp.com",
            databaseURL: "https://speakeasy-25a66.firebaseio.com",
            projectId: "speakeasy-25a66",
            storageBucket: "speakeasy-25a66.appspot.com",
            messagingSenderId: "836790794762"
        };
        if (firebase.apps.length == 0){
            firebase.initializeApp(config);
        }
        else{
            firebase.app()
        }
        this.state = {
            message: ""
        }
    }

    app = function(ev){

        ev.preventDefault();

        ReactDOM.render(<App />, document.getElementById('root'));


    }

    render() {
        return (

            <div>
              <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>
              <div style={{backgroundColor:'#6164a3',height:"100%"}}>

                  <h3 style={{marginLeft:'10px',marginTop:'0px',marginBottom:'1px',height:'35px',fontFamily:'cursive'}}><a style={{cursor:"pointer"}}onClick ={this.app}><b>speakeasy</b></a>

                </h3>
              </div>


                <center>
                    <h3><b>About Us</b></h3>
                <p style={{margin:"20px"}}>
                    SpeakEasy is a web application developed and created by eleven UCSD students with the goal of improving future speeches of both speakers and presenters. SpeakyEasy empowers
                    speakers and presenters with the ability to easily review speeches they have given in the past in order to identify elements they may improve in. Audience members can
                    actively engage with speakers with quick and easy predefined feedback, such as communcicating they are speaking too fast/slow, to the speaker who can view it effortlessly.
                    This in contrast to the current traditional and disruptive way of interrupting the speaker in order to tell them a piece of information that is trivial and interrupts the flow
                    of the speaker. All of this is available to the audience at the tap of a simple button.

                    Developed with a growth mindset, we believe that there is always room for improvement. SpeakEasy can be used in a range of environments, from small lectures to presentations
                    with hundreds of people. Our application is easy to use with a simple goal to provide a positive experience with all users.

                </p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>

                </center>

            </div>



        );
    }
}
export default About
