import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './styles/App.css';
import './styles/Main.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import Join from './Join';
import AppFront from './App';
import CreateSession from './CreateSession';
import SessionHistory from './SessionHistory';
import {createBackendSession, joinBackendSession} from './FrontEndSession';
import {getIdToken, getDisplayName, logout, setPassword, setDisplayName} from './RegisterFirebaseUser.js';

class App extends Component {

    constructor(props) {
        super(props);

        this.db = props.db;
        this.root = document.getElementById('root');

        this.state = {
            currentUser: this.db.auth().currentUser
        }

    }

    front = function(ev) {
		logout();
        ReactDOM.render(<AppFront />, document.getElementById('root'));
    };

    join = function(ev) {
        var accessCode = document.getElementById("code").value;

        // Integer only regular expression from https://stackoverflow.com/questions/9011524/javascript-regexp-number-only-check
        var reg = /^\d+$/;

        if (reg.test(accessCode)) {
			getIdToken().then(token => {
				joinBackendSession(token, accessCode)
                .then((session) => {
		            ReactDOM.render(<Join code={accessCode} session={session.id} db={this.db}/>, document.getElementById('root'));
				}).catch((error) => {
					document.getElementById("error").innerHTML = error;
				});
			});
		} else {
            document.getElementById("error").innerHTML = "Please enter a valid session code.";
        }
    };

    create = function(ev) {

		getIdToken().then(token => {
			createBackendSession(token).then((response) => {
                ReactDOM.render(<CreateSession code={response.accessCode} db={this.db} sessionID={response.sessionID} />, document.getElementById('root'));
			});
		});

    };

    history = function(ev){
        ReactDOM.render(<SessionHistory db={this.db} />, this.root);
    };

    settings = function(ev) {
        ev.preventDefault();

        var modal = document.getElementById('popup');
				modal.style.display = "block";

        var span = document.getElementById('close');

        span.onclick = function(ev) {
            ev.preventDefault();
            modal.style.display = "none";
						document.getElementById('displayForm').reset();
						document.getElementById('passwordForm').reset();
						document.getElementById('displayError').innerHTML = "";
						document.getElementById('passwordError').innerHTML = "";
        }

        window.onclick = function(ev) {
            ev.preventDefault();
            if(ev.target == modal) {
                modal.style.display = "none";
								document.getElementById('displayForm').reset();
								document.getElementById('passwordForm').reset();
								document.getElementById('displayError').innerHTML = "";
								document.getElementById('passwordError').innerHTML = "";
            }
        }
    };

		updateDisplayName = function(ev) {
				ev.preventDefault();

				const name = document.getElementById('newDisplay').value;
				const error = document.getElementById('displayError');
				const form = document.getElementById('displayForm');
				var validation = [Boolean(name) && !name.includes(' ')];

				if(validation.every(Boolean)) {
						error.innerHTML = "";
						form.reset();
						setDisplayName(name).then((success) => {
								if(success){
										error.innerHTML = "Display Name Updated";
										this.setState({display: name});
								}
						}).catch((err) => {
								error.innerHTML = err;
						});
				} else {
						error.innerHTML = "Please enter a valid display name (Spaces not allowed)";
				}
		};

		updatePassword = function(ev) {
				ev.preventDefault();

				const oldpswd = document.getElementById('oldPwd').value;
				const pswd1 = document.getElementById('newPassword').value;
				const pswd2 = document.getElementById('confirm').value;
				const error = document.getElementById('passwordError');
				const form = document.getElementById('passwordForm');

				var validations = [
						Boolean(pswd1) && !pswd1.includes(' ') && pswd1.length >= 6,
						pswd1 == pswd2,
						oldpswd != pswd1
				]

				if(validations.every(Boolean)) {
						error.innerHTML = "";
						form.reset();
						setPassword(oldpswd, pswd1).then((success) => {
								error.innerHTML = success;
						}).catch((err) => {
								error.innerHTML = err;
						});
				} else {
						if(!validations[0]) {
								error.innerHTML = "Please enter a valid password (Spaces not allowed; must be at least 6 characters)";
						} else if(!validations[1]){
								error.innerHTML = "Passwords do not match";
						} else {
								error.innerHTML = "New password cannot be old password";
						}
				}
		};

    render() {
        return (

            <div style={{width:'100%',height:'100%',display:'inline-block',outline:'1px solid red'}}>
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>
                <div style={{backgroundColor:'#c4a5ff',height:"100%"}}>

                    <h2 style={{marginLeft:'10px',marginTop:'0px',marginBottom:'5px',height:'35px',fontFamily:'cursive',cursor:'pointer'}}><b>speakeasy</b>

                    </h2>
                </div>


                <div id='navMain' class="w3-sidebar w3-bar-block w3-responsive" style={{height:'100%',backgroundColor:'lightgrey',zIndex:'0'}}>

                    <a class="w3-bar-item" id="name" style={{backgroundColor:'aqua'}}>{this.state.currentUser.displayName}</a>
                    <a class="w3-bar-item w3-button" id='profile' onClick={this.settings} style={{backgroundColor:'lightgrey'}}>Profile Settings</a>
                    <a class="w3-bar-item w3-button" onClick={this.history.bind(this)} style={{backgroundColor:'lightgrey'}}>Session History</a>
                    <a class="w3-bar-item w3-button" onClick={this.front} style={{backgroundColor:'lightgrey'}}>Logout</a>

                </div>

                <div id='popup' class="modal" style={{display:'none', position:'fixed', zIndex:'1', left:'0', top:'0', width:'100%', height:'100%', overflow:'auto'}}>
                    <div class="modal-content" style={{margin:'15% auto', padding:'20px', border:'1px solid #888', width:'45%'}}>
                        <span id="close" style={{float:'right', fontSize:'28px', fontWeight:'bold',cursor:'pointer'}}>&times;</span>
                        <br></br>
                        <h2 style={{textAlign:'center'}}><b>Profile Settings</b></h2>
                        <div>
                            <form id="displayForm">
                                <h6><b>Update your display name</b></h6>
                                <p id="displayError"></p>
                                <input id='newDisplay' placeholder={"Enter new display name"}></input>
                                <p></p>
                                <input style={{backgroundColor:'#665084',color:'white'}} class="w3-btn w3-round" type="submit" value="Submit" onClick={this.updateDisplayName.bind(this)}></input>
                            </form>
                        </div>
                        <div>
                            <form id="passwordForm">
                                <h6><b>Update your password</b></h6>
                                <input type="password" id='oldPwd' placeholder={"Enter curent password"}></input>
                                <p id="passwordError"></p>
                                <input type="password" id='newPassword' placeholder={"Enter new password"}></input>
                                <p></p>
                                <input type="password" id='confirm' placeholder={"Re-enter new password"}></input>
                                <p></p>
                                <input style={{backgroundColor:'#665084',color:'white'}} class="w3-btn w3-round" type="submit" value="Submit" onClick={this.updatePassword}></input>
                            </form>
                        </div>
                    </div>
                </div>

                <div id='content' class='w3-responsive' style={{display:'inline-block',float:'right',width:'85%',maxHeight:'700px', position:'fixed',left:'15%'}}>


                    {/*<div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>*/}
                    {/*This will hold the the content for creating a session*/}
                    <div class='w3-responsive' style={{display:'inline-block', float:'left', width:'50%',height:'100%',margin:'auto'}}>
                        <div style={{height:'50%',textAlign:'center'}}>
                        <div class='w3-responsive' style={{margin:'25% 10% 20%', width:'80%', overflow:'hidden',textAlign:'center'}}>
                            <p>Are you about to give a speech? If you answered yes then click "Create a Session" in which audience members can join and give feedback to your speech</p>
                        </div>
                        </div>
                        <div style={{height:'50%',textAlign:'center'}}>
                        <div class='w3-responsive' style={{margin:'20% 10% 50%', display:'flex',justifyContent:'center'}}>
                            <button class="w3-btn w3-large w3-round" onClick={this.create.bind(this)} style={{backgroundColor:'#665084'}}>Create a Session</button>
                        </div>
                        </div>
                    </div>

                    {/*This will hold the the content for joining a session*/}
                    <div class='w3-responsive' style={{display:'inline-block', float:'right', width:'50%', height:'100%', margin:'auto'}}>
                        <div style={{height:'50%',textAlign:'center'}}>
                        <div class='w3-responsive' style={{margin:'25% 10% 20%', width:'80%', overflow:'hidden',textAlign:'center'}}>
                            <p>Are you an audience member of a speech? If you answered yes then click "Join Session" in which you will be able to provide feedback to whoevers speech you are listening to</p>
                        </div>
                        </div>
                        <div style={{height:'50%',textAlign:'center'}}>
                        <div class='w3-responsive' style={{margin:'20% 10% 50%',textAlign:'center'}}>
                            <h6><b>Enter Session Code:</b></h6>
                            <p id = "error"></p>

                            <input id="code"></input>
                            <br></br>
                            <br></br>
                            <button class="w3-btn w3-large w3-round" onClick={this.join.bind(this)} style={{backgroundColor:'#6164a3'}}>Join a Session</button>
                        </div>
                        </div>
                    </div>
                </div>



            </div>

        );
    }
}

export default App;
