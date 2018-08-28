import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Segment,
  Message,
} from 'semantic-ui-react';
import styled from 'styled-components';

import SpotifyPlayer from '../SpotifyPlayer';
import SearchModal from '../SearchModal';
import Navbar from './Navbar';
import ChatRoom from '../ChatRoom';

import {
  RoomActionCreators,
  warnSelector,
} from '../../redux/modules/room';
import {
  UserActionCreators,
} from '../../redux/modules/user';
import { extractedUserInfoSelector } from './selectors';

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

class RadioRoom extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
    actions: PropTypes.shape({
      enterRoomRequest: PropTypes.func.isRequired,
    }).isRequired,
    error: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    warn: PropTypes.string.isRequired,
    userInfo: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const {
      match: { params: { id } },
      actions: {
        enterRoomRequest,
        fetchCurrentUserInfoRequest,
      },
    } = this.props;
    enterRoomRequest(id);
    fetchCurrentUserInfoRequest();
  }

  renderMessage = () => {
    const {
      error,
      warn,
    } = this.props;

    if (error) {
      return (
        <Message negative attached>
          <Message.Header>Cannot find radio room</Message.Header>
          <p>{warn} Will redirect to homepage in 3 seconds</p>
        </Message>
      );
    }
    return null;
  }

  render() {
    return (
      <div>
        {this.renderMessage()}
        <Navbar userInfo={this.props.userInfo} />
        <Content>
          <Segment compact style={{ padding: 0, margin: 50 }}>
            <SearchModal />
            <SpotifyPlayer />
          </Segment>
          <ChatRoom />
        </Content>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  error: state.room.error,
  warn: warnSelector(state),
  userInfo: extractedUserInfoSelector(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...RoomActionCreators,
    ...UserActionCreators,
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RadioRoom);
