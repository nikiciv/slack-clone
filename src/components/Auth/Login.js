import React from 'react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';

class Login extends React.Component {
    state = {
        email: '',
        password: '',
        errors: [],   
        loading: false,
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    isFormValid = () => {
        const { email, password } = this.state; 
        return email && password;
    };

    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid()) {
            this.setState({
                errors: [],
                loading: true,
            });
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signedInUser => {
                    this.setState({ loading: false });
                })
                .catch(err => {
                    this.setState({ errors: this.state.errors.concat(err), loading: false });
                });
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

    render() {  
        const { email, password, errors, loading  } = this.state;

        return(
            <Grid textAlign="center" verticalAlign="middle" className="register">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="violet" textAlign="center">
                        <Icon name="code branch" color="violet" />
                        Login to Chat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
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
                            <Button 
                                fluid
                                color="violet"
                                size="large"
                                disabled={loading}
                                className={loading ? 'loading' : ''}
                            >
                                Submit
                            </Button>
                            <Message>Don't have an account? <Link to="/register">Register</Link></Message>
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

export default Login;