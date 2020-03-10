import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
import reducers from './reducers';
import { AsyncStorage } from 'react-native';

const persistConfig = {
  key: 'suaxe4_0',
  storage: AsyncStorage,
  whitelist: ['auth', 'app'],
};

const middleware = [];
const enhancers = [];

/* ------------- Saga Middleware ------------- */
const sagaMiddleware = createSagaMiddleware();
middleware.push(sagaMiddleware);

/* ------------- Assemble Middleware ------------- */
enhancers.push(applyMiddleware(...middleware));

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = createStore(persistedReducer, compose(...enhancers));
export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);