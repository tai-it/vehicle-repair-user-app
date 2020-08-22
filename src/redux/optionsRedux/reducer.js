import * as Types from './types'
import vehicle from '../../constants/vehicle'

const initState = {
  fetchingServices: false,
  fetchingStations: false,
  error: '',
  vehicle: vehicle.motorbike,
  services: [], // string
  pageIndex: 1,
  hasNextPage: false,
  stations: [],
  selectedServices: [], // string
  useAmbulatory: false,
  userLocation: {
    address: '',
    coords: {
      lat: 16.068,
      lng: 108.212
    }
  }
}

export default optionsReducer = (state = initState, action) => {
  switch (action.type) {
    case Types.CHANGE_VEHICLE:
      return {
        ...state,
        vehicle: action.payload
      }
    case Types.CHANGE_SELECTED_SERVICES:
      return {
        ...state,
        selectedServices: action.payload
      }
    case Types.CHANGE_AMBULATORY_STATUS:
      return {
        ...state,
        useAmbulatory: action.payload
      }
    case Types.CHANGE_LOCATION:
      return {
        ...state,
        userLocation: action.payload
      }
    case Types.FETCH_SERVICES_REQUEST:
      return {
        ...state,
        fetchingServices: true,
        services: []
      }
    case Types.FETCH_SERVICES_SUCCEEDED:
      return {
        ...state,
        fetchingServices: false,
        services: action.payload
      }
    case Types.FETCH_SERVICES_FAILED:
      return {
        ...state,
        fetchingServices: false,
        error: action.payload
      }
    case Types.FETCH_STATIONS_REQUEST:
      return {
        ...state,
        fetchingStations: true
      }
    case Types.FETCH_STATIONS_SUCCEEDED:
      return {
        ...state,
        fetchingStations: false,
        pageIndex: action.payload.data.pageIndex,
        hasNextPage: action.payload.data.hasNextPage,
        stations: action.payload.data.sources
      }
    case Types.FETCH_STATIONS_FAILED:
      return {
        ...state,
        fetchingStations: false,
        error: action.payload
      }
    default:
      return state;
  }
}