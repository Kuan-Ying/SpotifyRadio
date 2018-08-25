import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

const StyledDropdown = styled(Dropdown).attrs({
  direction: 'left',
  icon: 'ellipsis horizontal',
})`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`;

export default class extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    visible: true,
  };

  render() {
    const {
      visible,
      onClick,
    } = this.props;
    return (
      <StyledDropdown
        visible={visible ? 1 : 0}
      >
        <Dropdown.Menu>
          <Dropdown.Item text="Add to Queue" onClick={onClick} />
        </Dropdown.Menu>
      </StyledDropdown>
    );
  }
}
