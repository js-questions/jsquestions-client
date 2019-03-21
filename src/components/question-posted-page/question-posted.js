import React, { Component } from 'react';
import './question-posted.scss';
import { connect } from 'react-redux';
import { fetchQuestionAndOffers } from '../../redux/actions.js';
import Card from '../card/card.js';

class QuestionPosted extends Component {
  state = {
    questionid: window.location.pathname.replace(/\D/g, "")
  }

  componentDidMount() {
    this.props.fetchQuestionAndOffers(this.state.questionid);
  }

  handleClick = (e, tutorId) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    this.alertTutor(token, tutorId);
    this.props.history.push({
      pathname: `/chat/${this.props.question.roomId}`,
      state: {question: this.props.question}
    }) 
  }

  alertTutor = async (token, tutorId) => {
    //sends info to backend so that tutor will be alerted
    await fetch(`http://localhost:4000/questions/${this.state.questionid}`, {
    // await fetch(`${process.env.REACT_APP_END_POINT_URL}/questions/${this.state.questionid}`, {
      method: 'PUT', 
      headers : { 
        'Authorization' : 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(
        {
          "answeredBy": tutorId
        }
    )})
    .then(res => console.log(res))
  }

  renderOffers = () => {
    const offers = this.props.offers;
    const tutors = this.props.tutors;
      return offers.map((offer, index) => {
        if (tutors[index]) {
          return <div key={offer.offerId}><Card tutor={tutors[index]} offer={offer} chatNow={(e) => this.handleClick(e, tutors[index].userId)} /></div>
        } else {
          return '';
        }
      });
  }


//Amber TTD: Check how user is being sent to backend in the chat component into socket...COMPLETED need to talk to Natalia about requests
  render() {

    return (
      <div>
        <div>
          {this.renderOffers()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  offers: state.offers,
  tutors: state.tutors,
  question: state.question
})

const mapDispatchToProps = { fetchQuestionAndOffers };

// const mapDispatchToProps = (dispatch) => ({
//   fetchOffers: (questionid) => dispatch(fetchOffers(questionid))
// })

export default connect(mapStateToProps, mapDispatchToProps)(QuestionPosted);