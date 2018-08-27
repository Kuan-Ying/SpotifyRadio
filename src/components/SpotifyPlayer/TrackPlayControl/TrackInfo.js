import React from 'react';
import styled from 'styled-components';
import PropType from 'prop-types';
import { Header } from 'semantic-ui-react';

const StyledHeader = styled(Header).attrs({
  inverted: true,
  as: 'h4',
})`
  padding-top: 10px;
`;

const TrackName = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 200px;
  display: block;
  overflow: hidden;
`;

const ArtistName = styled(Header.Subheader).attrs({
  color: 'grey',
})`
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 200px;
  display: block;
  overflow: hidden;
`;

const TrackInfo = ({ songName, artistsDisplayName }) => (
  <StyledHeader>
    <TrackName>{songName}</TrackName>
    <ArtistName>{artistsDisplayName}</ArtistName>
  </StyledHeader>
);

export default TrackInfo;

TrackInfo.propTypes = {
  songName: PropType.string.isRequired,
  artistsDisplayName: PropType.string.isRequired,
};
