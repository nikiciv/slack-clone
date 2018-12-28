import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';

import ColorPanel from './ColorPanel';
import SidePanel from './SidePanel';
import MetaPanel from './MetaPanel';
import Messages from './Messages';

const App = ({ currentUser }) => (
  <Grid columns="equal" className="app" style={{ margin: 0, background: '#eee'}}>
    <ColorPanel />
    <SidePanel 
      currentUser={currentUser}
    />
    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages />
    </Grid.Column>
    <Grid.Column>
      <MetaPanel width={4}/>
    </Grid.Column>
  </Grid>
)

const mapSatateToProps = state => ({
  currentUser: state.user.currentUser,
});

export default connect(mapSatateToProps)(App);
