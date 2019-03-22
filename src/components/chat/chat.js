import React from 'react';
import './chat.scss';

import CodeMirror from 'codemirror';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

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
    this.codemirror.on('blur', this.codeChanged);
    this.props.socket.on('editor', (data) => this.codemirror.getDoc().setValue(data.code)); // handles received text
    this.props.socket.on('newUser', this.updateCode); // this code is not working - what was its purpose?
  }

  shouldComponentUpdate() {
    return false;
  }

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

  
  render() {

    console.log('props', this.props)

    // notify that user is online
    this.props.socket.emit('user online', {token: localStorage.getItem('token')});

    return(
      <div className="chat-component">
        <div className="chat-header">
          <div className="title">Question Title</div>
          {/* <div className="title">{this.props.location.state.question.title}: {this.props.location.state.question.description} <div>Related Resources: {this.props.location.state.question.resources}</div></div> */}
          <div className="hang-up">End Call</div>
        </div>
        <div className="chat-body">
          <div className="editor">
            <textarea id="txtArea" name="txtArea" ref={this.textArea} value={this.state.textEditor} onChange={()=> console.log('text editor entered')}/>
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