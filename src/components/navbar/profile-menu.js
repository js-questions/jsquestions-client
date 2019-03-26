import React from 'react';
import './navbar.scss';
import { Link } from "react-router-dom";

class ProfileMenu extends React.Component {
  handleLogout = () => {
    localStorage.removeItem('token');
    this.props.logout();
    this.props.socket.emit('offline user', this.props.user.user_id);
  }

  render() {
    return (
      <div className="profile-menu">
        <div className="menu-item"><Link className="profile-menu__link" to='/ask'>My profile</Link></div>
        <div className="menu-item"><Link className="profile-menu__link" to='/my-questions'>My questions</Link></div>
        <div className="menu-item"><Link className="profile-menu__link" to='/' onClick={this.handleLogout}>Logout</Link></div>
      </div>
    )
  }
}

export default ProfileMenu;