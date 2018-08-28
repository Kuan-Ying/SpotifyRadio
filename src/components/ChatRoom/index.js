import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
  Segment,
  Button,
  TextArea,
} from 'semantic-ui-react';

import MessageList from './MessageList';
import {
  RoomActionCreators,
  messagesSelector,
  isLoadingMessagesSelector,
} from '../../redux/modules/room';

const Container = styled(Segment).attrs({
  compact: true,
})`
  height: 600px;
  width: 400px;
  display: flex !important;
  flex-direction: column;
  background: #e5e5e5 !important;
`;

const StyledTextArea = styled(TextArea)`
  width: 100%;
  margin-bottom: 10px;
  margin-top: auto;
`;

const Control = styled.div`
  display: flex !important;
  flex-direction: row;
  justify-content: flex-end;
`;

const ChatButton = styled(Button).attrs({
  color: 'violet',
  content: 'Chat',
})``;

class ChatRoom extends Component {
  static propTypes = {
    messages: PropTypes.array.isRequired,
    actions: PropTypes.shape({
      postMessageRequest: PropTypes.func.isRequired,
    }).isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  state = {
    message: '',
  };

  handleSubmit = () => {
    const { message } = this.state;
    const {
      actions: {
        postMessageRequest,
      },
    } = this.props;
    postMessageRequest(message);
    this.setState({ message: '' });
  }

  handleEnter = ({ key }) => {
    if (key === 'Enter') {
      this.handleSubmit();
    }
  };

  render() {
    const { message } = this.state;
    const {
      messages,
      isLoading,
    } = this.props;
    return (
      <Container>
        <MessageList isLoading={isLoading} messages={messages} />
        <StyledTextArea
          placeholder="Send a message"
          value={message}
          onKeyPress={this.handleEnter}
          onChange={({ target: { value } }) => this.setState({ message: value })}
        />
        <Control>
          <ChatButton onClick={this.handleSubmit} />
        </Control>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  messages: messagesSelector(state),
  isLoading: isLoadingMessagesSelector(state),
});


const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...RoomActionCreators,
  }, dispatch),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatRoom);
