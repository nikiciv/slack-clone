import React from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

class Channels extends React.Component {
    state = {
        channels: [],
        isModalOpen: false,
        channelName: '',
        channelDetails: '',
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
                        <Form>
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
                        <Button color="green" inverted>
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