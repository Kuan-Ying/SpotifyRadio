import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Container,
  Header,
  Segment,
  Button,
} from 'semantic-ui-react';

import { RoomActionCreators } from '../../redux/modules/room';

class LandingPage extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    mobile: PropTypes.bool,
    actions: PropTypes.shape({
      createRoomRequest: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    mobile: false,
  };

  createRoom = () => {
    const { actions: { createRoomRequest } } = this.props;
    createRoomRequest();
  }

  render() {
    const { mobile } = this.props;
    return (
      <Segment
        inverted
        textAlign="center"
        style={{ minHeight: 700, padding: '1em 0em' }}
        vertical
      >
        <Container text>
          <Header
            as="h1"
            content="Spotify Radio"
            inverted
            style={{
              fontSize: mobile ? '2em' : '4em',
              fontWeight: 'normal',
              marginBottom: 0,
              marginTop: mobile ? '1.5em' : '3em',
            }}
          />
          <Header
            as="h2"
            inverted
            style={{
              fontSize: mobile ? '1.5em' : '1.7em',
              fontWeight: 'normal',
              marginTop: mobile ? '0.5em' : '1.5em',
            }}
          >
            A demonstrate of live streaming platform integrated with {' '}
            <a href="https://developer.spotify.com/documentation/web-playback-sdk/reference/">Spotify Web Playback SDK</a>{' '}and{' '}
            <a href="https://developer.spotify.com/documentation/web-api/reference/">Spotify Web API</a>.
          </Header>
          <Button primary size="huge" onClick={this.createRoom}>
            Join and Listen with Your Friends
          </Button>
        </Container>
      </Segment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...RoomActionCreators,
  }, dispatch),
});

export default connect(null, mapDispatchToProps)(LandingPage);
