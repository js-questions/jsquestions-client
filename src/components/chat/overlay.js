/* ------------------------------------------------------------------------
Overlay component:
This component is a modal that is displayed to the learner before entering
the chat. The component displays a timer that indicates the time the
waiting time for the tutor to join.
If the timer finishes, the learner is redirected back to the question-posted page.
Otherwise, if the tutor accepts the call, both the learner and the tutor
access the chat.
--------------------------------------------------------------------------- */

import React, { Component } from 'react';
import '../log-in/log-in.scss';

class Overlay extends Component {

  // Stating time is seconds of the timer
  state = {
    startTime: 60
  }

  componentDidMount() {
    this.count();
  }

  // Modify the timer's time every second and close the modal when the timer reaches 0s.
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
        <div className="modal modal-still">
          <div>Waiting for Tutor to Join...</div>
          <div id="counter">{this.state.startTime} seconds</div>
        </div>
      </div>
    )
  }
}

export default Overlay;