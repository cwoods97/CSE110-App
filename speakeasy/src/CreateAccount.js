import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import Users from './components/Users.js';
import DisplayUserData from './components/DisplayUserData.js';
import './styles/App.css';

import App from './App';


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
            ReactDOM.render(<App/>, document.getElementById('root'));

        }

        else {
            var c = document.getElementById('emailError');
            c.innerHTML = "Please enter a valid email address"

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

                    <div style={{backgroundColor:'LightSkyBlue',padding:"20px",marginTop:'200px',textAlign:'center'}}>
                        <h2>Create an Account</h2>

                        <form action="">
                            <p id="emailError"></p>
                            Email:<input id="email" type="text" name="fname"></input><br></br>
                            Display:<input type="text" name="dname"></input><br></br>
                            Password: <input type="text" name="pwd"></input><br></br>
                            Confirmed: <input type="text" name="confirmpwd"></input><br></br>
                            <br></br>
                            <input onClick={this.main} style={{float:"left"}} class="w3-btn w3-blue-grey" type="submit" value="Submit"></input>
                        </form>
                    </div>
                </div >
            </div>

        );
    }
}

export default CreateAccount;
