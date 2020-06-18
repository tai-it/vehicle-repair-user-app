import { all } from 'redux-saga/effects';
import { watchAuthSaga } from './authRedux/sagas';
import { watchOptionsSaga } from './optionsRedux/sagas'

export default function* rootSaga() {
  yield all([
    ...watchAuthSaga,
    ...watchOptionsSaga
  ]);
}