import React from 'react';
import '../log-in/log-in.scss';
import './modal.scss';
import { useSpring, animated } from 'react-spring';

const offerHelp = (e, modalInfo, props) => {
  e.preventDefault();
  props.sendOffer(modalInfo)
  props.closeOfferModal()
}

let disableButton = true; // disable submit button if no input


function ModalOfferHelp(props) {
  const [modalInfo, setModalInfo ] = React.useState({
    message: null,
    questionid: props.modalRef.questionid,
    expiration: 15 * 6000 * 10 + Date.now(),
  })

  const onChangeInput = (event) => {
    if (event.target.value) disableButton = false;
    else disableButton = true;
    setModalInfo({...modalInfo, questionid: props.modalRef.questionid, message: event.target.value, disableButton: true});
    return true;
  }
  var scrollY = window.pageYOffset;
  const showHide = useSpring({ reverse: !props.showModal, from: {display: 'none'}, to: {display: 'flex'}, delay: (_) => !props.showModal ? 500 : 0 })
  const modal = useSpring({ reverse: !props.showModal, to: {opacity: 1, top: `${scrollY + 200}px `}, from: {opacity: 0, top: '-1000px', right: '25%', left: '25%'}, config: {duration: !props.showModal ? 500 : 500}})

  let currentUser;
  if (props.users) {
    currentUser = props.users.filter(user => user.user_id === props.modalRef.learner)[0];
  }

  let currentQuestion;
  if (props.questions) {
    currentQuestion = props.questions.filter(question => question.question_id === props.modalRef.questionid)[0];
  }



  return (
    <div>
    <animated.div style={showHide} className="backdrop" onClick={()=>props.closeOfferModal()} >
    </animated.div>
    <animated.div style={showHide} >
        <animated.div className="modal" style={modal}>
        <button className="button-close" onClick={()=>props.closeOfferModal()}>X</button>
        <h3>Offer help to {currentUser ? currentUser.username : 'user'} on:</h3>
        <h4>{currentQuestion ? currentQuestion.title : 'question'}</h4>
        <form className="offer-help__form">
          <input type='text' placeholder='Explain how you can help' maxLength="200" onChange={onChangeInput} required/>

          <div className="offer-help-select-time">
            <p>I'll be available for the next: </p>
            <select className="modal-waiting-time" onChange={(event) => {
            const time = event.target.value * 6000 * 10 + Date.now();
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
          <button type='submit' disabled={disableButton} className="button-primary button-offer-help" onClick={(e)=> offerHelp(e, modalInfo, props)}>{props.modalRef.button}</button>
        </form>
        </animated.div>
    </animated.div>
    </div>
  )
}

export default ModalOfferHelp;