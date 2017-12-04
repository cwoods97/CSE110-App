import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './styles/App.css';

import App from './App';
import Main from './Main';
import { createAccount } from './RegisterFirebaseUser';
import logo from './Logo.png';

class CreateAccount extends Component {

    constructor(props) {
        super(props);

        this.db = props.db;
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
            Boolean(display) && !display.includes(' '),
            Boolean(pwd1) && !pwd1.includes(' ') && pwd1.length >= 6,
            pwd1 === pwd2
        ]

        if (validations.every(Boolean)) {
            createAccount(display,email,pwd2)
                .then(() => {
                    // Only render user's main page when successfully logged in
                    ReactDOM.render(<Main db={this.db} />, document.getElementById('root'));
                })
                .catch((error) => {
                    var errorCode = error.code;
                    const getById = document.getElementById.bind(document);

                    if (errorCode === 'auth/invalid-name') {
                        getById('displayNameError').innerHTML = "Please enter a valid display name";
                    } else if (errorCode === 'auth/name-already-in-use') {
                        getById('displayNameError').innerHTML = "Display name is already in use";
                    } else if (errorCode === 'auth/email-already-in-use') {
                        getById("emailError").innerHTML = "Email is already in use";
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
                document.getElementById('pwdError').innerHTML = "";
            } else if (validations[2]) {
                document.getElementById('pwdError').innerHTML = "Passwords do not match";
            } else if (validations[3]) {
                document.getElementById('pwdError').innerHTML = "Please enter a valid password (Spaces not allowed)";
            }

        }

    }



    render() {
        return (
            <div style={{height:'100%',width:'100%', backgroundColor:'#F3E6DE'}}>
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>
                <div style={{backgroundColor:'#333333',height:"100%"}}>

                    <h2 onClick={this.goHome} style={{cursor:'pointer',marginLeft:'8px',marginTop:'0px',marginBottom:'0px',height:'50px',fontFamily:'cursive'}}><b></b>
                        <img src={logo} width="125" height="50" onClick={this.goHome}/>
                    </h2>
                </div>

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
                            <input onClick={this.createMain.bind(this)} style={{float:"left",backgroundColor:"#525252",color:"white"}} class="w3-button w3-round w3-hover-red" type="submit" value="Create"></input>
                        </form>
                    </div>
                </div >
            </div>

        );
    }
}

export default CreateAccount;
