import { all } from 'redux-saga/effects';
import { watchAuthSaga } from './authRedux/sagas';
import { watchOptionsSaga } from './optionsRedux/sagas'
import { watchOrderSaga } from './orderRedux/sagas'
import { watchNotifySaga } from './notifyRedux/sagas'

export default function* rootSaga() {
  yield all([
    ...watchAuthSaga,
    ...watchOptionsSaga,
    ...watchOrderSaga,
    ...watchNotifySaga
  ]);
}