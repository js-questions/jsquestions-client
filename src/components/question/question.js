import React, { Component } from 'react';
import './question.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";

class Question extends Component {
  state = {
    buttonAlreadyClicked: false
  }

  renderOfferButton = () => {
    let btn_class = '';
    let btn_text = '';
    let disableFlag = false;
    if (this.props.question.status==="closed") {
      disableFlag = true;
      btn_class = "button-closed";
      btn_text =  "closed";
    } else if (this.props.question.status==="pending"){
      btn_class = "button-primary offerSent";
      btn_text =  "Pending";
      disableFlag = true;
    } else {
      btn_class = "button-offerHelp offerNotSent";
      btn_text = "Offer Help";
    }

    //Amber TTD: needs 3 if statement to change if person is not online
      return <button className={btn_class} disabled={disableFlag} onClick={() => {this.props.openOfferModal(this.props.question.question_id)}}>{btn_text}</button>
  }
  renderOfflineButton = () => {
    return <button disabled className="button-offline">Offline</button>
  }


  //Amber TTD: there needs to be a way on page refresh that these will stay the same

  render() {

    //disable offerbutton on user offline
    let availability = '';
    let offerButtonExists = '';
    let tickedIfAnswered = (<div></div>);

    if (this.props.offlineUsers) {
      const learnerOffline = this.props.offlineUsers ? this.props.offlineUsers.find(o2 => this.props.question.learner === o2.user_id) : null;
      offerButtonExists = learnerOffline ? this.renderOfflineButton() :
        this.props.openOfferModal ? this.renderOfferButton() : null ;
      availability = learnerOffline ? 'availability offline' : 'availability online';
    } else {
      availability = '';
      offerButtonExists = (<div></div>);
    }

    if (this.props.answered) {
      tickedIfAnswered = (<div><FontAwesomeIcon icon={faCheck} className="icon__answered"/></div>);
    } else if (!this.props.answered && !this.props.question.status) {
      tickedIfAnswered = (<div><FontAwesomeIcon icon={faQuestion} className="icon__not-answered"/></div>);
    }


    return (
      <div className="question__container">
        <div className="question__user">
          <div className="question__img">
            <img src={this.props.user.profileBadge} alt="profile-badge"/>
          </div>
          <div className={availability}></div>
          <p>{this.props.user.username}</p>
        </div>
        <div className="question__body">
          <h4>Question </h4>
          <div className="question__title">{this.props.question.title}</div>
          <h4>Description </h4>
          <div className="question__description">{this.props.question.description}</div>
        </div>
        {offerButtonExists}
        {tickedIfAnswered}
      </div>
    );
  }
}

export default Question;

