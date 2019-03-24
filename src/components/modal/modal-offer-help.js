import React, { Component, useState  } from 'react';
import '../log-in/log-in.scss';
import { Link } from "react-router-dom";
import { useSpring, animated, config } from 'react-spring';


const offerHelp = (e, modalInfo, props) => {
  e.preventDefault();
  props.sendOffer(modalInfo)
  props.closeOfferModal()
}

function ModalOfferHelp(props) {
  const [modalInfo, setModalInfo ] = React.useState({
    message: null,
    questionid: props.modalRef.questionid,
    expiration: Date.now() + 30
  })
  
  const props2 = useSpring({ to: {opacity: 1, width: '600px', height: '600px'}, from: {opacity: 0, width: '0px', height: '0px'}, config: {duration:500}})
  const props3 = useSpring({ opacity: 1, from: {opacity: 0}, config: {duration:2000}})
  const props4 = useSpring({ opacity: 1, from: {opacity: 0}, config: {duration:3000}})

  return (
    <div className="backdrop">
      <animated.div style={props2}>
      <div className="modal">
        <animated.div style={props3}>
        <button onClick={()=>props.closeOfferModal()}>X</button>
        <div>{props.modalRef.title}</div>
        <div>{props.modalRef.description}</div>
        <form>
          <input type='text' placeholder='Explain how you can help' onChange={(event) => setModalInfo({message: event.target.value, questionid: props.modalRef.questionid, expiration: Date.now() + 30})} />
          <input type='text' value='30'/>
          <animated.div style={props4}>
          <button onClick={(e)=> offerHelp(e, modalInfo, props)}>{props.modalRef.button}</button>
          </animated.div>
        </form>
        </animated.div>
      </div>
      </animated.div>
    </div>
  )
}

export default ModalOfferHelp;