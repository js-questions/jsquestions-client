import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './my-questions.scss';
import Question from './../question/question';

class MyQuestions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questions: [],
      allUsers: null
    }
  }

  getUsers = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      await fetch(`http://localhost:4000/users/`, {
        method: 'GET',
        headers : {
          'Authorization' : 'Bearer ' + token,
          'Content-Type': 'application/json'
        }})
      .then(res => res.json())
      .then(res => {
        this.setState({
          allUsers: res
        });
      })
    }
  }

  componentWillMount = async () => {
    const token = localStorage.getItem('token');
    await this.getUsers();
    fetch(`http://localhost:4000/questions/asked`, {
      method: 'GET',
      headers : {
        'Authorization' : 'Bearer ' + token,
        'Content-Type': 'application/json'
      }})
    .then(res => res.json())
    .then(res=> this.setState({
      questions: res
    }))
  }

  renderQuestions = () => {
    if (this.state.questions.length > 0) {
      return this.state.questions.map((question, index) => {
        let learner = this.state.allUsers.filter(user => { return user.user_id===question.learner})[0];
        return (
          <div key={index}>
            <Link className="question__link" to={{pathname: `/question-posted/${question.question_id}`}}>
              <Question question={question} learner={learner}/>
            </Link>
          </div>
    )})}
    else {
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

export default MyQuestions;

