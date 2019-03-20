import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './my-questions.scss';

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
    if(this.state.questions.length > 0){
      return this.state.questions.map((question, index) => {
        return (
          <div key={index+'a'}>
            <Link to={`/questions/${question.questionId}`}>
              <p>{question.title}</p>
              <p>{question.description}</p>
              {/* <question-component with needed props question={question}/> */}
            </Link>
          </div>
        );
    });
    } else {
      return (
        <div>
          <p>You don't have questions</p>
        </div>
      )
    }
  }

  render() {
    console.log(this.state.questions)
    return (
      <div>
        MY QUESTIONS
        {this.renderQuestions()}
      </div>
    )
  }
}

export default MyQuestions;

//But the below in each rendered question
//<Link to={`${match.url}/rendering`}>Rendering with React</Link> 
//-> to route to /question-posted/:questionid

