/*
 * This file defines the SessionHistory component, which acts a View class
 * (of the MVC framework) in acting as a portal page which displays all of
 * the sessions that the currently logged-in user has either joined or hosted.
 * This view also acts as an interface for the user in selecting one of their
 * created sessions in order to review the associated feedback.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

/* Selectively rendered based on user actions */
import ReviewFeedback from './ReviewFeedback';
import Main from './Main';

import { getDisplayName } from './RegisterFirebaseUser.js';

import './styles/App.css';
import './styles/SessionHistory.css';

import logo from './Logo.png';
import mic from './Mic.png';
import noMic from './NoMic.png';

//For the session history page
class SessionHistory extends Component {

    //Constructor for this page
    constructor(props) {
        super(props);

        this.db = props.db;
        this.home = this.home.bind(this);

        //Contains the information that populates this page's view
        this.state = {
            display: "",
            joinedSessions: [],
            presentedSessions: []
        }

        //Populating list of user's created sessions with backend data
        this.getJoinedSessions()
        .then((response) => { this.setState({joinedSessions : response}) })
        .catch((error) => { console.log(error) })

        //Populating list of user's joined sessions with backend data
        this.getPresentedSessions()
        .then((response) => { this.setState({presentedSessions : response}) })
        .catch((error) => { console.log(error) })
    }

    //Query controller for the model data containing this user's created sessions
    getPresentedSessions() {
        return new Promise((resolve, reject) => {
            this.db.auth().currentUser.getIdToken()
            .then(token => {
                fetch('/api/account/getPresentedSessions', {
                    method: 'post',
                    body: JSON.stringify({
                        token: token
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(response => { resolve(response) })
                .catch(error => { return reject(error) });
            }).catch(error => { return reject(error); })
        })
    }

    //Query controller for the model data containing this user's joined sessions
    getJoinedSessions() {
        return new Promise((resolve, reject) => {
            this.db.auth().currentUser.getIdToken()
            .then(token => {
                fetch('/api/account/getJoinedSessions', {
                    method: 'post',
                    body: JSON.stringify({
                        token: token
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(response => { resolve(response) })
                .catch(error => { return reject(error) });
            }).catch(error => { return reject(error); })
        })
    }

    //Retrieve current user's display name to update the sidebar
    componentDidMount() {
        getDisplayName().then(name => {this.setState({display: name})})
    }

    //Return to the website's main page
    home = function(ev) {
        ev.preventDefault();
        ReactDOM.render(<Main db={this.db} />, document.getElementById('root'));
    }


    //Event handler for clicking the "Joined Sessions" button
    join = function(ev){
        ev.preventDefault();

        //Switches view to show sessions that the user has joined
        document.getElementById('joined').style.display = 'inline'
        document.getElementById('created').style.display = 'none'
        //Updates view to indicate that the 'Joined Sessions' tab is selected
        document.getElementById('jb').style.backgroundColor = '#525252'
        document.getElementById('cb').style.backgroundColor = '#999999'
    }

    //Event handler for clicking the "Created Sessions" button
    create = function(ev){
        ev.preventDefault();

        //Switches view to show sessions that the user has created
        document.getElementById('created').style.display = 'inline'
        document.getElementById('joined').style.display = 'none'
        //Updates view to indicate that the 'Created Sessions' tab is selected
        document.getElementById('cb').style.backgroundColor = '#525252'
        document.getElementById('jb').style.backgroundColor = '#999999'
    }

    //Renders ReviewFeedback page for the specific session that the user has
    //selected (via the onClick event handler)
    renderSession = (sessionID, hasAudio) => {
        ReactDOM.render(
            <ReviewFeedback db={this.db} hasaudio={hasAudio} sessionid={sessionID} />,
            document.getElementById('root')
        );
    }

    render() {
        return (

            <div >
                {/*For styling purposes*/}
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

                {/*For top bar and and logo*/}
                <div style={{backgroundColor:'#333333',height:"100%", outline: '1px solid #F3E6DE'}}>
                    <h2 style={{marginLeft:'8px',marginTop:'0px',marginBottom:'0px',height:'50px', color:'white', cursor:'pointer'}}><b></b>
                        <img src={logo} width="125" height="50" onClick={this.home} alt="SpeakEasy logo"/>
                    </h2>
                </div>

                {/*For the side menu displaying the display name of the user*/}
                <div id="sidebar" className="w3-sidebar w3-bar-block" style={{width:'20%',height:'100%',backgroundColor:'#585858',
                    color:'#F3E6DE', zIndex:'0',overflow:'hidden', boxShadow:'1px 1px 2px #F3E6DE'}}>

                    <a class="w3-bar-item HoverRed" style={{outline:'2px solid #333333', fontSize:'20px'}}>{this.state.display}</a>
                    <a class="w3-bar-item w3-button w3-hover-red" onClick={this.home.bind(this)} style={{color:'white', boxShadow:'1px 0px 1px #333333'}}>Back</a>

                </div>


                {/*For the main content*/}
                <div style={{width:'80%',float:'right'}}>
                    <br></br>

                    {/*For the "Joined Sessions" and "Created Sessions" tabs*/}
                    <div id="buttons" style={{margin:'0 auto', textAlign:'center'}}>
                    <button id="cb" onClick={this.create} class="w3-button w3-round w3-hover-red" style={{backgroundColor:'#525252', color:'white',marginRight:'10px'}}>
                        Created Sessions
                    </button>
                    <button id="jb" onClick={this.join} class="w3-button w3-round w3-hover-red" style={{backgroundColor:'#999999', color:'white', marginLeft:'10px'}}>
                        Joined Sessions
                    </button>
                    </div>

                </div>

                {/*Where the created session content is displayed*/}
                <div id="created">
                    {
                        /* Automatically populated when backend returns the model data for the user's created sessions */
                        this.state.presentedSessions.map((sessionData) => (
                            /*Specific format for created session info that can be shown on the page*/
                            <div class='sessions' sessionid={sessionData.id} onClick={(e) => this.renderSession(sessionData.id, sessionData.hasAudio)} style={{cursor:'pointer'}}>

                                <center>
                                    <div style={{marginLeft:'5px'}}>
                                            {sessionData.hasAudio === true
                                                ? <img src={mic} style={{width:'20px',height:'20px',float:'left'}} alt={"Has Audio"}/>
                                                : <img src={noMic} style={{width:'20px',height:'20px',float:'left'}} alt={"No Audio"} />}
                                    </div>
                                    <h4 style={{width:'85%'}}>
                                        {sessionData.title}
                                    </h4>
                                    <h6>
                                        {sessionData.displayName}
                                    </h6>
									<h6>
										{sessionData.creationTime}
									</h6>

                                </center>

                            </div>
                        ))
                    }
                </div>
                {/*Where the joined session content is displayed*/}
                <div id="joined" style={{display:'none'}}>
                    {
                        /* Automatically populated when backend returns the model data for the user's joined sessions */
                        this.state.joinedSessions.map((sessionData) => (
                            /*Specific format for joined session info that can be shown on the page*/
                            <div class='sessions' sessionid={sessionData.id}>
                                <center>
                                    <h4>
                                        {sessionData.title}
                                    </h4>
                                    <h6>
                                        {sessionData.displayName}
                                    </h6>
    								<h6>
										{sessionData.creationTime}
    								</h6>
                                </center>

                            </div>
                        ))
                    }
                </div>
            </div>

        );
    }
}
//Allows use of page
export default SessionHistory;
