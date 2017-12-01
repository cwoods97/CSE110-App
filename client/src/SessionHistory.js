import React, { Component } from 'react';
import firebase from 'firebase';
import Users from './components/Users.js';
import DisplayUserData from './components/DisplayUserData.js';
import './styles/App.css';
import './styles/SessionHistory.css';

import Main from './Main';
import AppFront from './App';


import ReactDOM from 'react-dom';

import {getJoinedSessions, getPresentedSessions} from './RegisterFirebaseUser.js'
class App extends Component {

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

    componentDidMount() {}

    home = function(ev) {

        ev.preventDefault();
        ReactDOM.render(<Main />, document.getElementById('root'));


    }
    front = function(ev) {

        ev.preventDefault();
        ReactDOM.render(<AppFront />, document.getElementById('root'));


    }

    join = function(ev){

        ev.preventDefault();
		getJoinedSessions();
        document.getElementById('joined').style.display = 'inline'
        document.getElementById('created').style.display = 'none'
        document.getElementById("jb").classList.remove('w3-grey');
        document.getElementById("jb").classList.add('w3-dark-grey');

        document.getElementById("cb").classList.remove('w3-dark-grey');
        document.getElementById("cb").classList.add('w3-grey');
    }

    create = function(ev){

        ev.preventDefault();
		getPresentedSessions();
        document.getElementById('created').style.display = 'inline'
        document.getElementById('joined').style.display = 'none'

        document.getElementById("jb").classList.remove('w3-dark-grey');
        document.getElementById("jb").classList.add('w3-grey');
        document.getElementById("cb").classList.remove('w3-grey');
        document.getElementById("cb").classList.add('w3-dark-grey');

    }


    render() {
        return (

            <div >
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

                <div style={{height:'75px'}}>
                    <div style={{backgroundColor:'#2C4A52',height:"100%"}}>

                        <center>
                            <h1 style={{ fontFamily:'Poppins', marginLeft:'10px',marginTop:'0px',marginBottom:'1px',height:'35px', float:'left', color:'#E7E7E7'}}><b>SpeakEasy</b>


                            </h1>
                        </center>

                    </div>
                </div>

                <div id="sidebar" className="w3-sidebar w3-bar-block" style={{width:'20%',height:'100%',backgroundColor:'lightgrey',zIndex:'0',overflow:'hidden'}}>

                    <a href="#" class="w3-bar-item" style={{backgroundColor:'aqua'}}>Michael Harasti</a>
                    <a href="#" class="w3-bar-item w3-button" onClick={this.home}style={{backgroundColor:'lightgrey'}}>Home</a>
                    <a href="#" class="w3-bar-item w3-button" style={{backgroundColor:'lightgrey'}}>Profile Settings</a>
                    <a href="#" class="w3-bar-item w3-button" style={{backgroundColor:'lightgrey'}}>Session History</a>
                    <a href="#" class="w3-bar-item w3-button" onClick={this.front} style={{backgroundColor:'lightgrey'}}>Logout</a>
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


                <div style={{width:'80%',float:'right'}}>
                    <br></br>

                    <div id="buttons" style={{textAlign:'center'}}>
                    <button id="jb"onClick={this.join} class="w3-btn w3-dark-grey" style={{borderRadius:'10px'}}>
                        Joined Sessions
                    </button>
                    <button id="cb"onClick={this.create} class="w3-btn w3-grey" style={{borderRadius:'10px'}}>
                        Created Sessions
                    </button>
                    </div>

                </div>
                <div id="joined" >
                    <div class= 'sessions'>

                        <center>
                            <h4>
                                Speakeasy Customer Meeting Practice
                            </h4>
                            <h6>
                                Michael Harasti
                            </h6>

                        </center>

                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>

                    <div class='sessions'>

                        <center>
                            <h4>
                                How to Cook Food
                            </h4>
                            <h6>
                                Woojin Cheon
                            </h6>
                        </center>
                    </div>
                </div>

                <div id="created" style={{display:'none'}}>

                    <div class='sessions'>

                        <h6 style={{float:'left',marginLeft:'10px'}}>
                               No Audio

                        </h6>
                        <center>
                            <h4>
                                The Art of Giving Speeches
                            </h4>
                            <h6>
                                Isaac Kim
                            </h6>

                        </center>

                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>

                    <div class='sessions'>

                        <h6 style={{float:'left',marginLeft:'10px'}}>
                                Audio

                            </h6>
                        <center>
                            <h4>
                                Why you should use Tinder
                            </h4>
                            <h6>
                                Chris Bonilla
                            </h6>
                        </center>

                    </div>

                </div>



            </div>


        );
    }
}

export default App;
