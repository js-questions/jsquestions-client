// import React, { Component } from 'react';
// import './question.scss';

// class Question extends Component {
//   render() {
//     return (
//       <div className="question-container">
//         <div className="question-avatar">
//           <div>Avatar</div>
//           <div>Status</div>
//         </div>
//         <div className="question-body">
//           <div>Date</div>
//           <div>Question title</div>
//           <div>More details</div>
//         </div>
//         <div className="queston-action">
//           <div>Button</div>
//         </div>
//       </div>
//     )

//   }
// }

// export default Question;

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
