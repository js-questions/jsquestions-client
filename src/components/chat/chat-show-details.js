import React from 'react';
import '../log-in/log-in.scss';

function ShowDetails(props) {
  return (
    <div className="backdrop">
      <div className="modal move-center">
      <button className="button-close" onClick={() => props.closeDetailsModal()}>X</button>
        <h1>Question details</h1>
        <p>Title: <span>{props.all.questionTitle}</span></p>
        <p>Description: <span>{props.all.questionDescription}</span></p>
        <p>Resources:  <span>{props.all.questionResources}</span></p>
        <p>Code Links: <span>{props.all.questionCode}</span></p>
      </div>
    </div>
  )
}

export default ShowDetails;

/* ------------------------------------------------------------------- 
Show details of chat component:
This component helps each party revisit the question details without 
it taking up space of the chat.
---------------------------------------------------------------------- */