import React, { Component } from 'react';
import './App.scss';

import openSocket from 'socket.io-client';

import Chat from './components/chat/chat.js';

const socket = openSocket('http://localhost:3001/');
const room = '1234'

class App extends Component {
  render() {
    return (
      <Chat socket={socket} room={room}></Chat>
    );
  }
}

export default App;
