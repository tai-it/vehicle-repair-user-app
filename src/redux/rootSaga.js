import { all } from 'redux-saga/effects';
import { watchAuthSaga } from './authRedux/sagas';

export default function* rootSaga() {
  yield all([
    ...watchAuthSaga,
  ]);
}