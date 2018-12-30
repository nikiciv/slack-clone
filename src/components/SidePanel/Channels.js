import React from 'react';
import firebase from '../../firebase';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

class Channels extends React.Component {
    state = {
        user: this.props.currentUser,
        channels: [],
        isModalOpen: false,
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
    };

    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid()) {
            this.addChannel();
        }
    }

    addChannel = () => {
        const { channelsRef, channelName, channelDetails, user } = this.state;
        const key = channelsRef.push().key;
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL,
            }
        };

        channelsRef 
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({
                    channelName: '',
                    channelDetails: '',
                });
                this.handleCloseModal();
                console.log('channle');
            })
            .catch(err => {
                console.error(err);
            });
    };

    isFormValid = () => {
        const { channelName, channelDetails } = this.state;
        return channelName && channelDetails;
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    handleCloseModal = () => this.setState({ isModalOpen: false });

    handleOpenModal = () => this.setState({ isModalOpen: true });
 

    render() {
        const { channels, isModalOpen } = this.state;
        return(
           <React.Fragment>
                <Menu.Menu style={{ paddingBottom: '2em'}}>
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" /> CHANNELS
                        </span>{" "}
                        ({ channels.length }) <Icon name="add" onClick={this.handleOpenModal}/>
                    </Menu.Item>
                </Menu.Menu>
                {/* Add Channel Modal */}
                <Modal basic open={isModalOpen} onClose={this.handleCloseModal}>
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input 
                                    fluid
                                    label="Channel name"
                                    name="channelName"
                                    onChange={this.handleChange}
                                />
                                <Input 
                                    fluid
                                    label="About the channel"
                                    name="channelDetails"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.handleSubmit}>
                            <Icon name="checkmark"/> Add
                        </Button>
                        <Button color="red" inverted onClick={this.handleCloseModal}>
                            <Icon name="remove"/> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
           </React.Fragment>
        )
    }
}

export default Channels;