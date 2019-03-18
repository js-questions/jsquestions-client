import React from 'react';
import './chat.scss';

class Chat extends React.Component {

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
    const dateNow = new Date(Date.now());
    const dateNowFormatted = dateNow.toLocaleString();
    const msgToSend = {};
    msgToSend.date = dateNowFormatted;
    msgToSend.id = this.props.socket.id;
    msgToSend.value = this.message.value;
    this.props.socket.emit('chat message', msgToSend);
    this.message.value = '';
  }

  componentDidMount() {
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
  }

  render() {
    return(
      <div className="chat-component">
        <div className="chat-header">
          <div className="title">Question: How do I... blah blah blah</div>
          <div className="hang-up">Hang Up</div>
        </div>
        <div className="chat-body">
          <div className="editor">Code Editor</div>
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