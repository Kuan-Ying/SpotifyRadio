import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Menu,
  Header,
  Image,
} from 'semantic-ui-react';

const StyledLink = styled(Link)`
  color: #fff;
  :hover {
    color: #afefff;
  }
`;

const Container = styled(Menu).attrs({
  inverted: true,
  pointing: true,
  color: 'black',
})`
  border-radius: 0 !important;
`;

const Navbar = ({ userInfo: { name, image } }) => (
  <Container>
    <Menu.Item position="left">
      <Header as="h5" inverted>
        <StyledLink to="/" >Home</StyledLink>
      </Header>
    </Menu.Item>
    <Menu.Item position="right">
      <Header as="h5" inverted>
        <Image circular src={image} /> {name}
      </Header>
    </Menu.Item>
  </Container>
);

export default Navbar;

Navbar.propTypes = {
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
};
