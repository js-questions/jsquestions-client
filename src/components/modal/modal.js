import React, { Component } from 'react';
import '../log-in/log-in.scss';
import { Link } from "react-router-dom";
import '../../phone.scss';

class Modal extends Component {

  render() {
    console.log()
    return (
      <div className="backdrop">
        <div className="modal">
          <h1>HEYYY</h1>
          <p>Modal Body</p>
          <Link to={`/chat/${this.props.question.room_id}/${this.props.question.question_id}/tutor`}>Modal Button</Link>
          <i className="Phone is-animating"></i>
        </div>
      </div>
    )
  }
}

export default Modal;