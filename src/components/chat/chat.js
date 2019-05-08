import React, { Component } from 'react';
import './chat.scss';
import './codeeditor.scss';

import logo from '../../assets/square-logo.png';

import { connect } from 'react-redux';
import { updateQuestionStatus, updateKarma } from '../../redux/actions.js';
import CodeEditor from './codeeditor';
import ChatMessages from './chat-messages';
import Overlay from './overlay';
import ModalEndChat from './../modal/modal-end-chat';
import ShowDetails from './chat-show-details';

class Chat extends Component {
  state = {
    roomId: this.props.location.pathname.split('/')[2],
    questionId: this.props.location.pathname.split('/')[3],
    tutorOrLearner: this.props.location.pathname.split('/')[4],
    showFeedbackModal: false,
    tutorJoined: false,
    // for the chat timer
    minutes: 0,
    seconds: 0,
    secondsString: '00',
    overTime: 'white',
    clockReset: true, // clockReset = resets timer when there are 2 partcipants 
    timerId: null, // timerId = Id of setInterval function to start the timer
    // for question info
    questionTitle: null,
    questionDescription: null,
    questionResources: null,
    questionCode: null,
    questionLearner: null,
    questionTutor:null,
    showMoreInfo: false
  }

  componentDidMount() {
    this.props.socket.emit('join room', this.state.roomId)
    this.setChatDetails();
    // Notify that user is online (since navbar is not rendered, which is normally used to show if user is online)
    this.props.socket.emit('user online', {token: localStorage.getItem('token')});
    this.props.socket.on('join room', (participants) => {
      if (participants === 2) {
        if (this.state.clockReset) {
          //starts the timer on joining of the tutor
          this.setState({tutorJoined: true}, () => this.startTimer());
        }
        this.setState({clockReset:false})

        if (this.state.tutorOrLearner === 'learner' && this.props.question.learner === this.props.user.user_id) {
          let targetOffer;
          if (sessionStorage.getItem('targetOffer')) {
            //targetOffer is stored in the sessionStorage for the edge case that the user refreshes in the chat to be able to still send karma to the tutor
            targetOffer = JSON.parse( sessionStorage.getItem('targetOffer'))
          } else {
            targetOffer = this.props.offers.filter(offer => offer.offer_id === this.props.question.answered_by);
            sessionStorage.setItem('targetOffer', JSON.stringify(targetOffer));
          }
          this.setState({targetTutor: targetOffer[0].tutor});
          this.props.socket.emit('question info', {
            question: this.props.question,
            tutor: JSON.parse(sessionStorage.getItem('targetOffer'))
          })
        }
      } else {
        this.setState({tutorJoined: false});
      }
    });
    this.props.socket.on('question info', (data) => {
      this.props.updateChatQuestion(data);
    })
    //HANG-UP
    this.props.socket.on('hang up', () => {this.setState({showFeedbackModal: true})})
  }

  setChatDetails = async () => {
    if (!sessionStorage.getItem('chatDetails')){
      await this.setState({
        questionTitle: this.props.question.title,
        questionDescription: this.props.question.description,
        questionResources: this.props.question.resources,
        questionCode: this.props.question.code,
      })
      //Question details are stored in the sessionStorage to keep details of the question in the chat on refresh
      sessionStorage.setItem('chatDetails', JSON.stringify(this.state))
    } else {
      const questionDetails = JSON.parse(sessionStorage.getItem('chatDetails'));
      this.setState({
        questionTitle: questionDetails.questionTitle,
        questionDescription: questionDetails.questionDescription,
        questionResources: questionDetails.questionResources,
        questionCode: questionDetails.questionCode,
      })
    }
  }

  startTimer = () => {
    if (!sessionStorage.getItem('timeStarted')){
      //Stores the chat started in the sessionStorage in order to keep the clock's time on refresh
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
    if (this.state.tutorOrLearner === 'learner' && !this.state.tutorJoined) {
      return <Overlay closeOverlay={(counter) => {
        clearInterval(counter);
        if (this.props.question.learner) { 
          // prevents chat from crashing when the timer runs out
          const targetOffer = this.props.offers.filter(offer => offer.offer_id === this.props.question.answered_by);
          this.props.history.goBack();
          this.props.socket.emit('cancel call', targetOffer[0].tutor);
        }
      }
      }/>
    }
  }

  hangUp = () => {
    this.props.socket.emit('hang up', {roomId: this.state.roomId});
  }

  updateKarma = (karma) => {
    this.props.socket.emit('update karma', {tutor: this.state.targetTutor, karma: karma });
  }

  showEndChatModal = () => {
    if (this.state.showFeedbackModal) {
      sessionStorage.removeItem('timeStarted');
      sessionStorage.removeItem('targetOffer');
      sessionStorage.removeItem('chatDetails');
      return <ModalEndChat showModal={this.state.showFeedbackModal} closeQuestion={(question) => this.props.updateQuestionStatus(question)} updateKarma={this.updateKarma} closeChatModal={() => this.setState({showFeedbackModal: false})} history={this.props.history} questionId={this.state.questionId} tutorOrLearner={this.state.tutorOrLearner}/>
    }
  }

  showDetails = () => {
    if (this.state.showMoreInfo) {
      return <ShowDetails all={this.state} closeDetailsModal={() => this.setState({showMoreInfo: false})}/>
    }
  }

  componentWillUnmount() {
    this.props.socket.removeListener('join room');
    this.props.socket.removeListener('question info');
    this.props.socket.removeListener('hang up');
    clearInterval(this.state.timerId);
  }

  render() {
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
          <div>
            {this.showDetails()}
            <p>Title: <span>{this.state.questionTitle}</span></p>
          </div>
          <div>
            <button className="button-secondary" onClick={() => this.setState({showMoreInfo: true})}>Show more details</button>
          </div>
        </div>



        <div className="chat-body">
          <CodeEditor socket={this.props.socket} room={this.state.roomId}/>
          <ChatMessages socket={this.props.socket} room={this.state.roomId} />
        </div>

        <div className="chat-footer">
          <p>Troubleshooting - I need to report a problem</p>
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
  questions: state.questions, 
  offers: state.offers,
  tutors: state.tutors,
})

const mapDispatchToProps = (dispatch) => ({
  updateQuestionStatus: (question) => dispatch(updateQuestionStatus(question)),
  updateKarma: (karma) => dispatch(updateKarma(karma))
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

/* ------------------------------------------------------------------- 
Chat component:
This component is how the tutor and the learner will connect and provide 
feedback following the chat.
This component holds a timer, message, codeeditor component and all
logic needed for the chat. It also takes care of edge cases on different
uses of the chat.
---------------------------------------------------------------------- */