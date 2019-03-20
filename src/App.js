import React, { Component } from 'react';
import './App.scss';
import Navbar from './components/navbar/navbar';

import AskQuestions from './components/ask-questions-page/ask-questions';
import LandingPage from './components/landing-page/landing-page';
import AnswerPage from './components/answer-page/answer-page';
import { BrowserRouter as Router, Route } from "react-router-dom";

// import openSocket from 'socket.io-client';
// import Chat from './components/chat/chat.js';
// const socket = openSocket('http://localhost:3001/');
// const room = '1234'

class App extends Component {
  render() {
    return (
      <div>
        <Navbar></Navbar>
        <AnswerPage></AnswerPage>
        {/* <Router>
            <Route exact path="/" component={LandingPage}/>
            <Route path="/ask" component={AskQuestions}/>
        </Router> */}
      </div>
    );
  }
}

export default App;
