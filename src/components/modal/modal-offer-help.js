import React, { Component } from 'react';
import '../log-in/log-in.scss';
import { Link } from "react-router-dom";

class ModalOfferHelp extends Component {
  state = {
    explain: null
  }

  offerHelp = (e) => {
    e.preventDefault();
    console.log('lol')

  }

  render() {
    console.log('modal props', this.props);
    return (
      <div className="backdrop">
        <div className="modal">
          <button onClick={()=>this.props.closeOfferModal()}>X</button>
          <div>{this.props.modalRef.title}</div>
          <div>{this.props.modalRef.description}</div>
          <form>
            <input type='text' placeholder='Explain how you can help' onChange={(event) => this.setState({explain: event.target.value})} />
            <input type='text' value='30'/>
            <button onClick={(e)=> this.offerHelp(e)}>{this.props.modalRef.button}</button>
          </form>
          {/* <button>{this.props.modalRef.subbutton}</button> */}
        </div>
      </div>
    )
  }
}

export default ModalOfferHelp;