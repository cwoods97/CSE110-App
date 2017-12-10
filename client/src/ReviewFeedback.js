/*
 * This file contains the class ReviewFeedback, which displays a page for reviewing feedback
 * from a previous completed session.
 */
//Necessary Imports
import React, { Component } from 'react';
import './styles/CreateSession.css';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';

import './styles/ReviewFeedback.css';
import ReviewChart from './components/ReviewChart';
import SessionHistory from './SessionHistory';
import Main from './Main';

import {getDisplayName} from "./RegisterFirebaseUser";

import logo from './Logo.png';

//For the actual reviewing of feedback
class ReviewFeedback extends Component {

    //Constructor for this page
    constructor(props) {
        super(props);

        this.db = props.db;
        this.sessionID = props.sessionid;
        console.log("Session ID", this.sessionID)

        //States used to access types of feedback and audio where applicable
        //Also allows access to display name
        this.state = {
            predefinedFeedback: [],
            customFeedback: [],
            blobObject: null,
            display: "",
            src: ""
        };
    }

    componentWillMount() {
		
		//posts a request to backend for getting the feedbacks (predefined and custom)
        this.db.auth().currentUser.getIdToken().then((token) => {
            fetch("/api/sessionReview/sessionData", {
                method: 'post',
                body: JSON.stringify({
                    token: token,
                    sessionID: this.sessionID
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then((data) => {
                console.log(data.customFeedback)
                this.setState({
                    'predefinedFeedback' : data.predefinedFeedback ? data.predefinedFeedback : [],
                    'customFeedback': data.customFeedback ? data.customFeedback : []
                })
            })
        })


    }

    //Allows one to go back to the main page
    main = function(ev) {

        ev.preventDefault();
        ReactDOM.render(<Main db={this.db} />, document.getElementById('root'));


    }

    componentDidMount(){
        //Allows displaying of correct display name
        getDisplayName().then(name =>{this.setState({display: name});})

        var storage = this.db.storage();
        var gsReference = storage.refFromURL('gs://speakeasy-25a66.appspot.com');
        var childURL = this.sessionID + "/media";

		//Gets the audio if exists
        gsReference.child(childURL).getDownloadURL().then(function(url){
            console.log(url);
            this.setState({'src': url});
        }.bind(this)).catch(function(error){
            console.log(error);
        });

		//Sets up the review charts
        this.pChart = document.getElementById('pChart');
        this.vChart = document.getElementById('vChart');
        this.cChart = document.getElementById('cChart');

        this.audio = document.getElementById('audio');

		//updates the chart
        setInterval(() => {
			var feedbackArray = this.state.predefinedFeedback;
			var returnArray = ['0','0','0','0','0','0'];
			for (var i = 0; i < feedbackArray.length; i++) {
				if(this.audio.currentTime - feedbackArray[i].timestamp < 60 && this.audio.currentTime - feedbackArray[i].timestamp >= 0) {
					if(feedbackArray[i].message === 'slow') {
						returnArray[0]++;
					}
					if(feedbackArray[i].message === 'fast') {
						returnArray[1]++;
					}
					if(feedbackArray[i].message === 'quiet') {
						returnArray[2]++;
					}
					if(feedbackArray[i].message === 'loud') {
						returnArray[3]++;
					}
					if(feedbackArray[i].message === 'unclear') {
						returnArray[4]++;
					}
					if(feedbackArray[i].message === 'clear') {
						returnArray[5]++;
					}
				}
			}
			this.pChart.setGraph(returnArray);
			this.vChart.setGraph(returnArray);
			this.cChart.setGraph(returnArray);
			
            
        }, 200)
    }

    //Allows one to go back to the session history page
    history = function(){
        ReactDOM.render(<SessionHistory db={this.db} />, document.getElementById('root'));
    };

    formatTimestamp = (timestamp) => {
        let seconds = Math.floor(parseFloat(timestamp));

        var minutes = Math.floor(seconds / 60);
        seconds = seconds - (minutes * 60);

        minutes = minutes.toString().length > 1 ? minutes.toString() : "0".repeat(2 - minutes.toString().length) + minutes.toString();
        seconds = seconds.toString().length > 1 ? seconds.toString() : "0".repeat(2 - seconds.toString().length) + seconds.toString();

        return minutes.toString() + ":" + seconds.toString();
    }

    //Where html is located
    render() {

        return (

            <div style={{width:'100%',height:'100%',borderBottom:'1px solid #F3E6DE',zIndex:'9' }}>
                {/*Necessary for styling*/}
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

                {/*Top bar and logo*/}
                <div style={{backgroundColor:'#333333',height:"100%"}}>
                    <h2 style={{marginLeft:'8px',marginTop:'0px',marginBottom:'0px',height:'50px', color:'white'}}><b></b>
                        <img src={logo} width="125" height="50" style={{cursor:'pointer'}} onClick={this.main.bind(this)} alt="SpeakEasy logo"/>
                    </h2>
                </div>

                {/*Side menu showing display name and allowing one to go back to the Session History page*/}
                <div id="navigation" class="w3-sidebar w3-bar-block w3-responsive" style={{height:'100%',backgroundColor:'#585858',zIndex:'0', color:'#F3E6DE', boxShadow:'1px 1px 2px #525252'}}>

                    <a id='display' class="w3-bar-item HoverRed" style={{fontSize:'20px', outline:'2px solid #333333'}}>{this.state.display}</a>
                    <a class="w3-bar-item w3-button w3-hover-red" onClick={this.history.bind(this)} style={{color:'white', boxShadow:'1px 0px 1px #333333'}}>Back</a>


                </div>

                {/*Main content of page, where all of the relevant feedback/charts/audio when applicable is accessible*/}
                <div id="center" style={{width:'85%',float:'right',height:'100%'}}>

                    {/*Allows access to audio/ where the audio is located*/}
                    <div id= 'innerReview' style={{width:'100%',display:'inline-block',float:'left',margin:'auto'}}>
                        <audio
                            id="audio"
                            controls={true}
                            src={this.state.src}
                            style={{width:'100%',float:'both',margin:'2px'}}
                        />
                    </div>


                    {/*Where the predefined chart data is shown for each of the three charts*/}
                    <div id= 'chartReview' style={{width:'65%',height:'30em',display:'inline-block',float:'left'}}>
                        <div class='chart' style={{width:'33%',display:'inline-block',height:'100%'}}>

                            <ReviewChart
                                ref={(chart) => {this.pChart = chart}}
                                type='pace'
                                data={this.state.predefinedFeedback} />

                        </div>
                        <div class="chart"style={{width:'33%',display:'inline-block',height:'100%'}}>

                            <ReviewChart ref={(chart) => {this.vChart = chart}} type='volume' data={this.state.predefinedFeedback} />

                        </div>
                        <div class = 'chart' style={{width:'33%',display:'inline-block',height:'100%'}}>

                            <ReviewChart ref={(chart) => {this.cChart = chart}} type='clarity' data={this.state.predefinedFeedback} />
                        </div>
                    </div>

                    {/*Where the title "Feedback" is located*/}
                    <div id='titleReview' style={{width:'34%',marginRight:'1%',display:'inline-block',float:'both',overflow:'auto'}}>
                        <center><h3>
                        Feedback
                        </h3>
                        </center>
                    </div>

                    {/*Where one can view the customized feedback of a user's session*/}
                    <div id = 'rightReview' class='w3-round' style={{float:'right',width:'34%',marginRight:'1%',marginBottom:'1%',backgroundColor:'#585858',overflow:'auto',height:'33em',maxHeight:'33em',boxShadow:'1px 1px 2px #525252'}}>

                            {
                                this.state.customFeedback.map((feedbackData) => (
                                    <div class="reviewContainer w3-round-xlarge">
                                        <p class="reviewContent">{feedbackData.message}</p>
                                        <div style={{borderTop: '1px solid #000000'}}>
                                            <p style={{fontSize:'10px', float:'left'}} class="reviewContent">from: {feedbackData.uid}</p>
                                            <p style={{fontSize:'10px', float:'right'}} class="reviewContent">{this.formatTimestamp(feedbackData.timestamp)}</p>
                                        </div>
                                    </div>
                                ))

                            }

                    </div>




                </div>



            </div>
        );
    }
}
//Allows use of this page
export default ReviewFeedback;
