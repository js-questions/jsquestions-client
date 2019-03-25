import { combineReducers } from 'redux';
import jwt_decode from 'jwt-decode';

const user = (state = {}, action) => {
  switch(action.type) {
    case 'SET_TOKEN':
      const decoded = jwt_decode(action.token);
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
  offers,
  tutors
});

export default reducers;