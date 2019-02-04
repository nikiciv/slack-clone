import React from 'react';
import firebase from '../../firebase';
import { 
    Sidebar, 
    Menu, 
    Divider, 
    Button,
    Modal,
    Icon,
    Label, 
    Segment,
} from 'semantic-ui-react';
import { HuePicker } from 'react-color';

class ColorPanel extends React.Component {
    state = {
        isModalOpen: false,
        primary: '',
        secondary: '',
        usersRef: firebase.database().ref('users'),    
    };

    openModal = () => this.setState({ isModalOpen: true });

    closeModal = () => this.setState({ isModalOpen: false });

    handleChangePrimary = color => this.setState({ primary: color.hex });

    handleChangeSecondary = color => this.setState({ secondary: color.hex });

    handleSaveColors = () => {
        if(this.state.primary && this.state.secondary) {
            this.saveColors();
        }
    }

    saveColors = () => {
        const { primary, secondary, usersRef } = this.state; 
        const { currentUser } = this.props;

        usersRef
            .child(`${currentUser.uid}/colors`)
            .push()
            .update({
                primary, 
                secondary
            })
            .then(() => {
                console.log('Colors added');
                this.closeModal();
            })
            .catch(err => {
                console.error(err);
            })
    }

    render() {
        const { isModalOpen, primary, secondary } = this.state;
        return(
            <Sidebar
                as={Menu}
                icon="labeled"
                inverted
                vertical
                visible
                width="very thin"
            >
                <Divider />
                <Button 
                    icon="add"
                    size="small"
                    color="blue"
                    onClick={this.openModal}
                />
                <Modal 
                    basic
                    open={isModalOpen}
                    onClose={this.closeModal}
                >
                    <Modal.Header>Choose App Colors</Modal.Header>
                    <Modal.Content>
                        <Segment inverted>
                            <Label content="Primary color"/>
                            <HuePicker color={primary} onChange={this.handleChangePrimary}/>
                        </Segment>
                        <Segment inverted>
                            <Label content="Secondary color"/>
                            <HuePicker color={secondary} onChange={this.handleChangeSecondary}/>
                        </Segment>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button 
                            color="green" 
                            inverted 
                            onClick={this.handleSaveColors}
                        >
                            <Icon name="checkmark"/> Save Colors
                        </Button>
                        <Button 
                            color="red" 
                            inverted
                            onClick={this.closeModal}
                        >
                            <Icon name="remove"/> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Sidebar>
        )
    }
}

export default ColorPanel;