import ReduxThunk from 'redux-thunk' 

export const setToken = (token) => ({
  type: 'SET_TOKEN',
  token
})

export const logout = () => ({
  type: 'LOGOUT',
})

export const getUsers = (users) => ({
  type: 'GET_USERS',
  users
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
      .then(res => dispatch(removeOffer(id)))
    }
  }
}

export const fetchQuestionAndOffers = (questionid) => {
  return function (dispatch) {
    dispatch(requestOffers());

    const token = localStorage.getItem('token');
    // above - real token OR - use the token below
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMzQ1NjcsInVzZXJuYW1lIjoiTW9jayBMZWFybmVyIiwiZmlyc3ROYW1lIjoiRmlyc3QgTGVhcm5lciBOYW1lIiwibGFzdE5hbWUiOiJMYXN0IExlYXJuZXIgTmFtZSIsImVtYWlsIjoibW9ja2xlYXJuZXJAZ21haWwuY29tIiwiY3JlZGl0cyI6MCwia2FybWEiOjAsImF2YWlsYWJsZSI6bnVsbCwicHJvZmlsZUJhZGdlIjoiaHR0cHM6Ly9pbWFnZS5mbGF0aWNvbi5jb20vaWNvbnMvcG5nLzEyOC8yMzUvMjM1Mzk0LnBuZyIsImNyZWF0ZWRBdCI6IjIwMTktMDMtMjBUMTg6Mzg6MzcuOTM3WiIsInVwZGF0ZWRBdCI6IjIwMTktMDMtMjBUMTg6Mzg6MzcuOTM3WiIsImlhdCI6MTU1MzEwNzk1OSwiZXhwIjoxNTU1Njk5OTU5fQ.XCzJ17SrRP567urQDbEPRDtuireYM_kGo6hIxp3hDkY"
    
    if (token) {
      return fetch(`http://localhost:4000/questions/${questionid}/offers`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json'
        },
        })
        .then(res => res.json()) // res = question object and array of offer objects
        .then(res => {
          const offers = res.offers;
          Promise.all(offers.map(offer => fetch(`http://localhost:4000/users/${offer.tutor}`, {
            method: 'GET',
              headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
              },
              })
              .then(res => {
                const tutor = res.json(); // res = array of tutor objects
                return tutor;
              })
              .then(tutor => dispatch(updateTutors(tutor))
          )))
          return res; // res = question object and array of offer objects
        })
        .then(res => {
          dispatch(updateQuestion(res.question)); // dispatch question to store
          dispatch(updateOffers(res.offers)) // dispatch offers to the store
        })
    } else {
      console.log('User needs to log in to see their questions');
    }
  }
}






