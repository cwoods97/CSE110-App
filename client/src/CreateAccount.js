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
        return fetch('/api/hello/hi')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    message: responseJson.message
                });
            })
    }

    create_main = function(ev) {

        ev.preventDefault();

        var email = document.getElementById("email").value;
        var pwd1 = document.getElementById("pwd1").value;
        var pwd2 = document.getElementById("pwd2").value;
	var displayName = document.getElementById("name").value;

        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (re.test(email) &&  pwd1===pwd2  && pwd1 !== "") {

	    createAccount(displayName,email,pwd2);
            ReactDOM.render(<App/>, document.getElementById('root'));

        }

        else {

            if (!re.test(email)) {
                document.getElementById('emailError').innerHTML = "Please enter a valid email address";

            }

            if (pwd1 !== pwd2 || pwd1 === "") {
                document.getElementById('diffPwdError').innerHTML = "Passwords do not match";

            }
        }

    }

    render() {
        return (
            <div style={{height:'100%',width:'100%'}}>
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>
                <div style={{backgroundColor:'LightSkyBlue',height:"100%"}}>

                    <h3 style={{marginLeft:'10px',marginTop:'0px',marginBottom:'1px',height:'35px',fontFamily:'cursive'}}><b>speakeasy</b>
                    </h3>
                </div>

                <div style={{display:'flex',alightItems:'center',justifyContent:'center',margin:'0 auto'}}>

                    <div style={{backgroundColor:'LightSkyBlue',padding:"20px",marginTop:'25px',textAlign:'center'}}>
                        <h2>Create an Account</h2>

                        <form action="">
                            <p id="emailError"></p>
                            <input class="w3-input"id="email" type="text" name="fname" placeholder={"Email"}></input><br></br>
                            <p></p>
                            <input class="w3-input"id="name" type="text" name="dname" placeholder={"Display Name"}></input><br></br>
                            <p></p>
                            <input class="w3-input"id="pwd1" type="text" name="pwd" placeholder={"Password"}></input><br></br>
                            <p id="diffPwdError"></p>
                            <input class="w3-input" id="pwd2" type="text" name="reenter" placeholder={"Re-enter Password"}></input><br></br>
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
