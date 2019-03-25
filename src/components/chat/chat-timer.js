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

      if (this.state.seconds === 60) {
        await this.setState({ seconds: 0, minutes: this.state.minutes + 1, secondsString: '00'})
      }

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