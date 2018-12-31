import React from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';

class Messages extends React.Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
    }

    render() {
        const { messagesRef } = this.state;
        const { currentUser, currentChannel } = this.props;

        return(
            <React.Fragment>
                <MessagesHeader 
                />
                <Segment>
                    <Comment.Group className="messages">
                    </Comment.Group>
                </Segment>
                <MessageForm 
                    messagesRef={messagesRef}
                    currentUser={currentUser}
                    currentChannel={currentChannel}
                />
            </React.Fragment>
        )
    }
}

export default Messages;