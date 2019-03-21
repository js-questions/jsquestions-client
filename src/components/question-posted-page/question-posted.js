import React, { Component } from 'react';
import './question-posted.scss';
import { connect } from 'react-redux';
import { fetchQuestionAndOffers } from '../../redux/actions.js';
import Card from '../card/card.js';

const toDELETETutorId = 2;

class QuestionPosted extends Component {
  state = {
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
          "answered_by": toDELETETutorId
        }
    )})
    .then(res => console.log(res))
  }

  renderOffers = () => {
    const offers = this.props.offers;
    const tutors = this.props.tutors;
    console.log('render Offers reached')
      return offers.map((offer, index) => {
        if (tutors[index]) {
          return <div key={offer.offerId}><Card tutor={tutors[index]} offer={offer} chatNow={this.handleClick} /></div>
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
  tutors: state.tutors
})

const mapDispatchToProps = { fetchQuestionAndOffers };

// const mapDispatchToProps = (dispatch) => ({
//   fetchOffers: (questionid) => dispatch(fetchOffers(questionid))
// })

export default connect(mapStateToProps, mapDispatchToProps)(QuestionPosted);