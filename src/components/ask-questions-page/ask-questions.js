/* -------------------------------------------------------------------
Ask-question component:
This component allows the user to post a question filling a form.
If the user is not logged in, the help button will redirect the user to
the sign-in/log-in components.
Otherwise, it redirects the user to the question-posted components.
---------------------------------------------------------------------- */

import React, { Component } from 'react';
import './ask-questions.scss';
import Login from '../log-in/log-in.js';

class AskQuestions extends Component {
  state = {
      title : '',
      describeProblem : '',
      relatedResources : '',
      codeLink : '',
      showSignup: false,
      storedQuestion: null,
      login: true,
    }

  componentDidMount() {
    //populates input field on user searched term from landing page
    if (this.props.location.state) {
      this.setState({
        title: this.props.location.state.title
      })

    }
  }

  handleClick = (e) => {
    const token = localStorage.getItem('token');
    e.preventDefault();
    if (!token) {
      //forces user to sign up before continuing
      this.setState({
        showSignup:true
      })
    } else {
      this.signedIn(token);
    }
  }

  postQuestion = async (token) => {
      //sends question to post to database
      await fetch(`http://localhost:4000/questions`, {
        method: 'POST',
        headers : {
          'Authorization' : 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(
          {"title": this.props.location.state ? this.props.location.state.title : this.state.title,
          "description": this.state.describeProblem,
          "resources": this.state.relatedResources,
          "code": this.state.codeLink }
      )})
      .then(res => res.json())
      .then(res=> this.setState({storedQuestion: res}))
  }

  showSignupModal = () => {
    if (this.state.showSignup) {
      return <Login switch={this.switchLogin} login={this.state.login} close={this.toggleSignUp} signedIn={this.signedIn}/>
    }
  }

  switchLogin = () => {
    this.setState({login: !this.state.login});
  }

  toggleSignUp = () => {
    this.setState({showSignup: !this.state.showSignup})
  }

  signedIn = async (token) => {
    //sends question to database and then sends user to question posted page
    await this.postQuestion(token);
    this.props.history.push(`/question-posted/${this.state.storedQuestion.question_id}`, this.state.storedQuestion);
  }

  render() {
    return (
      <div className="ask-questions">
        <h1>Ask a Question</h1>
        <div className="ask-questions__form-box">
          <form className="ask-questions__form">
            <h4>Title (*)</h4>
            <input className={this.state.title ? 'bold-input' : 'no-input'} maxLength="200" value={this.state.title} onChange={(event) => this.setState({title: event.target.value})} autoComplete="off" placeholder='My title is...' />

            <h4>Describe your problem</h4>
            <textarea maxLength="1000" onChange={(event) => this.setState({describeProblem: event.target.value})} placeholder='What problem are you having? What do you want to achieve?'/>

            <h4>Related resources</h4>
            <textarea maxLength="200" onChange={(event) => this.setState({relatedResources: event.target.value})} placeholder='What research did you already do? Add any Stack Overflow articles, blog posts, Github repos,
  Codepens, etc. here.'/>

            <h4>Link to Code</h4>
            <input maxLength="200" onChange={(event) => this.setState({codeLink: event.target.value})} autoComplete="off" placeholder='Ex: Github Repo, JSFiddle, Codepen, etc.'/>

            <button className="button-primary" onClick={this.handleClick.bind(this)}>Help!</button>
            <p className="ask-questions__p">(*) These are the only mandatory fields but the more information you give the tutors, the better they will understand your problem.</p>
          </form>

        </div>


        {this.showSignupModal()}
      </div>
    )

  }
}

export default AskQuestions;
