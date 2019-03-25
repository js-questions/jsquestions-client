import React, { Component } from 'react';
import '../log-in/log-in.scss';
import { Link } from "react-router-dom";
import '../../phone.scss';

class TutorInvitation extends Component {

  render() {
    return (
      <div className="backdrop">
        <div className="modal">
          <h1>HEYYY</h1>
          <p>Modal Body</p>
          <Link onClick={this.props.enterChatroom} to={`/chat/${this.props.question.room_id}/${this.props.question.question_id}/tutor`}>Modal Button</Link>
          <i className="Phone is-animating"></i>
        </div>
      </div>
    )
  }
}

export default TutorInvitation;