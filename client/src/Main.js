//Necessary imports
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './styles/Main.css';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import Join from './Join';
import AppFront from './App';
import CreateSession from './CreateSession';
import SessionHistory from './SessionHistory';
import {createBackendSession, joinBackendSession} from './FrontEndSession';
import {getIdToken, logout, setPassword, setDisplayName} from './RegisterFirebaseUser.js';
import logo from './Logo.png';

//For the main page
class App extends Component {

    //Constructor for the main page
    constructor(props) {
        super(props);

        this.db = props.db;
        this.root = document.getElementById('root');
        this.join = this.join.bind(this);

        this.state = {
            currentUser: this.db.auth().currentUser.displayName
        }

    }

    //sets display name when user is logged in after creating an account
    componentWillReceiveProps(nextProps) {
        if(nextProps.name) this.setState({currentUser: nextProps.name});
    }

    //Logs one out and brings them to the front/login page
    front = function(ev) {
        logout();
        ReactDOM.render(<AppFront />, document.getElementById('root'));
    };

    //Lets one join a session if they entered a valid session code
    join = function(ev) {
        var accessCode = document.getElementById("code").value;

        // Integer only regular expression from https://stackoverflow.com/questions/9011524/javascript-regexp-number-only-check
        var reg = /^\d+$/;

        //Validity checks
        if (reg.test(accessCode)) {
            getIdToken().then(token => {
                joinBackendSession(token, accessCode)
                    .then((session) => {
                        ReactDOM.render(<Join code={accessCode} session={session.id} db={this.db}/>, document.getElementById('root'));
                    }).catch((error) => {
                    document.getElementById("error").innerHTML = error;
                });
            });
            //Error message
        } else {
            document.getElementById("error").innerHTML = "Please enter a valid session code.";
        }
    };


    //Allows one to Create session when they click the 'Create a Session' button
    create= function(ev) {

        ev.preventDefault();

        //Creates a session and brings one to the Create Session page
        getIdToken().then(token => {
            createBackendSession(token).then((response) => {
                ReactDOM.render(<CreateSession code={response.accessCode} db={this.db} sessionID={response.sessionID} />, document.getElementById('root'));
            });
        });

    };

    //Brings one to the session history page
    history = function(ev){
        ReactDOM.render(<SessionHistory db={this.db} />, this.root);
    };

    //Used for the Edit account settings portion of the side menu
    settings = function(ev) {
        ev.preventDefault();

        //The relevant html for this
        var modal = document.getElementById('popup');
        modal.style.display = "block";

        var span = document.getElementById('close');

        //Defines the onclick events
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
            if(ev.target === modal) {
                modal.style.display = "none";
                document.getElementById('displayForm').reset();
                document.getElementById('passwordForm').reset();
                document.getElementById('displayError').innerHTML = "";
                document.getElementById('passwordError').innerHTML = "";
            }
        }
    };

    //Used for the updating of ones display name
    updateDisplayName = function(ev) {
        ev.preventDefault();

        //Accessing relevant html elements
        const name = document.getElementById('newDisplay').value;
        const error = document.getElementById('displayError');
        const form = document.getElementById('displayForm');
        var validations = [Boolean(name) && !name.includes(' '),
            name.length <= 16];

        //Validation for this update
        if(validations.every(Boolean)) {
            error.innerHTML = "";
            form.reset();
            setDisplayName(name).then((success) => {
                if(success){
                    error.innerHTML = "Display Name Updated";
                    this.setState({currentUser: name});
                }
            }).catch((err) => {
                error.innerHTML = err;
            });
            //Error message
        } else {
            if(!validations[0]){
                error.innerHTML = "Please enter a valid display name (Spaces not allowed)";
            } else {
                error.innerHTML = "Display name can be no more than 16 characters";
            }
        }
    };

    //For the updating of ones password
    updatePassword = function(ev) {
        ev.preventDefault();

        //Accesses relevant html elements
        const oldpswd = document.getElementById('oldPwd').value;
        const pswd1 = document.getElementById('newPassword').value;
        const pswd2 = document.getElementById('confirm').value;
        const error = document.getElementById('passwordError');
        const form = document.getElementById('passwordForm');

        //Validation checks
        var validations = [
            Boolean(pswd1) && !pswd1.includes(' ') && pswd1.length >= 6,
            pswd1 === pswd2,
            oldpswd !== pswd1
        ]

        if(validations.every(Boolean)) {
            error.innerHTML = "";
            form.reset();
            setPassword(oldpswd, pswd1).then((success) => {
                error.innerHTML = success;
            }).catch((err) => {
                error.innerHTML = "Please enter your current password to change your password.";
            });
            //Error messages
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

    //Html code goes here
    render() {
        return (

            <div style={{width:'100%',height:'100%',display:'inline-block'}}>
                {/*Necessary styling from online*/}
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>
                {/*For top bar and logo*/}
                <div style={{backgroundColor:'#333333',height:"100%"}}>
                    <h2 style={{marginLeft:'8px',marginTop:'0px',marginBottom:'0px',height:'50px', color:'white'}}><b></b>
                        <img src={logo} width="125" height="50" alt="SpeakEasy logo"/>
                    </h2>
                </div>


                {/*For the side menu and its buttons*/}
                <div id='navMain' class="w3-sidebar w3-bar-block w3-responsive" style={{height:'100%',backgroundColor:'#585858',zIndex:'0', color:'#F3E6DE', boxShadow:'1px 1px 2px #525252'}}>

                    <a class="w3-bar-item HoverRed" id="name" style={{fontSize:'20px', outline:'2px solid #333333'}}>{this.state.currentUser}</a>
                    <a class="w3-bar-item w3-button w3-hover-red" id='profile' onClick={this.settings} style={{boxShadow:'1px 0px 1px #333333'}}>Profile Settings</a>
                    <a class="w3-bar-item w3-button w3-hover-red" onClick={this.history.bind(this)}style={{boxShadow:'1px 0px 1px#333333'}}>Session History</a>
                    <a class="w3-bar-item w3-button w3-hover-red" onClick={this.front}style={{boxShadow:'1px 0px 1px#333333'}}>Logout</a>

                </div>


                {/*For the Edit Account Settings popup*/}
                <div id='popup' class="modal" style={{display:'none', position:'fixed', zIndex:'1', left:'0', top:'0', width:'100%', height:'100%', overflow:'auto'}}>
                    <div class="modal-content" style={{margin:'15% auto', padding:'0px 20px 20px 20px ', border:'1px solid #888', width:'45%',backgroundColor:'#333333'}}>
                        <div style={{margin:'2%'}}>
                            <span id="close" style={{float:'right', fontSize:'28px', fontWeight:'bold',cursor:'pointer',color:'white'}}>&times;</span>
                            <br></br>
                            <h2 style={{textAlign:'center',color:'#ffffff'}}><b style={{borderBottom: '2px solid #ffffff'}}>Profile Settings</b></h2>
                            <div style={{display:'flex', justifyContent:'space-between'}}>

                                {/*For the display name changes*/}
                                <div style={{background:'transparent',textAlign:'center',float:'left',width:'47%', borderRadius:'10px'}}>
                                    <form id="displayForm" style={{margin:'5%'}}>
                                        <h6><b style={{color:'#f3e6de'}}>Update your display name</b></h6>
                                        <p id="displayError" style={{color:'white'}}></p>
                                        <input type="text" id='newDisplay' class='w3-input' placeholder={"Enter new display name"}></input>
                                        <p></p>
                                        <input style={{backgroundColor:'#585858',color:'white'}} class="w3-button w3-round w3-hover-red" type="submit" value="Submit" onClick={this.updateDisplayName.bind(this)}></input>
                                    </form>
                                </div>
                                {/*For the password changes*/}
                                <div style={{backgroundColor:'#FFFFFFF',textAlign:'center',float:'left',overflow:'hidden',width:'47%', borderRadius:'10px'}}>
                                    <form id="passwordForm" style={{margin:'5%'}}>
                                        <h6><b style={{color:'#f3e6de'}}>Update your password</b></h6>
                                        <input type="password" id='oldPwd' class='w3-input' placeholder={"Enter current password"} style={{width:'80%'}}></input>
                                        <p id="passwordError" style={{color:'white'}}></p>
                                        <input type="password" id='newPassword' class='w3-input' placeholder={"Enter new password"} style={{width:'80%'}}></input>
                                        <p></p>
                                        <input type="password" id='confirm' class='w3-input' placeholder={"Re-enter new password"} style={{width:'80%'}}></input>
                                        <p></p>
                                        <input style={{backgroundColor:'#585858',color:'white' }} class="w3-button w3-round w3-hover-red" type="submit" value="Submit" onClick={this.updatePassword}></input>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/*For the main content of the page such as the Join and Create a Session buttons and descriptions of what clicking each will do*/}
                <div id='contentMain' class='w3-responsive' style={{display:'inline-block',float:'right',width:'85%',maxHeight:'90vh', position:'fixed',left:'15%'}}>


                    {/*This will hold the the content for creating a session*/}
                    <div class='w3-responsive' style={{display:'inline-block', float:'left', width:'50%',height:'100%',margin:'auto'}}>
                        <div style={{textAlign:'center'}}>
                            {/*Description of section*/}
                            <div class='w3-responsive' style={{margin:'10% 10% 30%', width:'80%', overflow:'hidden',textAlign:'center'}}>
                                <p><b style={{fontSize:'22px', borderBottom: '2px solid #000000' }}>About to give a speech?</b></p>
                                <p><b /> Click "Create a Session" so that audience members can join and give feedback to your speech.
                                    Save your speeches in order to listen and review speeches you have given, as well as improve on future speeches!</p>
                            </div>
                        </div>
                        <div style={{height:'15em',textAlign:'center'}}>
                            <div class='w3-responsive' style={{height:'100%'}}>

                                <button class="w3-button w3-large w3-round w3-hover-red" onClick={this.create.bind(this)} style={{marginTop:'110px',backgroundColor:'#525252', color:'white'}}>Create a Session</button>
                            </div>
                        </div>
                    </div>

                    {/*This will hold the the content for joining a session*/}
                    <div class='w3-responsive' style={{display:'inline-block', float:'right', width:'50%', height:'100%', margin:'auto'}}>
                        <div style={{textAlign:'center'}}>
                            {/*Description of section*/}
                            <div class='w3-responsive' style={{margin:'10% 10% 30%', width:'80%', overflow:'hidden',textAlign:'center'}}>
                                <p><b style={{fontSize:'22px', borderBottom: '2px solid #000000'}}> Are you an audience member?</b></p>
                                <p><b />Click "Join Session" in which you will be able to provide feedback to speakers.
                                    Give feedback to speakers in order to help them improve and let them know what they can do better!</p>
                            </div>
                        </div>
                        <div style={{height: '15em',textAlign:'center'}}>
                            <div class='w3-responsive' style={{display:'inline-block', textAlign:'center',margin:'0 10%',width:'30%'}}>
                                <h6><b>Enter Session Code:</b></h6>
                                <p id = "error"></p>

                                <input type="text" id="code" class='w3-input'></input>
                            </div>
                            <div class='w3-responsive' style={{marginTop:'5%',height:'100%'}}>
                                <button class="w3-button w3-large w3-round w3-hover-red" onClick={this.join} style={{backgroundColor:'#525252', color:'white'}} >Join a Session</button>
                            </div>
                        </div>
                    </div>



                </div>
            </div>

        );
    }
}
//Allows usage of page
export default App;
