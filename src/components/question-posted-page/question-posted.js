import React, { Component } from 'react';
import './question-posted.scss';
import { connect } from 'react-redux';
import { fetchQuestionAndOffers, updateQuestion, rejectOffer, getUsers } from '../../redux/actions.js';
import Card from '../card/card.js';

class QuestionPosted extends Component {
  state = {
    questionid: window.location.pathname.replace(/\D/g, ""),
    token: localStorage.getItem('token')
  }

  componentDidMount() {
    if (this.state.token) {      
      fetch('http://localhost:4000/users', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + this.state.token,
            'Accept': 'application/json'
          }
        })
        .then(res => res.json())
        .then(users => this.props.fetchQuestionAndOffers(this.state.questionid, users, this.state.token));
    }  
  }

  handleClick = (e, tutorId, offerId) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    this.alertTutor(token, tutorId, offerId);
    this.props.history.push({
      pathname: `/chat/${this.props.question.room_id}/${this.props.question.question_id}/learner`,
      state: {question: this.props.question}
    }) 
  }

  alertTutor = async (token, tutorId, offerId) => { // also sending offerId
    await fetch(`http://localhost:4000/questions/${this.state.questionid}`, {
      method: 'PUT', 
      headers : { 
        'Authorization' : 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(
        {
          "answered_by": offerId // sending offerId instead of tutorId
        }
    )})
    .then(res => res.json())
    .then(question => {
      this.props.updateQuestion(question);
      question.tutor = tutorId; // adding the tutorId to the question
      this.props.socket.emit('chat now', question)
    })

  }

  renderOffers = () => {
    const offers = this.props.offers;
      return offers.map((offer, index) => {
        if (offers.length > 0) {
          return <div key={offer.offer_id}><Card tutor={offer.tutor} offer={offer} rejectOffer={() => this.rejectOffer(offer.offer_id)} chatNow={(e) => this.handleClick(e, offer.tutor.user_id, offer.offer_id)}/></div>
        } else {
          return '';
        }
      });
  }

  rejectOffer = (offerid) => {
    this.props.rejectOffer(offerid);
  }


//Amber TTD: Check how user is being sent to backend in the chat component into socket...COMPLETED need to talk to Natalia about requests
  render() {

    return (
      <div>
        <h1>Question: {this.props.question.title}</h1>
        <h2>Description: {this.props.question.description}</h2>
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

const mapDispatchToProps = { fetchQuestionAndOffers, updateQuestion, rejectOffer, getUsers };

// const mapDispatchToProps = (dispatch) => ({
//   fetchOffers: (questionid) => dispatch(fetchOffers(questionid))
// })

export default connect(mapStateToProps, mapDispatchToProps)(QuestionPosted);