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
      title: 'Offer help to [name]',
      description: null,
      button: 'Send chat invitation',
      subbutton: null
    }
  }

  getQuestions = () => {
    const token = localStorage.getItem('token');
    if (token) {
      this.setState({loggedIn: true})
    }
    fetch(`${process.env.REACT_APP_END_POINT_URL}/questions`, {
      method: 'GET', 
      headers : { 
        'Authorization' : 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }})
    .then(res => res.json())
    .then(res=> this.setState({
      questions: res
    }))
  }

  sendOffer = (questionid, buttonAlreadyClicked) => {
    //Amber TTD: Needs to have a way if they click and aren't siged in they need to sign in
    //Will only send offer once
    console.log(questionid)
    if (!buttonAlreadyClicked) {
      const token = localStorage.getItem('token');
      fetch(`${process.env.REACT_APP_END_POINT_URL}/questions/${questionid}/offers`, {
        method: 'POST', 
        headers : { 
          'Authorization' : 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: {
          'message': 'i Kinda know english, need help?',
          'expiration': new Date()
          //Amber TTD: MAKE SURE EXPIRATION IS A NUMBER...number of seconds until not available
          //Amber TTD: this needs to be filled out in a popup modal
        }
      })
        .then(res => res.json())
        .then(res=> console.log('offer sent to BE', res))
        //Amber TTD: if there are no responses sent show "there aren't any questions being asked right now"
    }   
  }

  offerModal = () => {
    console.log('jsdfjlsdf')
    if (this.state.showModal){
      return <ModalOfferHelp modalRef={this.state.modalRef} closeOfferModal={this.closeOfferModal}/>
    }
  }

  openOfferModal = () => {
    this.setState({
      showModal: true
    })
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
      return this.state.questions.map((question, index) => {
        return (
          <div className="question-container" key={index} >
            <Question question={question} openOfferModal={this.openOfferModal} sendOffer={this.sendOffer} /> 
            {/*TASSSSSK //need function to make modal popup */}
          </div>
    )})} 
    //No questions to render
    else {
      return  <div>There aren't any questions being asked right now :( </div>
    }
  }

  componentWillMount() {
    this.getQuestions();
  }

  render() {
    return (
      <div className="answer-container">
        <h1>Help learners</h1>
        <h3>Here are the latests questions</h3>
        <div className="answer-filters">
          <div className="answer-filter">
            <h4>Filter:</h4>
            <div>All</div>
            <div>Open</div>
            <div>Pending</div>
            <div>Closed</div>
          </div>
          <div className="answer-dropdown">
            <h4>Sort by:</h4>
            <div className="dropdown">
              <div className="dropbtn">
                <div>Newest</div>
                <FontAwesomeIcon icon={faChevronDown} className="icon-style"/>
              </div>
              <div className="dropdown-content">
                <div>Newest</div>
                <div>Oldest</div>
              </div>
            </div>
          </div>
        </div>
        {this.offerModal()}
        {this.renderQuestions()}
      </div>
    )
  }
}

export default AnswerPage;