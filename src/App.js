import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Login from './components/Login'
import UserOptions from './components/UserOptions'
import SignUp from './components/SignUp'
// import {ActionCableProvider} from 'react-actioncable-provider'
// import Loading from './components/Loading'
// import { jwt } from 'jsonwebtoken'

class App extends Component {

  state = {
    // verifying: false,
    logged_in: false,
    user: {}
  }

  // Forget verifying, save the user object in local storage and make a fetch request to verify.
  // Check if user object is empty or not

  componentWillMount = () => {
    if (localStorage.getItem("token")){
      this.setState({
          logged_in: true
        })
        this.authenticateFetch(localStorage.getItem("token"))
      }
  }

  // componentWillMount(){
  //   if (localStorage.getItem("token")){
  //     this.authenticateUser(localStorage.getItem("token"))
  //   }
  // }

  // async authenticateUser(token){
  //   let user = await this.authenticateFetch(token)
  // }

  authenticateFetch(token){
    let object = {
      jwt: token
    }
    fetch("http://localhost:3000/user/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(object)
    }).then(res => res.json())
    .then(this.setUserObjectToState)
  }

  setUserObjectToState = (object) => {
    this.setState({
      // verifying: false,
      logged_in: true,
      user: object
    })
  }

  handleSignOutClick = () => {
    localStorage.removeItem('token')
    this.setState({
      logged_in: false,
      user: {}
    })
  }

  userToTopState = (user) => {
    this.setState({
      logged_in: true,
      user: user
    })
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Two-Island Bridge 🌉</h1>
        </header>
          {this.state.logged_in ? 
  
            
              <UserOptions signOut={this.handleSignOutClick} user={this.state.user} /> 
           : 
            <div>
              <label>Login</label>
              <Login setAppState={this.userToTopState} />
              <label>Sign Up</label>
              <SignUp setAppState={this.userToTopState} />
            </div> }
          
      </div>
    );
  }
}

export default App;
