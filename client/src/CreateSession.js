import React, { Component } from 'react';
import './styles/CreateSession.css';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';
import {Button} from 'react-bootstrap';
import {getDisplayName} from "./RegisterFirebaseUser";

import Chart from './components/Chart';
import Main from './Main';
import {updateTitle, endSession, toggleActive, setStartTime} from './FrontEndSession';
import {getIdToken} from './RegisterFirebaseUser';

import { ReactMic } from 'react-mic';

import logo from './Logo.png';


class CreateSession extends Component {

    constructor(props) {
        super(props);

        this.db = props.db;
        this.sessionID = props.sessionID;
        this.onStop = this.onStop.bind(this);
		this.updateTitle = this.updateTitle.bind(this);
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

    componentDidMount() {
        getDisplayName().then(name =>{this.setState({display: name});});
    }

    startRecording = () => {
				var currTime = Date.now() / 1000;
				var type = false;

        getIdToken().then(token => {
			toggleActive(token, this.state.coder);
		});
		this.setState({
            started: true,
            end: true
        });

        if (this.state.audio) {

            this.setState({
                record: true
            });

						type = true;
        }

        document.getElementById('nAudio').disabled = true;
        document.getElementById('audio').disabled = true;

				getIdToken().then(token => {
						setStartTime(token, this.sessionID, currTime, type);
				});
    };

    stopRecording = () => {
        getIdToken().then(token => {
			toggleActive(token, this.state.coder);
		});
		this.setState({
            record: false,
            started: false,
            end: true
        });

    };

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

    close = (ev) => {
        ev.preventDefault();
        this.setState({
            record: false,
            started: false,
            end: true
        });
		getIdToken().then(token => {
			endSession(token, this.state.coder);
		});

        ReactDOM.render(<Main db={this.db}/>, document.getElementById('root'));
    }

	updateTitle = (ev) => {

		ev.preventDefault();

		var title = document.getElementById("title").value;
		var session = this.sessionID;

		if(title.length > 0 && title.charAt(0) != ' ') {
				document.getElementById('titleError').innerHTML = "";
				getIdToken().then(token => {
						updateTitle(token, session, title).then((title) => {
							this.setState({title: title});
							document.getElementById('title').value = ""
						});
				});
		} else {
				document.getElementById('titleError').innerHTML = "Title must contain at least one character and cannot start with a space"
		}
	}

	noAudio = () => {

        if ((this.state.record == false && this.state.end == false)) {
            this.setState({
                audio: false
            });
            document.getElementById('audio').checked = false;
        }
     };

    audioOn = () => {

        if ( this.state.record == false && this.state.end == false) {
            this.setState({
                audio: true
            });
            document.getElementById('nAudio').checked = false;
        }
    };

    render() {

        return (

            <div style={{width:'100%',height:'100%',borderBottom:'4px solid #665084',zIndex:'9' }}>
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

                <div style={{backgroundColor:'#333333',height:"100%"}}>
                    <h2 style={{marginLeft:'8px',marginTop:'0px',marginBottom:'0px',height:'50px', color:'white'}}><b></b>
                        <img src={logo} width="125" height="50" />
                    </h2>
                </div>

                <div id='navMain' class="w3-sidebar w3-bar-block w3-responsive" style={{height:'100%',backgroundColor:'#585858',zIndex:'0', color:'#F3E6DE', boxShadow:'1px 1px 2px #f44336'}}>
                    <a class="w3-bar-item HoverRed" id="name" style={{fontSize:'20px', outline:'2px solid #333333'}}>{this.state.display}</a>
                    <a class="w3-bar-item w3-button w3-hover-red" onClick={this.close}style={{boxShadow:'1px 0px 1px#333333'}}>Close Session</a><br /><br />
                    <p id= 'titleDisplay' style={{fontFamily:'Poppins, sans-serif'}}><b>Session Title:</b> {this.state.title}</p>

                    <input id="title" style={{color:'black'}}class="w3-input" type="input" name="editTitle" placeholder={"Edit Title"}></input>
                    <p id="titleError"></p>

                    <button class="w3-button w3-round w3-hover-red" onClick={this.updateTitle} style={{width:'40%',margin:'8px 0', boxSizing:'border-box',borderRadius:'15px',outline:'none',backgroundColor:'#333333'}}>Change</button>

                    <br></br>
                    <br></br>
                    <br />
                    <br />
                    <br />
                    <p id='code' style={{fontFamily:'Poppins, sans-serif'}}><b>Session Code:</b> {this.state.coder}</p>

                    <form action="">
                        <input id='nAudio' onClick={this.noAudio} type="radio" name="audioOff" value="noaudio" defaultChecked={true} style={{fontFamily:'Poppins, sans-serif'}}></input>No Audio<br></br>
                        <input id= 'audio' onClick={this.audioOn} type="radio" name="audioOn" value="record" style={{fontFamily:'Poppins, sans-serif'}}></input>Record<br></br>

                        <br></br>

                        <button id='buttons' class="w3-button w3-round w3-hover-red" disabled={this.state.end} onClick={this.startRecording} style={{width:'40%',margin:'8px 0', boxSizing:'border-box',borderRadius:'15px',outline:'none',backgroundColor:'#333333'}}>Start</button>
                        <button id='buttons' class="w3-button w3-round w3-hover-red" disabled={!this.state.started} onClick={this.stopRecording} style={{width:'40%',margin:'8px 0', boxSizing:'border-box',borderRadius:'15px',outline:'none',backgroundColor:'#333333'}}>Stop</button>
                    </form>

                </div>

                <div id="center" style={{width:'85%',float:'right',height:'100%'}}>
                    <div class= 'inner' style={{width:'100%',display:'inline-block'}}>
                        <ReactMic
                            record={this.state.record}
                            className="sound-wave"
                            onStop={this.onStop}
                            strokeColor="#000000"
                            backgroundColor="#F3E6DE"
                        />
                    </div>

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

export default CreateSession;
