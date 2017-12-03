
import React, { Component } from 'react';
import './styles/CreateSession.css';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';

import './styles/ReviewFeedback.css';
import ReviewChart from './components/ReviewChart';
import SessionHistory from './SessionHistory';

import { ReactMic } from 'react-mic';
import {getDisplayName} from "./RegisterFirebaseUser";

import logo from './Logo.png';

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

    }
   componentWillMount() {

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

    componentDidMount(){
        getDisplayName().then(name =>{this.setState({display: name});})
        
        var storage = this.db.storage();
        var gsReference = storage.refFromURL('gs://speakeasy-25a66.appspot.com');

        // var childURL = "-L-4ElT12kH_Hd0xBT1C/media" // TESTING URL
        console.log(this.sessionID);
        var childURL = this.sessionID + "/media";

        gsReference.child(childURL).getDownloadURL().then(function(url){
            console.log(url);
            var player = document.getElementById("player");
            player.src = url;
            console.log(player.src);
        }).catch(function(error){

        });
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

    history = function(ev){
        //ev.preventDefault();
        ReactDOM.render(<SessionHistory db={this.db} />, document.getElementById('root'));
    };

    render() {

        return (

            <div style={{width:'100%',height:'100%',borderBottom:'1px solid red',zIndex:'9' }}>
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

                <div style={{backgroundColor:'#333333',height:"100%"}}>
                    <h2 style={{marginLeft:'8px',marginTop:'0px',marginBottom:'0px',height:'50px', color:'white'}}><b></b>
                        <img src={logo} width="125" height="50" />
                    </h2>
                </div>

                <div id="navigation" class="w3-sidebar w3-bar-block" style={{borderRight:'1px solid #f44336', height:'100%',backgroundColor:'#585858',zIndex:'-1',overflow:'hidden'}}>

                    <a id='display' class="w3-bar-item menuLeft" style={{fontFamily:'Poppins, sans-serif'}}><b>{this.state.display}</b></a>
                    <a class="w3-bar-item w3-button menuLeft w3-hover-red" onClick={this.history.bind(this)} style={{color:'white', boxShadow:'1px 0px 1px #333333', fontFamily:'Poppins, sans-serif'}}><b>Session History</b></a>


                </div>

                <div id="center" style={{width:'85%',float:'right',marginTop:'4px',height:'100%'}}>
                    <div id= 'innerReview' style={{width:'65%',display:'inline-block',float:'left'}}>



                    </div>


                    <div id= 'chartReview' style={{width:'65%',height:'30em',display:'inline-block',float:'left'}}>
                        <div class='chart' style={{width:'33%',display:'inline-block',height:'100%'}}>

                            <ReviewChart type='pace' data={this.state.predefinedFeedback}/>

                        </div>
                        <div class="chart"style={{width:'33%',display:'inline-block',height:'100%'}}>

                            <ReviewChart type='volume'/>

                        </div>
                        <div class = 'chart' style={{width:'33%',display:'inline-block',height:'100%'}}>

                            <ReviewChart type='clarity' />
                        </div>
                    </div>

                    <div id='titleReview' style={{width:'35%',display:'inline-block',float:'both',overflow:'auto'}}>
                        <center><h3>
                        Feedback
                        </h3>
                        </center>
                    </div>

                    <div id = 'rightReview' class='w3-round' style={{float:'right',border:'2px solid #f44336',width:'35%',backgroundColor:'#585858',overflow:'auto',maxHeight:'33em'}}>

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
