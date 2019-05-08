//-------------------User (Me)-----------------------------------------//
export const setUser = (user) => ({
  type: 'SET_USER',
  user
})

export const updateKarma = (karma) => ({
  type: 'UPDATE_KARMA',
  karma
});

export const logout = () => ({
  type: 'LOGOUT',
})

//-------------------Users--------------------------------------------//

// for all users
export const setUsers = (users) => ({
  type: 'SET_USERS',
  users
})

// setting or updating the users in the array of users
export const addNewUser = (user) => ({
  type: 'ADD_NEW_USER',
  user
})


//------------------Questions You've Asked----------------------------//

// updates the store with the latest questions from the database
export const updateQuestions = (questions) => ({
  type: 'UPDATE_QUESTIONS',
  questions
})

// updates the status of your question after it's closed
export const updateQuestionStatus = (question) => ({
  type: 'UPDATE_QUESTION_STATUS',
  question
})

// sets the question you will notify the tutor with
export const updateQuestion = (question) => ({
  type: 'UPDATE_QUESTION',
  question
})

//----------------Offers--------------------------------------------------//

export const updateOffers = (offers) => ({
  type: 'UPDATE_OFFERS',
  offers
})

export const updateOffer = (offer) => ({
  type: 'UPDATE_OFFER',
  offer
})

export const removeOffer = (id) => ({
  type: 'REJECT_OFFER',
  id
})

export const rejectOffer = (id) => {
  return function (dispatch) {
    const token = localStorage.getItem('token');
    if (token) {
      return fetch(`${process.env.REACT_APP_SERVER_URL}/offers/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json'
        },
      })
      .then(res => res.json())
      .then(() => dispatch(removeOffer(id)))
    }
  }
}

export const fetchQuestionAndOffers = (questionid, token) => {
  return function (dispatch) {
    if (token) {
      return fetch(`${process.env.REACT_APP_SERVER_URL}/questions/${questionid}/offers`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json'
        },
        })
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            dispatch(updateQuestion(data.question));
            dispatch(updateOffers(data.offers));
          }
        })
    } else {
      console.log('User needs to log in to see their questions');
    }
  }
}
