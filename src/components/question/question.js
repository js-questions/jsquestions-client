import React, { Component } from 'react';
import './question.scss';

class Question extends Component {
  state = {
    buttonAlreadyClicked: false
  }

  renderOfferButton = () => {
    let btn_class = this.state.buttonAlreadyClicked ? "button-primary offerSent" : "button-primary offerNotSent";
    let btn_text = this.state.buttonAlreadyClicked ? "Sent" : "Offer Help";
    //Amber TTD: needs 3 if statement to change if person is not online
      return <button className={btn_class} onClick={() => {this.changeColor(); this.props.openOfferModal(this.props.question.question_id)}}>{btn_text}</button>
  }
  renderOfflineButton = () => {
    return <button>Sorry OFFLINE</button>
  }

  changeColor = () => {
    this.setState({buttonAlreadyClicked: true})
  }

  //Amber TTD: there needs to be a way on page refresh that these will stay the same

  render() {

    //disable offerbutton on user offline

    const learnerOffline = this.props.offlineUsers ? this.props.offlineUsers.find(o2 => this.props.question.learner === o2.user_id) : null;

    const offerButtonExists = learnerOffline ? this.renderOfflineButton() : 
      this.props.openOfferModal ? this.renderOfferButton() : null ;
    
    return (
      <div className="question__container">
        <div className="question__user">Avatar</div>
        <div className="question__body">
          <p className="question__title">Question: {this.props.question.title}</p>
          <p className="question__description">Description: {this.props.question.description}</p>
        </div>
        {offerButtonExists}
      </div>
    );
  }
}

export default Question; 

