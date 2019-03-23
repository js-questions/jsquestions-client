import React, { Component } from 'react';
import '../log-in/log-in.scss';
import { Link } from "react-router-dom";

class Modal extends Component {

  render() {
    console.log()
    return (
      <div className="backdrop">
        <div className="modal">
          <div>Modal Title</div>
          <div>Modal Body</div>
          <Link to={`/chat/${this.props.question.room_id}/${this.props.question.question_id}/tutor`}>Modal Button</Link>
        </div>
      </div>
    )
  }
}

export default Modal;