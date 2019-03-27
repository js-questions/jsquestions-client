import React, { Component } from 'react';
import '../log-in/log-in.scss';
import { Link } from "react-router-dom";
import '../../phone.scss';

class TutorNotification extends Component {

  render() {
    // We need to add the learner and question information to this modal. Styling.
    return (
      <div className="backdrop">
        <div className="modal">
          <h2>Incoming call!</h2>
          <Link className="link-style" onClick={this.props.enterChatroom} to={`/chat/${this.props.question.room_id}/${this.props.question.question_id}/tutor`}>
            <i className="Phone is-animating"></i>
          </Link>
        </div>
      </div>
    )
  }
}

export default TutorNotification;