import React, { Component } from 'react';
import './landing-page.scss';
import question from '../../assets/question.png';
import sendMessage from '../../assets/sendMessage.png';
import chat from '../../assets/chat.svg';
import email from '../../assets/email.png';

class LandingPage extends Component {

  handleClick = (e) => {
    const searchTerm = document.getElementById("searchTerm").value;
    e.preventDefault();
    this.props.history.push('/ask', searchTerm);
  }

  render() {
    return (
      <div class="landing-page">
        <h2>How it works</h2>
        <div className="landing-page__work-flow">
          <div>
            <h3>Get help!</h3>
            <div>
              <h5 className="landing-page__work-flow-odd">
                <img src={question} className="landing-page-icon" width="20px" alt="tokens"/>
                Ask a question
              </h5>
              <h5 className="landing-page__work-flow-even">
                <img src={email} className="landing-page-icon" width="20px" alt="tokens"/>
                Check your offers
              </h5>
              <h5 className="landing-page__work-flow-odd">
                <img src={chat} className="landing-page-icon" width="30px" alt="tokens"/>
                Connect with a tutor
              </h5>
            </div>
          </div>

          <div>
            <h3>Help others!</h3>
            <div>
              <h5 className="landing-page__work-flow-odd">
                <img src={question} className="landing-page-icon" width="20px" alt="tokens"/>
                Browse help requests
              </h5>
              <h5 className="landing-page__work-flow-even">
                <img src={sendMessage} className="landing-page-icon" width="30px" alt="tokens"/>
                Send an invitation
              </h5>
              <h5 className="landing-page__work-flow-odd">
                <img src={chat} className="landing-page-icon" width="30px" alt="tokens"/>
                Connect with a learner
              </h5>
            </div>

          </div>
        </div>
        <div className="landing-page__help-others">
          <h2>Join the JS Questions community.</h2>
          <h4>There's no better practice than solving real world problems.</h4>
          <button className="button-primary">Join now!.</button>
        </div>
        <div className="landing-page__footer">
          <p>© JS Questions 2019. View our Data Policy and Terms.</p>
        </div>
      </div>
    )
  }
}

export default LandingPage;
