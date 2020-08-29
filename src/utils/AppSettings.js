import { store } from '../redux/store'

export const APP_COLOR = store.getState()?.app?.isDarkMode ? '#323235' : store.getState()?.app?.color