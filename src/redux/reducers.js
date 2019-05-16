import { combineReducers } from 'redux';

const user = (state = {}, action) => { // me, as the user
  switch(action.type) {
    case 'SET_USER':
      return {
        ...action.user,
        ...state
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

const users = (state = [], action) => { // all the users
  switch(action.type) {
    case 'SET_USERS':
      return action.users;
    case 'ADD_NEW_USER':
      // If the user is already in the Store...
      if ((state.filter(user => user.user_id === action.user.user_id)).length) {
        return state.map(user => {
          if (user.user_id === action.user.user_id) {
            return { ...user, ...action.user };
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

const questions = (state = [], action) => { // questions that you've asked
  switch(action.type) {
    case 'UPDATE_QUESTIONS': // updates questions after fetching from database
      return action.questions;
    case 'UPDATE_QUESTION_STATUS': // updates the question answered status in the array of questions, should be combined eventually with question as a single source of truth
      let questions = [...state]
      const id = action.question.question_id;
      for (let i=0; i < questions.length; i++) {
        if (questions[i].question_id === id) {
          questions[i].answered= true;
        }
      }
      return questions;
    default:
      return state;
  }
}

const question = (state = [], action) => { // for now, sets a specific question (ex: for the tutor notification) - can be refactored
  switch(action.type) {
    case 'UPDATE_QUESTION':
      return action.question;
    default:
      return state;
  }
}

const offers = (state = [], action) => {
  switch(action.type) {
    case 'UPDATE_OFFERS':
      return action.offers; // fetching latest offers from database and storing up to date version
    case 'UPDATE_OFFER':
      return [ ...state, action.offer ]
    case 'REJECT_OFFER':
      let offers = state.filter((offer => offer.offer_id !== action.id));
      return offers;
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