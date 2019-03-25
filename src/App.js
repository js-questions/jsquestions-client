import React, { Component } from 'react';
import './App.scss';
import Navbar from './components/navbar/navbar';
import AskQuestions from './components/ask-questions-page/ask-questions';
import LandingPage from './components/landing-page/landing-page';
import QuestionPosted from './components/question-posted-page/question-posted';
import AnswerPage from './components/answer-page/answer-page';
import QuestionAbout from './components/question-posted-page/question-about';
import MyQuestions from './components/my-questions-page/my-questions';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Chat from './components/chat/chat.js';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:4000/');

const EntryPage = () => (
  <>
    <Navbar socket={socket} landingPage={true}/>
    <Route exact path="/" component={LandingPage}/>
  </>
)

const Platform = () => (
  <>
    <Navbar socket={socket} landingPage={false}/>
    <Route path="/ask" component={AskQuestions}/>
    <Route path="/question-posted/:questionid" render={(props) => <QuestionPosted {...props} socket={socket} />}/>
    <Route path="/question/:questionid" component={QuestionAbout}/>
    <Route path="/answer" render={(props) => <AnswerPage {...props} socket={socket} />}/>
    <Route path="/my-questions" component={MyQuestions}/>
  </>
)

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route path='/chat' render={(props) => <Chat {...props} socket={socket} />}/>
            <Route exact path='/' component={EntryPage} />
            <Route component={Platform} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;