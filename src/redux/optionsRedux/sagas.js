import { put, takeLatest } from 'redux-saga/effects';
import * as Types from './types';
import * as Actions from './actions'
import Geocoder from 'react-native-geocoder'
import Geolocation from 'react-native-geolocation-service'

function* fetchLocationAsync() {
  try {
    var userLocation = null
    Geolocation.getCurrentPosition(position => {
      Geocoder.geocodePosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
        .then(res => {
          userLocation = {
            address: res[0].formattedAddress.replace('Unnamed Road, ', ''),
            coords: res[0].position
          }
          console.log("function*fetchLocationAsync -> userLocation", userLocation)
        })
        .catch(err => console.log(err))
    }, error => {
      console.log(error)
    })
    yield put({ type: Types.FETCH_LOCATION_SUCCEEDED, payload: { location: userLocation } })
  } catch (error) {
    console.log("function*fetchLocationAsync -> error", error)
    yield put({ type: Types.FETCH_LOCATION_FAILED, payload: { error } })
  }
}

export const watchOptionsSaga = [
  takeLatest(Types.FETCH_LOCATION, fetchLocationAsync)
]