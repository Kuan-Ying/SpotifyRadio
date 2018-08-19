import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  Icon,
  Dimmer,
  Loader,
} from 'semantic-ui-react';

import { getDurationDisplay } from '../../helpers/time';
import OptionDropdown from './OptionDropdown';

// TODO: connect to redux store and call spotify actions
export default class SongTable extends Component {
  static propTypes = {
    tracks: PropTypes.array.isRequired,
    isLoading: PropTypes.bool,
    onCallback: PropTypes.func,
  };

  static defaultProps = {
    tracks: [],
    isLoading: false,
    onCallback: () => null,
  }

  state = {
    showOptionsAt: -1,
  };

  addToQueue = (spotifyUri) => {
    // TODO: use actions.addToQueueRequest();
    console.log(spotifyUri);
    const { onCallback } = this.props;
    onCallback();
  }

  renderContent = () => {
    const { tracks } = this.props;
    const { showOptionsAt } = this.state;
    return tracks.map(({ songName, durationMs, artists, spotifyUri }, index) => (
      <Table.Row
        key={spotifyUri}
        onMouseEnter={() => this.setState({ showOptionsAt: index })}
        onMouseLeave={() => this.setState({ showOptionsAt: -1 })}
      >
        <Table.Cell>{songName}</Table.Cell>
        <Table.Cell>{artists.join(', ')}</Table.Cell>
        <Table.Cell>{getDurationDisplay(durationMs)}</Table.Cell>
        <Table.Cell>
          <OptionDropdown
            visible={showOptionsAt === index}
            onClick={() => this.addToQueue(spotifyUri)}
          />
        </Table.Cell>
      </Table.Row>
    ));
  }

  render() {
    const { isLoading } = this.props;
    if (isLoading) {
      return (
        <Dimmer active>
          <Loader content="Loading" />
        </Dimmer>
      );
    }

    return (
      <Table color="black" inverted selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>TITLE</Table.HeaderCell>
            <Table.HeaderCell>ARTIST</Table.HeaderCell>
            <Table.HeaderCell><Icon name="time" /></Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.renderContent()}
        </Table.Body>
      </Table>
    );
  }
}
