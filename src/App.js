import React, { Component } from 'react';
import './App.scss';
import Navbar from './components/navbar/navbar';
import AskQuestions from './components/ask-questions-page/ask-questions';
import LandingPage from './components/landing-page/landing-page';
import QuestionPosted from './components/question-posted-page/question-posted';
import AnswerPage from './components/answer-page/answer-page';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Chat from './components/chat/chat.js';
import openSocket from 'socket.io-client';
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
            <Route path="/answer" component={AnswerPage}/>
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
