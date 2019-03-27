import React, { Component } from 'react';
import './chat.scss';
import './codeeditor.scss';

import logo from '../../assets/square-logo.png';

import { connect } from 'react-redux';
import { updateChatQuestion } from '../../redux/actions.js';

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
    overTime: 'white',
    clockReset: true,
    timerId: null,
    questionTitle: null,
    questionDescription: null,
    questionResources: null,
    questionCode: null,
    questionLearner: null,
    questionTutor:null
  }

  componentDidMount() {
    console.log("all needs should be here", this.props)
    this.setChatDetails();

    this.props.socket.emit('join room', this.state.roomId)

    this.props.socket.on('join room', (participants) => {
      if (participants === 2) {

        if (this.state.clockReset) {
          this.setState({tutorJoined: true}, () => this.startTimer());
        } else this.setState({tutorJoined: false});

        this.setState({ clockReset:false })
        
        if (this.state.tutorOrLearner === 'tutor') {
          const targetOffer = this.props.offers.filter(offer => offer.offer_id === this.props.question.answered_by); 
          sessionStorage.setItem('targetOffer', targetOffer);
  
          this.props.socket.emit('question info', {
            question: this.props.question,
            tutor: sessionStorage.getItem('targetOffer')
          })
        }
      }
     
    });

    // STORE THE QUESTION INFO TO THE REDUX STATE AND THE CHATROOM 
    // ?? I DON'T THINK THIS WORKS
    this.props.socket.on('question info', (data) => {
      this.props.updateChatQuestion(data);
    })

    //HANG-UP
    this.props.socket.on('hang up', () => {this.setState({showFeedbackModal: true})})
  }

  setChatDetails = () => {
    //this.props.offers.find(offer => offer.offer_id === this.props.question.answered_by).tutor
    //this.props.question.answered_by IS NULL ON LEARNER
    console.log('users', this.props.users)
    //const test = this.props.users.find(user => user.user_id === this.props.offers.find(offer => offer.offer_id === this.props.question.answered_by).tutor);
    this.setState({
      questionTitle: this.props.question.title,
      questionDescription: this.props.question.description,
      questionResources: this.props.question.resources,
      questionCode: this.props.question.code,
      questionLearner: this.props.question.learner,
    })
    // if (this.state.tutorOrLearner === 'tutor'){
    //   this.setState({
    //     questionTutor: this.props.users.find(user => user.user_id === this.props.question.learner).username
    //   })
    // } else {
    //   this.setState({
    //     questionTutor: 'TUTOR ID HERE'
    //   })
    // }
    console.log(this.state)
  }

  startTimer = () => {
    if (!sessionStorage.getItem('timeStarted')){
      sessionStorage.setItem('timeStarted', Date.now());
    }

    if (sessionStorage.getItem('timeStarted')) {
      const newTime = Date.now() - sessionStorage.getItem('timeStarted');
      const secs = Number(((newTime % 60000) / 1000).toFixed(0));
      const mins= Math.floor(newTime/ 60000);
      this.setState({
        minutes: mins,
        seconds: secs,
      })
    }

    const intervalId = setInterval( () => {
      this.setState({seconds: this.state.seconds + 1})
      if (this.state.seconds < 10 ) this.setState({secondsString: '0' + this.state.seconds})
      else this.setState({secondsString: this.state.seconds})
      if (this.state.seconds === 60) {
        this.setState({ seconds: 0, minutes: this.state.minutes + 1, secondsString: '00'})
      }
      if (this.state.minutes === 15) {
        this.setState({ overTime: 'red'});
      }
    }, 1000)

    this.setState({ timerId: intervalId });

  }

  renderOverlay = () => {
    console.log(this.state.tutorJoined)
    if (this.state.tutorOrLearner === 'learner' && !this.state.tutorJoined) {
      return <Overlay closeOverlay={(counter) => {
        clearInterval(counter);
        if (this.props.question.learner) { // prevents chat from crashing when the timer runs out
          const targetOffer = this.props.offers.filter(offer => offer.offer_id === this.props.question.answered_by)
          this.props.history.goBack()
          this.props.socket.emit('cancel call', targetOffer[0].tutor)
        }
      }
      }/>
    }
  }

  hangUp = () => {
    this.props.socket.emit('hang up', {roomId: this.state.roomId});
  }

  showEndChatModal = () => {
    if (this.state.showFeedbackModal) {
      sessionStorage.removeItem('timeStarted');
      sessionStorage.removeItem('targetOffer');
      return <ModalEndChat closeChatModal={() => this.setState({showFeedbackModal: false})} history={this.props.history} questionId={this.state.questionId} tutorOrLearner={this.state.tutorOrLearner}/>
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timerId);
  }

  render() {
    // Notify that user is online (since navbar is not render)
    this.props.socket.emit('user online', {token: localStorage.getItem('token')});

    return(
      <div className="chat-component">
        {this.state.tutorJoined ? null : this.renderOverlay()}

        <div className="chat-header">
          <div className="left">
            <img src={logo} width="40px" alt="logo"/>
            <p>Live Help Session</p>
          </div>
          <div className="right">
            <h3 id="timer" style={{color: this.state.overTime}}>{this.state.minutes}:{this.state.secondsString}</h3>
            <button className="end-call-button" onClick={this.hangUp}>End Call</button>        
          </div>
        </div>

        <div className="chat-info">
          <h1>{this.state.questionTitle}</h1>
          <br/>
          <p>{this.state.questionDescription}</p>
          <br/>
          <p>{this.state.questionResources}</p>
          <br/>
          <p>{this.state.questionCode}</p>
          <br/>
          <p>{this.state.questionLearner}</p>
          <br/>
          {/* {this.state.questionTutor} */}
        </div>

        <div>
          <div className="chat-body">
            <CodeEditor socket={this.props.socket} room={this.state.roomId}/>
            <ChatMessages socket={this.props.socket} room={this.state.roomId} />
          </div>

          <div className="chat-footer">
            <p>Troubleshooting - I need to report a problem</p>
          </div>
        </div>

        {this.showEndChatModal()}

      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  users: state.users,
  question: state.question,
  offers: state.offers,
  tutors: state.tutors,
})

const mapDispatchToProps = (dispatch) => ({
  updateChatQuestion: (question) => dispatch(updateChatQuestion(question))
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat);