//Necessary imports
import React, { Component } from 'react';
import './styles/CreateSession.css';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';
import {getDisplayName} from "./RegisterFirebaseUser";

import Chart from './components/Chart';
import Main from './Main';
import {updateTitle, endSession, toggleActive, setStartTime} from './FrontEndSession';
import {getIdToken} from './RegisterFirebaseUser';

import { ReactMic } from 'react-mic';

import logo from './Logo.png';

//For the Create Session page
class CreateSession extends Component {

    //Constructor for the class
    constructor(props) {
        super(props);

        this.db = props.db;
        this.sessionID = props.sessionID;
        this.onStop = this.onStop.bind(this);
		this.updateTitle = this.updateTitle.bind(this);
		//A lot of these states are for toggling between audio and no audio along with general audio functionality
        //Also has states for the display name and title of the session
        this.state = {
            audio: false,
            message: "",
            record: false,
            started: false,
            blobObject: null,
            end: false,
            display: "",
            coder: props.code,
            title: "Untitled"
        };
    }

    //Display the right display name when the page generates
    componentDidMount() {
        getDisplayName().then(name =>{this.setState({display: name});});
    }

    //For when one starts a recording
    startRecording = () => {
				var type = false;

        getIdToken().then(token => {
			toggleActive(token, this.state.coder);
		});
        //Sets states accordingly
		this.setState({
            started: true,
            end: true
        });

		//For audio
        if (this.state.audio) {

            this.setState({
                record: true
            });

						type = true;
        }

        //For disabling buttons once session starts so workflow is not interrupted
        document.getElementById('nAudio').disabled = true;
        document.getElementById('audio').disabled = true;

				getIdToken().then(token => {
						setStartTime(token, this.sessionID, type);
				});
    };

    //For when one stops a recording
    stopRecording = () => {
        getIdToken().then(token => {
			toggleActive(token, this.state.coder);
		});
        //Sets states accordingly
		this.setState({
            record: false,
            started: false,
            end: true
        });

    };

    //Saves the actual audio recording away if session was created with audio
    onStop = (blobObject) => {
		this.setState({endTime: Math.floor(Date.now() / 1000)});
        const storageRef = this.db.storage().ref().child(this.sessionID);
        const recordingRef = storageRef.child('media');
        recordingRef.put(blobObject.blob).then((snapshot) => {
            console.log("Successfully uploaded audio recording to Firebase.");
        }).catch((error) => {
            console.log(error);
        });
    };

    //Closes the session and brings one back to the main page
    close = (ev) => {
        ev.preventDefault();
        //Sets relevant states
        this.setState({
            record: false,
            started: false,
            end: true
        });
		getIdToken().then(token => {
			endSession(token, this.state.coder);
		});

		//Brings one back to the main page
        ReactDOM.render(<Main db={this.db}/>, document.getElementById('root'));
    }

    //Updates the title of the page if the user decided to change it
	updateTitle = (ev) => {

		ev.preventDefault();

		//Accesses relevant html elements
		var title = document.getElementById("title").value;
		var session = this.sessionID;

		//Validity checks before changes are done
		if(title.length > 0 && title.charAt(0) !== ' ' && title.length <= 16) {
				document.getElementById('titleError').innerHTML = "";
				getIdToken().then(token => {
						updateTitle(token, session, title).then((title) => {
							this.setState({title: title});
							document.getElementById('title').value = ""
						});
				});
		//Error message
		} else {
				document.getElementById('titleError').innerHTML = "Title must contain between 1 and 16 characters and cannot start with a space"
		}
	}

	//Used for toggling the Audio versus No Audio buttons
	noAudio = () => {

        if ((this.state.record === false && this.state.end === false)) {
            this.setState({
                audio: false
            });
            document.getElementById('audio').checked = false;
        }
     };

    //Used for toggling the Audio versus No Audio buttons
    audioOn = () => {

        if ( this.state.record === false && this.state.end === false) {
            this.setState({
                audio: true
            });
            document.getElementById('nAudio').checked = false;
        }
    };

    //Html code located here
    render() {

        return (

            <div style={{width:'100%',height:'100%',borderBottom:'4px solid #665084',zIndex:'9' }}>
                {/*Necessary for styling*/}
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>


                {/*For top bar and logo*/}
                <div style={{backgroundColor:'#333333',height:"100%"}}>
                    <h2 style={{marginLeft:'8px',marginTop:'0px',marginBottom:'0px',height:'50px', color:'white'}}><b></b>
                        <img src={logo} width="125" height="50" alt="SpeakEasy logo"/>
                    </h2>
                </div>

                {/*For side bar menu*/}
                <div id='navMain' class="w3-sidebar w3-bar-block w3-responsive" style={{height:'100%',backgroundColor:'#585858',zIndex:'0', color:'#F3E6DE', boxShadow:'1px 1px 2px #525252'}}>
                    {/*Display name area*/}
                    <a class="w3-bar-item HoverRed" id="name" style={{fontSize:'20px', outline:'2px solid #333333'}}>{this.state.display}</a>


                    {/*Session title area*/}
                    <div style={{padding:'10px',boxShadow:'1px 0px 1px#333333'}}>
                    <p id= 'titleDisplay' style={{fontFamily:'Poppins, sans-serif'}}><b>Session Title:</b> {this.state.title}</p>

                    <input id="title" style={{color:'black'}}class="w3-input" type="input" name="editTitle" placeholder={"Edit Title"}></input>
                    <p id="titleError"></p>

                    <button class="w3-button w3-round w3-hover-red" onClick={this.updateTitle} style={{width:'45%',margin:'8px 0', boxSizing:'border-box',borderRadius:'15px',outline:'none',backgroundColor:'#333333'}}>Change</button>
                    </div>


                    {/*Session code area*/}
                    <div style={{padding:'10px',boxShadow:'1px 0px 1px#333333'}}>
                    <p id='code' style={{fontFamily:'Poppins, sans-serif'}}><b>Session Code:</b> {this.state.coder}</p>

                    <p><b>Status:</b> Active/Not Active</p>
                    {/*Audio/No Audio options and starting/stopping*/}
                    <form action="">
                        <input id='nAudio' onClick={this.noAudio} type="radio" name="audioOff" value="noaudio" defaultChecked={true} style={{marginRight:'8px',fontFamily:'Poppins, sans-serif'}}></input>No Audio<br></br>
                        <input id= 'audio' onClick={this.audioOn} type="radio" name="audioOn" value="record" style={{marginRight:'8px',fontFamily:'Poppins, sans-serif'}}></input>Record<br></br>

                        <br></br>


                        <button id='buttons' class="w3-button w3-round w3-hover-red" disabled={this.state.end} onClick={this.startRecording} style={{width:'40%',margin:'8px 0', boxSizing:'border-box',borderRadius:'15px',outline:'none',backgroundColor:'#333333'}}>Start</button>
                        <button id='buttons' class="w3-button w3-round w3-hover-red" disabled={!this.state.started} onClick={this.stopRecording} style={{width:'40%',margin:'8px 0', boxSizing:'border-box',borderRadius:'15px',outline:'none',backgroundColor:'#333333'}}>Stop</button>
                    </form>
                    </div>



                    <a class="w3-bar-item w3-button w3-hover-red" onClick={this.close}style={{boxShadow:'1px 0px 1px#333333'}}>Close Session</a>



                </div>

                {/*For main content of page, such as charts and audio wave bar that moves in response to one speaking*/}
                <div id="center" style={{width:'85%',float:'right',height:'100%'}}>
                    {/*Audio bar area*/}
                    <div class= 'inner' style={{width:'100%',display:'inline-block'}}>
                        <ReactMic
                            record={this.state.record}
                            className="sound-wave"
                            onStop={this.onStop}
                            strokeColor="#000000"
                            backgroundColor="#F3E6DE"
                        />
                    </div>

                    {/*Chart area*/}
                    <div id= 'chart' style={{left:'15%',width:'100%',height:'30em'}}>
                        <div class='chart' style={{width:'33%',display:'inline-block',height:'100%'}}>
                            <Chart db={this.db} sessionID={this.sessionID} type='pace'/>
                        </div>

                        <div class="chart"style={{width:'33%',display:'inline-block',height:'100%'}}>
                           <Chart db={this.db} sessionID={this.sessionID} type='volume'/>
                        </div>

                        <div class = 'chart' style={{width:'33%',display:'inline-block',height:'100%'}}>
                            <Chart db={this.db} sessionID={this.sessionID} type='clarity'/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
//Allows use of page
export default CreateSession;
