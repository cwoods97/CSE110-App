//Necessary imports
import React, { Component } from 'react';
import firebase from 'firebase';
import './styles/App.css';

import ReactDOM from 'react-dom';
import App from  "./App";
import logo from './Logo.png';

//For About Us page
class About extends Component {

    //Constructor for this page
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
        if (firebase.apps.length === 0){
            firebase.initializeApp(config);
        }
        else{
            firebase.app()
        }
        this.state = {
            message: ""
        }
    }

    //Brings one back to the login front page
    app = function(ev){

        ev.preventDefault();

        ReactDOM.render(<App />, document.getElementById('root'));


    }

    //Html code is located here
    render() {
        return (

            <div style={{backgroundColor:'#F3E6DE'}}>
                {/*Styling import*/}
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

                {/*For the top bar and logo for the page*/}
                <div style={{backgroundColor:'#333333',height:"100%"}}>

                    <h2 style={{marginLeft:'8px',marginTop:'0px',marginBottom:'0px',height:'50px',fontFamily:'cursive', color:'white', cursor:'pointer'}}><b></b>
                        <img src={logo} width={'125'} height={'50'} onClick={this.app} alt="SpeakEasy logo"/>

                    </h2>
                </div>

                {/* For the main text of the page */}
                <center>
                    <h3 style={{marginTop:'50px', fontSize:'35px'}}><b>About Us</b></h3>
                    <p id = 'AboutText' style={{textAlign:'center',marginRight:'20%',marginLeft:'20%', fontSize:'18px'}}>
                        SpeakEasy is a web application developed by eleven UCSD students with the goal of helping speakers improve their public speaking skills and the process of receiving feedback. SpeakEasy empowers speakers with the ability to easily review speeches they have given in the past to identify elements they can improve. Audience members can actively engage with the speaker with quick and easy predefined feedback, such as indicating that they are speaking too fast or slow, which the speaker can view effortlessly. This contrasts with the current traditional and disruptive way of interrupting the speaker to tell them a trivial piece of information. All of this is available to the audience at the tap of a simple button.
                        <br></br>
                        Developed with a growth mindset, we believe that there is always room for improvement. SpeakEasy can be used in a range of environments, from small lectures to presentations with hundreds of people. Our application is easy to use with a simple goal to provide a positive experience for all users.
                    </p>
                </center>
            </div>
        );
    }
}
//exports to allow page to be shown
export default About
