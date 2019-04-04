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
import Json from 'circular-json';

// video chat
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import UserVideoComponent from './UserVideoComponent';

const OPENVIDU_SERVER_URL = 'https://' + window.location.hostname + ':4443';
const OPENVIDU_SERVER_SECRET = 'MY_SECRET';

class Chat extends Component {
  constructor(props) {
    super(props);
  
  this.state = {
    roomId: this.props.location.pathname.split('/')[2],
    questionId: this.props.location.pathname.split('/')[3],
    tutorOrLearner: this.props.location.pathname.split('/')[4],
    showFeedbackModal: false,
    tutorJoined: false,
    // minutes: 0,
    // seconds: 0,
    // secondsString: '00',
    // overTime: 'white',
    clockReset: true,
    timerId: null,
    questionTitle: null,
    questionDescription: null,
    questionResources: null,
    questionCode: null,
    showMoreInfo: false,
    // video chat
    mySessionId: this.props.location.pathname.split('/')[2],
    myUserName: this.props.user.username,
    session: undefined,
    mainStreamManager: undefined,
    publisher: undefined,
    subscribers: [],
  }

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
    this.setChatDetails = this.setChatDetails.bind(this);
  }

  componentDidMount() {
    //video chat
    window.addEventListener('beforeunload', this.onbeforeunload);

    this.props.socket.emit('join room', this.state.roomId)
    this.setChatDetails();
    // Notify that user is online (since navbar is not rendered, which is normally used to show if user is online)
    this.props.socket.emit('user online', {token: localStorage.getItem('token')});
    this.props.socket.on('join room', (participants) => {
      if (participants === 2) {
        if (this.state.clockReset) {
          //starts the timer on joining of the tutor
          this.setState({tutorJoined: true})
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
      sessionStorage.setItem('chatDetails', Json.stringify(this.state))
      console.log('this.state', this.state);
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

  // startTimer = () => {
  //   if (!sessionStorage.getItem('timeStarted')){
  //     //Stores the chat started in the sessionStorage in order to keep the clock's time on refresh
  //     sessionStorage.setItem('timeStarted', Date.now());
  //   }

  //   if (sessionStorage.getItem('timeStarted')) {
  //     const newTime = Date.now() - sessionStorage.getItem('timeStarted');
  //     const secs = Number(((newTime % 60000) / 1000).toFixed(0));
  //     const mins= Math.floor(newTime/ 60000);
  //     this.setState({
  //       minutes: mins,
  //       seconds: secs,
  //     })
  //   }

  //   const intervalId = setInterval( () => {
  //     this.setState({seconds: this.state.seconds + 1})
  //     if (this.state.seconds < 10 ) this.setState({secondsString: '0' + this.state.seconds})
  //     else this.setState({secondsString: this.state.seconds})
  //     if (this.state.seconds === 60) {
  //       this.setState({ seconds: 0, minutes: this.state.minutes + 1, secondsString: '00'})
  //     }
  //     if (this.state.minutes === 15) {
  //       this.setState({ overTime: 'red'});
  //     }
  //   }, 1000)

  //   this.setState({ timerId: intervalId });

  // }

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

    // videochat
    window.removeEventListener('beforeunload', this.onbeforeunload);
  }

  // start - video chat functions

  onbeforeunload(event) {
    this.leaveSession();
  }

  handleMainVideoStream(stream) {
      if (this.state.mainStreamManager !== stream) {
          this.setState({
              mainStreamManager: stream
          });
      }
  }

  deleteSubscriber(streamManager) {
      let subscribers = this.state.subscribers;
      let index = subscribers.indexOf(streamManager, 0);
      if (index > -1) {
          subscribers.splice(index, 1);
          this.setState({
              subscriber: subscribers,
          });
      }
  }

  joinSession() {
    // --- 1) Get an OpenVidu object ---

    this.OV = new OpenVidu();

    // --- 2) Init a session ---

    this.setState(
        {
            session: this.OV.initSession(),
        },
        () => {
            let mySession = this.state.session;

            // --- 3) Specify the actions when events take place in the session ---

            // On every new Stream received...
            mySession.on('streamCreated', (event) => {
                // Subscribe to the Stream to receive it. Second parameter is undefined
                // so OpenVidu doesn't create an HTML video by its own
                let subscriber = mySession.subscribe(event.stream, undefined);
                let subscribers = this.state.subscribers;
                subscribers.push(subscriber);

                // Update the state with the new subscribers
                this.setState({
                    subscribers: subscribers,
                });
            });

            // On every Stream destroyed...
            mySession.on('streamDestroyed', (event) => {

                // Remove the stream from 'subscribers' array
                this.deleteSubscriber(event.stream.streamManager);
            });

            // --- 4) Connect to the session with a valid user token ---

            // 'getToken' method is simulating what your server-side should do.
            // 'token' parameter should be retrieved and returned by your own backend
            this.getToken().then((token) => {
                // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
                // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
                mySession
                    .connect(
                        token,
                        { clientData: this.state.myUserName },
                    )
                    .then(() => {

                        // --- 5) Get your own camera stream ---

                        // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
                        // element: we will manage it on our own) and with the desired properties
                        let publisher = this.OV.initPublisher(undefined, {
                            audioSource: undefined, // The source of audio. If undefined default microphone
                            videoSource: undefined, // The source of video. If undefined default webcam
                            publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                            publishVideo: true, // Whether you want to start publishing with your video enabled or not
                            resolution: '640x480', // The resolution of your video
                            frameRate: 30, // The frame rate of your video
                            insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
                            mirror: false, // Whether to mirror your local video or not
                        });

                        // --- 6) Publish your stream ---

                        mySession.publish(publisher);

                        // Set the main video in the page to display our webcam and store our Publisher
                        this.setState({
                            mainStreamManager: publisher,
                            publisher: publisher,
                        });
                    })
                    .catch((error) => {
                        console.log('There was an error connecting to the session:', error.code, error.message);
                    });
            });
        },
    );
}

  leaveSession() {

    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = this.state.session;

    if (mySession) {
        mySession.disconnect();
    }

    // Empty all properties...
    this.OV = null;
    this.setState({
        session: undefined,
        subscribers: [],
        mySessionId: this.props.location.pathname.split('/')[2],
        myUserName: this.props.user.username,
        mainStreamManager: undefined,
        publisher: undefined
    });
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
            <input className="btn-video" type="button" id="buttonLeaveSession" onClick={this.joinSession} value="Start video"/>
            <input className="btn-video" type="button" id="buttonLeaveSession" onClick={this.leaveSession} value="Stop video"/>
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


      {/* Start video chat */}
      <div className="chat-body">
        <CodeEditor socket={this.props.socket} room={this.state.roomId}/>
        <div className="chat-video-message">
          <div className="container">
              {this.state.session !== undefined ? (
                <div className="filledVideo">
                    {this.state.mainStreamManager !== undefined ? (
                        <div className="single-video">
                            <UserVideoComponent streamManager={this.state.mainStreamManager} />
                        </div>
                    ) : null}
                    <div  className="single-video">
                        {this.state.subscribers.map((sub, i) => (
                            <div key={i} className="stream-container col-md-6 col-xs-6" onClick={() => this.handleMainVideoStream(sub)}>
                                <UserVideoComponent streamManager={sub} />
                            </div>
                        ))}
                    </div>
                 
                </div>
              ) : (<div className="emptyVideo"></div>)}
            </div>
            <ChatMessages socket={this.props.socket} room={this.state.roomId} />
          </div>
    </div>

        <div className="chat-footer">
          <p>Troubleshooting - I need to report a problem</p>
        </div>

        {this.showEndChatModal()}

      </div>
    )
  }

   /**
     * --------------------------
     * SERVER-SIDE RESPONSIBILITY
     * --------------------------
     * These methods retrieve the mandatory user token from OpenVidu Server.
     * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
     * the API REST, openvidu-java-client or openvidu-node-client):
     *   1) Initialize a session in OpenVidu Server	(POST /api/sessions)
     *   2) Generate a token in OpenVidu Server		(POST /api/tokens)
     *   3) The token must be consumed in Session.connect() method
     */

    getToken() {
      return this.createSession(this.state.mySessionId).then((sessionId) => this.createToken(sessionId));
  }

  createSession(sessionId) {
      return new Promise((resolve, reject) => {
          var data = JSON.stringify({ customSessionId: sessionId });
          axios
              .post(OPENVIDU_SERVER_URL + '/api/sessions', data, {
                  headers: {
                      Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                      'Content-Type': 'application/json',
                  },
              })
              .then((response) => {
                  console.log('CREATE SESION', response);
                  resolve(response.data.id);
              })
              .catch((response) => {
                  var error = Object.assign({}, response);
                  if (error.response.status === 409) {
                      resolve(sessionId);
                  } else {
                      console.log(error);
                      console.warn(
                          'No connection to OpenVidu Server. This may be a certificate error at ' +
                          OPENVIDU_SERVER_URL,
                      );
                      if (
                          window.confirm(
                              'No connection to OpenVidu Server. This may be a certificate error at "' +
                              OPENVIDU_SERVER_URL +
                              '"\n\nClick OK to navigate and accept it. ' +
                              'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                              OPENVIDU_SERVER_URL +
                              '"',
                          )
                      ) {
                          window.location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
                      }
                  }
              });
      });
  }

  createToken(sessionId) {
      return new Promise((resolve, reject) => {
          var data = JSON.stringify({ session: sessionId });
          axios
              .post(OPENVIDU_SERVER_URL + '/api/tokens', data, {
                  headers: {
                      Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                      'Content-Type': 'application/json',
                  },
              })
              .then((response) => {
                  console.log('TOKEN', response);
                  resolve(response.data.token);
              })
              .catch((error) => reject(error));
      });
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