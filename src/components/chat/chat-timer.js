/* -------------------------------------------------------------------
Chat-timer class:
This component components displays a timer within the chat component.
The timer rerenders every second. It counts up to 15 minutes, at which point it turns red,
but will continue counting until the call is ended.
---------------------------------------------------------------------- */

import React, { Component } from 'react';
import './chat.scss';

class ChatTimer extends Component {

  state = {
    minutes: 0,
    seconds: 0,
    secondsString: '00',
    overTime: 'black'
  }

  startTimer = () => {
    setInterval(async () => {
      this.setState({seconds: this.state.seconds + 1})
      if (this.state.seconds < 10 ) this.setState({secondsString: '0' + this.state.seconds})
      else this.setState({secondsString: this.state.seconds})

      // If seconds === 60, change seconds to 0 or 00 and increase minutes by 1
      if (this.state.seconds === 60) {
        await this.setState({ seconds: 0, minutes: this.state.minutes + 1, secondsString: '00'})
      }

      // Timer changes to red when a certain time is reached (15 minutes by default)
      if (this.state.minutes === 15) {
        this.setState({ overTime: 'red'});
      }

    }, 1000)
  }

  render() {
    return(
       <h3 id="timer" style={{color: this.state.overTime}}>{this.state.minutes}:{this.state.secondsString}</h3>
    )
  }

}

export default ChatTimer;