import React, { Component } from 'react';
import firebase from 'firebase';
import './styles/Join.css';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import {getDisplayName} from "./RegisterFirebaseUser";

import Main from './Main';
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget';
import {leaveBackendSession} from './FrontEndSession';
import {getIdToken} from './RegisterFirebaseUser.js';
import {sendPredefinedFeedback} from './SendFeedback.js';

class Join extends Component {

    constructor(props) {
        super(props);

				this.sessionAccessCode = props.code;
				this.sessionID = props.session;
				this.db = props.db;
				this.main = this.main.bind(this);
				this.sendComment = this.sendComment.bind(this);

        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyDSQVw9KUjmxhlxILCousROVR6PfOFcYQg",
            authDomain: "speakeasy-25a66.firebaseapp.com",
            databaseURL: "https://speakeasy-25a66.firebaseio.com",
            projectId: "speakeasy-25a66",
            storageBucket: "speakeasy-25a66.appspot.com",
            messagingSenderId: "836790794762"
        };
        if (firebase.apps.length === 0){
            firebase.initializeApp(config);
        }
        else{
            firebase.app()
        }
        this.state = {
            message: "",
            display: ""
        }
    }


    componentDidMount() {
        getDisplayName().then(name =>{this.setState({display: name});});
    }

    sendPredef = function(comment, e){
				var currTime = Date.now() / 1000;

        e.preventDefault();
        getIdToken().then(token =>{
            sendPredefinedFeedback(token, this.sessionID, comment, currTime, 0)
						.then((message) => {
								alert("Sent " + message);
						})
						.catch((error) => {
								alert("Error: " + error);
						});
        })

    }

    sendComment = function (e){

				var currTime = Date.now() / 1000;
				var session = this.sessionID;

        e.preventDefault()
        var comment = document.getElementById("comment").value;

        if (comment === ""){

        }
        else {

						getIdToken().then(token => {
								sendPredefinedFeedback(token, session, comment, currTime, 1)
								.then((message) => {
										alert("Sent " + message);
										var mList = document.getElementById('messages');

        				    var div1 = document.createElement('div');
				            div1.classList.add('message')
        				    var div2 = document.createElement('div');
				            div2.classList.add('client')
        				    var div3 = document.createElement('div');
				            div3.classList.add('message-text');
        				    var p = document.createElement('p');

          				  p.innerHTML = comment;
   				          console.log("sending comment" + comment);

				            div3.appendChild(p);
        				    div2.appendChild(div3);
 				            div1.appendChild(div2);
        				    mList.appendChild(div1);

								}).catch((error) => {
										alert("Error: " + error);
								});
						});


            document.getElementById("comment").value = ""

        }

    };

    main= function(ev){

        ev.preventDefault();

				getIdToken().then(token => {
						leaveBackendSession(token, this.sessionID).then((message) => {
				        ReactDOM.render(<Main db={this.db}/>, document.getElementById('root'));
						});
				});


    }

    render() {
        return (

            <div style={{height:'100%'}}>
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

                <div style={{height:'45px',borderBottom:'4px solid #665084'}}>
                    <div style={{backgroundColor:'#c4a5ff',height:"100%"}}>


                        <h2 style={{marginLeft:'10px',marginTop:'0px',marginBottom:'1px',height:'35px'}}><b id="mainTitle">speakeasy</b>


                        </h2>


                    </div>
                </div>


                <div id='navigationJoin' class=" w3-sidebar w3-bar-block w3-responsive" style={{borderRight:'1px solid #665084', float:'both',margin:'auto',height:'100%',backgroundColor:'lightgrey',zIndex:'0'}}>


                    <a class="w3-bar-item" style={{backgroundColor:'PaleVioletRed'}}><b>{this.state.display}</b></a>
                    <a class="w3-bar-item w3-button" onClick={this.main} style={{backgroundColor:'lightgrey'}}><b>Leave Session</b></a>


                </div>




                <div id='content' class='w3-responsive' style={{height:'100%',float:'right',width:'85%'}}>


                    <div id='left' class= 'w3-responsive' style={{display:'inline-block', float:'left', width:'50%',height:'100%'}}>
                        <center>
                            <p style={{marginTop:'1em', overflow:'hidden'}}><h3><b>Give Predefined Feedback</b></h3></p>
                        </center>

                        <center>

                            <p>Pace of Speech too Fast?</p>
                            <button  onClick={(e) => this.sendPredef('fast', e)} class="predefined w3-button w3-round" style={{backgroundColor:'#665084',color:'white',width:'45px',height:'40px'}}><img src='http://icons.iconarchive.com/icons/iconsmind/outline/256/Unlike-2-icon.png' height='40' width='40'></img> </button>
                            <button  onClick={(e) => this.sendPredef('slow', e)} class="predefined w3-round w3-button" style={{backgroundColor:'#665084',width:'45px',height:'40px',border:'none'}}><img src='https://d30y9cdsu7xlg0.cloudfront.net/png/100266-200.png' height="40" width="40"></img></button>
                            <br></br>


                            <p>Speaker is Speaking Too Loud</p>
                            <button  onClick={(e) => this.sendPredef('quiet', e)} class="predefined w3-button w3-round" style={{backgroundColor:'#665084',color:'white',width:'45px',height:'40px'}}><img src='http://icons.iconarchive.com/icons/iconsmind/outline/256/Unlike-2-icon.png' height='40' width='40'></img> </button>
                            <button  onClick={(e) => this.sendPredef('loud', e)} class="predefined w3-round w3-button" style={{backgroundColor:'#665084',width:'45px',height:'40px',border:'none'}}><img src='https://d30y9cdsu7xlg0.cloudfront.net/png/100266-200.png' height="40" width="40"></img></button>

                            <br></br>

                            <p>Speaker is Talking too Fast?</p>
                            <button  onClick={(e) => this.sendPredef('tfast', e)} class="predefined w3-button w3-round" style={{backgroundColor:'#665084',color:'white',width:'45px',height:'40px'}}><img src='http://icons.iconarchive.com/icons/iconsmind/outline/256/Unlike-2-icon.png' height='40' width='40'></img> </button>
                            <button  onClick={(e) => this.sendPredef('tslow', e)} class="predefined w3-round w3-button" style={{backgroundColor:'#665084',width:'45px',height:'40px',border:'none'}}><img src='https://d30y9cdsu7xlg0.cloudfront.net/png/100266-200.png' height="40" width="40"></img></button>

                        </center>



                    </div>

                    <div id='customized' class='w3-responsive' style={{marginTop:'1em' ,display:'inline-block', float:'right',width:'50%', height:'100%'}}>

                        <center>


                        <div id = "comments"class="widget-container" ><div class="w3-responsive conversation-container">
                            <div class="header w3-responsive">
                                <h4 class="title">Give Customized Feedback</h4><span></span></div>
                            <div id="messages" class="messages-container w3-responsive">

                            </div>


                            <form class="sender w3-responsive">

                                <input id="comment" style={{display:'inline-block'}}type="text" class="new-message" name="message" placeholder="Type a message..." autocomplete="off"></input>


                                <button id='post' type="submit" style={{display:'inline-block'}} class="send" onClick={this.sendComment.bind(this)} >Post</button>
                            </form>
                        </div>
                        </div>
                            <br></br>

                        </center>


                    </div>
                </div>




            </div>

        );
    }
}

export default Join;
