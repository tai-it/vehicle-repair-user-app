import { Navigation } from "react-native-navigation";
import { modalOptions } from "../configs/navigation"

export default class Navigator {

  static setRoot(appRoot) {
    Navigation.setRoot({
      root: appRoot
    })
  }

  static showModal(componentName, props = {}) {
    Navigation.showModal({
      component: {
        name: componentName,
        passProps: props,
        options: modalOptions
      }
    })
  }

  static showOverlay(props = {}) {
    Navigation.showOverlay({
      component: {
        name: 'CustomAlert',
        passProps: props
      }
    })
  }

  static toggleSideMenu(componentId, isOpen = true) {
    Navigation.mergeOptions(componentId, {
      sideMenu: {
        left: {
          visible: isOpen,
        },
      },
    })
  }

  static dismissModal(componentId) {
    Navigation.dismissModal(componentId)
  }

  static dismissOverlay(componentId) {
    Navigation.dismissOverlay(componentId)
  }

  static dismissAllModals() {
    Navigation.dismissAllModals()
  }
}