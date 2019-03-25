import { combineReducers } from 'redux';
import jwt_decode from 'jwt-decode';

const questions = (state = [], action) => {
  switch(action.type) {
    case 'ALL_QUESTIONS_SUCCESS':
    console.log('action.data');
      return action.data;
    case 'ALL_QUESTIONS_FAILURE':
      return action.error;
    default:
      return state;
  }
}

const user = (state = {}, action) => {
  switch(action.type) {
    case 'SET_TOKEN':
      const decoded = jwt_decode(action.token);
      console.log("HERE", decoded)
      return decoded;
    case 'LOGOUT':
      return {};
    default:
      return state;
  }
}

const offers = (state = [], action) => {
  switch(action.type) {
    case 'REQUEST_OFFERS':
      return [ ...state ];
    case 'UPDATE_OFFERS':
      return action.offers; // check that the offers are always up to date
    case 'REJECT_OFFER':
      let offers = state.filter((offer => offer.offer_id !== action.id));
      return offers;
    default:
      return state;
  }
}

const tutors = (state = [], action) => {
  switch(action.type) {
    case 'UPDATE_TUTORS':
      return [...state, action.tutor]
    default:
      return state;
  }
}

const question = (state = [], action) => {
  switch(action.type) {
    case 'UPDATE_QUESTION':
      return action.question;
    case 'CHATROOM_QUESTION':
      return action.question;
    default:
      return state;
  }
}

const reducers = combineReducers({
  user,
  question,
  questions,
  offers,
  tutors
});

export default reducers;