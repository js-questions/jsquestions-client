import React, { Component } from 'react';
import '../log-in/log-in.scss';

class Overlay extends Component {

  state = {
    startTime: 5
  }

  componentDidMount() {
    this.count();
  }

  count = () => {
    const counter = setInterval(() => {
      this.setState({startTime: this.state.startTime - 1, counter: counter});
      if (this.state.startTime === 0) {
        clearInterval(counter);
        this.props.closeOverlay(this.state.counter);
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.state.counter);
  }
 
  render() {
    return (
      <div className="backdrop">
        <div className="modal">
          <div>Waiting for Tutor to Join...</div>
          <div id="counter">{this.state.startTime} seconds</div>
        </div>
      </div>
    )
  }
}

export default Overlay;