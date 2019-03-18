import React, { Component } from 'react';
import './navbar.scss';

class Navbar extends Component {
  
  render() {
    return(
      <div>
        <a href="/">Give help</a>
        <a href="/">Ask for help</a>
        <button>Sign Up</button>
      </div>
    )
  }
}

export default Navbar;

