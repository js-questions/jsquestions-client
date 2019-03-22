import { combineReducers } from 'redux';

const dummyReducer = (state = [], action) => {
  switch(action.type) {
    default:
      return state;
  }
}

const reducers = combineReducers({
  dummyReducer
});

export default reducers;