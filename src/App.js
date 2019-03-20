import React, { Component } from 'react';
import './App.scss';
import Navbar from './components/navbar/navbar';
import AskQuestions from './components/ask-questions-page/ask-questions';
// import AnswerQuestions from './components/answer-questions-page/answer-questions';
import LandingPage from './components/landing-page/landing-page';
import QuestionPosted from './components/question-posted-page/question-posted';

import { BrowserRouter as Router, Route } from "react-router-dom";

import openSocket from 'socket.io-client';

import Chat from './components/chat/chat.js';

const socket = openSocket('http://localhost:4000/');
const room = '1234'

class App extends Component {
  render() {
    return (
      <div>
        <Router>
        <Navbar socket={socket}/>
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
