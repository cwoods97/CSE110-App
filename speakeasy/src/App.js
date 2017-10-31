import React, { Component } from 'react';
import firebase from 'firebase';
import Users from './components/Users.js';
import DisplayUserData from './components/DisplayUserData.js';
import './styles/App.css';

class App extends Component {

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
    firebase.initializeApp(config);

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

  render() {
    return (
      <div>
        <p className="App-intro">
          Message from our API: <b>{this.state.message}</b>
        </p>
        <Users db = {firebase}/>
        <DisplayUserData db = {firebase}/>
      </div>
    );
  }
}

export default App;
