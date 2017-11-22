import React, { Component } from 'react';
import firebase from 'firebase';
import Users from './components/Users.js';
import DisplayUserData from './components/DisplayUserData.js';
import './styles/App.css';

import Main from './Main';
import AppFront from './App';


import ReactDOM from 'react-dom';
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

    componentDidMount() {
        return fetch('/api/hello/hi')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    message: responseJson.message
                });
            })
    }

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
        document.getElementById('joined').style.display = 'inline'
        document.getElementById('created').style.display = 'none'
        document.getElementById("jb").classList.remove('w3-grey');
        document.getElementById("jb").classList.add('w3-dark-grey');

        document.getElementById("cb").classList.remove('w3-dark-grey');
        document.getElementById("cb").classList.add('w3-grey');
    }

    create = function(ev){

        ev.preventDefault();
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
                    <div style={{backgroundColor:'CornFlowerBlue',height:"100%"}}>

                        <center>
                            <h1 style={{marginLeft:'10px',marginTop:'0px',marginBottom:'1px',height:'35px',fontFamily:'cursive'}}><b>speakeasy</b>


                            </h1>
                        </center>

                    </div>
                </div>

                <div class="w3-sidebar w3-bar-block" style={{width:'20%',height:'100%',backgroundColor:'lightgrey',zIndex:'0',overflow:'hidden'}}>

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


                <div class="w3-bar w3-white">
                    <br></br>
                    <center>
                        <input style={{float:"right",width:"75%",marginRight:"30px"}}class="w3-input w3-light-blue" placeholder={"Search"}>

                        </input>

                    </center>
                    <br></br>
                    <br></br>
                    <br></br>


                    <div style={{float:"right", marginRight:"400px"}}>
                    <button id="jb"onClick={this.join} class="w3-btn w3-dark-grey">
                        Joined Sessions
                    </button>
                    <button id="cb"onClick={this.create} class="w3-btn w3-grey">
                        Created Sessions
                    </button>
                    </div>

                </div>
                <div id="joined">
                    <div style={{margin:'10px',backgroundColor:'lightgrey',float:'right',width:'75%',marginRight:'30px'}}>
                        <h6 style={{float:'right',marginRight:'10px'}}>
                            Delete

                        </h6>
                        <center>
                            <h4>
                                Speakeasy Customer Meeting Practice
                            </h4>
                            <h6>
                                Michael Harasti: 11/14/17 5 p.m.
                            </h6>

                        </center>

                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>

                    <div style={{margin:'10px',backgroundColor:'lightgrey',float:'right',width:'75%',marginRight:'30px'}}>
                        <h6 style={{float:'right',marginRight:'10px'}}>
                            Delete

                        </h6>
                        <center>
                            <h4>
                                How to Cook Food
                            </h4>
                            <h6>
                                Woojin Cheon: 11/15/17 5 p.m.
                            </h6>
                        </center>
                    </div>
                </div>

                <div id="created" style={{display:'none'}}>

                    <div style={{margin:'10px',backgroundColor:'lightgrey',float:'right',width:'75%',marginRight:'30px'}}>
                        <a>
                            <h6 style={{float:'right',marginRight:'10px'}}>
                            Delete

                            </h6>
                        </a>
                        <h6 style={{float:'left',marginLeft:'10px'}}>
                               No Audio

                        </h6>
                        <center>
                            <h4>
                                The Art of Giving Speeches
                            </h4>
                            <h6>
                                Isaac Kim: 11/16/17 4 p.m.
                            </h6>

                        </center>

                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>

                    <div style={{margin:'10px',backgroundColor:'lightgrey',float:'right',width:'75%',marginRight:'30px'}}>
                        <h6 style={{float:'right',marginRight:'10px'}}>
                            Delete

                        </h6>
                        <h6 style={{float:'left',marginLeft:'10px'}}>
                                Audio

                            </h6>
                        <center>
                            <h4>
                                Why you should use Tinder
                            </h4>
                            <h6>
                                Chris Bonilla: 11/17/17 1 p.m.
                            </h6>
                        </center>

                    </div>

                </div>



            </div>


        );
    }
}

export default App;
