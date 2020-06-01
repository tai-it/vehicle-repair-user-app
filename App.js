import React, { useEffect } from 'react'
import { fcmService } from './src/configs/notification/FCMService'
import { localNotificationService } from './src/configs/notification/LocalNotificationService'
import { View, Text, TouchableOpacity } from 'react-native'

export default function App() {

  useEffect(() => {
    fcmService.register(onRegister, onNotification, onOpenNotification)
    localNotificationService.configure(onNotification)

    function onRegister(token) {
      console.log("onRegister -> token", token)
    }

    function onNotification(notify) {
      console.log("onNotification -> notify", notify)
      const options = {
        playSound: true
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
      console.log("onOpenNotification -> notify", notify)
      alert(notify.body)
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