import React, { Component } from 'react';
import './App.scss';
import Login from './components/log-in/log-in.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Login/>
      </div>
    );
  }
}

export default App;
