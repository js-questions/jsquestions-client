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

const reducers = combineReducers({
  user
});

export default reducers;