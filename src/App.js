import React, { Component } from 'react';
import './App.scss';
import Navbar from './components/navbar/navbar';

import AskQuestions from './components/ask-questions-page/ask-questions';
import LandingPage from './components/landing-page/landing-page';
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div>
        <Navbar></Navbar>
      <div className="App">
      <Router>
        <div>
          <Route path="/home" component={LandingPage}/>
          <Route path="/ask" component={AskQuestions}/>
        </div>
      </Router>
      </div>
      </div>
    );
  }
}

export default App;
