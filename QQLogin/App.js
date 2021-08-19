import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';
import { MenuProvider } from 'react-native-popup-menu';

// Nav
import RootStack from './navigators/RootStack';
import TabNav from './navigators/TabNav';
import CreatePost from './screens/CreatePost';
import PostView from './screens/PostView';
import FlagPost from './screens/FlagPost';
import EllipsisMenu from './components/EllipsisMenu';
import ChatRoom from './screens/ChatRoom';
import ChatRoomEllipsis from './components/ChatRoomEllipsis';

import TagSelection from './screens/TagSelection';
import Welcome from './screens/Welcome';
import Map from './screens/Map';
import Signup from './screens/Signup';
import UserInfo from './screens/UserInfo'; // import { StackActions } from '@react-navigation/native';
import Notifications from './screens/Notifications';
import TagModal from './components/TagModal';
const Stack = createStackNavigator();

export default function App() {
  return (
    // <TagModal />
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="RootStack"
          screenOptions={({ route, navigation }) => ({
            headerShown: false,
          })}
        >
          <Stack.Screen name="RootStack" component={RootStack} />
          <Stack.Screen name="TabNav" component={TabNav} />
          <Stack.Screen name="Create Post" component={CreatePost} />
          <Stack.Screen name="Post View" component={PostView} />
          <Stack.Screen name="Flag Post" component={FlagPost} />
          <Stack.Screen name="Menu" component={EllipsisMenu} />
          <Stack.Screen name="TagSelection" component={TagSelection} />
          <Stack.Screen name="Map" component={Map} />
          <Stack.Screen name="Chat" component={ChatRoom} />
          <Stack.Screen name="Chat Ellipsis" component={ChatRoomEllipsis} />

          <Stack.Screen name="TagModal" component={TagModal} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
