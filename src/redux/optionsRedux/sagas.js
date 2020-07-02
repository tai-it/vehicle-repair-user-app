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

function* fetchStationsAsync({ payload }) {
  try {
    const { vehicle, stations, userLocation: { coords } } = store.getState().options
    const response = yield callApi(`stations?vehicle=${vehicle}&limit=20&offset=${payload}`)
    const data = response.data
    data.sources.forEach(station => {
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
    if (payload > 1) {
      data.sources.unshift(...stations)
    }
    yield put({ type: Types.FETCH_STATIONS_SUCCEEDED, payload: { data } })
  } catch (error) {
    yield put({ type: Types.FETCH_STATIONS_FAILED, payload: error?.message || error })
  }
}

export const watchOptionsSaga = [
  takeLatest(Types.FETCH_SERVICES_REQUEST, fetchServicesAsync),
  takeLatest(Types.FETCH_STATIONS_REQUEST, fetchStationsAsync)
]