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

const TrackInfo = ({ songName, artistsDisplayName }) => (
  <StyledHeader>
    {songName}
    <Header.Subheader color="grey">
      {artistsDisplayName}
    </Header.Subheader>
  </StyledHeader>
);

export default TrackInfo;

TrackInfo.propTypes = {
  songName: PropType.string.isRequired,
  artistsDisplayName: PropType.string.isRequired,
};
