import React, { Component } from 'react';
import '../log-in/log-in.scss';
import { Link } from "react-router-dom";

class Modal extends Component {

  render() {
    console.log('modal', this.props);
    return (
      <div className="backdrop">
        <div className="modal">
          <div>Modal Title</div>
          <div>Modal Body</div>
          <Link to='/chat/3a10d0d9-f023-45bf-a1fc-d7365efce836'>Modal Button</Link>
        </div>
      </div>
    )
  }
}

export default Modal;