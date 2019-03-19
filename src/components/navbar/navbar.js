import React from 'react';
import './navbar.scss';
import { connect } from 'react-redux';
import { setToken } from '../../redux/actions.js';
import Login from '../log-in/log-in.js';
import logo from '../../assets/square-logo.png';
import token from '../../assets/token.png';

class Navbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showSignup: false,
      openModal: true
    }
  }

  componentDidMount = () => {
    this.checkToken();
  }

  toggleSignUp = () => {
    this.setState({showSignup: !this.state.showSignup})
  }

  checkToken = () => {
    const checkToken = localStorage.getItem('token');
    if (checkToken) {
      return this.props.setToken(checkToken);
    }
  }

  loginProcess = () => {
    if (!this.props.user.username) {
      return (<div className="navbar-item" onClick={this.toggleSignUp}>Sign up/Log in</div>)
    }
    else {
      return (
        <div className="navbar-component">
          <div className="navbar-item">{this.props.user.karma}<span role="img" className="navbar-icon" aria-label="karma"> 🙏</span></div>
          <div className="navbar-item">{this.props.user.credits}<img src={token} className="navbar-icon" width="18px" alt="tokens"/></div>
          <div className="navbar-item">
            <img src={this.props.user.profileBadge} width="50px" alt="profile-badge"/>
            <p id="username">{this.props.user.username}</p>  
          </div>
        </div>
      )
    }

  }

  showSignupModal = () => {
    if (this.state.showSignup) {
      return <Login close={this.toggleSignUp}/>
    }
  }

  render() {

    return(
      <div>
        <div className="navbar">
          <div className="navbar-component">
            <div className="navbar-item"><img src={logo} width="55px" alt="logo"/></div>
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