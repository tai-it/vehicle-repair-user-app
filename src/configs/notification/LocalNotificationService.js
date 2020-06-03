import PushNotification from 'react-native-push-notification'

class LocalNotificationService {

  configure = (onOpenNotification) => {
    PushNotification.configure({
      onRegister: (token) => {
        console.log("LocalNotificationService -> configure -> token", token)
      },
      onNotification: (notification) => {
        console.log("LocalNotificationService -> configure -> notification", notification)
        notification.userInteraction = true
        onOpenNotification(notification)
      },
      popInitialNotification: true,
    })
  }

  unregister = () => {
    PushNotification.unregister()
  }

  showNotification = (id, title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      id: id,
      title: title || '',
      message: message || '',
      autoCancel: true,
      largeIcon: options.largeIcon || 'ic_launcher',
      smallIcon: options.smallIcon || 'ic_notification',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 2000,
      playSound: options.playSound || false,
      soundName: options.soundName || "default",
      sound: options.soundName || "default",
      priority: options.priority || 'high',
      importance: options.importance || 'high',
      data: data,
      userInteraction: false
    })
  }

  cancelAllLocalNotifications = () => {
    PushNotification.cancelAllLocalNotifications()
  }

  removeDeliveredNotificationByID = (notificationId) => {
    PushNotification.removeDeliveredNotificationByID(notificationId)
  }
}

export const localNotificationService = new LocalNotificationService()