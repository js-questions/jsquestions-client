import React, { Component } from 'react';
import '../log-in/log-in.scss';
import { Link } from "react-router-dom";
import '../../phone.scss';

class TutorInvitation extends Component {

  render() {
    return (
      <div className="backdrop">
        <div className="modal">
          <h2 className="modal__incoming-call">Incoming call from {this.props.learner.username}!</h2>
          <p className="modal__incoming-call">{this.props.question.title}</p>
          <Link className="link-style" onClick={this.props.enterChatroom} to={`/chat/${this.props.question.room_id}/${this.props.question.question_id}/tutor`}>
            <i className="Phone is-animating"></i>
          </Link>
        </div>
      </div>
    )
  }
}

export default TutorInvitation;