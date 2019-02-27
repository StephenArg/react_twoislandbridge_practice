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

        fetch("/user/login", {
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
                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.handleChange} name="name" placeholder="Enter name here" value={this.state.name}/>
                    <input type="password" onChange={this.handleChangePassword} name="password" placeholder="Enter password" value={this.state.password}/>
                    <input type="submit" value="Login"/>
                </form>
            </div>
        )
    }
}

export default Login