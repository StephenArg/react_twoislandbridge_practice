import React, { Component } from 'react';
import '../App.css';

class ChatBox extends Component {
    state = {
        chatMessages: [],
        formValue: "",
        guestLocation: null,
        guestName: null
    }

    messageToState = (message) => {
        if (message.send_id === "reopen") {
            this.reopenRoom()
        } else if (message.send_id === "location") {
            if (message.user1Location === this.props.user.location && message.user1Name === this.props.user.name){
                this.setState({
                    guestLocation: message.user2Location,
                    guestName: message.user2Name
                })
            } else {
                this.setState({
                    guestLocation: message.user1Location,
                    guestName: message.user1Name
                })
            }
        } else {
        message.message.user_id = message.user.name
        console.log(message.message)
        this.setState({
            chatMessages: [...this.state.chatMessages, message.message]
        })
      }
    }

    reopenRoom = () => {
        let info = {
            user_id: this.props.user.id,
            conversation_id: this.props.conversation_id
        }
        fetch("/conversation/reopen", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(info)
          })
          this.setState({
              chatMessages: [],
              guestLocation: null,
              guestName: null
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
            conversation_id: this.props.conversation_id
        }
        fetch("/messages", {
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
                        <h5> Chat Messages</h5>
                        <h5> - {user.name} (You) - Location: {user.location}</h5>
                        {this.state.guestLocation ?
                        (<h5> - {this.state.guestName} (Joined) - Location: {this.state.guestLocation} </h5>)
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