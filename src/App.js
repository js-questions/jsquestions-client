import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import Navbar from './components/navbar/navbar';
import AskQuestions from './components/ask-questions-page/ask-questions';
import LandingPage from './components/landing-page/landing-page';
import QuestionPosted from './components/question-posted-page/question-posted';
import AnswerPage from './components/answer-page/answer-page';
import MyQuestions from './components/my-questions-page/my-questions';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { connect } from 'react-redux';

import { updateKarma } from './redux/actions.js';

import Chat from './components/chat/chat.js';
import openSocket from 'socket.io-client';
const socket = openSocket(`${process.env.REACT_APP_SERVER_URL}/`);

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
    <PrivateRoute path="/question-posted/:questionid" component={QuestionPosted}/>
    <PrivateRoute path="/answer" component={AnswerPage}/>
    <PrivateRoute path="/my-questions" component={MyQuestions}/>
  </>
)

function PrivateRoute({ component: Component, ...rest}) {
  let token = localStorage.getItem('token');
  return (
    <Route {...rest} render={props => token ? (<Component {...props} socket={socket} />) : <Redirect to="/" />} />
  )
}

class App extends Component {

  componentDidMount() {
    socket.on('update karma', (data) => {
      if (data.tutor === this.props.user.user_id) {
        this.props.updateKarma(data.karma);
      }
    })
  }

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

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  updateKarma: (karma) => dispatch(updateKarma(karma))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
