import React from 'react';
import PropType from 'prop-types';
import { Header } from 'semantic-ui-react';

const TrackInfo = ({ songName, artistsDisplayName }) => (
  <Header inverted as="h5">
    {songName}
    <Header.Subheader inverted color="grey">
      {artistsDisplayName}
    </Header.Subheader>
  </Header>
);

export default TrackInfo;

TrackInfo.propTypes = {
  songName: PropType.string.isRequired,
  artistsDisplayName: PropType.string.isRequired,
};
