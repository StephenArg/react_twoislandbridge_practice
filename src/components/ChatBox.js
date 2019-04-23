import React, { Component } from 'react';
import '../App.css';
import $ from 'jquery'

class ChatBox extends Component {
    state = {
        chatMessages: [],
        formValue: "",
        guestLocation: null,
        guestName: null,
        connectionId: null,
        // connections: null
        // firstMount: true
    }

    // componentDidMount = () => {
    //     if (this.state.firstMount){
    //         this.props.connections()
    //         this.setState({
    //             firstMount: false
    //         })
    //     }
    // }

    // componentDidMount = () => {
    //     if (this.state.guestLocation) {
    //         this.props.connections()
    //     }
    // }

    messageToState = (message) => {
        if (message.send_id === "reopen") {
            this.reopenRoom()
        } else if (message.send_id === "location") {
            // put fetch connections here
            if (message.user1Location === this.props.user.location && message.user1Name === this.props.user.name){
                this.setState({
                    guestLocation: message.user2Location,
                    guestName: message.user2Name,
                    connectionId: message.connectionId
                })
            } else {
                this.setState({
                    guestLocation: message.user1Location,
                    guestName: message.user1Name,
                    connectionId: message.connectionId
                })
            }
        } else {
        // message.message.user_id = message.user.name
        message.message.user_id = message.user
        console.log(message.message)
        this.setState({
            chatMessages: [...this.state.chatMessages, message.message]
        })
        // let elem = $('.chat-box');
        // elem.scrollTop = elem.scrollHeight;
      }
    }

    // setConnections = (connections) => {
    //     this.setState({
    //         connections: connections
    //     })
    //     console.log(connections)
    // }

    reopenRoom = () => {
        let info = {
            user_id: this.props.user.id,
            conversation_id: this.props.conversation_id
        }
        fetch(`${process.env.REACT_APP_API_LOCATION}/api/conversation/reopen`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(info)
          })
          this.setState({
              chatMessages: [],
              guestLocation: null,
              guestName: null,
              connectionId: null
          })
    }

    setFormValue = (e) => {
        this.setState({
            formValue: e.target.value
        })
    }


    submitMessage = (e) => {
        e.preventDefault()
        let message = {
            content: e.target.message.value,
            user_id: this.props.user.id,
            conversation_id: this.props.conversation_id,
            connectionId: this.state.connectionId
        }
        fetch(`${process.env.REACT_APP_API_LOCATION}/api/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
          })
          this.setState({
              formValue: ""
          })
    }

    render(){
        console.log(this.props.conversation_id)
        let allMessages = this.state.chatMessages.map(message => {
            return <li key={message.id} className="text-messages" ><small>{message.user_id}: {message.content}</small></li>
        })
        const {user} = this.props
        return(
            <div>
                <div className="chat-box">
                    <ul className="chat-list">
                        <h5 className="location-messages"> Chat Messages</h5>
                        <h5 className="location-messages"> - {user.name} (You) - Location: {user.location}</h5>
                        {this.state.guestLocation ?
                        (<h5 className="location-messages"> - {this.state.guestName} (Joined) - Location: {this.state.guestLocation} </h5>)
                        : null}
                        {allMessages}
                    </ul>
                </div>
                <form onSubmit={this.submitMessage}>
                    <input name="message" placeholder="Enter text here" value={this.state.formValue} onChange={this.setFormValue} />
                    <input type="submit" value="Send" />
                </form>
            </div>
        )
    }
}

export default ChatBox