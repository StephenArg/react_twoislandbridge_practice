import React, { Component, Fragment } from 'react';
// import logo from './logo.svg';
import './App.css';
import Login from './components/Login'
import UserOptions from './components/UserOptions'
import SignUp from './components/SignUp'
import logo from "./pictures/bridge.jpg"
import textlogo from "./pictures/generated.svg"
// import {ActionCableProvider} from 'react-actioncable-provider'
// import Loading from './components/Loading'
// import { jwt } from 'jsonwebtoken'

class App extends Component {

  state = {
    // verifying: false,

    // due to the lack of react routes, booleans are used to determine which components load on the inital boot
    logged_in: false,
    user: {},
    location: null
  }

  // Forget verifying, save the user object in local storage and make a fetch request to verify.
  // Check if user object is empty or not

  componentWillMount = () => {
    // Upon mounting, if a token is present in the browsers local storage, that token will be sent to the back-end to determine which user that is and if that token is legitimate
    if (localStorage.getItem("token")){
      this.setState({
          logged_in: true
        })
        this.authenticateFetch(localStorage.getItem("token"))
      }
    // After the method to authenticate fetch has been called, the users location will automatically be found and set in state.
      fetch("https://geoip-db.com/json/")
      .then(res => res.json())
      .then(this.setCountry)
  }

  setCountry = (locationInfo) => {
    this.setState({
        location: locationInfo.country_name
    })
  }

  authenticateFetch(token){
    // authenticates the token from users localstorage
    let object = {
      jwt: token
    }
    fetch(`${process.env.REACT_APP_API_LOCATION}/api/user/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(object)
    }).then(res => res.json())
    .then(this.setUserObjectToState)
  }

  setUserObjectToState = (object) => {
    // sets the returning user object to state and redundently sets loggin_in boolean to true
    this.setState({
      // verifying: false,
      logged_in: true,
      user: object
    })
  }

  handleSignOutClick = () => {
    // handles signout button by removing token and setting state to logged out condition, with blank object for user
    localStorage.removeItem('token')
    this.setState({
      logged_in: false,
      user: {}
    })
  }

  userToTopState = (user) => {
    // Upon login or signup, their fetch requests within their handleSubmit methods will receive back user objects, which are passed back to the front-end to set the state to loggedin.
    this.setState({
      logged_in: true,
      user: user
    })
  }


  render() {
    console.log(this.state.user)
    return (
      <div className="App">
        <header className="App-header">
          {this.state.logged_in ? 
          <Fragment>
          <img className="logo-text" src={textlogo} alt="" /><img className="logo-image" alt="" src={logo} />
          </Fragment> : 
          <Fragment>
            <img className="logo-text-login" src={textlogo} alt="" /><img className="logo-image-login" alt="" src={logo} />
          <div id="login-container">
          <Login setAppState={this.userToTopState} location={this.state.location} />
          </div> 
          </Fragment>}
        </header>
        <header id="lower-header">
          </header>
          {this.state.logged_in ? 
  
            
              <UserOptions signOut={this.handleSignOutClick} user={this.state.user} /> 
           : 
            <div>
              <label id="signup-label" >Sign Up</label>
              <SignUp setAppState={this.userToTopState} location={this.state.location} />
            </div> }
      </div>
    );
  }
}

export default App;
