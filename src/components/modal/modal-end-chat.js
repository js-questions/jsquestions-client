import React from 'react';
import './modal.scss';
import { useSpring, animated } from 'react-spring';


function ModalEndChat(props){
  const [karmaClicked, setKarmaClicked ] = React.useState({
    karmaClicked: false
  })

  const [feedback, setFeedback] = React.useState({
    feedback: 0
  })

  const closesQuestion = () => {
    const token = localStorage.getItem('token');
    const body = {
      "karma": feedback.feedback,
      "credits": 50,
    }

    fetch(`http://localhost:4000/questions/${props.questionId}/feedback`, {
      method: 'PUT',
      headers : {
        'Authorization' : 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
      })
      .then(res => res.json())
      .then(res => props.closeQuestion(res))
      .then(() => props.updateKarma(feedback.feedback))
  }
  
  const chatFeedback = (e) => {
    e.preventDefault();
    props.closeChatModal()
    if (props.tutorOrLearner === 'tutor'){
      props.history.push('/answer');
    } else {
      closesQuestion();
      props.history.push('/my-questions');
    }
  
  }
  
  const setNewFeedback = (e, num) => {
    e.preventDefault();
    setFeedback({feedback: num})
    if (!karmaClicked) setKarmaClicked({karmaClicked: true})
  }

  const showHide = useSpring({ reverse: !props.showModal, from: {display: 'none'}, to: {display: 'flex'}, delay: (_) => !props.showModal ? 500 : 0 })
  const modal = useSpring({ reverse: !props.showModal, to: {opacity: 1, top: '30%'}, from: {opacity: 0, top: '-46%', right: '25%', left: '25%'}, config: {duration: !props.showModal ? 500 : 500}})


  if (props.tutorOrLearner === 'tutor') {
    return (
      <div>
        <animated.div style={showHide} className="backdrop" onClick={()=>props.closeChatModal()} >
        </animated.div>
        <animated.div style={showHide} >
          <animated.div className="modal" style={modal}>
            <button className="button-close" onClick={()=>props.closeChatModal()}>X</button>
            <h3>Thanks for being a tutor</h3>
            <div>Keep on being awesome. We love you.</div>
            <form>
              <button className="button-primary" onClick={(e)=> chatFeedback(e)}>SUBMIT</button>
            </form>
          </animated.div>
        </animated.div>
      </div>
    )
  } else {
    return (
      <div>
        <animated.div style={showHide} className="backdrop" onClick={()=>props.closeChatModal()} >
        </animated.div>
        <animated.div style={showHide} >
          <animated.div className="modal" style={modal}>
            <button className="button-close" onClick={()=> props.closeChatModal()}>X</button>
            <h3>Hope your Tutor solved your question</h3>
            <div>Feel free to ask more questions or heck help out others if you feel confident!</div>
            <div>Please vote below on how you feel your Tutor did, Karma helps Tutors differencate themselves apart from others.</div>
            <form>
              <div className="modal-karma">
                <button className="button-karma" onClick={(e) => setNewFeedback(e, 0)}>No Karma</button>
                <button className="button-karma" onClick={(e) => setNewFeedback(e, 1)}><span role="img" aria-label="karma">🙏</span></button>
                <button className="button-karma" onClick={(e) => setNewFeedback(e, 3)}><span role="img" aria-label="karma">🙏🙏🙏</span></button>
              </div>
              <button className="button-primary" disabled={!karmaClicked} onClick={(e)=> chatFeedback(e)}>SUBMIT</button>
            </form>
          </animated.div>
        </animated.div>
      </div>
    )
  }
}

export default ModalEndChat;