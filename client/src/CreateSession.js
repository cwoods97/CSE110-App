import React, { Component } from 'react';
import firebase from 'firebase';
import Users from './components/Users.js';
import DisplayUserData from './components/DisplayUserData.js';
import './styles/App.css';
import ReactDOM from 'react-dom';

import Main from './Main';

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
        if (firebase.apps.length == 0){
            firebase.initializeApp(config);
        }
        else{
            firebase.app()
        }
        this.state = {
            message: "",
            record: false,
            blobObject: null
        }
    }

    componentDidMount() {
        return fetch('/api/hello')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    message: responseJson.message
                });
            })
    }

    startRecording = () => {
        this.setState({
            record: true
        });
    }

    stopRecording = () => {
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

    render() {
        return (

            <div style={{width:'100%',height:'100%'}}>
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

                <div style={{height:'75px'}}>
                    <div style={{backgroundColor:'CornFlowerBlue',height:"100%"}}>

                        <center>
                            <h1 style={{marginLeft:'10px',marginTop:'0px',marginBottom:'1px',height:'35px',fontFamily:'cursive'}}><b>speakeasy</b>


                            </h1>
                        </center>

                    </div>
                </div>

                <div class="w3-sidebar w3-bar-block" style={{height:'100%',backgroundColor:'lightgrey',zIndex:'0',overflow:'hidden'}}>

                    <a href="#" class="w3-bar-item w3-button" style={{backgroundColor:'lightgrey'}}>Profile:</a>
                    <a href="#" class="w3-bar-item w3-button" style={{backgroundColor:'lightgrey'}}>Share</a>
                    <a href="#" class="w3-bar-item w3-button" onClick={this.close} style={{backgroundColor:'lightgrey'}}>Close Session</a>
                    <br></br>
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

                <div>

                    <center>
                    <ReactMic
                        record={this.state.record}
                        className="sound-wave"
                        onStop={this.onStop}
                        strokeColor="#000000"
                        backgroundColor="#66ccff" />
                    <button onClick={this.startRecording} type="button">Start</button>
                    <button onClick={this.stopRecording} type="button">Stop</button>
                    </center>


                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>

                    <center>
                        <audio ref="audioSource" controls="controls" src={this.state.blobURL}></audio>

                    </center>

                </div>


                <div class="w3-col" style={{float:'right',width:'20%',height:'100%',backgroundColor:'lightblue'}}>


                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>

                    <form action="">
                        <input type="radio" name="type" value="noaudio" checked></input>No Audio<br></br>
                        <input type="radio" name="type" value="record"></input>Record<br></br>
                        <input type="radio" name="type" value="livestreaming"></input>Livestreaming<br></br>
                        <br></br>
                        <input type="submit" value="Start"></input>
                    </form>

                    <br></br>
                    <br></br>
                    <br></br>



                </div>

            </div>
        );
    }
}

export default CreateSession;
