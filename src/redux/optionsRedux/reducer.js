import * as Types from './types'
import vehicle from '../../constants/vehicle'

const initState = {
  vehicle: vehicle.motobike,
  services: [],
  userLocation: {
    address: '',
    coords: {
      lat: 16.068,
      lng: 108.212
    }
  },
  serviceName: 'Chọn loại dịch vụ',
  useAmbulatory: false
}

export default optionsReducer = (state = initState, action) => {
  switch (action.type) {
    case Types.CHANGE_VEHICLE:
      return {
        ...state,
        vehicle: action.payload
      }
    case Types.CHANGE_SERVICE:
      return {
        ...state,
        serviceName: action.payload
      }
    case Types.CHANGE_AMBULATORY:
      return {
        ...state,
        useAmbulatory: action.payload
      }
    case Types.CHANGE_LOCATION:
      return {
        ...state,
        userLocation: action.payload
      }
    case Types.FETCH_LOCATION_SUCCEEDED:
      console.log("Fetch location success");
      return {
        ...state,
        userLocation: action.payload.location
      }
    case Types.FETCH_LOCATION_FAILED:
      console.log("Fetch location failed");
      return state;
    default:
      return state;
  }
}