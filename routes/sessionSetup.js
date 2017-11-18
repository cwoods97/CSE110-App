const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const app = express();
var router = express.Router();
var db = admin.database();
var sessionRef = db.ref("session");

router.get('/create_session', (req, res) => {
	//token should have been verified, and this should be the decodedToken
        var token = res.query.token;
        if (!token) {
		//error, there should not be a null token
	}

	var uid = token.uid;
	var accessCode = 0;
	var uniqueAccessCode = false;
	var max = 500000;
	var min = 100000;
	while(!uniqueAccessCode) {
		accessCode = Math.floor(Math.random()*(max - min))+min;
		//query database for active session with accessCode. If not found, uniqueAccessCode = true
	}
	//create database object with default values and uid
	sessionRef.set({


	
	
	//query database for user object with matching uid
	//add the session ID to the list of presented sessions in the user object
	
 	res.writeHead(200, {'Content-Type': 'application/json'})
	res.end(JSON.stringify(result));
})

        constructor(props){
                super(props);

                this.state ={
                        name: '',
                        username: '',
                        password: ''
                }
        }

        componentWillMount(){
                this.firebaseRef = this.props.db.database().ref("users");
        };

        componentWillUnmount(){
                this.firebaseRef.off();
        };

        pushToFirebase(event){
                event.preventDefault();
                this.firebaseRef.child(this.state.name).set({
                        name: this.state.name,
                        username: this.state.username,
                        password: this.state.password
                });
                this.setState({name: '', username: '', password: ''});
        }

