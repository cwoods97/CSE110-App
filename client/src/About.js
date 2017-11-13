import React, { Component } from 'react';
import firebase from 'firebase';
import Users from './components/Users.js';
import DisplayUserData from './components/DisplayUserData.js';
import './styles/App.css';


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


    render() {
        return (

            <div>
                <center>
                    <h3><b>About Us</b></h3>
                <p>speakeasy is a web app designed to improve public speeches. We offer the ability to offer real
                time feedback to speech givers.


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
