import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import Users from './components/Users.js';
import DisplayUserData from './components/DisplayUserData.js';
import './styles/App.css';

import App from './App';
import {createAccount} from './frontEndAccount'

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

    componentDidMount() {
        return fetch('/api/hello')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    message: responseJson.message
                });
            })
    }

    go_home = function(ev) {
        ReactDOM.render(<App />, document.getElementById('root'));
    }

    create_main = function(ev) {

        ev.preventDefault();

        var email = document.getElementById("email").value;
        var display = document.getElementById("display").value;
        var pwd1 = document.getElementById("pwd1").value;
        var pwd2 = document.getElementById("pwd2").value;


        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (re.test(email) &&  pwd1===pwd2  && pwd1 !== "" && display !== "") {

	        createAccount("johng24",email,pwd2);
            ReactDOM.render(<App/>, document.getElementById('root'));

        }

        else {

            if (!re.test(email)) {
                document.getElementById('emailError').innerHTML = "Please enter a valid email address";

            } else {
                document.getElementById('emailError').innerHTML = "";
            }

            if (display === "") {
                document.getElementById('displayNameError').innerHTML = "Please enter a valid display name";
            } else {
                document.getElementById('displayNameError').innerHTML = "";
            }

            if(pwd1 === "") {
                document.getElementById('pwdError').innerHTML = "Please enter a password";
            } else if (pwd1 !== pwd2){
                document.getElementById('pwdError').innerHTML = "Passwords do not match";
            } else {
                document.getElementById('pwdError').innerHTML = "";
            }

        }

    }

    render() {
        return (
            <div style={{height:'100%',width:'100%'}}>
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>
                <div style={{backgroundColor:'LightSkyBlue',height:"100%"}}>

                    <h3 onClick={this.go_home} style={{cursor:'pointer',marginLeft:'10px',marginTop:'0px',marginBottom:'1px',height:'35px',fontFamily:'cursive'}}><b>speakeasy</b>
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
                            <input onClick={this.create_main} style={{float:"left"}} class="w3-btn w3-blue-grey" type="submit" value="Create"></input>
                        </form>
                    </div>
                </div >
            </div>

        );
    }
}

export default CreateAccount;
