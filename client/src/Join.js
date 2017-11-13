import React, { Component } from 'react';
import firebase from 'firebase';
import Users from './components/Users.js';
import DisplayUserData from './components/DisplayUserData.js';
import './styles/App.css';
import ReactDOM from 'react-dom';

import Main from './Main';

class Join extends Component {

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
        !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

        this.state = {
            message: ""
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

    main(e){


        ReactDOM.render(<Main />, document.getElementById('root'));

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
                    <a href="#" class="w3-bar-item w3-button" onClick={this.main} style={{backgroundColor:'lightgrey'}}>Leave Session</a>
                    <a href="#" class="w3-bar-item w3-button" style={{backgroundColor:'lightgrey'}}>Share</a>
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


                    <div style={{borderRight:'6px solid black',float:'left',width:"45%", marginLeft:'330px',marginTop:'10px', height:'100%'}}>
                        <center>
                            <p style={{width:'', overflow:'hidden'}}><h3><b>Give Predefined Feedback</b></h3></p>
                        </center>

                        <center>

                        <button class="w3-btn w3-large w3-round" style={{margin:'10px',backgroundColor:'palegreen'}}>Pace of Speech too Fast</button>
                        <button class="w3-btn w3-large w3-round" style={{margin:'10px',backgroundColor:'palegreen'}}>Pace of Speech too Slow</button>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                        <button class="w3-btn w3-large w3-round" style={{margin:'10px',backgroundColor:'powderblue'}}>Speak Up</button>
                        <button class="w3-btn w3-large w3-round" style={{margin:'10px',backgroundColor:'powderblue'}}>Too Loud</button>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                        <button class="w3-btn w3-large w3-round" style={{margin:'10px',backgroundColor:'mediumorchid'}}>Talking too Fast</button>
                        <button class="w3-btn w3-large w3-round" style={{margin:'10px',backgroundColor:'mediumorchid'}}>Talking too Slow</button>

                        </center>


                    </div>

                    <div style={{backgroundColor:'',width:'25%',marginRight:'50px',marginTop:'10px',float:'right', height:'100%'}}>
                        <center>
                            <p style={{width:'',overflow:'hidden'}}><h3><b>Give Comments</b></h3></p>
                        </center>



                    </div>
                </div>




            </div>

        );
    }
}

export default Join;
