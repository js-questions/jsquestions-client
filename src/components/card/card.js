import React, { Component } from 'react';
import './card.scss';

class Card extends Component {

  render() {
    if (this.props.chatNow) {
      return (
        <div className="card-container">
          <div className="card-avatar">
            <div>{this.props.tutor.username}</div>
            <div>{this.props.tutor.credits}</div>
            <div>Status</div>
          </div>
          <div className="card-body">
            <div>{this.props.offer.dateSubmitted}</div>
            <div>{this.props.offer.message}</div>
            <div># Karma earned so far</div>
          </div>
          <div className="card-action">
          <button onClick={this.props.chatNow}>chat now</button>
          </div>
        </div>
      )
    } else {
      return (
        <h1>All available questions</h1>
      )
    }

  }
}

export default Card;