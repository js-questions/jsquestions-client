import React, { Component } from 'react';
import './landing-page.scss';
import getHelp from '../../assets/getHelpPhoto.png';
import helpOthers from '../../assets/helpOthers.png';

class LandingPage extends Component {

  handleClick = (e) => {
    const searchTerm = document.getElementById("searchTerm").value;
    e.preventDefault();
    this.props.history.push('/ask', searchTerm);
  }

  render() {
    return (
      <div className="landing-page">
        <h1>How it works</h1>
        <div className="landing-page__work-flow">
          <img src={getHelp} alt="get-help"/>
          <img src={helpOthers} alt="help-others"/>
        </div>
        <div className="landing-page__help-others">
          <h1>Join the JS Questions community.</h1>
          <h3>There's no better practice than solving real world problems.</h3>
          <button className="button-primary">Join now!</button>
        </div>
        <div className="landing-page__footer">
          <p>© JS Questions 2019. View our Data Policy and Terms.</p>
        </div>
      </div>
    )
  }
}

export default LandingPage;

/* ------------------------------------------------------------------- 
Landing page component:
This component render's bottom static information of the website.
---------------------------------------------------------------------- */
