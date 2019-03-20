import React, { Component } from 'react';
import './answer-page.scss';

// import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import Question from '../question/question';

class AnswerPage extends Component {
  render() {
    return (
    <div className="answer-container">
      <h1 className="answer-title">Help learners</h1>
      <h3 className="answer-subtitle">Here are the latests questions</h3>
      <div className="answer-filters">
        <div className="answer-dropdown">
          <div className="dropdown">
            <div className="dropbtn">
              <div>View open</div>
              <FontAwesomeIcon icon={faChevronDown} className="icon-style"/>
            </div>
            <div className="dropdown-content">
              <div>View open</div>
              <div>View pending</div>
              <div>View all</div>
            </div>
          </div>
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
      <Question></Question>
      <Question></Question>
      <Question></Question>

    </div>
    )
  }
}

export default AnswerPage;