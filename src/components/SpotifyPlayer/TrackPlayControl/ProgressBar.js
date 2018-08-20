import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Progress = styled.div`
  position: relative;
  width: ${({ percent }) => percent}%;
  height: 5px;
  background: ${({ active }) => (active ? '#42f46e' : '#9b9da0')};
  border-radius: 4px;
`;

const FullProgress = styled.div`
  width: 150px;
  height: 5px;
  background: #3f3f3f;
  border-radius: 4px;
`;

const Circle = styled.div`
  visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
  position: absolute;
  z-index: 1;
  background: white;
  height: 10px;
  width: 10px;
  top: -2px;
  left: calc(100% - 2px);
  border-radius: 10px;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
`;

export default class extends React.Component {
  static propTypes = {
    percent: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  state ={
    isMounsEntered: false,
  };

  handleClick = (e) => {
    const bounds = e.target.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const width = e.currentTarget.offsetWidth;
    const { onClick } = this.props;
    onClick(x / width);
  }

  render() {
    const { percent } = this.props;
    const { isMounsEntered } = this.state;
    return (
      <Container
        onClick={this.handleClick}
        onMouseEnter={() => this.setState({ isMounsEntered: true })}
        onMouseLeave={() => this.setState({ isMounsEntered: false })}
      >
        <FullProgress>
          <Progress percent={percent} active={isMounsEntered}>
            <Circle active={isMounsEntered} />
          </Progress>
        </FullProgress>
      </Container>
    );
  }
}
