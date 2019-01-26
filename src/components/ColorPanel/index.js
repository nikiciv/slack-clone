import React from 'react';
import { 
    Sidebar, 
    Menu, 
    Divider, 
    Button,
    Modal,
    Icon,
    Label, 
} from 'semantic-ui-react';
import { HuePicker } from 'react-color';

class ColorPanel extends React.Component {
    state = {
        isModalOpen: false,
    }

    openModal = () => this.setState({ isModalOpen: true });

    closeModal = () => this.setState({ isModalOpen: false });

    render() {
        const { isModalOpen } = this.state;
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
                        <Label content="Primary color"/>
                        <HuePicker />
                        <Label content="Secondary color"/>
                        <HuePicker />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="green" inverted>
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