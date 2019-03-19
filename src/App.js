import React, { Component } from 'react';
import './App.scss';
import Navbar from './components/navbar/navbar';
import LandingPage from './components/landing-page/landing-page';
import AskQuestions from './components/ask-questions-page/ask-questions';
import QuestionPosted from './components/question-posted-page/question-posted';

import { BrowserRouter as Router, Route } from "react-router-dom";

import openSocket from 'socket.io-client';

import Chat from './components/chat/chat.js';

const socket = openSocket('http://localhost:3001/');
const room = '1234'

class App extends Component {
  render() {
    return (
      <div>
        <Navbar></Navbar>
        <Router>
            <Route exact path="/" component={LandingPage}/>
            <Route path="/ask" component={AskQuestions}/>
            <Route path="/question-posted" component={QuestionPosted}/>
            <Route
            path='/chat'
            render={(props) => <Chat {...props} socket={socket} room={room}/>}
            />
        </Router>
      </div>
    );
  }
}

export default App;
