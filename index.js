import React from 'react'
import { Navigation } from "react-native-navigation"
import messaging from '@react-native-firebase/messaging'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './src/redux/store'
import Loading from './src/components/Loading'

import SideMenu from './src/components/Menu/SideMenu'

import SplashScreen from "./src/screens/SplashScreen"
import HomeScreen from "./src/screens/HomeScreen"
import AuthScreen from './src/screens/AuthScreen'

// TEST SCREENS
import FixerOrderList from './src/screens/Test/FixerOrderList'
// 

import StationList from './src/components/Home/StationList'
import StationModal from './src/components/Home/StationModal'
import UpdateProfile from './src/components/Profile/UpdateProfile'

ReduxProvider = Component => {
  return props => (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <Component {...props} />
      </PersistGate>
    </Provider>
  );
};

// Side Menu
Navigation.registerComponent(
  'SideMenu',
  () => ReduxProvider(SideMenu),
  () => SideMenu,
);
// 

// Screens
Navigation.registerComponent(
  'SplashScreen',
  () => ReduxProvider(SplashScreen),
  () => SplashScreen,
);
// 

Navigation.registerComponent(
  'AuthScreen',
  () => ReduxProvider(AuthScreen),
  () => AuthScreen,
);


Navigation.registerComponent(
  'HomeScreen',
  () => ReduxProvider(HomeScreen),
  () => HomeScreen,
);
// 

// Addtional Component
Navigation.registerComponent(
  'UpdateProfile',
  () => ReduxProvider(UpdateProfile),
  () => UpdateProfile,
);
// 

// Modals
Navigation.registerComponent(
  'StationListModal',
  () => ReduxProvider(StationList),
  () => StationList,
);

Navigation.registerComponent(
  'StationModal',
  () => ReduxProvider(StationModal),
  () => StationModal,
);
//

//  TEST SCREENS
Navigation.registerComponent('FixerOrderList', () => FixerOrderList);

// 

console.disableYellowBox = true;

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log("RemoteMessage handled in background: ", remoteMessage)
})

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'SplashScreen',
      },
    },
  });
});