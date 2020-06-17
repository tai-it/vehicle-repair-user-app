import * as Types from './types'

export const changeVehicle = vehicle => {
  return {
    type: Types.CHANGE_VEHICLE,
    payload: vehicle
  }
}

export const changeService = service => {
  return {
    type: Types.CHANGE_SERVICE,
    payload: service
  }
}

export const changeAmbulatory = option => {
  return {
    type: Types.CHANGE_AMBULATORY,
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