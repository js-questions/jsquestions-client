import React, { Component } from 'react';
import './App.scss';
import Navbar from './components/navbar/navbar';

import AskQuestions from './components/ask-questions-page/ask-questions';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import openSocket from 'socket.io-client';

import Chat from './components/chat/chat.js';

const socket = openSocket('http://localhost:3001/');
const room = '1234'

class App extends Component {
  render() {
    return (
      // <Chat socket={socket} room={room}></Chat>
      <div>
        <Navbar></Navbar>
      <div className="App">
      <Router>
        <div>
          <Route path="/ask" component={AskQuestions}/>
        </div>
      </Router>
      </div>
      </div>
    );
  }
}

export default App;
