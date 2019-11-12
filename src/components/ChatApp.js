import React, {Component} from 'react';
import { instanceLocator, tokenUrl } from '../config';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import Input from './Input';
import MessageList from './MessageList';


class ChatApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            currentRoom: {users:[]},
            messages: [],
            users: [],
        }
        this.addMessage = this.addMessage.bind(this)
    }

    componentDidMount() {
        const chatManager = new ChatManager({
            instanceLocator: instanceLocator,
            userId: this.props.currentId,
            tokenProvider: new TokenProvider({
                url: tokenUrl,
            })
        })

        chatManager
            .connect()
            .then(currentUser =>{
                this.setState({currentUser: currentUser})
                return currentUser.subscribeToRoom({
                    roomId: "28918a51-d328-4739-ba6c-275676a84897",
                    messageLimit: 100,
                    hooks: {
                        onMessage: message => {
                            this.setState({
                                messages: [...this.state.messages, message],
                            })
                        }
                    }
                })
            })
            .then(currentRoom => {
                this.setState({
                    currentRoom,
                    users: currentRoom.userIds
                })
            })
            .catch(error => console.log(error))

    }

    addMessage(text) {
        this.state.currentUser.sendMessage({
            text, 
            roomId: this.state.currentRoom.id
        })
        .catch(error => console.error('error', error))

    }

    render() {
        return(
            <div>
                <h2 className="header">Hi there! Ask anything.</h2>
                <MessageList messages={this.state.messages} />
                <Input className="input-field" onSubmit={this.addMessage}/>
                
            </div>
        )
    }
}

export default ChatApp;