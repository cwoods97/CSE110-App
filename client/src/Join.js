import React, { Component } from 'react';
import firebase from 'firebase';
import './styles/Join.css';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';


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
        if (firebase.apps.length === 0){
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

            <div style={{height:'100%'}}>
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

                <div style={{height:'45px',borderBottom:'4px solid #665084'}}>
                    <div style={{backgroundColor:'#c4a5ff',height:"100%"}}>


                        <h2 style={{marginLeft:'10px',marginTop:'0px',marginBottom:'1px',height:'35px',fontFamily:'cursive'}}><b>speakeasy</b>


                        </h2>


                    </div>
                </div>


                <div id='navigationJoin' class=" w3-sidebar w3-bar-block w3-responsive" style={{float:'both',margin:'auto',height:'100%',backgroundColor:'lightgrey',zIndex:'0'}}>


                    <a class="w3-bar-item" style={{backgroundColor:'PaleVioletRed'}}>Michael Harasti</a>
                    <a class="w3-bar-item w3-button" onClick={this.main} style={{backgroundColor:'lightgrey'}}>Leave Session</a>
                    <a class="w3-bar-item w3-button" style={{backgroundColor:'lightgrey'}}>Share</a>


                </div>




                <div id='content' class='w3-responsive' style={{height:'100%',float:'right',width:'85%'}}>


                    <div id='left' class= 'w3-responsive' style={{display:'inline-block', float:'left', width:'50%',height:'100%'}}>
                        <center>
                            <p style={{marginTop:'1em', overflow:'hidden'}}><h3><b>Give Predefined Feedback</b></h3></p>
                        </center>

                        <center>

                            <button  bsStyle="Pace of Speech too Fast" class="predefined w3-btn w3-round" style={{backgroundColor:'#665084',color:'white'}}>Pace of Speech too Fast</button>
                            <button bsStyle="Pace of Speech too Slow" class="predefined w3-btn w3-round" style={{backgroundColor:'#665084',color:'white'}}>Pace of Speech too Slow</button>
                            <br></br>
                            <button bsStyle = "Speak Up"class="predefined w3-btn w3-round" style={{backgroundColor:'#6164a3',color:"white"}}>Speak Up</button>
                            <button bsStyle = "Too Loud" class="predefined w3-btn w3-round" style={{backgroundColor:'#6164a3',color:"white"}}>Too Loud</button>

                            <br></br>

                            <button bsStyle="Talking too Fast" class="predefined w3-btn w3-round" style={{backgroundColor:'#c4a5ff',color:'black'}}>Talking too Fast</button>
                            <button bsStyle="Talking too Slow"class="predefined w3-btn w3-round" style={{backgroundColor:'#c4a5ff',color:'black'}}>Talking too Slow</button>

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


                                <button id='post' type="submit" style={{display:'inline-block'}} class="send" onClick={this.add.bind(this)} >Post</button>
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
