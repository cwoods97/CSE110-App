
import React, { Component } from 'react';
import './styles/CreateSession.css';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';


import './styles/ReviewFeedback.css';
import Chart from './components/Chart';

import { ReactMic } from 'react-mic';


class ReviewFeedback extends Component {

    constructor(props) {
        super(props);

        this.db = props.db;
        this.sessionID = props.sessionID;
        this.onStop = this.onStop.bind(this);
        this.state = {
            message: "",
            blobObject: null,
            display: "",
            coder: props.code
        };
    }

    componentDidMount() {
     //   getDisplayName().then(name =>{this.setState({display: name});});
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
                    <div class= 'inner' style={{width:'65%',display:'inline-block'}}>

                        <audio controls={"controls"} style={{width:'100%', height:'3em'}}></audio>


                    </div>

                    <div id = 'right' class='w3-round' style={{ borderLeft:'1px solid #665084',width:'35%',backgroundColor:'#c4a5ff',display:'inline-block',float:'right',overflow:'auto',maxHeight:'33em'}}>




                            <div class="reviewContainer w3-round-xlarge">
                            <p class="'reviewContent">
                            Display Name:
                            </p>

                             <p class="reviewContent">
                                 TimeStamp:
                             </p>

                             <p class="reviewContent" >
                                I thought the session was very nice alkdfn lknavlk liasd fiah daudhgiadhg aui auhgai ga uh g pgadh gpiahg ash dgpiashg piahs gpia async ai gai ghai
                                 ai gia gia gaig async augi ia g akjdnf jkadf kahkdjf kkjak fk hkjahfkhakfh kjah fkjah kah fk hakjfh kjsadhfkasdhf ksdafh kdsah fkasdfhkdsaf hkasdfh kas kajdfnkadsjf kahfk hakf kjah fkah sfkjh aksfdh kasf async akf kahf ka false
                                 ajdsfbj a fkas hfk kjdfh kah fkjsaf ha
                                 akjfd kjah fkahfka gag
                                 akgj kajg kasg asg
                                 jkag aksdg ag async
                             </p>

                            </div>

                            <div class="reviewContainer w3-round-xlarge">
                            <p class="'reviewContent">
                            Display Name:
                            </p>

                             <p class="reviewContent">
                                 TimeStamp:
                             </p>

                             <p class="reviewContent" >
                                I thought the session was very nice alkdfn lknavlk liasd fiah daudhgiadhg aui auhgai ga uh g pgadh gpiahg ash dgpiashg piahs gpia async ai gai ghai
                                 ai gia gia gaig async augi ia g akjdnf jkadf kahkdjf kkjak fk hkjahfkhakfh kjah fkjah kah fk hakjfh kjsadhfkasdhf ksdafh kdsah fkasdfhkdsaf hkasdfh kas kajdfnkadsjf kahfk hakf kjah fkah sfkjh aksfdh kasf async akf kahf ka false
                                 ajdsfbj a fkas hfk kjdfh kah fkjsaf ha
                                 akjfd kjah fkahfka gag
                                 akgj kajg kasg asg
                                 jkag aksdg ag async
                             </p>

                            </div>

                             <div class="reviewContainer w3-round-xlarge">
                            <p class="'reviewContent">
                            Display Name:
                            </p>

                             <p class="reviewContent">
                                 TimeStamp:
                             </p>

                             <p class="reviewContent" >
                                I thought the session was very nice alkdfn lknavlk liasd fiah daudhgiadhg aui auhgai ga uh g pgadh gpiahg ash dgpiashg piahs gpia async ai gai ghai
                                 ai gia gia gaig async augi ia g akjdnf jkadf kahkdjf kkjak fk hkjahfkhakfh kjah fkjah kah fk hakjfh kjsadhfkasdhf ksdafh kdsah fkasdfhkdsaf hkasdfh kas kajdfnkadsjf kahfk hakf kjah fkah sfkjh aksfdh kasf async akf kahf ka false
                                 ajdsfbj a fkas hfk kjdfh kah fkjsaf ha
                                 akjfd kjah fkahfka gag
                                 akgj kajg kasg asg
                                 jkag aksdg ag async
                             </p>

                            </div>




                    </div>

                    <div id= 'chart' style={{width:'65%',height:'30em'}}>
                        <div class='chart' style={{width:'33%',display:'inline-block',height:'100%'}}>

                            <Chart/>

                        </div>
                        <div class="chart"style={{width:'33%',display:'inline-block',height:'100%'}}>
                            <Chart/>

                        </div>
                        <div class = 'chart' style={{width:'33%',display:'inline-block',height:'100%'}}>

                            <Chart/>
                        </div>
                    </div>




                </div>



            </div>
        );
    }
}

export default ReviewFeedback;
