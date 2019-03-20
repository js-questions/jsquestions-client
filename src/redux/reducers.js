import { combineReducers } from 'redux';
import jwt_decode from 'jwt-decode';

const user = (state = [], action) => {
  switch(action.type) {
    case 'SET_TOKEN':
      const decoded = jwt_decode(action.token);
      return decoded;
    case 'LOGOUT':
      return state;    
    default:
      return state;
  }
}

const offers = (state = [], action) => {
  switch(action.type) {
    case 'REQUEST_OFFERS':
      return [ ...state ];
    case 'UPDATE_OFFERS':
      return action.offers;
    default:
      return state;
  }
}

const tutors = (state = {}, action) => {
  switch(action.type) {
    case 'UPDATE_TUTORS':
      return action.tutors;
    default:
      return state;
  }
}

const question = (state = [], action) => {
  switch(action.type) {
    case 'UPDATE_QUESTION':
      return action.question;
    default:
      return state;
  }
}

const reducers = combineReducers({
  user,
  question,
  offers,
  tutors
});

export default reducers;