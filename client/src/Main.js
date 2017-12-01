import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './styles/App.css';

import Join from './Join';
import AppFront from './App';
import CreateSession from './CreateSession';
import SessionHistory from './SessionHistory';
import {createBackendSession, joinBackendSession} from './FrontEndSession';
import {getIdToken, getDisplayName, logout} from './RegisterFirebaseUser.js';

class App extends Component {

    constructor(props) {
        super(props);

        this.db = props.db;
        this.root = document.getElementById('root');
        this.join = this.join.bind(this);
        this.create = this.create.bind(this);

        this.state = {
            coder: 0,
            message: ""
        }
    }

    componentDidMount() {
				getDisplayName().then(name => {this.setState({displayName: name});});
		}

    front = function(ev) {

		logout();

        ev.preventDefault();
        ReactDOM.render(<AppFront />, document.getElementById('root'));
    };

    join= function(ev){

        ev.preventDefault();

        var coder = document.getElementById("code").value;

        //Integer only regular expression from https://stackoverflow.com/questions/9011524/javascript-regexp-number-only-check
        var reg = /^\d+$/;

        if (reg.test(coder)) {

			getIdToken().then(token => {
				joinBackendSession(token, coder).then((session) => {
						ev.preventDefault();
				ReactDOM.render(<Join code={coder} session={session.id} db={this.db}/>, document.getElementById('root'));
					}, (error) => {
							document.getElementById("error").innerHTML = error;
					});
			});
		} else {
            document.getElementById("error").innerHTML = "Please enter a valid session code"
        }
    };

    create= function(ev) {

        ev.preventDefault();

		getIdToken().then(token => {
			createBackendSession(token).then((response) => {

				this.setState({
                    coder: response.accessCode
                });

                ReactDOM.render(<CreateSession code={this.state.coder} db={this.db} sessionID={response.sessionID} />, document.getElementById('root'));
			});
		});

    };

    history = function(ev){
        ReactDOM.render(<SessionHistory db={this.db} />, this.root);
    };

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

                    <a href="#" class="w3-bar-item" style={{backgroundColor:'aqua'}}>{this.state.displayName}</a>
                    <a href="#" class="w3-bar-item w3-button" style={{backgroundColor:'lightgrey'}}>Profile Settings</a>
                    <a href="#" class="w3-bar-item w3-button" onClick={this.history.bind(this)}style={{backgroundColor:'lightgrey'}}>Session History</a>
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




                <div style={{overflow:'hidden'}}>


                    <div style={{float:'left',width:"30%", marginLeft:'310px',marginTop:'100px'}}>
                        <p style={{width:'', overflow:'hidden'}}>Are you about to give a speech? If you answered yes then click "Create a Session" in which audience members can join and give feedback to your speech</p>

                    </div>

                    <div style={{width:'30%',marginRight:'70px',marginTop:'100px',float:'right'}}>
                        <p style={{width:'',overflow:'hidden'}}>Are you an audience member of a speech? If you answered yes then click "Join Session" in which you will be able to provide feedback to whoevers speech you are listening to</p>

                    </div>
                </div>

                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>


                <div style = {{backgroundColor:'blue'}}>
                    <div class='w3-round' style={{width:'30%', float:'left', marginLeft:'300px',marginTop:'89px'}}>

                        <center>

                       <button class="w3-btn w3-large w3-round" onClick={this.create.bind(this)} style={{backgroundColor:'steelblue'}}>Create a Session</button>

                        </center>
                    </div>
                    <div class='w3-round' style={{width:'30%',float:'right',marginRight:'100px',marginTop:'0px'}}>
                        <center>

                            <h6><b>Enter Session Code:</b></h6>
                            <p id = "error"></p>

                        <input id="code"></input>
                        <br></br>
                        <br></br>
                        <button class="w3-btn w3-large w3-round" onClick={this.join} style={{backgroundColor:'powderblue'}}>Join a Session</button>
                        </center>
                    </div>


                </div>


            </div>

        );
    }
}

export default App;
