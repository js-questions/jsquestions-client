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
      this.setState({startTime: this.state.startTime - 1});
      if (this.state.startTime === 0) {
        this.props.closeOverlay();
        clearInterval(counter);
      }
    }, 1000);
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