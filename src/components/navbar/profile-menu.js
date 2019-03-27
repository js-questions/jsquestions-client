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

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleLogout = () => {
    localStorage.removeItem('token');
    this.props.toggleMenu();
    this.props.socket.emit('offline user', this.props.user.user_id); // this is causing the page to refresh after logout
    this.props.logout();
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.toggleMenu();
    }
  }

  render() {
    return (
      <div className="profile-menu" ref={this.setWrapperRef}>
        <div class="arrow-up"></div>
        <div className="menu-item"><Link className="profile-menu__link" to='/ask'>My profile</Link></div>
        <div className="menu-item"><Link className="profile-menu__link" to='/my-questions'>My questions</Link></div>
        <div className="menu-item"><Link className="profile-menu__link" to='/' onClick={this.handleLogout}>Logout</Link></div>
      </div>
    )
  }
}

export default ProfileMenu;