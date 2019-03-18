import React, { Component } from 'react';
import './log-in.scss';

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      email: '',
      password: '',
      url: 'http://jsquestions.docs.apiary.io',
      userExists: false
    }
    this.handleSignup = this.handleSignup.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleSignup (e) {
    e.preventDefault();
    fetch(`${this.state.url}/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          "username": this.state.username,
          "email": this.state.email,
          "password": this.state.password
        }
      )
      })
      // .then(res => localStorage.setItem('token', res.token))

      localStorage.setItem('token', '12345abcdef')

      // protected routes usng middleware - every time we route to a new component, check if user has the token
  }

  handleLogin (e) {
    e.preventDefault();
    // fetch(`${this.state.url}/user/log-in`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(
    //     {
    //       "email": this.state.email,
    //       "password": this.state.password
    //     }
    //   )
    //   })
      // .then(res => localStorage.setItem('token', '12345abcdef'))
      localStorage.setItem('token', '12345abcdef')

  }
  
  render() {
    
    if (!this.state.userExists) {
      console.log('should be false', this.state.userExists)
      return(
        <div className="ooo-signup">
        <button>Open Login Form</button>
          <form onSubmit={this.handleSignup}>
          <input type='text' placeholder='Username' value={this.state.username} onChange={(event) => this.setState({username: event.target.value}, () => console.log(this.state.username))}/>
            <input type='text' placeholder='E-mail address' value={this.state.email} onChange={(event) => this.setState({email: event.target.value}, () => console.log(this.state.email))}/>
            <input type='text' placeholder='Password' value={this.state.password} onChange={(event) => this.setState({password: event.target.value}, () => console.log(this.state.email))}/>
            <button>Sign up</button>
          </form>
          <button onClick={() => this.setState({userExists: !this.state.userExists})}>I already have an account</button>
        </div>
      )
    } else {
      console.log('should be true', this.state.userExists)
      return(
        <div className="ooo-login">
        <button>Open Login Form</button>
          <form onSubmit={this.handleLogin}>
            <input type='text' placeholder='E-mail address' value={this.state.email} onChange={(event) => this.setState({email: event.target.value}, () => console.log(this.state.email))}/>
            <input type='text' placeholder='Password' value={this.state.password} onChange={(event) => this.setState({password: event.target.value}, () => console.log(this.state.email))}/>
            <button>Sign in</button>
          </form>
          <button onClick={() => this.setState({userExists: !this.state.userExists})}>I don't have an account</button>
        </div>
      )
    }
  }
}

export default Login;
