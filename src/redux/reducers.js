import { combineReducers } from 'redux';
import authReducer from './authRedux/reducer'
import appReducer from './appRedux/reducer'
import optionsReducer from './optionsRedux/reducer'
import notifyReducer from './notifyRedux/reducer'

const reducers = combineReducers({
  auth: authReducer,
  app: appReducer,
  options: optionsReducer,
  notify: notifyReducer
});

export default reducers;