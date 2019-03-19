import React, { Component } from 'react';
import './question-posted.scss';

const toDELETETutorId = 123456;

class QuestionPosted extends Component {
  state = {
    questionid: this.props.location.state.userId
  }

  handleClick = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    this.alertTutor(token);

    this.props.history.push('/chat', this.props.location.state);
  }

  alertTutor = async (token) => {
    //sends info to backend so that tutor will be alerted
    await fetch(`${process.env.REACT_APP_END_POINT_URL}/questions/${this.state.questionid}`, {
      method: 'PUT', 
      headers : { 
        'Authorization' : 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(
        {
          "answeredBy": toDELETETutorId
        }
    )})
    .then(res => res.json())
    .then(res=> console.log("here", res)) //I don't need a response back here
}

//Amber TTD: Check how user is being sent to backend in the chat component into socket...COMPLETED need to talk to Natalia about requests
  render() {
    return (
      <div>
        Question was Posted
        <br/>
        <div>
          Your question: 
          <b>
            {this.props.location.state.title}
            {this.props.location.state.description}
          </b>
          <br/>
          <br/>
        </div>
        <div>
          TO DELETE: Fake tutor wants to 
          <button onClick={this.handleClick.bind(this)}>chat now</button>
        </div>
      </div>
    )
  }
}

export default QuestionPosted;


// answered: false
// answeredBy: "null"
// code: "Code?"
// createdAt: "2017-01-08T21:00:11.620Z"
// description: "I have trouble with English. Is this the correct website?"
// learner: 1234567
// resources: "www.merriam-webster.com"
// roomId: "b7619275-1184-48b5-bcd5-63efbc9c0699"
// title: "My question"
// updatedAt: "2017-01-08T21:00:11.620Z"
// userId: 18374874