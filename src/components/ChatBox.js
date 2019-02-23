import React, { Component } from 'react';
import '../App.css';

class ChatBox extends Component {
    state = {
        chatMessages: [],
        formValue: ""
    }

    messageToState = (message) => {
        console.log(message.message)
        this.setState({
            chatMessages: [...this.state.chatMessages, message.message]
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
        fetch("http://localhost:3000/messages", {
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
        let allMessages = this.state.chatMessages.map(message => {
            return <li key={message.id} ><small>{message.content}</small></li>
        })
        return(
            <div>
                <div className="chat-box">
                    <h5> Chat Messages</h5>
                    <ul>
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