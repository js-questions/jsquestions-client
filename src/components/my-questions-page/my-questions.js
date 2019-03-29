/* ------------------------------------------------------------------------------------
my-questions component:
This component displays the questions for each user.
Each question is a Question component.
If no questions are available a message is displayed.
--------------------------------------------------------------------------------------- */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { updateQuestions } from '../../redux/actions.js';
import { connect } from 'react-redux';
import './my-questions.scss';
import Question from './../question/question';

class MyQuestions extends Component {

  // Send a GET request to the server to retrieve all questions and update store.
  componentWillMount = async () => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:4000/questions/asked`, {
      method: 'GET',
      headers : {
        'Authorization' : 'Bearer ' + token,
        'Content-Type': 'application/json'
      }})
    .then(res => res.json())
    .then(res => this.props.updateQuestions(res))
    }

  renderQuestions = () => {
    if (this.props.questions.length > 0) {

      // Sort questions by open first and closed after
      this.props.questions.sort(function(a, b){return a.answered - b.answered})

      // Display all questions
      return this.props.questions.map((question, index) => {
        let user = this.props.user;
        return (
          <div key={index}>
            <Link className="question__link" to={{pathname: `/question-posted/${question.question_id}`}}>
              <Question question={question} user={user} answered={question.answered}/>
            </Link>
          </div>
    )})}
    else {

      // If no questions available, a message is displayed.
      return (
        <div>
          <h3>You don't have questions</h3>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="my-questions">
        <h1>My Questions</h1>
        {this.renderQuestions()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  questions: state.questions
})

const mapDispatchToProps = (dispatch) => ({
  updateQuestions: (question) => dispatch(updateQuestions(question)),

})

export default connect(mapStateToProps, mapDispatchToProps)(MyQuestions);
