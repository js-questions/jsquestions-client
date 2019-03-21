import React, { Component } from 'react';
import './answer-page.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import Question from '../question/question';

class AnswerPage extends Component {
  state = {
    questions: null,
    loggedIn: false
  }

  getQuestions = () => {
    const token = localStorage.getItem('token');
    if (token) {
      this.setState({loggedIn: true})
    }
    fetch(`${process.env.REACT_APP_END_POINT_URL}/questions`, {
      method: 'GET', 
      headers : { 
        'Authorization' : 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }})
    .then(res => res.json())
    .then(res=> this.setState({
      questions: res
    }))
  }

  sendOffer = (questionid, buttonAlreadyClicked) => {
    //Amber TTD: Needs to have a way if they click and aren't siged in they need to sign in
    //Will only send offer once
    if (!buttonAlreadyClicked) {
      const token = localStorage.getItem('token');
      fetch(`${process.env.REACT_APP_END_POINT_URL}/questions/${questionid}/offers`, {
        method: 'POST', 
        headers : { 
          'Authorization' : 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: {
          'message': 'i Kinda know english, need help?',
          'linked_question': questionid,
          'expiration': "2017-01-08T21:00:11.620Z"
          //Amber TTD: this needs to be filled out in a popup modal
        }
      })
        .then(res => res.json())
        .then(res=> console.log('offer sent to BE', res))
        //Amber TTD: if there are no responses sent show "there aren't any questions being asked right now"
    }   
  }

  

  renderQuestions = () => {
    //User is not logged in
    if (!this.state.loggedIn) {
      return <div>You must be logged in to see active questions</div>
    } 
    //Questions being loaded
    else if (this.state.questions === null) {
      return <div>LOADING</div>
    }
    //Renders questions
    else if (this.state.questions.length > 0) {
      return this.state.questions.map((question, index) => {
        return (
          <div className="question-container" key={index} >
            <Question question={question} sendOffer={this.sendOffer} />
          </div>
    )})} 
    //No questions to render
    else {
      return  <div>There aren't any questions being asked right now :( </div>
    }
  }

  componentWillMount() {
    this.getQuestions();
  }

  render() {
    return (
      <div className="answer-container">
        <h1>Help learners</h1>
        <h3>Here are the latests questions</h3>
        <div className="answer-filters">
          <div className="answer-filter">
            <h4>Filter:</h4>
            <div>All</div>
            <div>Open</div>
            <div>Pending</div>
            <div>Closed</div>
          </div>
          <div className="answer-dropdown">
            <h4>Sort by:</h4>
            <div className="dropdown">
              <div className="dropbtn">
                <div>Newest</div>
                <FontAwesomeIcon icon={faChevronDown} className="icon-style"/>
              </div>
              <div className="dropdown-content">
                <div>Newest</div>
                <div>Oldest</div>
              </div>
            </div>
          </div>
        </div>

        {this.renderQuestions()}
      </div>
    )
  }
}

export default AnswerPage;