import React, { Component } from 'react';
import './question-posted.scss';
import { connect } from 'react-redux';
import { fetchQuestionAndOffers } from '../../redux/actions.js';
import Card from '../card/card.js';

const toDELETETutorId = 123456;

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

  renderOffers = () => {
    const offers = this.props.offers;
    return offers.map(offer => {
      return <div key={offer.offerId}><Card chatNow={this.handleClick} dateSubmitted={offer.createdAt} expiration={offer.expiration} tutorId={offer.tutor} message={offer.message}/></div>
    });
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
          {this.renderOffers()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  offers: state.offers
})

const mapDispatchToProps = { fetchQuestionAndOffers };

// const mapDispatchToProps = (dispatch) => ({
//   fetchOffers: (questionid) => dispatch(fetchOffers(questionid))
// })

export default connect(mapStateToProps, mapDispatchToProps)(QuestionPosted);