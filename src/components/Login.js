import React, { Component } from 'react';
import '../App.css';
// import jwt from 'jsonwebtoken'

class Login extends Component {

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
        // localStorage.setItem("u", jwt.sign(object.user, "frontPass7"))
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

        fetch(`${process.env.REACT_APP_API_LOCATION}/api/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(res => res.json())
        .then(this.setLocalStorage)
    }

    render(){
        return(
            <div>
                <form id="login-form" className="pure-form" onSubmit={this.handleSubmit}>
                    <fieldset id="login-fieldset" >
                        <div>
                            <input className="login-inputs" onChange={this.handleChange} name="name" placeholder="Email" value={this.state.name}/>
                        </div>
                        <div>
                            <input id="login-password" className="login-inputs" type="password" onChange={this.handleChangePassword} name="password" placeholder="Password" value={this.state.password}/>
                        </div>
                        <button className="button-small pure-button" type="submit">Log In</button>
                    </fieldset>
                </form>
            </div>
        )
    }
}

export default Login