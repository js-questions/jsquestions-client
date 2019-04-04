/* -----------------------------------------------------
question-posted component:
This component displays question information and the
existing offers for that specific question.
-------------------------------------------------------- */

import React, { Component } from 'react';
import './question-posted.scss';
import { connect } from 'react-redux';
import { setUsers, addNewUser, fetchQuestionAndOffers, updateQuestion, rejectOffer, updateOffer } from '../../redux/actions.js';
import Card from '../card/card.js';

class QuestionPosted extends Component {
  state = {
    questionid: window.location.pathname.replace(/\D/g, ""),
    token: localStorage.getItem('token')
  }

  componentDidMount() {
    this.fetchUsers();
    // Obtain questions and offers from store
    this.props.fetchQuestionAndOffers(this.state.questionid, this.state.token);
    // Socket-io listener from server. Update store when message is received.
    this.props.socket.on('offer sent', ({ offer, updateTutor }) => {
      this.props.updateOffer(offer);
      this.props.addNewUser(updateTutor)
    })
  }

  // Send GET request to server for all users and update store
  fetchUsers = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/users`, {
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
    await fetch(`${process.env.REACT_APP_SERVER_URL}/questions/${this.state.questionid}`, {
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

  // Render offers. Each offer is a card component
  renderOffers = () => {
    if (!this.props.question.answered) {
      const offers = this.props.offers;
      return offers.map((offer) => {
        const tutor = this.props.users.find(user => user.user_id === offer.tutor)
        if (offer.linked_question === +this.state.questionid) return <div key={offer.offer_id}><Card tutor={tutor} offer={offer} rejectOffer={() => this.rejectOffer(offer.offer_id)} chatNow={(e) => this.handleClick(e, tutor.user_id, offer.offer_id)}/></div>
        return 'No offers for this question yet';
      });
    } else {
      const dateUpdated = this.props.question.updatedAt.split('T')[0]+ ' '+this.props.question.updatedAt.split('T')[1].split('.')[0];
      return(
        <div className="question-message">This question was answered on {dateUpdated}</div>
      )
    }

  }

  // Remove offer for a specific question in the store
  rejectOffer = (offerid) => {
    this.props.rejectOffer(offerid);
  }

  // Remove 'offer sent' listener
  componentWillMount() {
    this.props.socket.removeListener('offer sent');
  }

  // If no offers exist, display a message. Otherwise display all offers.
  checkOffersExist() {
    if (this.props.users && this.props.offers.length) {
      return this.renderOffers()
    } else if (!this.props.offers.length) {
      return (<div className="question-message">Offers coming soon!</div>)
    }
  }

  render() {
    return (
      <div className="question-posted">
        <h1>Question: {this.props.question.title}</h1>
        <hr></hr>
        <h3 className="question-posted-subtitle">Description:</h3>
        <p className="question-posted-text">{this.props.question.description}</p>
        <h3 className="question-posted-subtitle">Resources:</h3>
        <p className="question-posted-text">{this.props.question.resources ? this.props.question.resources : 'None'}</p>
        <h3 className="question-posted-subtitle">Code Link:</h3>
        <p className="question-posted-text">{this.props.question.code ? this.props.question.code : 'None'}</p>
        <h3 className="question-posted-subtitle">Help offers from other users:</h3>
        <div>
          {this.checkOffersExist()}
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

const mapDispatchToProps = { setUsers, addNewUser, fetchQuestionAndOffers, updateQuestion, rejectOffer, updateOffer };

export default connect(mapStateToProps, mapDispatchToProps)(QuestionPosted);