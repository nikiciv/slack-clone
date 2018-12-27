import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';

class Register extends React.Component {
    state = {}

    handleChange = () => {}

    render() {
        return(
            <Grid textAlign="center" verticalAlign="middle" className="register">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="orange" textAlign="center">
                        <Icon name="puzzle piece" color="black" />
                        Register for Chat
                    </Header>
                    <Form size="large">
                        <Segment stacked>
                            <Form.Input 
                                fluid 
                                name="username" 
                                icon="user" 
                                iconPosition="left" 
                                placeholder="Username"
                                type="text"
                                onChange={this.handleChange}
                            />
                            <Form.Input 
                                fluid 
                                name="email" 
                                icon="mail" 
                                iconPosition="left" 
                                placeholder="Email Address"
                                type="email"
                                onChange={this.handleChange}
                            />
                            <Form.Input 
                                fluid 
                                name="password" 
                                icon="lock" 
                                iconPosition="left" 
                                placeholder="Password"
                                type="password"
                                onChange={this.handleChange}
                            />
                            <Form.Input 
                                fluid 
                                name="passwordConfirmation" 
                                icon="repeat" 
                                iconPosition="left" 
                                placeholder="Password Confirmation"
                                type="password"
                                onChange={this.handleChange}
                            />
                            <Button 
                                fluid
                                color="blue"
                                size="large"
                            >
                                Submit
                            </Button>
                            <Message>Already a user?<Link to="/login"> Login</Link></Message>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register;