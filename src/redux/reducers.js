import { combineReducers } from 'redux';
import jwt_decode from 'jwt-decode';

const user = (state = [], action) => {
  switch(action.type) {
    case 'SET_TOKEN':
      let decoded = jwt_decode(action.token)
      return decoded
    default:
      return state;
  }
}

const reducers = combineReducers({
  user
});

export default reducers;