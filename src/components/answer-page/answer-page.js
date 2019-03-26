import React, { Component } from 'react';
import './answer-page.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import Question from '../question/question';
import ModalOfferHelp from './../modal/modal-offer-help';

class AnswerPage extends Component {
  state = {
    questions: null,
    loggedIn: false,
    showModal: false,
    modalRef: {
      //Amber TTD: Need to refractor this
      title: 'Offer help to [name]',
      description: null,
      button: 'Send chat invitation',
      questionid: null
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
    .then(res=> this.setState({
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
    //Amber TTD: Needs to have a way if they click and aren't siged in they need to sign in
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
    //Amber TTD: if there are no responses sent show "there aren't any questions being asked right now"
  }

  showOfferModal = () => {
    if (this.state.showModal) {
      return <ModalOfferHelp modalRef={this.state.modalRef} closeOfferModal={this.closeOfferModal} sendOffer={this.sendOffer}/>
    }
  }

  openOfferModal = (questionid) => {
    this.setState( state => {
      // state.showModal = true
      state.modalRef.questionid = questionid
    })
    this.setState({
      showModal: true
    })
    //TTD DEBUG: The state is not changing when inside the first state change, this is why the other is nessessary
  }

  closeOfferModal = () => {
    //close it here
    this.setState({
      showModal: false
    })
    //Amber TTD: need a way to cancel offer help sent question comonent button change
  }

  renderQuestions = () => {
    //User is not logged in
    if (!this.state.loggedIn) {
      return <div>You must be logged in to see active questions</div>
    }
    //Questions being loaded
    else if (this.state.questions === null) {
      return <div>LOADING</div>
    }
    //Renders questions
    else if (this.state.questions.length > 0) {
      console.log('allUsers ', this.state.allUsers)
      return this.state.questions.map((question, index) => {
        console.log('question ', question)
        return (
          <div className="question-container" key={index} >
            <Question question={question} openOfferModal={this.openOfferModal} offlineUsers={this.state.offlineUsers}/>
          </div>
      )})}
    //No questions to render
    else {
      return <div>There aren't any questions being asked right now :( </div>
    }
  }

  componentWillMount() {
    this.getUsers();
    this.getQuestions();
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

export default AnswerPage;