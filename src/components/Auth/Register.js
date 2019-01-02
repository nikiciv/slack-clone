import React from 'react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import md5 from 'md5';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';

class Register extends React.Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],   
        loading: false,
        usersRef: firebase.database().ref('users'),
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    isFormEmpty = () => {
        const { username, email, password, passwordConfirmation } = this.state;
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }

    isPasswordValid = () => {
        const { password, passwordConfirmation } = this.state;
        if(password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        } else if (password !== passwordConfirmation) {
            return false;
        } else {
            return true;
        }
    }

    isFormValid = () => {
        let errors = [];
        let error;
          
        if(this.isFormEmpty()) {
            error = { message: 'Fill in all fields' };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else if (!this.isPasswordValid()) {
            error = { message: 'Password is invalid' };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else {
            return true;
        }
    }

    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid()) {
            this.setState({
                errors: [],
                loading: true,
            });
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    createdUser.user.updateProfile({
                        displayName: this.state.username,
                        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    })
                    .then(() => {
                        this.saveUser(createdUser).then(() => {
                            this.setState({ loading: false });                           
                        })
                    })
                    .catch(err => {
                        this.setState({ errors: this.state.errors.concat(err), loading: false });
                        console.error(err);
                    })
                })
                .catch(err => {
                    this.setState({ errors: this.state.errors.concat(err), loading: false });
                    console.error(err);
                })
        }
    };

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

    handleInputError = (inputName) => {
        return this.state.errors.some(error => 
                error.message.toLowerCase().includes(inputName)
                ) 
                ? 'error' 
                : '';
    };

    saveUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL,
        });
    }

    render() {  
        const { username, email, password, passwordConfirmation, errors, loading  } = this.state;

        return(
            <Grid textAlign="center" verticalAlign="middle" className="register">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="orange" textAlign="center">
                        <Icon name="puzzle piece" color="black" />
                        Register for Chat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input 
                                fluid 
                                name="username" 
                                icon="user" 
                                iconPosition="left" 
                                placeholder="Username"
                                type="text"
                                value={username}
                                onChange={this.handleChange}
                            />
                            <Form.Input 
                                fluid 
                                name="email" 
                                icon="mail" 
                                iconPosition="left" 
                                placeholder="Email Address"
                                type="email"
                                value={email}
                                className={this.handleInputError('email')}
                                onChange={this.handleChange}
                            />
                            <Form.Input 
                                fluid 
                                name="password" 
                                icon="lock" 
                                iconPosition="left" 
                                placeholder="Password"
                                type="password"
                                value={password}
                                className={this.handleInputError('password')}
                                onChange={this.handleChange}
                            />
                            <Form.Input 
                                fluid 
                                name="passwordConfirmation" 
                                icon="repeat" 
                                iconPosition="left" 
                                placeholder="Password Confirmation"
                                type="password"
                                value={passwordConfirmation}
                                className={this.handleInputError('password')}
                                onChange={this.handleChange}
                            />
                            <Button 
                                fluid
                                color="blue"
                                size="large"
                                disabled={loading}
                                className={loading ? 'loading' : ''}
                            >
                                Submit
                            </Button>
                            <Message>Already a user? <Link to="/login">Login</Link></Message>
                        </Segment>
                    </Form>
                    {
                        errors.length > 0 &&  
                            <Message error>
                                <h3>Error</h3>
                                {this.displayErrors(errors)}
                            </Message>
                    }
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register;