import React, { Component } from 'react';
import '../App.css';

class SignUp extends Component {

    state = {
        name: "",
        password: ""
    }

    handleChange = (e) => {
        this.setState({
            name: e.target.value
        })
    }

    handleChangePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    setLocalStorage = (object) => {
        localStorage.setItem("u", object.user)
        localStorage.setItem("token", object.jwt)
        this.props.setAppState(object.user)
    }

    handleSubmit = (e) => {
        e.preventDefault()
        let user = {
            name: this.state.name,
            password: this.state.password,
            location: this.props.location
        }

        fetch(`${process.env.REACT_APP_API_LOCATION}/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }).then(res => res.json())
        .then(this.setLocalStorage)
    }

    render(){
        return(
            <div>
                <form id="signup-form" className="pure-form pure-form-aligned" onSubmit={this.handleSubmit}>
                    <fieldset>
                        <div className="pure-control-group signup-input">
                            <input onChange={this.handleChange} name="name" placeholder="Enter name here" value={this.state.name}/>
                            {/* <span class="pure-form-message-inline">This is a required field.</span> */}
                        </div>
                        <div className="pure-control-group signup-input">
                            <input type="password" onChange={this.handleChangePassword} name="password" placeholder="Enter password" value={this.state.password}/>
                        </div>
                            <input id="signup-button" type="submit" className="pure-button pure-button-primary" value="Sign Up"/>
                    </fieldset>
                </form>
            </div>
        )
    }
}

export default SignUp