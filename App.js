import React, { useEffect } from 'react'
import { fcmService } from './src/configs/notification/FCMService'
import { localNotificationService } from './src/configs/notification/LocalNotificationService'
import { View, Text, TouchableOpacity } from 'react-native'

export default function App() {

  useEffect(() => {
    fcmService.register(onRegister, onNotification, onOpenNotification)
    localNotificationService.configure(onOpenNotification)

    function onRegister(token) {
      console.log("App -> onRegister -> token", token)
    }

    function onNotification(notify) {
      const options = {
        playSound: false,
        soundName: "notification_sound.mp3"
      }
      localNotificationService.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options
      )
    }

    function onOpenNotification(notify) {
      console.log("App -> onOpenNotification -> notify", notify)
      alert(notify?.body)
    }

    return () => {
      fcmService.unregister()
      localNotificationService.unregister()
    }
  }, [])

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Hello World</Text>
      <TouchableOpacity>
        <Text>Button</Text>
      </TouchableOpacity>
    </View>
  )
}