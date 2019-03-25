import React from 'react';
import './navbar.scss';
import { Link } from "react-router-dom";

class ProfileMenu extends React.Component {

  render() {
    return (
      <div className="profile-menu">
        <div className="menu-item"><Link className="profile-menu__link" to='/ask'>My profile</Link></div>
        <div className="menu-item"><Link className="profile-menu__link" to='/my-questions'>My questions</Link></div>
        <div className="menu-item">Logout</div>
      </div>
    )
  }
}

export default ProfileMenu;