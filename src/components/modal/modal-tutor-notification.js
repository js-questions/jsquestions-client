import React from 'react';
import '../log-in/log-in.scss';
import { Link } from "react-router-dom";
import '../../phone.scss';
import { useSpring, animated } from 'react-spring';

function TutorNotification (props) {
  var scrollY = window.pageYOffset;
  const showHide = useSpring({ reverse: !props.question, from: {display: 'none'}, to: {display: 'flex'}, delay: (_) => !props.question ? 500 : 0 })
  const modal = useSpring({ reverse: !props.question, to: {opacity: 1, top: `${scrollY + 200}px `}, from: {opacity: 0, top: '-1000px', right: '25%', left: '25%'}, config: {duration: !props.showModal ? 500 : 500}})
  
  return (
    <div>
    <animated.div style={showHide} className="backdrop" >
    </animated.div>
      <animated.div style={showHide} >
        <animated.div className="modal" style={modal}>
          <h2 className="modal__incoming-call">Incoming call from {props.learner.username}!</h2>
          <p className="modal__incoming-call">{props.question.title}</p>
          <Link className="link-style" onClick={props.enterChatroom} to={`/chat/${props.question.room_id}/${props.question.question_id}/tutor`}>
            <i className="Phone is-animating"></i>
          </Link>
        </animated.div>
      </animated.div>
    </div>

  )
}

export default TutorNotification;

/* ------------------------------------------------------------------- 
Tutor notification component:
This component appears on the tutor's page where ever they are on the site
when the learner selects 'chat now' on the question-posted page.
---------------------------------------------------------------------- */