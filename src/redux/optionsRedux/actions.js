import * as Types from './types'

export const changeVehicle = vehicle => {
  return {
    type: Types.CHANGE_VEHICLE,
    payload: vehicle
  }
}

export const changeServices = services => {
  return {
    type: Types.CHANGE_SELECTED_SERVICES,
    payload: services
  }
}

export const changeAmbulatory = option => {
  return {
    type: Types.CHANGE_AMBULATORY_STATUS,
    payload: option
  }
}

export const fetchLocation = () => {
  return {
    type: Types.FETCH_LOCATION
  }
}

export const changeLocation = location => {
  return {
    type: Types.CHANGE_LOCATION,
    payload: location
  }
}

export const fetchServices = () => {
  return {
    type: Types.FETCH_SERVICES_REQUEST
  }
}

export const fetchStations = () => {
  return {
    type: Types.FETCH_STATIONS_REQUEST
  }
}