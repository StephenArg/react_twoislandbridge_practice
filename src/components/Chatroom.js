import React, { Component } from 'react';
import '../App.css';
import { ActionCableConsumer } from 'react-actioncable-provider';
import ChatBox from './ChatBox'
// import $ from 'jquery'

class Chatroom extends Component {

    child = React.createRef()

    state = {
        chatting: false,
        conversation_id: null,
        videoID: null
    }

    componentDidMount = () => {
        // setTimeout(() => {
        //    $('#leave').trigger('click')
        // }, 7000)
    }


    startChatting = () => {
        this.setState({
            chatting: true,
            videoID: null
        })
        fetch(`${process.env.REACT_APP_API_LOCATION}/api/conversation/search`, {
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
            conversation_id: object.conversation_id,
            videoID: object.videoID
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

    fetchConnections = () => {
        fetch(`${process.env.REACT_APP_API_LOCATION}/api/connections/${this.props.user.id}`)
        .then(res => res.json())
        .then(this.child.current.setConnections)
    }

    render(){
        let videoAddress = `https://tokbox.com/embed/embed/ot-embed.js?embedId=4883260d-b162-4821-a974-c8cbdd574cb1&room=${this.state.videoID}&iframe=true`
        return(
            <div>
                <h3> </h3>
                {this.state.chatting && this.state.videoID ?
                <div className="chatroom-container">
                    <div className="video-frame">
                    {this.state.videoID ?
                    (<iframe title="video-frame" id="video-feed-main" src={videoAddress} width="800" height="640" scrolling="auto" allow="microphone; camera" ></iframe>) 
                    : null}
                    </div>

                    <div className="chat-box">
                        {this.state.conversation_id ?
                        (
                        <ActionCableConsumer 
                        channel={{ channel: 'ConversationsChannel', conversation_id: this.state.conversation_id, user_id: this.props.user.id}}
                        onReceived={this.receivedMessageToChild}
                        onDisconnected={this.logIt}
                        />) : null}
                        
                        <ChatBox ref={this.child} user={this.props.user} connections={this.fetchConnections} conversation_id={this.state.conversation_id} returnMessage={this.receivedMessageToChild} />

                        <button onClick={this.stopChatting} >Stop Chatting</button> 
                        <button onClick={this.startChatting} >Next</button>
                    </div>
                </div>
                :
                <button onClick={this.startChatting} >Start Chatting</button>
                }
                <button id="leave" onClick={this.props.leaveChat} >Leave Chat</button>
            </div>
        )
    }
}

export default Chatroom