import React, { Component } from 'react';
import './question-posted.scss';
import { connect } from 'react-redux';
import { fetchQuestionAndOffers } from '../../redux/actions.js';
import QuestionAbout from './question-about';

const toDELETETutorId = 123456;

class QuestionPosted extends Component {
  state = {
    // we changed userId to questionId
    questionid: this.props.location.state.questionId
  }

  componentDidMount() {
    this.props.fetchQuestionAndOffers(this.state.questionid);
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
          "answered_by": toDELETETutorId
        }
    )})
}

//Amber TTD: Check how user is being sent to backend in the chat component into socket...COMPLETED need to talk to Natalia about requests
  render() {
    return (
      <div>
        <QuestionAbout />
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