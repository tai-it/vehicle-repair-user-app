import { combineReducers } from 'redux';
import authReducer from './authRedux/reducer'
import appReducer from './appRedux/reducer'
import optionsReducer from './optionsRedux/reducer'

const reducers = combineReducers({
  auth: authReducer,
  app: appReducer,
  options: optionsReducer
});

export default reducers;