import React from 'react';
import { Colors } from './../components/styles';
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';

//screens
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import Welcome from './../screens/Welcome';
import Splash from './../screens/Splash';
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';
import CreatePost from '../screens/CreatePost';
import CreatePoll from '../screens/CreatePoll';
import TabNav from './TabNav';
import PostView from './../screens/PostView';
import FeedViews from '../screens/FeedViews';
import FlagPost from '../screens/FlagPost';
import EllipsisMenu from '../components/EllipsisMenu';
import TagSelection from '../screens/TagSelection';
const Stack = createStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={({ route, navigation }) => ({
        gestureEnabled: true,
        headerShown: false,
        headerTransparent: true,
      })}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="TabNav" component={TabNav} />
      {/* <Stack.Screen name="Profile" component={Profile} /> */}
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Create Post" component={CreatePost} />
      <Stack.Screen name="Create Poll" component={CreatePoll} />
      <Stack.Screen name="Post View" component={PostView} />
      <Stack.Screen name="Feed Views" component={FeedViews} />
      <Stack.Screen name="Flag Post" component={FlagPost} />
      <Stack.Screen name="Menu" component={EllipsisMenu} />

      <Stack.Screen name="TagSelection" component={TagSelection} />
    </Stack.Navigator>
  );
};

export default RootStack;
