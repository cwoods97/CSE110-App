/*
 * This file defines the CreateAccount component, which acts a View class
 * (of the MVC framework) in acting as a portal page which displays all of
 * the sessions that the currently logged-in user has either joined or hosted.
 * This view also acts as an interface for the user in selecting one of their
 * created sessions in order to review the associated feedback.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './styles/App.css';

import App from './App';
import Main from './Main';
import { createAccount } from './RegisterFirebaseUser';
import logo from './Logo.png';

class AddUserManager {
    addUser(display, email, pwd) {
        //Passing input to dispatch method which validates business logic
        createAccount(display, email, pwd)
        .then(() => {
            //Only render user's main page when successfully logged in
            ReactDOM.render(<Main name={display} db={this.db} />, document.getElementById('root'));
        })
        .catch((error) => {
            return error;
        });
    }
}

class AddUserDispatch {

    constructor() {
        this.addUserManager = new AddUserManager();
    }

    addUser(displayName, email, pwd) {
        /* Posts a request to the backend to check if the display name is unique */
        return new Promise((resolve, reject) => {
            fetch('/api/account/verify', {
                method: 'post',
                body: JSON.stringify({
                    displayName: displayName
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 500) {
                    return {code: 'auth/backend-error'};
                }
            }).then((data) => {
                if (data.isUnique) {
                    resolve(this.addUserManager.addUser(displayName, email, pwd));
                } else {
                    var returnValue = {code: 'auth/name-already-in-use'};
                    reject(returnValue);
                }
            })
        })
    }
}

class AddUserForm {

    constructor() {
        this.addUserDispatch = new AddUserDispatch();
    }

    validateData(email, display, pwd1, pwd2) {
        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var validations = [
            re.test(email),
            Boolean(display) && !display.includes(' '),
            Boolean(pwd1) && !pwd1.includes(' ') && pwd1.length >= 6,
            pwd1 === pwd2
        ]

        if (validations.every(Boolean)) {
            //To preventing spamming of create button until account creation passes or fails
            document.getElementById('createBtn').disabled = true;

            /* No need for further processing of input data - Dispatch user data to the backend for further validation */
            this.addUserDispatch.addUser(display, email, pwd1)
            .then(() => {})
            .catch((error) => {
                if (error) {
                    //Enables the create button, allowing user to fix input and try again
                    document.getElementById('createBtn').disabled = false;

                    var errorCode = error.code;
                    const getById = document.getElementById.bind(document);

                    //Resets Variables
                    getById('displayNameError').innerHTML = '';
                    getById('emailError').innerHTML = '';
                    getById('pwdError').innerHTML = '';
                    if (errorCode === 'auth/invalid-name') {
                        getById('displayNameError').innerHTML = "Please enter a valid display name";
                    }
                    if (errorCode === 'auth/name-already-in-use') {
                        getById('displayNameError').innerHTML = "Display name is already in use";
                    }
                    if (errorCode === 'auth/email-already-in-use') {
                        getById("emailError").innerHTML = "Email is already in use";
                    }
                    if (errorCode === 'auth/weak-password') {
                        getById('pwdError').innerHTML = "Password must be at least 6 characters";
                    }
                }
            })
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
                document.getElementById('pwdError').innerHTML = "";
            } else if (validations[2]) {
                document.getElementById('pwdError').innerHTML = "Passwords do not match";
            } else if (validations[3]) {
                document.getElementById('pwdError').innerHTML = "Please enter a valid password (Spaces not allowed)";
            }
        }
    }
}

//For the create an account page
class CreateAccount extends Component {

    //Constructor for this page
    constructor(props) {
        super(props);

        this.db = props.db;
        this.state = {
            message: ""
        }
        this.addUserForm = new AddUserForm();
    }

    //Brings one back to the login/front page
    goHome = function(ev) {
        ReactDOM.render(<App />, document.getElementById('root'));
    }

    //Actually creates one's account after validation checks and brings one to the main page
    createMain = function(ev) {
        ev.preventDefault();

        //Gets html elements
        const email = document.getElementById("email").value;
        const display = document.getElementById("display").value;
        const pwd1 = document.getElementById("pwd1").value;
        const pwd2 = document.getElementById("pwd2").value;

        // Results in creation of user accounts if user inputs are valid
        this.addUserForm.validateData(email, display, pwd1, pwd2);
    }


    //Html code located here
    render() {
        return (
            <div style={{height:'100%',width:'100%', backgroundColor:'#F3E6DE'}}>
                {/*Necessary Styling included*/}
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>
                {/*For top bar and logo*/}
                <div style={{backgroundColor:'#333333',height:"100%"}}>

                    <h2 onClick={this.goHome} style={{cursor:'pointer',marginLeft:'8px',marginTop:'0px',marginBottom:'0px',height:'50px',fontFamily:'cursive'}}><b></b>
                        <img src={logo} width="125" height="50" onClick={this.goHome} alt="SpeakEasy logo"/>
                    </h2>
                </div>

                {/*For main content of page such as input areas for the users email, display name, and password*/}
                <div style={{display:'flex',alightItems:'center',justifyContent:'center',margin:'0 auto'}}>

                    <div style={{backgroundColor:'#333333',padding:"20px",marginTop:'25px',textAlign:'center', color:'white', borderRadius:'10px'}}>
                        <h2>Create an Account</h2>

                        <form action="" style={{color:'#525252'}}>
                            <p id="emailError" style={{color:'white'}}></p>
                            <input class="w3-input" id="email" type="text" name="fname" placeholder={"Email"}></input>
                            <p id="displayNameError"style={{color:'white'}}></p>
                            <input class="w3-input" id="display" type="text" name="dname" placeholder={"Display Name"}></input>
                            <p id="pwdError"style={{color:'white'}}></p>
                            <input class="w3-input" id="pwd1" type="password" name="pwd" placeholder={"Password"}></input>
                            <p></p>
                            <input class="w3-input" id="pwd2" type="password" name="reenter" placeholder={"Re-enter Password"}></input>
                            <br></br>
                            <input id="createBtn" onClick={this.createMain.bind(this)} style={{float:"left",backgroundColor:"#525252",color:"white"}} class="w3-button w3-round w3-hover-red" type="submit" value="Create"></input>
                        </form>
                    </div>
                </div >
            </div>

        );
    }
}
//Allows use of page
export default CreateAccount;
