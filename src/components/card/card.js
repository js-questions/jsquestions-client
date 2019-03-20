import React, { Component } from 'react';
import './card.scss';

class Card extends Component {

  render() {
    if (this.props.chatNow) {
      return (
        <div className="card-container">
          <div className="card-avatar">
            <div>Avatar</div>
            <div>{this.props.tutor}</div>
            <div>Status</div>
          </div>
          <div className="card-body">
            <div>{this.props.dateSubmitted}</div>
            <div>{this.props.message}</div>
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