import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import Users from './components/Users.js';
import DisplayUserData from './components/DisplayUserData.js';
import './styles/App.css';

import App from './App';
import Main from './Main';
import { createAccount } from './RegisterFirebaseUser';

class CreateAccount extends Component {

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

        if (firebase.apps.length == 0) {
            firebase.initializeApp(config);
        }
        else {
            firebase.app()
        }

        this.state = {
            message: ""
        }
    }

    componentDidMount() {}

    goHome = function(ev) {
        ReactDOM.render(<App />, document.getElementById('root'));
    }

    createMain = function(ev) {

        ev.preventDefault();

        const email = document.getElementById("email").value;
        const display = document.getElementById("display").value;
        const pwd1 = document.getElementById("pwd1").value;
        const pwd2 = document.getElementById("pwd2").value;

        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var validations = [
            re.test(email),
            display.replace(' ', '') !== display,
            pwd1.replace(' ', '') !== pwd1,
            pwd2.replace(' ', '') !== pwd2,
            pwd1 === pwd2
        ]

        if (validations.every(Boolean)) {
            createAccount(display,email,pwd2)
                .then(() => {
                    // Only render user's main page when successfully logged in
                    ReactDOM.render(<Main db={firebase} />, document.getElementById('root'));
                })
                .catch((error) => {
                    var errorCode = error.code;
                    const getById = document.getElementById.bind(document);

                    if (errorCode === 'auth/invalid-name') {
                        getById('displayNameError').innerHTML = "Please enter a valid display name";
                    } else if (errorCode === 'auth/name-already-in-use') {
                        getById('displayNameError').innerHTML = "Display name is already in use";
                    } else if (errorCode === 'auth/email-already-in-use') {
                        getById('emailError').innerHTML = "Email is already in use";
                    } else if (errorCode === 'auth/weak-password') {
                        getById('pwdError').innerHTML = "Password must be at least 6 characters";
                    }
                });

        } else {

            if (validations[0]) {
                document.getElementById('emailError').innerHTML = "";
            } else {
                document.getElementById('emailError').innerHTML = "Please enter a valid email address";
            }

            if (validations[1]) {
                document.getElementById('displayNameError').innerHTML = "";
            } else {
                document.getElementById('displayNameError').innerHTML = "Please enter a valid display name (Spaces not allowed)";
            }

            if (validations[2] && validations[3]) {
                if (validations[4]) {
                    document.getElementById('pwdError').innerHTML = "";
                } else {
                    document.getElementById('pwdError').innerHTML = "Passwords do not match";
                }
            } else if (validations[2]) {
                document.getElementById('pwdError').innerHTML = "Please enter a password";
            } else if (validations[3]) {
                document.getElementById('pwdError').innerHTML = "Please re-enter your password";
            }

        }

    }

    render() {
        return (
            <div style={{height:'100%',width:'100%'}}>
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>
                <div style={{backgroundColor:'LightSkyBlue',height:"100%"}}>

                    <h3 onClick={this.goHome} style={{cursor:'pointer',marginLeft:'10px',marginTop:'0px',marginBottom:'1px',height:'35px',fontFamily:'cursive'}}><b>speakeasy</b>
                    </h3>
                </div>

                <div style={{display:'flex',alightItems:'center',justifyContent:'center',margin:'0 auto'}}>

                    <div style={{backgroundColor:'#EDEDED',padding:"20px",marginTop:'25px',textAlign:'center'}}>
                        <h2>Create an Account</h2>

                        <form action="">
                            <p id="emailError"></p>
                            <input class="w3-input" id="email" type="text" name="fname" placeholder={"Email"}></input><br></br>
                            <p id="displayNameError"></p>
                            <input class="w3-input" id="display" type="text" name="dname" placeholder={"Display Name"}></input><br></br>
                            <p id="pwdError"></p>
                            <input class="w3-input" id="pwd1" type="password" name="pwd" placeholder={"Password"}></input><br></br>
                            <p></p>
                            <input class="w3-input" id="pwd2" type="password" name="reenter" placeholder={"Re-enter Password"}></input><br></br>
                            <br></br>
                            <input onClick={this.createMain} style={{float:"left"}} class="w3-btn w3-blue-grey" type="submit" value="Create"></input>
                        </form>
                    </div>
                </div >
            </div>

        );
    }
}

export default CreateAccount;
