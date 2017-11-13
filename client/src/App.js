import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import Users from './components/Users.js';
import DisplayUserData from './components/DisplayUserData.js';
import './styles/App.css';

import Main from './Main';
import About from './About';
import CreateAccount from './CreateAccount';


class AppFront extends Component {

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
        !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

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

    main(e) {


        var x = document.getElementById("email").value;
        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        if (re.test(x)) {
            ReactDOM.render(<Main/>, document.getElementById('root'));

        }

        else {
            var c = document.getElementById('emailError');
            c.innerHTML = "Please enter a valid email address"

        }
    }

    process (e){

        alert("test")
    }

    about(e){

        ReactDOM.render(<About />, document.getElementById('root'));

    }

    create(e) {
        ReactDOM.render(<CreateAccount />, document.getElementById('root'));

    }

    reset(e){

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
        form.appendChild(inp)
        var breaker = document.createElement('br')

        var but =  document.createElement('button')
        but.classList.add('w3-btn')
        but.classList.add('w3-blue-grey')
        but.onclick = function() {  var x = document.getElementById("rset").value;
            // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            ;
        if(!re.test(x)){

            document.getElementById("rError").innerHTML = "Please enter a valid email address"

        }
        else{

            document.getElementById("rError").innerHTML = ""

        }
        };
        but.innerHTML = "Reset"

        this.refs.login.appendChild(b);
        this.refs.login.appendChild(holder);
        this.refs.login.appendChild(breaker);
        this.refs.login.appendChild(form);
        this.refs.login.appendChild(breaker);
        this.refs.login.appendChild(but);
        var remove = document.getElementById('reset')
        this.refs.login.removeChild(remove)

    }


    render() {
        return (

            <div >
              <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>
              <div style={{backgroundColor:'LightSkyBlue',height:"100%"}}>

                <h3 style={{marginLeft:'10px',marginTop:'0px',marginBottom:'1px',height:'35px',fontFamily:'cursive'}}><b>speakeasy</b>

                    <button onClick={this.about} style={{float:'right',backgroundColor:'lightskyblue', marginRight:'0px',height:'100%'}} class='w3-btn w3-medium'>About Us</button>
                </h3>
              </div>

              <div >

                <div ref="login" style={{backgroundColor:'LightSkyBlue',float:'right',padding:"20px",width:'30%',marginRight:'50px',marginLeft:'100px' ,marginTop:"50px"}}>
                  <h2>Login</h2>

                  <form action="">
                      <p id="emailError"></p>
                    <input  ref = 'email' id = "email"class = "w3-input" type="text" name="fname" placeholder={"Email"}></input><br></br>
                    <input class= "w3-input"type="password" name="lname" placeholder={"Password"}></input><br></br>
                    <br></br>
                    <input id= "submit" class="w3-btn w3-blue-grey" onClick={this.main} type="submit" value="Submit"></input>
                    <button onClick={this.create} style={{float:"right"}} class="w3-btn w3-blue-grey">Create an Account</button>
                  </form>

                    <br></br>

                    <a href="#" ref="res" id="reset" onClick = {this.reset.bind(this)} style={{textDecoration:'underline'}}>Forgot Your Password?</a>
                </div>

              </div >

                 <div style={{padding:"20px", margin:'50px'}}>
                <h3>
                  Welcome to speakeasy, a web app designed to enhance presentations, speeches, and public speaking in general. Our goal is to improve the experiences of both the audience and speech givers.
                </h3>

              </div>


            </div>

        );
    }
}

export default AppFront;