import React, { Component } from 'react';
import './card.scss';

class Card extends Component {

  checkAvailability() {
    if (this.props.tutor.available) {
      return (<button className="button-primary" onClick={this.props.chatNow}>chat now</button>)
    } else {
      return (<button className="button-primary" disabled onClick={this.props.chatNow}>sorry offline</button>)
    }
  }

  render() {
    if (this.props.tutor) {
      return (
        <div className="card-container">
          <div className="card-avatar">
            <img src={this.props.tutor.profileBadge} alt="profile-badge" width="50px"/>
            <p>{this.props.tutor.username}</p>
          </div>
          <div className="card-body">
            {/* <p className="expiryDate">This offer expires in: {this.props.expirationDate}</p> */}
            <h4>Message:</h4>
            <p>{this.props.offer.message}</p>
            <p className="karmaEarned">{this.props.tutor.karma} <span role="img" aria-label="karma">🙏</span> earned so far</p>
          </div>
          <div className="card-action">
            {this.checkAvailability()}
            <button className="button-secondary" onClick={this.props.rejectOffer}>No thanks!</button>
          </div>
        </div>
      )
    } else {
      return 'Loading...'
    }
  }
}

export default Card;