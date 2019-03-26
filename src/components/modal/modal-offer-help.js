import React from 'react';
import '../log-in/log-in.scss';
import './modal.scss';
import { useSpring, animated } from 'react-spring';

const offerHelp = (e, modalInfo, props) => {
  e.preventDefault();
  props.sendOffer(modalInfo)
  props.closeOfferModal()
}

function ModalOfferHelp(props) {
  const [modalInfo, setModalInfo ] = React.useState({
    message: null,
    questionid: props.modalRef.questionid,
    expiration: 15 * 6000 + Date.now(),
  })

  const backdropAnimation = useSpring({ reverse: !props.showModal, from: {display: 'none'}, to: {display: 'block'}, delay: (_) => !props.showModal ? 500 : 0 })
  const props2 = useSpring({ reverse: !props.showModal, to: {opacity: 1, width: '600px', height: '600px'}, from: {opacity: 0, width: '0px', height: '0px'}, config: {duration:500}})
  const props3 = useSpring({ opacity: 1, from: {opacity: 0}, config: {duration:3000}})
  const props4 = useSpring({ opacity: 1, from: {opacity: 0}, config: {duration:4000}})

  return (
    <animated.div style={backdropAnimation}>
    <div className="backdrop">
      {/* <animated.div style={props2}> */}
      <div className="modal">
        {/* <animated.div style={props3}> */}
        <button className="button-close" onClick={()=>props.closeOfferModal()}>X</button>
        <h3>{props.modalRef.title}</h3>
        <form className="offer-help__form">
          <input type='text' placeholder='Explain how you can help' maxLength="200" onChange={(event) => setModalInfo({...modalInfo, questionid: props.modalRef.questionid, message: event.target.value})} />

          <div className="offer-help-select-time">
            <p>Waiting time [min]: </p>
            <select className="modal-waiting-time" onChange={(event) => {
            const time = event.target.value * 6000 + Date.now();
            setModalInfo({...modalInfo, questionid: props.modalRef.questionid, expiration: time})}}>
              <option value='15'>15 min</option>
              <option value='30'>30 min</option>
              <option value='45'>45 min</option>
              <option value='60'>1h</option>
              <option value='75'>1h 15min</option>
              <option value='90'>1h 30min</option>
              <option value='105'>1h 45min</option>
              <option value='120'>2h</option>
              <option value='135'>2h 15min</option>
              <option value='150'>2h 30min</option>
              <option value='165'>2h 45min</option>
              <option value='180'>3h</option>
            </select>
          </div>


          {/* <animated.div style={props4}> */}
          <button className="button-primary button-offer-help" onClick={(e)=> offerHelp(e, modalInfo, props)}>{props.modalRef.button}</button>
          {/* </animated.div> */}
        </form>
        {/* </animated.div> */}
      </div>
      {/* </animated.div> */}
    </div>
    </animated.div>
  )
}

export default ModalOfferHelp;