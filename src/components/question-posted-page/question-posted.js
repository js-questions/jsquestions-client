import React, { Component } from 'react';
import './question-posted.scss';
import { connect } from 'react-redux';
import { setUsers, fetchQuestionAndOffers, updateQuestion, rejectOffer, updateOffer } from '../../redux/actions.js';
import Card from '../card/card.js';

class QuestionPosted extends Component {
  state = {
    questionid: window.location.pathname.replace(/\D/g, ""),
    token: localStorage.getItem('token')
  }

  componentDidMount() {
    this.fetchUsers();
    this.props.fetchQuestionAndOffers(this.state.questionid, this.state.token);
    this.props.socket.on('offer sent', (offer) => this.props.updateOffer(offer))
  }

  fetchUsers = () => {
    fetch(`http://localhost:4000/users`, {
      headers : {
        'Authorization' : 'Bearer ' + this.state.token,
    }})
      .then(res => res.json())
      .then(users => this.props.setUsers(users))
  }

  handleClick = (e, tutorId, offerId) => {
    e.preventDefault();
    this.alertTutor(this.state.token, tutorId, offerId);
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
      const learner = this.props.user;
      question.tutor = tutorId; // adding the tutorId to the question
      this.props.socket.emit('chat now', { question, learner })
    })
  }

  renderOffers = () => {
    const offers = this.props.offers;
    return offers.map((offer) => {
      const tutor = this.props.users.find(user => user.user_id === offer.tutor)
      return <div key={offer.offer_id}><Card tutor={tutor} offer={offer} rejectOffer={() => this.rejectOffer(offer.offer_id)} chatNow={(e) => this.handleClick(e, tutor.user_id, offer.offer_id)}/></div>
    });
  }

  rejectOffer = (offerid) => {
    this.props.rejectOffer(offerid);
  }

  render() {
    return (
      <div className="question-posted">
        <h1>Question: {this.props.question.title}</h1>
        <h3>Description:</h3>
        <p>{this.props.question.description}</p>
        <div>
          {this.props.users && this.props.offers ? this.renderOffers() : 'Loading...'}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  users: state.users,
  offers: state.offers,
  question: state.question
})

const mapDispatchToProps = { setUsers, fetchQuestionAndOffers, updateQuestion, rejectOffer, updateOffer };

export default connect(mapStateToProps, mapDispatchToProps)(QuestionPosted);