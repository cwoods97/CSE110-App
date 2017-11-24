import React, { Component } from 'react';
import firebase from 'firebase';
import Users from './components/Users.js';
import DisplayUserData from './components/DisplayUserData.js';
import './styles/App.css';
import ReactDOM from 'react-dom';

import Main from './Main';
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget';
import {leaveBackendSession} from './FrontEndSession';
import {getIdToken} from './RegisterFirebaseUser.js';

class Join extends Component {

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



        //document.getElementsByClassName('conversation-container').style.display = "flex"
        return fetch('/api/hello')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    message: responseJson.message
                });
            })
    }

    add = function (e){

        e.preventDefault()

        var mList = document.getElementById('messages');

        var div1 = document.createElement('div');
        div1.classList.add('message')
        var div2 =  document.createElement('div');
        div2.classList.add('client')
        var div3 =  document.createElement('div');
        div3.classList.add('message-text');
        var p =  document.createElement('p');
        p.innerHTML = document.getElementById("comment").value;

        div3.appendChild(p);
        div2.appendChild(div3);
        div1.appendChild(div2);
        mList.appendChild(div1);


        document.getElementById("comment").value = ""


    };

    main= function(ev){

        ev.preventDefault();

				getIdToken().then(token => {
						leaveBackendSession(token).then((message) => {
								alert(message);
				        ReactDOM.render(<Main />, document.getElementById('root'));
						});
				});


    }

    render() {
        return (

            <div >
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

                <div style={{height:'75px'}}>
                    <div style={{backgroundColor:'CornFlowerBlue',height:"100%"}}>

                        <center>
                            <h1 style={{marginLeft:'10px',marginTop:'0px',marginBottom:'1px',height:'35px',fontFamily:'cursive'}}><b>speakeasy</b>


                            </h1>
                        </center>

                    </div>
                </div>

                <div class="w3-sidebar w3-bar-block" style={{width:'20%',height:'100%',backgroundColor:'lightgrey',zIndex:'0',overflow:'hidden'}}>

                    <a href="#" class="w3-bar-item" style={{backgroundColor:'aqua'}}>Michael Harasti</a>
                    <a href="#" class="w3-bar-item w3-button" onClick={this.main} style={{backgroundColor:'lightgrey'}}>Leave Session</a>
                    <a href="#" class="w3-bar-item w3-button" style={{backgroundColor:'lightgrey'}}>Share</a>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                </div>




                <div style={{overflow:'hidden'}}>


                    <div style={{borderRight:'6px solid black',float:'left',width:"45%", marginLeft:'330px',marginTop:'10px', height:'100%'}}>
                        <center>
                            <p style={{width:'', overflow:'hidden'}}><h3><b>Give Predefined Feedback</b></h3></p>
                        </center>

                        <center>

                        <button class="w3-btn w3-large w3-round" style={{margin:'10px',backgroundColor:'palegreen'}}>Pace of Speech too Fast</button>
                        <button class="w3-btn w3-large w3-round" style={{margin:'10px',backgroundColor:'palegreen'}}>Pace of Speech too Slow</button>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                        <button class="w3-btn w3-large w3-round" style={{margin:'10px',backgroundColor:'powderblue'}}>Speak Up</button>
                        <button class="w3-btn w3-large w3-round" style={{margin:'10px',backgroundColor:'powderblue'}}>Too Loud</button>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                        <button class="w3-btn w3-large w3-round" style={{margin:'10px',backgroundColor:'mediumorchid'}}>Talking too Fast</button>
                        <button class="w3-btn w3-large w3-round" style={{margin:'10px',backgroundColor:'mediumorchid'}}>Talking too Slow</button>

                        </center>


                    </div>

                    <div style={{backgroundColor:'',width:'25%',marginRight:'50px',marginTop:'10px',float:'right', height:'100%'}}>
                        <center>



                        <div id = "comments"class="widget-container"><div class="conversation-container">
                            <div class="header"><button class="close-button">
                                </button>
                                <h4 class="title">Give Customized Feedback</h4><span></span></div>
                            <div id="messages" class="messages-container">

                            </div>


                            <form class="sender">

                                <input id="comment" type="text" class="new-message" name="message" placeholder="Type a message..." autocomplete="off"></input>


                                <button type="submit" class="send" onClick={this.add.bind(this)} >Post</button>
                            </form>
                        </div>
                        </div>
                        </center>



                    </div>
                </div>




            </div>

        );
    }
}

export default Join;
