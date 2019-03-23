import React from 'react';
import './chat.scss';

import CodeMirror from 'codemirror';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import Overlay from './overlay';

import ModalEndChat from './../modal/modal-end-chat';
import { timeout } from 'q';

class Chat extends React.Component {

  textArea = React.createRef();

  state = {
    keepChangeEditor: '',
    roomId: this.props.location.pathname.split('/')[2],
    // roomId: this.props.location.pathname.split('/chat/')[1], why is this duplicated?
    questionId: this.props.location.pathname.split('/')[3],
    tutorOrLearner: this.props.location.pathname.split('/')[4],
    showModal: false,
    tutorJoined: false,
    minutes: 0,
    seconds: 0,
    secondsString: '00'
  }

  componentDidMount() {
    this.startTimer();

    this.props.socket.on('join room', () => this.setState({tutorJoined: true}));

    //const room = this.props.room; //Amber removed this ... TTD to refractor
    this.props.socket.emit('join room', this.state.roomId)

    // CHAT
    this.props.socket.on('chat message', (msg) => {
      let currentId = this.props.socket.id;
      let oneMessage = document.createElement('div');
      let messages = document.getElementById('messages').appendChild(oneMessage);
      oneMessage.className += ' oneMessage';
      let messageText = document.createElement('div');
      let messageDate = document.createElement('div');
      oneMessage.appendChild(messageText);
      messageText.innerHTML = msg.value;
      oneMessage.appendChild(messageDate);
      messageDate.innerHTML = msg.date;
      messageDate.className += ' messageDate';
      if (currentId === msg.id) messages.className += ' myMessage';
      else messages.className += ' elseMessage';
    });

    // CODE EDITOR
    this.codemirror =  CodeMirror.fromTextArea(this.textArea.current, {
      mode: "javascript",
      theme: "default",
      lineNumbers: true,
      content: this.textArea.current,
    })
    this.codemirror.setSize(null, '80vh');
    this.codemirror.on('blur', this.codeChanged);
    this.props.socket.on('editor', (data) => this.codemirror.getDoc().setValue(data.code)); // handles received text
    this.props.socket.on('newUser', this.updateCode); // this code is not working - what was its purpose?

    //HANG-UP
    this.props.socket.on('hang up', () => {
      //this.props.history.push('/');
      this.openChatModal()
    })
  }

  //WHY WAS THIS HERE? -- This was added by Arol to prevent the editor from continuously re-rendering
  // shouldComponentUpdate() {
  //   return false;
  // }

  updateCode = (data) => {
    this.codemirror.getDoc().setValue(data.code);
    this.setState({keepChangeEditor: this.codemirror.getDoc().getValue()})
  }

  clickButton = (e) => {
    e.preventDefault();
    this.sendMessage();
  }

  detectEnter = (e) => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage = () => {
    const dateNow = new Date();
    const dateNowFormatted = dateNow.toLocaleString();
    const msgToSend = {
      date: dateNowFormatted,
      id: this.props.socket.id,
      value: this.message.value,
      room: this.state.roomId
    };
    this.props.socket.emit('chat message', msgToSend);
    this.message.value = '';
  }

  codeChanged = () => {
    const editorContent = this.codemirror.getDoc().getValue();
    const data = { code: editorContent, room: this.state.roomId } // changed property 'text' to 'code' to be more explicit
    if (editorContent !== this.state.keepChangeEditor) {
      this.props.socket.emit('editor', data);
      this.setState({keepChangeEditor: this.codemirror.getDoc().getValue()});
    }
    // todo: update the chatmirror so it updates during typing, not just on clicking outside of the box
    // var myElement = document.getElementById('txtArea');
    // myElement.focus();
    // var startPosition = myElement.selectionStart;
    // var endPosition = myElement.selectionEnd;
    // console.log('startPosition ', startPosition)
    // console.log('endPosition ', endPosition)
  }


  toggleOverlay = () => {
    if (!this.state.tutorJoined) {
      return <Overlay closeOverlay={() => this.props.history.goBack()}/>
    }
  }

  hangUp = () => {
    this.props.socket.emit('hang up', {roomId: this.state.roomId});
    this.setState({
      showModal: true
    })
  }

  showEndChatModal = () => {
    if (this.state.showModal) {
      return <ModalEndChat closeChatModal={this.closeChatModal} history={this.props.history} questionId={this.state.questionId} tutorOrLearner={this.state.tutorOrLearner}/>
    }
  }

  openChatModal = () => {
    this.setState({
      showModal: true
    })
  }

  closeChatModal = () => {
    this.setState({
      showModal: false
    })
  }

  startTimer = () => {

    setInterval(async () => {
      this.setState({seconds: this.state.seconds + 1})
      if (this.state.seconds < 10 ) this.setState({secondsString: '0' + this.state.seconds})
      else this.setState({secondsString: this.state.seconds})

      if (this.state.seconds === 60) {
        await this.setState({ seconds: 0, minutes: this.state.minutes + 1, secondsString: '00'})
      }
    }, 1000)

    if (this.state.minutes === 15) {
      console.log('should turn red')
    }

  }

  render() {

    // notify that user is online
    this.props.socket.emit('user online', {token: localStorage.getItem('token')});

    return(
      <div className="chat-component">

        {this.toggleOverlay()}

        <div className="chat-header">
          <h1>Question Title</h1>
          <h3>{this.state.minutes}:{this.state.secondsString}</h3>
          <button onClick={this.hangUp}>End Call</button>
        </div>
        <div className="chat-body">
          <div className="editor">
            <textarea id="txtArea" name="txtArea" ref={this.textArea}/>
          </div>
          <div className="chat-box">
            <div id="messages"></div>
            <form action="">
              <input
                autoComplete="off"
                ref={input => this.message = input}
                onKeyPress={this.detectEnter}
              />
              <button onClick={this.clickButton} type="button">
                Send
              </button>
            </form>
          </div>
        </div>
        {this.showEndChatModal()}
      </div>
    )
  }
}


export default Chat;