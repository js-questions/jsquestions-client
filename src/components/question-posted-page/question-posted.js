import React, { Component } from 'react';
import './question-posted.scss';
import { connect } from 'react-redux';
import { fetchQuestionAndOffers } from '../../redux/actions.js';
import Card from '../card/card.js';

class QuestionPosted extends Component {
  state = {
    questionid: window.location.pathname.replace(/\D/g, ""),
    rerender: false,
    offers: null
  }

  componentDidMount() {
    this.props.fetchQuestionAndOffers(this.state.questionid);

    //WILL RERENDER ON BE NEW OFFER SENT
    this.props.socket.on('new offer', () => {this.setState({rerender: !this.state.rerender})})
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
      question.tutor = tutorId; // adding the tutorId to the question
      this.props.socket.emit('chat now', question)
    })
  }

  renderOffers = () => {
    const offers = this.props.offers;
    const tutors = this.props.tutors;
    return offers.map((offer, index) => {
      if (tutors[index]) {
        return <div key={offer.offer_id}><Card tutor={tutors[index]} offer={offer} chatNow={(e) => this.handleClick(e, tutors[index].user_id, offer.offer_id)}/></div>
      } else {
        return '';
      }
    });
  }
  
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

const mapDispatchToProps = { fetchQuestionAndOffers };

// const mapDispatchToProps = (dispatch) => ({
//   fetchOffers: (questionid) => dispatch(fetchOffers(questionid))
// })

export default connect(mapStateToProps, mapDispatchToProps)(QuestionPosted);