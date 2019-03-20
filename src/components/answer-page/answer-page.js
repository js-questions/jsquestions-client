import React, { Component } from 'react';
import './answer-page.scss';

// import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import Question from '../question/question';

class AnswerPage extends Component {
  state = {
    questions: null
  }


  getQuestions = () => {
    const token = localStorage.getItem('token');

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

  renderAnswers = () => {
    if (this.state.questions.length > 0) {
      return this.state.questions.map((question, index) => {
        return (
          <div key={index}>
            <Question question={question}/>
          </div>
    )})} 
    else {
      return (
        <div>
          <p>There aren't any questions being asked right now :(</p>
        </div>
      )
    }
  }

  componentWillMount(){
    this.getQuestions();
  }
  render() {
    if (this.state.questions !== null) {
      return (
        <div className="answer-container">
          <h1 className="answer-title">Help learners</h1>
          <h3 className="answer-subtitle">Here are the latests questions</h3>
          <div className="answer-filters">
            <div className="answer-filter">
              <div className="answer-text">Filter:</div>
              <div className="filterButton">All</div>
              <div className="filterButton">Open</div>
              <div className="filterButton">Pending</div>
              <div className="filterButton">Closed</div>
            </div>
            <div className="answer-dropdown">
              <div className="answer-text">Sort by:</div>
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
          {this.renderAnswers()}
        </div>
        )
    } 
    else {
      return <div>LOADING</div>
    }
    
  }
}

export default AnswerPage;