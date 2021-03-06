import React, { Component } from 'react';
import '../App.css';

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
        localStorage.setItem("u", object.user)
        localStorage.setItem("token", object.jwt)
        console.log(this)
        this.props.setAppState(object.user)
    }

    handleSubmit = (e) => {
        e.preventDefault()
        let user = {
            name: this.state.name,
            password: this.state.password
        }

        fetch("http://localhost:3000/user/login", {
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