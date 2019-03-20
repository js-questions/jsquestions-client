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

export const updateTutors = (tutors) => ({
  type: 'UPDATE_TUTOR',
  tutors
})



export const fetchQuestionAndOffers = (questionid) => {
  return function (dispatch) {
    dispatch(requestOffers());
    const token = localStorage.getItem('token');
    if (token) {
      return fetch(`${process.env.REACT_APP_END_POINT_URL}/questions/${questionid}/offers`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json'
        },
        })
        .then(res => res.json())
        .then(async res => {
          const offers = res.offers;
          const tutorInfo = await Promise.all(offers.map(offer => fetch(`http://localhost:4000/users/${offer.tutor}`, {
            method: 'GET',
              headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
              },
              })
              .then(res => res.json())
              .catch(err => console.log(err))));
          dispatch(updateTutors(tutorInfo))
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






