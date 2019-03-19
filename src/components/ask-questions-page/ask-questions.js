import React, { Component } from 'react';
import './ask-questions.scss';
import { HashRouter, Redirect } from 'react-router-dom';
import Login from '../log-in/log-in.js';

class AskQuestions extends Component {
  state = {
      title : '',
      describeProblem : '',
      relatedResources : '',
      codeLink : '',
      showSignup: false 
    }

  handleClick(e) {
    const token = localStorage.getItem('token');
    e.preventDefault()

    if(!token){
      //forces user to sign up before continueing
      this.setState({
        showSignup:true ///
      })
    }

    if(token) {
      //sends question to post to database
      fetch(`${process.env.REACT_APP_END_POINT_URL}/questions`, {
        method: 'post', 
        headers : { 
          'Authorization' : 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(
          {"title": this.state.title,
          "description": this.state.describeProblem,
          "resources": this.state.relatedResources,
          "code": this.state.codeLink }
      )})
      .then(res => res.json())
      //sends user to question posted page 
      this.props.history.push('/question-posted')
    }
  }

  showSignupModal = () => {
    if (this.state.showSignup) {
      return <Login close={this.toggleSignUp}/>
    }
  }

  toggleSignUp = () => {
    this.setState({showSignup: !this.state.showSignup})
  }
  

  componentDidMount(){
    //populates input field on user searched term from landing page
    if(this.props.location.state){
      this.setState({
        title: this.props.location.state
      })
    }
  }

  render() {
    return (
      <div>
        <h1>Ask a Question</h1>
        <form>
          <h4>Title</h4>
          {this.props.location.state ? 
            <input value={this.state.title} onChange={(event) => this.setState({title: event.target.value})} placeholder='My title is...PREFILLED QUESTION' />
          : <input onChange={(event) => this.setState({title: event.target.value})} placeholder='My title is...PREFILLED QUESTION' />
          }
          
          <h4>Discribe your problem</h4>
          <input onChange={(event) => this.setState({describeProblem: event.target.value})} placeholder='What problem are you having? What do you want to achieve?'/>
          <h4>Related resources</h4>
          <input onChange={(event) => this.setState({relatedResources: event.target.value})} placeholder='What research did you already do? Add any Stack Overflow articles, blog posts, Github repos,
Codepens, etc. here.'/>
          <h4>Link to Code</h4>
          <input onChange={(event) => this.setState({codeLink: event.target.value})} placeholder='Ex: Github Repo, JSFiddle, Codepen, etc.'/>
          <button onClick={this.handleClick.bind(this)}>Help!</button>
        </form>

        {this.showSignupModal()}
      </div>
    )

  }
}

export default AskQuestions;
