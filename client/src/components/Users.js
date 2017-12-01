import React, {Component} from 'react';

class Users extends Component {

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

  render(){
    return(
      <div>
      	 <form onSubmit={this.handleSubmit}>
                      <label>
                          Full Name
                          <input type="text" value={this.state.name} onChange={e => this.setState({ name: e.target.value })}/>
                      </label>
          </form>
                  <form>
                      <label>
                          Username
                          <input type="text" value={this.state.username} onChange={e => this.setState({ username: e.target.value })} />
                      </label>
            </form>
            <form>
                      <label>
                          Password
                          <input type="text" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
                      </label>
            </form>
            <form>
              <button onClick={this.pushToFirebase.bind(this)}>Submit</button>
            </form>
      </div>
    );
  }
 }
export default Users;
