import React, { Component } from 'react';
import '../App.css';
import { ActionCableConsumer } from 'react-actioncable-provider';

class Chatroom extends Component {

    state = {
        chatting: false,
        conversation_id: null,
        chatMessages: [],
        formValue: ""
    }


    startChatting = () => {
        this.setState({
            chatting: true
        })
        fetch("http://localhost:3000/conversation/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({user: this.props.user})
          }).then(res => res.json())
          .then(this.setConversationId)
    }

    setConversationId = (object) => {
        this.setState({
            conversation_id: object.conversation_id
        })
    }

    stopChatting = () => {
        this.setState({
            chatting: false
        })
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
            conversation_id: this.state.conversation_id
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
                <h3>Here in chatroom</h3>
                {this.state.chatting ?
                <div>
                    {this.state.conversation_id ?
                    (<ActionCableConsumer 
                    channel={{ channel: 'ConversationsChannel', conversation_id: this.state.conversation_id}}
                    onReceived={this.messageToState}
                    />) : null}
                    
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


                    <button onClick={this.stopChatting} >Stop Chatting</button> 
                </div>
                :
                <button onClick={this.startChatting} >Start Chatting</button>
                }
                <button onClick={this.props.leaveChat} >Leave Chat</button>
            </div>
        )
    }
}

export default Chatroom