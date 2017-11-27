import React, { Component } from 'react';
import firebase from 'firebase';
import './styles/CreateSession.css';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';
import {Button} from 'react-bootstrap';


import Chart from './Chart';
import Main from './Main';
import {updateTitle} from './FrontEndSession';
import {getIdToken} from './RegisterFirebaseUser';

import { ReactMic } from 'react-mic';


class CreateSession extends Component {

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
            audio: false,
            message: "",
            record: false,
            started: false,
            blobObject: null
        }
    }

    componentDidMount() {}

    startRecording = () => {

        this.setState({
            started: true
        });

        if (this.state.audio) {

            this.setState({
                record: true
            });
        }

        //Timer should start here regardless if audio recording is on


    }

    stopRecording = () => {

        this.setState({
            started: false
        });

        this.setState({
            record: false
        });
    }

    onStop= (blobObject) => {
        this.setState({
            blobURL : blobObject.blobURL
        });
    }

    close = function(ev){

        ev.preventDefault();

        ReactDOM.render(<Main />, document.getElementById('root'));

    }

		updateTitle = function(){

				var title = document.getElementById("title").value;
				var accessCode = document.getElementById("accessCode").value;

				getIdToken().then(token => {
						updateTitle(token, accessCode, title).then((title) => {
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

    audioOn = () =>{
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

                <div id="navigation" class="w3-sidebar w3-bar-block" style={{height:'100%',backgroundColor:'lightgrey',zIndex:'-1',overflow:'hidden'}}>

                    <a class="w3-bar-item w3-button menuLeft" style={{backgroundColor:'PaleVioletRed'}}>Display Name</a>
                    <a class="w3-bar-item w3-button menuLeft" style={{backgroundColor:'lightgrey'}}>Share</a>
                    <a class="w3-bar-item w3-button menuLeft" onClick={this.close} style={{backgroundColor:'lightgrey'}}>Close Session</a>


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

                    <div id = 'right' class="w3-col" style={{float:'right',width:'15%',height:'60em',backgroundColor:'#c4a5ff',display:'inline-block',position:'fixed'}}>

                        <br></br>
                        <br></br>

                        <form action="">
                            <input id='nAudio' onClick={this.noAudio} type="radio" name="audioOff" value="noaudio" defaultChecked={true}></input>No Audio<br></br>
                            <input id= 'audio' onClick={this.audioOn} type="radio" name="audioOn" value="record"></input>Record<br></br>

                            <br></br>

                            <Button id='buttons' bsStyle="Start" onClick={this.startRecording} style={{margin:'1px'}} type="button">Start</Button>
                            <Button id='buttons' disabled={!this.state.started} bsStyle="Start" onClick={this.stopRecording} style={{margin:'1px'}} type="button">Stop</Button>
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
