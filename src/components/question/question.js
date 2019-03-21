import React from 'react';

function Question(props) {
  return (
    <div>
      <p>{props.question.title}</p>
      <p>{props.question.description}</p>
    </div>
  );
}

export default Question;