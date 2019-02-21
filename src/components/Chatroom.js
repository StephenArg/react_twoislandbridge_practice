import React, { Component } from 'react';
import '../App.css';

class Chatroom extends Component {

    state = {
        chatting: false
    }

    startChatting = () => {
        this.setState({
            chatting: true
        })
    }

    stopChatting = () => {
        this.setState({
            chatting: false
        })
    }

    render(){
        return(
            <div>
                <h3>Here in chatroom</h3>
                {this.state.chatting ?
                <button onClick={this.stopChatting} >Stop Chatting</button> :
                <button onClick={this.startChatting} >Start Chatting</button>
                }
                <button onClick={this.props.leaveChat} >Leave Chat</button>
            </div>
        )
    }
}

export default Chatroom