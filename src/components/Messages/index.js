import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import { connect } from 'react-redux';
import { setUserPosts } from '../../actions';
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";
import Typing from "./Typing"; 

class Messages extends React.Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    usersRef: firebase.database().ref("users"),
    privateMessagesRef: firebase.database().ref("private-messages"),
    messages: [],
    messagesLoading: true,
    numUniqueUsers: '',
    searchTerm: '',
    searchLoading: false,
    searchResults: [],
    isChannelStarred: false,
  };

  componentDidMount() {
    const { currentChannel, currentUser } = this.props;
    if (currentChannel && currentUser) {
      this.addListeners(currentChannel.id);  
      this.addUsersStarsListener(currentChannel.id, currentUser.uid);
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
      this.countUserPosts(loadedMessages);
    });
  };

  addUsersStarsListener = (channelId, userId) => {
     this.state.usersRef
        .child(userId)
        .child('starred')
        .once('value')
        .then(data => {
          if(data.val() !== null) {
            const channelIds = Object.keys(data.val());
            const prevStarred = channelIds.includes(channelId);
            this.setState({ isChannelStarred:   prevStarred });
          }
        })
  }

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

  countUserPosts = messages => {
    let userPosts = messages.reduce((acc, message) => {
      if(message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1,
        }
      }
      return acc;
    }, {});
    this.props.setUserPosts(userPosts);
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

  handleStarClick = () => {
    this.setState(prevState => ({
      isChannelStarred: !prevState.isChannelStarred
    }), () => this.starChannel());
  }

  starChannel = () => {
    if(this.state.isChannelStarred) {
      this.state.usersRef
        .child(`${this.props.currentUser.uid}/starred`)
        .update({
          [this.props.currentChannel.id]: {
            name: this.props.currentChannel.name,
            details: this.props.currentChannel.details,
            createdBy: {
              name: this.props.currentChannel.createdBy.name,
              avatar: this.props.currentChannel.createdBy.name
            }
          }
        })
    } else {
      this.state.usersRef
        .child(`${this.props.currentUser.uid}/starred`)
        .child(this.props.currentChannel.id)
        .remove(err => {
          if(err !== null) {
            console.error(err);
          } 
        })
    }
  }

  render() {
    const { messagesRef, messages, numUniqueUsers, searchTerm, searchResults, searchLoading, isChannelStarred } = this.state;
    const { currentChannel, currentUser, isPrivateChannel } = this.props;

    return (
      <React.Fragment>
        <MessagesHeader 
          channelName={this.displayChannelName(currentChannel)}
          numUniqueUsers={numUniqueUsers} 
          onSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={isPrivateChannel}
          onStarClick={this.handleStarClick}
          isChannelStarred={isChannelStarred}
        />
        <Segment>
          <Comment.Group className="messages">
            {searchTerm ? 
              this.displayMessages(searchResults)
            : 
              this.displayMessages(messages)
            }
            <div style={{ display: 'flex', alignItems: 'center'}}>
              <span className="user__typing">ivo is typing</span> <Typing />
            </div>
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

export default connect(null, { setUserPosts })(Messages);
