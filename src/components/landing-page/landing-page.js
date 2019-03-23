import React, { Component } from 'react';
import './landing-page.scss';

class LandingPage extends Component {

  handleClick = (e) => {
    const searchTerm = document.getElementById("searchTerm").value;
    e.preventDefault();
    this.props.history.push('/ask', searchTerm);
  }

  render() {
    return (
      <div>

        ...rest page content here
      </div>
    )
  }
}

export default LandingPage;
