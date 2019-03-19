import React, { Component } from 'react';
import './log-in.scss';
import btoa from 'btoa';
import { setToken } from '../../redux/actions.js';
import { connect } from 'react-redux';

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      email: '',
      password: '',
      url: process.env.REACT_APP_END_POINT_URL,
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
     .then(res => res.json())
     .then(res => {
      localStorage.setItem('token', res.token);
      this.props.setToken(res.token)
      this.props.close()
     })

     this.forwardsToQuestionPosted();
  }

  handleLogin = async (e, res) => {
    e.preventDefault();
    const payload = btoa(`${this.state.email}:${this.state.password}`);
    console.log(payload);
    fetch(`${this.state.url}/log-in`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + payload,
      },
      })
      .then(res => res.json())
      .then(res => {
        localStorage.setItem('token', res.token);
        this.props.setToken(res.token)
        this.props.close()
      })
      if (!res) {
        localStorage.setItem('token', 'credentialsnotfound');
      }

      this.forwardsToQuestionPosted();
      
  }

  forwardsToQuestionPosted = () => {
    const token = localStorage.getItem('token');
    if (this.props.signedIn) {
      this.props.signedIn(token)
    }
  }

  render() {

    if (!this.state.userExists) {
      return(
        <div className="backdrop">
          <div className="modal">
            <button onClick={this.props.close}>X</button>
            <form onSubmit={this.handleSignup}>
            <input type='text' placeholder='Username' value={this.state.username} onChange={(event) => this.setState({username: event.target.value}, () => console.log(this.state.username))}/>
              <input type='text' placeholder='E-mail address' value={this.state.email} onChange={(event) => this.setState({email: event.target.value}, () => console.log(this.state.email))}/>
              <input type='text' placeholder='Password' value={this.state.password} onChange={(event) => this.setState({password: event.target.value}, () => console.log(this.state.email))}/>
              <button>Sign up</button>
            </form>
            <button onClick={() => this.setState({userExists: !this.state.userExists})}>I already have an account</button>
          </div>
        </div>
      )
    } else {
      return(
        <div className="backdrop">
          <div className="modal">
          <button onClick={this.props.close}>X</button>
            <form onSubmit={this.handleLogin}>
              <input type='text' placeholder='E-mail address' value={this.state.email} onChange={(event) => this.setState({email: event.target.value}, () => console.log(this.state.email))}/>
              <input type='text' placeholder='Password' value={this.state.password} onChange={(event) => this.setState({password: event.target.value}, () => console.log(this.state.email))}/>
              <button>Sign in</button>
            </form>
            <button onClick={() => this.setState({userExists: !this.state.userExists})}>I don't have an account</button>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

const mapDispatchToProps = (dispatch) => ({
  setToken: (token) => dispatch(setToken(token))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);

