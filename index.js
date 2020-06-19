import React from 'react'
import { Navigation } from "react-native-navigation"
import messaging from '@react-native-firebase/messaging'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './src/redux/store'
import Loading from './src/components/Loading'

import SideMenu from './src/components/Menu/SideMenu'

import SplashScreen from "./src/screens/SplashScreen"
import GetStartedScreen from './src/screens/GetStartedScreen'
import HomeScreen from "./src/screens/HomeScreen"
import AuthScreen from './src/screens/AuthScreen'

import OptionsModal from './src/components/Home/OptionsModal'
import StationListModal from './src/components/Home/StationListModal'
import FilterServiceModal from './src/components/Home/FilterServiceModal'
import StationModal from './src/components/Home/StationModal'
import OrderListModal from './src/components/Home/OrderListModal'
import OrderDetailModal from './src/components/Home/OrderDetailModal'
import UpdateProfile from './src/components/Profile/UpdateProfile'
import SearchLocationModal from './src/components/Home/SearchLocationModal'

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

Navigation.registerComponent(
  'GetStartedScreen',
  () => ReduxProvider(GetStartedScreen),
  () => GetStartedScreen,
);

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
  'OptionsModal',
  () => ReduxProvider(OptionsModal),
  () => OptionsModal,
);

Navigation.registerComponent(
  'StationListModal',
  () => ReduxProvider(StationListModal),
  () => StationListModal,
);

Navigation.registerComponent(
  'FilterServiceModal',
  () => ReduxProvider(FilterServiceModal),
  () => FilterServiceModal,
);

Navigation.registerComponent(
  'StationModal',
  () => ReduxProvider(StationModal),
  () => StationModal,
);

Navigation.registerComponent(
  'OrderListModal',
  () => ReduxProvider(OrderListModal),
  () => OrderListModal,
);

Navigation.registerComponent(
  'OrderDetailModal',
  () => ReduxProvider(OrderDetailModal),
  () => OrderDetailModal,
);

Navigation.registerComponent(
  'SearchLocationModal',
  () => ReduxProvider(SearchLocationModal),
  () => SearchLocationModal,
);
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