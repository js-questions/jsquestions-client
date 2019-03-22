import React, { Component } from 'react';
import '../log-in/log-in.scss';
import { Link } from "react-router-dom";

class ModalEndChat extends Component {
  state = {
    feedback: null,
    // questionid: this.props.modalRef.questionid,
    // expiration: Date.now() + 30
  }

  closesQuestion = () => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:4000/questions/${this.props.questionId}/feedback'`, {
      method: 'PUT', 
      headers: { 
        'Authorization' : 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "karma": this.state.feedback,
        "credits": 50
      })
    })
      .then(res => res.json())
      .then(res=> console.log('question CLOSED', res))
  }

  chatFeedback = (e) => {
    e.preventDefault();
    // this.props.sendOffer(this.state) //Amber TTD: put feedback in here
    this.props.closeChatModal()
    this.closesQuestion();
    this.props.history.push('/');
  }

  render() {
    if (this.props.tutorOrLearner === 'tutor') {
      return (
        <div className="backdrop">
          <div className="modal">
            <button onClick={()=>this.props.closeChatModal()}>X</button>
            <div>Thanks for being a tutor</div>
            <div>Keep on being awesome, We love you.</div>
            <form>
              <button onClick={(e)=> this.chatFeedback(e)}>SUBMIT</button>
            </form>
          </div>
        </div>
      )
    } else {
      return (
        <div className="backdrop">
          <div className="modal">
            <button onClick={()=>this.props.closeChatModal()}>X</button>
            <div>Hope your Tutor solved your question</div>
            <div>Feel free to ask more questions or heck help out others if you feel confident!</div>
            <div>Please vote below on how you feel your Tutor did, Karma helps Tutors differencate themselves apart from others.</div>
            <form>
              <button onClick={() => this.setState({feedback: 0})}>0 karma</button>
              <button onClick={(event) => this.setState({feedback: 1})}>1 karma</button>
              <button onClick={(event) => this.setState({feedback: 3})}>3 karma</button>
              <button onClick={(e)=> this.chatFeedback(e)}>SUBMIT</button>
            </form>
          </div>
        </div>
      )
    }
    
  }
}

export default ModalEndChat;