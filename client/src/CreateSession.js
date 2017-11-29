import React, { Component } from 'react';
import './styles/CreateSession.css';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';
import {Button} from 'react-bootstrap';
import {getDisplayName} from "./RegisterFirebaseUser";

import Chart from './Chart';
import Main from './Main';
import {updateTitle} from './FrontEndSession';
import {getIdToken} from './RegisterFirebaseUser';

import { ReactMic } from 'react-mic';


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
            coder: props.code
        };
    }

    componentDidMount() {
        getDisplayName().then(name =>{this.setState({display: name});});
    }

    startRecording = () => {

        this.setState({
            started: true,
            end: true
        });

        if (this.state.audio) {

            this.setState({
                record: true
            });
        }

        //Timer should start here regardless if audio recording is on

    };

    stopRecording = () => {
        this.setState({
            record: false,
            started: false,
            end: true
        });
    };

    onStop = (blobObject) => {
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

        ReactDOM.render(<Main />, document.getElementById('root'));
    }

	updateTitle = (ev) => {
		ev.preventDefault();

		var title = document.getElementById("title").value;
		var session = this.sessionID;

		getIdToken().then(token => {
			updateTitle(token, session, title).then((title) => {
				alert("title set to " + title);
			});
		});
	}

	noAudio = () => {
        this.setState({
            audio: false
        });
        document.getElementById('audio').checked = false;
    }

    audioOn = () => {
        this.setState({
            audio: true
        });

        document.getElementById('nAudio').checked = false;
    }

    render() {

        return (

            <div style={{width:'100%',height:'100%',borderBottom:'4px solid #665084',zIndex:'9' }}>
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

                <div style={{height:'45px'}}>
                    <div style={{backgroundColor:'#c4a5ff',height:"100%"}}>


                        <h2 style={{marginLeft:'10px',marginTop:'0px',marginBottom:'1px',height:'35px',fontFamily:'cursive'}}><b>speakeasy</b>


                        </h2>


                    </div>
                </div>

                <div id="navigation" class="w3-sidebar w3-bar-block" style={{borderRight:'1px solid #665084', height:'100%',backgroundColor:'lightgrey',zIndex:'-1',overflow:'hidden'}}>

                    <a id='display' class="w3-bar-item menuLeft" style={{backgroundColor:'PaleVioletRed',fontFamily:'Poppins, sans-serif'}}><b>{this.state.display}</b></a>
                    <a class="w3-bar-item w3-button menuLeft" style={{backgroundColor:'lightgrey',fontFamily:'Poppins, sans-serif'}}><b>Share</b></a>
                    <a class="w3-bar-item w3-button menuLeft" onClick={this.close} style={{backgroundColor:'lightgrey',fontFamily:'Poppins, sans-serif'}}><b>Close Session</b></a>


                </div>

                <div id="center" style={{width:'85%',float:'right',marginTop:'4px',height:'100%'}}>
                    <div class= 'inner' style={{width:'85%',display:'inline-block'}}>


                        <ReactMic
                            record={this.state.record}
                            className="sound-wave"
                            onStop={this.onStop}
                            strokeColor="#000000"
                            backgroundColor="Plum"

                        />


                    </div>

                    <div id = 'right' class="w3-col" style={{borderLeft:'1px solid #665084',float:'right',width:'15%',height:'60em',backgroundColor:'#c4a5ff',display:'inline-block',position:'fixed'}}>

                        <br></br>
                        <p style={{fontFamily:'Poppins, sans-serif'}}>Session Title:</p>

                        <form action="">
                            <input id="title" class="w3-input" type="input" name="editTitle" placeholder={"Edit Title"}></input>

                            <br></br>
                            <Button onClick={this.updateTitle}>Change</Button>
                        </form>

                        <br></br>

                        <p id='code' style={{fontFamily:'Poppins, sans-serif'}}>Session Code: {this.state.coder}</p>

                        <form action="">
                            <input id='nAudio' onClick={this.noAudio} type="radio" name="audioOff" value="noaudio" defaultChecked={true} style={{fontFamily:'Poppins, sans-serif'}}></input>No Audio<br></br>
                            <input id= 'audio' onClick={this.audioOn} type="radio" name="audioOn" value="record" style={{fontFamily:'Poppins, sans-serif'}}></input>Record<br></br>

                            <br></br>

                            <Button id='buttons' disabled={this.state.end} onClick={this.startRecording} style={{margin:'1px',fontFamily:'Poppins, sans-serif'}} type="button">Start</Button>
                            <Button id='buttons' disabled={!this.state.started} onClick={this.stopRecording} style={{margin:'1px',fontFamily:'Poppins, sans-serif'}} type="button">Stop</Button>
                        </form>

                        <br></br>
                        <br></br>
                        <br></br>



                    </div>

                    <div id= 'chart' style={{width:'85%',height:'30em'}}>
                    <div class='chart' style={{width:'33%',display:'inline-block',height:'100%'}}>

                        <Chart/>

                    </div>
                    <div class="chart"style={{width:'33%',display:'inline-block',height:'100%'}}>
                       <Chart/>

                    </div>
                    <div class = 'chart' style={{width:'33%',display:'inline-block',height:'100%'}}>

                        <Chart/>
                    </div>
                    </div>




                </div>



            </div>
        );
    }
}

export default CreateSession;
