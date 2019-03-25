import React, { Component } from 'react';
import './modal.scss';

class ModalOfferHelp extends Component {
  state = {
    message: null,
    questionid: this.props.modalRef.questionid,
    expiration: Date.now() + 30
  }

  offerHelp = (e) => {
    e.preventDefault();
    this.props.sendOffer(this.state)
    this.props.closeOfferModal()
  }

  render() {
    return (
      <div className="backdrop">
        <div className="modal">
          <button onClick={()=>this.props.closeOfferModal()}>X</button>
          <div>{this.props.modalRef.title}</div>
          <div>{this.props.modalRef.description}</div>
          <form>
            <input type='text' placeholder='Explain how you can help' onChange={(event) => this.setState({message: event.target.value})} />
            <input type='text' value='30'/>
            <button onClick={(e)=> this.offerHelp(e)}>{this.props.modalRef.button}</button>
          </form>
        </div>
      </div>
    )
  }
}

export default ModalOfferHelp;