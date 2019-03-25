import React from 'react';
import './navbar.scss';
import { Link } from "react-router-dom";

class ProfileMenu extends React.Component {
  handleLogout = () => {
    localStorage.removeItem('token');
    this.props.logout();
  }

  render() {
    return (
      <div className="profile-menu">
        <div className="menu-item"><Link to='/ask'>My profile</Link></div>
        <div className="menu-item"><Link to='/my-questions'>My questions</Link></div>
        <div className="menu-item"><Link to='/ask'>My help requests</Link></div>
        <div className="menu-item"><Link to='/' onClick={this.handleLogout}>Logout</Link></div>
      </div>
    )
  }
}

export default ProfileMenu;