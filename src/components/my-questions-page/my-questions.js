import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './my-questions.scss';
import Question from './../question/question';

class MyQuestions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questions: []
    }
  }

  componentWillMount (){
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_END_POINT_URL}/questions/asked`, {
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
        return (
          <div key={index}>
            <Link to={{pathname: `/question-posted/${index + 1}`}} >
            {/* <Link to={{pathname: `/question-posted/${question.questionId}`}} > */}
              <Question question={question}/>
            </Link>
          </div>
    )})} 
    else {
      return (
        <div>
          <p>You don't have questions</p>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        MY QUESTIONS
        {this.renderQuestions()}
      </div>
    )
  }
}

export default MyQuestions;

