import React, { Component } from 'react';
import firebase from 'firebase';
import './styles/Join.css';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import {getDisplayName} from "./RegisterFirebaseUser";

import Main from './Main';
//Plugin for customized feedback. Mainly used for its CSS formatting
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget';
import {leaveBackendSession} from './FrontEndSession';
import {getIdToken} from './RegisterFirebaseUser.js';
import {sendPredefinedFeedback} from './SendFeedback.js';

import logo from './Logo.png';
import slow from './Slow.png';
import fast from './Fast.png';
import quiet from './Quiet.png';
import loud from './Loud.png';
import unclear from './Unclear.png';
import clear from './Clear.png';

class Join extends Component {

    constructor(props) {
        super(props);

		this.sessionAccessCode = props.code;
		this.sessionID = props.session;
		this.db = props.db;
		this.main = this.main.bind(this);
		this.sendComment = this.sendComment.bind(this);

        this.state = {
            message: "",
            display: "",
			title: "untitled"
        }

		var sessRef = this.db.database().ref("sessions").child(this.sessionID);
		sessRef.child('title').on('value', (snapshot) => {
				this.setState({title: snapshot.val()});
		});
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
                console.log("Message sent.")
			})
			.catch((error) => {
                console.log(error);
                console.log("Failed to send message.")
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
                    console.log(error);
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

                <div style={{backgroundColor:'#333333',height:"100%"}}>
                    <h2 style={{marginLeft:'8px',marginTop:'0px',marginBottom:'0px',height:'50px', color:'white'}}><b></b>
                        <img src={logo} width="125" height="50" />
                    </h2>
                </div>


                <div id='navigationJoin' class=" w3-sidebar w3-bar-block w3-responsive" style={{boxShadow:'1px 1px 2px #525252', float:'both',margin:'auto',height:'100%',backgroundColor:'#585858',zIndex:'0', color:'#F3E6DE'}}>


                    <a class="w3-bar-item HoverRed" style={{fontSize:'20px', outline:'2px solid #333333'}}><b>{this.state.display}</b></a>

                    <div style={{padding:'10px',boxShadow:'1px 0px 1px#333333'}}>
                    <p><b>Session Title:</b> {this.state.title}</p>
                    <p><b>Session Code:</b> {this.sessionAccessCode}</p>
                    </div>
                    <a class="w3-bar-item w3-button w3-hover-red" onClick={this.main} style={{boxShadow:'1px 0px 1px #333333'}}>Leave Session</a>


                </div>




                <div id='content' class='w3-responsive' style={{height:'100%',float:'right',width:'85%'}}>


                    <div id='left' class= 'w3-responsive' style={{display:'inline-block', float:'left', width:'50%',height:'100%'}}>


                        <center>
                            <p style={{marginTop:'1em', overflow:'hidden'}}><h3><b>Give Predefined Feedback</b></h3></p>
                        </center>

                        <center>

                            <p>The speaker is too slow or too fast.</p>
                            <button  onClick={(e) => this.sendPredef('slow', e)} class="predefined w3-button w3-round" style={{backgroundColor:'#525252',color:'#f44336',width:'45px',height:'40px'}}><img src={slow} height='40' width='40'></img> </button>
                            <button  onClick={(e) => this.sendPredef('fast', e)} class="predefined w3-button w3-round" style={{backgroundColor:'#525252',color:'#f44336',width:'45px',height:'40px'}}><img src={fast} height="40" width="40"></img></button>

                            <br></br>

                            <p>The speaker is too quiet or too loud.</p>
                            <button  onClick={(e) => this.sendPredef('quiet', e)} class="predefined w3-button w3-round" style={{backgroundColor:'#665084',color:'white',width:'45px',height:'40px'}}><img src={quiet} height='40' width='40'></img> </button>
                            <button  onClick={(e) => this.sendPredef('loud', e)} class="predefined w3-round w3-button" style={{backgroundColor:'#665084',width:'45px',height:'40px',border:'none'}}><img src={loud} height="40" width="40"></img></button>

                            <br></br>

                            <p>The speaker is clear or unclear.</p>
                            <button  onClick={(e) => this.sendPredef('unclear', e)} class="predefined w3-button w3-round" style={{backgroundColor:'#f44336',color:'white',width:'45px',height:'40px'}}><img src={unclear} height='40' width='40'></img> </button>
                            <button  onClick={(e) => this.sendPredef('clear', e)} class="predefined w3-round w3-button" style={{backgroundColor:'#525252',width:'45px',height:'40px',border:'none'}}><img src={clear} height="40" width="40"></img></button>

                        </center>



                    </div>

                    <div id='customized' class='w3-responsive' style={{marginTop:'1em' ,display:'inline-block', float:'right',width:'50%', height:'100%'}}>

                        <center>

                            {/*Html code template and some classes taken from the react-chat-widget plugin. You can see the source code for this here: https://github.com/Wolox/react-chat-widget*/}
                        <div id = "comments"class="widget-container" ><div class="w3-responsive conversation-container">
                            <div class="header w3-responsive">
                                <h4 class="title">Give Customized Feedback</h4></div>
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
