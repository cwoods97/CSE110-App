//Necessary imports
import React, { Component } from 'react';
import './styles/Join.css';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import {getDisplayName} from "./RegisterFirebaseUser";

import Main from './Main';
//Plugin for customized feedback. Mainly used for its CSS formatting
import 'react-chat-widget';
import {leaveBackendSession} from './FrontEndSession';
import {getIdToken} from './RegisterFirebaseUser.js';
import {sendFeedback} from './SendFeedback.js';

import logo from './Logo.png';
import slowB from './Slow.png';
import fastB from './Fast.png';
import quietB from './Quiet.png';
import loudB from './Loud.png';
import unclearB from './Unclear.png';
import clearB from './Clear.png';

//For page when one joins a session
class Join extends Component {

    //Constructor for page
    constructor(props) {
        super(props);

		this.sessionAccessCode = props.code;
		this.sessionID = props.session;
		this.db = props.db;
		this.main = this.main.bind(this);
		this.sendComment = this.sendComment.bind(this);

		//Some states for display name and title of session
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

    //Displays correct display name one page is generated
    componentDidMount() {
        getDisplayName().then(name =>{this.setState({display: name});});
    }

    //Sends predefined feedback
    sendPredef = function(comment, e){

        e.preventDefault();
        getIdToken().then(token =>{
            sendFeedback(token, this.sessionID, comment, 0)
			.then((message) => {
                console.log("Message sent.")
			})
			.catch((error) => {
                console.log(error);
                console.log("Failed to send message.")
			});
        })
    }

    //Sends customized feedback comments
    sendComment = function (e){

		var session = this.sessionID;

        e.preventDefault()
        var comment = document.getElementById("comment").value;

        if (comment === ""){

        }
        else {

			getIdToken().then(token => {
				sendFeedback(token, session, comment, 1)
				.then((message) => {
				    //For creation of customized feedback to appear in the customized feedback box
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

        		    //From https://stackoverflow.com/questions/7303948/how-to-auto-scroll-to-end-of-div-when-data-is-added
        		    mList.scrollTop = mList.scrollHeight;

				}).catch((error) => {
                    console.log(error);
				});
			});


            document.getElementById("comment").value = ""

        }

    };

    //Brings one back to the main page when one leaves a session
    main= function(ev){

        ev.preventDefault();

		getIdToken().then(token => {
			leaveBackendSession(token, this.sessionID).then((message) => {
    	        ReactDOM.render(<Main db={this.db}/>, document.getElementById('root'));
			});
		});


    }

    //Html code is located here
    render() {
        return (

            <div style={{height:'100%'}}>
                {/*For necessary styling*/}
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

                {/*For top bar and logo*/}
                <div style={{backgroundColor:'#333333',height:"100%"}}>
                    <h2 style={{marginLeft:'8px',marginTop:'0px',marginBottom:'0px',height:'50px', color:'white'}}><b></b>
                        <img src={logo} width="125" height="50" alt="SpeakEasy logo"/>
                    </h2>
                </div>


                {/*For side menu*/}
                <div id='navigationJoin' class=" w3-sidebar w3-bar-block w3-responsive" style={{boxShadow:'1px 1px 2px #525252', float:'both',margin:'auto',height:'100%',backgroundColor:'#585858',zIndex:'0', color:'#F3E6DE'}}>


                    {/*For display name session title and access code*/}
                    <a class="w3-bar-item HoverRed" style={{fontSize:'20px', outline:'2px solid #333333'}}><b>{this.state.display}</b></a>

                    <div style={{padding:'10px',boxShadow:'1px 0px 1px#333333'}}>
                    <p><b>Session Title:</b> {this.state.title}</p>
                    <p><b>Session Code:</b> {this.sessionAccessCode}</p>
                    </div>
                    <a class="w3-bar-item w3-button w3-hover-red" onClick={this.main} style={{boxShadow:'1px 0px 1px #333333'}}>Leave Session</a>


                </div>

                {/*For main content such as the predefined feedback and customized feedback areas*/}
                <div id='content' class='w3-responsive' style={{height:'100%',float:'right',width:'85%'}}>


                    {/*For predefined feedback */}
                    <div id='left' class= 'w3-responsive' style={{display:'inline-block', float:'left', width:'50%',height:'100%'}}>


                        {/*For predefined feedback title*/}
                        <center>
                            <p style={{marginTop:'1em', overflow:'hidden'}}><h3><b>Give Predefined Feedback</b></h3></p>
                        </center>

                        <center>

                            {/*For predefined feedback buttons*/}
                            <p>The speaker is too slow or too fast.</p>
                            <button  onClick={(e) => this.sendPredef('slow', e)} class="predefined w3-button w3-round w3-hover-red" style={{backgroundColor:'#525252',color:'#f44336',width:'45px',height:'40px'}}><img src={slowB} height='40' width='40' alt="slow"></img> </button>
                            <button  onClick={(e) => this.sendPredef('fast', e)} class="predefined w3-button w3-round w3-hover-red" style={{backgroundColor:'#525252',color:'#f44336',width:'45px',height:'40px'}}><img src={fastB} height="40" width="40" alt="fast"></img></button>

                            <br></br>

                            <p>The speaker is too quiet or too loud.</p>
                            <button  onClick={(e) => this.sendPredef('quiet', e)} class="predefined w3-button w3-round w3-hover-red" style={{backgroundColor:'#525252',color:'white',width:'45px',height:'40px'}}><img src={quietB} height='40' width='40' alt="quiet"></img> </button>
                            <button  onClick={(e) => this.sendPredef('loud', e)} class="predefined w3-round w3-button w3-hover-red" style={{backgroundColor:'#525252',width:'45px',height:'40px',border:'none'}}><img src={loudB} height="40" width="40" alt="loud"></img></button>

                            <br></br>

                            <p>The speaker is clear or unclear.</p>
                            <button  onClick={(e) => this.sendPredef('unclear', e)} class="predefined w3-button w3-round w3-hover-red" style={{backgroundColor:'#525252',color:'white',width:'45px',height:'40px'}}><img src={unclearB} height='40' width='40' alt="unclear"></img> </button>
                            <button  onClick={(e) => this.sendPredef('clear', e)} class="predefined w3-round w3-button w3-hover-red" style={{backgroundColor:'#525252',width:'45px',height:'40px',border:'none'}}><img src={clearB} height="40" width="40" alt="clear"></img></button>

                        </center>



                    </div>

                    {/*For customized feedback */}
                    <div id='customized' class='w3-responsive' style={{marginTop:'1em' ,display:'inline-block', float:'right',width:'50%', height:'100%'}}>

                        <center>


                            {/*Where the customized feedback box will appear*/}
                            {/*Html code template and some classes taken from the react-chat-widget plugin. You can see the source code for this here: https://github.com/Wolox/react-chat-widget*/}
                        <div id = "comments"class="widget-container" ><div class="w3-responsive conversation-container">
                            <div class="header w3-responsive">
                                <h4 class="title">Give Customized Feedback</h4></div>
                            <div id="messages" class="messages-container w3-responsive">

                            </div>


                            <form class="sender w3-responsive">

                                <input id="comment" style={{display:'inline-block'}} class="new-message" name="message" placeholder="Type a message..." autocomplete="off"></input>


                                <button id='post' type="submit" style={{display:'inline-block',margin:'5px 0'}} class="send" onClick={this.sendComment.bind(this)} >Post</button>
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
//So page can be used
export default Join;
