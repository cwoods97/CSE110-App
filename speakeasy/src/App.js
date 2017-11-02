import React, { Component } from 'react';
import firebase from 'firebase';
import Users from './components/Users.js';
import DisplayUserData from './components/DisplayUserData.js';
import './styles/App.css';

class App extends Component {

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

    render() {
        return (

            <div >
              <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>
              <div style={{backgroundColor:'LightSkyBlue',height:"100%"}}>

                <h3 style={{marginLeft:'10px',marginTop:'0px',marginBottom:'1px',height:'35px',fontFamily:'cursive'}}><b>speakeasy</b>

                    <button style={{float:'right',backgroundColor:'lightskyblue', marginRight:'0px',height:'100%'}} class='w3-btn w3-medium'>About Us</button>
                </h3>
              </div>

              <div >

                <div style={{backgroundColor:'LightSkyBlue',float:'right',padding:"20px",width:'30%',marginRight:'50px',marginLeft:'100px' ,marginTop:"50px"}}>
                  <h2>Login</h2>

                  <form action="">
                    Email:<input  type="text" name="fname"></input><br></br>
                    Password: <input type="text" name="lname"></input><br></br>
                    <br></br>
                    <input class="w3-btn w3-blue-grey" type="submit" value="Submit"></input>
                    <button style={{float:"right"}} class="w3-btn w3-blue-grey">Create an Account</button>
                  </form>
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

export default App;
