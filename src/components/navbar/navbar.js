import React from 'react';
import './navbar.scss';

import { connect } from 'react-redux';
import { setToken } from '../../redux/actions.js';

import Login from '../log-in/log-in.js';

class Navbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showSignup: false
    }
  }

  toggleSignUp = () => {
    this.setState({showSignup: !this.state.showSignup})
  }

  loginProcess = () => {
    if (!this.props.user.username) {
      return (<div className="navbar-item" onClick={this.toggleSignUp}>Sign up/Log in</div>)
    }
    else {
      return (
        <div className="navbar-component">
          <div className="navbar-item">Karma</div>
          <div className="navbar-item">Gems</div>
          <div className="navbar-item">Picture</div>
        </div>
      )
    }

  }

  showSignupModal = () => {
    if (this.state.showSignup) {
      return <Login/>
    }
  }

  render() {

    return(
      <div>
        <div className="navbar">
          <div className="navbar-component">
            <div className="navbar-item">Ask for help.</div>
            <div className="navbar-item">Help others.</div>
          </div>
          {this.loginProcess()}
        </div>
        {this.showSignupModal()}
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  user: state.user
})

const mapDispatchToProps = (dispatch) => ({
  setToken: (token) => dispatch(setToken(token))
})

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);