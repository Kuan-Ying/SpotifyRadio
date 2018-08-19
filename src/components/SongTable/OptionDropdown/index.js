import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';


export default class extends Component {
  render() {
    const {
      visible,
      onClick,
    } = this.props;
    return (
      <Dropdown
        direction="left"
        icon="ellipsis horizontal"
        style={{ visibility: visible ? 'visible' : 'hidden' }}
      >
        <Dropdown.Menu>
          <Dropdown.Item text="Add to Queue" onClick={onClick} />
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
