import React from 'react';
import uuid from 'uuid/v4';
import firebase from '../../firebase';
import { Segment, Button, Input } from 'semantic-ui-react';

import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

class MessageForm extends React.Component {
    state = {
        message: '',
        loading: false,
        errors: [],
        isFileModalOpen: false,
        uploadState: '',
        uploadTask: null,
        storageRef: firebase.storage().ref(),
        percentUploaded: 0,
        typingRef: firebase.database().ref('typing'),
    };

    openFileModal = () => this.setState({ isFileModalOpen: true });

    closeFileModal = () => this.setState({ isFileModalOpen: false });

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.props.currentUser.uid,
                name: this.props.currentUser.displayName,
                avatar: this.props.currentUser.photoURL,
            },
        };
        if(fileUrl !== null) {
            message['image'] = fileUrl;
            
        } else {
            message['content'] = this.state.message;
        }
        return message;
    };

    uploadFile = (file, metadata) => {
        const pathToUpload = this.props.currentChannel.id;
        const ref = this.props.getMessagesRef();
        const filePath = `${this.getPath()}/${uuid()}.jpg`;

        this.setState(
        {
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
        },
        () => {
            this.state.uploadTask.on(
            'state_changed',
            snap => {
                const percentUploaded = Math.round(
                (snap.bytesTransferred / snap.totalBytes) * 100
                );
                this.setState({ percentUploaded });
            },
            err => {
                console.error(err);
                this.setState({
                errors: this.state.errors.concat(err),
                uploadState: 'error',
                uploadTask: null
                });
            },
            () => {
                this.state.uploadTask.snapshot.ref
                .getDownloadURL()
                .then(downloadUrl => {
                    this.sendFileMessage(downloadUrl, ref, pathToUpload);
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                    errors: this.state.errors.concat(err),
                    uploadState: 'error',
                    uploadTask: null
                    });
                });
            }
            );
        }
        );
    };

    sendFileMessage = (fileUrl, messagesRef, pathToUpload) => {
        messagesRef.child(pathToUpload)
            .push()
            .set(this.createMessage(fileUrl))
            .then(() => {
                this.setState({ uploadState: 'done' })
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errors: this.state.errors.concat(err)
                })
            })
    }

    sendMessage = () => {
        const { getMessagesRef, currentChannel, currentUser } = this.props;
        const { message, typingRef } = this.state;

        if(message) {
            this.setState({ loading: true });
            getMessagesRef()
                .child(currentChannel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({
                        loading: false,
                        message: '',
                        errors: [],
                    })
                    typingRef
                        .child(currentChannel.id)
                        .child(currentUser.uid)
                        .remove()
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        loading: false,
                        message: '',
                        errors: this.state.errors.concat(err),
                    })
                })
        } else {
            this.setState({
                errors: this.state.errors.concat({ message: 'Add a message.' })
            })
        }
    }

    getPath = () => {
        if(this.props.isPrivateChannel) {
            return `chat/private-${this.props.currentChannel.id}`;
        } else {
            return 'chat-public';
        }
    }

    handleKeyDown = () => {
        const { typingRef, message } = this.state;
        const { currentChannel, currentUser } = this.props;

        if(message) {
            typingRef
                .child(currentChannel.id)
                .child(currentUser.uid)
                .set(currentUser.displayName)
        } else {
            typingRef
                .child(currentChannel.id)
                .child(currentUser.uid)
                .remove()
        }
    }

    render() {
        const { 
                errors, 
                message, 
                loading, 
                isFileModalOpen, 
                uploadState, 
                percentUploaded,
        } = this.state;

        return(
            <Segment className="message__form">
                <Input 
                    fluid
                    name="message"
                    onChange={this.handleChange}
                    style={{ marginBottom: '0.7em' }}
                    label={<Button icon={'add'} />}
                    value={message}
                    onKeyDown={this.handleKeyDown}
                    labelPosition="left"
                    className={
                        errors.some(error => error.message.includes('message')) ? 'error' : ''
                    }
                    placeholder="Write your message"
                />
                <Button.Group icon widths="2">
                    <Button 
                        color="orange"
                        content="Add Reply"
                        disabled={loading}
                        onClick={this.sendMessage}
                        labelPosition="left"
                        icon="edit"
                    />
                    <Button 
                        color="teal"
                        onClick={this.openFileModal}
                        content="Upload Media"
                        disabled={uploadState === 'uploading'}
                        labelPosition="right"
                        icon="cloud upload"
                    />
                </Button.Group>
                 <FileModal 
                        isFileModalOpen={isFileModalOpen} 
                        closeFileModal={this.closeFileModal}
                        uploadFile={this.uploadFile}
                  />
                  <ProgressBar 
                    uploadState={uploadState}
                    percentUploaded={percentUploaded}
                  />
            </Segment>
        )
    }
}

export default MessageForm;


