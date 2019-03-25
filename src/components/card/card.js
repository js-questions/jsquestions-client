import React, { Component } from 'react';
import './card.scss';

class Card extends Component {

  render() {
      return (
        <div className="card-container">
          <div className="card-avatar">
          <div><img src={this.props.tutor.profileBadge} alt="profile-badge" width="50px"/></div>
            <div>{this.props.tutor.firstname} {this.props.tutor.lastname}</div>
            <div>{this.props.tutor.username}</div>
          </div>
          <div className="card-body">
            <div>{this.props.offer.dateSubmitted}</div>
            <div>{this.props.offer.message}</div>
            <div>{this.props.tutor.karma} Karma earned so far</div>
          </div>
          <div className="card-action">
          <button onClick={this.props.chatNow}>chat now</button>
          <button onClick={this.props.rejectOffer}>No thanks!</button>
          </div>
        </div>
      )
    } 
  }

export default Card;