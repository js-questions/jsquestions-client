import React, { Component } from 'react';
import './question-posted.scss';
import { connect } from 'react-redux';
import { fetchQuestionAndOffers } from '../../redux/actions.js';

const toDELETETutorId = 123456;

class QuestionPosted extends Component {
  state = {
<<<<<<< HEAD
    questionid: this.props.location.state.questionId
=======
    // we changed userId to questionId
    questionid: this.props.location.state.questionId
  }

  componentDidMount() {
    this.props.fetchQuestionAndOffers(this.state.questionid);
>>>>>>> develop
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

const mapStateToProps = (state) => ({
  user: state.user
})

const mapDispatchToProps = { fetchQuestionAndOffers };

// const mapDispatchToProps = (dispatch) => ({
//   fetchOffers: (questionid) => dispatch(fetchOffers(questionid))
// })

export default connect(mapStateToProps, mapDispatchToProps)(QuestionPosted);