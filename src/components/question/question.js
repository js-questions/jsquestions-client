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
      return <button className={btn_class} disabled={this.state.buttonAlreadyClicked} onClick={() => {this.changeColor(); this.props.openOfferModal(this.props.question.question_id)}}>{btn_text}</button>
  }
  renderOfflineButton = () => {
    return <button disabled className="button-primary">Sorry OFFLINE</button>
  }

  changeColor = () => {
    this.setState({buttonAlreadyClicked: true})
  }

  //Amber TTD: there needs to be a way on page refresh that these will stay the same

  render() {

    //disable offerbutton on user offline
    let availability = '';
    let offerButtonExists = '';

    if (this.props.offlineUsers) {
      const learnerOffline = this.props.offlineUsers ? this.props.offlineUsers.find(o2 => this.props.question.learner === o2.user_id) : null;
      offerButtonExists = learnerOffline ? this.renderOfflineButton() :
        this.props.openOfferModal ? this.renderOfferButton() : null ;
      availability = learnerOffline ? 'availability offline' : 'availability online';
    } else {
      availability = '';
      offerButtonExists = (<div></div>);
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
          <p className="question__title">{this.props.question.title}</p>
          <h4>Description </h4>
          <p className="question__description">{this.props.question.description}</p>
        </div>
        {offerButtonExists}
      </div>
    );
  }
}

export default Question;

