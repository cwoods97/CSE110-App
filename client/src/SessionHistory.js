//Necessary Imports
import React, { Component } from 'react';
import firebase from 'firebase';
import './styles/App.css';
import './styles/SessionHistory.css';

import Main from './Main';
import ReviewFeedback from './ReviewFeedback';

import {getDisplayName} from './RegisterFirebaseUser.js';
import logo from './Logo.png';

import ReactDOM from 'react-dom';

//For the session history page
class SessionHistory extends Component {

    //Constructor for this page
    constructor(props) {
        super(props);

        this.db = props.db;
        this.home = this.home.bind(this);
        //Some states allow access to one's display name and passed joined/created sessions
        this.state = {
            message: "",
            display: "",
            joinedSessions: [],
            presentedSessions: []
        }

        //Get joined Sessions
        this.getJoinedSessions().then((response) => {
            this.setState({
                joinedSessions : response
            });
        }).catch((error) => { console.log(error) })

        //Get created Sessions
        this.getPresentedSessions().then((response) => {
            this.setState({
                presentedSessions : response
            })
        }).catch((error) => { console.log(error) })
    }

    //Full function to get presented sessions
    getPresentedSessions() {
        return new Promise((resolve, reject) => {
            firebase.auth().currentUser.getIdToken()
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

    //Full function to get joined sessions
    getJoinedSessions() {
        return new Promise((resolve, reject) => {
            firebase.auth().currentUser.getIdToken()
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

    //Makes it so the the user's correct display name is shown
    componentDidMount() {
        getDisplayName().then(name => {this.setState({display: name});});

    }

    //Brings one back to the main page of the web app
    home = function(ev) {

        ev.preventDefault();
        ReactDOM.render(<Main db={this.db} />, document.getElementById('root'));


    }


    //Makes it so the Joined session and Created Sessions are displayed properly based on what tab: "Joined Sessions" or "Created Sessions" is selected
    join = function(ev){

        ev.preventDefault();

        document.getElementById('joined').style.display = 'inline'
        document.getElementById('created').style.display = 'none'
        document.getElementById('jb').style.backgroundColor = '#525252'
        document.getElementById('cb').style.backgroundColor = '#999999'

    }

    //Makes it so the Joined session and Created Sessions are displayed properly based on what tab: "Joined Sessions" or "Created Sessions" is selected
    create = function(ev){

        ev.preventDefault();

        document.getElementById('created').style.display = 'inline'
        document.getElementById('joined').style.display = 'none'
        document.getElementById('cb').style.backgroundColor = '#525252'
        document.getElementById('jb').style.backgroundColor = '#999999'

    }

    //Brings one to the ReviewFeedback page for a specific session clicked on
    renderSession = (sessionID) => {
        ReactDOM.render(<ReviewFeedback db={this.db} sessionid={sessionID} />, document.getElementById('root'));
    }

    //Where html is located
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
                        this.state.presentedSessions.map((sessionData) => (

                            /*Specific format for created session info that can be shown on the page*/
                            <div class='sessions' sessionid={sessionData.id} onClick={(e) => this.renderSession(sessionData.id)} style={{cursor:'pointer'}}>

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
                {/*Where the joined session content is displayed*/}
                <div id="joined" style={{display:'none'}}>
                    {
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
