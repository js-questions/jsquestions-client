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
    console.log("props", props)
    console.log("feedback", feedback)
    
    const token = localStorage.getItem('token');
    console.log("token", token)
    const body = {
      "karma": feedback,
      "credits": 50,
    }
  
      fetch(`http://localhost:4000/questions/${props.questionId}/feedback`, {
        method: 'PUT',
        headers : {
          'Authorization' : 'Bearer ' + token,
        },
        body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(res => props.updateKarma(feedback))
        .then(omg => console.log(omg))



    // fetch(`http://localhost:4000/questions/${props.questionId}/feedback`, {
    //   method: 'PUT',
    //   headers: {
    //     'Authorization' : 'Bearer ' + token,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(body)
    // })
    //   .then(res => res.json())
    //   .then(res => props.closeQuestion(res)) //??
    //   .then(() => props.updateKarma(feedback));
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


  if (props.tutorOrLearner === 'tutor') {
    return (
      <div className="backdrop">
        <div className="modal">
          <button className="button-close" onClick={()=>props.closeChatModal()}>X</button>
          <h3>Thanks for being a tutor</h3>
          <div>Keep on being awesome. We love you.</div>
          <form>
            <button className="button-primary" onClick={(e)=> chatFeedback(e)}>SUBMIT</button>
          </form>
        </div>
      </div>
    )
  } else {
    return (
      <div className="backdrop">
        <div className="modal">
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
        </div>
      </div>
    )
  }

}

export default ModalEndChat;