import { store } from '../redux/store'

export const APP_COLOR = store.getState()?.app?.color || '#ff6666'