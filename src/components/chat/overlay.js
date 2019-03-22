import React, { Component } from 'react';
import '../log-in/log-in.scss';

class Overlay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tutorHasJoined: false,
      timesUp: false
    }
  }

  componentDidMount () {
    this.checkTimer();
  }

  timer = () => {
    setTimeout(() => {
      this.setState({timesUp: true})
    }, 5000);
  }

  checkTimer = () => {
    if (this.state.timesUp) {
      console.log('Sorry, it looks like your tutor could not join right now. Button: Back to my questions')
    } else if (this.state.tutorHasJoined) {
      console.log('overlay should close');
      this.props.closeOverlay();
    } else {
      const now = new Date().getTime();
      console.log('timer is running', now)
    }
  }

  render() {
    return (
      <div className="backdrop">
        
        <div className="modal">
          <div>Waiting for Tutor to Join...</div>
        </div>
      </div>
    )
  }
}

export default Overlay;