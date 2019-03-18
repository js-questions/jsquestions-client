import React, { Component } from 'react';
import './App.scss';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/navbar/navbar.js'

class App extends Component {
  render() {
    return (
      <Router>
      <Switch>
        <Route path='/' component={Navbar}/>
      </Switch>
      </Router>
    );
  }
}

export default App;
