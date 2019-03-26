import React, { Component } from 'react';
import './chat.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";


class ChatMessages extends Component {

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
      room: this.props.room
    };
    this.props.socket.emit('chat message', msgToSend);
    this.message.value = '';
  }

  render() {
    return (
      <div className="chat-box">
        <div id="messages"></div>
        <form className="form-wrapper" action="">
          <textarea className="message-field" autoComplete="off" ref={input => this.message = input}
            onKeyPress={this.detectEnter}/>
          <button onClick={this.clickButton} className="send-icon" type="button">
            <FontAwesomeIcon onClick={this.clickButton} icon={faPaperPlane} />
          </button>
        </form>
      </div>
    )
  }

}

export default ChatMessages;



