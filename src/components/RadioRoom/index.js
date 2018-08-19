import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';

import SpotifyPlayer from '../SpotifyPlayer';
import SearchModal from '../SearchModal';

class RadioRoom extends Component {
  render() {
    return (
      <Segment compact style={{ padding: 0 }}>
        <SearchModal />
        <SpotifyPlayer />
      </Segment>
    );
  }
}

export default RadioRoom;
