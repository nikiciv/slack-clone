import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

class Messages extends React.Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    privateMessagesRef: firebase.database().ref("private-messages"),
    messages: [],
    messagesLoading: true,
    numUniqueUsers: '',
    searchTerm: '',
    searchLoading: false,
    searchResults: [],
  };

  componentDidMount() {
    const { currentChannel, currentUser } = this.props;
    if (currentChannel && currentUser) {
      this.addListeners(currentChannel.id);
    }
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages);
    });
  };

  countUniqueUsers = loadedMessages => {
    const uniqueUsers = loadedMessages.reduce((acc, message) => {
      if(!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's': ''}`;
    this.setState({ numUniqueUsers });
  }

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef } = this.state;
    return this.props.isPrivateChannel ? privateMessagesRef : messagesRef;
  }

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.props.currentUser}
      />
  ));

  displayChannelName = currentChannel => {
    return currentChannel ? `${this.props.isPrivateChannel ? '@' : '#'}${currentChannel.name}` : '';
  };

  handleSearchChange = event => {
    this.setState({
      searchTerm: event.target.value,
      searchLoading: true,
    }, () => this.handleSearchMessages());
  };

  handleSearchMessages = () => {
    //in order to be sure to not mutate the messages
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, 'gi');
    if(channelMessages) { 
      const searchResults = channelMessages.reduce((acc, message) => {
        // eslint-disable-next-line
        if(message.content && message.content.match(regex) || message.user.name.match(regex)) {
          acc.push(message);
        }
        return acc;
      }, []);
    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false}), 500);
    }
  }

  render() {
    const { messagesRef, messages, numUniqueUsers, searchTerm, searchResults, searchLoading } = this.state;
    const { currentChannel, currentUser, isPrivateChannel } = this.props;

    return (
      <React.Fragment>
        <MessagesHeader 
          channelName={this.displayChannelName(currentChannel)}
          numUniqueUsers={numUniqueUsers} 
          onSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={isPrivateChannel}
        />
        <Segment>
          <Comment.Group className="messages">
            {searchTerm ? 
              this.displayMessages(searchResults)
            : 
              this.displayMessages(messages)
            }
          </Comment.Group>
        </Segment>

        <MessageForm
          messagesRef={messagesRef}
          currentChannel={currentChannel}
          currentUser={currentUser}
          isPrivateChannel={isPrivateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </React.Fragment>
    );
  }
}

export default Messages;
