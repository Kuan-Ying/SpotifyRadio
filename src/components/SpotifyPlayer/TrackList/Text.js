import React from 'react';
import styled from 'styled-components';
import { List } from 'semantic-ui-react';

const Text = styled(({ isPlaying, ...props }) => <List.Content {...props} />)`
  color: ${({ isPlaying, activecolor, inactivecolor }) => (isPlaying ? activecolor : inactivecolor)};
`;

export default Text;
