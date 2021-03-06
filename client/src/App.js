//Necessary Imports
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import Main from './Main';
import About from './About';
import CreateAccount from './CreateAccount';
import { login } from './RegisterFirebaseUser'
import logo from './Logo.png';

//For the login/front page
class AppFront extends Component {

    //Constructor for the page
    constructor(props) {
        super(props);
        //Initialize Firebase
        var config = {
            apiKey: "AIzaSyDSQVw9KUjmxhlxILCousROVR6PfOFcYQg",
            authDomain: "speakeasy-25a66.firebaseapp.com",
            databaseURL: "https://speakeasy-25a66.firebaseio.com",
            projectId: "speakeasy-25a66",
            storageBucket: "speakeasy-25a66.appspot.com",
            messagingSenderId: "836790794762"
        };

        //To stop an error if one is switching between pages
        if (firebase.apps.length === 0) {
            firebase.initializeApp(config);
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    console.log("Logged in user with ID", user.uid);
                    ReactDOM.render(<Main db={firebase} />, document.getElementById('root'));
                }
            })
        }

        this.state = {
            message: ""
        }
    }


    //Brings one to the main page if the "Submit" button is clicked
    main = function(ev){
        ev.preventDefault();

        //Code for input validity and to actually log in
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var errorb = false;
		
		document.getElementById('error').innerHTML = ""
		document.getElementById('errora').innerHTML = ""
		
        if (!re.test(email)) {
            document.getElementById('error').innerHTML = "Please enter a valid email address";
			errorb = true;
        }
        if (password.length < 6) {
            document.getElementById('errora').innerHTML = "Please enter a valid password";
			errorb = true;
        }
		if(!errorb) {
			login(email, password)
			.then((success) => {
				if (success) {
					ReactDOM.render(<Main db={firebase} />, document.getElementById('root'));
				}
			}).catch((error) => {
				document.getElementById('error').innerHTML = "The credentials are invalid";
			});
		}
    }

    //Brings one to the About Us page
    about= function(ev){

        ev.preventDefault();
        ReactDOM.render(<About />, document.getElementById('root'));

    }

    //Brings one to the Create Account page
    create= function(ev) {
        ev.preventDefault()
        ReactDOM.render(<CreateAccount db={firebase} />, document.getElementById('root'));

    }

    //Displays the reset password portion of the page
    reset = function(ev){
        ev.preventDefault()

        var a = document.createElement('b')
        var b = document.createElement('center')
        a.innerHTML = 'Reset Password'
        b.appendChild(a)
        var holder = document.createElement('p')
        holder.id = "rError"

        var form = document.createElement('form')
        var inp =  document.createElement('input')
        inp.classList.add('w3-input')
        inp.type = 'Text'
        inp.placeholder = "Email"
        inp.id = "rset"
        inp.style.color = '#525252';
        form.appendChild(inp)
        var breaker = document.createElement('br')

        var but =  document.createElement('button')
        but.classList.add('w3-button')
        but.classList.add('w3-round')
        but.style.backgroundColor = '#525252'
        but.style.color = 'white'
        but.classList.add('w3-hover-red')

        //Some validity checks on input here when one wants to reset their password
        but.onclick = function() {  var x = document.getElementById("rset").value;
            // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            
            if(!re.test(x)){

                document.getElementById("rError").innerHTML = "Please enter a valid email address"

            }
            else{
                firebase.auth().sendPasswordResetEmail(x)
                    .then(() => {
                        document.getElementById('rError').innerHTML = "Password reset email sent!";
                    }).catch((error) => {
                        document.getElementById('rError').innerHTML = "Unable to reset password. This email is possibly not associated with a registered user.";
                });
            }
        };
        but.innerHTML = "Reset";

        this.refs.login.appendChild(b);
        this.refs.login.appendChild(holder);
        this.refs.login.appendChild(breaker);
        this.refs.login.appendChild(form);
        this.refs.login.appendChild(breaker);
        this.refs.login.appendChild(but);
        var remove = document.getElementById('reset')
        this.refs.login.removeChild(remove)

    }


    //Bulk of html code
    render() {
        return (

            <div id='startpage' style={{width:'100%',height:'100%',display:'inline-block', backgroundColor:'#F3E6DE'}}>

                {/*For styling*/}
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>
                {/*For top bar and logo and About Us link*/}
                <div style={{backgroundColor:'#333333',height:"100%"}}>
                    <h2 style={{marginLeft:'8px',marginTop:'0px',marginBottom:'0px',height:'50px', color:'white'}}><b></b>
                        <img src={logo} width="125" height="50" alt="SpeakEasy logo"/>
                        <a onClick={this.about} class = {'HoverRed'} style={{textDecoration:'underline', float:'right', marginTop:'17px', marginRight:'10px',fontSize:'50%',cursor:'pointer'}} >About Us</a>
                    </h2>
                </div>
                {/*For brief text intro to the webpage*/}
                <div id='infocontainer' style={{width:'60%',float:'left'}}>
                    <div id='info' style={{padding:"20px", margin:'100px'}}>
                        <h3 id='infoheader'>
                            <b>Welcome to SpeakEasy.</b> <br />A web application designed to enhance presentations, speeches,
                            and public speaking in general. Our goal is to improve the experiences of both the audience and speech givers.
                        </h3>

                    </div>
                </div>

                {/*For the main login/create/reset portion of the page*/}
                <div id='startcontianer' style={{width:'40%',float:'right'}}>

                    <div id='startform' ref="login" style={{borderRadius:'10px',backgroundColor:'#333333',padding:"20px",width:'80%',marginRight:'auto',marginLeft:'auto' ,marginTop:"50px", color:'#F3E6DE'}}>
                        <h2 style={{color:'white'}}>Login</h2>
                        <form action="">
                            <p id="error"></p>

                            <input  ref = 'email' id = "email"class = "w3-input" type="text" name="fname" placeholder={"Email"} style={{color:'#525252'}}></input>
                            <p id="errora"></p>
                            <input class= "w3-input" id = "password" type="password" name="lname" placeholder={"Password"} style={{color:'#525252'}}></input><br></br>
                            <input id= "submit" style={{backgroundColor:'#525252',color:'white'}} class="w3-button w3-round w3-hover-red" onClick= {this.main} type="submit" value="Submit"></input>
                        </form>

                        <br></br>

                        <a onClick={this.create} class={'HoverRed'} style={{textDecoration:'underline', cursor:'pointer'}}>Create an Account</a>

                        <br></br>

                        <a ref="res" id="reset" class={'HoverRed'} onClick = {this.reset.bind(this)} style={{textDecoration:'underline', cursor:'pointer'}}>Forgot Your Password?</a>
                    </div>

                </div >





            </div>

        );
    }
}

//Exports to allow page to be shown
export default AppFront;
