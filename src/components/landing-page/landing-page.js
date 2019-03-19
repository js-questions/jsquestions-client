import React, { Component } from 'react';
import './landing-page.scss';

class LandingPage extends Component {

  handleClick(e) {
    const searchTerm = document.getElementById("searchTerm").value;
    e.preventDefault();
    this.props.history.push('/ask', searchTerm);
  }

  render() {
    return (
      <div>
        LOGO HERE
        <form>
          <input id="searchTerm" type="text" placeholder="What do you need help with?"/>
          <button onClick={this.handleClick.bind(this)}>?</button>
        </form>
        For when Stack Overflow and the Internet just aren't enough.
        <br/>
        ...rest page content here
      </div>
    )
  }
}

export default LandingPage;
