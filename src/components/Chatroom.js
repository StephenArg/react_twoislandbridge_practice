import React, { Component } from 'react';
import '../App.css';
import { ActionCableConsumer } from 'react-actioncable-provider';
import ChatBox from './ChatBox'

class Chatroom extends Component {

    child = React.createRef()

    state = {
        chatting: false,
        conversation_id: null
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

    receivedMessageToChild = (message) => {
        this.child.current.messageToState(message)
    }

    logIt(){
        console.log("Disconnected")
    }

    render(){
        return(
            <div>
                <h3>Here in chatroom</h3>
                {this.state.chatting ?
                <div>
                    {this.state.conversation_id ?
                    (<ActionCableConsumer 
                    channel={{ channel: 'ConversationsChannel', conversation_id: this.state.conversation_id}}
                    onReceived={this.receivedMessageToChild}
                    onDisconnected={this.logIt}
                    />) : null}
                    
                    <ChatBox ref={this.child} user={this.props.user} conversation_id={this.state.conversation_id} returnMessage={this.receivedMessageToChild} />

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