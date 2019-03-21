import React from 'react';
import './chat.scss';

import CodeMirror from 'codemirror';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import Modal from '../modal/modal.js';

class Chat extends React.Component {

  textArea = React.createRef();

  state = {
    keepChangeEditor: '',
    roomId: this.props.location.pathname.split('/chat/')[1],
  }
 
  componentDidMount() {

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
    this.codemirror.on('blur', this.textChanged);
    this.props.socket.on('editor', (data) => this.codemirror.getDoc().setValue(data.text)); // handles received text
    // this.props.socket.on('editor', this.handleReceivedText);
    this.props.socket.on('newUser', this.updateText);
  }

  shouldComponentUpdate() {
    return false;
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

  textChanged = () => {
    const editorContent = this.codemirror.getDoc().getValue();
    const data = {
        text: editorContent,
        room: this.state.roomId
    };

      // var myElement = document.getElementById('txtArea');
      // myElement.focus();
      // var startPosition = myElement.selectionStart;
      // var endPosition = myElement.selectionEnd;
      // console.log('startPosition ', startPosition)
      // console.log('endPosition ', endPosition)

    if (editorContent!==this.state.keepChangeEditor) {
      this.props.socket.emit('editor', data);
      this.setState({keepChangeEditor: this.codemirror.getDoc().getValue()});
    }

  }

  updateText = (data) => {
    this.codemirror.getDoc().setValue(data.text);
    this.setState({keepChangeEditor: this.codemirror.getDoc().getValue()})
  }

 
  render() {

    // notify that user is online
    this.props.socket.emit('user online', {token: localStorage.getItem('token')});

    return(
      <div className="chat-component">
        <div className="chat-header">
          {/* <div className="title">{this.props.location.state.title} </div> */}
          <div className="title">Title to Replace</div>

          <div className="hang-up">Hang Up</div>
        </div>
        <div className="chat-body">
          <div className="editor">
            <textarea  id="txtArea" name="txtArea" ref={this.textArea}></textarea>
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
      </div>
    )
  }
}


export default Chat;