import React from 'react'
import '../App.css';
import Chatroom from './Chatroom';

class UserOptions extends React.Component {

    state = {
        joinedChatroom: false
    }

    handleChatClick = () => {
        this.setState({
            joinedChatroom: true
        })
    }

    handleLeaveChat = () => {
        this.setState({
            joinedChatroom: false
        })
    }

    render(){
        const {user} = this.props
        return(
            <div>
                {this.state.joinedChatroom ?
                <Chatroom leaveChat={this.handleLeaveChat} user={user} /> :
                <div id="user-options-container">
                {user.name}
                <button className="user-options-buttons" onClick={this.handleChatClick}>Chat</button>
                <button className="user-options-buttons" onClick={this.props.signOut}>Log Out</button>
                </div> 
                }
            </div>
        )
    }
}

export default UserOptions
