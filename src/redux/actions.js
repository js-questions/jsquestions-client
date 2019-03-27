export const setToken = (token) => ({
  type: 'SET_TOKEN',
  token
})

export const setUsers = (users) => ({
  type: 'SET_USERS',
  users
})

export const setUser = (user) => ({
  type: 'SET_USER',
  user
})

export const logout = () => ({
  type: 'LOGOUT',
})

export const requestOffers = (questionid) => ({
  type: 'REQUEST_OFFERS',
  questionid
})

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

export const updateQuestion = (question) => ({
  type: 'UPDATE_QUESTION',
  question
})

export const updateQuestions = (questions) => ({
  type: 'UPDATE_QUESTIONS',
  questions
})

export const updateTutors = (tutor) => ({
  type: 'UPDATE_TUTORS',
  tutor
})

export const updateKarma = (karma, user) => ({
  type: 'UPDATE_KARMA',
  karma,
  user
});

export const updateChatQuestion = (question) => ({
  type: 'CHATROOM_QUESTION',
  question
})

export const rejectOffer = (id) => {
  return function (dispatch) {
    const token = localStorage.getItem('token');
    if (token) {
      return fetch(`http://localhost:4000/offers/${id}/reject`, {
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
    dispatch(requestOffers());

    if (token) {
      return fetch(`http://localhost:4000/questions/${questionid}/offers`, {
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
