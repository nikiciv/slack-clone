import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import { Loader, Dimmer } from 'semantic-ui-react';
import './index.css';
import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import 'semantic-ui-css/semantic.min.css'
import firebase from './firebase';

import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { setUser, clearUser } from './actions';

const store = createStore(rootReducer, composeWithDevTools());


class Root extends React.Component {

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if(user) {
                console.log('isLoading', this.props.isLoading);
                this.props.setUser(user);
                this.props.history.push('/');
            } else {
                this.props.history.push('/login');
                this.props.clearUser();
            }
        })
    }

    render() {
        return this.props.isLoading ? 
            (
                <Dimmer active>
                    <Loader size="huge" content="Preparing Chat..." />
                </Dimmer>
            )
            : 
            (
                <Switch>
                    <Route exact path="/" component={App}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                </Switch>
            )
    }
};

const mapStateToProps = state => ({
    isLoading: state.user.isLoading,
});

const RootWithAuth = withRouter(connect(mapStateToProps, { 
    setUser,
    clearUser,
    })(Root));


ReactDOM.render(
    <Provider store={store}>
        <Router>
            <RootWithAuth />
        </Router>
    </Provider>,
    document.getElementById('root')
);


