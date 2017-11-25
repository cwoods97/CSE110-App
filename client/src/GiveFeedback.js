import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import Users from './components/Users.js';
import DisplayUserData from './components/DisplayUserData.js';
import './styles/App.css';

import App from './App';
import Main from './Main';

class GiveFeedback extends Component{

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
        if (firebase.apps.length == 0){
            firebase.initializeApp(config);
        }
        else{
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

    send_feedback = function(ev){
    	ev.preventDefault();
    	var feedback = document.getElementById("feedback").value;
    	console.log(feedback);

        return new Promise((resolve, reject) => {

        if (feedback) {
            //Posts a request to backend to create a session
            fetch('api/feedback/send_feedback', {
                method: 'post',
                body: JSON.stringify({
                    feedback: feedback
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(response => response.json())
            .then(response => {
                //this should return the session access code
                console.log(response);

            }).catch(error => {
                console.log(error);
                return reject(error);
            });
        }
    })


    }

    render(){
    	return(
    		<div style={{height:'100%',width:'100%'}}>
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>
                <div style={{backgroundColor:'LightSkyBlue',height:"100%"}}>

                    <h3 onClick={this.go_home} style={{cursor:'pointer',marginLeft:'10px',marginTop:'0px',marginBottom:'1px',height:'35px',fontFamily:'cursive'}}><b>speakeasy</b>
                    </h3>
                </div>

                <div style={{display:'flex',alightItems:'center',justifyContent:'center',margin:'0 auto'}}>

                    <div style={{backgroundColor:'#EDEDED',padding:"20px",marginTop:'25px',textAlign:'center'}}>
                        <h2>Feedback Test</h2>

                        <form action="">
                            <input class="w3-input" id="feedback" name="feedback" placeholder={"Type feedback"}></input><br></br>
                            <br></br>
                            <input onClick={this.send_feedback} style={{float:"left"}} class="w3-btn w3-blue-grey" type="submit" value="Submit"></input>
                        </form>
                    </div>
                </div >
            </div>)
    }

}
export default GiveFeedback
