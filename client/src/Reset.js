import React, { Component } from 'react';
import firebase from 'firebase';
import Users from './components/Users.js';
import DisplayUserData from './components/DisplayUserData.js';
import './components/Reset.css';

class Reset extends Component {

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
        firebase.initializeApp(config);

        this.state = {
            message: "",
            password: "",
            cpassword: "",
            email: ""
        };

        this.handleCPasswordChange = this.handleCPasswordChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
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

    checkInput = function(event) {

        var email = document.getElementById('email').value;
        var pw = document.getElementById('pw').value;
        var cpw = document.getElementById('cpw').value;

        event.preventDefault();

        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        /* Error checks for email form */
        if (document.getElementById('email').value === "" || !re.test(email)) {
            document.getElementById('emailError').innerHTML = "Please enter a valid email address";
            return;
        }
        else {
            document.getElementById('emailError').innerHTML = "";
        }

        /* Error checks for blank passwords */
        if (document.getElementById('pw').value === "" || document.getElementById('cpw').value === "") {
            document.getElementById('pwError').innerHTML = "Please enter a password";
            return;
        }
        else {
            document.getElementById('pwError').innerHTML = "";
        }

        /* Error checks for passwords not matching */
        if (document.getElementById('pw').value != document.getElementById('cpw').value) {
            document.getElementById('pwError').innerHTML = "Passwords do not match";
            return;
        }
        else {
            document.getElementById('cpwError').innerHTML = "";
            return;
        }
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    handleCPasswordChange(e) {
        this.setState({cpassword: e.target.value});
    }

    handleEmailChange(e) {
        this.setState({email: e.target.value});
    }

    render() {
        return (
            <div>
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>
                <div className={'Boxed'} style={{marginTop:'200px'}}>
                    <p style={{fontFamily:'Arial', fontSize:'30px', textAlign:'center'}}>
                    Forgot Your Password? </p>

                    <p id={'emailError'}></p>
                    <form className='w3-container'>
                          <p>
                              <input id={"email"} className={'w3-input'} type={'text'} placeholder={"E-mail"}
                                     value={this.state.email} onChange={this.handleEmailChange}></input></p>
                    </form>

                    <p id={'pwError'}></p>
                    <form className='w3-container'>
                          <p>
                              <input className={'w3-input'} type={'password'} placeholder={"Password"} id={'pw'}
                                     value={this.state.password} onChange={this.handlePasswordChange}></input></p>
                    </form>

                    <p id={'cpwError'}></p>
                    <form className='w3-container'>
                          <p>
                              <input className={'w3-input'} type={'password'} placeholder={"Confirm Password"} id={'cpw'}
                                     value={this.state.cpassword} onChange={this.handleCPasswordChange}></input></p>
                    </form>
                    <button className={'w3-btn w3-block w3-black'} onClick={this.checkInput}
                            style={{width:'95%', marginLeft:'15px', marginTop:'15px' }}>Reset Password</button>
                </div>
            </div>
        );
    }
}

export default Reset;