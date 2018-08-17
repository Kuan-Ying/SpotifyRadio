import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Progress = styled.div`
  width: ${({ percent }) => `${percent}`}%;
  height: 5px;
  background: #a3a3a3;
`;

const Container = styled.div`
  width: 200px;
  height: 5px;
  background: #3f3f3f;
  border-radius: 4px;
`;

export default class extends React.Component {
  static propTypes = {
    percent: PropTypes.number.isRequired,
  };

  render() {
    const { percent } = this.props;
    return (
      <Container>
        <Progress percent={percent} />
      </Container>
    );
  }
};
