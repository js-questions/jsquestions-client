/* --------------------------------------------------------------------------------
Login component:
This component displays two different modals for the sign-in and log-in processes.
Each modal has a button that re-directs the user to the other modal when clicked.
----------------------------------------------------------------------------------- */

import React, { Component } from 'react';
import '../modal/modal.scss';
import './log-in.scss';
import './../../index.scss';
import btoa from 'btoa';
import jwt_decode from 'jwt-decode';
import { setUser } from '../../redux/actions.js';
import { connect } from 'react-redux';

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      email: '',
      password: '',
      url: `${process.env.REACT_APP_SERVER_URL}`,
      userExists: false,
      loginError: '',
      signUpError: ''
    }
    this.handleSignup = this.handleSignup.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  // Post information in the database and update redux store
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
       if (res.token) {
        const decoded = jwt_decode(res.token);
         localStorage.setItem('token', res.token);
         this.props.setUser(decoded);
         this.forwardsToQuestionPosted();
         this.props.close();
       } else {
        this.setState({signUpError: res}, () => console.log(res));
       }
     })
  }

  // Post information in the database and update redux store
  handleLogin = async (e, res) => {
    e.preventDefault();
    // Send encoded email/password info to the server with basic authentication
    const payload = btoa(`${this.state.email}:${this.state.password}`);
    fetch(`${this.state.url}/log-in`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + payload,
      },
      })
      .then(res => res.json())
      .then(res => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          const decoded = jwt_decode(res.token);
          this.props.setUser(decoded)
          this.props.close();
          this.forwardsToQuestionPosted();
        } else {
          this.setState({loginError: res}, () => console.log(res));
        }
      })
  }

  forwardsToQuestionPosted = () => {
    const token = localStorage.getItem('token');
    if (this.props.signedIn) {
      this.props.signedIn(token)
    }
  }

  render() {

    // Render sign-up modal
    if (!this.props.login) {
      return(
        <div className="backdrop backdrop-login">
          <div className="modal modal-login">
            <button className="button-close" onClick={this.props.close}>X</button>
            <h2>Sign Up</h2>
            <form onSubmit={this.handleSignup} className="form-style">
              <input type='text' minLength="4" maxLength="12" placeholder='Username' value={this.state.username} onChange={(event) => this.setState({username: event.target.value})} required />
              <input type='email' placeholder='E-mail address' maxLength="200" value={this.state.email} onChange={(event) => this.setState({email: event.target.value})} required />
              <input type='password' minLength="6" maxLength="200" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$" title="Please include at least 1 uppercase character, 1 lowercase character, and 1 number" placeholder='Password' value={this.state.password} onChange={(event) => this.setState({password: event.target.value})} required />
              <button className="button-primary">Sign up</button>
            </form>
            <p>{this.state.signUpError}</p>
            <button className="button-secondary" onClick={this.props.switch}>I already have an account</button>
          </div>
        </div>
      )

    // Render log-in modal
    } else {
      return(
        <div className="backdrop backdrop-login">
          <div className="modal modal-login">
            <button className="button-close" onClick={this.props.close}>X</button>
            <h2>Log in</h2>
            <form onSubmit={this.handleLogin}>
              <input type='email' placeholder='E-mail address' value={this.state.email} onChange={(event) => this.setState({email: event.target.value})} required/>
              <input type='password' placeholder='Password' value={this.state.password} onChange={(event) => this.setState({password: event.target.value})} required/>
              <button className="button-primary">Sign in</button>
            </form>
            <p>{this.state.loginError}</p>
            <button className="button-secondary" onClick={this.props.switch}>I don't have an account</button>
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
  setUser: (user) => dispatch(setUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);

