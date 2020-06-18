import { put, takeLatest } from 'redux-saga/effects';
import * as Types from './types';
import { store } from '../store'
import callApi from '../../utils/apiCaller'
import { getDistance } from 'geolib'

function* fetchServicesAsync() {
  try {
    const vehicle = store.getState().options.vehicle
    const response = yield callApi(`services/vehicle=${vehicle}`)
    const services = response.data
    yield put({ type: Types.FETCH_SERVICES_SUCCEEDED, payload: services })
  } catch (error) {
    yield put({ type: Types.FETCH_SERVICES_FAILED, payload: error?.message || error })
  }
}

function* fetchStationsAsync() {
  try {
    const { vehicle, userLocation: { coords } } = store.getState().options
    const response = yield callApi(`stations?vehicle=${vehicle}`)
    const stations = response.data.sources
    stations.forEach(station => {
      Object.assign(station, {
        distance: getDistance({
          latitude: coords.lat,
          longitude: coords.lng
        }, {
          latitude: station.latitude,
          longitude: station.longitude
        })
      })
    })
    yield put({ type: Types.FETCH_STATIONS_SUCCEEDED, payload: stations })
  } catch (error) {
    yield put({ type: Types.FETCH_STATIONS_FAILED, payload: error?.message || error })
  }
}

export const watchOptionsSaga = [
  takeLatest(Types.FETCH_SERVICES_REQUEST, fetchServicesAsync),
  takeLatest(Types.FETCH_STATIONS_REQUEST, fetchStationsAsync)
]