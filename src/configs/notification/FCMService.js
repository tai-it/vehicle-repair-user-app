import messaging from '@react-native-firebase/messaging';

class FCMService {

  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister)
    this.createNotificationListeners(onRegister, onNotification, onOpenNotification)
  }

  checkPermission = (onRegister) => {
    messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          this.getToken(onRegister)
        } else {
          this.requestPermission(onRegister)
        }
      })
      .catch(error => {
        console.log("[FCMService] - Permission rejected", error)
      })
  }

  getToken = (onRegister) => {
    messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          onRegister(fcmToken)
        } else {
          console.log("[FCMService] - User does not have device token");
        }
      })
      .catch(error => {
        console.log("[FCMService] - Get token rejected", error);
      })
  }

  requestPermission = (onRegister) => {
    messaging().requestPermission()
      .then(() => {
        this.getToken(onRegister)
      })
      .catch(error => {
        console.log("[FCMService] - Request permission rejected");
      })
  }

  deleteToken = () => {
    messaging().deleteToken()
      .catch(error => {
        console.log("[FCMService] - Delete token error", error);
      })
  }

  createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {
    // When the app is running but in the background
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        const notification = remoteMessage.notification
        onOpenNotification(notification)
      }
    });

    // When the app is opened from a quit state 
    messaging().getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const notification = remoteMessage.notification
          onOpenNotification(notification)
        }
      });

    // Foreground state messages
    this.messageListener = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        const notification = remoteMessage.notification
        onNotification(notification)
      }
    })

    // Trigged when have new token
    messaging().onTokenRefresh(fcmToken => {
      onRegister(fcmToken)
    })
  }

  unregister = () => {
    this.messageListener()
  }
}

export const fcmService = new FCMService()