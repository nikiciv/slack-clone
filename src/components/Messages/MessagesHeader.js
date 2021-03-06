import React from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

class MessagesHeader extends React.Component {

    render() {
        const { channelName, numUniqueUsers, onSearchChange, searchLoading, isPrivateChannel, onStarClick, isChannelStarred } = this.props;

        return(
            <Segment clearing>
                <Header fluid="true" as="h2" floated="left" style={{marginBottom: 0}}>
                    <span>
                        {channelName}
                        {!isPrivateChannel && 
                            <Icon 
                                name={isChannelStarred ? 'star' : 'star outline'} 
                                color={isChannelStarred ? 'yellow' : 'black'}
                                onClick={onStarClick}
                            />
                        }
                    </span>
                    <Header.Subheader>{numUniqueUsers}</Header.Subheader>
                </Header>
                <Header floated="right">
                    <Input 
                        loading={searchLoading}
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="Search Messages"
                        onChange={onSearchChange}
                    />
                </Header>
            </Segment>
        )
    }
}

export default MessagesHeader;


