import React, { Component } from 'react';
import './answer-page.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { connect } from 'react-redux';
import { updateQuestions, updateOffer } from '../../redux/actions.js';
import Question from '../question/question';
import ModalOfferHelp from './../modal/modal-offer-help';

class AnswerPage extends Component {
  state = {
    questions: null,
    loggedIn: false,
    showModal: false,
    modalRef: {
      questionid: null,
      learner: null,
    },
    offlineUsers: null,
    allUsers: null
  }

  getQuestions = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      this.setState({loggedIn: true})
    }
    fetch(`http://localhost:4000/questions`, {
      method: 'GET',
      headers : {
        'Authorization' : 'Bearer ' + token,
        'Content-Type': 'application/json'
      }})
    .then(res => res.json())
    .then(res => this.setState({
      questions: res
    }))
  }

  getUsers = () => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`http://localhost:4000/users/`, {
        method: 'GET',
        headers : {
          'Authorization' : 'Bearer ' + token,
          'Content-Type': 'application/json'
        }})
      .then(res => res.json())
      .then(res => {
        this.setState({
          offlineUsers: res.filter(user => {
            return user.available === null;
          })
        });
        this.setState({
          allUsers: res
        });
      })
    }
  }

  sendOffer = (details) => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:4000/questions/${details.questionid}/offers`, {
      method: 'POST',
      headers: {
        'Authorization' : 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "message": details.message,
        "expiration": details.expiration
      })
    })
      .then(res => res.json())
      .then(offer => {
        this.props.updateOffer(offer);
        const currentQuestion = this.state.questions.filter(question => question.question_id === offer.linked_question);
        this.props.socket.emit('offer sent', { offer, learner_id: currentQuestion[0].learner })
      })
  }

  showOfferModal = () => {
    return <ModalOfferHelp questions={this.state.questions} users={this.state.allUsers} showModal={this.state.showModal} modalRef={this.state.modalRef} closeOfferModal={this.closeOfferModal} sendOffer={this.sendOffer}/>
  }

  openOfferModal = (question) => {
    this.setState(state => {
      state.modalRef.questionid = question.question_id
      state.modalRef.learner = question.learner
    })
    this.setState({
      showModal: true
    })
  }

  closeOfferModal = () => {
    //close it here
    this.setState({
      showModal: false
    })
  }

  renderQuestions = () => {
    //User is not logged in
    if (!this.state.loggedIn) {
      return <div>You must be logged in to see active questions</div>
    }
    //Questions being loaded
    else if (this.state.questions === null) {
      return <div>LOADING...</div>
    }
    //Renders questions
    else if (this.state.questions.length > 0) {
      const questionsHelpNow = this.state.questions.filter((question) => question.status==='help-now' && this.state.offlineUsers.filter(user => user.user_id===question.learner).length===0);
      const questionsPending = this.state.questions.filter((question) => question.status==='pending' && this.state.offlineUsers.filter(user => user.user_id===question.learner).length===0);
      const questionsClosed = this.state.questions.filter((question) => question.status==='closed' && this.state.offlineUsers.filter(user => user.user_id===question.learner).length===0);
      const questionsOffline = this.state.questions.filter((question) => this.state.offlineUsers.filter(user => user.user_id===question.learner).length>0);

      const questionsSorted = [];
      if (questionsHelpNow && questionsHelpNow.length>0) questionsHelpNow.forEach(el => questionsSorted.push(el));
      if (questionsPending && questionsPending.length>0) questionsPending.forEach(el => questionsSorted.push(el));
      if (questionsClosed && questionsClosed.length>0) questionsClosed.forEach(el => questionsSorted.push(el));
      if (questionsOffline && questionsOffline.length>0) questionsOffline.forEach(el => questionsSorted.push(el));

      return questionsSorted.map((question, index) => {
        let user = this.state.allUsers.filter(user => { return user.user_id===question.learner})[0];
        return (
          <div className="question-container" key={index} >
            <Question question={question} user={user} openOfferModal={this.openOfferModal} offlineUsers={this.state.offlineUsers}/>
          </div>
        )
        })}
    //No questions to render
    else {
      return <div>There aren't any questions being asked right now :( </div>
    }
  }

  componentWillMount = async () => {
    await this.getUsers();
    await this.getQuestions();
  }

  toggleButton = (e, id) => {
    if (e.currentTarget.className==='answer-page__filter-unselected') {
      e.currentTarget.className='answer-page__filter-selected';
    } else {
      e.currentTarget.className='answer-page__filter-unselected';
    }
  }

  render() {
    return (
      <div className="answer-page__container">
        <h1>Help learners</h1>
        <h3>Here are the latests questions</h3>
        <div className="answer-page__filters">
          <div className="answer-page__filter">
            <h4> Filter:</h4>
            <div id="filter-2" className="answer-page__filter-unselected" onClick={this.toggleButton}>Open</div>
            <div id="filter-3" className="answer-page__filter-unselected" onClick={this.toggleButton}>Pending</div>
            <div id="filter-4" className="answer-page__filter-unselected" onClick={this.toggleButton}>Closed</div>
          </div>
          <div className="answer-page__dropdown-box">
            <h4>Sort by:</h4>
            <div className="answer-page__dropdown">
              <div className="answer-page__dropbtn">
                <div>Newest</div>
                <FontAwesomeIcon icon={faChevronDown} className="answer-page__icon"/>
              </div>
              <div className="answer-page__dropdown__content">
                <div>Newest</div>
                <div>Oldest</div>
              </div>
            </div>
          </div>
        </div>
        {this.showOfferModal()}
        {this.renderQuestions()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  questions: state.questions
})

const mapDispatchToProps = (dispatch) => ({
  updateOffer: (offer) => dispatch(updateOffer(offer)),
  updateQuestions: (questions) => dispatch(updateQuestions(questions)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AnswerPage);

/* ------------------------------------------------------------------- 
Answer page component:
This component renders all learner questions and displays if the 
question is closed, open, pending or the user is offline.
---------------------------------------------------------------------- */