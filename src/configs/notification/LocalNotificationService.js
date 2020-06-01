import PushNotification from 'react-native-push-notification'

class LocalNotificationService {

  configure = (onOpenNotification) => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log("LocalNotificationService -> configure -> token", token)
      },
      onNotification: function (notification) {
        if (!notification?.data) {
          return
        }
        notification.userInteraction = true
        onOpenNotification(notification.data)
      },
      popInitialNotification: true,
    })
  }

  unregister = () => {
    PushNotification.unregister()
  }

  showNotification = (id, title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      ...this.buildAndroidNotification(id, title, message, data, options),
      title: title || '',
      message: message || '',
      playSound: options.playSound || false,
      soundName: options.soundName || "default",
      userInteraction: false
    })
  }

  buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      id: id,
      autoCancel: true,
      largeIcon: options.largeIcon || 'ic_launcher',
      smallIcon: options.smallIcon || 'ic_notification',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || 'high',
      importance: options.importance || 'high',
      data: data
    }
  }

  cancelAllLocalNotifications = () => {
    PushNotification.cancelAllLocalNotifications()
  }

  removeDeliveredNotificationByID = (notificationId) => {
    PushNotification.removeDeliveredNotificationByID(notificationId)
  }
}

export const localNotificationService = new LocalNotificationService()