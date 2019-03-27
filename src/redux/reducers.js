import { combineReducers } from 'redux';
import jwt_decode from 'jwt-decode';

const user = (state = {}, action) => {
  switch(action.type) {
    case 'SET_TOKEN':
      const decoded = jwt_decode(action.token);
      return {
        ...decoded,
        ...state,
      };
    case 'LOGOUT':
      return {};
    case 'UPDATE_KARMA':
      let updated = {
        ...state,
        karma: state.karma + action.karma
      }
      return updated;
    default:
      return state;
  }
}

const users = (state = [], action) => {
  switch(action.type) {
    case 'SET_USERS':
      return action.users;
    case 'SET_USER':
      // If the user is already in the Store...
      if ((state.filter(user => user.user_id === action.user.user_id)).length) {
        return state.map(user => {
          if (user.user_id === action.user.user_id) {
            return action.user;
          } else {
            return user;
          }
        });
      } else {
        return [ ...state, action.user ]
      }
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
    case 'UPDATE_OFFER':
      return [ ...state, action.offer ]
    case 'REJECT_OFFER':
      let offers = state.filter((offer => offer.offer_id !== action.id));
      return offers;
    default:
      return state;
  }
}

const questions = (state = [], action) => {
  switch(action.type) {
    case 'UPDATE_QUESTIONS':
      return action.questions;
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
  users,
  question,
  questions,
  offers,
});

export default reducers;