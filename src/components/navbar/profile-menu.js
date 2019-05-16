/* ----------------------------------------------------------------
profile-menu component:
This component displays a dropdown menu from the user avatar in the
navbar component.
The menu has three fields: my profile, my questions and logout.
------------------------------------------------------------------- */

import React, { Component } from 'react';
import './navbar.scss';
import { Link } from "react-router-dom";

class ProfileMenu extends Component {

  constructor(props) {
    super(props);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  // Add mousedown listener when component is mounted
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  // Remove mousedown listener when component is unmounted
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleLogout = () => {
    // Remove token from storage
    localStorage.removeItem('token');
    // Hide menu
    this.props.toggleMenu();
     // Emit an 'offline user' message to server through socket-io
    this.props.socket.emit('offline user', this.props.user.user_id);
    // Call logout function
    this.props.logout();
  }

  // toggle menu when user clicks outside it
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.toggleMenu();
    }
  }

  render() {
    return (
      <div className="profile-menu" ref={this.setWrapperRef}>
        <div className="arrow-up"></div>
        <div className="menu-item"><Link className="profile-menu__link" to='/ask'>My profile</Link></div>
        <div className="menu-item"><Link className="profile-menu__link" to='/my-questions'>My questions</Link></div>
        <div className="menu-item"><Link className="profile-menu__link" to='/' onClick={this.handleLogout}>Logout</Link></div>
      </div>
    )
  }
}

export default ProfileMenu;