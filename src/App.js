import React, { Component } from 'react';
import './App.scss';

import openSocket from 'socket.io-client';

import Chat from './components/chat/chat.js';

const socket = openSocket('http://localhost:3001/');

class App extends Component {
  render() {
    return (
      <Chat socket={socket}></Chat>
    );
  }
}

export default App;
