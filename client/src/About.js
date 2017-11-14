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
              <div style={{backgroundColor:'LightSkyBlue',height:"100%"}}>

                  <h3 style={{marginLeft:'10px',marginTop:'0px',marginBottom:'1px',height:'35px',fontFamily:'cursive'}}><a style={{cursor:"pointer"}}onClick ={this.app}><b>speakeasy</b></a>

                </h3>
              </div>


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
