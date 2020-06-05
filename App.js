import React, { useEffect, Component } from 'react'
import { fcmService } from './src/configs/notification/FCMService'
import { localNotificationService } from './src/configs/notification/LocalNotificationService'
import { View, Text } from 'react-native'

// export default function App() {

//   useEffect(() => {
//     fcmService.register(onRegister, onNotification, onOpenNotification)
//     localNotificationService.configure(onOpenNotification)

//     function onRegister(token) {
//       console.log("App -> onRegister -> token", token)
//     }

//     function onNotification(notify) {
//       const options = {
//         playSound: false,
//         soundName: "notification_sound.mp3"
//       }
//       localNotificationService.showNotification(
//         0,
//         notify.title,
//         notify.body,
//         notify,
//         options
//       )
//     }

//     function onOpenNotification(notify) {
//       console.log("App -> onOpenNotification -> notify", notify)
//       alert(notify?.body)
//     }

//     return () => {
//       fcmService.unregister()
//       localNotificationService.unregister()
//     }
//   }, [])

//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Text>Hello World</Text>
//       <TouchableOpacity>
//         <Text>Button</Text>
//       </TouchableOpacity>
//     </View>
//   )
// }

export default class App extends Component {

  componentDidMount() {
    fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification)
    localNotificationService.configure(this.onOpenNotification)
  }

  onRegister = (token) => {
    console.log("App -> onRegister -> token", token)
  }

  onNotification = (notify) => {
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

  onOpenNotification = (notify) => {
    console.log("App -> onOpenNotification -> notify", notify)
    alert(notify?.body)
  }

  componentWillUnmount() {
    fcmService.unregister()
    localNotificationService.unregister()
  }

  render() {
    return (
      <View>
        <Text>Hello</Text>
      </View>
    )
  }
}