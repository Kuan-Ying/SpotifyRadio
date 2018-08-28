import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  List,
  Dimmer,
  Loader,
  Image,
} from 'semantic-ui-react';

const StyledList = styled(List).attrs({
  divided: true,
  relaxed: true,
})`
  height: 500px;
  overflow-y: auto;
`;

const StyledListItem = styled(List.Item)`
  border: none !important;
`;

const Name = styled.span`
  color: blue;
  padding-left: 5px;
`;

export default class extends Component {
  static propTypes = {
    messages: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  render() {
    const {
      messages,
      isLoading,
    } = this.props;
    return (
      <StyledList>
        <Dimmer active={isLoading} inverted>
          <Loader content="Loading" />
        </Dimmer>
        {messages.map(({ name, image, message, timestamp }) => (
          <StyledListItem key={timestamp}>
            <List.Content key={timestamp}>
              <Image avatar src={image} />
              <Name>{name}</Name>: {message}
            </List.Content>
          </StyledListItem>
        ))}
      </StyledList>
    );
  }
}
