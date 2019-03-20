import ReduxThunk from 'redux-thunk' 

export const setToken = (token) => ({
  type: 'SET_TOKEN',
  token
})

export const logout = (user) => ({
  type: 'LOGOUT',
  user
})

export const requestOffers = (questionid) => ({
  type: 'REQUEST_OFFERS',
  questionid
})

export const updateOffers = (offers) => ({
  type: 'UPDATE_OFFERS',
  offers
})

export const updateQuestion = (question) => ({
  type: 'UPDATE_QUESTION',
  question
})

export const updateTutors = (tutor) => ({
  type: 'UPDATE_TUTORS',
  tutor
})



export const fetchQuestionAndOffers = (questionid) => {
  return function (dispatch) {
    dispatch(requestOffers());
    // const token = localStorage.getItem('token');
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMzQ1NjcsInVzZXJuYW1lIjoiTW9jayBMZWFybmVyIiwiZmlyc3ROYW1lIjoiRmlyc3QgTGVhcm5lciBOYW1lIiwibGFzdE5hbWUiOiJMYXN0IExlYXJuZXIgTmFtZSIsImVtYWlsIjoibW9ja2xlYXJuZXJAZ21haWwuY29tIiwiY3JlZGl0cyI6MCwia2FybWEiOjAsImF2YWlsYWJsZSI6bnVsbCwicHJvZmlsZUJhZGdlIjoiaHR0cHM6Ly9pbWFnZS5mbGF0aWNvbi5jb20vaWNvbnMvcG5nLzEyOC8yMzUvMjM1Mzk0LnBuZyIsImNyZWF0ZWRBdCI6IjIwMTktMDMtMjBUMTg6Mzg6MzcuOTM3WiIsInVwZGF0ZWRBdCI6IjIwMTktMDMtMjBUMTg6Mzg6MzcuOTM3WiIsImlhdCI6MTU1MzEwNzk1OSwiZXhwIjoxNTU1Njk5OTU5fQ.XCzJ17SrRP567urQDbEPRDtuireYM_kGo6hIxp3hDkY"
    if (token) {
      // return fetch(`http://localhost:4000/questions/${questionid}/offers`, {
      return fetch(`${process.env.REACT_APP_END_POINT_URL}/questions/${questionid}/offers`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json'
        },
        })
        .then(res => res.json()) // returns question and array of offers 
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
                const tutor = res.json();
                return tutor;
              })
              .then(tutor => dispatch(updateTutors(tutor))
          )))
          return res;
        })
        .then(res => {
          dispatch(updateQuestion(res.question));
          dispatch(updateOffers(res.offers))
        })
    } else {
      console.log('User needs to log in to see their questions');
    }
  }
}






