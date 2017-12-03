
import React, { Component } from 'react';
import './styles/CreateSession.css';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';


import './styles/ReviewFeedback.css';
<<<<<<< HEAD
import ReviewChart from './components/ReviewChart';
=======
//import Chart from './components/Chart';
>>>>>>> b0cd1913e40fa98a7de59b0731fa098ff904ef71

import { ReactMic } from 'react-mic';


class ReviewFeedback extends Component {

    constructor(props) {
        super(props);

        this.db = props.db;
        this.sessionID = props.sessionid;
        this.onStop = this.onStop.bind(this);
        this.state = {
            predefinedFeedback: [],
            customFeedback: [],
            blobObject: null,
            display: ""
        };

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
                this.setState({
                    'predefinedFeedback' : data.predefinedFeedback,
                    'customFeedback': data.customFeedback
                })
            })
        })
    }

    componentDidMount() {

    }


    onStop = (blobObject) => {
        const storageRef = this.db.storage().ref().child(this.sessionID);
        const recordingRef = storageRef.child('media');
        recordingRef.put(blobObject.blob).then((snapshot) => {
            console.log("Successfully uploaded audio recording to Firebase.");
        }).catch((error) => {
            console.log(error);
        });
    };




    render() {

        return (

            <div style={{width:'100%',height:'100%',borderBottom:'4px solid #665084',zIndex:'9' }}>
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

                <div style={{height:'45px'}}>
                    <div style={{backgroundColor:'#c4a5ff',height:"100%"}}>


                        <h2 style={{marginLeft:'10px',marginTop:'0px',marginBottom:'1px',height:'35px',fontFamily:'cursive'}}><b>speakeasy</b>


                        </h2>


                    </div>
                </div>

                <div id="navigation" class="w3-sidebar w3-bar-block" style={{borderRight:'1px solid #665084', height:'100%',backgroundColor:'lightgrey',zIndex:'-1',overflow:'hidden'}}>

                    <a id='display' class="w3-bar-item menuLeft" style={{backgroundColor:'PaleVioletRed',fontFamily:'Poppins, sans-serif'}}><b>{this.state.display}</b></a>
                    <a class="w3-bar-item w3-button menuLeft" style={{backgroundColor:'lightgrey',fontFamily:'Poppins, sans-serif'}}><b>Session History</b></a>


                </div>

                <div id="center" style={{width:'85%',float:'right',marginTop:'4px',height:'100%'}}>
                    <div id= 'innerReview' style={{width:'65%',display:'inline-block',float:'left'}}>

                        <audio controls={"controls"} style={{width:'100%', height:'3em'}}></audio>


                    </div>


<<<<<<< HEAD
                    <div id= 'chartReview' style={{width:'65%',height:'30em',display:'inline-block',float:'left'}}>
                        <div class='chart' style={{width:'33%',display:'inline-block',height:'100%'}}>

                            <ReviewChart db={this.db} sessionID='L-ENZJWW31uX9fWNq2p' type='pace'/>

                        </div>
                        <div class="chart"style={{width:'33%',display:'inline-block',height:'100%'}}>
                            
                            <ReviewChart db={this.db} sessionID='L-ENZJWW31uX9fWNq2p' type='volume'/>

                        </div>
                        <div class = 'chart' style={{width:'33%',display:'inline-block',height:'100%'}}>

                            <ReviewChart db={this.db} sessionID='L-ENZJWW31uX9fWNq2p' type='speed'/>
                        </div>
                    </div>


=======
>>>>>>> b0cd1913e40fa98a7de59b0731fa098ff904ef71
                    <div id='titleReview' style={{width:'35%',display:'inline-block',float:'both',overflow:'auto'}}>
                        <center><h3>
                        Feedback
                        </h3>
                        </center>
                    </div>

                    <div id = 'rightReview' class='w3-round' style={{float:'right',border:'2px solid #665084',width:'35%',backgroundColor:'#c4a5ff',overflow:'auto',maxHeight:'33em'}}>

                            {
                                this.state.customFeedback.map((feedbackData) => (
                                    <div class="reviewContainer w3-round-xlarge">
                                        <p class="reviewContent">Display Name: </p>
                                        <p class="reviewContent">Timestamp: {feedbackData.timestamp}</p>
                                        <p class="reviewContent">{feedbackData.message}</p>
                                    </div>
                                ))
                            }

                    </div>




                </div>



            </div>
        );
    }
}

export default ReviewFeedback;
