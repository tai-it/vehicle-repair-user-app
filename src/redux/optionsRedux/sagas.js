import { put, takeLatest, call } from 'redux-saga/effects';
import * as Types from './types';
import * as Actions from './actions'
import Geocoder from 'react-native-geocoder'
import Geolocation from 'react-native-geolocation-service'

async function getCurrentLocation() {
  const position = await Geolocation.getCurrentPosition(pos => console.log(pos))
  console.log("function*getCurrentLocation -> position", position)
  // Geocoder.geocodePosition({
  //   lat: position.coords.latitude,
  //   lng: position.coords.longitude
  // })
  //   .then(res => {
  //     let location = {
  //       address: res[0].formattedAddress.replace('Unnamed Road, ', ''),
  //       coords: res[0].position
  //     }
  //     console.log("function*getCurrentLocation -> location", location)
  //     return location
  //   })
  //   .catch(err => console.log(err))

}

function* fetchLocationAsync() {
  try {
    const location = yield getCurrentLocation()
    console.log("function*fetchLocationAsync -> location", location)
    yield put({ type: Types.FETCH_LOCATION_SUCCEEDED, payload: { location } })
  } catch (error) {
    console.log("function*fetchLocationAsync -> error", error)
    yield put({ type: Types.FETCH_LOCATION_FAILED, payload: { error } })
  }
}

export const watchOptionsSaga = [
  takeLatest(Types.FETCH_LOCATION, fetchLocationAsync)
]