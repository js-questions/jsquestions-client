import React, { Component } from 'react';
import './chat.scss';

import { connect } from 'react-redux';
import CodeEditor from './codeeditor';
import ChatMessages from './chat-messages';

import Overlay from './overlay';
import ModalEndChat from './../modal/modal-end-chat';

class Chat extends Component {

  state = {
    roomId: this.props.location.pathname.split('/')[2],
    questionId: this.props.location.pathname.split('/')[3],
    tutorOrLearner: this.props.location.pathname.split('/')[4],
    showFeedbackModal: false,
    tutorJoined: false,
    minutes: 0,
    seconds: 0,
    secondsString: '00',
    overTime: 'black'
  }

  componentDidMount() {
    //const room = this.props.room; //Amber removed this ... TTD to refractor
    this.props.socket.emit('join room', this.state.roomId)

    this.props.socket.on('join room', (participants) => {
      if (participants === 2) {
        this.setState({tutorJoined: true}, () => this.startTimer());
        this.props.socket.emit('question info', this.props.question)
      }
      else this.setState({tutorJoined: false});
    });

    //HANG-UP
    this.props.socket.on('hang up', () => {this.setState({showFeedbackModal: true})})
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
    
  renderOverlay = () => {
    if (this.state.tutorOrLearner === 'learner' && !this.state.tutorJoined) {
      return <Overlay closeOverlay={(counter) => {
        clearInterval(counter);
        const targetOffer = this.props.offers.filter(offer => offer.offer_id === this.props.question.answered_by)
        this.props.socket.emit('cancel call', targetOffer[0].tutor)
        this.props.history.goBack()
      }
      }/>
    }
  }

  hangUp = () => {
    this.props.socket.emit('hang up', {roomId: this.state.roomId});
  }

  showEndChatModal = () => {
    if (this.state.showFeedbackModal) {
      return <ModalEndChat closeChatModal={() => this.setState({showFeedbackModal: false})} history={this.props.history} questionId={this.state.questionId} tutorOrLearner={this.state.tutorOrLearner}/>
    }
  }

  render() {
    // Notify that user is online (since navbar is not render)
    this.props.socket.emit('user online', {token: localStorage.getItem('token')});

    return(
      <div className="chat-component">
    
        {this.state.tutorJoined ? null : this.renderOverlay()}

        <div className="chat-header">
          <h1>Question Title</h1>

          <h3 id="timer" style={{color: this.state.overTime}}>{this.state.minutes}:{this.state.secondsString}</h3>

          <button onClick={this.hangUp}>End Call</button>
        </div>

        <div className="chat-body">
          <CodeEditor socket={this.props.socket} room={this.state.roomId}/>
          <ChatMessages socket={this.props.socket} room={this.state.roomId} />
        </div>

        {this.showEndChatModal()}

      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  question: state.question,
  offers: state.offers,
  tutors: state.tutors,
})

export default connect(mapStateToProps)(Chat);
