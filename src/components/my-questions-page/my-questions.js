import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './my-questions.scss';
import Question from './../question/question';

class MyQuestions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questions: []
    }
  }

  componentWillMount = async () => {
    const token = localStorage.getItem('token');
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
      // sort questions by open first and closed after
      this.state.questions.sort(function(a, b){return a.answered - b.answered})
      return this.state.questions.map((question, index) => {
        let user = this.props.user;
        return (
          <div key={index}>
            <Link className="question__link" to={{pathname: `/question-posted/${question.question_id}`}}>
              <Question question={question} user={user} answered={question.answered}/>
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

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(MyQuestions);

