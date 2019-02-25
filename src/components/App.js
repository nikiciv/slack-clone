import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';

import ColorPanel from './ColorPanel';
import SidePanel from './SidePanel';
import MetaPanel from './MetaPanel';
import Messages from './Messages';

const App = ({ currentUser, currentChannel, isPrivateChannel, userPosts, primaryColor, secondaryColor }) => (
  <Grid columns="equal" className="app" style={{ margin: 0, background: secondaryColor}}>
    <ColorPanel 
      key={currentUser && currentUser.name}
      currentUser={currentUser}
    />
    <SidePanel 
      currentUser={currentUser}
      key={currentUser && currentUser.uid}
      primaryColor={primaryColor}
    />
    <Grid.Column style={{ marginLeft: 320 }}>
      {
        currentUser && currentChannel ?
          <Messages 
            currentUser={currentUser}
            currentChannel={currentChannel}
            key={currentChannel && currentChannel.id}
            isPrivateChannel={isPrivateChannel}
          />
        : null
      }
    </Grid.Column>
    <Grid.Column>
      <MetaPanel 
        width={4}
        key={currentChannel && currentChannel.name}
        isPrivateChannel={isPrivateChannel}
        currentChannel={currentChannel}
        userPosts={userPosts}
      />
    </Grid.Column>
  </Grid>
)

const mapSatateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts,
  primaryColor: state.colors.primaryColor,
  secondaryColor: state.colors.secondaryColor,
});

export default connect(mapSatateToProps)(App);
