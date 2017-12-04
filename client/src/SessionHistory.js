import React, { Component } from 'react';
import firebase from 'firebase';
import './styles/App.css';
import './styles/SessionHistory.css';

import Main from './Main';
import AppFront from './App';
import ReviewFeedback from './ReviewFeedback';

import {getDisplayName} from './RegisterFirebaseUser.js';
import logo from './Logo.png';

import ReactDOM from 'react-dom';

class App extends Component {

    constructor(props) {
        super(props);

        this.db = props.db;
        this.home = this.home.bind(this);
        this.state = {
            message: "",
            display: "",
            joinedSessions: [],
            presentedSessions: []
        }

        this.getJoinedSessions().then((response) => {
            this.setState({
                joinedSessions : response
            });
        }).catch((error) => { console.log(error) })

        this.getPresentedSessions().then((response) => {
            this.setState({
                presentedSessions : response
            })
        }).catch((error) => { console.log(error) })
    }

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

    componentDidMount() {
        getDisplayName().then(name => {this.setState({display: name});});

    }

    home = function(ev) {

        ev.preventDefault();
        ReactDOM.render(<Main db={this.db} />, document.getElementById('root'));


    }

    front = function(ev) {

        ev.preventDefault();
        ReactDOM.render(<AppFront />, document.getElementById('root'));

    }

    join = function(ev){

        ev.preventDefault();

        document.getElementById('joined').style.display = 'inline'
        document.getElementById('created').style.display = 'none'
        /*document.getElementById("jb").classList.remove('w3-grey');
        document.getElementById("jb").classList.add('w3-dark-grey');

        document.getElementById("cb").classList.remove('w3-dark-grey');
        document.getElementById("cb").classList.add('w3-grey');*/
    }

    create = function(ev){

        ev.preventDefault();

        document.getElementById('created').style.display = 'inline'
        document.getElementById('joined').style.display = 'none'

        /*document.getElementById("jb").classList.remove('w3-dark-grey');
        document.getElementById("jb").classList.add('w3-grey');
        document.getElementById("cb").classList.remove('w3-grey');
        document.getElementById("cb").classList.add('w3-dark-grey');*/

    }

    renderSession = (sessionID) => {
        ReactDOM.render(<ReviewFeedback db={this.db} sessionid={sessionID} />, document.getElementById('root'));
    }


    render() {
        return (

            <div >
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

                <div style={{backgroundColor:'#333333',height:"100%", outline: '1px solid red'}}>
                    <h2 style={{marginLeft:'8px',marginTop:'0px',marginBottom:'0px',height:'50px', color:'white', cursor:'pointer'}}><b></b>
                        <img src={logo} width="125" height="50" onClick={this.home}/>
                    </h2>
                </div>

                <div id="sidebar" className="w3-sidebar w3-bar-block" style={{width:'20%',height:'100%',backgroundColor:'#585858',
                    color:'#F3E6DE', zIndex:'0',overflow:'hidden', boxShadow:'1px 1px 2px #f44336'}}>

                    <a href="#" class="w3-bar-item HoverRed" style={{outline:'2px solid #333333', fontSize:'20px'}}>{this.state.display}</a>
                    <a href="#" class="w3-bar-item w3-button w3-hover-red" onClick={this.home}style={{boxShadow:'1px 0px 1px #333333'}}>Home</a>
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

                    <div id="buttons" style={{margin:'0 auto',textAlign:'center'}}>
                    <button id="jb" onClick={this.join} class="w3-button w3-round w3-hover-red" style={{backgroundColor:'#525252', color:'white', marginRight:'10px'}}>
                        Joined Sessions
                    </button>
                    <button id="cb" onClick={this.create} class="w3-button w3-round w3-hover-red" style={{backgroundColor:'#525252', color:'white',marginLeft:'10px'}}>
                        Created Sessions
                    </button>
                    </div>

                </div>
                <div id="joined" >
                    {
                        this.state.joinedSessions.map((sessionData) => (
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
                <div id="created" style={{display:'none'}}>
                    {
                        this.state.presentedSessions.map((sessionData) => (
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
            </div>

        );
    }
}

export default App;
