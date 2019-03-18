import React, { Component } from 'react';
import './App.scss';

import AskQuestions from './components/ask-questions-page/ask-questions';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div className="App">
      <Router>
        <div>
          <Route path="/ask" component={AskQuestions}/>
        </div>
      </Router>
      </div>
    );
  }
}

export default App;
