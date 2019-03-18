import React, { Component } from 'react';
import './ask-questions.scss';
import { HashRouter, Redirect } from 'react-router-dom';

class AskQuestions extends Component {
  state = {
      title : '',
      describeProblem : '',
      relatedResources : '',
      codeLink : ''
    }

  handleClick(e) {
    e.preventDefault()
    //Amber TTD: If (not Logged in ) -> await sign up modal to continue
    if( localStorage.getItem('token')) {
      //sends question to post to database
      fetch(`${process.env.REACT_APP_END_POINT_URL}/questions`, {
        method: 'post', 
        headers : { 
          'Authorization' : 'Bearer ' + localStorage.getItem('token'),
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
      .then(res => console.log(res))
      //sends user to question posted page 
      this.props.history.push('/question-posted')
    }
  }


  render() {
    //Amber TTD: Need to add prefilled title if (not loggedin ) statement here from landing page... 
    return (
      <div>
        <h1>Ask a Question</h1>
        <form>
          <h4>Title</h4>
          <input onChange={(event) => this.setState({title: event.target.value})} placeholder='My title is...PREFILLED QUESTION' />
          <h4>Discribe your problem</h4>
          <input onChange={(event) => this.setState({describeProblem: event.target.value})} placeholder='What problem are you having? What do you want to achieve?'/>
          <h4>Related resources</h4>
          <input onChange={(event) => this.setState({relatedResources: event.target.value})} placeholder='What research did you already do? Add any Stack Overflow articles, blog posts, Github repos,
Codepens, etc. here.'/>
          <h4>Link to Code</h4>
          <input onChange={(event) => this.setState({codeLink: event.target.value})} placeholder='Ex: Github Repo, JSFiddle, Codepen, etc.'/>
          <button onClick={this.handleClick.bind(this)}>Help!</button>
        </form>
      </div>
    )

  }
}

export default AskQuestions;
