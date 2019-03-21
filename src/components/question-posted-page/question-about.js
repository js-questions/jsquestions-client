import React, { Component } from 'react';
import './question-posted.scss';
import Question from './../question/question';

class QuestionAbout extends Component {
  state = {
    question: null
  }

  componentWillMount(){
    //Sets question state to question matching the pararameters given
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_END_POINT_URL}/questions/asked`, {
      method: 'GET', 
      headers : { 
        'Authorization' : 'Bearer ' + token,
        'Content-Type': 'application/json'
      }})
    .then(res => res.json())
    .then(res => 
      this.setState({
        question: res.filter(ele => {
          if (ele.question_id.toString() === window.location.pathname.replace(/\D/g, "")) {
            return ele
          }})[0]
          //Amber TTD: need to refractor above & move to redux function
      }))
  }
  
  render() {
    if (this.state.question) {
      return <Question question={this.state.question}/>
    } else {
      return <div>Loading</div>
    }
  }
}

export default QuestionAbout;