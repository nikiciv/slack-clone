import React from 'react';
import { connect } from 'react-redux';
import { setCurrentChannel } from '../../actions';
import firebase from '../../firebase';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

class Channels extends React.Component {
    state = {
        user: this.props.currentUser,
        channels: [],
        activeChannel: '',
        isModalOpen: false,
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        firstLoad: true,
    };

    componentDidMount() {
        this.addListeners();
    };

    componentWillUnmount() {
        this.removeListeners();
    }
    
    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
        })
    };

    removeListeners = () => {
        this.state.channelsRef.off();
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
            })
            .catch(err => {
                console.error(err);
            });
    };

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
        }
        this.setState({ firstLoad: false });
    }

    displayChannels = channels =>
        channels.length > 0 && channels.map(channel => (
        <Menu.Item
            key={channel.id}
            onClick={() => this.changeChannel(channel)}
            name={channel.name}
            style={{ opacity: 0.7 }}
            active={channel.id === this.state.activeChannel}
        >
            # {channel.name}
        </Menu.Item>
    ));

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    };

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
    }

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
                <Menu.Menu className="menu">
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" /> CHANNELS
                        </span>{" "}
                        ({ channels.length }) <Icon name="add" onClick={this.handleOpenModal}/>
                    </Menu.Item>
                    {this.displayChannels(channels)}
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

export default connect(null, { setCurrentChannel })(Channels);